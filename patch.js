import fs from 'fs';
let code = fs.readFileSync('src/data.ts', 'utf-8');
code = code.replace(
  'const HERO_IMAGE = "/images/balogun_market.jpg";',
  'const HERO_IMAGE = "/images/idumota_lagos_market.jpg";'
);
fs.writeFileSync('src/data.ts', code);
