-- Sushi Picker initial schema.
-- spots: public read-only catalog. saved_places / user_settings: private per user (RLS).
-- Users are Supabase anonymous-auth users (role "authenticated", is_anonymous = true).

create table public.spots (
  id text primary key,
  name text not null,
  city text not null,
  region text not null check (region in ('SF', 'Peninsula', 'South Bay', 'East Bay', 'North Bay')),
  lat double precision not null,
  lng double precision not null,
  price_tier text not null check (price_tier in ('casual', 'mid', 'omakase')),
  style text not null check (style in ('omakase', 'nigiri bar', 'rolls', 'conveyor', 'takeout')),
  hours text,
  address text not null,
  maps_url text not null
);

create table public.saved_places (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  spot_id text not null references public.spots (id) on delete cascade,
  status text not null check (status in ('want_to_try', 'been')),
  verdict text check (verdict in ('up', 'down')),
  recommended_by text check (char_length(recommended_by) <= 60),
  note text check (char_length(note) <= 280),
  updated_at timestamptz not null default now(),
  primary key (user_id, spot_id)
);
create index saved_places_spot_id_idx on public.saved_places (spot_id);

create table public.user_settings (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  zip_code text not null check (zip_code ~ '^[0-9]{5}$'),
  lat double precision not null,
  lng double precision not null,
  updated_at timestamptz not null default now()
);

