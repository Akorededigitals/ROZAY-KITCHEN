import fs from 'fs';
let code = fs.readFileSync('src/components/ProductCatalog.tsx', 'utf-8');

code = code.replace(
  'className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"',
  'className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"'
);

code = code.replace(
  'className="relative w-full h-56 sm:h-64 shrink-0 bg-stone-100 overflow-hidden flex items-center justify-center"',
  'className="relative w-full h-56 sm:h-64 shrink-0 bg-white overflow-hidden flex items-center justify-center"'
);

fs.writeFileSync('src/components/ProductCatalog.tsx', code);
