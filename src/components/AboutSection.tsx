import { motion } from "motion/react";
import { Award, Compass, Eye, MapPin, Building, Flag, Sparkles } from "lucide-react";
import { BRAND_INFO } from "../data";
import SafeImage from "./SafeImage";

export default function AboutSection() {
  // Format the text into paragraphs
  const paragraphs = BRAND_INFO.about.split("\n\n");

  return (
    <section id="about" className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Heading Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="text-xs tracking-wider uppercase font-mono font-bold text-brand-600 block mb-3">
            WHO WE ARE
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight mb-4">
            Lagos Island's Trusted Kitchen & Catering Partner
          </h2>
          <div className="w-16 h-1 bg-brand-500 mx-auto rounded-full" />
        </div>

        {/* Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          
          {/* Left Block: Narrative */}
          <div className="flex flex-col justify-center space-y-6">
            <h3 className="font-display font-bold text-2xl text-gray-950 tracking-tight">
              An Elevated Cooking & Catering Experience
            </h3>
            
            {paragraphs.map((p, index) => (
              <p key={index} className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {p}
              </p>
            ))}

            {/* Quick stats / highlight badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-brand-100 text-brand-700">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Ebutero Market</h4>
                  <p className="text-xs text-gray-500">Idumota Wholesale Hub</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-stone-900 text-white">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Premium Standards</h4>
                  <p className="text-xs text-gray-500">Selected for Durability</p>
                </div>
              </div>
            </div>

            {/* CEO Profile Section */}
            <div className="mt-8 p-6 sm:p-7 bg-gradient-to-br from-amber-50/80 via-stone-50 to-white rounded-3xl border border-amber-200/90 shadow-sm relative overflow-hidden">
              {/* Subtle decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
                {/* CEO Image Container with Portrait Aspect Ratio */}
                <div className="relative shrink-0">
                  <div className="w-32 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-2 ring-amber-400/50 bg-stone-100">
                    <SafeImage
                      src="/images/ceo_alaekwe_onyebuchi.jpg"
                      fallbackSrc="https://i.ibb.co/gbjcKSgb/Whats-App-Image-2026-08-13-at-17-09-03.jpg"
                      alt="Alaekwe Onyebuchi - Founder & CEO of Rozay Kitchen"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                      containerClassName="w-full h-full"
                    />
                  </div>
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:-right-1 px-2.5 py-0.5 rounded-full bg-stone-950 text-amber-300 font-mono text-[10px] font-extrabold tracking-wider shadow-md border border-amber-400/40 uppercase whitespace-nowrap">
                    FOUNDER &amp; CEO
                  </span>
                </div>

                {/* CEO Information & Bio */}
                <div className="flex-1 text-center sm:text-left pt-2 sm:pt-0 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-[10px] font-bold uppercase tracking-wider font-mono">
                    <Award className="w-3 h-3 text-amber-700" />
                    <span>EXECUTIVE LEADERSHIP</span>
                  </div>
                  
                  <h4 className="font-display font-extrabold text-2xl text-gray-950 tracking-tight">
                    Alaekwe Onyebuchi
                  </h4>
                  <p className="text-xs font-mono text-brand-700 font-bold tracking-wide">
                    CEO, ROZAY KITCHEN — Lagos Island, Nigeria
                  </p>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
                    Under Alaekwe Onyebuchi's visionary direction, Rozay Kitchen has become Lagos Island's premier wholesale and retail destination for luxury chafing warmers, granite cookware sets, and industrial catering equipment.
                  </p>
                  
                  <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <a
                      href="#ceo-showcase"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-950 text-amber-300 text-xs font-bold transition-all shadow hover:scale-105"
                    >
                      <span>▶ Watch CEO Showcase Video</span>
                    </a>
                    
                    <div className="flex items-center gap-3 text-[11px] font-mono text-stone-500">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Verified Quality</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-stone-400" />
                        <span>Ebute-Ero Market</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Mission & Vision Cards */}
          <div className="flex flex-col justify-between space-y-6 lg:space-y-0 lg:py-6 relative">
            {/* Background design accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[120%] bg-stone-50 rounded-3xl -z-10 hidden lg:block" />

            {/* Mission Card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl bg-white border border-gray-150 shadow-sm relative overflow-hidden group mb-6 lg:mb-8"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-500" />
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <Flag className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-xl text-gray-950 tracking-tight mb-2">
                    Our Mission
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {BRAND_INFO.mission}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl bg-white border border-gray-150 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-stone-900" />
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-stone-800 shrink-0">
                  <Eye className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-xl text-gray-950 tracking-tight mb-2">
                    Our Vision
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {BRAND_INFO.vision}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
