import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Product, Order, ContactForm, CeoVideoConfig } from "../types";
import { 
  Trash2, Edit3, Plus, ArrowLeft, ShieldAlert, Sparkles, 
  RefreshCcw, CheckCircle, Package, Layers, Info, Upload, 
  DollarSign, TrendingUp, Inbox, Calendar, Check, X, Tag, ShoppingBag, Database, WifiOff,
  Video, Play, Film, Award, CheckCircle2, Link2
} from "lucide-react";
import { CATEGORIES, DEFAULT_CEO_VIDEO_CONFIG } from "../data";
import { 
  getDbOrders, getDbSubmissions, isSupabaseConfigured, supabase, 
  getProductImageUrl, uploadProductImageToSupabase, convertFileToBase64,
  getDbCeoVideo, saveDbCeoVideo, uploadCeoVideoFile
} from "../lib/supabase";
import SafeImage from "./SafeImage";

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, "id">) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetToDefault: () => void;
  onClose: () => void;
}

export default function AdminDashboard({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onResetToDefault,
  onClose
}: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Sub-tabs in the dynamic Owner Dashboard
  const [activeTab, setActiveTab] = useState<"inventory" | "orders" | "submissions" | "ceo-video">("inventory");

  // CRM state buckets
  const [orders, setOrders] = useState<Order[]>([]);
  const [submissions, setSubmissions] = useState<ContactForm[]>([]);

  // CEO Video Showcase state
  const [ceoVideoConfig, setCeoVideoConfig] = useState<CeoVideoConfig>(DEFAULT_CEO_VIDEO_CONFIG);
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [videoSaveSuccess, setVideoSaveSuccess] = useState("");
  const [newTalkingPoint, setNewTalkingPoint] = useState("");
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploadError, setVideoUploadError] = useState("");
  const [isVideoDragActive, setIsVideoDragActive] = useState(false);

  // Product Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Luxury Chafing Dishes");
  const [price, setPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number>(0);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");

  // Load persistent orders, form submissions, and CEO video on authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadCRMData();
    }
  }, [isAuthenticated, activeTab]);

  const loadCRMData = async () => {
    try {
      const ordersList = await getDbOrders();
      setOrders(ordersList);
    } catch (e) {
      console.error("Error reading saved orders from CRM archive", e);
    }

    try {
      const submissionsList = await getDbSubmissions();
      setSubmissions(submissionsList);
    } catch (e) {
      console.error("Error reading saved form submissions", e);
    }

    try {
      const vidConfig = await getDbCeoVideo();
      if (vidConfig) {
        setCeoVideoConfig(vidConfig);
      }
    } catch (e) {
      console.error("Error loading CEO video configuration", e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === "Chikezie1.") {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Incorrect access password.");
    }
  };

  const handleFileUpload = async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg+xml"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError("Invalid file format. Please select a JPG, JPEG, PNG, or WebP image.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setUploadError("");

    // 1. Immediately create a local high-res Base64 Data URL so preview & pictures show up instantly without failure
    try {
      const immediateDataUrl = await convertFileToBase64(file);
      setUploadedImageUrl(immediateDataUrl);
      setCustomImageUrl("");
    } catch (err) {
      console.warn("Immediate preview data URL warning", err);
    }

    // 2. Upload to Supabase Storage with resilient cloud synchronization
    try {
      const publicUrl = await uploadProductImageToSupabase(file, (percent) => {
        setUploadProgress(percent);
      });
      if (publicUrl) {
        setUploadedImageUrl(publicUrl);
      }
    } catch (err: any) {
      console.warn("Upload storage message:", err);
      // Data URL is already saved so the picture is preserved completely!
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleStartEdit = (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name);
    setCategory(prod.category);
    setPrice(prod.price || 85000);
    setDiscountPrice(prod.discountPrice || 0);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError("");
    setUploadedImageUrl(prod.image || "");
    setCustomImageUrl("");
  };

  const handleClearForm = () => {
    setEditingId(null);
    setName("");
    setPrice(0);
    setDiscountPrice(0);
    setCustomImageUrl("");
    setUploadedImageUrl("");
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError("");
    setFormSuccess("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0) {
      alert("Product name and a valid numeric price (₦) are required!");
      return;
    }

    let finalImage = uploadedImageUrl.trim() || customImageUrl.trim();
    if (!finalImage) {
      // Pick a reliable default luxury kitchenware photo based on category so it is NEVER blank
      if (category.toLowerCase().includes("chafing")) {
        finalImage = "/images/luxury_chafing_dish_1781992841526.jpg";
      } else if (category.toLowerCase().includes("pot") || category.toLowerCase().includes("cookware")) {
        finalImage = "/images/premium_pots_set_1781992854112.jpg";
      } else {
        finalImage = "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=90&w=1200&h=1200";
      }
    }

    const displayPriceRange = `₦${Number(price).toLocaleString()}`;

    if (editingId) {
      onEditProduct({
        id: editingId,
        name: name.trim(),
        category,
        description: "",
        image: finalImage,
        priceRange: displayPriceRange,
        price: Number(price),
        discountPrice: discountPrice > 0 ? Number(discountPrice) : undefined,
        features: [],
        rating: 4.8,
        stockStatus: "In Stock"
      });
      setFormSuccess("Product updated successfully in database!");
    } else {
      onAddProduct({
        name: name.trim(),
        category,
        description: "",
        image: finalImage,
        priceRange: displayPriceRange,
        price: Number(price),
        discountPrice: discountPrice > 0 ? Number(discountPrice) : undefined,
        features: [],
        rating: 4.8,
        stockStatus: "In Stock"
      });
      setFormSuccess("New product added successfully to catalog!");
    }

    setTimeout(() => {
      handleClearForm();
    }, 2000);
  };

  const handleSaveCeoVideo = async (e?: React.FormEvent, customConfig?: CeoVideoConfig) => {
    if (e) e.preventDefault();
    const configToSave = customConfig || ceoVideoConfig;
    setIsSavingVideo(true);
    try {
      await saveDbCeoVideo(configToSave);
      setVideoSaveSuccess("CEO Video Showcase updated and published immediately to live website!");
      setTimeout(() => setVideoSaveSuccess(""), 4000);
    } catch (err) {
      console.error("Failed to save CEO video config", err);
      alert("Failed to save CEO video settings. Please try again.");
    } finally {
      setIsSavingVideo(false);
    }
  };

  const handleVideoFileUpload = async (file: File) => {
    setIsVideoUploading(true);
    setVideoUploadProgress(10);
    setVideoUploadError("");

    try {
      // 1. Temporary local preview during upload
      const immediateUrl = URL.createObjectURL(file);
      setCeoVideoConfig((prev) => ({
        ...prev,
        videoUrl: immediateUrl
      }));

      // 2. Upload file to Supabase Storage
      const uploadedUrl = await uploadCeoVideoFile(file, (percent) => {
        setVideoUploadProgress(percent);
      });

      if (uploadedUrl) {
        const finalConfig: CeoVideoConfig = {
          ...ceoVideoConfig,
          videoUrl: uploadedUrl,
          isActive: true
        };
        setCeoVideoConfig(finalConfig);
        await saveDbCeoVideo(finalConfig);
        setVideoSaveSuccess("Video file uploaded to Cloud Storage and published immediately to website!");
        setTimeout(() => setVideoSaveSuccess(""), 5000);
      }
    } catch (err: any) {
      console.warn("Video upload error:", err);
      setVideoUploadError(err?.message || "Failed to upload video file.");
    } finally {
      setIsVideoUploading(false);
    }
  };

  // Helper to format any URL for embed preview
  const getAdminEmbedUrl = (url: string) => {
    if (!url) return "";
    let clean = url.trim();
    if (clean.includes("/shorts/")) {
      const parts = clean.split("/shorts/")[1];
      const videoId = parts?.split("?")[0]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (clean.includes("youtube.com/watch")) {
      const match = clean.match(/[?&]v=([^&]+)/);
      const videoId = match ? match[1] : "";
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (clean.includes("youtu.be/")) {
      const parts = clean.split("youtu.be/")[1];
      const videoId = parts?.split("?")[0]?.split("&")[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (clean.includes("vimeo.com/") && !clean.includes("player.vimeo.com")) {
      const id = clean.split("vimeo.com/")[1]?.split("?")[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    if (clean.includes("drive.google.com/file/d/")) {
      const id = clean.split("/file/d/")[1]?.split("/")[0];
      return `https://drive.google.com/file/d/${id}/preview`;
    }
    return clean;
  };

  const handleAddTalkingPoint = () => {
    if (!newTalkingPoint.trim()) return;
    setCeoVideoConfig((prev) => ({
      ...prev,
      talkingPoints: [...prev.talkingPoints, newTalkingPoint.trim()]
    }));
    setNewTalkingPoint("");
  };

  const handleRemoveTalkingPoint = (indexToRemove: number) => {
    setCeoVideoConfig((prev) => ({
      ...prev,
      talkingPoints: prev.talkingPoints.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // CRM Order Mutations
  const togglePaymentStatus = (orderId: string, currentStatus: "Paid" | "Pending") => {
    const nextStatus = currentStatus === "Paid" ? "Pending" : "Paid";
    const nextOrders = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, paymentStatus: nextStatus as "Paid" | "Pending" };
      }
      return o;
    });
    setOrders(nextOrders);
    localStorage.setItem("rozay_orders_crm", JSON.stringify(nextOrders));
  };

  const updateDeliveryStatus = (orderId: string, status: string) => {
    const nextOrders = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, orderStatus: status as any };
      }
      return o;
    });
    setOrders(nextOrders);
    localStorage.setItem("rozay_orders_crm", JSON.stringify(nextOrders));
  };

  const deleteCrmOrder = (orderId: string) => {
    if (confirm(`Do you really want to permanently delete order #${orderId}?`)) {
      const nextOrders = orders.filter((o) => o.id !== orderId);
      setOrders(nextOrders);
      localStorage.setItem("rozay_orders_crm", JSON.stringify(nextOrders));
    }
  };

  // CRM Submission deletion
  const deleteCrmSubmission = (createdAt: string, nameSearch: string) => {
    if (confirm(`Do you want to clear the submission from ${nameSearch}?`)) {
      const nextSubmissions = submissions.filter((s) => s.createdAt !== createdAt || s.name !== nameSearch);
      setSubmissions(nextSubmissions);
      localStorage.setItem("rozay_form_submissions", JSON.stringify(nextSubmissions));
    }
  };

  const formatNaira = (amount: number) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  // Math metrics for total dashboard counters
  const totalSalesRevenue = orders
    .filter(o => o.paymentStatus === "Paid")
    .reduce((val, o) => val + o.total, 0);

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-[#FDFBF7] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-150 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-6 border border-brand-200">
            <ShieldAlert className="w-6 h-6 stroke-[2]" />
          </div>
          
          <h2 className="font-display font-black text-2xl text-gray-950 tracking-tight mb-2">
            Rozay Owner Portal
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-6 leading-relaxed">
            Please authenticate to manage products, look up online customer checkouts, or inspect submitted inquiries.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] tracking-wider uppercase font-mono font-bold text-gray-500 block text-left mb-1">
                Enter Admin Password Key *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full text-sm px-4 py-3.5 rounded-xl bg-stone-50 border border-gray-200 focus:outline-none focus:bg-white text-gray-950 text-center tracking-widest font-mono"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-950 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Unlock Enterprise Dashboard
            </button>
          </form>

          <button
            onClick={onClose}
            className="mt-6 text-xs text-brand-650 font-bold hover:underline block mx-auto cursor-pointer"
          >
            ← Cancel, return to showroom
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-20 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP CONTROL BAR AND ACCOUNT PROFILE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase font-mono bg-brand-500 text-white rounded px-2.5 py-0.5 font-bold">
                Owner Portal Access Live
              </span>
              {isSupabaseConfigured ? (
                <span className="text-[10px] uppercase font-mono bg-emerald-600 text-white rounded px-2.5 py-0.5 font-bold flex items-center gap-1">
                  <Database className="w-3 h-3 shrink-0" /> Supabase Connected
                </span>
              ) : (
                <span className="text-[10px] uppercase font-mono bg-amber-600 text-white rounded px-2.5 py-0.5 font-bold flex items-center gap-1" title="To connect Supabase, please populate VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your secrets.">
                  <WifiOff className="w-3 h-3 shrink-0" /> Local/Offline Mode
                </span>
              )}
              <span className="text-[10px] text-gray-400 font-mono">
                System Integration
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-950 tracking-tight">
              Rozay Kitchen Backoffice Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetToDefault}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Restores the catalog back to 9 original mockups"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Reset Products
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-950 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Exit Dashboard
            </button>
          </div>
        </div>

        {/* METRICS COUNT Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-150 p-4.5 rounded-2xl shadow-3xs flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono text-gray-400 block font-bold leading-none">TOTAL MAPPED REVENUE</span>
            <span className="text-xl sm:text-2xl font-black text-gray-950 mt-2 block font-mono">{formatNaira(totalSalesRevenue)}</span>
            <span className="text-[9px] text-emerald-600 font-bold block mt-1">Paid receipts only</span>
          </div>

          <div className="bg-white border border-gray-150 p-4.5 rounded-2xl shadow-3xs flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono text-gray-400 block font-bold leading-none">CUSTOMER ECOMM ORDERS</span>
            <span className="text-xl sm:text-2xl font-black text-[#ca8a04] mt-2 block font-mono">{orders.length} bookings</span>
            <span className="text-[9px] text-gray-400 block mt-1">Paystack + Transfer logs</span>
          </div>

          <div className="bg-white border border-gray-150 p-4.5 rounded-2xl shadow-3xs flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono text-gray-400 block font-bold leading-none">CONTACT FORM SUBMISSIONS</span>
            <span className="text-xl sm:text-2xl font-black text-brand-700 mt-2 block font-mono">{submissions.length} leads</span>
            <span className="text-[9px] text-gray-400 block mt-1">From web input templates</span>
          </div>

          <div className="bg-white border border-gray-150 p-4.5 rounded-2xl shadow-3xs flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono text-gray-400 block font-bold leading-none">LAUNCHED PRODUCTS</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-2 block font-mono">{products.length} live</span>
            <span className="text-[9px] text-emerald-600 block mt-1">Showcasing in catalog</span>
          </div>
        </div>

        {/* DYNAMIC FUNCTION TABS SECTION */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`py-3.5 px-6 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "inventory"
                ? "border-brand-500 text-brand-700 font-black bg-brand-500/5 rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Manage Showroom Catalog ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3.5 px-6 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "border-brand-500 text-brand-700 font-black bg-brand-500/5 rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>Customer Orders CRM ({orders.length})</span>
            {orders.filter(o => o.paymentStatus === "Pending").length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`py-3.5 px-6 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "submissions"
                ? "border-brand-500 text-brand-700 font-black bg-brand-500/5 rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Customer Enquiries ({submissions.length})
          </button>

          <button
            onClick={() => setActiveTab("ceo-video")}
            className={`py-3.5 px-6 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "ceo-video"
                ? "border-brand-500 text-brand-700 font-black bg-brand-500/5 rounded-t-xl"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Video className="w-4 h-4 text-amber-600" />
            <span>CEO Video Showcase</span>
          </button>
        </div>

        {/* TAB 1: SHOWROOM INVENTORY CREATOR & LISTING */}
        {activeTab === "inventory" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form to submit details */}
            <div className="lg:col-span-5 bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-3xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-display font-black text-lg text-gray-900">
                  {editingId ? "Modify Showcase Product" : "Launch New Showcase Wares"}
                </h3>
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 mb-4 animate-bounce">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rose Gold Double Tray Chafing Dish"
                    className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white text-gray-900 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block mb-1">Store Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs px-3 py-3 bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white text-gray-900 font-semibold"
                    >
                      {CATEGORIES.filter(c => c !== "All").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block mb-1">Price * (₦)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price || ""}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="e.g. 110000"
                      className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white text-gray-900 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Promo / Discount Price (₦) (Optional)</label>
                  <input
                    type="number"
                    min={0}
                    value={discountPrice || ""}
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
                    placeholder="e.g. 95000 (Optional)"
                    className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white text-gray-950 font-mono font-bold"
                  />
                </div>

                {/* Direct Supabase Storage Image Upload */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block">
                      Product Picture *
                    </label>
                    <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                      <Sparkles className="w-2.5 h-2.5" />
                      Ultra-HD 4K Supported
                    </span>
                  </div>
                  <div className="space-y-3 mb-3">
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                        isDragActive
                          ? "border-brand-500 bg-brand-50"
                          : uploadedImageUrl
                          ? "border-emerald-400 bg-emerald-50/40"
                          : "border-gray-200 hover:border-brand-400 hover:bg-stone-50"
                      }`}
                    >
                      <input
                        type="file"
                        id="image-file-upload-dashboard"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {isUploading ? (
                        <div className="space-y-3 py-3">
                          <div className="w-9 h-9 rounded-full border-3 border-brand-500 border-t-transparent animate-spin mx-auto" />
                          <p className="text-xs font-bold text-gray-700">Uploading & Preserving HD Clarity in Supabase Storage... {uploadProgress}%</p>
                          <div className="w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-500 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : uploadedImageUrl ? (
                        <div className="space-y-2 relative group py-1">
                          <div className="relative inline-block">
                            <SafeImage
                              src={uploadedImageUrl}
                              alt="Product preview"
                              fallbackIcon="shopping-bag"
                              fallbackSrc="https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=90&w=1600&h=1600"
                              containerClassName="mx-auto w-28 h-28 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                              className="w-full h-full object-cover"
                              iconClassName="w-10 h-10 text-stone-300 stroke-[1.5]"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImageUrl("");
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors cursor-pointer"
                              title="Remove image"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-emerald-700 font-bold block">✓ Image uploaded in Ultra-HD clarity!</p>
                          <label htmlFor="image-file-upload-dashboard" className="text-xs text-brand-600 font-bold underline cursor-pointer hover:text-brand-700 block">
                            Click or drag to replace picture
                          </label>
                        </div>
                      ) : (
                        <label htmlFor="image-file-upload-dashboard" className="cursor-pointer block py-3">
                          <Upload className="w-6 h-6 mx-auto text-brand-500 mb-1.5" />
                          <span className="text-xs font-bold text-gray-800 block mb-0.5">Drag & drop high-resolution product picture here</span>
                          <span className="text-[11px] text-gray-500 block">Original 4K / HD quality preserved (JPG, PNG, WebP)</span>
                        </label>
                      )}
                    </div>
                    {uploadError && <p className="text-red-500 text-xs mt-1 font-medium bg-red-50 p-2 rounded-lg border border-red-100">{uploadError}</p>}
                  </div>

                  {/* Optional HTTPS Image URL fallback */}
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer hover:text-gray-700 text-[11px] font-mono">Or paste image web address (HTTPS)</summary>
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => {
                        setCustomImageUrl(e.target.value);
                        if (e.target.value.trim()) setUploadedImageUrl("");
                      }}
                      placeholder="https://YOUR_PROJECT.supabase.co/storage/v1/object/public/product-images/..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg bg-stone-50 border border-gray-200 focus:outline-none focus:bg-white text-gray-900 mt-2"
                    />
                  </details>
                </div>

                <div className="flex gap-2.5 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`flex-1 py-3.5 text-white text-xs font-bold rounded-xl scroll-smooth transition-colors cursor-pointer ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ca8a04] hover:bg-yellow-700'}`}
                  >
                    {isUploading ? "Uploading Image..." : editingId ? "Save Product Changes" : "Publish Product"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleClearForm}
                      className="px-4.5 py-3.5 border border-gray-200 text-xs text-gray-500 rounded-xl hover:bg-stone-50 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

              </form>

            </div>

            {/* Catalog List */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-3xs max-h-[700px] overflow-y-auto">
              <h3 className="font-display font-black text-sm text-gray-950 mb-4 uppercase tracking-wider">Showroom Inventory Catalog ({products.length} Items)</h3>
              <div className="divide-y divide-gray-150 space-y-4">
                {products.map((p) => (
                  <div key={p.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                    <SafeImage
                      src={getProductImageUrl(p.image)}
                      alt={p.name}
                      fallbackIcon="shopping-bag"
                      fallbackSrc="https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800"
                      containerClassName="w-14 h-14 rounded-xl shrink-0 border border-gray-100 bg-stone-100"
                      className="w-full h-full object-cover"
                      iconClassName="w-6 h-6 text-stone-300 stroke-[1.5]"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate leading-none mb-1">{p.name}</h4>
                        <div className="flex shrink-0">
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="p-1 text-gray-400 hover:text-brand-600 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <span className="text-[9px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.2 rounded-sm inline-block uppercase tracking-wider mb-1">
                        {p.category}
                      </span>

                      <div className="flex items-center gap-3.5 text-[10px] text-gray-400 mt-1">
                        <span className="font-bold text-gray-900 font-mono">{formatNaira(p.price)}</span>
                        {p.discountPrice && <span className="font-bold text-rose-500 font-mono">{formatNaira(p.discountPrice)}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SALES & ORDERS CRM DIRECTORY */}
        {activeTab === "orders" && (
          <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-3xs space-y-6">
            <div>
              <h2 className="font-display font-black text-xl text-gray-950">Customer Orders CRM</h2>
              <p className="text-xs text-gray-400">All direct digital cash checkouts and invoice entries compiled securely in this browser local database.</p>
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-xs border-2 border-dashed border-gray-150 rounded-2xl max-w-md mx-auto space-y-2">
                <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="font-bold">No orders logged yet.</p>
                <p className="text-[11px] leading-relaxed max-w-xs mx-auto">Once a sandbox user places an e-mail check-out or clicks Paystack Payment, their complete invoices populate here!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((o) => (
                  <div key={o.id} className="p-5 bg-stone-50/50 border border-gray-150 rounded-2xl space-y-4">
                    
                    {/* Header metrics */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-150 pb-3 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-gray-950">ORDER #{o.id}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{o.createdAt}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Channel: {o.paymentMethod}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Payment Toggle Badge */}
                        <button
                          onClick={() => togglePaymentStatus(o.id, o.paymentStatus)}
                          className={`px-3 py-1 text-[9px] uppercase font-bold rounded-full border cursor-pointer ${
                            o.paymentStatus === "Paid"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : "bg-amber-50 border-amber-200 text-amber-800"
                          }`}
                          title="Click to toggle Payment Status manually"
                        >
                          {o.paymentStatus === "Paid" ? "● CONFIRMED PAID" : "● PENDING PAYMENT"}
                        </button>

                        {/* Order Status Selectors */}
                        <select
                          value={o.orderStatus}
                          onChange={(e) => updateDeliveryStatus(o.id, e.target.value)}
                          className="px-2.5 py-1 text-[9px] font-bold uppercase rounded-full border border-gray-200 bg-white"
                        >
                          <option value="Received">Received</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>

                        <button
                          onClick={() => deleteCrmOrder(o.id)}
                          className="p-1 px-1.5 hover:bg-rose-50 text-rose-500 rounded-md transition-colors"
                          title="Delete Order Permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Customer Info profile */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-sans text-gray-600">
                      
                      <div className="md:col-span-4 space-y-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase font-mono">Consignee Coordinates:</span>
                        <p className="font-bold text-gray-950">{o.customerName}</p>
                        <p className="text-[11px]">{o.customerEmail}</p>
                        <p className="text-[11px]">Tel: {o.customerPhone}</p>
                      </div>

                      <div className="md:col-span-4 space-y-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase font-mono">Delivery Coordinates:</span>
                        <p className="text-[11px] leading-relaxed truncate max-w-xs">{o.address}</p>
                        <p className="text-[11px]">{o.city}, {o.state}</p>
                        <p className="text-[11px] font-bold text-brand-700">{o.deliveryMethod}</p>
                      </div>

                      {/* Items row */}
                      <div className="md:col-span-4 space-y-1.5 border-t md:border-t-0 md:border-l border-gray-150 pl-0 md:pl-4">
                        <span className="text-[9px] font-mono uppercase font-bold text-gray-400">Inventory Items ({o.items.length}):</span>
                        <div className="space-y-1 divide-y divide-stone-100 max-h-24 overflow-y-auto">
                          {o.items.map((item, idx) => {
                            const actP = item.product.discountPrice || item.product.price;
                            return (
                              <div key={idx} className="flex justify-between text-[11px] pt-1 first:pt-0 leading-normal font-semibold">
                                <span className="truncate max-w-[120px] text-gray-800">{item.product.name}</span>
                                <span className="text-gray-400 font-normal shrink-0">x {item.quantity}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between font-bold text-gray-950">
                          <span>Total Cash charged:</span>
                          <span className="font-mono text-brand-700 text-xs">{formatNaira(o.total)}</span>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: CONTACT FORM SUBMISSIONS CRM */}
        {activeTab === "submissions" && (
          <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-3xs space-y-6">
            <div>
              <h2 className="font-display font-black text-xl text-gray-950">Customer Inquiry Leads</h2>
              <p className="text-xs text-gray-400 font-medium">CRM logs mapping all prospective custom corporate quotes, partnership offers, or general help requests submitted.</p>
            </div>

            {submissions.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-xs border-2 border-dashed border-gray-150 rounded-2xl max-w-md mx-auto space-y-2">
                <Inbox className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="font-bold">No inquiry leads received yet.</p>
                <p className="text-[11px] leading-relaxed max-w-xs mx-auto">When prospective clients complete the Contact Inquiry form at the footer, their details instantly cascade into this directory!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submissions.map((sub, idx) => (
                  <div key={idx} className="p-4 bg-stone-50 border border-gray-150 rounded-2xl space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 border-b border-gray-150 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                            {sub.name.charAt(0)}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-gray-950 leading-none">{sub.name}</h4>
                            <span className="text-[9px] text-gray-400 font-mono mt-0.5 block">{sub.createdAt || "Submitted June 2026"}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteCrmSubmission(sub.createdAt, sub.name)}
                          className="text-gray-400 hover:text-rose-500 p-1 rounded-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1.5 py-3 text-xs leading-relaxed text-stone-600">
                        <p><strong className="text-stone-900 font-semibold text-[11px]">Email:</strong> {sub.email}</p>
                        <p><strong className="text-stone-900 font-semibold text-[11px]">WhatsApp/Phone:</strong> {sub.phone}</p>
                        <p><strong className="text-stone-900 font-semibold text-[11px]">Lead Designation:</strong> <span className="bg-amber-100 text-[#a16207] px-1.5 py-0.5 rounded-sm font-bold font-mono text-[9px] uppercase">{sub.businessType || "Retail Client"}</span></p>
                        
                        <div className="mt-3 bg-white p-3 rounded-xl border border-stone-150 text-[11px] italic text-stone-500 font-semibold">
                          "{sub.message}"
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 4: CEO VIDEO SHOWCASE MANAGER */}
        {activeTab === "ceo-video" && (
          <div className="space-y-8">
            
            {/* Header banner */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                  <Video className="w-3.5 h-3.5" />
                  <span>CEO VIDEO SLOT MANAGEMENT</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                  CEO Chafing Dish Video Showcase
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Configure the video slot where CEO Alaekwe Onyebuchi showcases and demonstrates the luxury 10L / Roll-Top chafing dish. Supports YouTube links, MP4 video links, and custom talking points.
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
                <label className="flex items-center gap-3 bg-stone-800/80 px-4 py-2.5 rounded-2xl border border-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ceoVideoConfig.isActive}
                    onChange={(e) => setCeoVideoConfig({ ...ceoVideoConfig, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-stone-200">
                    {ceoVideoConfig.isActive ? "● Showcase Visible on Website" : "○ Showcase Hidden (Draft)"}
                  </span>
                </label>
              </div>
            </div>

            {videoSaveSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-3 animate-fade-in shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{videoSaveSuccess}</span>
              </div>
            )}

            {/* Video Form & Live Preview Grid */}
            <form onSubmit={handleSaveCeoVideo} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Controls (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-3xs space-y-6">
                
                <h3 className="font-display font-black text-lg text-gray-950 flex items-center gap-2">
                  <Film className="w-5 h-5 text-amber-600" />
                  <span>Video Settings & Product Mapping</span>
                </h3>

                {/* Section Title */}
                <div>
                  <label className="text-[10px] tracking-wider uppercase font-mono font-bold text-gray-600 block mb-1">
                    Showcase Headline Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={ceoVideoConfig.title}
                    onChange={(e) => setCeoVideoConfig({ ...ceoVideoConfig, title: e.target.value })}
                    placeholder="e.g. Masterclass & Demonstration: The Executive Chafing Dish"
                    className="w-full text-xs px-3.5 py-3 rounded-xl bg-stone-50 border border-gray-200 focus:outline-none focus:bg-white text-gray-900 font-medium"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="text-[10px] tracking-wider uppercase font-mono font-bold text-gray-600 block mb-1">
                    Showcase Subtitle / Intro *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={ceoVideoConfig.subtitle}
                    onChange={(e) => setCeoVideoConfig({ ...ceoVideoConfig, subtitle: e.target.value })}
                    placeholder="e.g. Join CEO Alaekwe Onyebuchi inside our Lagos Island showroom..."
                    className="w-full text-xs px-3.5 py-3 rounded-xl bg-stone-50 border border-gray-200 focus:outline-none focus:bg-white text-gray-900 font-medium"
                  />
                </div>

                {/* Video URL & Direct Upload Section */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] tracking-wider uppercase font-mono font-bold text-gray-700 block">
                      Showcase Video Source *
                    </label>
                    <span className="text-[10px] text-amber-600 font-semibold">
                      Reflects immediately on live website
                    </span>
                  </div>

                  {/* Direct Video File Upload Box */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsVideoDragActive(true);
                    }}
                    onDragLeave={() => setIsVideoDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsVideoDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleVideoFileUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                      isVideoDragActive
                        ? "border-amber-500 bg-amber-50"
                        : "border-stone-300 bg-white hover:border-amber-400"
                    }`}
                  >
                    <input
                      type="file"
                      id="ceo-video-upload-input"
                      accept="video/mp4,video/webm,video/quicktime,video/mov,video/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleVideoFileUpload(e.target.files[0]);
                        }
                      }}
                    />

                    {isVideoUploading ? (
                      <div className="space-y-2 py-2">
                        <div className="flex items-center justify-center gap-2 text-amber-600 text-xs font-bold font-mono">
                          <RefreshCcw className="w-4 h-4 animate-spin" />
                          <span>Uploading & Processing Video ({videoUploadProgress}%)...</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${videoUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="ceo-video-upload-input"
                        className="cursor-pointer flex flex-col items-center justify-center gap-1.5 text-stone-600 hover:text-stone-900"
                      >
                        <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-bold text-gray-900">
                          Click to select or drag & drop video file (.mp4, .webm, .mov)
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono">
                          Directly uploads video & updates website instantly
                        </p>
                      </label>
                    )}

                    {videoUploadError && (
                      <p className="text-[11px] text-rose-600 font-medium mt-2">
                        {videoUploadError}
                      </p>
                    )}
                  </div>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-gray-200 w-full" />
                    <span className="bg-stone-50 px-2 text-[10px] uppercase font-mono text-gray-400 font-bold">
                      OR PASTE VIDEO LINK
                    </span>
                    <div className="border-t border-gray-200 w-full" />
                  </div>

                  {/* Video URL Input */}
                  <div>
                    <input
                      type="text"
                      required
                      value={ceoVideoConfig.videoUrl}
                      onChange={(e) => {
                        const newUrl = e.target.value;
                        const updated = { ...ceoVideoConfig, videoUrl: newUrl };
                        setCeoVideoConfig(updated);
                        // Save and dispatch immediately so video link reflects without waiting
                        saveDbCeoVideo(updated);
                      }}
                      placeholder="Paste YouTube, Vimeo, Google Drive, or MP4 link..."
                      className="w-full text-xs px-3.5 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-amber-500 text-gray-900 font-mono shadow-3xs"
                    />
                    <p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Supports YouTube standard/shorts (e.g. youtube.com/shorts/xxx, youtu.be/xxx), Vimeo, and MP4 links.</span>
                    </p>
                  </div>
                </div>

                {/* Poster Image */}
                <div>
                  <label className="text-[10px] tracking-wider uppercase font-mono font-bold text-gray-600 block mb-1">
                    Video Cover Poster Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={ceoVideoConfig.posterUrl || ""}
                    onChange={(e) => setCeoVideoConfig({ ...ceoVideoConfig, posterUrl: e.target.value })}
                    placeholder="https://... or /images/... for high-res cover thumbnail"
                    className="w-full text-xs px-3.5 py-3 rounded-xl bg-stone-50 border border-gray-200 focus:outline-none focus:bg-white text-gray-900 font-mono"
                  />
                </div>

                {/* Featured Product Selector */}
                <div>
                  <label className="text-[10px] tracking-wider uppercase font-mono font-bold text-gray-600 block mb-1">
                    Featured Chafing Dish / Cookware Product *
                  </label>
                  <select
                    value={ceoVideoConfig.featuredProductId}
                    onChange={(e) => setCeoVideoConfig({ ...ceoVideoConfig, featuredProductId: e.target.value })}
                    className="w-full text-xs px-3.5 py-3 rounded-xl bg-stone-50 border border-gray-200 focus:outline-none focus:bg-white text-gray-900 font-medium"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category}) — ₦{Number(p.discountPrice || p.price || 0).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">
                    The chosen product will appear alongside the video with direct "Order Now" and "WhatsApp CEO" action buttons.
                  </p>
                </div>

                {/* CEO Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-mono font-bold text-gray-600 block mb-1">
                      CEO Name
                    </label>
                    <input
                      type="text"
                      value={ceoVideoConfig.ceoName}
                      onChange={(e) => setCeoVideoConfig({ ...ceoVideoConfig, ceoName: e.target.value })}
                      className="w-full text-xs px-3.5 py-3 rounded-xl bg-stone-50 border border-gray-200 text-gray-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-mono font-bold text-gray-600 block mb-1">
                      CEO Title
                    </label>
                    <input
                      type="text"
                      value={ceoVideoConfig.ceoTitle}
                      onChange={(e) => setCeoVideoConfig({ ...ceoVideoConfig, ceoTitle: e.target.value })}
                      className="w-full text-xs px-3.5 py-3 rounded-xl bg-stone-50 border border-gray-200 text-gray-900 font-medium"
                    />
                  </div>
                </div>

                {/* Video Talking Points */}
                <div>
                  <label className="text-[10px] tracking-wider uppercase font-mono font-bold text-gray-600 block mb-1">
                    Key Highlights / Talking Points
                  </label>
                  
                  <div className="space-y-2 mb-3">
                    {ceoVideoConfig.talkingPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-gray-200 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="flex-1 text-gray-800 font-medium">{point}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTalkingPoint(idx)}
                          className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
                          title="Remove bullet point"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTalkingPoint}
                      onChange={(e) => setNewTalkingPoint(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTalkingPoint();
                        }
                      }}
                      placeholder="Add talking point (e.g. Heavy-duty 304 food-grade stainless steel)"
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-gray-200 focus:outline-none focus:bg-white text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={handleAddTalkingPoint}
                      className="px-4 py-2.5 bg-stone-900 hover:bg-stone-950 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                    >
                      + Add Point
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-gray-150">
                  <button
                    type="submit"
                    disabled={isSavingVideo}
                    className="w-full py-4 bg-gradient-to-r from-[#ca8a04] to-yellow-600 hover:from-yellow-700 hover:to-yellow-700 text-stone-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>{isSavingVideo ? "Saving Video Showcase..." : "Publish & Save CEO Video Showcase"}</span>
                  </button>
                </div>

              </div>

              {/* Live Preview Panel (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-stone-950 border-2 border-amber-500/40 rounded-3xl p-6 text-white shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                      LIVE PREVIEW ON WEBSITE
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {ceoVideoConfig.isActive ? "Active" : "Draft (Hidden)"}
                    </span>
                  </div>

                  {/* Video Box Preview */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-inner flex items-center justify-center">
                    {ceoVideoConfig.videoUrl ? (
                      ceoVideoConfig.videoUrl.includes("youtube") || ceoVideoConfig.videoUrl.includes("youtu.be") || ceoVideoConfig.videoUrl.includes("vimeo") || ceoVideoConfig.videoUrl.includes("drive.google.com") ? (
                        <iframe
                          key={ceoVideoConfig.videoUrl}
                          src={getAdminEmbedUrl(ceoVideoConfig.videoUrl)}
                          title="Preview"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      ) : (
                        <video
                          key={ceoVideoConfig.videoUrl}
                          src={ceoVideoConfig.videoUrl}
                          poster={ceoVideoConfig.posterUrl}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="text-center p-4 text-stone-500 text-xs">
                        <Video className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                        <span>No Video URL Set</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                      {ceoVideoConfig.ceoName} • {ceoVideoConfig.ceoTitle}
                    </span>
                    <h4 className="font-display font-bold text-base text-white mt-1">
                      {ceoVideoConfig.title}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                      {ceoVideoConfig.subtitle}
                    </p>
                  </div>

                  {/* Featured Product summary */}
                  <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-stone-800 overflow-hidden shrink-0">
                      <SafeImage
                        src={getProductImageUrl(products.find(p => p.id === ceoVideoConfig.featuredProductId)?.image || products[0]?.image)}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {products.find(p => p.id === ceoVideoConfig.featuredProductId)?.name || "Luxury Chafing Dish"}
                      </p>
                      <p className="text-xs font-mono text-amber-400 font-bold">
                        ₦{Number(products.find(p => p.id === ceoVideoConfig.featuredProductId)?.price || 140000).toLocaleString()}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </form>

          </div>
        )}

      </div>
    </section>
  );
}
