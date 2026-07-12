import { createClient } from "@supabase/supabase-js";
import { Product, Order, ContactForm } from "../types";

const urlRaw = (import.meta as any).env.VITE_SUPABASE_URL || "";
const keyRaw = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

let parsedSupabaseUrl = "";
try {
  // Extract strictly the origin (e.g. https://xxx.supabase.co) ignoring any paths or trailing slashes the user might have accidentally copied
  const parsed = new URL(urlRaw.replace(/^["']/g, "").replace(/["']$/g, "").trim());
  parsedSupabaseUrl = parsed.origin;
} catch (e) {
  parsedSupabaseUrl = urlRaw.replace(/^["']/g, "").replace(/["']$/g, "").trim();
}

const supabaseUrl = parsedSupabaseUrl;
const supabaseAnonKey = keyRaw.replace(/^["']/g, "").replace(/["']$/g, "").trim();


// Verify the environment variables are genuinely configured
export const isSupabaseConfigured = 
  supabaseUrl.trim() !== "" && 
  supabaseAnonKey.trim() !== "" && 
  !supabaseUrl.includes("YOUR_") &&
  !supabaseUrl.includes("MY_") &&
  !supabaseUrl.includes("PLACEHOLDER") &&
  supabaseUrl.startsWith("https://");

// Initialize client if configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

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
      // Seed Database with fallback default catalog if completely empty!
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

    // Format fields correctly for frontend (converting flat DB fields)
    return data.map((d: any) => ({
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
  if (!imagePath) return "";
  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  
  // Extract filename in case it has /images/ or other prefixes
  const parts = imagePath.split("/");
  const filename = parts[parts.length - 1];
  
  if (isSupabaseConfigured && supabase) {
    const { data } = supabase.storage.from("product-images").getPublicUrl(filename);
    return data.publicUrl;
  }
  return imagePath; // Fallback
}
