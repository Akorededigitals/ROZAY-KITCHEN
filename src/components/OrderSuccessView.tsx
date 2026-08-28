import React, { useState } from "react";
import { Order } from "../types";
import { BRAND_INFO } from "../data";
import { buildOrderWhatsAppMessage, createWhatsAppUrl } from "../lib/whatsapp";
import { 
  CheckCircle, ArrowLeft, MessageCircle, Mail, Printer, 
  MapPin, Clock, Calendar, Hash, FileText, ChevronRight,
  User, Phone, Sparkles, Building2, ExternalLink, Copy, Check,
  CreditCard
} from "lucide-react";
import toast from "react-hot-toast";

interface OrderSuccessViewProps {
  order: Order;
  onReturnToShop: () => void;
}

const BANK_DETAILS = {
  bankName: "Moniepoint MFB / OPay / Commercial Bank",
  accountName: "Rozay Kitchen / Alaekwe Onyebuchi",
  accountNumber: "8123221174",
  note: "Use your Full Name or Phone Number as the narration / description."
};

export default function OrderSuccessView({ order, onReturnToShop }: OrderSuccessViewProps) {
  const [showEmailPreview, setShowEmailPreview] = useState(true);
  const [copied, setCopied] = useState(false);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const copyAccount = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
      setCopied(true);
      toast.success("Account Number Copied!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Compile the official WhatsApp message using centralized helper
  const compileWhatsAppText = () => {
    const msg = buildOrderWhatsAppMessage(order);
    return createWhatsAppUrl(msg);
  };

  const isBankTransfer = order.paymentMethod.includes("Bank") || order.paymentStatus !== "Paid";

  return (
    <div className="pt-24 pb-24 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SUCCESS ICON HEADER ACCENT */}
        <div className="text-center mb-10 space-y-3">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xl">
            <CheckCircle className="w-9 h-9" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest font-extrabold text-emerald-700 uppercase bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300">
              {order.paymentStatus === "Paid" ? "Payment Confirmed (Paystack)" : "Order Invoiced Successfully"}
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-stone-950 tracking-tight mt-2.5">
              Thank you for your Order!
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mt-1 leading-relaxed">
              Your kitchen wares are being prepared at our Idumota warehouse depot. Outgoing confirmation notices have been dispatched.
            </p>
          </div>
        </div>

        {/* BANK TRANSFER INSTRUCTIONS CARD (If Bank Transfer or Pending) */}
        {isBankTransfer && (
          <div className="mb-8 bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>DIRECT BANK TRANSFER DETAILS</span>
              </div>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-amber-500/30 uppercase">
                Awaiting Payment Confirmation
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Please make a direct transfer of <strong className="text-amber-400 font-mono text-sm">{formatNaira(order.total)}</strong> to our official business account below to dispatch your order immediately:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-950/80 p-4 rounded-2xl border border-stone-800 text-xs">
              <div>
                <span className="text-stone-400 text-[10px] block font-mono">Bank Name:</span>
                <span className="font-bold text-white text-sm">{BANK_DETAILS.bankName}</span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] block font-mono">Account Name:</span>
                <span className="font-bold text-white text-sm">{BANK_DETAILS.accountName}</span>
              </div>
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <div>
                  <span className="text-stone-400 text-[10px] block font-mono">Account Number:</span>
                  <span className="font-mono font-black text-amber-400 text-base">{BANK_DETAILS.accountNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={copyAccount}
                  className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
              <span className="text-[11px] text-stone-400">
                💡 {BANK_DETAILS.note}
              </span>
              <a
                href={compileWhatsAppText()}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send Transfer Proof on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* PRIMARY COLUMNS: RECEIPT VS EMAILS PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* COLUMN 1: INTERACTIVE BILL RECEIPT (PRINT READY) */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm relative print:border-none print:shadow-none">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs uppercase text-stone-400 font-bold block leading-none font-mono">Invoice Reference</span>
                <span className="font-extrabold text-stone-950 font-mono text-sm">#{order.id}</span>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase text-stone-400 font-bold block leading-none font-mono">Order Status</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase border ${
                  order.paymentStatus === "Paid"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}>
                  {order.paymentStatus === "Paid" ? "CONFIRMED PAID" : "PENDING DISPATCH"}
                </span>
              </div>
            </div>

            {/* Date Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block mb-0.5 uppercase font-mono text-[9px] font-bold">Fulfillment Date:</span>
                <span className="font-semibold text-stone-800 leading-normal block">{order.createdAt}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5 uppercase font-mono text-[9px] font-bold">Fulfillment Point:</span>
                <span className="font-semibold text-stone-800 leading-normal block">Rozay Depot, Lagos Island</span>
              </div>
            </div>

            {/* Address fields */}
            <div className="p-4 bg-stone-50 border border-stone-150 rounded-2xl text-xs space-y-2">
              <h4 className="font-bold text-stone-950 block border-b border-stone-200/60 pb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Shipping Destination:</span>
              </h4>
              <p className="text-stone-700 leading-relaxed font-semibold">
                {order.customerName}<br/>
                {order.address}<br/>
                Contact: {order.customerPhone}
              </p>
            </div>

            {/* Itemized Lists */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-950 text-xs block border-b border-stone-100 pb-1">Items Invoiced:</h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {order.items.map((item, idx) => {
                  const activePrice = item.product.discountPrice || item.product.price;
                  return (
                    <div key={idx} className="flex justify-between text-xs items-center py-1">
                      <div className="truncate pr-4 flex-1">
                        <span className="font-bold text-stone-950 block truncate">{item.product.name}</span>
                        <span className="text-stone-400 block text-[10px]">Multiplier: {item.quantity} x {formatNaira(activePrice)}</span>
                      </div>
                      <span className="font-bold text-stone-900 font-mono shrink-0">{formatNaira(activePrice * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtotals */}
            <div className="pt-4 border-t border-stone-150 text-xs space-y-2 font-medium text-stone-600">
              <div className="flex justify-between">
                <span>Products Subtotal</span>
                <span className="font-semibold text-stone-900 font-mono">{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Logistics</span>
                <span className="font-semibold text-stone-900 font-mono">{formatNaira(order.deliveryFee)}</span>
              </div>
              {order.subtotal + order.deliveryFee > order.total && (
                <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50/40 p-1.5 rounded-sm">
                  <span>Store Promo Reductions</span>
                  <span className="font-mono">-{formatNaira((order.subtotal + order.deliveryFee) - order.total)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-stone-950 font-black">
                <span className="text-sm">Total Invoiced (Net)</span>
                <span className="text-lg font-black text-amber-700 font-mono">{formatNaira(order.total)}</span>
              </div>
            </div>

            {/* Direct primary checkout buttons */}
            <div className="pt-4 border-t border-stone-150 space-y-3 print:hidden">
              <a
                href={compileWhatsAppText()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current text-white" />
                <span>CONFIRM ORDER ON WHATSAPP (+234 812 322 1174)</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePrint}
                  className="py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onReturnToShop}
                  className="py-2.5 rounded-xl bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                >
                  Return to Store
                </button>
              </div>
            </div>

          </div>

          {/* COLUMN 2: TRANSACTIONAL NOTIFICATION SUMMARY */}
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600" />
                <span>Order Confirmation Summary</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                LOGGED TO DATABASE
              </span>
            </div>

            {showEmailPreview && (
              <div className="bg-stone-900 rounded-3xl p-6 text-stone-300 text-xs font-sans space-y-4 shadow-xl border border-stone-800">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <span className="text-amber-400 font-bold font-mono">ROZAY KITCHEN INVOICE DISPATCH</span>
                  <span className="text-[10px] text-stone-400">ID: #{order.id}</span>
                </div>

                <div className="space-y-2 text-stone-300 text-xs leading-relaxed">
                  <p>
                    <strong className="text-white">Customer:</strong> {order.customerName}
                  </p>
                  <p>
                    <strong className="text-white">WhatsApp / Phone:</strong> {order.customerPhone}
                  </p>
                  <p>
                    <strong className="text-white">Delivery Method:</strong> {order.deliveryMethod}
                  </p>
                  <p>
                    <strong className="text-white">Payment Method:</strong> {order.paymentMethod} ({order.paymentStatus})
                  </p>
                </div>

                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1 text-[11px]">
                  <span className="text-stone-400 block font-mono text-[10px]">Depot Dispatch Address:</span>
                  <p className="text-stone-200">
                    {BRAND_INFO.location}
                  </p>
                </div>

                <p className="text-[11px] text-stone-400 leading-normal">
                  Our dispatch logistics team will call or WhatsApp your line <strong className="text-amber-300">{order.customerPhone}</strong> to confirm parcel departure.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
