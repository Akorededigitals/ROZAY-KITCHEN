import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Product, Review } from "../types";
import { 
  ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, 
  Sparkles, Heart, CheckCircle2, MessageCircle, Send,
  Package, ThumbsUp, RefreshCw, AlertTriangle
} from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, selectedVariant?: string) => void;
  onInstantBuy: (product: Product) => void;
}

export default function ProductDetailView({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onInstantBuy
}: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<"specifications" | "reviews" | "delivery">("specifications");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [customPrice, setCustomPrice] = useState(product.price);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review Form States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showFormSuccess, setShowFormSuccess] = useState(false);

  // Initial Variant setups based on Category
  const variants = product.category.includes("Chafing Dishes")
    ? [
        { name: "Standard Chrome Stainless Handle", extraPrice: 0 },
        { name: "Royal Gold Plated Knobs & Handles", extraPrice: 15000 },
        { name: "Elite Tempered Glass Window Lid", extraPrice: 30000 }
      ]
    : product.category.includes("Pots") || product.category.includes("Cookware")
    ? [
        { name: "Standard 10-Piece Home Cookware", extraPrice: 0 },
        { name: "Premium 12-Piece Catering Deluxe", extraPrice: 20000 },
        { name: "Enterprise 16-Piece Ultimate Industrial Bundle", extraPrice: 45000 }
      ]
    : [
        { name: "Standard Showroom Edition", extraPrice: 0 },
        { name: "Double Capacity Heavy Duty Pro", extraPrice: 25000 }
      ];

  useEffect(() => {
    // Reset configurations on load
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedVariant(variants[0].name);
    setCustomPrice(product.price + variants[0].extraPrice);
    setQuantity(1);

    // Load custom persistent reviews for this product from localStorage
    const storedReviews = localStorage.getItem(`rozay_reviews_${product.id}`);
    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews));
      } catch (err) {
        console.error(err);
      }
    } else {
      // Default initial mockup reviews
      const initialMock: Review[] = [
        {
          id: `rev-mock-1-${product.id}`,
          productId: product.id,
          userName: "Chief Tokunbo Benson",
          userEmail: "toks@lagos.com",
          rating: 5,
          comment: `Fabulous quality. Exactly what I inspected in Ebutero market showroom. Very premium finish and excellent durability. Highly recommended!`,
          createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toLocaleDateString()
        },
        {
          id: `rev-mock-2-${product.id}`,
          productId: product.id,
          userName: "Alhaja Safiat",
          userEmail: "safiat@weddingcatering.ng",
          rating: 4,
          comment: `Used this for our latest outdoor booking of 500 guests. The heating remains consistent. Solid handles. Excellent packaging too!`,
          createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toLocaleDateString()
        }
      ];
      setReviews(initialMock);
      localStorage.setItem(`rozay_reviews_${product.id}`, JSON.stringify(initialMock));
    }
  }, [product]);

  const handleVariantChange = (variantName: string) => {
    setSelectedVariant(variantName);
    const chosen = variants.find(v => v.name === variantName);
    if (chosen) {
      setCustomPrice(product.price + chosen.extraPrice);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const added: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: newName.trim(),
      userEmail: newEmail.trim() || "guest@rozay.com",
      rating: newRating,
      comment: newComment.trim(),
      createdAt: new Date().toLocaleDateString()
    };

    const nextReviews = [added, ...reviews];
    setReviews(nextReviews);
    localStorage.setItem(`rozay_reviews_${product.id}`, JSON.stringify(nextReviews));

    setNewName("");
    setNewEmail("");
    setNewComment("");
    setNewRating(5);
    setShowFormSuccess(true);
    setTimeout(() => setShowFormSuccess(false), 3000);
  };

  // Find related products
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Formatting helpers
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Determine realistic simulated parameters
  const currentDiscountPrice = product.discountPrice 
    ? product.discountPrice + (variants.find(v => v.name === selectedVariant)?.extraPrice || 0)
    : undefined;

  return (
    <div className="pt-24 pb-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-brand-600 transition-colors cursor-pointer bg-white px-4 py-2.5 rounded-full border border-gray-150 inline-flex shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Kitchen Showroom</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white rounded-3xl p-6 sm:p-10 border border-gray-150 shadow-xs">
          
          {/* LEFT: Stellar image panel (5 Column on lg) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full pt-[100%] sm:pt-[0] sm:aspect-square sm:[min-height:350px] bg-white rounded-2xl overflow-hidden border border-gray-100 group">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  
                  loading="lazy"
                  decoding="async"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800"; e.currentTarget.onerror = null; }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-gray-300 stroke-[1.5]" />
                </div>
              )}
              
              {/* Premium Luxury badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-stone-900 border border-stone-800 text-white text-[10px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-md shadow-md">
                  {product.category}
                </span>

                {product.stockStatus === "High Demand" && (
                  <span className="bg-amber-500 border border-amber-400 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3 text-white fill-white" />
                    <span>POPULAR</span>
                  </span>
                )}
                {product.stockStatus === "Low Stock" && (
                  <span className="bg-rose-600 border border-rose-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
                    <AlertTriangle className="w-3 h-3 text-white" />
                    <span>FEW LEFT</span>
                  </span>
                )}
              </div>

              {/* Heart Wishlist toggler */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-md backdrop-blur-xs transition-transform hover:scale-110 cursor-pointer ${
                  isLiked ? "bg-rose-50 text-rose-500" : "bg-white/90 text-gray-500 hover:text-rose-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Quick trust assurances underneath illustration */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-stone-50 border border-gray-150 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-brand-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-950 block">Original Quality</span>
                <span className="text-[9px] text-gray-400 block">100% Inspected</span>
              </div>
              <div className="p-3 bg-stone-50 border border-gray-150 rounded-xl">
                <Truck className="w-5 h-5 text-brand-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-950 block">Fast Delivery</span>
                <span className="text-[9px] text-gray-400 block">Across Nigeria</span>
              </div>
              <div className="p-3 bg-stone-50 border border-gray-150 rounded-xl">
                <RefreshCw className="w-5 h-5 text-brand-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-950 block">Wholesale Rates</span>
                <span className="text-[9px] text-gray-400 block">Direct Depot Pricing</span>
              </div>
            </div>
          </div>

          {/* RIGHT: High-converting informational checkout choices (6 Column) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Category / Star counts */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider font-extrabold text-brand-600 uppercase bg-brand-50 px-2 py-0.5 rounded-sm">
                ROZAY PREMIUM IMPORTS
              </span>
              
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-full text-xs text-amber-800 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating || 4.8} ({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Heading Title */}
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-950 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-mono">
                Model Reference: #RZK-{product.id.toUpperCase()}
              </p>
            </div>

            {/* Live Interactive Pricing & Real Sale status */}
            <div className="p-4 bg-[#FFFDF6] border border-brand-200/70 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-brand-600 block mb-0.5">
                  SHOWROOM OFFER PRICE
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                    {formatNaira(currentDiscountPrice || customPrice)}
                  </span>
                  {(currentDiscountPrice || product.discountPrice) && (
                    <span className="text-sm font-bold text-gray-400 line-through">
                      {formatNaira(customPrice)}
                    </span>
                  )}
                </div>
              </div>

              {(currentDiscountPrice || product.discountPrice) && (
                <span className="bg-rose-500 border border-rose-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  SAVE {formatNaira(customPrice - (currentDiscountPrice || 0))} TODAY
                </span>
              )}
            </div>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Interactive Dynamic VARIATION Selectors */}
            <div className="space-y-3">
              <label className="text-[10px] tracking-wider uppercase font-mono font-bold text-gray-500 block">
                Choose Configuration / Appliance Capacity:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {variants.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => handleVariantChange(v.name)}
                    className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedVariant === v.name
                        ? "border-brand-500 bg-brand-50/40 text-gray-950 shadow-xs"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedVariant === v.name ? "border-brand-500 bg-brand-500" : "border-gray-300"
                      }`}>
                        {selectedVariant === v.name && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span>{v.name}</span>
                    </div>
                    {v.extraPrice > 0 ? (
                      <span className="text-brand-700 font-bold">+{formatNaira(v.extraPrice)}</span>
                    ) : (
                      <span className="text-gray-400">Included</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity adjustment & Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-150">
              
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-600 uppercase font-mono">Select Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 sm:px-3 hover:bg-stone-50 text-gray-700 font-bold transition-colors cursor-pointer text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs sm:text-sm font-bold text-gray-900 border-x border-gray-150">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 sm:px-3 hover:bg-stone-50 text-gray-700 font-bold transition-colors cursor-pointer text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  onClick={() => {
                    const finalConfiguredProduct = {
                      ...product,
                      price: currentDiscountPrice || customPrice,
                      name: `${product.name} (${selectedVariant})`
                    };
                    onAddToCart(finalConfiguredProduct, quantity);
                  }}
                  className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 shadow-brand-500/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>ORDER NOW</span>
                </button>

                <button
                  onClick={() => {
                    const finalConfiguredProduct = {
                      ...product,
                      price: currentDiscountPrice || customPrice,
                      name: `${product.name} (${selectedVariant})`
                    };
                    onInstantBuy(finalConfiguredProduct);
                  }}
                  className="w-full py-4 bg-stone-900 hover:bg-stone-950 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-brand-300 stroke-[2]" />
                  <span>BUY NOW & CHECKOUT</span>
                </button>
              </div>

              {/* Express share */}
              <div className="flex items-center justify-between text-xs py-2 bg-stone-50 px-3.5 rounded-xl border border-gray-150">
                <span className="text-gray-500">Need immediate wholesale pricing or advice?</span>
                <button
                  onClick={handleCopyLink}
                  className="text-brand-600 font-bold hover:underline"
                >
                  {copiedLink ? "Link Copied!" : "Share Product"}
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Section Tabs: Detailed Specifications & Persistent Customer Reviews */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-3xs">
          
          {/* Tabs Menu buttons */}
          <div className="flex border-b border-gray-150 bg-stone-50">
            <button
              onClick={() => setActiveTab("specifications")}
              className={`flex-1 py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "specifications"
                  ? "border-brand-500 text-brand-700 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Specifications & Parameters
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "reviews"
                  ? "border-brand-500 text-brand-700 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>User Feedback & reviews</span>
              <span className="bg-stone-200 text-stone-700 text-[10px] px-1.5 py-0.5 rounded-full">
                {reviews.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`flex-1 py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "delivery"
                  ? "border-brand-500 text-brand-700 bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Delivery & Location
            </button>
          </div>

          {/* Tab Body contents */}
          <div className="p-6 sm:p-10">
            
            {activeTab === "specifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-3">Key Technical Specifications:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-stone-50 border border-gray-100 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50/40 border border-amber-200 rounded-2xl">
                  <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-600 fill-brand-600" />
                    <span>Lagos Showroom Guarantee</span>
                  </h4>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    All Rozay Kitchen catalog appliances undergo physical inspection at our Idumota depots prior to courier dispatch. We guarantee heavy food-safe standards, double heating verification under liquid testing, and elite metal aesthetics.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                
                {/* Write live review form */}
                <div className="p-6 bg-stone-50 border border-gray-150 rounded-2xl">
                  <h4 className="font-display font-extrabold text-sm text-gray-900 mb-1">
                    Leave a Product Review
                  </h4>
                  <p className="text-[11px] text-gray-400 mb-4 leading-normal">
                    Your email is protected. Reviews from real verified buyers help show true showroom feedback!
                  </p>

                  {showFormSuccess && (
                     <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 mb-4 animate-bounce">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       <span>Your review has been successfully processed and published below!</span>
                     </div>
                  )}

                  <form onSubmit={handleAddReview} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Name *</label>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. Chief Mrs. Lola"
                          className="w-full text-xs px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Email Address</label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="lola@yahoo.com (not shown publicly)"
                          className="w-full text-xs px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Your Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="p-1 cursor-pointer focus:outline-none"
                          >
                            <Star className={`w-5 h-5 ${star <= newRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Review Comments *</label>
                      <textarea
                        rows={3}
                        required
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your experience working with this kitchen appliance or layout setup..."
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-stone-900 hover:bg-stone-950 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Review Comments
                    </button>
                  </form>
                </div>

                {/* Published Reviews list */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-gray-400 text-center py-6 text-xs">No reviews submitted yet. Be the first to review this product!</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-stone-50 border border-gray-150 rounded-xl space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                              {rev.userName.charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <h5 className="text-xs sm:text-sm font-bold text-gray-950 leading-none">{rev.userName}</h5>
                              <span className="text-[9px] text-gray-400">{rev.createdAt}</span>
                            </div>
                          </div>

                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-3.5 h-3.5 ${star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} 
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-stone-600 pl-9 leading-relaxed">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {activeTab === "delivery" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-950">Shipping Speed & Cost Outlines:</h4>
                  <ul className="space-y-2.5 text-stone-600">
                    <li className="flex justify-between border-b border-gray-100 pb-1.5">
                      <span>Lagos Island Flat Courier Delivery</span>
                      <span className="font-bold text-brand-700">₦3,500 (Same / Next Day)</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-1.5">
                      <span>Lagos Mainland Hub Logistics</span>
                      <span className="font-bold text-brand-700">₦5,000 (1 – 2 Days)</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-1.5">
                      <span>Out-of-Lagos States Carrier Delivery</span>
                      <span className="font-bold text-brand-700">₦12,000 (2 – 4 Days)</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-1.5">
                      <span>Self-Pickup at Idumota Showroom Show hub</span>
                      <span className="font-bold text-emerald-600">FREE (Monday - Saturday)</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50/20 border border-emerald-200 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Secured Checkout Protection</span>
                    </h5>
                    <p className="text-stone-600 text-xs">
                      Payments placed here utilize real client-side Paystack validation simulation, preserving orders safely to our owner log instantly. If preferred, direct checkout compiles a neat shopping list directly to our WhatsApp portal.
                    </p>
                  </div>
                  <div className="pt-4 text-[10px] font-mono text-gray-400">
                    Warehouse center: Ebutero Market, Idumota, Lagos Island, Nigeria.
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RELATED PRODUCTS RECOMMENDATIONS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
              <h3 className="font-display font-black text-xl text-gray-950">
                You might also love these premium sets
              </h3>
              <span className="text-xs text-brand-600 font-bold">Related {product.category}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                >
                  <div className="relative w-full pt-[100%] bg-white overflow-hidden">
                    {rel.image ? (
                      <img
                        src={rel.image}
                        alt={rel.name}
                        
                        loading="lazy"
                        decoding="async"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800"; e.currentTarget.onerror = null; }}
                        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-300 stroke-[1.5]" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-950 line-clamp-1 mb-1">{rel.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{rel.description}</p>
                      <span className="text-brand-700 font-bold text-xs font-mono">{formatNaira(rel.price)}</span>
                    </div>

                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        onAddToCart(rel, 1);
                      }}
                      className="mt-4 w-full py-2 bg-stone-900 hover:bg-stone-950 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Bespoke Inquiry Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
