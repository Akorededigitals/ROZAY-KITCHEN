import React, { useState } from "react";
import { motion } from "motion/react";
import { Order } from "../types";
import { BRAND_INFO } from "../data";
import { 
  CheckCircle, ArrowLeft, MessageCircle, Mail, Printer, 
  MapPin, Clock, Calendar, Hash, FileText, ChevronRight,
  User, Phone, Sparkles, Building2, ExternalLink
} from "lucide-react";

interface OrderSuccessViewProps {
  order: Order;
  onReturnToShop: () => void;
}

export default function OrderSuccessView({ order, onReturnToShop }: OrderSuccessViewProps) {
  const [showEmailPreview, setShowEmailPreview] = useState(true);

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

  // Compile the official WhatsApp message
  const compileWhatsAppText = () => {
    let msg = `*🚀 ROZAY KITCHEN SHOWROOM ORDER LISTING*\n`;
    msg += `--------------------------------------------\n`;
    msg += `*Order Reference:* #${order.id}\n`;
    msg += `*Fulfillment Date:* ${order.createdAt}\n`;
    msg += `*Payment Pathway:* ${order.paymentMethod} (${order.paymentStatus})\n`;
    msg += `--------------------------------------------\n`;
    msg += `*CUSTOMER PROFILE:*\n`;
    msg += `• *Name:* ${order.customerName}\n`;
    msg += `• *Phone:* ${order.customerPhone}\n`;
    msg += `• *Email:* ${order.customerEmail}\n`;
    msg += `• *Delivery Dest:* ${order.address}, ${order.city}, ${order.state}\n`;
    msg += `--------------------------------------------\n`;
    msg += `*ITEMIZED PRODUCT INVENTORY:*\n`;
    
    order.items.forEach((item, index) => {
      const activePrice = item.product.discountPrice || item.product.price;
      msg += `${index + 1}. *${item.product.name}* (Qty: ${item.quantity}) - _${formatNaira(activePrice * item.quantity)}_\n`;
    });

    msg += `--------------------------------------------\n`;
    msg += `• *Subtotal:* ${formatNaira(order.subtotal)}\n`;
    msg += `• *Logistics rate:* ${formatNaira(order.deliveryFee)}\n`;
    msg += `*GRAND TOTAL:* _${formatNaira(order.total)}_\n`;
    msg += `--------------------------------------------\n`;
    msg += `*Status:* Showroom booking received. Please confirm dispatcher logistics! Thank you.`;

    const encoded = encodeURIComponent(msg);
    // Official Rozay Kitchen business helpline number
    return `https://wa.me/2348123221174?text=${encoded}`;
  };

  return (
    <div className="pt-24 pb-24 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SUCCESS ICON HEADER ACCENT */}
        <div className="text-center mb-10 space-y-3">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xl">
            <CheckCircle className="w-9 h-9 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest font-extrabold text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Transaction Successful
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-gray-950 tracking-tight mt-2.5">
              Thank you for your Order!
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto mt-1 leading-relaxed">
              Your kitchen wares are being curated at our warehouse depot. Outgoing confirmation emails have been dispatched.
            </p>
          </div>
        </div>

        {/* PRIMARY COLUMNS: RECEIPT VS EMAILS PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* COLUMN 1: INTERACTIVE BILL RECEIPT (PRINT READY) */}
          <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 space-y-6 shadow-sm relative print:border-none print:shadow-none">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs uppercase text-gray-400 font-bold block leading-none font-mono">Invoice Reference</span>
                <span className="font-extrabold text-gray-950 font-mono text-sm">#{order.id}</span>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase text-gray-400 font-bold block leading-none font-mono">Order Status</span>
                <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                  {order.paymentStatus === "Paid" ? "CONFIRMED PAID" : "PENDING DIRECT"}
                </span>
              </div>
            </div>

            {/* Date Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5 uppercase font-mono text-[9px] font-bold">Fulfillment Date:</span>
                <span className="font-semibold text-gray-800 leading-normal block">{order.createdAt}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5 uppercase font-mono text-[9px] font-bold">Fulfillment Point:</span>
                <span className="font-semibold text-gray-800 leading-normal block">Rozay Depot, Lagos Island</span>
              </div>
            </div>

            {/* Address fields */}
            <div className="p-4 bg-stone-50 border border-gray-150 rounded-2xl text-xs space-y-2">
              <h4 className="font-bold text-gray-950 block border-b border-gray-100 pb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>Shipping Destination:</span>
              </h4>
              <p className="text-stone-600 leading-relaxed font-semibold">
                {order.customerName}<br/>
                {order.address}, {order.city}, {order.state}<br/>
                Contact No: {order.customerPhone}
              </p>
            </div>

            {/* Itemized Lists */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-950 text-xs block border-b border-gray-100 pb-1">Items Invoiced:</h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {order.items.map((item, idx) => {
                  const activePrice = item.product.discountPrice || item.product.price;
                  return (
                    <div key={idx} className="flex justify-between text-xs items-center py-1">
                      <div className="truncate pr-4 flex-1">
                        <span className="font-bold text-gray-950 block truncate">{item.product.name}</span>
                        <span className="text-gray-400 block text-[10px]">Multiplier: {item.quantity} x {formatNaira(activePrice)}</span>
                      </div>
                      <span className="font-bold text-gray-900 font-mono shrink-0">{formatNaira(activePrice * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtotals */}
            <div className="pt-4 border-t border-gray-150 text-xs space-y-2 font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Showroom Subtotal</span>
                <span className="font-semibold text-gray-900 font-mono">{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Admin Surcharges</span>
                <span className="font-semibold text-gray-900 font-mono">{formatNaira(order.deliveryFee)}</span>
              </div>
              {order.subtotal + order.deliveryFee > order.total && (
                <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50/40 p-1.5 rounded-sm">
                  <span>Store Promo Reductions</span>
                  <span className="font-mono">-{formatNaira((order.subtotal + order.deliveryFee) - order.total)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-150 flex justify-between items-baseline text-gray-950 font-black">
                <span className="text-sm">Total Invoiced (Net)</span>
                <span className="text-lg font-black text-brand-700 font-mono">{formatNaira(order.total)}</span>
              </div>
            </div>

            {/* Direct primary checkout buttons */}
            <div className="pt-4 border-t border-gray-150 space-y-3 print:hidden">
              <a
                href={compileWhatsAppText()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current text-white" />
                <span>FINALIZE DISPATCH OVER WHATSAPP</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePrint}
                  className="py-2.5 rounded-xl border border-gray-200 hover:bg-stone-50 text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Bill</span>
                </button>
                <button
                  onClick={onReturnToShop}
                  className="py-2.5 rounded-xl bg-stone-900 hover:bg-stone-950 text-white text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>

          </div>

          {/* COLUMN 2: TRANSACTIONAL EMAIL NOTIFICATION PREVIEW */}
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-600" />
                <span>Outgoing Email Notifications</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                DISPATCHED AUTOMATICALLY
              </span>
            </div>

            {showEmailPreview && (
              <div className="bg-slate-900 rounded-3xl p-5 text-gray-300 text-xs font-sans space-y-4 shadow-xl max-h-[500px] overflow-y-auto relative animate-fade-in border border-slate-800">
                <div className="absolute top-4 right-4 text-[9px] font-mono text-slate-500">
                  SMTP Sandbox Ready
                </div>

                {/* Email 1: Sent to Customer */}
                <div className="space-y-2 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-[#40e0d0]">To:</span>
                    <span>{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-[#40e0d0]">Subject:</span>
                    <span className="font-semibold text-white">Rozay Kitchen Invoice - Order Confirm #{order.id}</span>
                  </div>

                  {/* High fidelity HTML Email simulation Box */}
                  <div className="bg-white rounded-2xl p-4.5 text-gray-800 space-y-4 shadow-inner mt-2">
                    <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                      <span className="font-display font-black text-sm tracking-tight text-gray-900">ROZAY KITCHEN</span>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100">CONFIRMED ORDER</span>
                    </div>

                    <div className="space-y-1.5 leading-relaxed text-[11px]">
                      <p className="font-bold text-stone-900">Hello {order.customerName},</p>
                      <p className="text-stone-600">
                        Thanks for securing your kitchen upgrades with us! We have successfully received your electronic order confirmation. Below is your detailed receipt itemization.
                      </p>
                    </div>

                    <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl space-y-1.5 font-mono text-[9px] text-stone-500">
                      <div><strong className="text-stone-700">INVOICE:</strong> #{order.id}</div>
                      <div><strong className="text-stone-700">DATE:</strong> {order.createdAt}</div>
                      <div><strong className="text-stone-700">LOGISTICS:</strong> {order.deliveryMethod}</div>
                      <div><strong className="text-stone-700">PAYMENT:</strong> {order.paymentMethod} ({order.paymentStatus})</div>
                    </div>

                    <table className="w-full text-left text-[10px] divide-y divide-gray-150">
                      <thead>
                        <tr className="text-gray-400 font-bold uppercase">
                          <th className="py-2.5">Item Selected</th>
                          <th className="text-center py-2.5">Qty</th>
                          <th className="text-right py-2.5">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {order.items.map((it, idx) => (
                          <tr key={idx} className="text-stone-700">
                            <td className="py-2.5 font-bold truncate max-w-28">{it.product.name}</td>
                            <td className="text-center py-2.5 font-semibold text-stone-500">{it.quantity}</td>
                            <td className="text-right py-2.5 font-bold font-mono">{formatNaira((it.product.discountPrice || it.product.price) * it.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="border-t border-stone-150 pt-3 text-right text-[11px] font-bold text-stone-900">
                      <div>Invoiced Grand Total: <span className="font-black text-brand-700 font-mono text-sm">{formatNaira(order.total)}</span></div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-400 text-center uppercase font-bold tracking-wider leading-normal">
                      {BRAND_INFO.location}
                    </div>
                  </div>
                </div>

                {/* Email 2: Sent to Owner Fulfillment Desk */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-[#40e0d0]">To:</span>
                    <span>fulfillment@rozaykitchen.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-[#40e0d0]">Subject:</span>
                    <span className="font-semibold text-white">🔥 URGENT DEPOT ACTION: New Order #{order.id} Placed</span>
                  </div>

                  <div className="bg-[#1e2530] text-slate-300 rounded-2xl p-4 space-y-3 mt-2 border border-slate-800">
                    <p className="text-[11px] leading-relaxed">
                      <span className="text-amber-400 font-bold">Showroom Notification System Alert!</span><br/>
                      A new invoice was logged. Please pull requested stock from Idumota warehouse racks immediately!
                    </p>

                    <div className="space-y-1 text-[10px] font-semibold text-slate-400 font-mono">
                      <div>CUSTOMER: {order.customerName}</div>
                      <div>CONTACT: {order.customerPhone}</div>
                      <div>DESTINATION: {order.address}, {order.city}</div>
                      <div>METHOD: {order.deliveryMethod}</div>
                    </div>

                    <div className="text-[10px] text-gray-500 mt-2 block">
                      Sync state successfully propagated to Owner Portal.
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
