begin;

select plan(31);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'organizations', 'organizations table exists');
select has_table('public', 'stores', 'stores table exists');
select has_table('public', 'roles', 'roles table exists');
select has_table('public', 'permissions', 'permissions table exists');
select has_table('public', 'role_permissions', 'role_permissions table exists');
select has_table('public', 'store_memberships', 'store_memberships table exists');
select has_table('public', 'processed_operations', 'processed_operations table exists');
select is(
  has_table_privilege('authenticated', 'public.processed_operations', 'SELECT'),
  false,
  'authenticated clients cannot read the processed operation ledger'
  );
select is(
  has_function_privilege(
  'authenticated',
  'public.bootstrap_owner_store(uuid,uuid,text,text)',
  'EXECUTE'
  ),
  false,
  'authenticated clients cannot execute owner-store bootstrap directly'
  );
select is(
  has_function_privilege(
  'service_role',
  'public.bootstrap_owner_store(uuid,uuid,text,text)',
  'EXECUTE'
  ),
  true,
  'service role can execute owner-store bootstrap for the NestJS boundary'
  );

select is(
  (select count(*) from public.roles where code in ('OWNER', 'ADMIN', 'STAFF', 'VIEWER')),
  4::bigint,
  'default role catalog is seeded'
  );

select is(
  (select count(*) from public.permissions),
  13::bigint,
  'baseline permission catalog is seeded'
  );

insert into auth.users (id, email, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-0000-0000-0000000000a1', 'user-a@example.test', '{"display_name":"User A"}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-0000000000b2', 'user-b@example.test', '{"display_name":"User B"}'::jsonb, now(), now());

select is(
  (select display_name from public.profiles where id = '00000000-0000-0000-0000-0000000000a1'),
  'User A'::text,
  'auth user trigger creates an application profile'
  );

insert into public.organizations (id, name, created_by)
values
  ('10000000-0000-0000-0000-0000000000a1', 'Organization A', '00000000-0000-0000-0000-0000000000a1'),
  ('10000000-0000-0000-0000-0000000000b2', 'Organization B', '00000000-0000-0000-0000-0000000000b2');

insert into public.stores (id, organization_id, name, created_by)
values
  ('20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'Store A', '00000000-0000-0000-0000-0000000000a1'),
  ('20000000-0000-0000-0000-0000000000b2', '10000000-0000-0000-0000-0000000000b2', 'Store B', '00000000-0000-0000-0000-0000000000b2');

insert into public.store_memberships (
  id,
  organization_id,
  store_id,
  user_id,
  role_id,
  status,
  created_by,
  accepted_at
)
values
  (
    '30000000-0000-0000-0000-0000000000a1',
    '10000000-0000-0000-0000-0000000000a1',
    '20000000-0000-0000-0000-0000000000a1',
    '00000000-0000-0000-0000-0000000000a1',
    (select id from public.roles where code = 'OWNER'),
    'ACTIVE',
    '00000000-0000-0000-0000-0000000000a1',
    now()
  ),
  (
    '30000000-0000-0000-0000-0000000000b2',
    '10000000-0000-0000-0000-0000000000b2',
    '20000000-0000-0000-0000-0000000000b2',
    '00000000-0000-0000-0000-0000000000b2',
    (select id from public.roles where code = 'OWNER'),
    'ACTIVE',
    '00000000-0000-0000-0000-0000000000b2',
    now()
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select is((select count(*) from public.profiles), 1::bigint, 'user A can only read their own profile');
select is((select count(*) from public.organizations), 1::bigint, 'user A can only read their organization');
select is((select count(*) from public.stores), 1::bigint, 'user A can only read their store');
select is((select count(*) from public.store_memberships), 1::bigint, 'user A can only read their own membership');
select is((select name from public.stores), 'Store A'::text, 'user A cannot read Store B');
select is((select count(*) from public.roles), 4::bigint, 'authenticated users can read the role catalog');
select is((select count(*) from public.permissions), 13::bigint, 'authenticated users can read the permission catalog');

reset role;

update public.store_memberships
set status = 'REVOKED', revoked_at = now()
where id = '30000000-0000-0000-0000-0000000000a1';

select is(
  (select version from public.store_memberships where id = '30000000-0000-0000-0000-0000000000a1'),
  2::bigint,
  'membership updates increment the optimistic-concurrency version'
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select is((select count(*) from public.stores), 0::bigint, 'revoked user can no longer read the store');
select is((select count(*) from public.organizations), 0::bigint, 'revoked user can no longer read the organization');

reset role;


insert into auth.users (id, email, raw_user_meta_data, created_at, updated_at)
values (
         '00000000-0000-0000-0000-0000000000c3',
         'owner-c@example.test',
         '{"display_name":"Owner C"}'::jsonb,
         now(),
         now()
       );

select is(
  (
  public.bootstrap_owner_store(
  '40000000-0000-4000-8000-0000000000c3',
  '00000000-0000-0000-0000-0000000000c3',
  ' Organization C ',
  ' Store C '
  ) -> 'organization' ->> 'name'
  ),
  'Organization C'::text,
  'owner-store bootstrap normalizes and returns the organization name'
  );

select is(
  (select count(*) from public.organizations where created_by = '00000000-0000-0000-0000-0000000000c3'),
  1::bigint,
  'owner-store bootstrap creates one organization'
  );

select is(
  (
  select count(*)
  from public.stores
  where created_by = '00000000-0000-0000-0000-0000000000c3'
  ),
  1::bigint,
  'owner-store bootstrap creates one store'
  );

select is(
  (
  select count(*)
  from public.store_memberships as membership
  join public.roles as role on role.id = membership.role_id
  where membership.user_id = '00000000-0000-0000-0000-0000000000c3'
  and membership.status = 'ACTIVE'
  and role.code = 'OWNER'
  ),
  1::bigint,
  'owner-store bootstrap creates an active OWNER membership'
  );

select is(
  (
  select count(*)
  from public.processed_operations
  where operation_id = '40000000-0000-4000-8000-0000000000c3'
  ),
  1::bigint,
  'owner-store bootstrap records the processed operation'
  );

select is(
  (
  public.bootstrap_owner_store(
  '40000000-0000-4000-8000-0000000000c3',
  '00000000-0000-0000-0000-0000000000c3',
  'Organization C',
  'Store C'
  ) -> 'store' ->> 'id'
  ),
  (
  select id::text
  from public.stores
  where created_by = '00000000-0000-0000-0000-0000000000c3'
  ),
  'retrying the same operation returns the original store'
  );

select is(
  (select count(*) from public.organizations where created_by = '00000000-0000-0000-0000-0000000000c3'),
  1::bigint,
  'retrying the same operation does not create a duplicate tenant'
  );

select * from finish();
rollback;
