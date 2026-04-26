CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  html_description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT DEFAULT 'pending',
  user_images JSONB,
  user_link TEXT,
  suggested_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Note: Storage buckets will be created using Supabase Studio.
-- Please go to Storage -> Create a new bucket called 'products'
-- Make it PUBLIC.
