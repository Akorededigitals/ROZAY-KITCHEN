import fs from 'fs';

let code = fs.readFileSync('src/lib/supabase.ts', 'utf-8');

// Replace getDbProducts
code = code.replace(
  /export async function getDbProducts[\s\S]*?return fallbackData;\n}/,
  `export async function getDbProducts(fallbackData: Product[]): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    const local = localStorage.getItem("rozay_products");
    if (local) {
      try {
        const localProducts = JSON.parse(local);
        // Merge fallbackData with localProducts so we don't lose defaults if local was partially saved
        const merged = [...localProducts];
        for (const fp of fallbackData) {
          if (!merged.find(p => p.id === fp.id)) {
            merged.push(fp);
          }
        }
        // Save the merged list back so future updates work correctly
        localStorage.setItem("rozay_products", JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.warn("Decoding local products failed", e);
      }
    }
    // Initialize local storage with fallback if empty
    localStorage.setItem("rozay_products", JSON.stringify(fallbackData));
    return fallbackData;
  }
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    if (data.length === 0) return fallbackData;
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      description: d.description,
      image: d.image,
      features: d.features,
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
          if (!merged.find(p => p.id === fp.id)) {
            merged.push(fp);
          }
        }
        return merged;
    }
    return fallbackData;
  }
}`
);

// Replace addDbProduct to ensure it reads the merged fallback (which is now in local storage)
code = code.replace(
  /const localRaw = localStorage\.getItem\("rozay_products"\);\n\s*const currentLocal: Product\[\] = localRaw \? JSON\.parse\(localRaw\) : \[\];\n\s*localStorage\.setItem\("rozay_products", JSON\.stringify\(\[preparedProduct, \.\.\.currentLocal\]\)\);/,
  `const localRaw = localStorage.getItem("rozay_products");
    const currentLocal: Product[] = localRaw ? JSON.parse(localRaw) : [];
    localStorage.setItem("rozay_products", JSON.stringify([preparedProduct, ...currentLocal]));`
); // It's fine since getDbProducts initialized it.

// Replace updateDbProduct to ensure it updates even if localRaw is somehow missing
code = code.replace(
  /const localRaw = localStorage\.getItem\("rozay_products"\);\n\s*if \(localRaw\) \{\n\s*const currentLocal: Product\[\] = JSON\.parse\(localRaw\);\n\s*const updatedLocal = currentLocal\.map\(p => p\.id === updatedProduct\.id \? updatedProduct : p\);\n\s*localStorage\.setItem\("rozay_products", JSON\.stringify\(updatedLocal\)\);\n\s*\}/,
  `const localRaw = localStorage.getItem("rozay_products");
    let currentLocal: Product[] = [];
    if (localRaw) {
      currentLocal = JSON.parse(localRaw);
    }
    const exists = currentLocal.find(p => p.id === updatedProduct.id);
    if (exists) {
        const updatedLocal = currentLocal.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        localStorage.setItem("rozay_products", JSON.stringify(updatedLocal));
    } else {
        // If it wasn't found (e.g. they edited a fallback item that wasn't in local storage yet)
        localStorage.setItem("rozay_products", JSON.stringify([updatedProduct, ...currentLocal]));
    }`
);

fs.writeFileSync('src/lib/supabase.ts', code);
