import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChefHat, Phone, MapPin, Clock, Instagram, Send, Menu, X, ShoppingBag, Settings, Lock, ChevronDown } from "lucide-react";
import { BRAND_INFO } from "../data";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  currentView: "home" | "admin" | "products" | "about" | "contact" | "checkout" | "order-success" | "product-detail";
  onNavigate: (view: string) => void;
}

export default function Header({ cartCount, onOpenCart, onOpenAdmin, currentView, onNavigate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);

  // Check if store is open based on business hours
  // Monday - Saturday, 8:00 AM - 6:00 PM (Lagos/West African Time - UTC+1)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const checkStoreStatus = () => {
      // Use local client time, adjust to represent the business hours gracefully
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
      const hour = now.getHours();

      if (day === 0) {
        setIsStoreOpen(false); // Closed on Sundays
      } else if (hour >= 8 && hour < 18) {
        setIsStoreOpen(true); // Open between 8:00 AM and 6:00 PM
      } else {
        setIsStoreOpen(false); // Closed offline hours
      }
    };

    window.addEventListener("scroll", handleScroll);
    checkStoreStatus();
    const interval = setInterval(checkStoreStatus, 60000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { label: "Home", action: () => onNavigate("home") },
    { 
      label: "Shop", 
      action: () => onNavigate("products"),
      subcategories: [
        { label: "Chafing Dishes", action: () => onNavigate("category/chafing-dishes") },
        { label: "Cooking Pots", action: () => onNavigate("category/cooking-pots") },
        { label: "Catering Equipment", action: () => onNavigate("category/catering-equipment") },
        { label: "Coolers & Storage", action: () => onNavigate("category/coolers-storage") },
        { label: "Kitchen Appliances", action: () => onNavigate("category/kitchen-appliances") },
      ]
    },
    { label: "About", action: () => onNavigate("about") },
    { label: "Contact", action: () => onNavigate("contact") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
          : "bg-white/20 backdrop-blur-xs py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between relative">
          
          {/* Desktop Navigation (Moved to Left) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div 
                key={link.label} 
                className="relative group"
                onMouseEnter={() => link.subcategories && setShopDropdownOpen(true)}
                onMouseLeave={() => link.subcategories && setShopDropdownOpen(false)}
              >
                <a
                  onClick={(e) => { 
                    e.preventDefault(); 
                    link.action();
                    if (link.subcategories) {
                      setShopDropdownOpen(!shopDropdownOpen);
                    }
                  }}
                  className="flex items-center gap-1 text-sm font-bold tracking-widest uppercase text-gray-800 hover:text-brand-600 transition-colors py-2 cursor-pointer"
                >
                  {link.label}
                  {link.subcategories && <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full" />
                </a>
                
                {/* Dropdown Menu */}
                {link.subcategories && (
                  <div className={`absolute top-full left-0 pt-2 transition-all duration-200 origin-top ${shopDropdownOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-95'}`}>
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2 w-56 flex flex-col">
                      {link.subcategories.map((sub, idx) => (
                        <a
                          key={idx}
                          onClick={(e) => { e.preventDefault(); sub.action(); setShopDropdownOpen(false); }}
                          className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Logo & Brand Name (Centered) */}
          <a onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center text-gray-950 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* The 'G' bottom loop */}
                <path d="M 50 90 C 25 90 15 75 15 65 C 15 55 25 45 35 45 L 35 55 C 28 55 25 60 25 65 C 25 70 30 78 50 78 C 70 78 75 70 75 65 L 75 50 L 50 50 L 50 42 L 85 42 L 85 65 C 85 75 75 90 50 90 Z" fill="currentColor" />
                {/* The 'M' top part */}
                <path d="M 20 60 L 20 25 L 35 40 L 50 25 L 65 40 L 80 25 L 80 60 L 72 60 L 72 35 L 65 43 L 50 28 L 35 43 L 28 35 L 28 60 Z" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-display font-black text-2xl leading-none tracking-widest text-gray-950 block">
                ROZAY
              </span>
              <span className="text-[9px] uppercase tracking-widest font-sans font-medium text-gray-500 block leading-tight mt-0.5">
                Luxurious Kitchen
              </span>
            </div>
          </a>

          {/* Right Accessories (Status, WhatsApp link, inquiry bag button) */}
          <div className="hidden sm:flex items-center gap-4">
            
            {/* Store status badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-stone-50 border-stone-200">
              <span
                className={`w-2 h-2 rounded-full ${
                  isStoreOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-400"
                }`}
              />
              <span className="text-gray-600">
                {isStoreOpen ? "STORE OPEN NOW" : "STORE OFFLINE"}
              </span>
            </div>

            {/* Owner portal trigger */}
            {currentView !== "home" && (
              <button
                onClick={onOpenAdmin}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  currentView === "admin"
                    ? "bg-brand-50 border-brand-200 text-brand-700"
                    : "bg-white hover:bg-stone-50 border-gray-200 text-gray-700 hover:text-brand-600"
                }`}
                title="Add & Manage Products"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Owner Portal</span>
              </button>
            )}

            {/* Quick social click */}
            <a
              href={BRAND_INFO.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Follow on Instagram"
              className="p-2 rounded-full border border-gray-200 text-gray-600 hover:text-rose-600 hover:bg-stone-50 transition-colors"
            >
              <Instagram className="w-4.5 h-4.5" />
            </a>

            {/* Active inquiry cart trigger */}
            <motion.button
              onClick={onOpenCart}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-full bg-stone-950 text-white hover:bg-brand-600 transition-colors flex items-center justify-center shadow-sm"
              title="View Inquiry List"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* Handheld/Mobile actions block */}
          <div className="flex sm:hidden items-center gap-3">
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg bg-stone-100 text-gray-900 flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-stone-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-md py-4 px-4 flex flex-col gap-3"
        >
          {navLinks.map((link) => (
            <div key={link.label} className="flex flex-col">
              <a
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (link.subcategories) {
                    setShopDropdownOpen(!shopDropdownOpen);
                  } else {
                    link.action(); 
                    setIsOpen(false);
                  }
                }}
                className="text-base font-semibold py-2 px-3 hover:bg-brand-50 rounded-lg text-gray-800 hover:text-brand-700 transition-colors cursor-pointer flex items-center justify-between"
              >
                {link.label}
              </a>
              {link.subcategories && shopDropdownOpen && (
                <div className="flex flex-col pl-4 mt-1 border-l-2 border-stone-100 ml-4 gap-1">
                  {link.subcategories.map((sub, idx) => (
                    <a
                      key={idx}
                      onClick={(e) => { e.preventDefault(); sub.action(); setIsOpen(false); }}
                      className="text-sm font-medium py-1.5 px-3 hover:bg-brand-50 rounded-lg text-stone-600 hover:text-brand-700 transition-colors cursor-pointer"
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <hr className="border-gray-100 my-1" />

          {/* Mobile Owner Portal trigger */}
          {currentView !== "home" && (
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAdmin();
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold border transition-colors cursor-pointer ${
                currentView === "admin"
                  ? "bg-brand-50 border-brand-100 text-brand-700"
                  : "bg-stone-50 hover:bg-stone-100 border-gray-200 text-gray-700 hover:text-brand-600"
              }`}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Showroom Owner Portal</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-500 text-white rounded px-1.5 py-0.5">ADMIN</span>
            </button>
          )}

          <hr className="border-gray-100 my-1" />

          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-xs font-mono text-gray-500">Business Status:</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border bg-stone-50 border-stone-150">
              <span className={`w-1.5 h-1.5 rounded-full ${isStoreOpen ? "bg-emerald-500" : "bg-rose-400"}`} />
              <span className="text-gray-600 text-[11px]">{isStoreOpen ? "Open Now" : "Closed"}</span>
            </div>
          </div>

          <div className="flex gap-4 px-3 mt-1">
            <a
              href={BRAND_INFO.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600"
            >
              <Instagram className="w-4 h-4" /> Instagram
            </a>
            <a
              href={BRAND_INFO.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600"
            >
              <Send className="w-4 h-4" /> TikTok
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
