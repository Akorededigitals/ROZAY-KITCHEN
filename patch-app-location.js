import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(
  '<span>Ebutero Market, Idumota, Lagos Island, Lagos State, Nigeria</span>',
  '<span>{BRAND_INFO.location}</span>'
);
fs.writeFileSync('src/App.tsx', code);
