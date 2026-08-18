import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load environment variables from process.env and .env files
  const env = loadEnv(mode, process.cwd(), '');

  const supabaseUrl = (env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const supabaseKey = (env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();
  const paystackKey = (env.VITE_PAYSTACK_PUBLIC_KEY || process.env.VITE_PAYSTACK_PUBLIC_KEY || '').trim();

  // Netlify / Production CI Environment Variable Build Check
  if (process.env.NODE_ENV === 'production' || mode === 'production') {
    console.log('\n======================================================');
    console.log('🚀 [Netlify/CI Build Pipeline] Environment Variable Check');
    console.log('======================================================');
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('YOUR_') && !supabaseKey.includes('YOUR_')) {
      console.log(`✓ VITE_SUPABASE_URL: Configured (${supabaseUrl.replace(/(https:\/\/[^.]+).*/, '$1.supabase.co')})`);
      console.log(`✓ VITE_SUPABASE_ANON_KEY: Configured (${supabaseKey.length} chars)`);
    } else {
      console.log('ℹ VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY:');
      console.log('  Using bundled high-availability Supabase fallback credentials.');
      console.log('  To override in Netlify: Go to Site Configuration > Environment Variables.');
    }

    if (paystackKey && !paystackKey.includes('YOUR_')) {
      console.log(`✓ VITE_PAYSTACK_PUBLIC_KEY: Configured (${paystackKey.substring(0, 8)}...)`);
    } else {
      console.log('ℹ VITE_PAYSTACK_PUBLIC_KEY: Not set (direct transfer / WhatsApp payment active).');
    }
    console.log('======================================================\n');
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('motion')) {
                return 'vendor-animation';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
              return 'vendor-others';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
