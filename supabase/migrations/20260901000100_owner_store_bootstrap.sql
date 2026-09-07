-- Sprint 2 / M1 E3-04 Owner creates store.
--
-- Backend-owned bootstrap command for an authenticated user creating their first
-- organization/store boundary. The command is idempotent by operation_id and is
-- intentionally executable only by the Supabase service_role used by NestJS.

create table public.processed_operations (
                                           operation_id uuid primary key,
                                           actor_user_id uuid not null references public.profiles(id) on delete cascade,
                                           operation_type text not null check (char_length(btrim(operation_type)) between 1 and 120),
                                           request_payload jsonb not null,
                                           response_payload jsonb not null,
                                           organization_id uuid references public.organizations(id) on delete cascade,
                                           store_id uuid,
                                           created_at timestamptz not null default now(),
                                           constraint processed_operations_store_tenant_fk
                                             foreign key (store_id, organization_id)
                                               references public.stores(id, organization_id)
                                               on delete cascade,
                                           constraint processed_operations_store_requires_organization
                                             check (store_id is null or organization_id is not null)
);

comment on table public.processed_operations is
  'Idempotency ledger for backend-owned commands. Reusing an operation_id with a different request is rejected.';

create index processed_operations_actor_created_at_idx
  on public.processed_operations (actor_user_id, created_at desc);

alter table public.processed_operations enable row level security;
alter table public.processed_operations force row level security;

revoke all on table public.processed_operations from anon, authenticated;

create or replace function public.bootstrap_owner_store(
  p_operation_id uuid,
  p_actor_user_id uuid,
  p_organization_name text,
  p_store_name text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
normalized_organization_name text := btrim(p_organization_name);
  normalized_store_name text := btrim(p_store_name);
  request_payload jsonb;
  existing_operation public.processed_operations%rowtype;
  owner_role_id uuid;
  created_organization public.organizations%rowtype;
  created_store public.stores%rowtype;
  created_membership public.store_memberships%rowtype;
  result jsonb;
begin
  if p_operation_id is null then
    raise exception using errcode = '22023', message = 'operation_id is required';
end if;

  if p_actor_user_id is null then
    raise exception using errcode = '22023', message = 'actor_user_id is required';
end if;

  if char_length(normalized_organization_name) not between 1 and 120 then
    raise exception using errcode = '22023', message = 'organization name must contain 1 to 120 characters';
end if;

  if char_length(normalized_store_name) not between 1 and 120 then
    raise exception using errcode = '22023', message = 'store name must contain 1 to 120 characters';
end if;

  request_payload := jsonb_build_object(
    'organizationName', normalized_organization_name,
    'storeName', normalized_store_name
  );

  -- Serialize retries for the same operation id so concurrent delivery cannot
  -- create duplicate organizations/stores before the idempotency row exists.
  perform pg_advisory_xact_lock(hashtextextended(p_operation_id::text, 0));

select *
into existing_operation
from public.processed_operations
where operation_id = p_operation_id;

if found then
    if existing_operation.actor_user_id <> p_actor_user_id
       or existing_operation.operation_type <> 'TENANCY_BOOTSTRAP_OWNER_STORE'
       or existing_operation.request_payload <> request_payload then
      raise exception using
        errcode = '23505',
        message = 'operation_id has already been used for a different command';
end if;

return existing_operation.response_payload;
end if;

  if not exists (
    select 1
    from public.profiles
    where id = p_actor_user_id
  ) then
    raise exception using errcode = '23503', message = 'authenticated user profile does not exist';
end if;

select id
into owner_role_id
from public.roles
where code = 'OWNER';

if owner_role_id is null then
    raise exception using errcode = '23503', message = 'OWNER role is not configured';
end if;

insert into public.organizations (name, created_by)
values (normalized_organization_name, p_actor_user_id)
  returning * into created_organization;

insert into public.stores (organization_id, name, created_by)
values (created_organization.id, normalized_store_name, p_actor_user_id)
  returning * into created_store;

insert into public.store_memberships (
  organization_id,
  store_id,
  user_id,
  role_id,
  status,
  created_by,
  accepted_at
)
values (
         created_organization.id,
         created_store.id,
         p_actor_user_id,
         owner_role_id,
         'ACTIVE',
         p_actor_user_id,
         now()
       )
  returning * into created_membership;

result := jsonb_build_object(
    'organization', jsonb_build_object(
      'id', created_organization.id,
      'name', created_organization.name,
      'version', created_organization.version
    ),
    'store', jsonb_build_object(
      'id', created_store.id,
      'organizationId', created_store.organization_id,
      'name', created_store.name,
      'version', created_store.version
    ),
    'membership', jsonb_build_object(
      'id', created_membership.id,
      'organizationId', created_membership.organization_id,
      'storeId', created_membership.store_id,
      'userId', created_membership.user_id,
      'role', 'OWNER',
      'status', created_membership.status,
      'version', created_membership.version
    )
  );

insert into public.processed_operations (
  operation_id,
  actor_user_id,
  operation_type,
  request_payload,
  response_payload,
  organization_id,
  store_id
)
values (
         p_operation_id,
         p_actor_user_id,
         'TENANCY_BOOTSTRAP_OWNER_STORE',
         request_payload,
         result,
         created_organization.id,
         created_store.id
       );

return result;
end;
$$;

revoke all on function public.bootstrap_owner_store(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.bootstrap_owner_store(uuid, uuid, text, text) to service_role;

comment on function public.bootstrap_owner_store(uuid, uuid, text, text) is
  'Backend-only idempotent command that creates an organization, first store, and ACTIVE OWNER membership atomically.';
