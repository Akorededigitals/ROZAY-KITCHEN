-- supabase-migration.sql
-- Run this script in your Supabase SQL Editor to resolve PGRST204 errors 
-- and ensure the correct schema columns exist.

-- 1. Add the new snake_case columns that the application now expects
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS discount_price NUMERIC,
ADD COLUMN IF NOT EXISTS price_range TEXT,
ADD COLUMN IF NOT EXISTS stock_status TEXT;

-- 2. (Optional) If you previously created the table with camelCase columns and have data, 
-- you can migrate that data to the new columns:
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='discountPrice') THEN
    EXECUTE 'UPDATE public.products SET discount_price = "discountPrice" WHERE "discountPrice" IS NOT NULL';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='priceRange') THEN
    EXECUTE 'UPDATE public.products SET price_range = "priceRange" WHERE "priceRange" IS NOT NULL';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='stockStatus') THEN
    EXECUTE 'UPDATE public.products SET stock_status = "stockStatus" WHERE "stockStatus" IS NOT NULL';
  END IF;
END $$;

-- 3. (Optional) Drop the old camelCase columns to clean up your schema
-- ALTER TABLE public.products DROP COLUMN IF EXISTS "discountPrice";
-- ALTER TABLE public.products DROP COLUMN IF EXISTS "priceRange";
-- ALTER TABLE public.products DROP COLUMN IF EXISTS "stockStatus";

-- Tell PostgREST to reload the schema cache so the API recognizes the new columns immediately
NOTIFY pgrst, 'reload schema';
