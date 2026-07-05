import fs from 'fs';
let code = fs.readFileSync('src/components/ProductDetailView.tsx', 'utf-8');

code = code.replace(
  '                        className="w-full h-full object-cover hover:scale-105 transition-transform"',
  '                        referrerPolicy="no-referrer"\n                        loading="lazy"\n                        decoding="async"\n                        className="w-full h-full object-cover hover:scale-105 transition-transform"'
);

fs.writeFileSync('src/components/ProductDetailView.tsx', code);
