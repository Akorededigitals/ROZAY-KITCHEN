/**
 * WhatsApp Integration Utilities for Rozay Kitchen
 * Handles environment-configured business phone numbers, site URL detection,
 * and structured message formatting for orders, inquiries, product reviews, and live agent chat transfers.
 */

import { BRAND_INFO } from "../data";
import { Order, InquiryItem, Product } from "../types";

/**
 * Normalizes any phone number format (e.g. +234 812 322 1174, 08123221174, 2348123221174)
 * into a standard international WhatsApp recipient format (digits only, e.g. 2348123221174).
 */
export function normalizeWhatsAppNumber(rawPhone?: string | null): string {
  if (!rawPhone || typeof rawPhone !== "string") {
    return "2348123221174"; // Default official Rozay Kitchen WhatsApp business contact
  }

  // Remove all non-numeric characters
  const digits = rawPhone.replace(/\D/g, "");

  if (!digits) {
    return "2348123221174";
  }

  // If starts with local Nigerian leading 0 (e.g. 08123221174), convert to 2348123221174
  if (digits.startsWith("0") && digits.length === 11) {
    return "234" + digits.slice(1);
  }

  // If already starts with 234 and reasonable length
  if (digits.startsWith("234")) {
    return digits;
  }

  // Return digits as is for any international phone number
  return digits;
}

/**
 * Retrieves the currently configured WhatsApp contact number from environment variables
 * (VITE_WHATSAPP_NUMBER or VITE_CONTACT_PHONE) with fallback to BRAND_INFO.
 */
export function getWhatsAppNumber(): string {
  const envNumber = 
    (typeof import.meta !== "undefined" && import.meta.env ? (import.meta.env.VITE_WHATSAPP_NUMBER || import.meta.env.VITE_CONTACT_PHONE) : "") ||
    BRAND_INFO.phone;

  return normalizeWhatsAppNumber(envNumber);
}

/**
 * Retrieves the current live site URL (accounting for environment configuration or browser origin).
 */
export function getSiteUrl(): string {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    if (import.meta.env.VITE_SITE_URL) {
      return (import.meta.env.VITE_SITE_URL as string).replace(/\/+$/, "");
    }
    if (import.meta.env.APP_URL) {
      return (import.meta.env.APP_URL as string).replace(/\/+$/, "");
    }
  }

  if (typeof window !== "undefined" && window.location && window.location.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  return "https://rozaykitchen.com";
}

/**
 * Builds a direct WhatsApp chat URL with encoded message and configured phone number.
 */
export function createWhatsAppUrl(message?: string, customPhone?: string): string {
  const phone = normalizeWhatsAppNumber(customPhone || getWhatsAppNumber());
  const text = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${phone}${text ? `?text=${text}` : ""}`;
}

/**
 * Safely triggers opening a WhatsApp chat in a new tab/window.
 */
export function openWhatsAppChat(message?: string, customPhone?: string): void {
  const url = createWhatsAppUrl(message, customPhone);
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Format currency helper
 */
function formatNaira(amount: number): string {
  return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
}

/**
 * Compiles a WhatsApp order confirmation message with items, delivery info, and tracking link.
 */
export function buildOrderWhatsAppMessage(order: Order, customSiteUrl?: string): string {
  const siteUrl = customSiteUrl || getSiteUrl();
  const trackingLink = `${siteUrl}/track?ref=${encodeURIComponent(order.id)}`;

  let msg = `*NEW ORDER NOTIFICATION — ROZAY KITCHEN* 🛒\n`;
  msg += `====================================\n`;
  msg += `*Order Reference:* #${order.id}\n`;
  msg += `*Date Placed:* ${order.createdAt}\n`;
  msg += `*Payment Method:* ${order.paymentMethod}\n`;
  msg += `*Payment Status:* ${order.paymentStatus === "Paid" ? "✅ Confirmed Paid" : "⏳ Pending Transfer Confirmation"}\n\n`;

  msg += `*CUSTOMER PROFILE:*\n`;
  msg += `• *Name:* ${order.customerName}\n`;
  msg += `• *Phone:* ${order.customerPhone}\n`;
  if (order.customerEmail) msg += `• *Email:* ${order.customerEmail}\n`;
  msg += `• *Delivery Address:* ${order.address}, ${order.city}, ${order.state}\n`;
  msg += `• *Delivery Option:* ${order.deliveryMethod}\n\n`;

  msg += `*PURCHASED ITEMS:*\n`;
  order.items.forEach((item, index) => {
    const activePrice = item.product.discountPrice || item.product.price;
    msg += `${index + 1}. *${item.product.name}* (Qty: ${item.quantity}) — ${formatNaira(activePrice * item.quantity)}\n`;
  });

  msg += `\n*FINANCIAL SUMMARY:*\n`;
  msg += `• *Subtotal:* ${formatNaira(order.subtotal)}\n`;
  msg += `• *Delivery Fee:* ${formatNaira(order.deliveryFee)}\n`;
  msg += `• *GRAND TOTAL:* *${formatNaira(order.total)}*\n\n`;

  msg += `*Live Order Tracking:* ${trackingLink}\n`;
  msg += `====================================\n`;
  msg += `Hello Rozay Kitchen team, please confirm stock dispatch and estimated delivery time. Thank you!`;

  return msg;
}

