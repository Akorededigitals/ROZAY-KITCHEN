import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Product } from "../types";

interface SEOTagsProps {
  products?: Product[];
}

export default function SEOTags({ products = [] }: SEOTagsProps) {
  const location = useLocation();

  useEffect(() => {
    const siteUrl = "https://rozaykitchen.com";
    let title = "Rozay Kitchen | Premium Kitchenware & Catering Equipment in Lagos, Nigeria";
    let metaDescription = "Shop luxury chafing dishes, premium cookware sets, commercial pots, coolers, and kitchen appliances in Lagos, Nigeria with nationwide dispatch.";
    let canonicalUrl = `${siteUrl}${location.pathname}`;
    let ogImage = `${siteUrl}/images/rozay_kitchen_hero_1781992826699.jpg`;
    let ogType = "website";
    let schemaJson: any = null;

    if (location.pathname === "/") {
      title = "Rozay Kitchen | Premium Kitchenware, Luxury Chafing Dishes & Catering Equipment in Lagos";
      metaDescription = "Shop luxury chafing dishes, cookware sets, commercial pots, coolers & kitchen appliances in Idumota, Lagos. Nationwide delivery across Nigeria.";
      canonicalUrl = `${siteUrl}/`;
    } else if (location.pathname === "/shop" || location.pathname === "/products") {
      title = "Buy Luxury Kitchenware & Commercial Catering Equipment | Rozay Kitchen Lagos";
      metaDescription = "Browse all luxury chafing dishes, non-stick cooking pots sets, commercial coolers, food warmers & kitchen appliances. Wholesale & retail prices in Nigeria.";
      canonicalUrl = `${siteUrl}/shop`;
    } else if (location.pathname.startsWith("/category/")) {
      const cat = location.pathname.split("/").pop();
      const formattedCat = cat ? cat.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Category";
      title = `${formattedCat} in Lagos | Buy Kitchenware & Catering Equipment | Rozay Kitchen`;
      metaDescription = `Explore our collection of ${formattedCat.toLowerCase()} at Rozay Kitchen Lagos. Top-grade durability, wholesale pricing, and express delivery in Nigeria.`;
      canonicalUrl = `${siteUrl}/category/${cat}`;
    } else if (location.pathname === "/about") {
      title = "About Rozay Kitchen | Premier Kitchenware Showroom in Idumota, Lagos Island";
      metaDescription = "Founded by Alaekwe Onyebuchi, Rozay Kitchen is Lagos' top supplier of luxury chafing dishes, commercial cookware, and catering gear.";
      canonicalUrl = `${siteUrl}/about`;
      ogImage = `${siteUrl}/images/ceo_alaekwe_onyebuchi.jpg`;
    } else if (location.pathname === "/track") {
      title = "Track Your Kitchenware Order | Rozay Kitchen Lagos";
      metaDescription = "Track the real-time fulfillment and nationwide delivery status of your Rozay Kitchen orders across Lagos and all Nigerian states.";
      canonicalUrl = `${siteUrl}/track`;
    } else if (location.pathname === "/contact" || location.pathname === "/location") {
      title = "Contact & Showroom Location | Idumota Lagos Island | Rozay Kitchen";
      metaDescription = "Visit our showroom in Idumota Commercial Hub, Lagos Island or order via WhatsApp for same-day dispatch.";
      canonicalUrl = `${siteUrl}/contact`;
    } else if (location.pathname.startsWith("/product/")) {
      const productId = location.pathname.split("/").pop();
      const product = products.find(p => p.id === productId);
      if (product) {
        const priceNumber = Number(product.discountPrice || product.price || 0);
        title = `${product.name} (₦${priceNumber.toLocaleString()}) | Rozay Kitchen Lagos`;
        metaDescription = `Buy ${product.name} at Rozay Kitchen in Lagos, Nigeria. Category: ${product.category}. In-stock with nationwide courier dispatch.`;
        if (product.image) {
          ogImage = product.image.startsWith("http") ? product.image : `${siteUrl}${product.image}`;
        }
        ogType = "product";
        canonicalUrl = `${siteUrl}/product/${product.id}`;

        // Schema.org Product Structured Data for Google Rich Snippets
        schemaJson = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": [ogImage],
          "description": `${product.name} - Premium ${product.category} available at Rozay Kitchen Lagos.`,
          "brand": {
            "@type": "Brand",
            "name": "Rozay Kitchen"
          },
          "offers": {
            "@type": "Offer",
            "url": canonicalUrl,
            "priceCurrency": "NGN",
            "price": priceNumber.toString(),
            "priceValidUntil": "2027-12-31",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
              "@type": "Organization",
              "name": "Rozay Kitchen"
            }
          }
        };
      } else {
        title = "Product Details | Rozay Kitchen Lagos";
        metaDescription = "High quality catering equipment and cookware products available at Rozay Kitchen in Lagos, Nigeria.";
      }
    } else if (location.pathname === "/checkout") {
      title = "Secure Checkout | Rozay Kitchen";
      metaDescription = "Complete your secure order for premium kitchen equipment at Rozay Kitchen.";
    } else if (location.pathname === "/terms") {
      title = "Terms & Conditions | Rozay Kitchen";
      metaDescription = "Read the official terms and conditions for orders and transactions at Rozay Kitchen.";
    } else if (location.pathname === "/privacy") {
      title = "Privacy Policy | Rozay Kitchen";
      metaDescription = "Read the official privacy policy and data security guidelines of Rozay Kitchen.";
    } else if (location.pathname === "/refund") {
      title = "Refund & Exchange Policy | Rozay Kitchen";
      metaDescription = "Learn about product inspections, warranty and refund policies at Rozay Kitchen.";
    }

    // 1. Update Document Title
    document.title = title;

    // 2. Helper to create or update meta tags
    const setMeta = (attr: "name" | "property", key: string, value: string) => {
      let elem = document.querySelector(`meta[${attr}="${key}"]`);
      if (!elem) {
        elem = document.createElement("meta");
        elem.setAttribute(attr, key);
        document.head.appendChild(elem);
      }
      elem.setAttribute("content", value);
    };

    // Standard Meta
    setMeta("name", "description", metaDescription);
    setMeta("name", "title", title);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", metaDescription);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:type", ogType);

    // Twitter
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", metaDescription);
    setMeta("name", "twitter:image", ogImage);
    setMeta("name", "twitter:url", canonicalUrl);

    // 3. Update Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonicalUrl);

    // 4. Dynamic JSON-LD injection for Product page
    const existingDynamicScript = document.getElementById("seo-dynamic-product-jsonld");
    if (existingDynamicScript) {
      existingDynamicScript.remove();
    }

    if (schemaJson) {
      const script = document.createElement("script");
      script.id = "seo-dynamic-product-jsonld";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schemaJson);
      document.head.appendChild(script);
    }
  }, [location.pathname, products]);

  return null;
}

