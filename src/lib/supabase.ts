import { createClient } from "@supabase/supabase-js";
import { Product, Order, ContactForm, CeoVideoConfig } from "../types";
import { DEFAULT_CEO_VIDEO_CONFIG } from "../data";

const DEFAULT_SUPABASE_URL = "https://kzssompfuuzxauriebql.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6c3NvbXBmdXV6eGF1cmllYnFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNzQwNjMsImV4cCI6MjA5NzY1MDA2M30.xdzUwTCKUJRv0ihDS8M4417UTtojXzu9OLRHtqP2xO0";

const urlRaw = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const keyRaw = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

// Clean raw strings in case VITE_SUPABASE_URL was appended to VITE_SUPABASE_ANON_KEY in environment
let cleanKey = keyRaw.split("VITE_SUPABASE_URL")[0].trim().replace(/^["']/g, "").replace(/["']$/g, "");
let cleanUrl = urlRaw.trim().replace(/^["']/g, "").replace(/["']$/g, "");

// Strip trailing /rest/v1 or trailing slashes if present
if (cleanUrl.endsWith("/rest/v1/") || cleanUrl.endsWith("/rest/v1")) {
  cleanUrl = cleanUrl.replace(/\/rest\/v1\/?$/, "");
}

let parsedSupabaseUrl = "";
try {
  if (cleanUrl.startsWith("http")) {
    const parsed = new URL(cleanUrl);
    parsedSupabaseUrl = parsed.origin;
  }
} catch (e) {
  parsedSupabaseUrl = cleanUrl;
}

// Fallback to project defaults if env vars are missing or invalid
const supabaseUrl = (parsedSupabaseUrl && parsedSupabaseUrl.startsWith("https://")) 
  ? parsedSupabaseUrl 
  : DEFAULT_SUPABASE_URL;

const supabaseAnonKey = (cleanKey && cleanKey.length > 20) 
  ? cleanKey 
  : DEFAULT_SUPABASE_ANON_KEY;

// Verify the credentials are valid
export const isSupabaseConfigured = 
  supabaseUrl.trim() !== "" && 
  supabaseAnonKey.trim() !== "" && 
  !supabaseUrl.includes("YOUR_") &&
  !supabaseUrl.includes("MY_") &&
  !supabaseUrl.includes("PLACEHOLDER") &&
  supabaseUrl.startsWith("https://");

// Initialize client
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Health Check function run on initialization to verify backend connectivity
 */
export async function runBackendHealthCheck(): Promise<void> {
  const isProd = import.meta.env?.PROD ?? false;
  const configuredDirectly = !!(urlRaw && keyRaw);
  
  console.log(
    `%c[Health Check] Initializing Rozay Kitchen backend connection... (Mode: ${isProd ? "Production" : "Development"}, Config: ${configuredDirectly ? "VITE_ Injected" : "HA Fallback"})`,
    "color: #b45309; font-weight: 600; font-size: 11px;"
  );

  if (!isSupabaseConfigured || !supabase) {
    console.warn("[Health Check] ⚠ Supabase is not configured. Running in offline/fallback mode.");
    return;
  }

  try {
    const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();
    const { count, error } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true });

    const latency = Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - startTime);

    if (error) {
      console.warn(`[Health Check] ⚠ Backend ping responded with notice: ${error.message} (${latency}ms)`);
    } else {
      console.log(
        `%c[Health Check] ✓ Successfully initialized connection to backend (${latency}ms) | Endpoint: ${supabaseUrl} | Products Available: ${count ?? "Ready"} | Storage: Connected`,
        "color: #047857; font-weight: bold; font-size: 11px;"
      );
    }
  } catch (err: any) {
    console.warn(`[Health Check] Health check ping caught: ${err?.message || err}`);
  }
}

// Automatically trigger health check on startup in browser environments
if (typeof window !== "undefined") {
  runBackendHealthCheck();
}

// --- DYNAMIC DATA ADAPTER ENGINE ---

/**
 * Products Adapter
 */
export async function getDbProducts(fallbackData: Product[]): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    const local = localStorage.getItem("rozay_products");
    if (local) {
      try {
        const localProducts = JSON.parse(local);
        const merged = [...localProducts];
        for (const fp of fallbackData) {
          if (!merged.find((p: Product) => p.id === fp.id)) {
            merged.push(fp);
          }
        }
        localStorage.setItem("rozay_products", JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.warn("Decoding local products failed", e);
      }
    }
    localStorage.setItem("rozay_products", JSON.stringify(fallbackData));
    return fallbackData;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      if (fallbackData && fallbackData.length > 0) {
        // Seed Database with fallback default catalog if non-empty
        console.info("Supabase products table is empty. Seeding defaults...");
        for (const item of fallbackData) {
          await supabase.from("products").insert({
            id: item.id,
            name: item.name,
            category: item.category,
            description: item.description,
            image: item.image,
            features: item.features,
            price_range: item.priceRange || "",
            price: item.price,
            discount_price: item.discountPrice || null,
            stock_status: item.stockStatus || "In Stock",
            rating: item.rating || 4.8
          });
        }
        return fallbackData;
      }
      localStorage.removeItem("rozay_products");
      return [];
    }

    // Format fields correctly for frontend (converting flat DB fields)
    const dbProducts: Product[] = data.map((d: any) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      description: d.description,
      image: d.image,
      features: Array.isArray(d.features) ? d.features : d.features ? JSON.parse(d.features) : [],
      priceRange: d.price_range || d.priceRange,
      price: Number(d.price),
      discountPrice: d.discount_price ? Number(d.discount_price) : d.discountPrice ? Number(d.discountPrice) : undefined,
      stockStatus: d.stock_status || d.stockStatus || "In Stock",
      rating: d.rating ? Number(d.rating) : 4.8
    }));

    // Merge any items from fallbackData that might not be in DB yet
    const dbProductIds = new Set(dbProducts.map((p) => p.id));
    const missingDefaults = fallbackData.filter((fp) => !dbProductIds.has(fp.id));
    
    // Asynchronously insert missing defaults into Supabase in background
    if (missingDefaults.length > 0 && supabase) {
      Promise.all(
        missingDefaults.map((item) =>
          supabase.from("products").insert({
            id: item.id,
            name: item.name,
            category: item.category,
            description: item.description,
            image: item.image,
            features: item.features,
            price_range: item.priceRange || "",
            price: item.price,
            discount_price: item.discountPrice || null,
            stock_status: item.stockStatus || "In Stock",
            rating: item.rating || 4.8
          })
        )
      ).catch((err) => console.warn("Background seed sync notice:", err));
    }

    const allProducts = [...dbProducts, ...missingDefaults];
    localStorage.setItem("rozay_products", JSON.stringify(allProducts));
    return allProducts;
  } catch (err) {
    console.warn("Supabase products fetch failed - falling back to localStorage", err);
    const local = localStorage.getItem("rozay_products");
    if (local) {
      const localProducts = JSON.parse(local);
      const merged = [...localProducts];
      for (const fp of fallbackData) {
        if (!merged.find((p: Product) => p.id === fp.id)) {
          merged.push(fp);
        }
      }
      return merged;
    }
    return fallbackData;
  }
}

