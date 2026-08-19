import React from "react";
import { motion } from "motion/react";
import { MoveRight, Star, ShieldCheck, Flame, ArrowDown, MapPin } from "lucide-react";
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Tagline micro-badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-[11px] font-bold tracking-wider uppercase mb-5 shadow-xs"
        >
          <Flame className="w-3.5 h-3.5 text-brand-500 fill-brand-400" />
          <span>{BRAND_INFO.tagline}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-stone-950 tracking-tight leading-[1.1] mb-6 max-w-3xl"
        >
          Premium Kitchen <span className="text-brand-600 relative inline-block">
            Appliances
            <span className="absolute bottom-1 left-0 w-full h-2 bg-brand-200/80 rounded-full -z-10" />
          </span> & Catering Equipment
        </motion.h1>

        {/* Subheadline description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-stone-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl"
        >
          {BRAND_INFO.hero.subheadline}
        </motion.p>

        {/* Micro Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 text-xs sm:text-sm text-stone-600 font-medium"
        >
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Quality Guaranteed</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Wholesale Direct Pricing</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 shadow-2xs">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>Idumota & Eko Market, Lagos</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto"
        >
          <button
            onClick={onShopNow}
            className="px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold tracking-wider text-xs sm:text-sm text-center transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer uppercase"
          >
            <span>EXPLORE PRODUCTS</span>
            <MoveRight className="w-4 h-4" />
          </button>
          <a
            href="#about"
            className="px-6 py-4 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-xs sm:text-sm text-center transition-colors shadow-xs"
          >
            About Rozay Kitchen
          </a>
          <a
            href="#location"
            className="px-6 py-4 rounded-xl bg-stone-900 hover:bg-stone-950 text-white font-bold text-xs sm:text-sm text-center transition-colors"
          >
            Visit Storefront
          </a>
        </motion.div>

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
