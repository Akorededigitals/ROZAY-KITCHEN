-- ====================================================================
-- Rozay Kitchen - Complete Supabase Database Schema & Storage Setup
-- Run this complete script in your Supabase SQL Editor (SQL Editor -> New Query)
-- ====================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    price_range TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    discount_price NUMERIC,
    stock_status TEXT DEFAULT 'In Stock',
    rating NUMERIC DEFAULT 4.8
);

-- Ensure all columns exist in case of partial upgrades
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_price NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_range TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'In Stock';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.8;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    delivery_method TEXT,
    delivery_fee NUMERIC DEFAULT 0,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    payment_method TEXT DEFAULT 'WhatsApp / Direct Transfer',
    payment_status TEXT DEFAULT 'Pending',
    order_status TEXT DEFAULT 'Received',
    created_at TEXT
);

-- 3. Create Contact Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT,
    business_type TEXT,
    product_selected TEXT,
    quantity_selected NUMERIC DEFAULT 1,
    created_at TEXT
);

-- 4. Create Site Settings Table (For dynamic CEO video showcase, banners, etc.)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default CEO video showcase configuration if not present
INSERT INTO public.site_settings (key, value, updated_at)
VALUES (
    'ceo_video_showcase',
    '{
        "id": "ceo-video-featured",
        "title": "CEO Product Showcase & Live Demonstration",
        "subtitle": "Join Founder & CEO Alaekwe Onyebuchi as he walks through the engineering, gold finish, and roll-top durability of our signature chafing dishes.",
        "videoUrl": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/site-assets/rozay_kitchen_hero_1781992826699.jpg",
        "videoType": "url",
        "posterUrl": "https://i.ibb.co/gbjcKSgb/Whats-App-Image-2026-08-13-at-17-09-03.jpg",
        "featuredProductId": "rzk-prod-1782520037343",
        "ceoName": "Alaekwe Onyebuchi",
        "ceoTitle": "Founder & CEO, Rozay Kitchen",
        "description": "Watch a personal demonstration from our CEO on how to inspect, set up, and maintain our heavy-duty roll-top gold luxury chafing dishes for 5-star catering and luxury buffet events across Nigeria.",
        "talkingPoints": [
            "Premium 304 food-grade surgical stainless steel construction",
            "180° smooth hydraulic roll-top lid with tempered gold ergonomic handle",
            "Dual high-efficiency fuel holders with water-pan heat retention",
            "Wholesale Lagos Island dispatch with guaranteed countrywide delivery"
        ],
        "isActive": true
    }'::jsonb,
    NOW()
)
ON CONFLICT (key) DO NOTHING;

-- 5. Set up Row Level Security (RLS) policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent duplicate policy errors
DROP POLICY IF EXISTS "Allow public read-write for products" ON public.products;
DROP POLICY IF EXISTS "Allow public read-write for orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read-write for contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow public read-write for site_settings" ON public.site_settings;

-- Create clean public read-write policies
CREATE POLICY "Allow public read-write for products"
ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for orders"
ON public.orders FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for contact_submissions"
ON public.contact_submissions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for site_settings"
ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- 6. Setup Public Storage Bucket for Product Images and Media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    157286400, -- 150MB limit to support studio videos & ultra-HD photos
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 157286400;

-- Storage Policies for 'product-images'
DROP POLICY IF EXISTS "Allow public view for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete for product-images" ON storage.objects;

CREATE POLICY "Allow public view for product-images"
ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow public insert for product-images"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public update for product-images"
ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Allow public delete for product-images"
ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- 7. Enable Realtime Publications for instant UI synchronization
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
