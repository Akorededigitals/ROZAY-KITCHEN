import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, MessageSquareCode, Sparkles, X } from "lucide-react";
import { BRAND_INFO } from "../data";

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [message, setMessage] = useState("");

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    const customText = message.trim() 
      ? message 
      : "Hello Rozay Kitchen team, I am visiting your company profile and would love to ask about your premium cookware and catering items!";
    
    const encodedText = encodeURIComponent(customText);
    const phoneNumber = "2348000000000"; // General office line
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedText}`;
    window.open(url, "_blank");
    setIsOpen(false);
    setMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Mini Help popover bubble */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="mb-3 mr-1 bg-stone-900 text-white rounded-2xl p-3.5 shadow-xl border border-stone-800 max-w-xs text-xs relative flex flex-col gap-1.5"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-stone-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-1.5 text-brand-400 font-bold font-display uppercase tracking-widest text-[9px]">
              <Sparkles className="w-3 h-3 text-brand-500 fill-brand-500/20" />
              <span>Real-Time Support</span>
            </div>
            <p className="text-stone-200 leading-normal font-medium">
              Need instant wholesale quotes? Talk to our Lagos sales team now!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Interactive Slideout Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="mb-4 bg-white rounded-3xl shadow-2xl border border-gray-150 w-80 overflow-hidden"
          >
            {/* Header branding block */}
            <div className="bg-emerald-600 p-5 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/40 text-white flex items-center justify-center font-bold text-lg border border-emerald-400/30">
                RK
              </div>
              <div>
                <h4 className="font-display font-extrabold text-sm tracking-wide">Rozay Kitchen Support</h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-100 font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping" />
                  <span>Typically replies instantly</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto p-1 text-emerald-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Area */}
            <div className="p-5 bg-stone-50 space-y-4">
              <div className="p-3 bg-white rounded-2xl border border-gray-100 text-xs text-gray-600 leading-relaxed shadow-xs">
                Welcome to Rozay Kitchen showroom support! Please type what cooking pots, gas burners, chafers, or event utensils you'd like to ask us about and our Sales Representative will reply to you on WhatsApp.
              </div>

              <form onSubmit={handleStartChat} className="space-y-3">
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about dimensions, package combinations, or price lists..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 resize-none"
                />
                
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/10 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 fill-white" />
                  <span>Start WhatsApp Chat</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Main Badge Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl shadow-emerald-500/35 transition-all text-center cursor-pointer relative z-50 group"
        title="Chat with Rozay Kitchen Sales"
      >
        <span className="sr-only">Support</span>
        {isOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <svg
            className="w-7 h-7 fill-white transition-transform group-hover:rotate-12"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.261 2.266 3.504 5.277 3.505 8.483-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.19 1.449 4.825 1.451 5.436 0 9.859-4.417 9.863-9.848.002-2.63-1.023-5.101-2.885-6.963C16.58 1.93 14.113.87 11.487.87 6.05 1.87 1.628 6.287 1.624 11.717c-.001 1.693.45 3.345 1.306 4.787L1.925 21.05l4.722-1.238zm11.373-7.513c-.3-.15-1.771-.875-2.046-.975-.276-.1-.476-.15-.675.15-.199.3-.773.975-.948 1.176-.176.2-.351.225-.651.075-.3-.15-1.267-.467-2.413-1.49-1.202-1.07-1.41-1.611-1.558-1.91-.148-.3-.016-.462.133-.612.135-.135.3-.349.45-.524.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.115 3.23 5.125 4.532.715.31 1.273.495 1.708.634.718.228 1.371.196 1.888.118.575-.088 1.771-.725 2.021-1.425.25-.7.25-1.3 1.75-.425zm0 0" />
          </svg>
        )}
      </motion.button>

    </div>
  );
}
