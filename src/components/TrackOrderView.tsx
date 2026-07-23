import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Package, MapPin, Truck, CheckCircle2, ArrowRight } from "lucide-react";
import { Order } from "../types";
import { getDbOrders, getProductImageUrl } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function TrackOrderView() {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orderResult, setOrderResult] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setOrderResult(null);

    try {
      const orders = await getDbOrders();
      const found = orders.find(o => o.id.toLowerCase() === orderId.trim().toLowerCase());
      if (found) {
        setOrderResult(found);
      } else {
        setSearchError("Order not found. Please check your tracking ID and try again.");
      }
    } catch (err) {
      setSearchError("Failed to fetch order status. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const statusSteps = ["Received", "Processing", "Dispatched", "Delivered"];

  const getStepIndex = (status: string) => {
    const idx = statusSteps.findIndex(s => s.toLowerCase() === status.toLowerCase());
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="pt-28 pb-20 min-h-[80vh] bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-gray-950 mb-4">
          Track Your Order
        </h1>
        <p className="text-gray-500 text-sm md:text-base mb-8 max-w-xl mx-auto">
          Enter your Order ID to see real-time updates on your purchase status.
        </p>

        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row max-w-md mx-auto gap-3 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. RZK-ORD-123456"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
          >
            {isSearching ? "Searching..." : "Track Order"}
            {!isSearching && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {searchError && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium inline-block mb-8">
            {searchError}
          </motion.div>
        )}

        {orderResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-150 max-w-3xl mx-auto text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-gray-100 gap-4">
              <div>
                <p className="text-xs uppercase font-bold text-gray-400 mb-1">Tracking ID</p>
                <p className="font-mono font-bold text-xl text-gray-900">{orderResult.id}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs uppercase font-bold text-gray-400 mb-1">Order Date</p>
                <p className="font-medium text-gray-800">{new Date(orderResult.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="mb-12 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full hidden sm:block"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                {statusSteps.map((step, index) => {
                  const currentIndex = getStepIndex(orderResult.orderStatus);
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  let Icon = Package;
                  if (step === "Processing") Icon = MapPin;
                  if (step === "Dispatched") Icon = Truck;
                  if (step === "Delivered") Icon = CheckCircle2;

                  return (
                    <div key={step} className="flex flex-row sm:flex-col items-center sm:w-1/4 gap-4 sm:gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                        isCompleted 
                          ? 'bg-brand-500 border-brand-100 text-white' 
                          : 'bg-white border-gray-100 text-gray-300'
                      } ${isCurrent ? 'ring-4 ring-brand-50 shadow-lg scale-110' : ''} transition-all duration-300 relative z-10`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {/* Mobile connector line */}
                      {index < statusSteps.length - 1 && (
                         <div className={`absolute left-6 ml-px w-0.5 h-full -z-10 sm:hidden ${index < currentIndex ? 'bg-brand-500' : 'bg-gray-100'}`} style={{ top: `${(index * 100) + 50}px` }}></div>
                      )}
                      
                      <div className="text-left sm:text-center">
                        <p className={`font-bold text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step}
                        </p>
                        {isCurrent && <p className="text-xs text-brand-600 mt-0.5">Current Status</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Desktop active progress line */}
              <div 
                className="absolute top-1/2 left-0 h-1 bg-brand-500 -translate-y-1/2 rounded-full hidden sm:block transition-all duration-700 ease-out"
                style={{ width: `${(getStepIndex(orderResult.orderStatus) / (statusSteps.length - 1)) * 100}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm p-6 bg-stone-50 rounded-xl">
              <div>
                <p className="text-xs uppercase font-bold text-gray-400 mb-1">Customer Details</p>
                <p className="font-medium text-gray-800">{orderResult.customerName}</p>
                <p className="text-gray-500 mt-1">{orderResult.address}, {orderResult.city}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-gray-400 mb-1">Payment Information</p>
                <p className={`font-bold inline-block px-2.5 py-1 rounded text-xs ${orderResult.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {orderResult.paymentStatus}
                </p>
                <p className="font-medium text-gray-800 mt-2">
                  Total: ₦{orderResult.total.toLocaleString()}
                </p>
              </div>
            </div>
            
            {orderResult.items && orderResult.items.length > 0 && (
              <div className="mt-8 border-t border-gray-150 pt-8">
                <h3 className="font-bold text-gray-900 mb-4">Items in this Order</h3>
                <div className="space-y-3">
                  {orderResult.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                          {item.image ? (
                            <img 
                              src={getProductImageUrl(item.image)} 
                              alt={item.name} 
                              loading="lazy"
                              decoding="async"
                              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800"; e.currentTarget.onerror = null; }}
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-sm text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8 text-center pt-6 border-t border-gray-100">
              <Link to="/shop" className="text-sm text-brand-600 hover:text-brand-700 font-bold hover:underline">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
