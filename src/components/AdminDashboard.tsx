import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Product, Order, ContactForm } from "../types";
import { 
  Trash2, Edit3, Plus, ArrowLeft, ShieldAlert, Sparkles, 
  RefreshCcw, CheckCircle, Package, Layers, Info, Upload, 
  DollarSign, TrendingUp, Inbox, Calendar, Check, X, Tag, ShoppingBag, Database, WifiOff
} from "lucide-react";
import { CATEGORIES } from "../data";
import { getDbOrders, getDbSubmissions, isSupabaseConfigured, supabase, getProductImageUrl } from "../lib/supabase";

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, "id">) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetToDefault: () => void;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: "Chafing Dishes (Gold/Steel)", value: "https://picsum.photos/seed/chafingdish/800/800" },
  { label: "Elite Cookware Pot (Rose-gold)", value: "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800" },
  { label: "Luxury Kitchen Hero Banner", value: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Balogun_Market%2C_Lagos_Island.jpg/1280px-Balogun_Market%2C_Lagos_Island.jpg" }
];

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
  const [activeTab, setActiveTab] = useState<"inventory" | "orders" | "submissions">("inventory");

  // CRM state buckets
  const [orders, setOrders] = useState<Order[]>([]);
  const [submissions, setSubmissions] = useState<ContactForm[]>([]);

  // Product Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Luxury Chafing Dishes");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number>(0);
  const [priceRange, setPriceRange] = useState(""); // Kept for backward compatibility display
  const [featuresText, setFeaturesText] = useState("");
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].value);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");

  // Load persistent orders and form submissions on authentication
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

  const uploadToSupabase = async (blob: Blob) => {
    setIsUploading(true);
    setUploadProgress(10);
    setUploadError("");

    if (!isSupabaseConfigured || !supabase) {
      console.warn("Supabase env vars missing. Cannot upload image.");
      setUploadError("Supabase is not configured. Please connect to Supabase to upload images.");
      setIsUploading(false);
      return;
    }

    try {
      // Generate a SHA-256 hash of the blob to prevent duplicate uploads
      const arrayBuffer = await blob.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
      
      const fileName = `product-${hashHex}.webp`;
      
      // Upsert: true will prevent duplicate errors but just return success if the hash is exactly the same
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, blob, {
          contentType: 'image/webp',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }
      
      setUploadProgress(100);

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setUploadedImageUrl(publicUrl);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const compressAndSetImage = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload a valid image (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1200; // Increased for better quality on products
        const MAX_HEIGHT = 1200;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              uploadToSupabase(blob);
            }
          }, "image/webp", 0.85); // Convert to webp for better optimization
        }
      };
      
      img.onerror = () => {
        setUploadError("Failed to read image file. The file might be corrupted.");
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      setUploadError("Failed to read the file.");
    };
    
    reader.readAsDataURL(file);
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
      compressAndSetImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      compressAndSetImage(e.target.files[0]);
    }
  };

  const handleStartEdit = (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name);
    setCategory(prod.category);
    setDescription(prod.description);
    setPrice(prod.price || 85000);
    setDiscountPrice(prod.discountPrice || 0);
    setPriceRange(prod.priceRange || "");
    setFeaturesText(prod.features.join(", "));
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError("");
    
    // Check if image is one of presets
    const isPreset = PRESET_IMAGES.some(img => img.value === prod.image);
    if (isPreset) {
      setSelectedImage(prod.image);
      setCustomImageUrl("");
      setUploadedImageUrl("");
    } else if (prod.image.startsWith("data:") || prod.image.includes("supabase.co") || prod.image.includes("product-images")) {
      setSelectedImage("upload");
      setUploadedImageUrl(prod.image);
      setCustomImageUrl("");
    } else {
      setSelectedImage("custom");
      setCustomImageUrl(prod.image);
      setUploadedImageUrl("");
    }
  };

  const handleClearForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice(0);
    setDiscountPrice(0);
    setPriceRange("");
    setFeaturesText("");
    setSelectedImage(PRESET_IMAGES[0].value);
    setCustomImageUrl("");
    setUploadedImageUrl("");
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError("");
    setFormSuccess("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || price <= 0) {
      alert("Name, description and valid numeric price are core requirements!");
      return;
    }

    let finalImage = selectedImage;
    if (selectedImage === "custom") {
      finalImage = customImageUrl.trim() || PRESET_IMAGES[0].value;
    } else if (selectedImage === "upload") {
      finalImage = uploadedImageUrl || PRESET_IMAGES[0].value;
    }

    const finalFeatures = featuresText.trim()
      ? featuresText.split(",").map(f => f.trim()).filter(f => f.length > 0)
      : ["Premium quality", "Imported kitchenware"];

    // Auto-generate display range if empty
    const displayPriceRange = priceRange.trim() || formatNaira(price);

    if (editingId) {
      onEditProduct({
        id: editingId,
        name: name.trim(),
        category,
        description: description.trim(),
        image: finalImage,
        priceRange: displayPriceRange,
        price: Number(price),
        discountPrice: discountPrice > 0 ? Number(discountPrice) : undefined,
        features: finalFeatures,
        rating: 4.8,
        stockStatus: "In Stock"
      });
      setFormSuccess("Product updated successfully in local storage!");
    } else {
      onAddProduct({
        name: name.trim(),
        category,
        description: description.trim(),
        image: finalImage,
        priceRange: displayPriceRange,
        price: Number(price),
        discountPrice: discountPrice > 0 ? Number(discountPrice) : undefined,
        features: finalFeatures,
        rating: 4.8,
        stockStatus: "In Stock"
      });
      setFormSuccess("New product added successfully to catalog!");
    }

    setTimeout(() => {
      handleClearForm();
    }, 2000);
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
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
                  <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block mb-1">Product Title *</label>
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
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block mb-1">Base Showroom Price * (₦)</label>
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

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Promo Sale/Discount Price (₦)</label>
                    <input
                      type="number"
                      min={0}
                      value={discountPrice || ""}
                      onChange={(e) => setDiscountPrice(Number(e.target.value))}
                      placeholder="e.g. 95000 (Optional)"
                      className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white text-gray-950 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Wholesale Display Range</label>
                    <input
                      type="text"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      placeholder="e.g. ₦110,000"
                      className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white text-gray-950"
                    />
                  </div>
                </div>

                {/* Picture selects */}
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block mb-1">Appliance Product Image Showcase</label>
                  <select
                    value={selectedImage}
                    onChange={(e) => setSelectedImage(e.target.value)}
                    className="w-full text-xs px-3 py-3 bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white text-gray-900 font-semibold mb-3"
                  >
                    <option value="upload">📷 -- Upload custom image from laptop (Compressed!) --</option>
                    {PRESET_IMAGES.map(img => (
                      <option key={img.value} value={img.value}>{img.label}</option>
                    ))}
                    <option value="custom">🔗 -- Enter custom image web URL --</option>
                  </select>

                  {selectedImage === "upload" && (
                    <div className="space-y-3 mb-3">
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                          isDragActive
                            ? "border-brand-500 bg-brand-50"
                            : uploadedImageUrl
                            ? "border-emerald-300 bg-emerald-50/20"
                            : "border-gray-200 hover:border-brand-400 hover:bg-stone-50"
                        }`}
                      >
                        <input
                          type="file"
                          id="image-file-upload-dashboard"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {isUploading ? (
                          <div className="space-y-3 py-2">
                            <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
                            <p className="text-[10px] font-bold text-gray-600">Uploading to Supabase... {uploadProgress}%</p>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-brand-500 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : uploadedImageUrl ? (
                          <div className="space-y-2 relative group">
                            <img
                              src={uploadedImageUrl}
                              alt="Dashboard preview"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800"; e.currentTarget.onerror = null; }}
                              className="mx-auto w-24 h-24 rounded-xl object-cover border border-gray-200 bg-white"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImageUrl("");
                              }}
                              className="absolute -top-2 right-[calc(50%-56px)] bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <p className="text-[10px] text-emerald-800 font-bold block">Image successfully uploaded to Supabase!</p>
                            <label htmlFor="image-file-upload-dashboard" className="text-[9px] text-brand-600 font-bold underline cursor-pointer">Replace Image</label>
                          </div>
                        ) : (
                          <label htmlFor="image-file-upload-dashboard" className="cursor-pointer block py-2">
                            <Upload className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                            <span className="text-[10px] font-bold text-gray-700 block">Drag picture here or click to browse</span>
                          </label>
                        )}
                      </div>
                      {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
                    </div>
                  )}

                  {selectedImage === "custom" && (
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/your-picture-address"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg bg-stone-50 border border-gray-200 focus:outline-none focus:bg-white text-gray-900 mb-2"
                    />
                  )}
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block mb-1">Full Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide technical descriptions, alloy specifications, capacity (liters), and weight indices..."
                    className="w-full text-xs px-3.5 py-2 rounded-xl bg-stone-50 border border-gray-200 focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-gray-500 block mb-1">Bullet features (Commas Separated)</label>
                  <input
                    type="text"
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    placeholder="Double food pan compartments, 180° degree smooth rollout, Tempered gold handle accents"
                    className="w-full text-xs px-3.5 py-3 bg-stone-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`flex-1 py-3.5 text-white text-xs font-bold rounded-xl scroll-smooth transition-colors cursor-pointer ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ca8a04] hover:bg-yellow-700'}`}
                  >
                    {isUploading ? "Uploading Image..." : editingId ? "Save Product Changes" : "Publish to Showroom catalog"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleClearForm}
                      className="px-4.5 py-3.5 border border-gray-200 text-xs text-gray-500 rounded-xl hover:bg-stone-50"
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
                    <img
                      src={getProductImageUrl(p.image)}
                      alt={p.name}
                      loading="lazy"
                            decoding="async"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=800&h=800"; e.currentTarget.onerror = null; }}
                      
                      
                      
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100 bg-stone-100"
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

      </div>
    </section>
  );
}