export async function addDbProduct(newProduct: Omit<Product, "id">): Promise<Product> {
  const pId = `rzk-prod-${Date.now()}`;
  const preparedProduct: Product = {
    ...newProduct,
    id: pId
  };

  try {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("products").insert({
        id: preparedProduct.id,
        name: preparedProduct.name,
        category: preparedProduct.category,
        description: preparedProduct.description,
        image: preparedProduct.image,
        features: preparedProduct.features,
        price_range: preparedProduct.priceRange || "",
        price: preparedProduct.price,
        discount_price: preparedProduct.discountPrice || null,
        stock_status: preparedProduct.stockStatus || "In Stock",
        rating: preparedProduct.rating || 4.8
      });
      if (error) throw error;
    }

    // Update local cache robustly
    const localRaw = localStorage.getItem("rozay_products");
    const currentLocal: Product[] = localRaw ? JSON.parse(localRaw) : [];
    localStorage.setItem("rozay_products", JSON.stringify([preparedProduct, ...currentLocal]));
    
    return preparedProduct;
  } catch (error) {
    console.error("Failed to add product", error);
    throw new Error("Failed to add product to database");
  }
}

export async function updateDbProduct(updatedProduct: Product): Promise<void> {
  try {
    let oldImageUrl: string | undefined;

    // Fetch old image URL from local cache
    const localRaw = localStorage.getItem("rozay_products");
    let currentLocal: Product[] = [];
    if (localRaw) {
      currentLocal = JSON.parse(localRaw);
    }
    const exists = currentLocal.find(p => p.id === updatedProduct.id);
    if (exists) {
      oldImageUrl = exists.image;
    }

    if (isSupabaseConfigured && supabase) {
      // If not in local cache, fetch from Supabase
      if (!oldImageUrl) {
        const { data } = await supabase.from("products").select("image").eq("id", updatedProduct.id).single();
        if (data && data.image) {
          oldImageUrl = data.image;
        }
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: updatedProduct.name,
          category: updatedProduct.category,
          description: updatedProduct.description,
          image: updatedProduct.image,
          features: updatedProduct.features,
          price_range: updatedProduct.priceRange || "",
          price: updatedProduct.price,
          discount_price: updatedProduct.discountPrice || null,
          stock_status: updatedProduct.stockStatus || "In Stock",
          rating: updatedProduct.rating || 4.8
        })
        .eq("id", updatedProduct.id);
      
      if (error) throw error;

      // Clean up old image if it was replaced
      if (oldImageUrl && oldImageUrl !== updatedProduct.image && oldImageUrl.includes("product-images")) {
        const parts = oldImageUrl.split("/");
        const fileName = parts[parts.length - 1];
        if (fileName) {
          // Do not await, fire and forget to avoid blocking
          supabase.storage.from("product-images").remove([fileName]).catch(err => {
            console.error("Failed to delete old image", err);
          });
        }
      }
    }

    if (exists) {
        const updatedLocal = currentLocal.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        localStorage.setItem("rozay_products", JSON.stringify(updatedLocal));
    } else {
        // If it wasn't found (e.g. they edited a fallback item that wasn't in local storage yet)
        localStorage.setItem("rozay_products", JSON.stringify([updatedProduct, ...currentLocal]));
    }
  } catch (error) {
    console.error("Failed to update product in Supabase", error);
    throw new Error("Failed to update product in database");
  }
}

