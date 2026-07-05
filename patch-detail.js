import fs from 'fs';
let code = fs.readFileSync('src/components/ProductDetailView.tsx', 'utf-8');

code = code.replace(
  'referrerPolicy="no-referrer"',
  'referrerPolicy="no-referrer"\n                  loading="lazy"\n                  decoding="async"'
);

fs.writeFileSync('src/components/ProductDetailView.tsx', code);