/**
 * Compiles an inquiry shopping list message for WhatsApp.
 */
export function buildInquiryWhatsAppMessage(
  cartItems: Array<{ product: Product; quantity: number }>,
  clientDetails: { name?: string; phone?: string; notes?: string },
  customSiteUrl?: string
): string {
  const siteUrl = customSiteUrl || getSiteUrl();
  const subtotal = cartItems.reduce<number>((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  let msg = `*NEW PRODUCT INQUIRY — ROZAY KITCHEN* 🥘\n`;
  msg += `====================================\n`;
  msg += `*CUSTOMER DETAILS:*\n`;
  msg += `• *Name:* ${clientDetails.name?.trim() || "Guest Customer"}\n`;
  if (clientDetails.phone) msg += `• *Phone:* ${clientDetails.phone.trim()}\n`;
  if (clientDetails.notes) msg += `• *Custom Request:* ${clientDetails.notes.trim()}\n\n`;

  msg += `*REQUESTED PRODUCTS (${cartItems.length} items):*\n`;
  cartItems.forEach((item, idx) => {
    const activePrice = item.product.discountPrice || item.product.price;
    const prodLink = `${siteUrl}/product/${item.product.id}`;
    msg += `${idx + 1}. *${item.product.name}*\n`;
    msg += `   - Quantity: ${item.quantity}\n`;
    msg += `   - Unit Price: ${formatNaira(activePrice)}\n`;
    msg += `   - Product Link: ${prodLink}\n`;
  });

  msg += `\n*ESTIMATED VALUE:* ${formatNaira(subtotal)}\n`;
  msg += `====================================\n`;
  msg += `Hello Rozay Kitchen! Please confirm current stock availability, wholesale rates (if applicable), and nationwide delivery dispatch to my location. Thank you!`;

  return msg;
}

/**
 * Compiles a direct single-product inquiry WhatsApp message.
 */
export function buildProductInquiryWhatsAppMessage(product: Product, customSiteUrl?: string): string {
  const siteUrl = customSiteUrl || getSiteUrl();
  const activePrice = product.discountPrice || product.price;
  const productUrl = `${siteUrl}/product/${product.id}`;

  return `Hello Rozay Kitchen Sales Team! 👋\n\nI am interested in ordering the following product from your store:\n\n• *Product:* ${product.name}\n• *Price:* ${formatNaira(activePrice)}\n• *Product Link:* ${productUrl}\n\nPlease confirm availability and delivery arrangement. Thank you!`;
}

/**
 * Compiles an AI chat transfer to human agent message.
 */
export function buildAgentTransferWhatsAppMessage(
  userQuestion?: string,
  aiSummary?: string,
  customSiteUrl?: string
): string {
  const siteUrl = customSiteUrl || getSiteUrl();

  let text = `Hello Rozay Kitchen Support Team! 👋\n\nI was chatting with your AI assistant on your website (${siteUrl}) and would like to speak directly with a human sales agent.`;

  if (userQuestion && userQuestion.trim()) {
    text += `\n\n*My Inquiry:* "${userQuestion.trim()}"`;
  }

  if (aiSummary && aiSummary.trim()) {
    text += `\n\n*AI Context:* "${aiSummary.trim().slice(0, 200)}..."`;
  }

  text += `\n\nPlease connect me with an agent to assist with product specifications, wholesale pricing, or my order. Thank you!`;

  return text;
}

/**
 * Compiles a general contact form inquiry WhatsApp message.
 */
export function buildGeneralContactWhatsAppMessage(
  name?: string,
  userMessage?: string,
  phone?: string,
  customSiteUrl?: string
): string {
  const siteUrl = customSiteUrl || getSiteUrl();

  let msg = `Hello Rozay Kitchen Team! 👋\n\nI am contacting you from your online website (${siteUrl}):\n\n`;
  msg += `• *Name:* ${name || "Customer"}\n`;
  if (phone) msg += `• *Phone:* ${phone}\n`;
  msg += `• *Message:* ${userMessage || "I would like to inquire about your luxury chafing dishes, cookware sets, and catering supplies."}\n\n`;
  msg += `Kindly assist me with available options and pricing. Thank you!`;

  return msg;
}
