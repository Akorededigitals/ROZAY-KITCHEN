import fs from 'fs';
let code = fs.readFileSync('src/data.ts', 'utf-8');

code = code.replace(
  'const HERO_IMAGE = "/src/assets/images/rozay_kitchen_hero_1781992826699.jpg";',
  'const HERO_IMAGE = "/images/balogun_market.jpg";'
);
code = code.replace(
  'const CHAFING_DISH_IMAGE = "/src/assets/images/luxury_chafing_dish_1781992841526.jpg";',
  'const CHAFING_DISH_IMAGE = "/images/luxury_chafing_dish_1781992841526.jpg";'
);
code = code.replace(
  'const COOKING_POTS_IMAGE = "/src/assets/images/premium_pots_set_1781992854112.jpg";',
  'const COOKING_POTS_IMAGE = "/images/premium_pots_set_1781992854112.jpg";'
);

fs.writeFileSync('src/data.ts', code);
