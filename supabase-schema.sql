-- supabase-schema.sql
-- Run this script in your Supabase SQL Editor to create the necessary tables.

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image TEXT,
    features JSONB,
    price_range TEXT,
    price NUMERIC NOT NULL,
    discount_price NUMERIC,
    stock_status TEXT,
    rating NUMERIC
);

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
    delivery_fee NUMERIC,
    items JSONB,
    subtotal NUMERIC,
    total NUMERIC,
    payment_method TEXT,
    payment_status TEXT,
    order_status TEXT,
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
    quantity_selected NUMERIC,
    created_at TEXT
);

-- 4. Set up Row Level Security (RLS) policies
-- Note: Setting to true natively allows frontend access for rapid prototyping.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for products"
ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for orders"
ON public.orders FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read-write for contact_submissions"
ON public.contact_submissions FOR ALL USING (true) WITH CHECK (true);
