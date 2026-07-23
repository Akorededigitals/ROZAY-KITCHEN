import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '');
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrateImages() {
  console.log('Starting local image migration to Supabase Storage...');
  
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, image, name');
    
  if (fetchError) {
    console.error('Error fetching products:', fetchError);
    return;
  }
  
  console.log(`Found ${products.length} total products to process.\n`);
  
  let processed = 0;
  let skipped = 0;
  let failed = 0;
  let missing = 0;
  
  for (const product of products) {
    if (!product.image) {
      console.log(`[SKIP] Product ${product.id} (${product.name}): Image is empty.`);
      skipped++;
      continue;
    }
    
    // Check if it's already a full URL (but NOT base64)
    if (product.image.startsWith('http')) {
      console.log(`[SKIP] Product ${product.id} (${product.name}): Already migrated to external URL.`);
      skipped++;
      continue;
    }
    
    let fileBuffer: Buffer;
    let mimeType = 'image/jpeg';
    let ext = '.jpg';
    
    try {
      if (product.image.startsWith('data:')) {
        console.log(`[PROCESS] Product ${product.id} (${product.name}): Migrating Base64 image...`);
        const match = product.image.match(/^data:(image\/\w+);base64,(.+)$/);
        if (!match) {
          console.warn(`[FAIL] Product ${product.id}: Could not parse Base64 data format.`);
          failed++;
          continue;
        }
        mimeType = match[1];
        const base64Data = match[2];
        fileBuffer = Buffer.from(base64Data, 'base64');
        ext = '.' + (mimeType.split('/')[1] || 'jpg');
      } else {
      // Expected format: /images/filename.ext or images/filename.ext or filename.ext
      let localPath = product.image;
      if (localPath.startsWith('/')) {
          localPath = localPath.substring(1);
      }
      
      // If the path doesn't include "images/", assume it's in public/images or public/
      let fullPath = path.join(process.cwd(), 'public', localPath);
      if (!fs.existsSync(fullPath)) {
          // Try falling back to public/images/ if they just stored the filename
          fullPath = path.join(process.cwd(), 'public', 'images', path.basename(localPath));
      }
      
      if (!fs.existsSync(fullPath)) {
        console.warn(`[MISSING] Product ${product.id} (${product.name}): File not found at ${fullPath}`);
        missing++;
        continue;
      }
      
      console.log(`[PROCESS] Product ${product.id} (${product.name}): Migrating local file ${localPath}...`);
      fileBuffer = fs.readFileSync(fullPath);
      ext = path.extname(fullPath).toLowerCase();
      
      if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.webp') mimeType = 'image/webp';
      else if (ext === '.gif') mimeType = 'image/gif';
      else if (ext === '.svg') mimeType = 'image/svg+xml';
    }
      
      // Generate unique filename using hash to avoid duplicates
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex').substring(0, 16);
      const newFileName = `product-${hash}${ext || '.jpg'}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(newFileName, fileBuffer, {
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
        .getPublicUrl(newFileName);
        
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
  console.log(`Skipped (already URLs): ${skipped}`);
  console.log(`Missing files: ${missing}`);
  console.log(`Failed uploads: ${failed}`);
}

migrateImages();
