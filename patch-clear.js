import fs from 'fs';
let code = fs.readFileSync('src/components/ProductCatalog.tsx', 'utf-8');

code = code.replace(
  'onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}',
  'onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setPriceFilter("all"); }}'
);

fs.writeFileSync('src/components/ProductCatalog.tsx', code);
