import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes('import TrackOrderSection')) {
  code = code.replace(
    'import LocationShowcase from "./components/LocationShowcase";',
    'import LocationShowcase from "./components/LocationShowcase";\nimport TrackOrderSection from "./components/TrackOrderSection";'
  );
  
  code = code.replace(
    '{/* Client Testimonials */}\n              <TestimonialsSection />',
    '{/* Track Order Lookup */}\n              <TrackOrderSection />\n              {/* Client Testimonials */}\n              <TestimonialsSection />'
  );

  fs.writeFileSync('src/App.tsx', code);
}
