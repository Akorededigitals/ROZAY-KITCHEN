import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, ShoppingBag, Plus, Minus, Send, Clipboard, Check, Sparkles } from "lucide-react";
import { InquiryItem } from "../types";
import { BRAND_INFO } from "../data";

interface InquiryCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: InquiryItem[];
  onUpdateCartQuantity: (productId: string, qty: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export default function InquiryCartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onClearCart,
  onProceedToCheckout
}: InquiryCartDrawerProps) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate total items
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Generate formatted text message for WhatsApp or copy-paste
  const compileInquiryMessage = () => {
    let msg = `*ROZAY KITCHEN SHOWROOM ORDER & INQUIRY* 🍳\n`;
    msg += `--------------------------------------\n\n`;
    msg += `Hello Rozay Kitchen team, I would like to place an order/request details for the following items:\n\n`;

    let totalSum = 0;
    cartItems.forEach((item, index) => {
      const activePrice = item.product.discountPrice || item.product.price;
      const subTotal = activePrice * item.quantity;
      totalSum += subTotal;

      msg += `*${index + 1}. ${item.product.name}*\n`;
      msg += `   • Quantity: ${item.quantity}\n`;
      msg += `   • Category: ${item.product.category}\n`;
      msg += `   • Unit Price: ₦${activePrice.toLocaleString()}\n`;
      msg += `   • Subtotal: ₦${subTotal.toLocaleString()}\n\n`;
    });

    msg += `--------------------------------------\n`;
    msg += `*Total Registered Items:* ${totalItemsCount}\n`;
    msg += `*Estimated Grand Total:* ₦${totalSum.toLocaleString()}\n\n`;
    
    msg += `*CUSTOMER DETAILS:*\n`;
    msg += `• *Name:* ${clientName || "Guest Customer"}\n`;
    if (clientPhone) msg += `• *Phone Contact:* ${clientPhone}\n`;
    if (customNotes) msg += `• *My Custom Request/Notes:* ${customNotes}\n\n`;

    msg += `Please confirm order availability and logistics/delivery to my location. Thank you!`;
    return msg;
  };

  // Launch WhatsApp callback
  const handleSendWhatsApp = () => {
    if (!clientName.trim()) {
      alert("Please enter your name to personalize your WhatsApp order!");
      return;
    }
    const rawMsg = compileInquiryMessage();
    const encodedText = encodeURIComponent(rawMsg);
    // Real Business line contact provided by user
    const phoneNumber = "2348123221174"; 
    const url = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    window.open(url, "_blank");
  };

  // Copy message text helper
  const handleCopyToClipboard = async () => {
    const rawMsg = compileInquiryMessage();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(rawMsg);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background Dim */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Flyout Drawer Alignment */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white flex flex-col shadow-2xl relative"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-display font-black text-lg text-gray-950">
                Inquiry List
              </h3>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-gray-300 mb-4 animate-pulse">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">Your inquiry list is empty</h4>
                <p className="text-gray-400 text-xs max-w-xs mx-auto leading-relaxed">
                  Browse our showroom catalog page and add products you'd like to get pricing and catalog options on.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-4 py-2 text-xs font-bold text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  Return to Showroom
                </button>
              </div>
            ) : (
              <>
                {/* List items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider font-mono">
                    <span>Selected Equipment ({totalItemsCount})</span>
                    <button
                      onClick={onClearCart}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear All
                    </button>
                  </div>

                  <div className="space-y-3 Divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3.5 py-2.5 first:pt-0"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                            loading="lazy"
                            decoding="async"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800"; e.currentTarget.onerror = null; }}
                            
                            
                          
                          
                          
                          className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0 border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] text-gray-400 block truncate">
                            {item.product.category}
                          </span>
                          {item.product.priceRange && (
                            <span className="text-[10px] font-mono text-brand-600 block mt-0.5">
                              Est: {item.product.priceRange}
                            </span>
                          )}
                        </div>

                        {/* Quantity Counter controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded-md border border-gray-200 hover:bg-stone-50 text-gray-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-gray-900 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded-md border border-gray-200 hover:bg-stone-50 text-gray-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          
                          <button
                            onClick={() => onRemoveFromCart(item.product.id)}
                            className="p-1 text-gray-400 hover:text-red-500 ml-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Sender Details Form */}
                <div className="space-y-4">
                  <h4 className="font-display font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    Complete Inquiry Profile
                  </h4>
                  <p className="text-gray-400 text-[11px] leading-normal -mt-2">
                    Enter your name and details so we can draft a customized corporate quotation for your wedding, restaurant, or business.
                  </p>

                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-mono font-bold text-gray-500 block mb-1">
                        Your Name / Business Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mrs. Adeola (Ikeja Caterers)"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg bg-stone-50 border border-gray-200 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-400 focus:border-brand-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-mono font-bold text-gray-500 block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 0803 123 4567"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg bg-stone-50 border border-gray-200 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-400 focus:border-brand-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider font-mono font-bold text-gray-500 block mb-1">
                        Additional Delivery Notes / Custom Requests
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Please quote delivery cost to Lekki Phase 1, or suggest durable alternatives."
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg bg-stone-50 border border-gray-200 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-400 focus:border-brand-500 text-gray-900 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Submit Buttons */}
          {cartItems.length > 0 && (
            <div className="px-6 py-6 border-t border-gray-150 bg-stone-50 space-y-3">
              
              {/* PRIMARY ECOMMERCE CHECKOUT ROUTE */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 px-4 rounded-xl bg-stone-900 hover:bg-stone-950 text-white font-extrabold text-xs sm:text-sm tracking-wide text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Clipboard className="w-4 h-4 text-emerald-400 stroke-[3.5]" />
                <span>SECURE CHECKOUT &amp; RECEIPT</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSendWhatsApp}
                  className="py-3 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] sm:text-xs text-center flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Send className="w-3 h-3 fill-white" />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  onClick={handleCopyToClipboard}
                  className={`py-3 px-2 rounded-xl border font-bold text-[10px] sm:text-xs text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    copied
                      ? "bg-stone-950 border-stone-950 text-white"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-stone-50"
                  }`}
                >
                  {copied ? (
                    <span>Copied!</span>
                  ) : (
                    <span>Copy Text</span>
                  )}
                </button>
              </div>
              
              <p className="text-[9px] text-gray-400 text-center leading-normal pt-1.5">
                Secure checkout simulates Paystack instant payments and drafts detailed transactional invoices directly into the customer &amp; owner databases!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
