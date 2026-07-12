import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file (if running locally)
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your environment variables.');
  console.error('Please ensure they are defined before running the migration.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrateImages() {
  console.log('Starting product image migration...');
  
  // Fetch all products
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, image, name');
    
  if (fetchError) {
    console.error('Error fetching products:', fetchError);
    return;
  }
  
  console.log(`Found ${products.length} products to process.\n`);
  
  let processed = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const product of products) {
    if (!product.image || !product.image.startsWith('data:image')) {
      console.log(`[SKIP] Product ${product.id} (${product.name}): Image is already a URL or empty.`);
      skipped++;
      continue;
    }
    
    try {
      console.log(`[PROCESS] Product ${product.id} (${product.name}): Migrating Base64 image...`);
      
      // Parse Base64 string
      // Format is usually data:image/jpeg;base64,...
      const match = product.image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!match) {
        console.warn(`[FAIL] Product ${product.id}: Could not parse Base64 data format.`);
        failed++;
        continue;
      }
      
      const mimeType = match[1];
      const base64Data = match[2];
      
      // Convert to binary
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Generate unique filename
      const extension = mimeType.split('/')[1] || 'jpg';
      const fileName = `${Date.now()}-${product.id}.${extension}`;
      
      // Upload to Supabase Storage bucket 'product-images'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: true
        });
        
      if (uploadError) {
        console.error(`[FAIL] Product ${product.id}: Failed to upload to storage. Error: ${uploadError.message}`);
        failed++;
        continue;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
        
      // Update database record
      const { error: updateError } = await supabase
        .from('products')
        .update({ image: publicUrl })
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`[FAIL] Product ${product.id}: Failed to update database. Error: ${updateError.message}`);
        failed++;
        continue;
      }
      
      console.log(`[SUCCESS] Product ${product.id}: Successfully updated to public URL: ${publicUrl}`);
      processed++;
      
    } catch (err) {
      console.error(`[FAIL] Product ${product.id}: Unexpected error during migration:`, err);
      failed++;
    }
  }
  
  console.log('\n--- Migration Summary ---');
  console.log(`Total products processed: ${products.length}`);
  console.log(`Successfully migrated: ${processed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
}

migrateImages();
