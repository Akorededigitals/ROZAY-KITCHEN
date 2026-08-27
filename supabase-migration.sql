-- ====================================================================
-- Rozay Kitchen - Supabase Safe Migration Script
-- Run this if you already have an existing Supabase project to update it
-- ====================================================================

-- 1. Ensure all columns on public.products exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS discount_price NUMERIC,
ADD COLUMN IF NOT EXISTS price_range TEXT,
ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'In Stock',
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.8,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- 2. Ensure public.orders has all fields
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS delivery_method TEXT,
ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'WhatsApp / Direct Transfer',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Pending',
ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'Received';

-- 3. Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS and setup policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-write for products" ON public.products;
DROP POLICY IF EXISTS "Allow public read-write for orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read-write for contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow public read-write for site_settings" ON public.site_settings;

CREATE POLICY "Allow public read-write for products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for contact_submissions" ON public.contact_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- 5. Ensure Storage Bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    157286400,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 157286400;

-- Storage Policies
DROP POLICY IF EXISTS "Allow public view for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete for product-images" ON storage.objects;

CREATE POLICY "Allow public view for product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Allow public insert for product-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Allow public update for product-images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Allow public delete for product-images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');

-- 6. Realtime publication
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

-- 7. Reload schema
NOTIFY pgrst, 'reload schema';
