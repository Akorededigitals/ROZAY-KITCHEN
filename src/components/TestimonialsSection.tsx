import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, Star, MessageSquarePlus, X, Send, CheckCircle2 } from "lucide-react";
import { TESTIMONIALS } from "../data";
import { Testimonial } from "../types";

export default function TestimonialsSection() {
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(TESTIMONIALS);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !feedback.trim()) return;

    const newTestimonial: Testimonial = {
      id: `review-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || "Verified Buyer",
      location: location.trim() || "Nigeria",
      feedback: feedback.trim(),
      rating,
    };

    setTestimonialsList([newTestimonial, ...testimonialsList]);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setIsFormOpen(false);
      setName("");
      setRole("");
      setLocation("");
      setFeedback("");
      setRating(5);
    }, 2200);
  };

  return (
    <section id="testimonials" className="py-20 lg:py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative colored glow or shapes */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-100/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 block mb-3">
            VERIFIED VOICES
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight mb-4">
            Trusted by Cooks & Caterers in Nigeria
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-6">
            See how households, high-end caterers, and luxury hospitality businesses rate Rozay Kitchen equipment.
          </p>
          
          {!isFormOpen && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-brand-600 text-white font-display font-semibold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-brand-400" />
              Write a Review
            </motion.button>
          )}
        </div>

        {/* Write a Review Form Drawer / Collapse */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, mb: 0 }}
              animate={{ opacity: 1, height: "auto", mb: 48 }}
              exit={{ opacity: 0, height: 0, mb: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200 shadow-lg relative">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                  aria-label="Close form"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
                  Share Your Rozay Kitchen Experience
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Your review will be posted immediately to our verified customer feed.
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 text-center flex flex-col items-center justify-center"
                  >
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-display font-bold text-lg text-gray-900 mb-1">
                      Thank You for Your Review!
                    </h4>
                    <p className="text-xs text-gray-500">
                      Your feedback has been added to the testimonials showcase below.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Star Rating Selector */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-gray-700 mb-2">
                        Overall Rating <span className="text-brand-600">*</span>
                      </label>
                      <div className="flex gap-1.5 items-center">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            type="button"
                            key={starVal}
                            onClick={() => setRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 -m-1 focus:outline-none cursor-pointer transition-transform hover:scale-110"
                            aria-label={`Rate ${starVal} stars`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                starVal <= (hoverRating || rating)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-200 fill-gray-200"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-mono font-semibold text-amber-600 ml-2">
                          {hoverRating || rating}.0 / 5.0
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase text-gray-700 mb-1.5">
                          Your Full Name <span className="text-brand-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chef Chinedu"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase text-gray-700 mb-1.5">
                          Role / Title (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Head Caterer, Home Cook"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-gray-700 mb-1.5">
                        City / State (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lekki, Lagos or Port Harcourt"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-gray-700 mb-1.5">
                        Your Honest Feedback <span className="text-brand-600">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="What do you love most about the equipment? How has it performed?"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 resize-none"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-display font-semibold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Post Review
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <AnimatePresence>
            {testimonialsList.map((t) => {
              const itemRating = t.rating ?? 5;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                  key={t.id}
                  className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-150 shadow-xs hover:shadow-md transition-all duration-350 relative flex flex-col justify-between"
                >
                  {/* Giant icon watermark */}
                  <div className="absolute top-6 right-6 text-brand-100 pointer-events-none">
                    <Quote className="w-12 h-12 rotate-180 opacity-60 stroke-[1.5]" />
                  </div>

                  <div>
                    {/* Visual Stars */}
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <Star
                          key={starVal}
                          className={`w-4.5 h-4.5 ${
                            starVal <= itemRating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200 fill-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base italic mb-8 relative z-10">
                      "{t.feedback}"
                    </p>
                  </div>

                  {/* Client Profile */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-100 shrink-0">
                    {/* Elegant initials circle */}
                    <div className="w-11 h-11 bg-stone-900 text-brand-300 font-bold rounded-full font-display flex items-center justify-center text-sm">
                      {t.name.split(" ").slice(1).map(n => n[0]).join("") || t.name[0]}
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-sm text-gray-950">
                        {t.name}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-[11px] text-gray-500 font-mono">
                        <span className="font-bold text-brand-600">{t.role}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{t.location}</span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
