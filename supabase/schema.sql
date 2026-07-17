create extension if not exists pgcrypto;

create table if not exists public.vocab_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null,
  meaning text not null default '',
  sentence text not null default '',
  episode_id text,
  episode_name text,
  selected boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_id, word)
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  words jsonb not null default '[]',
  story_en text not null,
  story_zh text not null,
  glossary jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  episode_id text not null,
  position_seconds numeric not null,
  label text not null default '书签',
  created_at timestamptz not null default now()
);

create table if not exists public.sentence_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  episode_id text not null,
  segment_index integer not null,
  quote text not null,
  translation text not null default '',
  position_seconds numeric not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, episode_id, segment_index)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  episode_id text not null,
  segment_index integer not null,
  quote text not null default '',
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.vocab_words enable row level security;
alter table public.stories enable row level security;
alter table public.bookmarks enable row level security;
alter table public.sentence_saves enable row level security;
alter table public.comments enable row level security;

create policy "own vocab" on public.vocab_words for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own stories" on public.stories for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own bookmarks" on public.bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own saves" on public.sentence_saves for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "read comments" on public.comments for select using (true);
create policy "write own comments" on public.comments for insert with check (auth.uid() = user_id);
create policy "update own comments" on public.comments for update using (auth.uid() = user_id);
create policy "delete own comments" on public.comments for delete using (auth.uid() = user_id);

create index if not exists comments_episode_segment_idx on public.comments(episode_id, segment_index, created_at);
create index if not exists saves_user_created_idx on public.sentence_saves(user_id, created_at desc);
