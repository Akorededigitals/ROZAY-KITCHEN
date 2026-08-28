import { Product, Testimonial } from "./types";

const HERO_IMAGE = "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/site-assets/rozay_kitchen_hero_1781992826699.jpg";

export const BRAND_INFO = {
  name: "Rozay Kitchen",
  tagline: "Bringing Quality, Style, and Functionality to Every Kitchen.",
  phone: "+234 812 322 1174",
  email: "rozaykitchen@gmail.com",
  location: "Idumota, Block N, shop 89,90,91,92 New Pepsi Building, Merciful line. Ebute-ero Market Gorodom, Lagos Island, 101001, Lagos",
  hours: {
    weekdays: "Monday – Saturday: 8:00 AM – 6:00 PM",
    sunday: "Sunday: Closed"
  },
  socials: {
    facebook: "https://www.facebook.com/share/1chGzn65bp/",
    instagram: "https://www.instagram.com/rozay_kitchen_",
    tiktok: "https://www.tiktok.com/@rozaykitchen860"
  },
  hero: {
    headline: "Premium Kitchen Appliances & Catering Equipment in Lagos",
    subheadline: "Discover high-quality chafing dishes, cookware, cooking pots, catering tools, coolers, and kitchen appliances trusted by homes, restaurants, and hospitality businesses across Nigeria.",
    image: HERO_IMAGE
  },
  about: "Rozay Kitchen is a trusted destination for high-quality kitchen appliances, cookware, and catering equipment in Lagos, Nigeria. Conveniently located in Idumota, Block N, shop 89,90,91,92 New Pepsi Building, Merciful line. Ebute-ero Market Gorodom, Lagos Island, we have built a reputation for providing premium kitchen solutions at competitive prices.\n\nWe specialize in a wide range of products, including luxury chafing dishes, food warmers, granite cookware sets, durable cooking pots, catering tools, commercial coolers, and reliable kitchen electronics designed to meet the rigorous demands of modern homes, upscale restaurants, event caterers, hotels, and luxury hospitality businesses across Nigeria.\n\nAt Rozay Kitchen, we believe that every kitchen deserves products that combine functionality, durability, and style. Our commitment to quality, affordability, and exceptional customer service has made us a preferred choice for customers seeking modern kitchen solutions.\n\nWhether you are equipping a new kitchen, upgrading your catering business, or searching for premium cookware, Rozay Kitchen is dedicated to helping you find the perfect products for your needs.",
  mission: "To provide high-quality kitchen appliances, cookware, and catering equipment that enhance cooking experiences while delivering outstanding value, reliability, and customer satisfaction.",
  vision: "To become Nigeria's leading supplier of premium kitchen appliances, cookware, and catering equipment by consistently offering exceptional products, innovative solutions, and world-class customer service."
};

export const CHOOSE_US_POINTS = [
  {
    title: "Premium Quality",
    description: "We carefully select products known for safety, durability, functionality, and superior culinary performance."
  },
  {
    title: "Affordable Prices",
    description: "Enjoy competitive market rates and direct wholesale prices without ever compromising on quality."
  },
  {
    title: "Trusted Reputation",
    description: "We are proud to have earned the trust of premium households, main caterers, major restaurants, and hospitality businesses across Lagos."
  },
  {
    title: "Excellent Customer Service",
    description: "Our knowledgeable on-site and remote team is always available to guide and assist you in selecting the right equipment."
  },
  {
    title: "Wide Product Selection",
    description: "From luxury chafing dishes and massive cookware sets to storage coolers and electronic appliances—we carry all kitchen essentials."
  }
];

export const CATEGORIES = [
  "All",
  "Luxury Chafing Dishes",
  "Premium Cooking Pots",
  "Cookware Sets",
  "Catering Equipment",
  "Coolers & Storage",
  "Kitchen Appliances",
  "Utensils & Accessories"
];

