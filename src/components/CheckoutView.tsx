import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, Order } from "../types";
import { addDbOrder, addDbSubmission, getProductImageUrl } from "../lib/supabase";
import { 
  ShoppingBag, Trash2, ArrowLeft, ShieldCheck, CreditCard,
  Phone, Mail, User, MapPin, Tag, Truck, Check, HelpCircle,
  MessageCircle, Send, FileText, CheckCircle, Smartphone
} from "lucide-react";

interface CheckoutViewProps {
  cartItems: { product: Product; quantity: number }[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

export default function CheckoutView({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onBack,
  onOrderSuccess
}: CheckoutViewProps) {
  // Step 1: cart overview, Step 2: Customer Delivery Forms
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Lagos");
  const [deliveryMethod, setDeliveryMethod] = useState("island");
  const [isShippingRequested, setIsShippingRequested] = useState(false); // island, mainland, states, pickup
  const [paymentMethod, setPaymentMethod] = useState<"Paystack" | "WhatsApp / Direct Transfer">("Paystack");

  // Promo Code States
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0); // number representation
  const [promoError, setPromoError] = useState("");

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Computations
  const subtotal = cartItems.reduce((acc, item) => {
    const activePrice = item.product.discountPrice || item.product.price;
    return acc + (activePrice * item.quantity);
  }, 0);

  const getDeliveryFee = () => {
    if (!isShippingRequested) return 0;
    switch (deliveryMethod) {
      case "island": return 3500;
      case "mainland": return 5000;
      case "states": return 12000;
      case "pickup": return 0;
      default: return 3500;
    }
  };

  const getDeliveryLabel = () => {
    if (!isShippingRequested) return "Self-Pickup at Showroom";
    switch (deliveryMethod) {
      case "island": return "Lagos Island Delivery Flat Rate";
      case "mainland": return "Lagos Mainland Delivery Hub Logistics";
      case "states": return "Out of Lagos Courier Dispatch";
      case "pickup": return "Self-Pickup at Showroom";
      default: return "Island Delivery";
    }
  };

  const deliveryFee = getDeliveryFee();
  const rawTotal = subtotal + deliveryFee;
  const grandTotal = Math.max(0, rawTotal - promoDiscount);

  const applyPromo = () => {
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === "ROZAYWELCOME") {
      const discount = Math.round(subtotal * 0.10); // 10%
      setPromoDiscount(discount);
      setAppliedPromo("ROZAYWELCOME (-10% Welcome Discount)");
      setPromoCode("");
    } else if (code === "IDUMOTA5K") {
      const discount = Math.min(5000, subtotal - 1000); // Max 5000 flat, leave at least 1000 subtotal
      setPromoDiscount(discount);
      setAppliedPromo("IDUMOTA5K (-₦5,000 Flat Promo)");
      setPromoCode("");
    } else {
      setPromoError("Invalid promotional code! Try ROZAYWELCOME or IDUMOTA5K");
    }
  };

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: email.trim() || "guest@rzk.com",
    amount: grandTotal * 100, // Amount is in Kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_dc9b8e88e89f816c80521be945535ebbd21481f3",
    metadata: {
      name,
      phone,
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: name
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: phone
        }
      ]
    }
  };

  const onPaystackSuccess = (reference: any) => {
    finalizeOrder(true);
  };

  const onPaystackClose = () => {
    console.log("Paystack dialog closed.");
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleCheckoutSubmit triggered", { cartItems: cartItems.length, paymentMethod });
    
    // Manual validation to ensure user sees an error instead of silent HTML5 validation
    if (!name || !email || !phone || !address || !state) {
      alert("Please fill in all the required delivery details (Name, Email, Phone, Address, State).");
      return;
    }

    if (cartItems.length === 0) return;

    if (paymentMethod === "Paystack") {
      const loadPaystackAndPay = () => {
        try {
          const paystack = new (window as any).PaystackPop();
          paystack.newTransaction({
            key: paystackConfig.publicKey,
            email: paystackConfig.email,
            amount: paystackConfig.amount,
            reference: paystackConfig.reference,
            metadata: paystackConfig.metadata,
            onSuccess: (transaction: any) => {
              onPaystackSuccess(transaction.reference);
            },
            onCancel: () => {
              onPaystackClose();
            },
          });
        } catch (err) {
          console.error("Paystack initialization failed:", err);
          alert("Failed to load payment gateway. Please check your connection or try another method.");
        }
      };

      if (!(window as any).PaystackPop) {
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v2/inline.js";
        script.onload = loadPaystackAndPay;
        script.onerror = () => alert("Failed to load Paystack script.");
        document.body.appendChild(script);
      } else {
        loadPaystackAndPay();
      }
    } else {
      finalizeOrder(false);
    }
  };

  const finalizeOrder = (isPaidViaPaystack: boolean) => {
    const orderId = `RZK-ORD-${Date.now().toString().slice(-6)}`;
    const finalName = name.trim() || "Guest Customer";
    const finalEmail = email.trim() || "guest@rzk.com";
    const finalPhone = phone.trim() || "08000000000";
    const finalAddress = address.trim() || "Showroom Walk-in Pickup";
    const finalCity = city.trim() || "Lagos";
    const finalState = state.trim() || "Lagos State";
    
    const newOrder: Order = {
      id: orderId,
      customerName: finalName,
      customerEmail: finalEmail,
      customerPhone: finalPhone,
      address: finalAddress,
      city: finalCity,
      state: finalState,
      deliveryMethod: getDeliveryLabel(),
      deliveryFee,
      items: cartItems,
      subtotal,
      total: grandTotal,
      paymentMethod: isPaidViaPaystack ? "Paystack" : "WhatsApp / Direct Transfer",
      paymentStatus: isPaidViaPaystack ? "Paid" : "Pending",
      orderStatus: "Received",
      createdAt: new Date().toLocaleString()
    };

    // Save order in orders archive in localStorage & Supabase
    addDbOrder(newOrder);

    // Compile email message for automated forwarding to buchisluv2010@gmail.com
    const activePaymentName = isPaidViaPaystack ? "Paystack Secure Gateway" : "WhatsApp / Direct Transfer";
    const activePaymentStatus = isPaidViaPaystack ? "CONFIRMED PAID" : "PENDING LOGISTICS APPROVAL";
    const itemsDescriptionList = cartItems.map((item, idx) => {
      const activeItemPrice = item.product.discountPrice || item.product.price;
      return `${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ${formatNaira(activeItemPrice * item.quantity)}`;
    }).join("\n");

    const emailBody = `NEW ORDER PLACED ON ROZAY KITCHEN 🛒
======================================
Order Identification: #${orderId}
Creation Date: ${newOrder.createdAt}

CUSTOMER CONTACT CARD:
• Full Name: ${finalName}
• Phone No: ${finalPhone}
• Email: ${finalEmail}

DELIVERY PARTICULARS:
• Address Line: ${finalAddress}
• City: ${finalCity}
• State: ${finalState}
• Fulfillment Route: ${getDeliveryLabel()}

FINANCIAL SUMMARY:
• Payment Option Chosen: ${activePaymentName}
• Payment Authorization State: ${activePaymentStatus}
• Subtotal Amount: ${formatNaira(subtotal)}
• Logistics Fee: ${formatNaira(deliveryFee)}
• Total Invoiced Amount: ${formatNaira(grandTotal)}

ITEMIZED INVENTORY BUNDLE:
${itemsDescriptionList}

======================================
This summary is prepared for Rozay Kitchen Fulfillment Center Lagos State. Please dispatch immediately!`;

    // Dispatch background email forwarder to buchisluv2010@gmail.com
    try {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "794bc2f8-04fb-4b5a-ba62-a567ea027fbe", // Public sandbox forwarding token
          subject: `New Rozay Kitchen Order #${orderId} - ${finalName}`,
          from_name: "Rozay Kitchen App Checkout",
          name: finalName,
          phone: finalPhone,
          email: finalEmail,
          message: emailBody,
          to_email: "buchisluv2010@gmail.com"
        })
      });
    } catch (e) {
      console.warn("Automated order dispatch fetch failed, falls back gracefully", e);
    }

    // Save Contact as query lead if email exists in localStorage & Supabase
    if (finalEmail) {
      const newLead = {
        name: finalName,
        email: finalEmail,
        phone: finalPhone,
        message: `Placed an online checkout for Order #${orderId} costing ${formatNaira(grandTotal)}`,
        businessType: "Customer Order Checkout",
        createdAt: new Date().toLocaleString()
      };
      addDbSubmission(newLead);
    }

    onClearCart();
    onOrderSuccess(newOrder);
  };

  return (
    <div className="pt-24 pb-24 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper breadcrumbs */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Showroom Catalog</span>
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-xs font-bold text-gray-900">Your Checkout Basket</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mx-auto mb-6">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-display font-black text-gray-950 mb-2">Your shopping trolley is empty!</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6 leading-relaxed">
              Explore our premium commercial-grade non-stick pots, gorgeous glass-top catering dishes, and industrial coolers to get started. 
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Start Shopping Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE: STEPS PANEL (7 Columns) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step indicator headings */}
              <div className="flex bg-white rounded-2xl border border-gray-150 p-2 gap-2">
                <button
                  onClick={() => setStep(1)}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    step === 1 ? "bg-brand-500 text-white shadow-xs" : "text-gray-500 hover:bg-stone-50"
                  }`}
                >
                  1. Shopping Trolley Overview ({cartItems.length})
                </button>
                <button
                  onClick={() => {
                    setStep(2);
                  }}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    step === 2 ? "bg-brand-500 text-white shadow-xs" : "text-gray-500 hover:bg-stone-50"
                  }`}
                >
                  2. Delivery & Payment Details
                </button>
              </div>

              {/* STEP 1: ITEM REVIEW AND COUNT ADJUSTMENTS */}
              {step === 1 && (
                <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div>
                    <h2 className="font-display font-black text-xl text-gray-950">Review Your Selection</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Please check your quantities and variant settings before paying.</p>
                  </div>

                  <div className="divide-y divide-gray-150">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="py-4.5 flex gap-4 first:pt-0 last:pb-0 items-start">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-stone-50 overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={getProductImageUrl(item.product.image)}
                            alt={item.product.name}
                            loading="lazy"
                            decoding="async"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800"; e.currentTarget.onerror = null; }}
                            
                            
                            
                            
                            
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-bold text-xs sm:text-sm text-gray-950 truncate">{item.product.name}</h3>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex justify-between items-center flex-wrap gap-2 pt-1 border-t border-dashed border-gray-100">
                            {/* pricing */}
                            <div className="text-[11px] sm:text-xs">
                              <span className="font-bold text-brand-700 font-mono">
                                {formatNaira(item.product.discountPrice || item.product.price)}
                              </span>
                              <span className="text-gray-400 font-normal"> x {item.quantity}</span>
                            </div>

                            {/* Qty action selectors */}
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-[#fafafa]">
                              <button
                                onClick={() => onUpdateQty(item.product.id, Math.max(1, item.quantity - 1))}
                                className="px-2 py-0.5 text-xs text-gray-500 hover:bg-stone-100 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2.5 text-[11px] font-bold text-gray-900 border-x border-gray-150">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                                className="px-2 py-0.5 text-xs text-gray-500 hover:bg-stone-100 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-150 sm:items-center justify-between">
                    <button
                      onClick={onBack}
                      className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1 cursor-pointer py-2.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Continue Adding Items</span>
                    </button>

                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Delivery & Payment</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SHIPPING DETAILS & PAYMENT FORM */}
              {step === 2 && (
                <form onSubmit={handleCheckoutSubmit} className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div>
                    <h2 className="font-display font-black text-xl text-gray-950">Shipment & Delivery Address</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Where should we deliver your premium kitchen wares?</p>
                  </div>

                  <div className="space-y-4">
                    {/* Customer Info row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Customer Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Kolawole Davies"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-xs pl-10 pr-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            required
                            placeholder="kola@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full text-xs pl-10 pr-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">WhatsApp / Mobile Contact *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 08031234567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full text-xs pl-10 pr-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="col-span-1 sm:col-span-2 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer bg-stone-50 p-4 rounded-xl border border-gray-200 hover:border-brand-300 transition-all">
                          <input 
                            type="checkbox" 
                            checked={isShippingRequested}
                            onChange={(e) => setIsShippingRequested(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                          />
                          <div>
                            <span className="block text-sm font-bold text-gray-900">Request Home Delivery / Shipping</span>
                            <span className="block text-xs text-gray-500 mt-0.5">Check this box if you want us to deliver to your address (Logistics fee applies).</span>
                          </div>
                        </label>
                      </div>

                      {isShippingRequested && (
                        <div className="col-span-1 sm:col-span-2">
                          <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Delivery Destination State *</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                            <select
                              value={state}
                              onChange={(e) => {
                                setState(e.target.value);
                                if (e.target.value !== "Lagos" && e.target.value !== "Lagos State") {
                                  setDeliveryMethod("states");
                                }
                              }}
                              className="w-full text-xs pl-10 pr-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                            >
                              <option value="Lagos">Lagos State</option>
                              <option value="Abuja">Abuja FCT</option>
                              <option value="Ogun">Ogun State</option>
                              <option value="Oyo">Oyo State</option>
                              <option value="Rivers">Rivers State</option>
                              <option value="Kano">Kano State</option>
                              <option value="Enugu">Enugu State</option>
                              <option value="Delta">Delta State</option>
                              <option value="Other">Other States</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {isShippingRequested && (
                      <>
                        {/* Full street Address */}
                        <div>
                          <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Full Detailed Street Address *</label>
                          <input
                            type="text"
                            required
                            placeholder="House Number, Street Name, Estate/Town Landmark information"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full text-xs px-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">City / Town *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Ikeja, Lekki Phase 1, Ibadan"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full text-xs px-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                            />
                          </div>

                          {/* Delivery Logistics selector */}
                          <div>
                            <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Courier Logistics Channel *</label>
                            <select
                              value={deliveryMethod}
                              onChange={(e) => setDeliveryMethod(e.target.value)}
                              className="w-full text-xs px-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                            >
                              {state === "Lagos" ? (
                                <>
                                  <option value="island">Lagos Island Flat Courier Delivery (+₦3,500)</option>
                                  <option value="mainland">Lagos Mainland Hub Logistics (+₦5,000)</option>
                                </>
                              ) : (
                                <option value="states">Inter-State Carrier Parcel Hub (+₦12,000)</option>
                              )}
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                  
                  {/* Payment Method toggle */}
                  <div className="pt-6 border-t border-gray-150 space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-950 text-sm">Choose Payment Channel:</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">All pathways write directly into the merchant database under secure local logs.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Option 1: Paystack */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("Paystack")}
                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                          paymentMethod === "Paystack"
                            ? "border-brand-500 bg-brand-50/20 text-gray-950"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-stone-50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          paymentMethod === "Paystack" ? "border-brand-500" : "border-gray-300"
                        }`}>
                          {paymentMethod === "Paystack" && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs sm:text-sm font-bold block flex items-center gap-1.5">
                            <span>Secure Paystack (Card/Transfer)</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded-sm font-bold">FAST</span>
                          </span>
                          <span className="text-[10px] text-gray-400 block leading-normal">
                            Pays directly via debit cards, bank sandbox, or USSD code.
                          </span>
                        </div>
                      </button>

                      {/* Option 2: WhatsApp / Bank Transfer */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("WhatsApp / Direct Transfer")}
                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                          paymentMethod === "WhatsApp / Direct Transfer"
                            ? "border-brand-500 bg-brand-50/20 text-gray-950"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-stone-50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          paymentMethod === "WhatsApp / Direct Transfer" ? "border-brand-500" : "border-gray-300"
                        }`}>
                          {paymentMethod === "WhatsApp / Direct Transfer" && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs sm:text-sm font-bold block">WhatsApp Manual Checkout</span>
                          <span className="text-[10px] text-gray-400 block leading-normal">
                            Compiles structured shopping text list for immediate WhatsApp redirection.
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-4 pt-6 border-t border-gray-150">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3.5 text-xs font-bold text-gray-500 hover:text-gray-900 border border-gray-200 bg-white hover:bg-stone-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shift shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>{paymentMethod === "Paystack" ? "PROCEED TO PAYSTACK GATEWAY" : "CONFIRM & SEND ON WHATSAPP"}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* RIGHT SIDE: SUMMARY & PROMO CODES (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Order summary panel */}
              <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 space-y-6 shadow-2xs">
                <div>
                  <h3 className="font-display font-black text-lg text-gray-950">Summary of Order</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Pricing breakdown with logistics rates</p>
                </div>

                {/* Promo Code Box */}
                <div className="space-y-2 pb-5 border-b border-gray-150">
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-500 block">Apply Promotional Coupon:</span>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g. ROZAYWELCOME"
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                        className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-gray-200 uppercase bg-stone-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="px-4 bg-stone-900 hover:bg-stone-950 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[10px] font-bold text-rose-500">{promoError}</p>}
                  {appliedPromo && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-150 text-emerald-800 text-[10px] rounded-lg font-bold flex items-center justify-between">
                      <span>✓ Applied: {appliedPromo}</span>
                      <button
                        type="button"
                        onClick={() => { setAppliedPromo(null); setPromoDiscount(0); }}
                        className="text-stone-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Subtotal, delivery, coupon metrics */}
                <div className="space-y-3.5 text-xs font-medium text-gray-600">
                  <div className="flex justify-between">
                    <span>Retail Items Subtotal ({cartItems.length})</span>
                    <span className="font-bold text-gray-900 font-mono">{formatNaira(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-gray-400" />
                      <span>Logistics Transport Cost</span>
                    </span>
                    <span className="font-bold text-gray-900 font-mono">
                      {deliveryFee > 0 ? formatNaira(deliveryFee) : "FREE"}
                    </span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50/40 p-2 rounded-lg">
                      <span>Store Promo Coupon Reduction</span>
                      <span className="font-mono">-{formatNaira(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-150 flex justify-between items-baseline text-gray-950">
                    <span className="font-black text-sm">Grand Total (Net)</span>
                    <span className="text-xl sm:text-2xl font-black text-brand-700 font-mono">
                      {formatNaira(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Immediate trust seal */}
                <div className="p-3 bg-stone-50 border border-gray-100 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[10px] font-mono font-bold text-gray-700">ESCROW ESCORT PROTECTED</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal">
                    This order supports sandbox compliance models. No credit card details are stored or logged on remote servers. Live bank notification simulation ensures robust test capabilities!
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
