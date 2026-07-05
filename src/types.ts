export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  priceRange?: string; // Kept for backward compatibility and visual displays
  price: number;       // Numeric price (e.g. 110000) for calculations
  discountPrice?: number; // Optional discount / sale price
  stockStatus?: "In Stock" | "Low Stock" | "Out of Stock" | "High Demand";
  rating?: number;     // e.g. 4.8
}

export interface InquiryItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  deliveryMethod: string;
  deliveryFee: number;
  items: { product: Product; quantity: number }[];
  subtotal: number;
  total: number;
  paymentMethod: "Paystack" | "WhatsApp / Direct Transfer";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Received" | "Processing" | "Dispatched" | "Delivered";
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  feedback: string;
  rating?: number;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  businessType: string;
  createdAt: string;
  productSelected?: string;
  quantitySelected?: number;
}
