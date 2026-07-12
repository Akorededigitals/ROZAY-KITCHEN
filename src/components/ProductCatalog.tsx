import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ChevronRight, Plus, Check, Info, ArrowUpRight, Flame, BadgeAlert, ShoppingBag, Trash2, Send, Copy, Sparkles, CheckCircle2 } from "lucide-react";
import { Product, InquiryItem } from "../types";
import { PRODUCTS_DATA, CATEGORIES, BRAND_INFO } from "../data";
import { getProductImageUrl } from "../lib/supabase";

interface ProductCatalogProps {
  key?: string;
  products: Product[];
  cartItems: InquiryItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateCartQuantity: (productId: string, qty: number) => void;
  onViewProductDetail: (product: Product) => void;
  defaultCategory?: string;
}

export default function ProductCatalog({
  products,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onViewProductDetail,
  defaultCategory = "All"
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState("");
      const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Filter products based on selected category and search input
  let filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.features.some((f) => f.toLowerCase().includes(query));
    
    return matchesCategory && matchesSearch;
  });
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Check if item is already in the inquiry cart
  const isItemInCart = (productId: string) => {
    return cartItems.some((item) => item.product.id === productId);
  };

  const getCartItemQty = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section id="products" className="py-20 lg:py-28 bg-white relative">
      {/* Absolute decorative backdrops */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-brand-50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-stone-50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 block mb-3">
              PRODUCT EXHIBITION
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight mb-4">
              Explore Our Premium Range
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Browse our diverse, curated collection of luxury chafing food warmers, die-cast granite cooking pots, powerful cookwares, and high-efficiency catering electronics.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by product name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm pl-11 pr-10 py-3.5 rounded-xl bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 transition-all text-gray-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 -mx-4 px-4 scrollbar-none scroll-smooth">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                selectedCategory === category
                  ? "bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/10"
                  : "bg-stone-50 hover:bg-stone-100 border-gray-200 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Dynamic Catalog Grid */}
        <AnimatePresence mode="popLayout">
          {currentProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl p-8"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto text-gray-400 mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-gray-900 font-bold mb-1">No matching items found</h3>
              <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto">
                We couldn't locate what you searched for. Try checking the spelling or selecting another category above. Or send us a bespoke request!
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-4 text-xs font-bold text-brand-600 hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {currentProducts.map((product) => {
                const alreadyIn = isItemInCart(product.id);
                const currentQty = getCartItemQty(product.id);

                return (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    
                    {/* Upper cover photo container */}
                    <div className="relative w-full pt-[100%] shrink-0 bg-white overflow-hidden">
                      {product.image ? (
                        <img
                          src={getProductImageUrl(product.image)}
                          alt={product.name}
                          
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800"; e.currentTarget.onerror = null; }}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag className="w-16 h-16 text-gray-300 stroke-[1.5]" />
                        </div>
                      )}
                      
                      {/* Category Label Overlay */}
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[10px] font-bold text-gray-800 uppercase tracking-widest px-2.5 py-1 rounded-md shadow-xs border border-gray-100">
                        {product.category}
                      </span>

                      {/* Info circle overlay trigger */}
                      <button
                        onClick={() => onViewProductDetail(product)}
                        className="absolute bottom-3 right-3 p-2 bg-white/95 backdrop-blur-xs rounded-full hover:bg-brand-500 hover:text-white text-gray-600 shadow-xs transition-colors cursor-pointer"
                        title="View Full Item Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Middle info content block */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title & Estimated Pricing */}
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-display font-extrabold text-lg text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1 leading-snug">
                            {product.name}
                          </h3>
                        </div>
                        
                        {/* Estimated target price info for transparency */}
                        {product.priceRange && (
                          <div className="text-[11px] font-mono font-semibold text-brand-600 bg-brand-50/50 inline-block px-1.5 py-0.5 rounded-sm mb-3">
                            Estimated: {product.priceRange}
                          </div>
                        )}

                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                          {product.description}
                        </p>

                        {/* Stretched feature tag lists */}
                        <div className="space-y-1.5 mb-6">
                          {product.features.slice(0, 3).map((feat) => (
                            <div key={feat} className="flex items-center gap-2 text-[11px] text-gray-500">
                              <span className="w-1 h-1 rounded-full bg-brand-500 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lower actions buttons block */}
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        
                        <button
                          onClick={() => onViewProductDetail(product)}
                          className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-stone-50 text-xs font-semibold text-gray-700 text-center transition-colors cursor-pointer"
                        >
                          Specifications
                        </button>

                        <button
                          onClick={() => onAddToCart(product)}
                          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 transform active:scale-95 cursor-pointer ${
                            alreadyIn
                              ? "bg-stone-900 text-white hover:bg-stone-950 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                              : "bg-brand-500 hover:bg-brand-600 text-white shadow-xs hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-500/20"
                          }`}
                        >
                          {alreadyIn ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-400" />
                              <span>Added ({currentQty})</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5] group-hover:animate-bounce" />
                              <span>ORDER NOW</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>



      </div>
    </section>
  );
}
