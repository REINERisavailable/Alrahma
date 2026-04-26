const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function setup() {
  const client = new Client({
    user: 'postgres',
    password: 'gJ6nFKdPwd,7%/g',
    host: 'db.ioytqjbtfxjnlzxcyeao.supabase.co',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to DB');

  try {
    await client.query(`
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

      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'products') THEN
          INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Public Access products'
        ) THEN
          CREATE POLICY "Public Access products" ON storage.objects FOR ALL USING (bucket_id = 'products');
        END IF;
      END $$;
    `);

    console.log('Schema created successfully.');
  } catch (err) {
    console.error('Error creating schema:', err);
  } finally {
    await client.end();
  }
}

setup();
