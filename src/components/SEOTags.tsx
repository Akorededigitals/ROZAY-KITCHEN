import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function SEOTags() {
  const location = useLocation();

  let title = "Rozay Kitchen | Premium Kitchen & Catering Equipment in Lagos";
  let metaDescription = "Lagos' premium destination for luxurious kitchen commodities, cooking pans, cookwares, coolers, and professional catering electronics in Idumota Market.";
  let url = `https://rozaykitchen.com${location.pathname}`;

  switch (true) {
    case location.pathname === "/":
      title = "Rozay Kitchen | Premium Kitchenware & Catering Equipment, Lagos";
      metaDescription = "Shop top-quality kitchen appliances, luxurious cookware, and professional catering equipment in Lagos, Nigeria. Fast delivery nationwide.";
      break;
    case location.pathname === "/shop":
      title = "Shop All Products | Rozay Kitchen";
      metaDescription = "Browse our extensive collection of premium kitchen and catering equipment, including pans, coolers, and professional electronics.";
      break;
    case location.pathname.startsWith("/category/"):
      const cat = location.pathname.split("/").pop();
      const formattedCat = cat ? cat.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) : "Category";
      title = `${formattedCat} | Premium Kitchen Equipment | Rozay Kitchen`;
      metaDescription = `Shop the best ${formattedCat.toLowerCase()} for your home and professional catering needs at Rozay Kitchen Lagos.`;
      break;
    case location.pathname === "/about":
      title = "About Us | Company Profile | Rozay Kitchen";
      metaDescription = "Learn more about Rozay Kitchen, Lagos' trusted supplier of premium kitchen and catering equipment located in the heart of Idumota Market.";
      break;
    case location.pathname === "/contact":
      title = "Contact Us | Physical Office & WhatsApp | Rozay Kitchen";
      metaDescription = "Get in touch with Rozay Kitchen via WhatsApp, email, or visit our physical store in Idumota Market, Lagos.";
      break;
    case location.pathname.startsWith("/product/"):
      title = "Product Details | Premium Quality | Rozay Kitchen";
      metaDescription = "Discover high-quality kitchen and catering equipment designed for durability and performance. Order now for nationwide delivery.";
      break;
    case location.pathname === "/checkout":
      title = "Secure Checkout | Rozay Kitchen";
      metaDescription = "Complete your secure order for premium kitchen equipment at Rozay Kitchen.";
      break;
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content="kitchen equipment, catering electronics, cookwares, cooking pans, coolers, Idumota Market, Lagos, Nigeria, kitchen commodities, premium kitchenware" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={location.pathname.startsWith("/product/") ? "product" : "website"} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content="https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=1200&h=630" />
      <meta property="og:site_name" content="Rozay Kitchen" />
      <meta property="og:locale" content="en_NG" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content="https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=1200&h=630" />

      <link rel="canonical" href={url} />
    </Helmet>
  );
}
