-- Supabase Database Schema for Farhad's Portfolio & Dynamic CMS
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT DEFAULT 'Tech',
  tags TEXT[] DEFAULT '{}',
  author_name TEXT DEFAULT 'Md. Farhadul Islam',
  author_role TEXT DEFAULT 'CSE Student & Frontend Developer',
  author_avatar TEXT DEFAULT '',
  read_time TEXT DEFAULT '3 min read',
  likes INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  image TEXT,
  tech TEXT[] DEFAULT '{}',
  stack TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  challenges TEXT,
  live TEXT,
  github TEXT,
  github2 JSONB,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  icon TEXT DEFAULT 'terminal',
  accent TEXT DEFAULT 'cyan',
  name TEXT NOT NULL,
  level TEXT DEFAULT 'Intermediate',
  value INTEGER DEFAULT 75,
  note TEXT,
  logo TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  org TEXT NOT NULL,
  period TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  body TEXT NOT NULL,
  highlight TEXT,
  extra TEXT,
  live TEXT,
  github TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Education Table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  org TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  highlight TEXT,
  status TEXT DEFAULT 'done',
  kind TEXT DEFAULT 'Academic',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT DEFAULT 'layout',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Testimonials & Certifications
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  quote TEXT NOT NULL,
  avatar TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  icon TEXT DEFAULT 'award',
  link TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read Experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public Read Education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Certificates" ON public.certificates FOR SELECT USING (true);

-- Allow Public Write / Insert / Update / Delete with anon key (or admin secret)
CREATE POLICY "Public Insert Blogs" ON public.blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Blogs" ON public.blogs FOR UPDATE USING (true);
CREATE POLICY "Public Delete Blogs" ON public.blogs FOR DELETE USING (true);

CREATE POLICY "Public Insert Projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Public Delete Projects" ON public.projects FOR DELETE USING (true);

CREATE POLICY "Public Insert Skills" ON public.skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Skills" ON public.skills FOR UPDATE USING (true);
CREATE POLICY "Public Delete Skills" ON public.skills FOR DELETE USING (true);

CREATE POLICY "Public Insert Experience" ON public.experience FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Experience" ON public.experience FOR UPDATE USING (true);
CREATE POLICY "Public Delete Experience" ON public.experience FOR DELETE USING (true);

CREATE POLICY "Public Insert Education" ON public.education FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Education" ON public.education FOR UPDATE USING (true);
CREATE POLICY "Public Delete Education" ON public.education FOR DELETE USING (true);

CREATE POLICY "Public Insert Services" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Services" ON public.services FOR UPDATE USING (true);
CREATE POLICY "Public Delete Services" ON public.services FOR DELETE USING (true);
