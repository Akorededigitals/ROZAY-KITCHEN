import fs from 'fs';
let code = fs.readFileSync('src/components/Hero.tsx', 'utf-8');

code = code.replace(
  'referrerPolicy="no-referrer"',
  'referrerPolicy="no-referrer"\n                loading="eager"\n                decoding="async"'
);

fs.writeFileSync('src/components/Hero.tsx', code);
