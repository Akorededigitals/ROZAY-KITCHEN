import { motion } from "motion/react";
import { Sparkles, PiggyBank, Users, HeartHandshake, Layers } from "lucide-react";
import { CHOOSE_US_POINTS } from "../data";

export default function WhyChooseUs() {
  // Map icons to each of the 5 points in sequence
  const iconMap = [
    <Sparkles className="w-6 h-6 stroke-[2]" />,
    <PiggyBank className="w-6 h-6 stroke-[2]" />,
    <Users className="w-6 h-6 stroke-[2]" />,
    <HeartHandshake className="w-6 h-6 stroke-[2]" />,
    <Layers className="w-6 h-6 stroke-[2]" />
  ];

  const colorVariants = [
    { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
    { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" },
    { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" },
    { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-100" }
  ];

  return (
    <section id="why-choose-us" className="py-20 lg:py-24 bg-gradient-to-b from-white via-brand-50/40 to-white border-y border-brand-100/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 block mb-3">
            MARKET DIFFERENCE
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight mb-4">
            Why Culinary Professionals Choose Us
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto">
            Providing lasting kitchen inventory that elevates your cooking and caters to your business growth.
          </p>
          <div className="w-12 h-1 bg-brand-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Bento Grid Styling */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-stretch">
          
          {/* First Two Items (Wide 3-col on md/lg) */}
          {CHOOSE_US_POINTS.slice(0, 2).map((point, index) => (
            <motion.div
              key={point.title}
              whileHover={{ y: -5 }}
              className="md:col-span-3 p-8 rounded-2xl bg-white border border-gray-150 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorVariants[index].bg} ${colorVariants[index].text} mb-6 border ${colorVariants[index].border}`}>
                  {iconMap[index]}
                </div>
                <h3 className="font-display font-extrabold text-xl text-gray-900 tracking-tight mb-3">
                  {point.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {point.description}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-bold text-brand-700 uppercase tracking-widest font-mono">
                <span>Verified Quality</span>
                <span>•</span>
                <span>Premium Gear</span>
              </div>
            </motion.div>
          ))}

          {/* Last Three Items (2-col each on md/lg to complete the 6 columns layout) */}
          {CHOOSE_US_POINTS.slice(2, 5).map((point, index) => {
            const actualIndex = index + 2;
            return (
              <motion.div
                key={point.title}
                whileHover={{ y: -5 }}
                className="md:col-span-2 p-8 rounded-2xl bg-white border border-gray-150 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorVariants[actualIndex].bg} ${colorVariants[actualIndex].text} mb-6 border ${colorVariants[actualIndex].border}`}>
                    {iconMap[actualIndex]}
                  </div>
                  <h3 className="font-display font-bold text-lg text-gray-900 tracking-tight mb-3">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {point.description}
                  </p>
                </div>
                <div className="mt-6 text-[11px] font-mono font-medium text-gray-400">
                  Rozay Quality Assured
                </div>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
