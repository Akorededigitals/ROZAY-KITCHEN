import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, Clock, Instagram, Send, Mail, Phone, ShoppingBag, 
  ShieldCheck, HeartHandshake, CheckCircle, Store, ChevronLeft, 
  ChevronRight, Maximize2, X, Sparkles, Eye, Play, Pause
} from "lucide-react";
import { BRAND_INFO, CHOOSE_US_POINTS, PRODUCTS_DATA } from "../data";
import { ContactForm } from "../types";
import { addDbSubmission } from "../lib/supabase";
import SafeImage from "./SafeImage";
import toast from "react-hot-toast";

const STOREFRONT_PHOTOS = [
  {
    id: "sf-1",
    src: "/images/storefront/storefront_1.jpg",
    fallbackSrc: "https://i.ibb.co/P04z6f5/Whats-App-Image-2026-08-13-at-16-11-21-2.jpg",
    title: "Ebute-Ero Storefront & Entrance",
    badge: "Main Showroom",
    location: "Block N, New Pepsi Building, Ebute-ero Market, Idumota",
    description: "Our prominent wholesale hub welcoming caterers, restaurant owners, wedding planners, and retail buyers daily."
  },
  {
    id: "sf-2",
    src: "/images/storefront/storefront_2.jpg",
    fallbackSrc: "https://i.ibb.co/cXTMWBB2/Whats-App-Image-2026-08-13-at-16-11-21-1.jpg",
    title: "Luxury Chafing Dishes & Warmers Display",
    badge: "Buffet & Banquet Hub",
    location: "Aisle 1 • Luxury Chafing Section",
    description: "Extensive selection of hydraulic glass-top, gold-plated, and stainless steel roll-top buffet warmers on display."
  },
  {
    id: "sf-3",
    src: "/images/storefront/storefront_3.jpg",
    fallbackSrc: "https://i.ibb.co/JwXp7rSX/Whats-App-Image-2026-08-13-at-16-11-21.jpg",
    title: "Commercial Pots, Coolers & Cookware Aisles",
    badge: "Wholesale Inventory",
    location: "Aisle 2 • Commercial Kitchenware",
    description: "Stacked inventory of heavy-duty granite cooking pots, industrial cooler boxes, chafing fuels, and catering appliances."
  }
];

