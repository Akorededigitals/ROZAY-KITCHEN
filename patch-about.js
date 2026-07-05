import fs from 'fs';
let code = fs.readFileSync('src/components/AboutSection.tsx', 'utf-8');

code = code.replace(
  'className="w-full h-full object-cover"',
  'className="w-full h-full object-cover"\n                  loading="lazy"\n                  decoding="async"\n                  referrerPolicy="no-referrer"'
);

fs.writeFileSync('src/components/AboutSection.tsx', code);
