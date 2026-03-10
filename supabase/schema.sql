-- antism.com database schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role text not null check (role in ('creator', 'sponsor')),
  full_name text not null,
  avatar_url text,
  phone text,
  country text check (country in ('AZ', 'RU', 'OTHER')) default 'AZ',
  language text check (language in ('az', 'en', 'ru')) default 'az',
  onboarding_completed boolean default false,
  created_at timestamptz default now()
);

-- Creators
create table public.creators (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  type text not null check (type in ('podcaster', 'athlete', 'event')),
  bio text,
  category text, -- sports, tech, lifestyle, business, entertainment, etc.
  reach_count integer default 0,
  audience_country text,
  social_links jsonb default '{}', -- {instagram, youtube, tiktok, twitter, website, podcast_url}
  verified boolean default false,
  media_kit_url text,
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- Sponsors
create table public.sponsors (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  company_name text not null,
  industry text,
  website text,
  description text,
  created_at timestamptz default now()
);

-- Packages (creator's sponsorship offerings)
create table public.packages (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.creators(id) on delete cascade not null,
  title text not null,
  description text,
  price integer not null, -- in smallest currency unit (qəpik / kopek)
  currency text not null check (currency in ('AZN', 'RUB')),
  duration_days integer not null default 30,
  deliverables jsonb default '[]', -- [{type, label, qty}]
  cover_image_url text,
  status text not null default 'active' check (status in ('active', 'paused', 'draft')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Deals
create table public.deals (
  id uuid primary key default uuid_generate_v4(),
  package_id uuid references public.packages(id) not null,
  sponsor_id uuid references public.sponsors(id) not null,
  creator_id uuid references public.creators(id) not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed')),
  message text, -- sponsor's initial message
  total_price integer not null, -- snapshot of price at time of deal
  currency text not null,
  platform_fee integer not null, -- 30% of total_price
  creator_payout integer not null, -- 70% of total_price
  proof_url text, -- creator submits proof of delivery
  proof_note text,
  created_at timestamptz default now(),
  accepted_at timestamptz,
  completed_at timestamptz
);

-- Deal status history (timeline)
create table public.deal_events (
  id uuid primary key default uuid_generate_v4(),
  deal_id uuid references public.deals(id) on delete cascade not null,
  status text not null,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Payments
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  deal_id uuid references public.deals(id) not null,
  provider text not null check (provider in ('payriff', 'yookassa')),
  provider_payment_id text,
  provider_order_id text,
  amount integer not null,
  currency text not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- Reviews (post-deal)
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  deal_id uuid references public.deals(id) not null unique,
  reviewer_id uuid references public.profiles(id) not null,
  reviewee_id uuid references public.profiles(id) not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- Indexes
create index idx_packages_creator_id on public.packages(creator_id);
create index idx_packages_status on public.packages(status);
create index idx_deals_sponsor_id on public.deals(sponsor_id);
create index idx_deals_creator_id on public.deals(creator_id);
create index idx_deals_status on public.deals(status);
create index idx_creators_type on public.creators(type);
create index idx_creators_visible on public.creators(is_visible);

-- Trigger to update packages.updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger packages_updated_at
  before update on public.packages
  for each row execute function update_updated_at();

-- RLS Policies

alter table public.profiles enable row level security;
alter table public.creators enable row level security;
alter table public.sponsors enable row level security;
alter table public.packages enable row level security;
alter table public.deals enable row level security;
alter table public.deal_events enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;

-- Profiles: users can read all profiles, only update own
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = user_id);

-- Creators: public read, own write
create policy "creators_select_all" on public.creators for select using (true);
create policy "creators_insert_own" on public.creators for insert
  with check (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "creators_update_own" on public.creators for update
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));

-- Sponsors: public read, own write
create policy "sponsors_select_all" on public.sponsors for select using (true);
create policy "sponsors_insert_own" on public.sponsors for insert
  with check (profile_id in (select id from public.profiles where user_id = auth.uid()));
create policy "sponsors_update_own" on public.sponsors for update
  using (profile_id in (select id from public.profiles where user_id = auth.uid()));

-- Packages: public read active, creators manage own
create policy "packages_select_active" on public.packages for select using (status = 'active' or
  creator_id in (select id from public.creators where profile_id in (select id from public.profiles where user_id = auth.uid())));
create policy "packages_insert_own" on public.packages for insert
  with check (creator_id in (select id from public.creators where profile_id in (select id from public.profiles where user_id = auth.uid())));
create policy "packages_update_own" on public.packages for update
  using (creator_id in (select id from public.creators where profile_id in (select id from public.profiles where user_id = auth.uid())));
create policy "packages_delete_own" on public.packages for delete
  using (creator_id in (select id from public.creators where profile_id in (select id from public.profiles where user_id = auth.uid())));

-- Deals: parties involved can see their deals
create policy "deals_select_own" on public.deals for select
  using (
    sponsor_id in (select id from public.sponsors where profile_id in (select id from public.profiles where user_id = auth.uid()))
    or creator_id in (select id from public.creators where profile_id in (select id from public.profiles where user_id = auth.uid()))
  );
create policy "deals_insert_sponsor" on public.deals for insert
  with check (sponsor_id in (select id from public.sponsors where profile_id in (select id from public.profiles where user_id = auth.uid())));
create policy "deals_update_parties" on public.deals for update
  using (
    sponsor_id in (select id from public.sponsors where profile_id in (select id from public.profiles where user_id = auth.uid()))
    or creator_id in (select id from public.creators where profile_id in (select id from public.profiles where user_id = auth.uid()))
  );

-- Deal events: parties can insert and read
create policy "deal_events_select" on public.deal_events for select
  using (deal_id in (select id from public.deals where
    sponsor_id in (select id from public.sponsors where profile_id in (select id from public.profiles where user_id = auth.uid()))
    or creator_id in (select id from public.creators where profile_id in (select id from public.profiles where user_id = auth.uid()))
  ));
create policy "deal_events_insert" on public.deal_events for insert
  with check (created_by = auth.uid());

-- Payments: parties see own
create policy "payments_select_own" on public.payments for select
  using (deal_id in (select id from public.deals where
    sponsor_id in (select id from public.sponsors where profile_id in (select id from public.profiles where user_id = auth.uid()))
    or creator_id in (select id from public.creators where profile_id in (select id from public.profiles where user_id = auth.uid()))
  ));

-- Reviews: public read, parties write
create policy "reviews_select_all" on public.reviews for select using (true);
create policy "reviews_insert_own" on public.reviews for insert
  with check (reviewer_id in (select id from public.profiles where user_id = auth.uid()));

-- Helper view: creator cards for browse page
create or replace view public.creator_cards as
  select
    c.id,
    c.type,
    c.bio,
    c.category,
    c.reach_count,
    c.audience_country,
    c.social_links,
    c.verified,
    p.full_name,
    p.avatar_url,
    p.country,
    p.language,
    (select min(price) from public.packages where creator_id = c.id and status = 'active') as min_price,
    (select currency from public.packages where creator_id = c.id and status = 'active' limit 1) as currency,
    (select count(*) from public.deals where creator_id = c.id and status = 'completed') as completed_deals_count,
    (select avg(rating) from public.reviews r join public.profiles rp on r.reviewee_id = rp.id where rp.id = p.id) as avg_rating
  from public.creators c
  join public.profiles p on c.profile_id = p.id
  where c.is_visible = true;