export const PRODUCTS_DATA: Product[] = [
  {
    "id": "rzk-prod-1782519724298",
    "name": "1 set tea sets",
    "category": "Utensils & Accessories",
    "description": "Elegant 1 Set Tea Set designed for stylish tea serving and memorable hospitality moments. it combines beauty, functionality, and a premium finish to elevate your tea presentation experience.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-a108754893fd6eb8.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "60,000",
    "price": 60000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782520037343",
    "name": "10 litres chaffing dish",
    "category": "Luxury Chafing Dishes",
    "description": "The 10 Litres Chafing Dish is a premium food warmer designed to keep meals hot and fresh while adding elegance to your serving setup. Perfect for buffets, restaurants, hotels, catering, and events, it combines durability, stylish presentation, and excellent heat retention for professional food service.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-95a73bd51222e095.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "140,000",
    "price": 140000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1783248392200",
    "name": "2 in 1 Carp jug",
    "category": "Utensils & Accessories",
    "description": "Elegant 2-piece hot & cold vacuum flask set\nPremium marble-effect body with luxurious gold finish\nDouble-wall insulation keeps drinks hot or cold for hours\nLeak-proof lid with smooth, easy-pour spout\nComfortable ergonomic handle for a secure grip\nDurable, food-grade interior\nIdeal for tea, coffee, milk, and other beverages\nPerfect for homes, offices, gatherings, and gifting",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-e8d658ad5ee5e9b8.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "₦110,000",
    "price": 110000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782519527904",
    "name": "2in 1 Carp jug",
    "category": "Utensils & Accessories",
    "description": "The 2 in 1 Carp Jug combines elegant design with practical functionality, perfect for serving beverages in style. Ideal for homes, restaurants, hotels, and events, it offers a modern look, convenient handling, and versatile use for different drinks while enhancing your table presentation.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-522e590fe0fefaea.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "85,000",
    "price": 85000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782519219437",
    "name": "3 in 1breakable dish",
    "category": "Luxury Chafing Dishes",
    "description": "Elegant and versatile 3 in 1 Breakable Dish designed for stylish food presentation and serving. Perfect for events, restaurants, and luxury dining setups, it combines beauty with functionality, offering multiple compartments to serve different dishes while maintaining a premium look.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-da2081e04d5529e4.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "60,000",
    "price": 60000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "prod-6",
    "name": "3 partition single cooler",
    "category": "Coolers & Storage",
    "description": "Designed with multiple compartments for better organization, it offers excellent cooling performance, durability, and convenience for homes, events, restaurants, and outdoor use. Stylish, practical, and built to keep your items fresh for longer.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-0225602b9c0dbbe4.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "₦150,000",
    "price": 150000,
    "discountPrice": 150000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "prod-9",
    "name": "3steps Fruit Stand",
    "category": "Cookware Sets",
    "description": "3steps fruit stand 55k",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-2e121a15f370fb46.jpeg",
    "features": [
      "Display your fruits beautifully with this stylish 3 Steps Fruit Stand. Designed for easy organization and attractive presentation",
      "it helps keep your fruits fresh",
      "accessible",
      "and neatly arranged while adding a modern touch to your kitchen or dining space."
    ],
    "priceRange": "₦55,000",
    "price": 70000,
    "discountPrice": 55000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782522180997",
    "name": "4 Sets Dubai Food Warmer",
    "category": "Coolers & Storage",
    "description": "Premium 4-piece Dubai food warmer set designed to keep your meals warm while adding a touch of luxury and elegance to your dining setup. Perfect for events, restaurants, and home entertaining.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-b745c2c623904e7e.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "450,000",
    "price": 450000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782520618574",
    "name": "Diamond body chaffing dish",
    "category": "Luxury Chafing Dishes",
    "description": "A luxurious Diamond Body Chafing Dish designed with an elegant finish for premium food presentation. Perfect for hotels, events, and fine dining, it combines style, durability, and excellent heat retention.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-58d7f627644fa68e.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "180,000",
    "price": 180000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "prod-2",
    "name": "Dubai Food warmer",
    "category": "Coolers & Storage",
    "description": "Premium Dubai Food Warmer designed to keep your meals hot, fresh, and ready to serve. Made with a stylish finish and durable materials, it is perfect for homes, restaurants, catering services, events, and hospitality use. It combines elegance, convenience, and excellent heat retention for a better serving experience.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-d6814e547a777971.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "₦480,000",
    "price": 480000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782464558269",
    "name": "Dubai raindrop breakable dish",
    "category": "Utensils & Accessories",
    "description": "Dubai Raindrop Breakable Dish, beautifully crafted with a unique raindrop-inspired design. Made from high-quality glass, it is perfect for serving fruits, salads, desserts, snacks, and other delicacies. Its luxurious finish makes it an excellent choice for both everyday dining and special occasions.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-c0cb800b6cdd10b8.jpeg",
    "features": [
      "Elegant raindrop-inspired design Premium-quality breakable glass Stylish and durable finish Ideal for serving fruits",
      "desserts",
      "salads",
      "and snacks Perfect for homes",
      "hotels",
      "restaurants",
      "and gift sets Easy to clean and maintain."
    ],
    "priceRange": "330000",
    "price": 330000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "prod-3",
    "name": "Ejshe Chaffing Dish",
    "category": "Luxury Chafing Dishes",
    "description": "Elegant and durable chafing dish designed to keep food warm and fresh for longer periods. Perfect for buffets, events, restaurants, hotels, and home entertaining. Features a stylish design, quality finishing, and easy-to-use setup for professional food presentation.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-2707abb70c029704.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "₦190,000",
    "price": 190000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "prod-1",
    "name": "Ejshe Food Warmer",
    "category": "Luxury Chafing Dishes",
    "description": "Keep your meals warm, fresh, and ready to serve with the Ejshe Food Warmer. Designed with a stylish and durable finish, it is perfect for homes, restaurants, catering services, and events. It helps maintain food temperature while adding an elegant touch to your dining setup.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-946fde4d5b5dc939.jpeg",
    "features": [
      "Double pan compartment",
      "Roll-top hydraulic 180° opening",
      "Mirror-finish polished stainless steel",
      "Dual fuel gel burners"
    ],
    "priceRange": "₦380,000",
    "price": 380000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782489460426",
    "name": "Ejshe Food Warmer",
    "category": "Coolers & Storage",
    "description": "A premium luxury food warmer designed to keep your meals hot and fresh for longer. Featuring an elegant design, durable build, and stylish finish, the Ejshe Food Warmer is perfect for buffets, events, restaurants, and sophisticated home dining. Combines functionality with a beautiful presentation style.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-442dac0a74ff0577.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "380,000",
    "price": 380000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782464716085",
    "name": "Ejshe gold Food Warmer",
    "category": "Coolers & Storage",
    "description": "Ejshe Gold Food Warmer, designed to keep food warm while adding a touch of luxury to your dining and buffet setup. Its elegant gold finish, durable construction, and premium craftsmanship make it ideal for homes, hotels, restaurants, catering services, and special events.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-7d9ee59ac60390a5.jpeg",
    "features": [
      "Elegant premium gold finish Keeps food warm and ready to serve Durable",
      "high-quality construction Stylish design for buffets and celebrations Easy to clean and maintain Perfect for homes",
      "hotels",
      "restaurants",
      "catering",
      "and events"
    ],
    "priceRange": "380000",
    "price": 380000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782489537338",
    "name": "Food cover",
    "category": "Utensils & Accessories",
    "description": "A stylish and practical food cover designed to protect your meals while maintaining freshness and hygiene. Perfect for dining tables, buffets, restaurants, and events, it adds an elegant finishing touch to your food presentation while keeping food safe and ready to serve.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-5f096b32996640bb.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "15,000",
    "price": 15000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782523652218",
    "name": "Forakin food warmer",
    "category": "Luxury Chafing Dishes",
    "description": "Crafted with a premium finish, durable design, and stylish look — perfect for homes, events, and hospitality use.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-c7bea01a3445e725.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "150000",
    "price": 150000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782464836246",
    "name": "Forever gold oval",
    "category": "Coolers & Storage",
    "description": "Forever Gold Oval Big Size Food Warmer. Featuring a luxurious gold finish and a spacious oval design, it is perfect for serving large portions while keeping meals warm and fresh. Built for durability and style, it is ideal for homes, hotels, restaurants, catering services, weddings, and special occasions.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-31625206bb3cbbbd.jpeg",
    "features": [
      "Premium gold finish with an elegant oval design Large capacity for serving bigger portions Keeps food warm and fresh for longer Durable",
      "high-quality construction Easy to clean and maintain"
    ],
    "priceRange": "₦320,000",
    "price": 320000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782471616666",
    "name": "Fruit stand",
    "category": "Utensils & Accessories",
    "description": "Display your fruits in style with our elegant Luxury Gold Fruit Stand. Crafted with a premium gold-finished frame and a durable ceramic serving plate, it combines beauty and functionality to enhance your dining table, kitchen, or event décor. Perfect for serving fresh fruits, snacks, pastries, and treats with a touch of sophistication.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-be39140a43c32a1d.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "25000",
    "price": 25000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782413564319",
    "name": "Fursan Luxury Dubai Food warmer",
    "category": "Luxury Chafing Dishes",
    "description": "**Fursan Luxury Dubai Food Warmer**\n\nServe your meals in style with the Fursan Luxury Dubai Food Warmer. Designed with elegance and durability, it keeps food warm and fresh while adding a premium touch to your dining setup. Perfect for homes, restaurants, catering, and special occasions.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-3695a3cab696e5fb.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "950,000",
    "price": 985000,
    "discountPrice": 950000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782464289079",
    "name": "Fursan set 3 food warmer",
    "category": "Coolers & Storage",
    "description": "Designed with a durable stainless steel inner bowl and premium insulated outer body, this elegant set is ideal for everyday family meals, parties, and special occasions. Its luxurious finish adds a stylish touch to any dining table while helping food stay hot for hours.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-bcdd15ae9c135ae2.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "650000",
    "price": 650000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782524747807",
    "name": "Luxury 32pcs dinner sets",
    "category": "Cookware Sets",
    "description": "A premium 32-piece dinner set designed to elevate your dining experience. Elegant, durable, and stylish — perfect for family dining, entertaining guests, and creating a sophisticated table setting.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-e123cc57a1131494.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "130000",
    "price": 130000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782524542344",
    "name": "Luxury 72pcs dinner sets",
    "category": "Premium Cooking Pots",
    "description": "A premium 72 piece dinner set designed to elevate your dining experience. Elegant, durable, and stylish perfect for family dining, entertaining guests, and creating a sophisticated table setting.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-a5d9762b4a20921d.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "330000",
    "price": 330000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782465122063",
    "name": "Luxury box Food Warmer",
    "category": "Coolers & Storage",
    "description": "Enhance your dining experience with the Luxury Box Food Warmer, designed to keep your meals warm while adding a sophisticated touch to your table setting. Its premium finish, durable construction, and elegant box design make it perfect for homes, hotels, restaurants, catering services, and special events.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-9fb390965a9fb01e.jpeg",
    "features": [
      "Elegant luxury box design Keeps food warm and fresh for longer Premium-quality",
      "durable construction Stylish finish to complement any buffet setup Easy to clean and maintain"
    ],
    "priceRange": "500,000",
    "price": 500000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782521188724",
    "name": "Luxury flower Deco",
    "category": "Utensils & Accessories",
    "description": "Elegant Luxury Flower Deco designed to add a touch of sophistication and beauty to any space. Perfect for homes, offices, hotels, and events, it brings timeless style with a premium decorative finish.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-45d82e3a97304502.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "70,000",
    "price": 70000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "prod-7",
    "name": "Luxury Gold ice bucket",
    "category": "Coolers & Storage",
    "description": "Add elegance to your drinks service with this premium Luxury Gold Ice Bucket. Designed with a stylish finish, it keeps beverages chilled while bringing a classy and sophisticated touch to homes, events, restaurants, and hospitality settings",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-0e50d4429cfa2c28.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "₦40,000",
    "price": 45000,
    "discountPrice": 40000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782519880231",
    "name": "Luxury quality stainless Trolley",
    "category": "Utensils & Accessories",
    "description": "A premium Luxury Quality Stainless Trolley crafted for elegance, durability, and effortless serving. Made with a sleek stainless finish, it is perfect for hotels, restaurants, catering services, and luxury events, providing smooth mobility and a sophisticated presentation for food, drinks, and serving essentials.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-2d681b88dca05a85.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "400,000",
    "price": 400000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782466510894",
    "name": "Luxury round diamond body dish",
    "category": "Luxury Chafing Dishes",
    "description": "Designed with a stunning diamond-textured body and a premium finish, this serving dish combines timeless beauty with everyday functionality. Its spacious round design is perfect for serving rice, soups, stews, salads, pasta, and other delicious meals, making it ideal for homes, parties, buffets, and special occasions",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-05db79762409842f.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "180,000",
    "price": 180000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782521843073",
    "name": "Luxury tray set",
    "category": "Utensils & Accessories",
    "description": "serving experience. Perfect for serving drinks, snacks, and special occasions with a touch of sophistication and class.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-8eae002fc0d3168b.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "60,000",
    "price": 60000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782521773182",
    "name": "Luxury tray set",
    "category": "Utensils & Accessories",
    "description": "serving experience. Perfect for serving drinks, snacks, and special occasions with a touch of sophistication and class.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-6313d200682cdf67.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "60,000",
    "price": 60000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782521885058",
    "name": "Luxury tray set",
    "category": "Utensils & Accessories",
    "description": "serving experience. Perfect for serving drinks, snacks, and special occasions with a touch of sophistication and class.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-aee7bf9c43c0042b.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "60,000",
    "price": 60000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782519346700",
    "name": "Luxury trolley",
    "category": "Utensils & Accessories",
    "description": "Luxury Trolley designed to add elegance and convenience to your serving experience. Perfect for hotels, restaurants, events, and upscale dining spaces, it offers smooth mobility, stylish presentation, and practical storage for serving food, drinks, and catering essentials.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-696fad5747937518.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "400,000",
    "price": 400000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782464435968",
    "name": "Luxury trolley",
    "category": "Utensils & Accessories",
    "description": "Elevate your serving experience with this premium luxury trolley, crafted with a sleek modern design and durable construction.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-8624e2eef3adb1b3.jpeg",
    "features": [
      "Premium luxury finish Strong and durable construction Smooth-rolling wheels for easy mobility Spacious multi-tier storage Perfect for serving",
      "display",
      "and entertaining Suitable for homes",
      "hotels",
      "restaurants",
      "and events"
    ],
    "priceRange": "500000",
    "price": 500000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782490103018",
    "name": "Luxury trolleys",
    "category": "Luxury Chafing Dishes",
    "description": "A premium luxury trolley designed for elegant food service and presentation. Built with a stylish finish, smooth mobility, and durable structure, it is perfect for hotels, restaurants, events, and luxury dining setups. Adds convenience, sophistication, and a professional touch to every serving experience.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-696fad5747937518.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "4000",
    "price": 40000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782490101669",
    "name": "Luxury trolleys",
    "category": "Luxury Chafing Dishes",
    "description": "A premium luxury trolley designed for elegant food service and presentation. Built with a stylish finish, smooth mobility, and durable structure, it is perfect for hotels, restaurants, events, and luxury dining setups. Adds convenience, sophistication, and a professional touch to every serving experience.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-696fad5747937518.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "4000",
    "price": 40000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782519386293",
    "name": "Luxury trolleys",
    "category": "Utensils & Accessories",
    "description": "Luxury Trolley designed to add elegance and convenience to your serving experience. Perfect for hotels, restaurants, events, and upscale dining spaces, it offers smooth mobility, stylish presentation, and practical storage for serving food, drinks, and catering essentials.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-a699cdece3898587.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "400,000",
    "price": 400000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782465608958",
    "name": "Partition cooler's 350k",
    "category": "Coolers & Storage",
    "description": "Keep your beverages perfectly chilled and neatly organized with our premium Partition Cooler. Designed with multiple compartments for easy separation of drinks, it is ideal for homes, events, restaurants, and catering services. Its durable construction, excellent cooling performance, and stylish finish make it a practical and elegant addition to any space.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-db0157c4fc3ff59d.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "350,000",
    "price": 350000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782420255387",
    "name": "Piesco Dubai Food Warmer",
    "category": "Coolers & Storage",
    "description": "Premium food warmer designed to keep meals hot and fresh for longer. It features an elegant Dubai-style design, durable finishing, and is suitable for serving rice, soups, stews, sauces, and other dishes at homes, events, restaurants, and catering setups.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-991a4e4c78e93bae.jpeg",
    "features": [
      "Stylish luxury appearance Keeps food warm and ready to serve Durable stainless-steel construction Ideal for buffet",
      "parties",
      "and daily use Easy to clean and maintain"
    ],
    "priceRange": "550,000",
    "price": 550000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782522680913",
    "name": "Raindrop Chaffing Dish",
    "category": "Luxury Chafing Dishes",
    "description": "Elegant raindrop-inspired chaffing dish with a luxurious finish, designed to keep food warm while adding a stylish touch to any event, banquet, or dining setup.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-500668ce995db140.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "110,000",
    "price": 110000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782489363350",
    "name": "Rctangle chaffing dish",
    "category": "Luxury Chafing Dishes",
    "description": "stylish and elegant rectangular chaffing dish designed for premium food presentation. Featuring a durable wooden base with a sophisticated finish, it adds a luxury touch to buffets, events, restaurants, and home dining.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-2ac1a9d1d3decc2c.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "140,000",
    "price": 140000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "prod-5",
    "name": "Single Fruit Stand",
    "category": "Utensils & Accessories",
    "description": "Elegant and durable fruit stand designed to beautifully display and serve fruits, snacks, and refreshments. Perfect for homes, restaurants, events, and hospitality settings, adding a stylish touch to any table or space.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-8df941dfaf38a74d.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "₦45,000",
    "price": 45000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782524195034",
    "name": "Single Glass Tray",
    "category": "Utensils & Accessories",
    "description": "Elegant glass serving tray with a premium design, perfect for serving drinks, snacks, and displaying items in style. A beautiful addition to modern homes, events, and luxury dining setups.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-6e9e892a9b91b551.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "50,000",
    "price": 50000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782472064823",
    "name": "Single luxury chaffing dish",
    "category": "Luxury Chafing Dishes",
    "description": "Serve every meal with elegance using our Single Luxury Chafing Dish. Designed with a premium finish and exceptional heat retention, it keeps food warm while adding a sophisticated touch to your buffet, catering service, or dining table. Ideal for parties, weddings, restaurants, and special occasions, it combines style, durability, and functionality for an outstanding serving experience.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-bed350b11017c36d.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "130,000",
    "price": 130000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782472316288",
    "name": "Single plate with wooden handle",
    "category": "Utensils & Accessories",
    "description": "Serve and present your favorite dishes with elegance using our Single Plate with Wooden Handle. Designed with a premium serving plate and a stylish wooden handle",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-4fd8f9289ef4e253.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "12,000",
    "price": 12000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782523874562",
    "name": "Sonifer Gold Kettle",
    "category": "Luxury Chafing Dishes",
    "description": "Elegant gold stainless steel kettle designed with a premium finish for stylish tea and beverage serving. Durable, eye-catching, and perfect for adding a touch of luxury to your kitchen or dining setup.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-d95cfcba1026a423.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "25000",
    "price": 25000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782520272336",
    "name": "Southwest food warmer 4,5,6 liters",
    "category": "Coolers & Storage",
    "description": "The Southwest Food Warmer is a stylish and premium food serving solution designed to keep meals warm and fresh for longer. Available in 4L, 5L, and 6L sizes, it is perfect for homes, restaurants, hotels, catering, and events. Featuring an elegant design, durable build, and excellent heat retention for a luxurious dining experience.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-09e12aa984724fda.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "300,000",
    "price": 300000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782112854133",
    "name": "Southwest food warmer 4,5,6 liters",
    "category": "Coolers & Storage",
    "description": "Southwest food warmer 4,5,6 liters",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-14b4d90f9eaa09a0.jpeg",
    "features": [
      "Direct from Dubai"
    ],
    "priceRange": "300000",
    "price": 350000,
    "discountPrice": 300000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "prod-4",
    "name": "Thermocool food warmer",
    "category": "Premium Cooking Pots",
    "description": "Thermocool Food Warmer – Keep your meals warm, fresh, and ready to serve with a reliable design perfect for homes, restaurants, and events.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-8f43fedb619f1fee.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "300,000",
    "price": 300000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782522407712",
    "name": "UCC LIFE POT",
    "category": "Premium Cooking Pots",
    "description": "Elegant and durable food storage pot designed with a modern textured finish, secure lid, and convenient handles. Perfect for keeping food fresh, organized, and stylish in any kitchen.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-d3f12abbf61ed878.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "140,000",
    "price": 140000,
    "stockStatus": "In Stock",
    "rating": 4.8
  },
  {
    "id": "rzk-prod-1782489295853",
    "name": "Wooden rectangle chaffing dish",
    "category": "Luxury Chafing Dishes",
    "description": "stylish and elegant rectangular chaffing dish designed for premium food presentation. Featuring a durable wooden base with a sophisticated finish, it adds a luxury touch to buffets, events, restaurants, and home dining.",
    "image": "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/product-26a11abe3ef90c36.jpeg",
    "features": [
      "Premium quality",
      "Imported kitchenware"
    ],
    "priceRange": "140,000",
    "price": 140000,
    "stockStatus": "In Stock",
    "rating": 4.8
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Mrs. Funmi Adebayo",
    role: "CEO & Executive Caterer, Adebayo Events",
    location: "Lekki, Lagos",
    feedback: "Rozay Kitchen is my absolute number-one supplier! Their gold-accented chafing dishes are of exceptional quality and they have been keeping my wedding buffet setups incredibly elegant and warm for years."
  },
  {
    id: "test-2",
    name: "Mr. Emeka Okafor",
    role: "Proprietor, Golden Spoon Restaurant Group",
    location: "Ikeja, Lagos",
    feedback: "We bought all our heavy-duty commercial kitchen mixers, pots, and commercial blenders here. The durability under extreme daily restaurant usage is outstanding, and the customer service was highly professional!"
  },
  {
    id: "test-3",
    name: "Amara Nwachukwu",
    role: "Food Blogger & Enthusiast Home Chef",
    location: "Surulere, Lagos",
    feedback: "I am totally in love with my luxury non-stick pot set! The copper rose-gold color matches my kitchen interior flawlessly. Food slides off beautifully, and it feels premium without breaking the bank."
  },
  {
    id: "test-4",
    name: "Alhaji Ibrahim Musa",
    role: "Director of Facilities, Eko Horizon Suites",
    location: "Victoria Island, Lagos",
    feedback: "When equipping our new buffet line, we came directly to Ebutero Market and located Rozay Kitchen. They supplied us with state-of-the-art hospitality equipment and trays. Wholesale pricing and swift Lagos delivery."
  }
];

