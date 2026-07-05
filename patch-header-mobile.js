import fs from 'fs';
let code = fs.readFileSync('src/components/Header.tsx', 'utf-8');

code = code.replace(
  '                   if (link.subcategories) {\n                    setShopDropdownOpen(!shopDropdownOpen);\n                  } else {\n                    link.action(); \n                    setIsOpen(false);\n                  }',
  '                   link.action();\n                   if (link.subcategories) {\n                    setShopDropdownOpen(!shopDropdownOpen);\n                  } else {\n                    setIsOpen(false);\n                  }'
);

fs.writeFileSync('src/components/Header.tsx', code);