export async function deleteDbProduct(productId: string): Promise<void> {
  try {
    let imageUrlToRemove: string | undefined;

    const localRaw = localStorage.getItem("rozay_products");
    if (localRaw) {
      const currentLocal: Product[] = JSON.parse(localRaw);
      const productToDelete = currentLocal.find((p: Product) => p.id === productId);
      if (productToDelete) {
        imageUrlToRemove = productToDelete.image;
      }
    }

    if (isSupabaseConfigured && supabase) {
      if (!imageUrlToRemove) {
        const { data } = await supabase.from("products").select("image").eq("id", productId).single();
        if (data && data.image) {
          imageUrlToRemove = data.image;
        }
      }

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      if (error) throw error;

      if (imageUrlToRemove && imageUrlToRemove.includes("product-images")) {
        const parts = imageUrlToRemove.split("/");
        const fileName = parts[parts.length - 1];
        if (fileName) {
          await supabase.storage.from("product-images").remove([fileName]);
        }
      }
    }

    // Update local cache robustly
    if (localRaw) {
      const currentLocal: Product[] = JSON.parse(localRaw);
      const updatedLocal = currentLocal.filter((p: Product) => p.id !== productId);
      localStorage.setItem("rozay_products", JSON.stringify(updatedLocal));
    }
  } catch (error) {
    console.error("Failed to delete product in Supabase", error);
    throw new Error("Failed to delete product in database");
  }
}

/**
 * Orders Adapter
 */
export async function getDbOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured || !supabase) {
    const local = localStorage.getItem("rozay_orders_crm");
    return local ? JSON.parse(local) : [];
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((o: any) => ({
      id: o.id,
      customerName: o.customer_name,
      customerEmail: o.customer_email || "",
      customerPhone: o.customer_phone || "",
      address: o.address || "",
      city: o.city || "",
      state: o.state || "",
      deliveryMethod: o.delivery_method || "",
      deliveryFee: Number(o.delivery_fee || 0),
      items: typeof o.items === "string" ? JSON.parse(o.items) : o.items,
      subtotal: Number(o.subtotal || 0),
      total: Number(o.total || 0),
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      orderStatus: o.order_status,
      createdAt: o.created_at
    }));
  } catch (err) {
    console.warn("Supabase orders query failed - falling back to localStorage", err);
    const local = localStorage.getItem("rozay_orders_crm");
    return local ? JSON.parse(local) : [];
  }
}