export const DEFAULT_CEO_VIDEO_CONFIG = {
  id: "ceo-video-featured",
  title: "CEO Product Showcase & Live Demonstration",
  subtitle: "Join Founder & CEO Alaekwe Onyebuchi as he walks through the engineering, gold finish, and roll-top durability of our signature chafing dishes.",
  videoUrl: "https://kzssompfuuzxauriebql.supabase.co/storage/v1/object/public/product-images/site-assets/rozay_kitchen_hero_1781992826699.jpg", // Default showcase media / video file
  videoType: "url" as const,
  posterUrl: "https://i.ibb.co/gbjcKSgb/Whats-App-Image-2026-08-13-at-17-09-03.jpg",
  featuredProductId: "rzk-prod-1782520037343", // 10 litres chaffing dish
  ceoName: "Alaekwe Onyebuchi",
  ceoTitle: "Founder & CEO, Rozay Kitchen",
  description: "Watch a personal demonstration from our CEO on how to inspect, set up, and maintain our heavy-duty roll-top gold luxury chafing dishes for 5-star catering and luxury buffet events across Nigeria.",
  talkingPoints: [
    "Premium 304 food-grade surgical stainless steel construction",
    "180° smooth hydraulic roll-top lid with tempered gold ergonomic handle",
    "Dual high-efficiency fuel holders with water-pan heat retention",
    "Wholesale Lagos Island dispatch with guaranteed countrywide delivery"
  ],
  isActive: true
};
