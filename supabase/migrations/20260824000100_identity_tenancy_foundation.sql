-- Sprint 2 PR2 / M1 Identity and Tenancy database foundation.
--
-- This migration intentionally establishes tenant-scoped data and read isolation
-- before the first Auth/Tenancy API write vertical slice. Authenticated clients
-- receive read access only where explicitly allowed by RLS; organization/store
-- mutations remain backend-owned commands.

create table public.profiles (
                               id uuid primary key references auth.users(id) on delete cascade,
                               display_name text,
                               created_at timestamptz not null default now(),
                               updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Application profile associated one-to-one with a Supabase Auth user.';

create table public.organizations (
                                    id uuid primary key default gen_random_uuid(),
                                    name text not null check (char_length(btrim(name)) between 1 and 120),
                                    created_by uuid not null references public.profiles(id) on delete restrict,
                                    created_at timestamptz not null default now(),
                                    updated_at timestamptz not null default now(),
                                    version bigint not null default 1 check (version > 0)
);

comment on table public.organizations is 'Top-level tenant organization. A single organization can own multiple stores.';

create table public.stores (
                             id uuid primary key default gen_random_uuid(),
                             organization_id uuid not null references public.organizations(id) on delete cascade,
                             name text not null check (char_length(btrim(name)) between 1 and 120),
                             created_by uuid not null references public.profiles(id) on delete restrict,
                             created_at timestamptz not null default now(),
                             updated_at timestamptz not null default now(),
                             version bigint not null default 1 check (version > 0),
                             unique (id, organization_id)
);

comment on table public.stores is 'Store tenant boundary used by business data and authorization.';

create index stores_organization_id_idx on public.stores (organization_id);

create table public.roles (
                            id uuid primary key default gen_random_uuid(),
                            code text not null unique check (code = upper(code)),
                            name text not null,
                            description text,
                            created_at timestamptz not null default now(),
                            updated_at timestamptz not null default now()
);

comment on table public.roles is 'Canonical application roles. Role-to-permission assignment is explicit through role_permissions.';

create table public.permissions (
                                  id uuid primary key default gen_random_uuid(),
                                  code text not null unique,
                                  description text,
                                  created_at timestamptz not null default now(),
                                  updated_at timestamptz not null default now()
);

comment on table public.permissions is 'Granular authorization permissions used by backend policies.';

create table public.role_permissions (
                                       role_id uuid not null references public.roles(id) on delete cascade,
                                       permission_id uuid not null references public.permissions(id) on delete cascade,
                                       created_at timestamptz not null default now(),
                                       primary key (role_id, permission_id)
);

comment on table public.role_permissions is 'Many-to-many mapping between canonical roles and permissions.';

create table public.store_memberships (
                                        id uuid primary key default gen_random_uuid(),
                                        organization_id uuid not null references public.organizations(id) on delete cascade,
                                        store_id uuid not null,
                                        user_id uuid not null references public.profiles(id) on delete cascade,
                                        role_id uuid not null references public.roles(id) on delete restrict,
                                        status text not null check (status in ('INVITED', 'ACTIVE', 'REVOKED')),
                                        created_by uuid not null references public.profiles(id) on delete restrict,
                                        invited_by uuid references public.profiles(id) on delete restrict,
                                        accepted_at timestamptz,
                                        revoked_at timestamptz,
                                        created_at timestamptz not null default now(),
                                        updated_at timestamptz not null default now(),
                                        version bigint not null default 1 check (version > 0),
                                        constraint store_memberships_active_acceptance_check
                                          check (status <> 'ACTIVE' or accepted_at is not null),
                                        constraint store_memberships_revocation_timestamp_check
                                          check ((status = 'REVOKED') = (revoked_at is not null)),
                                        constraint store_memberships_store_tenant_fk
                                          foreign key (store_id, organization_id)
                                            references public.stores(id, organization_id)
                                            on delete cascade,
                                        constraint store_memberships_store_user_key unique (store_id, user_id)
);

comment on table public.store_memberships is 'User membership and role within one store tenant.';

create index store_memberships_user_status_idx
  on public.store_memberships (user_id, status);

create index store_memberships_store_status_idx
  on public.store_memberships (store_id, status);

create index store_memberships_organization_idx
  on public.store_memberships (organization_id);

create index store_memberships_active_user_store_idx
  on public.store_memberships (user_id, store_id)
  where status = 'ACTIVE';

create index store_memberships_active_user_organization_idx
  on public.store_memberships (user_id, organization_id)
  where status = 'ACTIVE';

create or replace function app_private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
return new;
end;
$$;

create or replace function app_private.touch_versioned_row()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.version := old.version + 1;
return new;
end;
$$;

create or replace function app_private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
insert into public.profiles (id, display_name)
values (
         new.id,
         nullif(
           coalesce(
             new.raw_user_meta_data ->> 'display_name',
        new.raw_user_meta_data ->> 'full_name'
      ),
           ''
         )
       )
  on conflict (id) do nothing;

return new;
end;
$$;

revoke all on function app_private.touch_updated_at() from public, anon, authenticated;
revoke all on function app_private.touch_versioned_row() from public, anon, authenticated;
revoke all on function app_private.handle_new_auth_user() from public, anon, authenticated;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function app_private.touch_updated_at();

create trigger organizations_touch_version
  before update on public.organizations
  for each row execute function app_private.touch_versioned_row();

create trigger stores_touch_version
  before update on public.stores
  for each row execute function app_private.touch_versioned_row();

create trigger roles_touch_updated_at
  before update on public.roles
  for each row execute function app_private.touch_updated_at();

create trigger permissions_touch_updated_at
  before update on public.permissions
  for each row execute function app_private.touch_updated_at();

create trigger store_memberships_touch_version
  before update on public.store_memberships
  for each row execute function app_private.touch_versioned_row();

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function app_private.handle_new_auth_user();

-- Backfill profiles if this migration is applied to an environment that already
-- contains Auth users.
insert into public.profiles (id, display_name)
select
  users.id,
  nullif(
    coalesce(
      users.raw_user_meta_data ->> 'display_name',
      users.raw_user_meta_data ->> 'full_name'
    ),
    ''
  )
from auth.users as users
  on conflict (id) do nothing;

insert into public.roles (code, name, description)
values
  ('OWNER', 'Owner', 'Store owner role.'),
  ('ADMIN', 'Admin', 'Store administrator role.'),
  ('STAFF', 'Staff', 'Store staff role.'),
  ('VIEWER', 'Viewer', 'Read-oriented store role.')
  on conflict (code) do nothing;

insert into public.permissions (code, description)
values
  ('product.view', 'View products.'),
  ('product.manage', 'Create and manage products.'),
  ('price.view', 'View permitted prices.'),
  ('price.change', 'Change product prices.'),
  ('cost.view', 'View product cost information.'),
  ('sale.create', 'Create sales.'),
  ('sale.void', 'Void sales through approved reversal flows.'),
  ('payment.receive', 'Record received payments.'),
  ('inventory.view', 'View inventory.'),
  ('inventory.adjust', 'Create approved inventory adjustments.'),
  ('member.manage', 'Manage store memberships.'),
  ('report.revenue', 'View revenue reports.'),
  ('report.profit', 'View profit reports.')
  on conflict (code) do nothing;

-- The baseline defines the role catalog and permission catalog, but does not yet
-- define the exact role-to-permission matrix. role_permissions is deliberately
-- left unseeded until the authorization vertical slice specifies that matrix.

alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.organizations enable row level security;
alter table public.organizations force row level security;
alter table public.stores enable row level security;
alter table public.stores force row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.store_memberships enable row level security;
alter table public.store_memberships force row level security;

create policy profiles_select_self
on public.profiles
for select
             to authenticated
             using (id = auth.uid());

create policy profiles_update_self
on public.profiles
for update
             to authenticated
             using (id = auth.uid())
    with check (id = auth.uid());

create policy organizations_select_active_member
on public.organizations
for select
             to authenticated
             using (
             exists (
             select 1
             from public.store_memberships as membership
             where membership.organization_id = organizations.id
             and membership.user_id = auth.uid()
             and membership.status = 'ACTIVE'
             )
             );

create policy stores_select_active_member
on public.stores
for select
             to authenticated
             using (
             exists (
             select 1
             from public.store_memberships as membership
             where membership.store_id = stores.id
             and membership.user_id = auth.uid()
             and membership.status = 'ACTIVE'
             )
             );

create policy store_memberships_select_self
on public.store_memberships
for select
             to authenticated
             using (user_id = auth.uid());

create policy roles_select_authenticated
on public.roles
for select
             to authenticated
             using (true);

create policy permissions_select_authenticated
on public.permissions
for select
             to authenticated
             using (true);

create policy role_permissions_select_authenticated
on public.role_permissions
for select
             to authenticated
             using (true);

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.organizations from anon, authenticated;
revoke all on table public.stores from anon, authenticated;
revoke all on table public.roles from anon, authenticated;
revoke all on table public.permissions from anon, authenticated;
revoke all on table public.role_permissions from anon, authenticated;
revoke all on table public.store_memberships from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (display_name) on table public.profiles to authenticated;
grant select on table public.organizations to authenticated;
grant select on table public.stores to authenticated;
grant select on table public.roles to authenticated;
grant select on table public.permissions to authenticated;
grant select on table public.role_permissions to authenticated;
grant select on table public.store_memberships to authenticated;