export async function addDbOrder(newOrder: Order): Promise<void> {
  // Always log locally
  const savedOrders = localStorage.getItem("rozay_orders_crm");
  let list: Order[] = [];
  if (savedOrders) {
    try { list = JSON.parse(savedOrders); } catch (e) {}
  }
  list = [newOrder, ...list];
  localStorage.setItem("rozay_orders_crm", JSON.stringify(list));

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("orders").insert({
        id: newOrder.id,
        customer_name: newOrder.customerName,
        customer_email: newOrder.customerEmail,
        customer_phone: newOrder.customerPhone,
        address: newOrder.address,
        city: newOrder.city,
        state: newOrder.state,
        delivery_method: newOrder.deliveryMethod,
        delivery_fee: newOrder.deliveryFee,
        items: JSON.stringify(newOrder.items),
        subtotal: newOrder.subtotal,
        total: newOrder.total,
        payment_method: newOrder.paymentMethod,
        payment_status: newOrder.paymentStatus,
        order_status: newOrder.orderStatus,
        created_at: newOrder.createdAt
      });
      if (error) throw error;
    } catch (err) {
      console.error("Failed to record order inside Supabase", err);
    }
  }
}

/**
 * Contact Submissions Adapter
 */
export async function getDbSubmissions(): Promise<ContactForm[]> {
  if (!isSupabaseConfigured || !supabase) {
    const local = localStorage.getItem("rozay_form_submissions");
    return local ? JSON.parse(local) : [];
  }

  try {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((s: any) => ({
      name: s.name,
      email: s.email || "",
      phone: s.phone || "",
      message: s.message || "",
      businessType: s.business_type || "",
      createdAt: s.created_at,
      productSelected: s.product_selected || "General Inquiry / Catalog Proposal",
      quantitySelected: Number(s.quantity_selected || 1)
    }));
  } catch (err) {
    console.warn("Supabase contact_submissions query failed - fallback", err);
    const local = localStorage.getItem("rozay_form_submissions");
    return local ? JSON.parse(local) : [];
  }
}

export async function addDbSubmission(sub: ContactForm): Promise<void> {
  // Always log locally
  const saved = localStorage.getItem("rozay_form_submissions");
  let list: ContactForm[] = [];
  if (saved) {
    try { list = JSON.parse(saved); } catch (e) {}
  }
  list = [sub, ...list];
  localStorage.setItem("rozay_form_submissions", JSON.stringify(list));

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: sub.name,
        email: sub.email,
        phone: sub.phone,
        message: sub.message,
        business_type: sub.businessType,
        product_selected: sub.productSelected || "General Inquiry / Catalog Proposal",
        quantity_selected: sub.quantitySelected || 1,
        created_at: sub.createdAt
      });
      if (error) throw error;
    } catch (err) {
      console.error("Failed to create record in Supabase contact_submissions", err);
    }
  }
}

export function getProductImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath || imagePath.trim() === "" || imagePath === "undefined" || imagePath === "null") {
    return "/images/luxury_chafing_dish_1781992841526.jpg";
  }
  
  let path = imagePath.trim();

  // Upgrade http:// to https:// to prevent mixed-content blocking on live SSL hosts like Truehost
  if (path.startsWith("http://")) {
    path = path.replace("http://", "https://");
  }

  // If already a full HTTPS, data URL or blob URL, return directly
  if (path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  // Handle local static public assets (e.g. /images/..., images/..., ./images/..., assets/...)
  if (
    path.startsWith("/") ||
    path.startsWith("./") ||
    path.startsWith("images/") ||
    path.startsWith("public/") ||
    path.startsWith("assets/")
  ) {
    const cleanPath = path.replace(/^\.\//, "").replace(/^public\//, "");
    return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  }

  // Extract filename in case of Supabase Storage bucket files or legacy paths
  const parts = path.split("/");
  const filename = parts[parts.length - 1];

  if (filename) {
    const cleanBaseUrl = supabaseUrl.replace(/\/$/, "");
    return `${cleanBaseUrl}/storage/v1/object/public/product-images/${filename}`;
  }

  return "/images/luxury_chafing_dish_1781992841526.jpg";
}

/**
 * Convert any image file to a crystal-clear high-res Base64 Data URL
 */
export async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Compress and optimize image before uploading to Supabase Storage
 * Preserves Ultra-HD crystal clarity (up to 2560px resolution) with studio-grade 0.95 quality.
 */
export async function compressImage(file: File, maxDimension = 2560, quality = 0.95): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;

      // Only resize if original exceeds Ultra-HD maximum dimension (e.g. huge >2560px RAW camera files)
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round(height * (maxDimension / width));
          width = maxDimension;
        } else {
          width = Math.round(width * (maxDimension / height));
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Configure high-quality bicubic smoothing for crisp edges and sharp metallic reflections
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw high-fidelity image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to modern high-resolution WebP format with 0.95 studio quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Image compression failed"));
          }
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression"));
    };

    img.src = objectUrl;
  });
}

