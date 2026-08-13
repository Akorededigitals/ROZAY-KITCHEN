import React from "react";
import { motion } from "motion/react";
import { MoveRight, Star, ShieldCheck, Flame, ArrowDown, MapPin, Building, Bus } from "lucide-react";
import { BRAND_INFO } from "../data";

interface HeroProps {
  onShopNow: () => void;
}

export default function Hero({ onShopNow }: HeroProps) {
  return (
    <section id="home" className="relative pt-24 pb-16 lg:pt-28 lg:pb-24 overflow-hidden bg-gradient-to-br from-white via-brand-50/40 to-brand-100/30 border-b border-brand-100/50">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-50 rounded-full blur-2xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Tagline micro-badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-[11px] font-bold tracking-wider uppercase mb-5"
            >
              <Flame className="w-3.5 h-3.5 text-brand-500 fill-brand-400" />
              <span>{BRAND_INFO.tagline}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl xl:text-5xl text-stone-950 tracking-tight leading-[1.1] mb-5"
            >
              Premium Kitchen <span className="text-brand-600 relative inline-block">
                Appliances
                <span className="absolute bottom-1 left-0 w-full h-1.5 bg-brand-200 rounded-full -z-10" />
              </span> & Catering Equipment
            </motion.h1>

            {/* Subheadline description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 max-w-xl"
            >
              {BRAND_INFO.hero.subheadline}
            </motion.p>

            {/* Micro Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mb-8 text-xs text-stone-600 font-medium"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Wholesale Direct Pricing</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <button
                onClick={onShopNow}
                className="px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold tracking-wider text-xs sm:text-sm text-center transition-all duration-300 shadow-lg shadow-brand-500/20 hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer uppercase"
              >
                <span>EXPLORE PRODUCTS</span>
                <MoveRight className="w-4 h-4" />
              </button>
              <a
                href="#about"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-xs sm:text-sm text-center transition-colors shadow-xs"
              >
                About Rozay Kitchen
              </a>
              <a
                href="#location"
                className="px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-950 text-white font-bold text-xs sm:text-sm text-center transition-colors"
              >
                Visit Storefront
              </a>
            </motion.div>

          </div>

          {/* Right Hero Column: Static Business Showcase Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900 w-full h-[400px] sm:h-[480px] lg:h-[520px] group">
              <img
                src="/images/eko_market_lagos.jpg"
                alt="Lagos Island Eko Market with iconic Yellow Danfo Buses - Rozay Kitchen Location"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith("/images/lagos_island_eko_market.jpg")) {
                    target.src = "/images/lagos_island_eko_market.jpg";
                  } else if (!target.src.endsWith("/images/idumota_lagos_market.jpg")) {
                    target.src = "/images/idumota_lagos_market.jpg";
                  } else {
                    target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80";
                  }
                }}
                referrerPolicy="no-referrer"
              />

              {/* Lagos Island & Eko Market Picture Badge overlay */}
              <div className="absolute top-4 left-4 z-20 p-2.5 sm:p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200/80 flex items-center gap-3 max-w-[290px] sm:max-w-[340px]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600" />
                </div>
                <div className="text-left">
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold uppercase tracking-wider block w-fit mb-0.5">
                    Lagos Island — Eko Market Hub
                  </span>
                  <h4 className="font-extrabold text-xs text-stone-900 leading-tight">
                    Eko Market & Gorodom Idumota
                  </h4>
                  <p className="text-[10px] text-stone-600 font-medium mt-0.5 flex items-center gap-1">
                    <Bus className="w-3 h-3 text-amber-600 inline" /> Yellow Danfo Buses Commercial Route
                  </p>
                </div>
              </div>

              {/* Gradient Overlay & Captions */}
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-stone-950 via-stone-950/75 to-transparent p-4 sm:p-6 text-white flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider">
                    Lagos Island — Eko Market Hub
                  </span>
                  <span className="text-[10px] text-stone-300 font-mono flex items-center gap-1">
                    <Bus className="w-3 h-3 text-amber-400" />
                    Yellow Danfo Buses Route
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-base sm:text-lg text-white mb-1">
                  Eko Market & Gorodom Idumota Commercial Hub
                </h3>
                
                <p className="text-xs text-stone-300 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Block N Shop 89, 90, 91, 92 Idumota, Lagos Island</span>
                </p>
              </div>
            </div>

            {/* Live Store Banner under Hero Image */}
            <div className="mt-3 p-3 bg-white rounded-2xl shadow-sm border border-stone-200 flex items-center justify-between text-xs text-stone-700 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Shop open Monday – Saturday (8am - 6pm) in Idumota, Lagos</span>
              </div>
              <span className="text-[10px] text-stone-500 font-mono hidden sm:inline-block">Physical Store Location</span>
            </div>

          </motion.div>

        </div>
      </div>

      {/* Down arrow indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden md:block">
        <a href="#about" className="p-2 rounded-full border border-stone-200 bg-white/80 text-stone-400 hover:text-brand-500 transition-colors block">
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
