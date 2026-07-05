import fs from 'fs';
let code = fs.readFileSync('src/components/OrderSuccessView.tsx', 'utf-8');
code = code.replace(
  'Your kitchen wares are being curated at our Ebutero Idumota warehouse depot. Outgoing confirmation emails have been dispatched.',
  'Your kitchen wares are being curated at our warehouse depot. Outgoing confirmation emails have been dispatched.'
);
code = code.replace(
  'Ebutero Market, Idumota, Lagos Island, Nigeria.',
  '{BRAND_INFO.location}'
);
fs.writeFileSync('src/components/OrderSuccessView.tsx', code);