-- Server-side updated_at stamping (clients can't spoof it).
create function public.set_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger saved_places_set_updated_at before insert or update on public.saved_places
  for each row execute function public.set_updated_at();
create trigger user_settings_set_updated_at before insert or update on public.user_settings
  for each row execute function public.set_updated_at();

alter table public.spots enable row level security;
alter table public.saved_places enable row level security;
alter table public.user_settings enable row level security;

create policy "Spots are readable by everyone" on public.spots
  for select to anon, authenticated using (true);

create policy "Users manage their own saved places" on public.saved_places
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage their own settings" on public.user_settings
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Placeholder (fictional) spots. Replace with real data later.
insert into public.spots (id, name, city, region, lat, lng, price_tier, style, hours, address, maps_url) values
  ('fog-city-nigiri', 'Fog City Nigiri', 'San Francisco', 'SF', 37.7599, -122.4148, 'mid', 'nigiri bar', 'Tue–Sun 5–10pm', '101 Placeholder St, San Francisco, CA', 'https://www.google.com/maps/search/?api=1&query=37.7599,-122.4148'),
  ('little-tuna-roll-shop', 'Little Tuna Roll Shop', 'San Francisco', 'SF', 37.78, -122.465, 'casual', 'rolls', 'Daily 11am–9pm', '202 Sample Ave, San Francisco, CA', 'https://www.google.com/maps/search/?api=1&query=37.78,-122.465'),
  ('kumo-omakase-counter', 'Kumo Omakase Counter', 'San Francisco', 'SF', 37.7765, -122.4242, 'omakase', 'omakase', 'Wed–Sat 6 & 8:30pm', '303 Example Ln, San Francisco, CA', 'https://www.google.com/maps/search/?api=1&query=37.7765,-122.4242'),
  ('spinning-salmon', 'Spinning Salmon', 'San Francisco', 'SF', 37.785, -122.4294, 'casual', 'conveyor', 'Daily 11:30am–9:30pm', '404 Mockingbird Way, San Francisco, CA', 'https://www.google.com/maps/search/?api=1&query=37.785,-122.4294'),
  ('bayshore-hand-rolls', 'Bayshore Hand Rolls', 'San Mateo', 'Peninsula', 37.563, -122.3255, 'casual', 'takeout', 'Daily 11am–8pm', '505 Faux Blvd, San Mateo, CA', 'https://www.google.com/maps/search/?api=1&query=37.563,-122.3255'),
  ('redwood-rice-and-fish', 'Redwood Rice & Fish', 'Redwood City', 'Peninsula', 37.4852, -122.2364, 'mid', 'nigiri bar', 'Mon–Sat 5–9:30pm', '606 Imaginary Rd, Redwood City, CA', 'https://www.google.com/maps/search/?api=1&query=37.4852,-122.2364'),
  ('sakura-wave-sushi', 'Sakura Wave Sushi', 'Burlingame', 'Peninsula', 37.5779, -122.348, 'mid', 'rolls', 'Daily 11:30am–10pm', '707 Pretend Pl, Burlingame, CA', 'https://www.google.com/maps/search/?api=1&query=37.5779,-122.348'),
  ('moonlit-eel-omakase', 'Moonlit Eel Omakase', 'Palo Alto', 'Peninsula', 37.4419, -122.143, 'omakase', 'omakase', 'Thu–Sun 6 & 8:30pm', '808 Make-Believe Ct, Palo Alto, CA', 'https://www.google.com/maps/search/?api=1&query=37.4419,-122.143'),
  ('orchard-tide-sushi', 'Orchard Tide Sushi', 'San Jose', 'South Bay', 37.3382, -121.8863, 'mid', 'nigiri bar', 'Tue–Sun 5–10pm', '909 Placeholder Dr, San Jose, CA', 'https://www.google.com/maps/search/?api=1&query=37.3382,-121.8863'),
  ('silicon-sashimi-go-round', 'Silicon Sashimi Go-Round', 'Sunnyvale', 'South Bay', 37.3688, -122.0363, 'casual', 'conveyor', 'Daily 11am–9pm', '110 Sample Pkwy, Sunnyvale, CA', 'https://www.google.com/maps/search/?api=1&query=37.3688,-122.0363'),
  ('willow-glen-handroll-bar', 'Willow Glen Handroll Bar', 'San Jose', 'South Bay', 37.305, -121.9, 'casual', 'takeout', 'Daily 12–8pm', '211 Example Way, San Jose, CA', 'https://www.google.com/maps/search/?api=1&query=37.305,-121.9'),
  ('cupertino-crane', 'Cupertino Crane', 'Cupertino', 'South Bay', 37.323, -122.0322, 'omakase', 'omakase', 'Fri–Sun 6 & 8:30pm', '312 Mockingbird Ln, Cupertino, CA', 'https://www.google.com/maps/search/?api=1&query=37.323,-122.0322'),
  ('lakeside-maki-house', 'Lakeside Maki House', 'Oakland', 'East Bay', 37.8044, -122.2575, 'casual', 'rolls', 'Daily 11am–9pm', '413 Faux St, Oakland, CA', 'https://www.google.com/maps/search/?api=1&query=37.8044,-122.2575'),
  ('temescal-tuna-table', 'Temescal Tuna Table', 'Oakland', 'East Bay', 37.835, -122.261, 'mid', 'nigiri bar', 'Tue–Sun 5–9:30pm', '514 Imaginary Ave, Oakland, CA', 'https://www.google.com/maps/search/?api=1&query=37.835,-122.261'),
  ('berkeley-bamboo-omakase', 'Berkeley Bamboo Omakase', 'Berkeley', 'East Bay', 37.8716, -122.2727, 'omakase', 'omakase', 'Wed–Sun 6 & 8:30pm', '615 Pretend Rd, Berkeley, CA', 'https://www.google.com/maps/search/?api=1&query=37.8716,-122.2727'),
  ('fremont-fin-and-rice', 'Fremont Fin & Rice', 'Fremont', 'East Bay', 37.5485, -121.9886, 'casual', 'conveyor', 'Daily 11:30am–9pm', '716 Make-Believe Blvd, Fremont, CA', 'https://www.google.com/maps/search/?api=1&query=37.5485,-121.9886'),
  ('walnut-creek-wasabi', 'Walnut Creek Wasabi', 'Walnut Creek', 'East Bay', 37.9101, -122.0652, 'mid', 'rolls', 'Daily 11:30am–9:30pm', '817 Placeholder Ct, Walnut Creek, CA', 'https://www.google.com/maps/search/?api=1&query=37.9101,-122.0652'),
  ('marin-mist-sushi', 'Marin Mist Sushi', 'San Rafael', 'North Bay', 37.9735, -122.5311, 'mid', 'nigiri bar', 'Tue–Sun 5–9pm', '918 Sample Pl, San Rafael, CA', 'https://www.google.com/maps/search/?api=1&query=37.9735,-122.5311'),
  ('sausalito-salt-and-rice', 'Sausalito Salt & Rice', 'Sausalito', 'North Bay', 37.8591, -122.4853, 'omakase', 'omakase', 'Thu–Sat 6 & 8:30pm', '1019 Example Dr, Sausalito, CA', 'https://www.google.com/maps/search/?api=1&query=37.8591,-122.4853'),
  ('napa-nori-takeout', 'Napa Nori Takeout', 'Napa', 'North Bay', 38.2975, -122.2869, 'casual', 'takeout', 'Daily 11am–8pm', '1120 Mockingbird Pkwy, Napa, CA', 'https://www.google.com/maps/search/?api=1&query=38.2975,-122.2869');
