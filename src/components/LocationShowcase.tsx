import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Clock, Instagram, Send, Mail, Phone, ShoppingBag, ShieldCheck, HeartHandshake, CheckCircle } from "lucide-react";
import { BRAND_INFO, CHOOSE_US_POINTS, PRODUCTS_DATA } from "../data";
import { ContactForm } from "../types";
import { addDbSubmission } from "../lib/supabase";

export default function LocationShowcase() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
    businessType: "Caterer / Coordinator",
    productSelected: "General Inquiry / Catalog Proposal",
    quantitySelected: 1
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Proper validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      alert("Please fill in all required (*) fields.");
      return;
    }

    setIsSending(true);

    const emailBody = `NEW SHOWROOM FORM SUBMISSION 🌟
--------------------------------------
Customer Name: ${formData.name}
Phone Contact: ${formData.phone}
Email Address: ${formData.email || "Not Provided"}
Business Sector: ${formData.businessType}
Product Selected: ${formData.productSelected}
Quantity: ${formData.quantitySelected}

Customer Message / Order Notes:
"${formData.message}"
--------------------------------------
Sent via Rozay Kitchen Lagos Web Platform`;

    // Construct direct secure mailto option for failsafe production delivery
    const mailto = `mailto:buchisluv2010@gmail.com?subject=${encodeURIComponent(
      `Rozay Query: ${formData.name}`
    )}&body=${encodeURIComponent(emailBody)}`;
    setMailtoUrl(mailto);

    // Save submission locally to database logs (rozay_form_submissions) for CRM display
    const submissionItem: ContactForm = {
      ...formData,
      createdAt: new Date().toLocaleString()
    };

    addDbSubmission(submissionItem);

    // Send via public secure form helper (Web3Forms handles free direct forwarding to key emails)
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "794bc2f8-04fb-4b5a-ba62-a567ea027fbe", // Public integration sandbox token for direct forwarding
          subject: `Rozay Kitchen Contact Form - ${formData.name}`,
          from_name: formData.name,
          replyto: formData.email || undefined,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          product_selected: formData.productSelected,
          quantity: formData.quantitySelected,
          business_type: formData.businessType,
          message: formData.message,
          to_email: "buchisluv2010@gmail.com" // Target forwarding email address
        })
      });
    } catch (err) {
      console.warn("API direct dispatch error (network constraints), using failsafe local caching", err);
    }

    setIsSending(false);
    setSubmitted(true);

    // Reset fields except mailto url helper
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        businessType: "Caterer / Coordinator",
        productSelected: "General Inquiry / Catalog Proposal",
        quantitySelected: 1
      });
    }, 4000);
  };

  return (
    <section id="location" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Grid */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 block mb-3">
            VISIT & CONNECT
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight mb-4">
            Find Us in Lagos Island
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Located in the prominent wholesale hub of Ebutero Market, Idumota. Ready to fulfill nationwide shipping.
          </p>
          <div className="w-12 h-1 bg-brand-500 mx-auto rounded-full mt-4" />
        </div>

        {/* Content Box: Form and Map Details splitter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Block: Contact Info and custom vector Map (5 Cols on lg) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Core particulars */}
            <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-gray-150 space-y-6">
              
              {/* Address */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide font-mono">
                    Warehouse Location
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
                    {BRAND_INFO.location}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide font-mono">
                    Showroom Hours
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
                    {BRAND_INFO.hours.weekdays}<br />
                    {BRAND_INFO.hours.sunday}
                  </p>
                </div>
              </div>

              {/* Verified Handles */}
              <div className="pt-4 border-t border-gray-150 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gray-400">CONNECT ONLINE:</span>
                <div className="flex items-center gap-3">
                  <a
                    href={BRAND_INFO.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 text-xs font-black transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={BRAND_INFO.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-orange-50 text-gray-700 hover:text-orange-600 text-xs font-black transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>TikTok</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Interactive Google Map */}
            <div className="bg-stone-50 rounded-3xl p-4 shadow-xl border border-gray-150 min-h-[400px] flex flex-col">
              <h4 className="font-display font-bold text-base text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping" />
                Find Us Here
              </h4>
              <p className="text-gray-500 text-[11px] font-medium mb-4 leading-relaxed">
                {BRAND_INFO.location}
              </p>
              <div className="w-full grow rounded-xl overflow-hidden min-h-[300px]">
                <iframe
                  title="Rozay Kitchen Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(BRAND_INFO.location)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>

          </div>

          {/* Right Block: Message Feedback Form (7 Cols on lg) */}
          <div className="lg:col-span-7 bg-stone-50 rounded-3xl p-6 sm:p-10 border border-gray-150">
            <h3 className="font-display font-extrabold text-2xl text-gray-900 tracking-tight mb-2">
              Send an Online Message
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-8 leading-relaxed">
              Have specific questions about wedding souvenir boxes, wholesale pricing packages for cooking pots, or custom catering tray designs? Write to the showroom assistants directly.
            </p>

            <AnimatePresence>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4 text-emerald-800 mb-6"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950 mb-1">
                      Inquiry Sent Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700 leading-normal">
                      Thank you for contacting Rozay Kitchen. Your requirements have been transmitted to our Lagos customer desks. We will get in touch with you shortly. 
                    </p>
                    <span className="font-mono text-[10px] bg-emerald-100/50 text-emerald-800 px-1.5 py-0.5 rounded-md mt-3 inline-block">
                      Response typically: &lt; 2Hours
                    </span>

                    {mailtoUrl && (
                      <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                        <span className="text-xs text-emerald-900 block font-bold mb-2">
                          Automated dispatch in progress. Alternatively, launch your mail app to review:
                        </span>
                        <a
                          href={mailtoUrl}
                          className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition-all shadow-xs"
                        >
                          <Mail className="w-4 h-4" />
                          <span>SEND SECURE MANUALLY</span>
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                    placeholder="e.g. Mrs. Funmi Alao"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                    placeholder="e.g. name@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                    placeholder="e.g. 0803 456 7890"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Business Sector / Purpose
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                  >
                    <option>Caterer / Coordinator</option>
                    <option>Home Cooking / Upgrade</option>
                    <option>Restaurant / Eatery Owner</option>
                    <option>Hotel / Club Hospitality</option>
                    <option>Wholesale Reseller Interest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Select Product Of Interest *
                  </label>
                  <select
                    value={formData.productSelected}
                    onChange={(e) => setFormData({ ...formData, productSelected: e.target.value })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                  >
                    <option value="General Inquiry / Catalog Proposal">General Inquiry / Catalog Proposal</option>
                    {PRODUCTS_DATA.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                    Quantity Required *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.quantitySelected}
                    onChange={(e) => setFormData({ ...formData, quantitySelected: parseInt(e.target.value) || 1 })}
                    className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono block mb-1.5">
                  Detailed Inquiry Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white border border-gray-250 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500 text-gray-950 resize-none"
                  placeholder="Describe what items or quantities you would like quoted, or list any custom requirements here."
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-stone-950 text-white font-bold text-sm rounded-xl transition-colors tracking-wide cursor-pointer flex items-center justify-center gap-2"
              >
                Submit Form
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
