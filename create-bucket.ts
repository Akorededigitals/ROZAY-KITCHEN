import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '') || '', process.env.VITE_SUPABASE_ANON_KEY || '');
async function run() {
  const { data, error } = await supabase.storage.createBucket('product-images', { public: true });
  if (error) console.error("Error creating bucket:", error.message);
  else console.log("Bucket created!");
}
run();
