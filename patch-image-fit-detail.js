import fs from 'fs';
let code = fs.readFileSync('src/components/ProductDetailView.tsx', 'utf-8');

code = code.replace(
  'className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"',
  'className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"'
);

code = code.replace(
  'className="relative aspect-square [min-height:350px] bg-stone-100 rounded-2xl overflow-hidden border border-gray-100 group flex items-center justify-center"',
  'className="relative aspect-square [min-height:350px] bg-white rounded-2xl overflow-hidden border border-gray-100 group flex items-center justify-center"'
);

code = code.replace(
  'className="w-full h-full object-cover hover:scale-105 transition-transform"',
  'className="w-full h-full object-contain p-4 hover:scale-105 transition-transform"'
);

code = code.replace(
  'className="relative aspect-[4/3] bg-stone-100 overflow-hidden flex items-center justify-center"',
  'className="relative aspect-[4/3] bg-white overflow-hidden flex items-center justify-center"'
);

fs.writeFileSync('src/components/ProductDetailView.tsx', code);
