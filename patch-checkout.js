import fs from 'fs';
let code = fs.readFileSync('src/components/CheckoutView.tsx', 'utf-8');

code = code.replace(
  'referrerPolicy="no-referrer"',
  'referrerPolicy="no-referrer"\n                            loading="lazy"\n                            decoding="async"'
);

fs.writeFileSync('src/components/CheckoutView.tsx', code);
