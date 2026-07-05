import { motion } from "motion/react";
import { Award, Compass, Eye, MapPin, Building, Flag } from "lucide-react";
import { BRAND_INFO } from "../data";

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

            {/* CEO Profile */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-200 border-2 border-brand-500 shrink-0">
                <img 
                  src="https://picsum.photos/seed/ceo/200/200" 
                  alt="Alaekwe Onyebuchi" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  
                />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-gray-950">Alaekwe Onyebuchi</h4>
                <p className="text-sm font-mono text-brand-600 font-semibold tracking-wide">CEO ROZAY KITCHEN</p>
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
