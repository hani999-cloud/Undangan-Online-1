create table admins(user_id uuid primary key references auth.users(id) on delete cascade);
create table greetings(id bigint generated always as identity primary key, session_id text not null check(length(session_id) between 8 and 64),
 name text not null check(length(trim(name)) between 1 and 40), message text not null check(length(trim(message)) between 1 and 200),
 hidden boolean not null default false, created_at timestamptz not null default now());
create table rsvps(id bigint generated always as identity primary key, name text not null check(length(trim(name)) between 1 and 60),
 attendance text not null check(attendance in('hadir','tidak_hadir','ragu')), guests int not null default 1 check(guests between 1 and 10),
 message text check(length(message)<=300), created_at timestamptz not null default now());
create table visits(id bigint generated always as identity primary key, session_id text not null, name text not null check(length(name)<=40), created_at timestamptz not null default now());
create function rate_limit() returns trigger language plpgsql as $$ begin
 if exists(select 1 from greetings where session_id=new.session_id and created_at>now()-interval '3 seconds') then raise exception 'Terlalu cepat, tunggu sebentar'; end if;
 new.name:=trim(new.name); new.message:=trim(new.message); return new; end $$;
create trigger t_rate before insert on greetings for each row execute function rate_limit();
alter table admins enable row level security; alter table greetings enable row level security;
alter table rsvps enable row level security; alter table visits enable row level security;
create function is_admin() returns boolean language sql security definer stable as $$ select exists(select 1 from admins where user_id=auth.uid()) $$;
create policy g_read on greetings for select using(hidden=false or is_admin());
create policy g_ins on greetings for insert with check(hidden=false);
create policy g_upd on greetings for update using(is_admin());
create policy g_del on greetings for delete using(is_admin());
create policy r_ins on rsvps for insert with check(true);
create policy r_read on rsvps for select using(is_admin());
create policy v_ins on visits for insert with check(true);
create policy v_read on visits for select using(is_admin());
create policy a_self on admins for select using(user_id=auth.uid());
alter publication supabase_realtime add table greetings, rsvps, visits;
-- Setelah membuat user admin di Authentication > Users:
-- insert into admins(user_id) select id from auth.users where email='email-pengantin@contoh.com';
