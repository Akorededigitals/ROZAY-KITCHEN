import React, { useState } from "react";
import { Search, Package, MapPin, Truck, CheckCircle2 } from "lucide-react";
import { Order } from "../types";
import { getDbOrders } from "../lib/supabase";

export default function TrackOrderSection() {
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

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case "received": return <Package className="w-5 h-5 text-amber-500" />;
      case "processing": return <MapPin className="w-5 h-5 text-blue-500" />;
      case "dispatched": return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <section id="track-order-section" className="py-16 bg-stone-50 border-y border-gray-150">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display font-extrabold text-2xl text-gray-950 mb-4">
          Track Your Order
        </h2>
        <p className="text-gray-500 text-sm mb-8 max-w-xl mx-auto">
          Enter your Order ID below to get real-time status updates on your delivery and logistics handling.
        </p>
        <form id="track-order-form" onSubmit={handleTrack} className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              id="track-order-input"
              type="text"
              placeholder="e.g. RZK-ORD-123456"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            id="track-order-button"
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSearching ? "Searching..." : "Track Order"}
          </button>
        </form>

        {searchError && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium inline-block">
            {searchError}
          </div>
        )}

        {orderResult && (
          <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-150 max-w-2xl mx-auto text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Tracking ID</p>
                <p className="font-mono font-bold text-lg text-gray-900">{orderResult.id}</p>
              </div>
              <div className="flex items-center gap-2 bg-stone-50 px-4 py-2 rounded-lg border border-gray-100">
                {getStatusIcon(orderResult.orderStatus)}
                <span className="font-bold text-gray-800 uppercase text-sm tracking-wide">
                  {orderResult.orderStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Customer</p>
                <p className="font-medium text-gray-800">{orderResult.customerName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Order Date</p>
                <p className="font-medium text-gray-800">{orderResult.createdAt}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Delivery Route</p>
                <p className="font-medium text-gray-800">{orderResult.deliveryMethod}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Payment Status</p>
                <p className={`font-bold ${orderResult.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {orderResult.paymentStatus}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
