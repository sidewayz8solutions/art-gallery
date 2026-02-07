-- ============================================================
--  Art Gallery — Database Schema & Seed Data
--  Run this in your Supabase SQL Editor (or via psql).
-- ============================================================

-- 1. Tables
-- ─────────────────────────────────────────────────────────────
create table if not exists artists (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  bio text,
  slug text unique not null,
  avatar_url text
);

create table if not exists artworks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist_id uuid references artists(id) not null,
  price numeric,
  image_url text not null,
  description text,
  dimensions text,
  is_sold boolean default false
);

-- 2. Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table artists enable row level security;
alter table artworks enable row level security;

-- Public read access
create policy "Public artists are viewable by everyone."
  on artists for select using (true);

create policy "Public artworks are viewable by everyone."
  on artworks for select using (true);

-- 3. Seed Artists
-- ─────────────────────────────────────────────────────────────
insert into artists (name, bio, slug, avatar_url) values
(
  'Elena Vasquez',
  'Elena explores the boundaries between digital abstraction and organic texture. Based in Mexico City, her work has been shown at MUAC and Zona Maco.',
  'elena-vasquez',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'
),
(
  'Kai Tanaka',
  'Tokyo-born, Berlin-based. Kai merges traditional ink-wash techniques with generative algorithms to create haunting monochrome landscapes.',
  'kai-tanaka',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
),
(
  'Amara Osei',
  'Amara is a Ghanaian-British painter whose vivid portraits celebrate the beauty and complexity of diasporic identity.',
  'amara-osei',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop'
);

-- 4. Seed Artworks
-- ─────────────────────────────────────────────────────────────
-- (Using Unsplash placeholders — replace with your own art images later)

-- Elena Vasquez artworks
insert into artworks (title, artist_id, price, image_url, description, dimensions) values
(
  'Fractal Garden',
  (select id from artists where slug = 'elena-vasquez'),
  2400,
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1000&fit=crop',
  'An explosion of algorithmic flora rendered in deep magentas and teals.',
  '30×40 in'
),
(
  'Signal Drift',
  (select id from artists where slug = 'elena-vasquez'),
  1800,
  'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=1000&fit=crop',
  'Layered radio-wave patterns dissolving into warm amber gradients.',
  '24×36 in'
),
(
  'Coral Algorithm',
  (select id from artists where slug = 'elena-vasquez'),
  3100,
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=1000&fit=crop',
  'Digital coral reefs generated from ocean-temperature data sets.',
  '36×48 in'
);

-- Kai Tanaka artworks
insert into artworks (title, artist_id, price, image_url, description, dimensions) values
(
  'Mountain Pulse',
  (select id from artists where slug = 'kai-tanaka'),
  2800,
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=1000&fit=crop',
  'Ink-wash mountains with procedural fog — a dialogue between hand and code.',
  '24×30 in'
),
(
  'Void Current',
  (select id from artists where slug = 'kai-tanaka'),
  3500,
  'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=1000&fit=crop',
  'A monochrome whirlpool of data-driven brush strokes.',
  '30×40 in'
),
(
  'Silent Topology',
  (select id from artists where slug = 'kai-tanaka'),
  null,
  'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=800&h=1000&fit=crop',
  'Cartographic lines tracing invisible emotional geographies.',
  '20×28 in'
);

-- Amara Osei artworks
insert into artworks (title, artist_id, price, image_url, description, dimensions) values
(
  'Golden Hour',
  (select id from artists where slug = 'amara-osei'),
  4200,
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=1000&fit=crop',
  'A luminous portrait bathed in West African sunset tones.',
  '36×48 in'
),
(
  'Roots & Routes',
  (select id from artists where slug = 'amara-osei'),
  2900,
  'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&h=1000&fit=crop',
  'Mixed-media piece mapping ancestral journeys across continents.',
  '30×40 in'
),
(
  'Still We Rise',
  (select id from artists where slug = 'amara-osei'),
  5500,
  'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=1000&fit=crop',
  'A triptych celebrating resilience, rendered in bold impasto strokes.',
  '48×64 in'
);
