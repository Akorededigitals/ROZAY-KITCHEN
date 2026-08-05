import { Product, Testimonial } from "./types";

const HERO_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Balogun_Market%2C_Lagos_Island.jpg/1280px-Balogun_Market%2C_Lagos_Island.jpg";

export const BRAND_INFO = {
  name: "Rozay Kitchen",
  tagline: "Bringing Quality, Style, and Functionality to Every Kitchen.",
  location: "Idumota, Block N, shop 89,90,91,92 New Pepsi Building, Merciful line. Ebute-ero Market Gorodom, Lagos Island, 101001, Lagos",
  hours: {
    weekdays: "Monday – Saturday: 8:00 AM – 6:00 PM",
    sunday: "Sunday: Closed"
  },
  socials: {
    instagram: "https://www.instagram.com/rozay_kitchen_",
    tiktok: "https://www.tiktok.com/@rozaykitchen860"
  },
  hero: {
    headline: "Premium Kitchen Appliances & Catering Equipment in Lagos",
    subheadline: "Discover high-quality chafing dishes, cookware, cooking pots, catering tools, coolers, and kitchen appliances trusted by homes, restaurants, and hospitality businesses across Nigeria.",
    image: HERO_IMAGE
  },
  about: "Rozay Kitchen is a trusted destination for high-quality kitchen appliances, cookware, and catering equipment in Lagos, Nigeria. Conveniently located in Idumota, Block N, shop 89,90,91,92 New Pepsi Building, Merciful line. Ebute-ero Market Gorodom, Lagos Island, we have built a reputation for providing premium kitchen solutions at competitive prices.\n\nWe specialize in a wide range of products, including elegant chafing dishes, durable cooking pots, cookware, catering tools, coolers, and reliable kitchen electronics designed to meet the needs of homes, restaurants, caterers, hotels, and hospitality businesses.\n\nAt Rozay Kitchen, we believe that every kitchen deserves products that combine functionality, durability, and style. Our commitment to quality, affordability, and exceptional customer service has made us a preferred choice for customers seeking modern kitchen solutions.\n\nWhether you are equipping a new kitchen, upgrading your catering business, or searching for premium cookware, Rozay Kitchen is dedicated to helping you find the perfect products for your needs.",
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

export const PRODUCTS_DATA: Product[] = [];

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
