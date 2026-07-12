import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import WhyChooseUs from "./components/WhyChooseUs";
import ProductCatalog from "./components/ProductCatalog";
import TestimonialsSection from "./components/TestimonialsSection";
import LocationShowcase from "./components/LocationShowcase";
import TrackOrderSection from "./components/TrackOrderSection";
import TrackOrderView from "./components/TrackOrderView";
import InquiryCartDrawer from "./components/InquiryCartDrawer";
import AdminDashboard from "./components/AdminDashboard";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import CheckoutView from "./components/CheckoutView";
import OrderSuccessView from "./components/OrderSuccessView";
import ProductDetailView from "./components/ProductDetailView";
import BackToTop from "./components/BackToTop";
import RefundPolicy from "./components/RefundPolicy";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import ScrollToTop from "./components/ScrollToTop";
import SEOTags from "./components/SEOTags";
import { Toaster } from "react-hot-toast";
import { Product, InquiryItem, Order } from "./types";
import { PRODUCTS_DATA, BRAND_INFO } from "./data";
import { ChefHat, MapPin, Settings, Instagram, Facebook, Mail, Phone } from "lucide-react";
import { getDbProducts, addDbProduct, updateDbProduct, deleteDbProduct } from "./lib/supabase";

function CategoryWrapper({ products, cartItems, onAddToCart, onRemoveFromCart, onUpdateCartQuantity, onViewProductDetail }: any) {
  const location = useLocation();
  const categoryPath = location.pathname.split("/").pop();
  let defaultCategory = "All";
  if (categoryPath === "chafing-dishes") defaultCategory = "Chafing Dishes";
  else if (categoryPath === "cooking-pots") defaultCategory = "Cooking Pots";
  else if (categoryPath === "catering-equipment") defaultCategory = "Catering Equipment";
  else if (categoryPath === "coolers-storage") defaultCategory = "Coolers & Storage";
  else if (categoryPath === "kitchen-appliances") defaultCategory = "Kitchen Appliances";

  return (
    <ProductCatalog
      key={defaultCategory} // force re-render when category changes
      products={products}
      cartItems={cartItems}
      onAddToCart={onAddToCart}
      onRemoveFromCart={onRemoveFromCart}
      onUpdateCartQuantity={onUpdateCartQuantity}
      onViewProductDetail={onViewProductDetail}
      defaultCategory={defaultCategory}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState<InquiryItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDetailedProduct, setSelectedDetailedProduct] = useState<Product | null>(null);
  const [activeCompletedOrder, setActiveCompletedOrder] = useState<Order | null>(null);

  // Load products list from cache or database (Supabase / Local fallback)
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [isLoadingDbProducts, setIsLoadingDbProducts] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetched = await getDbProducts(PRODUCTS_DATA);
        setProducts(fetched);
      } catch (e) {
        console.warn("Error resolving db products", e);
      } finally {
        setIsLoadingDbProducts(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddProduct = async (newProd: Omit<Product, "id">) => {
    try {
      const added = await addDbProduct(newProd);
      setProducts(prev => [added, ...prev]);
    } catch (e) {
      console.error("App add item failure", e);
      alert("Failed to add product. Please check your connection and try again.");
    }
  };

  const handleEditProduct = async (editedProd: Product) => {
    try {
      await updateDbProduct(editedProd);
      setProducts(prev => prev.map(p => p.id === editedProd.id ? editedProd : p));
    } catch (e) {
      console.error("App edit item failure", e);
      alert("Failed to edit product. Please check your connection and try again.");
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    try {
      await deleteDbProduct(prodId);
      setProducts(prev => prev.filter(p => p.id !== prodId));
    } catch (e) {
      console.error("App delete item failure", e);
      alert("Failed to delete product. Please check your connection and try again.");
    }
  };

  const handleResetToDefault = () => {
    setProducts(PRODUCTS_DATA);
    alert("Products reset to default local catalog successfully.");
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleClearCart = () => setCartItems([]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isCheckoutMode = location.pathname.startsWith('/checkout') || location.pathname.startsWith('/order-success') || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-950 font-sans selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden antialiased">
      <ScrollToTop />
      <SEOTags products={products} />
      <Toaster position="top-center" />
      
      {/* Universal Sticky Header Navigation */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => {
          if (location.pathname === "/admin") {
            navigate("/");
          } else {
            navigate("/admin");
          }
        }}
        currentView={location.pathname === "/" ? "home" : location.pathname.replace(/^\//, "") as any}
        onNavigate={(newView) => {
          if (newView === "home") navigate("/");
          else if (newView === "products") navigate("/shop");
          else navigate(`/${newView}`);
        }}
      />

      {/* Main Pages Scaffolding */}
      <main className="relative">
        <Routes>
          <Route path="/" element={
            <>
              {/* Modern Immersive Hero Presentation */}
              <Hero onShopNow={() => navigate("/shop")} />
              {/* Corporate Profile Story Section */}
              <AboutSection />
              {/* Bento Board Market Advantages */}
              <WhyChooseUs />
              {/* Track Order Lookup */}
              <TrackOrderSection />
              {/* Client Testimonials */}
              <TestimonialsSection />
              {/* Idumota Location Hub Showcase & Form Messages */}
              <LocationShowcase />
            </>
          } />
          
          <Route path="/track" element={<TrackOrderView />} />

          <Route path="/shop" element={
            <div className="pt-24 pb-16">
              <ProductCatalog
                products={products}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateCartQuantity={handleUpdateCartQuantity}
                onViewProductDetail={(prod) => {
                  setSelectedDetailedProduct(prod);
                  navigate(`/product/${prod.id}`);
                }}
              />
            </div>
          } />

          <Route path="/category/:categoryId" element={
            <div className="pt-24 pb-16">
              <CategoryWrapper 
                products={products}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateCartQuantity={handleUpdateCartQuantity}
                onViewProductDetail={(prod: Product) => {
                  setSelectedDetailedProduct(prod);
                  navigate(`/product/${prod.id}`);
                }}
              />
            </div>
          } />
          
          <Route path="/product/:id" element={
            selectedDetailedProduct ? (
              <ProductDetailView
                product={selectedDetailedProduct}
                allProducts={products}
                onBack={() => navigate(-1)}
                onAddToCart={(prod, qty) => {
                  handleAddToCart(prod, qty);
                }}
                onInstantBuy={(prod) => {
                  setCartItems((prevItems) => {
                    const existing = prevItems.find(item => item.product.id === prod.id);
                    if (existing) {
                      return prevItems.map(item =>
                        item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
                      );
                    }
                    return [...prevItems, { product: prod, quantity: 1 }];
                  });
                  navigate("/checkout");
                }}
              />
            ) : (
              <div className="pt-32 pb-16 text-center text-gray-500">
                Product not found. <button onClick={() => navigate("/shop")} className="text-brand-500 underline ml-2">Back to shop</button>
              </div>
            )
          } />

          <Route path="/about" element={
            <div className="pt-24 pb-16">
              <AboutSection />
              <WhyChooseUs />
            </div>
          } />
          
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          
          <Route path="/contact" element={
            <div className="pt-24 pb-16">
              <LocationShowcase />
            </div>
          } />

          <Route path="/admin" element={
            <AdminDashboard
              products={products}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onResetToDefault={handleResetToDefault}
              onClose={() => navigate("/")}
            />
          } />

          <Route path="/checkout" element={
            <CheckoutView
              cartItems={cartItems}
              onUpdateQty={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onBack={() => navigate(-1)}
              onOrderSuccess={(orderObj) => {
                setActiveCompletedOrder(orderObj);
                navigate("/order-success");
              }}
            />
          } />

          <Route path="/order-success" element={
            activeCompletedOrder ? (
              <OrderSuccessView
                order={activeCompletedOrder}
                onReturnToShop={() => {
                  navigate("/");
                  setActiveCompletedOrder(null);
                }}
              />
            ) : (
              <div className="pt-32 pb-16 text-center text-gray-500">
                No active order found. <button onClick={() => navigate("/")} className="text-brand-500 underline ml-2">Return Home</button>
              </div>
            )
          } />
        </Routes>
      </main>

      {/* Slide-out Inquiry Cart */}
      <InquiryCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateCartQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          navigate("/checkout");
        }}
      />

      {/* Floating Interactive WhatsApp Chat */}
      {!isCheckoutMode && (
        <FloatingWhatsApp />
      )}

      {/* Corporate Visual Footer */}
      <footer className="bg-stone-950 text-stone-300 py-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-sm">
            
            {/* Column 1: Brand details */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center text-white">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M 50 90 C 25 90 15 75 15 65 C 15 55 25 45 35 45 L 35 55 C 28 55 25 60 25 65 C 25 70 30 78 50 78 C 70 78 75 70 75 65 L 75 50 L 50 50 L 50 42 L 85 42 L 85 65 C 85 75 75 90 50 90 Z" fill="currentColor" />
                    <path d="M 20 60 L 20 25 L 35 40 L 50 25 L 65 40 L 80 25 L 80 60 L 72 60 L 72 35 L 65 43 L 50 28 L 35 43 L 28 35 L 28 60 Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-serif font-black text-xl leading-none tracking-widest text-white block">
                    ROZAY
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-sans font-medium text-stone-400 block leading-tight mt-0.5">
                    God Is The Greatest
                  </span>
                </div>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                Lagos' premium destination for luxurious kitchen commodities. High-quality cooking pans, cookwares, coolers, and professional catering electronics in Idumota Market.
              </p>
              <p className="text-[11px] text-stone-500 font-mono tracking-wide">
                "{BRAND_INFO.tagline || "Bringing Quality, Style, and Functionality to Every Kitchen."}"
              </p>
            </div>

            {/* Column 2: Quick Explore Links */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider font-poppins">
                Explore
              </h4>
              <ul className="space-y-3 text-xs">
                <li><button onClick={() => navigate("/shop")} className="hover:text-white hover:underline transition-colors cursor-pointer">All Categories</button></li>
                <li><button onClick={() => navigate("/category/chafing-dishes")} className="hover:text-white hover:underline transition-colors cursor-pointer">Chafing Dishes</button></li>
                <li><button onClick={() => navigate("/category/cooking-pots")} className="hover:text-white hover:underline transition-colors cursor-pointer">Cooking Pots</button></li>
                <li><button onClick={() => navigate("/about")} className="hover:text-white hover:underline transition-colors cursor-pointer">Company Profile</button></li>
                <li><button onClick={() => navigate("/track")} className="hover:text-white hover:underline transition-colors cursor-pointer">Track Order</button></li>
                <li><button onClick={() => navigate("/contact")} className="hover:text-white hover:underline transition-colors cursor-pointer">Contact Us</button></li>
              </ul>
            </div>

            {/* Column 3: Secure Office Information */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider font-poppins">
                Physical Office
              </h4>
              <ul className="space-y-3 text-xs text-stone-400">
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>+234 812 322 1174</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>{BRAND_INFO.location}</span>
                </li>
              </ul>
              
              {/* WhatsApp Quick Order button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/2348123221174"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer hover:shadow-lg hover:shadow-emerald-600/10"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.3.15 5.348 1.454.14-.082.312-.132.532-.131 5.352 0 9.702-4.32 9.705-9.63.002-2.571-1.002-4.99-2.83-6.814C17.375 2.203 14.956 1.2 12.005 1.2 6.653 1.21 2.302 5.53 2.3 10.84c-.001 1.838.483 3.633 1.4 5.216l-.995 3.633 3.738-.977z"/>
                    <path d="M15.932 13.09c-.274-.136-1.62-.8-1.87-.89-.252-.09-.43-.136-.61.136-.18.273-.702.89-.86 1.072-.158.18-.316.2-.59.064-.274-.137-1.157-.426-2.202-1.36-.814-.727-1.364-1.624-1.524-1.9-.16-.273-.017-.42.12-.556.124-.122.275-.32.41-.48.137-.16.183-.273.274-.455.09-.18.046-.34-.023-.48-.067-.137-.61-1.474-.836-2.016-.22-.53-.44-.455-.61-.464-.158-.008-.34-.01-.52-.01-.18 0-.472.067-.718.34-.246.273-.94.92-.94 2.247 0 1.327.962 2.607 1.096 2.79.137.18 1.895 2.89 4.593 4.06.64.278 1.14.444 1.53.568.643.204 1.228.175 1.692.106.517-.077 1.62-.663 1.85-1.302.23-.64.23-1.186.16-1.302-.07-.116-.252-.186-.527-.323z"/>
                  </svg>
                  <span>WhatsApp Link</span>
                </a>
              </div>
            </div>

            {/* Column 4: Premium Social Media Connections */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider font-poppins">
                Follow Us Online
              </h4>
              <p className="text-stone-400 text-xs leading-normal">
                Stay updated with our newest container arrivals, live stock reviews, and marketplace pricing deals directly on our socials.
              </p>
              
              {/* Premium Social Media Icons Block */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="https://www.instagram.com/rozay_kitchen_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:bg-brand-500 hover:border-brand-400 transition-all duration-300 scale-100 hover:scale-110 shadow-xs"
                  title="Instagram Page"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/share/1B62bsPzmM/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2]/85 transition-all duration-300 scale-100 hover:scale-110 shadow-xs"
                  title="Facebook Business Page"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@rozaykitchen860"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:bg-[#00F2FE] hover:border-[#00F2FE]/85 hover:text-black transition-all duration-300 scale-100 hover:scale-110 shadow-xs"
                  title="TikTok Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.42-.43-.61-.67-.02 2.44-.01 4.88-.01 7.32-.03 2.15-.53 4.35-1.84 6.06-1.52 2.05-4.13 3.19-6.66 3.03-2.67-.13-5.26-1.63-6.52-4.01-1.39-2.52-1.2-5.83.47-8.15 1.4-2.02 3.84-3.23 6.32-3.08.15.01.3.03.45.06v4.08c-.76-.15-1.56-.05-2.24.32-.97.5-1.53 1.57-1.5 2.68.04 1.34 1.16 2.5 2.5 2.51 1.45-.04 2.61-1.28 2.58-2.73.02-3.6 0-7.2.01-10.8z"/>
                  </svg>
                </a>
                <a
                  href="https://wa.me/2348123221174"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:bg-emerald-500 hover:border-emerald-400 transition-all duration-300 scale-100 hover:scale-110 shadow-xs"
                  title="Direct WhatsApp Support"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.3.15 5.348 1.454.14-.082.312-.132.532-.131 5.352 0 9.702-4.32 9.705-9.63.002-2.571-1.002-4.99-2.83-6.814C17.375 2.203 14.956 1.2 12.005 1.2 6.653 1.21 2.302 5.53 2.3 10.84c-.001 1.838.483 3.633 1.4 5.216l-.995 3.633 3.738-.977z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/rozay_kitchen_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800 hover:border-stone-700 transition-all duration-300 scale-100 hover:scale-110 shadow-xs"
                  title="Follow on X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <hr className="border-stone-800 my-10" />

          {/* Bottom attribution and credentials check */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-500 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span>Verified Merchant</span>
              <span>•</span>
              <span>Lagos Chamber Trade Directory</span>
              <span>•</span>
              <span>Wholesale & Retail Depot</span>
            </div>
            <div>
              <span>© {new Date().getFullYear()} Rozay Kitchen Lagos. Designed for Durability & Style</span>
            </div>
          </div>
          <div className="flex justify-center items-center gap-3 pt-6 text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
            <button onClick={() => navigate("/refund-policy")} className="hover:text-white transition-colors cursor-pointer">Refunds Policy</button>
            <span>|</span>
            <button onClick={() => navigate("/privacy-policy")} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
            <span>|</span>
            <button onClick={() => navigate("/terms-and-conditions")} className="hover:text-white transition-colors cursor-pointer">Terms and Conditions</button>
          </div>
          <div className="text-center pt-8 pb-2 text-[10px] text-stone-600 font-bold uppercase tracking-widest">
            WEBSITE DESIGNED BY DIGITAL SOLUTIONS
          </div>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
}
