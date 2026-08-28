import React, { useState, useEffect } from "react";
import { Product, Order } from "../types";
import { addDbOrder, addDbSubmission, getProductImageUrl } from "../lib/supabase";
import { BRAND_INFO } from "../data";
import { getWhatsAppNumber } from "../lib/whatsapp";
import SafeImage from "./SafeImage";
import { 
  ShoppingBag, Trash2, ArrowLeft, ShieldCheck, CreditCard,
  Phone, Mail, User, MapPin, Tag, Truck, Check, HelpCircle,
  MessageCircle, Send, CheckCircle, Copy, Building, AlertCircle,
  Sparkles, Store
} from "lucide-react";
import toast from "react-hot-toast";

interface CheckoutViewProps {
  cartItems: { product: Product; quantity: number }[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

// Official Business Bank Details for Direct Bank Transfers
const BANK_DETAILS = {
  bankName: "Moniepoint MFB / OPay / Commercial Bank",
  accountName: "Rozay Kitchen / Alaekwe Onyebuchi",
  accountNumber: "8123221174",
  note: "Use your Full Name or Phone Number as the payment reference / narration."
};

export default function CheckoutView({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onBack,
  onOrderSuccess
}: CheckoutViewProps) {
  // Customer Contact Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Delivery Choice: "pickup" | "island" | "mainland" | "states"
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "island" | "mainland" | "states">("island");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Lagos State");

  // Payment Options: "Paystack" | "Bank Transfer" | "WhatsApp"
  const [paymentMethod, setPaymentMethod] = useState<"Paystack" | "Bank Transfer" | "WhatsApp">("Paystack");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Promo Code States
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  // Pre-load Paystack Inline Script on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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
    switch (deliveryMethod) {
      case "pickup": return 0;
      case "island": return 3500;
      case "mainland": return 5000;
      case "states": return 12000;
      default: return 3500;
    }
  };

  const getDeliveryLabel = () => {
    switch (deliveryMethod) {
      case "pickup": return "Self-Pickup at Idumota Lagos Showroom (Free)";
      case "island": return "Lagos Island Express Doorstep Delivery (₦3,500)";
      case "mainland": return "Lagos Mainland Logistics Hub Delivery (₦5,000)";
      case "states": return "Nationwide Inter-State Express Waybill (₦12,000)";
      default: return "Lagos Delivery";
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
      toast.success("10% Welcome discount applied!");
    } else if (code === "IDUMOTA5K") {
      const discount = Math.min(5000, subtotal > 5000 ? 5000 : 1000);
      setPromoDiscount(discount);
      setAppliedPromo("IDUMOTA5K (-₦5,000 Flat Promo)");
      setPromoCode("");
      toast.success("₦5,000 promotional voucher applied!");
    } else {
      setPromoError("Invalid code! Try ROZAYWELCOME or IDUMOTA5K");
      toast.error("Invalid coupon code");
    }
  };

  const copyAccountNumber = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
      setCopiedAccount(true);
      toast.success("Account number copied!");
      setTimeout(() => setCopiedAccount(false), 2500);
    }
  };

  // Helper: Sanitize customer inputs
  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Please enter your WhatsApp / mobile phone number");
      return false;
    }
    if (deliveryMethod !== "pickup" && !address.trim()) {
      toast.error("Please enter your delivery street address");
      return false;
    }
    return true;
  };

  // Helper: Get Paystack Public Key
  const getPaystackKey = (): string => {
    const rawKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
    // Clean whitespace and quotes
    const cleanKey = rawKey.trim().replace(/^["']|["']$/g, "");
    
    // Check if key is a placeholder or invalid
    if (!cleanKey || cleanKey.includes("xxxxxxxx") || cleanKey.length < 20) {
      return "";
    }
    return cleanKey;
  };

  // Handle Paystack Payment Trigger
  const handlePaystackPayment = () => {
    const publicKey = getPaystackKey();
    const customerEmail = email.trim() || `${phone.replace(/\D/g, "") || "customer"}@rozaykitchen.com`;
    const reference = `RZK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (!publicKey) {
      // Gracefully notify merchant/user that key is not configured and offer bank transfer / WhatsApp
      toast.error(
        "Paystack live key is not yet set in environment. Switching you to Direct Bank Transfer / WhatsApp checkout!",
        { duration: 6000 }
      );
      setPaymentMethod("Bank Transfer");
      setIsProcessing(false);
      return;
    }

    const paystackMetadata = {
      customer_name: name.trim(),
      phone_number: phone.trim(),
      delivery_method: getDeliveryLabel(),
      delivery_address: deliveryMethod === "pickup" ? "Showroom Pickup" : `${address}, ${city}, ${state}`,
      cart_count: cartItems.length,
      custom_fields: [
        { display_name: "Customer Name", variable_name: "customer_name", value: name.trim() },
        { display_name: "Phone", variable_name: "phone_number", value: phone.trim() },
        { display_name: "Delivery Route", variable_name: "delivery_route", value: getDeliveryLabel() }
      ]
    };

    const triggerPopup = () => {
      try {
        const PaystackPop = (window as any).PaystackPop;
        if (!PaystackPop) {
          throw new Error("Paystack SDK not loaded");
        }

        // Method 1: Standard Paystack V1 Setup (Most reliable across all Nigerian banks and mobile browsers)
        if (typeof PaystackPop.setup === "function") {
          const handler = PaystackPop.setup({
            key: publicKey,
            email: customerEmail,
            amount: Math.round(grandTotal * 100), // In Kobo
            currency: "NGN",
            ref: reference,
            metadata: paystackMetadata,
            callback: (response: any) => {
              setIsProcessing(false);
              toast.success("Payment Confirmed via Paystack!");
              finalizeOrder("Paystack", "Paid", response.reference || reference);
            },
            onClose: () => {
              setIsProcessing(false);
              toast("Payment window closed. You can complete anytime.");
            }
          });
          handler.openIframe();
          return;
        }

        // Method 2: Paystack V2 newTransaction fallback
        const paystackInstance = new PaystackPop();
        paystackInstance.newTransaction({
          key: publicKey,
          email: customerEmail,
          amount: Math.round(grandTotal * 100),
          reference: reference,
          metadata: paystackMetadata,
          onSuccess: (transaction: any) => {
            setIsProcessing(false);
            toast.success("Payment Confirmed via Paystack!");
            finalizeOrder("Paystack", "Paid", transaction.reference || reference);
          },
          onCancel: () => {
            setIsProcessing(false);
            toast("Payment window closed.");
          }
        });
      } catch (err) {
        console.error("Paystack popup initialization failed:", err);
        setIsProcessing(false);
        toast.error("Could not launch Paystack. Switching you to Direct Bank Transfer / WhatsApp!");
        setPaymentMethod("Bank Transfer");
      }
    };

    // Ensure script is ready
    if (!(window as any).PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => triggerPopup();
      script.onerror = () => {
        setIsProcessing(false);
        toast.error("Network error loading payment gateway. Please use Direct Bank Transfer or WhatsApp.");
        setPaymentMethod("Bank Transfer");
      };
      document.body.appendChild(script);
    } else {
      triggerPopup();
    }
  };

  // Main Submit Handler
  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    if (paymentMethod === "Paystack") {
      handlePaystackPayment();
    } else if (paymentMethod === "Bank Transfer") {
      // Finalize order with "Pending" status and route to success page showing bank details
      finalizeOrder("Direct Bank Transfer", "Pending");
    } else {
      // WhatsApp Checkout
      finalizeOrder("WhatsApp / Direct Transfer", "Pending");
    }
  };

  // Order Finalizer
  const finalizeOrder = (
    chosenMethod: "Paystack" | "Direct Bank Transfer" | "WhatsApp / Direct Transfer",
    paidStatus: "Paid" | "Pending",
    transactionRef?: string
  ) => {
    const orderId = `RZK-ORD-${Date.now().toString().slice(-6)}`;
    const finalName = name.trim() || "Valued Customer";
    const finalEmail = email.trim() || `${phone.replace(/\D/g, "") || "guest"}@rozaykitchen.com`;
    const finalPhone = phone.trim() || BRAND_INFO.phone;
    const finalAddress = deliveryMethod === "pickup" 
      ? "Showroom Pickup (Idumota, Lagos Island)" 
      : `${address.trim()}, ${city.trim() || "Lagos"}, ${state}`;

    const newOrder: Order = {
      id: orderId,
      customerName: finalName,
      customerEmail: finalEmail,
      customerPhone: finalPhone,
      address: finalAddress,
      city: city.trim() || "Lagos",
      state: state,
      deliveryMethod: getDeliveryLabel(),
      deliveryFee,
      items: cartItems,
      subtotal,
      total: grandTotal,
      paymentMethod: chosenMethod,
      paymentStatus: paidStatus,
      orderStatus: "Received",
      createdAt: new Date().toLocaleString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    // 1. Save to Supabase and LocalStorage
    try {
      addDbOrder(newOrder);
    } catch (e) {
      console.warn("Could not write order to DB:", e);
    }

    // 2. Automated Web3Forms Dispatch Notification
    const itemsDescriptionList = cartItems.map((item, idx) => {
      const activeItemPrice = item.product.discountPrice || item.product.price;
      return `${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ${formatNaira(activeItemPrice * item.quantity)}`;
    }).join("\n");

    const emailBody = `NEW ORDER RECEIVED - ROZAY KITCHEN 🛒
======================================
Order ID: #${orderId}
Transaction Ref: ${transactionRef || "N/A"}
Date: ${newOrder.createdAt}

CUSTOMER DETAILS:
• Full Name: ${finalName}
• Phone: ${finalPhone}
• Email: ${finalEmail}

DELIVERY LOGISTICS:
• Method: ${getDeliveryLabel()}
• Destination Address: ${finalAddress}

PAYMENT & TOTAL:
• Payment Method: ${chosenMethod}
• Payment Status: ${paidStatus === "Paid" ? "CONFIRMED PAID (PAYSTACK)" : "PENDING DIRECT BANK / WHATSAPP"}
• Subtotal: ${formatNaira(subtotal)}
• Logistics Fee: ${formatNaira(deliveryFee)}
• Promo Discount: ${promoDiscount > 0 ? `-${formatNaira(promoDiscount)}` : "None"}
• TOTAL INVOICE: ${formatNaira(grandTotal)}

ITEMS ORDERED:
${itemsDescriptionList}

Fulfillment Team: Please prepare and dispatch from Rozay Kitchen Idumota Hub!`;

    try {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "794bc2f8-04fb-4b5a-ba62-a567ea027fbe",
          subject: `New Rozay Kitchen Order #${orderId} - ${finalName} [${formatNaira(grandTotal)}]`,
          from_name: "Rozay Kitchen Checkout",
          name: finalName,
          phone: finalPhone,
          email: finalEmail,
          message: emailBody,
          to_email: "buchisluv2010@gmail.com"
        })
      });
    } catch (e) {}

    // Save lead submission
    try {
      addDbSubmission({
        name: finalName,
        email: finalEmail,
        phone: finalPhone,
        message: `Placed order #${orderId} (${formatNaira(grandTotal)}) via ${chosenMethod}`,
        businessType: "Online Storefront Order",
        createdAt: newOrder.createdAt
      });
    } catch (e) {}

    // Clear cart and route to OrderSuccessView
    onClearCart();
    setIsProcessing(false);
    onOrderSuccess(newOrder);
  };

  return (
    <div className="pt-24 pb-24 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalog</span>
          </button>
          <span className="text-stone-300">/</span>
          <span className="text-xs font-extrabold text-stone-900">Express Checkout</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mx-auto mb-6">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-stone-950 mb-2">Your shopping basket is empty</h2>
            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
              Explore our luxury chafing dishes, premium cooking pots, and commercial kitchenware to place an order.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3.5 bg-stone-900 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
            >
              Start Shopping Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleProceed} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: CUSTOMER & DELIVERY & PAYMENT (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* SECTION 1: CUSTOMER CONTACT */}
              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="font-black text-lg text-stone-950">Customer Contact Details</h2>
                    <p className="text-xs text-stone-400">Where should we send your invoice and delivery status?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-[11px] uppercase font-mono font-bold text-stone-500 block mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chief Kolawole Adeleke"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-sm pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-500 rounded-xl focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase font-mono font-bold text-stone-500 block mb-1">
                        WhatsApp / Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 0812 322 1174"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full text-sm pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-500 rounded-xl focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase font-mono font-bold text-stone-500 block mb-1">
                        Email Address <span className="text-stone-400 font-normal lowercase">(optional for receipt)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          placeholder="kola@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full text-sm pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-500 rounded-xl focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DELIVERY & SHIPPING */}
              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="font-black text-lg text-stone-950">Select Delivery Method</h2>
                    <p className="text-xs text-stone-400">Choose doorstep delivery or free showroom pickup in Idumota</p>
                  </div>
                </div>

                {/* Delivery Options Radio Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Lagos Island */}
                  <div
                    onClick={() => setDeliveryMethod("island")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === "island"
                        ? "border-amber-500 bg-amber-50/30 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-950 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Lagos Island Delivery</span>
                      </span>
                      <span className="text-xs font-black font-mono text-amber-600">₦3,500</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Fast doorstep dispatch to VI, Lekki, Ikoyi & Island</p>
                  </div>

                  {/* Option 2: Lagos Mainland */}
                  <div
                    onClick={() => setDeliveryMethod("mainland")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === "mainland"
                        ? "border-amber-500 bg-amber-50/30 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-950 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Lagos Mainland Delivery</span>
                      </span>
                      <span className="text-xs font-black font-mono text-amber-600">₦5,000</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Ikeja, Surulere, Yaba, Festac, Ikorodu & Mainland hubs</p>
                  </div>

                  {/* Option 3: Nationwide Inter-State */}
                  <div
                    onClick={() => setDeliveryMethod("states")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === "states"
                        ? "border-amber-500 bg-amber-50/30 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-950 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Nationwide Inter-State</span>
                      </span>
                      <span className="text-xs font-black font-mono text-amber-600">₦12,000</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Abuja, Port Harcourt, Ibadan, Kano, Delta, Enugu, etc.</p>
                  </div>

                  {/* Option 4: Free Showroom Pickup */}
                  <div
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === "pickup"
                        ? "border-emerald-500 bg-emerald-50/30 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-950 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Showroom Walk-in Pickup</span>
                      </span>
                      <span className="text-xs font-black font-mono text-emerald-600 uppercase">FREE (₦0)</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Idumota Market Gorodom, Lagos Island showroom</p>
                  </div>
                </div>

                {/* Delivery Street Address (When shipping is selected) */}
                {deliveryMethod !== "pickup" ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] uppercase font-mono font-bold text-stone-500 block mb-1">
                        Delivery Street Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          required
                          placeholder="House/Plot No., Street Name, Estate or Nearest Landmark"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full text-sm pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-500 rounded-xl focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase font-mono font-bold text-stone-500 block mb-1">
                          City / Town *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Lekki Phase 1, Ikeja, Abuja"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full text-sm px-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-500 rounded-xl focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] uppercase font-mono font-bold text-stone-500 block mb-1">
                          State *
                        </label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full text-sm px-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-500 rounded-xl focus:outline-none transition-colors"
                        >
                          <option value="Lagos State">Lagos State</option>
                          <option value="Abuja FCT">Abuja FCT</option>
                          <option value="Ogun State">Ogun State</option>
                          <option value="Oyo State">Oyo State</option>
                          <option value="Rivers State">Rivers State</option>
                          <option value="Delta State">Delta State</option>
                          <option value="Enugu State">Enugu State</option>
                          <option value="Kano State">Kano State</option>
                          <option value="Anambra State">Anambra State</option>
                          <option value="Edo State">Edo State</option>
                          <option value="Other States">Other Nigerian State</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl text-xs text-stone-700 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Store className="w-4 h-4 text-amber-600" />
                      <span>Showroom Pickup Address:</span>
                    </p>
                    <p className="text-stone-600 leading-relaxed pl-5.5">
                      {BRAND_INFO.location}
                    </p>
                    <p className="text-[11px] text-amber-700 font-bold pl-5.5 pt-1">
                      Operating Hours: Mon – Sat (8:00 AM – 6:00 PM)
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 3: PAYMENT METHOD */}
              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="font-black text-lg text-stone-950">Choose Payment Method</h2>
                    <p className="text-xs text-stone-400">Select how you would like to complete your payment</p>
                  </div>
                </div>

                {/* Payment Options Grid */}
                <div className="space-y-3">
                  {/* Option A: Paystack */}
                  <div
                    onClick={() => setPaymentMethod("Paystack")}
                    className={`p-4.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                      paymentMethod === "Paystack"
                        ? "border-amber-500 bg-amber-50/30 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      paymentMethod === "Paystack" ? "border-amber-500" : "border-stone-300"
                    }`}>
                      {paymentMethod === "Paystack" && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm font-extrabold text-stone-950 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-amber-600" />
                          <span>Pay with Paystack (Card, Transfer, USSD, Apple Pay)</span>
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Instant Auto-Receipt
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 leading-normal">
                        Pay securely with your Nigerian ATM debit card, instant bank transfer code, or USSD via Paystack.
                      </p>
                    </div>
                  </div>

                  {/* Option B: Direct Bank Transfer (On Screen) */}
                  <div
                    onClick={() => setPaymentMethod("Bank Transfer")}
                    className={`p-4.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                      paymentMethod === "Bank Transfer"
                        ? "border-amber-500 bg-amber-50/30 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      paymentMethod === "Bank Transfer" ? "border-amber-500" : "border-stone-300"
                    }`}>
                      {paymentMethod === "Bank Transfer" && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm font-extrabold text-stone-950 flex items-center gap-2">
                          <Building className="w-4 h-4 text-amber-600" />
                          <span>Direct Bank Transfer (Manual Mobile App Transfer)</span>
                        </span>
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Zero Gateway Fees
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 leading-normal">
                        Transfer directly from your banking app into the official Rozay Kitchen account.
                      </p>

                      {/* Display Bank Account Details Card if Selected */}
                      {paymentMethod === "Bank Transfer" && (
                        <div className="mt-4 p-4 bg-stone-900 text-white rounded-2xl space-y-3 border border-amber-500/30 shadow-md">
                          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                            <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
                              Rozay Kitchen Official Bank Account
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">Nigeria Naira (NGN)</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-stone-400 text-[10px] block">Bank Name:</span>
                              <span className="font-bold text-white text-sm">{BANK_DETAILS.bankName}</span>
                            </div>
                            <div>
                              <span className="text-stone-400 text-[10px] block">Account Name:</span>
                              <span className="font-bold text-white text-sm">{BANK_DETAILS.accountName}</span>
                            </div>
                          </div>

                          <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                            <div>
                              <span className="text-stone-400 text-[10px] block">Account Number:</span>
                              <span className="font-mono font-black text-amber-400 text-lg tracking-wider">
                                {BANK_DETAILS.accountNumber}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyAccountNumber();
                              }}
                              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              {copiedAccount ? <Check className="w-3.5 h-3.5 text-stone-950" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedAccount ? "Copied!" : "Copy"}</span>
                            </button>
                          </div>

                          <p className="text-[11px] text-stone-400 leading-relaxed">
                            💡 {BANK_DETAILS.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Option C: WhatsApp Quick Order */}
                  <div
                    onClick={() => setPaymentMethod("WhatsApp")}
                    className={`p-4.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                      paymentMethod === "WhatsApp"
                        ? "border-emerald-500 bg-emerald-50/30 shadow-xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      paymentMethod === "WhatsApp" ? "border-emerald-500" : "border-stone-300"
                    }`}>
                      {paymentMethod === "WhatsApp" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm font-extrabold text-stone-950 flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                          <span>WhatsApp Order & Sales Rep Support</span>
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Chat Direct
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 leading-normal">
                        Sends your formatted order list to WhatsApp (+234 812 322 1174) for instant live coordination.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-2xl text-stone-950 font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                    paymentMethod === "WhatsApp"
                      ? "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20 text-white"
                      : "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-105 shadow-amber-500/30"
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>
                    {isProcessing
                      ? "PROCESSING..."
                      : paymentMethod === "Paystack"
                      ? `PAY ${formatNaira(grandTotal)} WITH PAYSTACK`
                      : paymentMethod === "Bank Transfer"
                      ? `CONFIRM BANK TRANSFER (${formatNaira(grandTotal)})`
                      : `SEND ORDER TO WHATSAPP (${formatNaira(grandTotal)})`}
                  </span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 mt-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SSL Encrypted Checkout • Rozay Kitchen Idumota Lagos Hub Guaranteed</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: BASKET ITEMS & TOTAL BREAKDOWN (5 COLS) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* ORDER SUMMARY CARD */}
              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-6 shadow-xs sticky top-28">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-stone-950">Order Summary</h3>
                    <span className="text-xs font-bold text-amber-600 font-mono bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
                      {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">Review items in your luxury basket</p>
                </div>

                {/* Items List */}
                <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3.5 items-start">
                      <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <SafeImage
                          src={getProductImageUrl(item.product.image)}
                          alt={item.product.name}
                          fallbackIcon="shopping-bag"
                          fallbackSrc="https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800"
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover"
                          iconClassName="w-6 h-6 text-stone-400 stroke-[1.5]"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-stone-950 truncate">{item.product.name}</h4>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-stone-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs font-mono font-bold text-amber-700">
                            {formatNaira(item.product.discountPrice || item.product.price)}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.product.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 text-[11px] font-bold text-stone-900 border-x border-stone-200">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-200 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Box */}
                <div className="pt-4 border-t border-stone-150 space-y-2">
                  <label className="text-[10px] uppercase font-mono font-bold text-stone-500 block">
                    Promotional Coupon Code:
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        placeholder="e.g. ROZAYWELCOME"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError("");
                        }}
                        className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 uppercase bg-stone-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="px-4 bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[10px] font-bold text-rose-500">{promoError}</p>}
                  {appliedPromo && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-xl font-bold flex items-center justify-between">
                      <span>✓ {appliedPromo}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedPromo(null);
                          setPromoDiscount(0);
                        }}
                        className="text-stone-400 hover:text-rose-600 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-stone-150 text-xs font-medium text-stone-600">
                  <div className="flex justify-between">
                    <span>Products Subtotal</span>
                    <span className="font-bold text-stone-900 font-mono">{formatNaira(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-stone-400" />
                      <span>Delivery Logistics</span>
                    </span>
                    <span className="font-bold text-stone-900 font-mono">
                      {deliveryFee > 0 ? formatNaira(deliveryFee) : "FREE (₦0)"}
                    </span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-2 rounded-xl">
                      <span>Promo Coupon Voucher</span>
                      <span className="font-mono">-{formatNaira(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline text-stone-950">
                    <div>
                      <span className="font-black text-sm block">Grand Total</span>
                      <span className="text-[10px] text-stone-400">Total payable in Nigerian Naira (NGN)</span>
                    </div>
                    <span className="text-2xl font-black text-amber-700 font-mono">
                      {formatNaira(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Customer Support Helpline Box */}
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-stone-800">
                    <span className="font-bold block">Need Help Ordering?</span>
                    <span className="text-stone-600 text-[11px]">Call / WhatsApp: {BRAND_INFO.phone}</span>
                  </div>
                </div>

              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}
