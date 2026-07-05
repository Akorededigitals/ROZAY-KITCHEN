import fs from 'fs';
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

code = code.replace(
  'value: "/src/assets/images/luxury_chafing_dish_1781992841526.jpg"',
  'value: "/images/luxury_chafing_dish_1781992841526.jpg"'
);
code = code.replace(
  'value: "/src/assets/images/premium_pots_set_1781992854112.jpg"',
  'value: "/images/premium_pots_set_1781992854112.jpg"'
);
code = code.replace(
  'value: "/src/assets/images/rozay_kitchen_hero_1781992826699.jpg"',
  'value: "/images/balogun_market.jpg"'
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
