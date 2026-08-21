create schema if not exists app_private;

revoke all on schema app_private from anon;
revoke all on schema app_private from authenticated;

comment on schema app_private is 'Private database functions and implementation details not exposed through the Data API.';