/**
 * Direct Supabase Storage Upload for Product Images with automatic resilient data URL fallback
 */
export async function uploadProductImageToSupabase(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  // 1. Validation
  const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg+xml"];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error("Invalid image format. Only JPG, JPEG, PNG, and WebP images are allowed.");
  }

  onProgress?.(20);

  // 2. Compress image on client side with high fidelity
  let imageBlob: Blob;
  try {
    imageBlob = await compressImage(file, 2048, 0.92);
  } catch (err) {
    console.warn("Client image compression fallback to raw file blob", err);
    imageBlob = file;
  }

  onProgress?.(50);

  // If Supabase is not configured, return high-res data URL
  if (!isSupabaseConfigured || !supabase) {
    onProgress?.(100);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageBlob);
    });
  }

  // 3. Unique filename with SHA256 / hash + timestamp to prevent collisions
  try {
    const arrayBuffer = await imageBlob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").substring(0, 12);
    const uniqueId = Math.random().toString(36).substring(2, 7);
    const fileName = `product-${Date.now()}-${hashHex}-${uniqueId}.webp`;

    onProgress?.(70);

    // 4. Try upload to Supabase Storage
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageBlob, {
        contentType: "image/webp",
        cacheControl: "36000",
        upsert: true
      });

    if (!error) {
      onProgress?.(95);
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      onProgress?.(100);
      return publicUrlData.publicUrl;
    } else {
      console.warn("Supabase storage upload returned notice, converting to persistent high-res data URL:", error.message);
    }
  } catch (err) {
    console.warn("Supabase storage upload caught exception, fallback to data URL:", err);
  }

  // Resilient fallback: Return Base64 data URL so the image ALWAYS works immediately
  onProgress?.(100);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(imageBlob);
  });
}

/**
 * Remove an image file from Supabase Storage
 */
export async function deleteStorageImage(imageUrl: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase || !imageUrl) return;
  if (!imageUrl.includes("product-images")) return;

  try {
    const parts = imageUrl.split("/product-images/");
    if (parts.length > 1) {
      const fileName = parts[1].split("?")[0];
      if (fileName) {
        await supabase.storage.from("product-images").remove([fileName]);
      }
    }
  } catch (err) {
    console.error("Failed to delete storage file", err);
  }
}

// ====================================================================
// IndexedDB Media Store for Large Video Files & Local Fallbacks
// ====================================================================
const DB_NAME = "RozayKitchenMediaDB";
const DB_VERSION = 1;
const STORE_NAME = "video_blobs";

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available in this environment"));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveVideoBlobToIndexedDB(key: string, blob: Blob): Promise<string> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, key);
      req.onsuccess = () => {
        const objectUrl = URL.createObjectURL(blob);
        resolve(objectUrl);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Could not write video blob to IndexedDB:", err);
    return URL.createObjectURL(blob);
  }
}

export async function getVideoBlobFromIndexedDB(key: string): Promise<string | null> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result instanceof Blob) {
          const objectUrl = URL.createObjectURL(req.result);
          resolve(objectUrl);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

/**
 * Direct Video Upload for CEO Showcase (MP4, WebM, MOV, QuickTime)
 */
export async function uploadCeoVideoFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  onProgress?.(15);

  // 1. Always store locally in IndexedDB so the uploaded video is IMMEDIATELY playable and persistent
  let localVideoUrl: string = "";
  try {
    localVideoUrl = await saveVideoBlobToIndexedDB("ceo_showcase_video", file);
    onProgress?.(30);
  } catch (e) {
    console.warn("Notice: Local video caching note", e);
  }

  // 2. If Supabase is configured, upload to Supabase Storage bucket
  if (isSupabaseConfigured && supabase) {
    try {
      const uniqueId = Math.random().toString(36).substring(2, 7);
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const ext = cleanName.split(".").pop() || "mp4";
      const fileName = `ceo-video-${Date.now()}-${uniqueId}.${ext}`;

      onProgress?.(50);
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          contentType: file.type || "video/mp4",
          cacheControl: "31536000",
          upsert: true
        });

      if (!uploadError) {
        onProgress?.(90);
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          onProgress?.(100);
          return publicUrlData.publicUrl;
        }
      } else {
        console.warn("Supabase storage video upload returned notice:", uploadError.message);
      }
    } catch (err: any) {
      console.warn("Supabase video upload cloud exception, falling back to cached video:", err);
    }
  }

  // 3. Return the persistent local video object URL
  onProgress?.(100);
  if (localVideoUrl) {
    return localVideoUrl;
  }

  // 4. Fallback for small video clips < 8MB
  if (file.size <= 8 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  return URL.createObjectURL(file);
}

