import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Product } from "../types";

interface SEOTagsProps {
  products?: Product[];
}

export default function SEOTags({ products = [] }: SEOTagsProps) {
  const location = useLocation();

  useEffect(() => {
    let title = "Rozay Kitchen | Premium Kitchen & Catering Equipment in Lagos";
    let metaDescription = "Lagos' premium destination for luxurious kitchen commodities, cooking pans, cookwares, coolers, and professional catering electronics in Idumota Market.";

    if (location.pathname === "/") {
      title = "Rozay Kitchen | Premium Kitchenware & Catering Equipment, Lagos";
      metaDescription = "Shop top-quality kitchen appliances, luxurious cookware, and professional catering equipment in Lagos, Nigeria. Fast delivery nationwide.";
    } else if (location.pathname === "/shop") {
      title = "Shop All Products | Rozay Kitchen";
      metaDescription = "Browse our extensive collection of premium kitchen and catering equipment, including pans, coolers, and professional electronics.";
    } else if (location.pathname.startsWith("/category/")) {
      const cat = location.pathname.split("/").pop();
      const formattedCat = cat ? cat.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) : "Category";
      title = `${formattedCat} | Premium Kitchen Equipment | Rozay Kitchen`;
      metaDescription = `Shop the best ${formattedCat.toLowerCase()} for your home and professional catering needs at Rozay Kitchen Lagos.`;
    } else if (location.pathname === "/about") {
      title = "About Us | Company Profile | Rozay Kitchen";
      metaDescription = "Learn more about Rozay Kitchen, Lagos' trusted supplier of premium kitchen and catering equipment located in the heart of Idumota Market.";
    } else if (location.pathname === "/contact") {
      title = "Contact Us | Physical Office & WhatsApp | Rozay Kitchen";
      metaDescription = "Get in touch with Rozay Kitchen via WhatsApp, email, or visit our physical store in Idumota Market, Lagos.";
    } else if (location.pathname.startsWith("/product/")) {
      const productId = location.pathname.split("/").pop();
      const product = products.find(p => p.id === productId);
      if (product) {
        title = `${product.name} | ${product.category} | Rozay Kitchen`;
        metaDescription = `Buy ${product.name} from Rozay Kitchen. Premium ${product.category.toLowerCase()} equipment. ${product.description.substring(0, 100)}...`;
      } else {
        title = "Product Details | Premium Quality | Rozay Kitchen";
        metaDescription = "Discover high-quality kitchen and catering equipment designed for durability and performance. Order now for nationwide delivery.";
      }
    } else if (location.pathname === "/checkout") {
      title = "Secure Checkout | Rozay Kitchen";
      metaDescription = "Complete your secure order for premium kitchen equipment at Rozay Kitchen.";
    }

    document.title = title;

    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "description");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", metaDescription);
  }, [location.pathname, products]);

  return null;
}
