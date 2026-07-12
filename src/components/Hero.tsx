import { motion } from "motion/react";
import { MoveRight, Star, ShieldCheck, Flame, ArrowDown } from "lucide-react";
import { BRAND_INFO } from "../data";

interface HeroProps {
  onShopNow: () => void;
}

export default function Hero({ onShopNow }: HeroProps) {
  return (
    <section id="home" className="relative pt-24 pb-16 lg:pt-32 lg:pb-28 overflow-hidden bg-gradient-to-br from-white via-brand-50 to-brand-100/30 border-b border-brand-100/50">
      {/* Decorative colored glow or shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-50 rounded-full blur-2xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Hero text items - 7 cols on lg */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Tagline pills with micro-badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 self-start px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-[11px] font-semibold tracking-wider uppercase mb-6"
            >
              <Flame className="w-3.5 h-3.5 text-brand-500 fill-brand-400" />
              <span>{BRAND_INFO.tagline}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-gray-950 tracking-tight leading-[1.08] mb-6"
            >
              Premium Kitchen <span className="text-brand-500 font-semibold relative inline-block">
                Appliances
                <span className="absolute bottom-1 left-0 w-full h-1 bg-brand-300 rounded-full -z-10" />
              </span> & Catering Equipment
            </motion.h1>

            {/* Subheadline description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed mb-8 max-w-xl"
            >
              {BRAND_INFO.hero.subheadline}
            </motion.p>

            {/* Core Badges: Ebutero Market / Quality guaranteed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 mb-8 text-xs text-gray-500 font-mono"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>100% Durable Material</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </div>
                <span>Wholesale Market Prices</span>
              </div>
            </motion.div>

            {/* Actions button list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <button
                onClick={onShopNow}
                className="px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold tracking-wider text-sm text-center transition-all duration-300 shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 flex items-center justify-center gap-2 hover:-translate-y-1 cursor-pointer uppercase"
              >
                <span>SHOP NOW</span>
                <MoveRight className="w-4 h-4" />
              </button>
              <a
                href="#about"
                className="px-8 py-4 rounded-xl bg-white hover:bg-stone-50 border border-gray-200 text-gray-800 font-semibold text-center transition-colors shadow-xs"
              >
                Learn More
              </a>
              <a
                href="#location"
                className="px-8 py-4 rounded-xl bg-stone-900 hover:bg-stone-950 text-white font-medium text-sm text-center transition-colors"
              >
                Contact Us
              </a>
            </motion.div>

          </div>

          {/* Hero Graphic - 5 cols on lg */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Floating visual frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white group/banner w-full h-[350px] sm:h-[450px] lg:h-[550px] xl:h-[650px]">
              <img
                src={BRAND_INFO.hero.image}
                alt="Rozay Kitchen premium products"
                loading="eager"
                decoding="async"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800"; e.currentTarget.onerror = null; }}
                className="w-full h-full object-cover group-hover/banner:scale-[1.02] transition-transform duration-700"
              />
              {/* Overlay with local Lagos context */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-6 text-white">
                <p className="text-xs uppercase font-mono tracking-widest text-brand-300 font-bold mb-1">
                  Idumota, Lagos Island
                </p>
                <p className="font-display font-medium text-lg text-stone-100">
                  Nigeria's trusted wholesale depot for modern kitchens & caterers.
                </p>
              </div>
            </div>

            {/* Decorative float item */}
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100 hidden sm:flex">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider block text-gray-400">Located at</span>
                <span className="text-xs font-bold text-gray-950">Ebutero Market</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bounce-down micro indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:block">
        <a href="#about" className="p-2 rounded-full border border-gray-200 bg-white/80 text-gray-400 hover:text-brand-500 transition-colors block">
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