export default function LocationShowcase() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
    businessType: "Caterer / Coordinator",
    productSelected: "General Inquiry / Catalog Proposal",
    quantitySelected: 1
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<typeof STOREFRONT_PHOTOS[0] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll<HTMLElement>("[data-storefront-card]");
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
      setCurrentIndex(index);
    }
  }, []);

  const handlePrev = useCallback(() => {
    const nextIdx = (currentIndex - 1 + STOREFRONT_PHOTOS.length) % STOREFRONT_PHOTOS.length;
    scrollToIndex(nextIdx);
  }, [currentIndex, scrollToIndex]);

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % STOREFRONT_PHOTOS.length;
    scrollToIndex(nextIdx);
  }, [currentIndex, scrollToIndex]);

  // Auto-scroll effect: advances every 3.8 seconds when active & not hovered
  useEffect(() => {
    if (!isAutoPlaying || isHovered || selectedPhoto !== null) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIdx = (prev + 1) % STOREFRONT_PHOTOS.length;
        if (scrollContainerRef.current) {
          const cards = scrollContainerRef.current.querySelectorAll<HTMLElement>("[data-storefront-card]");
          if (cards[nextIdx]) {
            cards[nextIdx].scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center"
            });
          }
        }
        return nextIdx;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, selectedPhoto]);

  // Track active slide on user drag/touch scroll
  const handleContainerScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll<HTMLElement>("[data-storefront-card]");
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    setCurrentIndex(closestIndex);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Proper validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      alert("Please fill in all required (*) fields.");
      return;
    }

    setIsSending(true);

    const emailBody = `NEW SHOWROOM FORM SUBMISSION 🌟
--------------------------------------
Customer Name: ${formData.name}
Phone Contact: ${formData.phone}
Email Address: ${formData.email || "Not Provided"}
Business Sector: ${formData.businessType}
Product Selected: ${formData.productSelected}
Quantity: ${formData.quantitySelected}

Customer Message / Order Notes:
"${formData.message}"
--------------------------------------
Sent via Rozay Kitchen Lagos Web Platform`;

    // Construct direct secure mailto option for failsafe production delivery
    const mailto = `mailto:buchisluv2010@gmail.com?subject=${encodeURIComponent(
      `Rozay Query: ${formData.name}`
    )}&body=${encodeURIComponent(emailBody)}`;
    setMailtoUrl(mailto);

    // Save submission locally to database logs (rozay_form_submissions) for CRM display
    const submissionItem: ContactForm = {
      ...formData,
      createdAt: new Date().toLocaleString()
    };

    addDbSubmission(submissionItem);

    // Send via public secure form helper (Web3Forms handles free direct forwarding to key emails)
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "794bc2f8-04fb-4b5a-ba62-a567ea027fbe", // Public integration sandbox token for direct forwarding
          subject: `Rozay Kitchen Contact Form - ${formData.name}`,
          from_name: formData.name,
          replyto: formData.email || undefined,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          product_selected: formData.productSelected,
          quantity: formData.quantitySelected,
          business_type: formData.businessType,
          message: formData.message,
          to_email: "buchisluv2010@gmail.com" // Target forwarding email address
        })
      });
    } catch (err) {
      console.warn("API direct dispatch error (network constraints), using failsafe local caching", err);
    }

    setIsSending(false);
    setSubmitted(true);
    toast.success("Inquiry sent successfully! We will contact you shortly.");

    // Reset fields except mailto url helper
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        businessType: "Caterer / Coordinator",
        productSelected: "General Inquiry / Catalog Proposal",
        quantitySelected: 1
      });
    }, 4000);
  };

  return (
    <section id="location" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Grid */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 block mb-3">
            VISIT &amp; CONNECT
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight mb-4">
            Find Us in Lagos Island
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Located in the prominent wholesale hub of Idumota Market, Lagos Island. Ready to fulfill nationwide shipping.
          </p>
          <div className="w-12 h-1 bg-brand-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Interactive Storefront Auto-Scroll Showcase */}
        <div 
          className="mb-16 bg-stone-50/90 rounded-3xl p-6 sm:p-8 lg:p-10 border border-stone-200 shadow-xs transition-all"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsHovered(false), 3000);
          }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider mb-2.5">
                <Store className="w-3.5 h-3.5 text-amber-700" />
                <span>STOREFRONT &amp; SHOWROOM GALLERY</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-950 tracking-tight">
                Take a Look Inside Rozay Kitchen
              </h3>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Browse our live physical storefront at Ebute-ero Market, Idumota, Lagos Island. Fully stocked with premium chafing warmers, cookware bundles, and commercial catering supplies.
              </p>
            </div>

            {/* Carousel Controls: Play/Pause and Next/Prev */}
            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
              {/* Autoplay Play/Pause Toggle */}
              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer shadow-xs ${
                  isAutoPlaying && !isHovered
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                    : isAutoPlaying && isHovered
                    ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                    : "bg-white border-stone-300 text-stone-700 hover:bg-stone-100"
                }`}
                title={isAutoPlaying ? (isHovered ? "Paused on Hover" : "Click to Pause Auto-scroll") : "Click to Resume Auto-scroll"}
              >
                {isAutoPlaying ? (
                  isHovered ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden sm:inline">Hover Paused</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <Pause className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Auto-Scrolling</span>
                    </>
                  )
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-stone-600 fill-stone-600" />
                    <span className="hidden sm:inline">Resume Play</span>
                  </>
                )}
              </button>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                  aria-label="Previous storefront image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-10 h-10 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                  aria-label="Next storefront image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Auto-Scroll Track */}
          <div
            ref={scrollContainerRef}
            onScroll={handleContainerScroll}
            className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "thin" }}
          >
            {STOREFRONT_PHOTOS.map((photo, index) => {
              const isActive = currentIndex === index;
              return (
                <motion.div
                  key={photo.id}
                  data-storefront-card
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`group snap-center shrink-0 w-[85vw] sm:w-[360px] md:w-[400px] bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                    isActive 
                      ? "border-amber-400 ring-2 ring-amber-400/30 shadow-md" 
                      : "border-stone-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Image Frame */}
                  <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                    <SafeImage
                      src={photo.src}
                      fallbackSrc={photo.fallbackSrc}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    {/* Badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold tracking-wide uppercase font-mono border border-white/20">
                      {photo.badge}
                    </span>

                    {/* Expand button hint */}
                    <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 text-stone-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Details Footer */}
                  <div className="p-5 flex flex-col justify-between grow space-y-2">
                    <div>
                      <h4 className="font-display font-bold text-lg text-gray-900 group-hover:text-brand-600 transition-colors">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        <span>{photo.location}</span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed pt-1">
                      {photo.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Indicators and Navigation Bar */}
          <div className="mt-4 pt-4 border-t border-stone-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            {/* Clickable Pagination Dots */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-stone-400 mr-1">Views:</span>
              {STOREFRONT_PHOTOS.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? "w-8 bg-amber-600"
                      : "w-2.5 bg-stone-300 hover:bg-stone-400"
                  }`}
                  aria-label={`Jump to storefront photo ${idx + 1}`}
                />
              ))}
            </div>

            {/* Instruction / Auto-scroll info */}
            <div className="flex items-center gap-4 text-stone-500 text-xs">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-stone-400" />
                <span>Click image to view in HD</span>
              </span>
              <span className="font-mono text-[11px] text-stone-400">
                {currentIndex + 1} / {STOREFRONT_PHOTOS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Content Box: Form and Map Details splitter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Block: Contact Info and custom vector Map (5 Cols on lg) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Core particulars */}
            <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-gray-150 space-y-6">
              
              {/* Address */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide font-mono">
                    SHOP LOCATION
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
                    {BRAND_INFO.location}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide font-mono">
                    Showroom Hours
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
                    {BRAND_INFO.hours.weekdays}<br />
                    {BRAND_INFO.hours.sunday}
                  </p>
                </div>
              </div>

              {/* Verified Handles */}
              <div className="pt-4 border-t border-gray-150 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gray-400">CONNECT ONLINE:</span>
                <div className="flex items-center gap-3">
                  <a
                    href={BRAND_INFO.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 text-xs font-black transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={BRAND_INFO.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-orange-50 text-gray-700 hover:text-orange-600 text-xs font-black transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>TikTok</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Interactive Google Map */}
            <div className="bg-stone-50 rounded-3xl p-4 shadow-xl border border-gray-150 min-h-[350px] flex flex-col">
              <h4 className="font-display font-bold text-base text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping" />
                Find Us Here
              </h4>
              <p className="text-gray-500 text-[11px] font-medium mb-4 leading-relaxed">
                {BRAND_INFO.location}
              </p>
              <div className="w-full grow rounded-xl overflow-hidden min-h-[300px]">
                <iframe
                  title="Rozay Kitchen Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(BRAND_INFO.location)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>

          </div>

          {/* Right Block: Message Feedback Form (7 Cols on lg) */}
          <div className="lg:col-span-7 bg-stone-50 rounded-3xl p-6 sm:p-10 border border-gray-150">
            <h3 className="font-display font-extrabold text-2xl text-gray-900 tracking-tight mb-2">
              Send an Online Message
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-8 leading-relaxed">
              Have specific questions about wedding souvenir boxes, wholesale pricing packages for cooking pots, or custom catering tray designs? Write to the showroom assistants directly.
            </p>

            <AnimatePresence>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4 text-emerald-800 mb-6"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950 mb-1">
                      Inquiry Sent Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700 leading-normal">
                      Thank you for contacting Rozay Kitchen. Your requirements have been transmitted to our Lagos customer desks. We will get in touch with you shortly. 
                    </p>
                    <span className="font-mono text-[10px] bg-emerald-100/50 text-emerald-800 px-1.5 py-0.5 rounded-md mt-3 inline-block">
                      Response typically: &lt; 2Hours
                    </span>

                    {mailtoUrl && (
                      <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                        <span className="text-xs text-emerald-900 block font-bold mb-2">
                          Automated dispatch in progress. Alternatively, launch your mail app to review:
                        </span>
                        <a
                          href={mailtoUrl}
                          className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-all shadow-xs"
                        >
                          <Mail className="w-4 h-4" />
                          <span>SEND SECURE MANUALLY</span>
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                    placeholder="e.g. Mrs. Funmi Alao"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                    placeholder="e.g. name@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                    placeholder="e.g. 0803 456 7890"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Business Sector / Purpose
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                  >
                    <option>Caterer / Coordinator</option>
                    <option>Home Cooking / Upgrade</option>
                    <option>Restaurant / Eatery Owner</option>
                    <option>Hotel / Club Hospitality</option>
                    <option>Wholesale Reseller Interest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Select Product Of Interest *
                  </label>
                  <select
                    value={formData.productSelected}
                    onChange={(e) => setFormData({ ...formData, productSelected: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                  >
                    <option value="General Inquiry / Catalog Proposal">General Inquiry / Catalog Proposal</option>
                    {PRODUCTS_DATA.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Quantity Required *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.quantitySelected}
                    onChange={(e) => setFormData({ ...formData, quantitySelected: parseInt(e.target.value) || 1 })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                  Detailed Inquiry Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950 resize-none"
                  placeholder="Describe what items or quantities you would like quoted, or list any custom requirements here."
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-stone-950 text-white font-bold text-sm rounded-xl transition-colors tracking-wide cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Online Message</span>
                </button>

                <a
                  href={`https://api.whatsapp.com/send?phone=2348123221174&text=${encodeURIComponent(
                    `Hello Rozay Kitchen Sales Team! 👋\n\nI have an inquiry from your contact page:\n\nName: ${formData.name || "Customer"}\nMessage: ${formData.message || "I would like to inquire about cookware products and pricing."}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors tracking-wide cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.261 2.266 3.504 5.277 3.505 8.483-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.19 1.449 4.825 1.451 5.436 0 9.859-4.417 9.863-9.848.002-2.63-1.023-5.101-2.885-6.963C16.58 1.93 14.113.87 11.487.87 6.05 1.87 1.628 6.287 1.624 11.717c-.001 1.693.45 3.345 1.306 4.787L1.925 21.05l4.722-1.238zm11.373-7.513c-.3-.15-1.771-.875-2.046-.975-.276-.1-.476-.15-.675.15-.199.3-.773.975-.948 1.176-.176.2-.351.225-.651.075-.3-.15-1.267-.467-2.413-1.49-1.202-1.07-1.41-1.611-1.558-1.91-.148-.3-.016-.462.133-.612.135-.135.3-.349.45-.524.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.115 3.23 5.125 4.532.715.31 1.273.495 1.708.634.718.228 1.371.196 1.888.118.575-.088 1.771-.725 2.021-1.425.25-.7.25-1.3 1.75-.425zm0 0" />
                  </svg>
                  <span>Transfer to Agent on WhatsApp</span>
                </a>
              </div>

            </form>
          </div>

        </div>

      </div>

      {/* High-Resolution Storefront Photo Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 text-white"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Photo Frame */}
              <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <SafeImage
                  src={selectedPhoto.src}
                  fallbackSrc={selectedPhoto.fallbackSrc}
                  alt={selectedPhoto.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>

              {/* Modal Details */}
              <div className="p-6 bg-stone-950 border-t border-stone-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-500/30">
                    {selectedPhoto.badge}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    {selectedPhoto.location}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {selectedPhoto.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