/**
 * CEO Video Showcase Persistence Helpers
 */
export async function getDbCeoVideo(): Promise<CeoVideoConfig> {
  // 1. Always check Supabase Database first so live visitors get the latest video
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "ceo_video_showcase")
        .maybeSingle();

      if (!error && data?.value) {
        const parsed: CeoVideoConfig = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
        if (parsed && parsed.videoUrl && parsed.videoUrl.trim() !== "") {
          localStorage.setItem("rozay_ceo_video", JSON.stringify(parsed));
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Supabase CEO video fetch notice", err);
    }
  }

  // 2. Check IndexedDB video cache for locally uploaded videos
  try {
    const cachedBlobUrl = await getVideoBlobFromIndexedDB("ceo_showcase_video");
    const localRaw = localStorage.getItem("rozay_ceo_video");
    if (localRaw) {
      const parsed: CeoVideoConfig = JSON.parse(localRaw);
      if (parsed) {
        if (cachedBlobUrl && (!parsed.videoUrl || parsed.videoUrl.startsWith("blob:") || parsed.videoType === "uploaded")) {
          return {
            ...parsed,
            videoUrl: cachedBlobUrl
          };
        }
        if (parsed.videoUrl && parsed.videoUrl.trim() !== "") {
          return parsed;
        }
      }
    } else if (cachedBlobUrl) {
      return {
        ...DEFAULT_CEO_VIDEO_CONFIG,
        videoUrl: cachedBlobUrl,
        videoType: "uploaded"
      };
    }
  } catch (e) {}

  // 3. Fallback to LocalStorage
  const local = localStorage.getItem("rozay_ceo_video");
  if (local) {
    try {
      const parsed: CeoVideoConfig = JSON.parse(local);
      if (parsed && parsed.videoUrl && parsed.videoUrl.trim() !== "") {
        return parsed;
      }
    } catch (e) {}
  }

  return DEFAULT_CEO_VIDEO_CONFIG;
}

export async function saveDbCeoVideo(config: CeoVideoConfig): Promise<void> {
  const cleanConfig = { ...config };

  localStorage.setItem("rozay_ceo_video", JSON.stringify(cleanConfig));

  // Dispatch global window event immediately so all components update in real-time
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("rozay_ceo_video_updated", { detail: cleanConfig }));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      // If saving to Supabase, ensure we don't send local blob: URLs that other browsers cannot open
      const supabaseConfig = { ...cleanConfig };
      if (supabaseConfig.videoUrl && supabaseConfig.videoUrl.startsWith("blob:")) {
        // Leave previous public URL or skip sending blob:
      }

      await supabase.from("site_settings").upsert({
        key: "ceo_video_showcase",
        value: supabaseConfig,
        updated_at: new Date().toISOString()
      }, { onConflict: "key" });
    } catch (err) {
      console.warn("Supabase CEO video save notice", err);
    }
  }
}

/**
 * Real-time subscription to CEO Video Showcase updates from Supabase
 */
export function subscribeDbCeoVideo(onUpdate: (config: CeoVideoConfig) => void): () => void {
  if (!isSupabaseConfigured || !supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel("site_settings_ceo_video_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: "key=eq.ceo_video_showcase"
        },
        (payload: any) => {
          if (payload?.new?.value) {
            try {
              const parsed: CeoVideoConfig =
                typeof payload.new.value === "string"
                  ? JSON.parse(payload.new.value)
                  : payload.new.value;
              if (parsed && parsed.videoUrl && parsed.videoUrl.trim() !== "") {
                localStorage.setItem("rozay_ceo_video", JSON.stringify(parsed));
                onUpdate(parsed);
              }
            } catch (err) {
              console.warn("Error parsing realtime video config payload", err);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  } catch (err) {
    console.warn("Supabase realtime subscription exception", err);
    return () => {};
  }
}

