import { BRAND_INFO, PRODUCTS_DATA } from "../data";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  requiresAgentTransfer?: boolean;
  transferReason?: string;
  suggestedQuestions?: string[];
}

// Client-side fallback knowledge engine when server API is unreachable or offline
function generateClientFallbackResponse(userMsg: string, history: ChatMessage[]): {
  text: string;
  requiresAgentTransfer: boolean;
  transferReason?: string;
} {
  const query = userMsg.toLowerCase().trim();

  // Keyword detection for explicit agent transfer triggers
  const agentKeywords = [
    "whatsapp", "agent", "human", "person", "representative", "speak", "talk to someone",
    "discount", "wholesale price", "bargain", "cheaper", "negotiate", "reduce price",
    "refund", "dispute", "complain", "damaged", "return item", "custom order", "special request"
  ];

  const needsAgent = agentKeywords.some((kw) => query.includes(kw));

  if (needsAgent) {
    return {
      text: "I can see you are asking about a custom arrangement, wholesale discount, or direct agent support! I will transfer your conversation directly to our sales agent on WhatsApp so we can give you a personalized response.",
      requiresAgentTransfer: true,
      transferReason: "Human agent transfer requested for custom assistance",
    };
  }

  // Location / Showroom questions
  if (query.includes("where") || query.includes("location") || query.includes("address") || query.includes("shop") || query.includes("store") || query.includes("idumota") || query.includes("balogun")) {
    return {
      text: `Our physical showroom and wholesale warehouse is located at:\n📍 ${BRAND_INFO.location}\n\n🕒 Hours: ${BRAND_INFO.hours.weekdays}.\nFeel free to visit us or request a direct dispatch!`,
      requiresAgentTransfer: false,
    };
  }

  // Delivery / Shipping questions
  if (query.includes("deliver") || query.includes("ship") || query.includes("send") || query.includes("waybill") || query.includes("lagos") || query.includes("state")) {
    return {
      text: `🚚 We deliver nationwide across Nigeria! For Lagos orders, we offer fast same-day or next-day dispatch. For interstate orders, we process secure waybills through trusted courier partners.`,
      requiresAgentTransfer: false,
    };
  }

  // Payment / Order questions
  if (query.includes("pay") || query.includes("payment") || query.includes("card") || query.includes("transfer") || query.includes("bank") || query.includes("paystack")) {
    return {
      text: `💳 We accept instant online payments via Paystack (Debit card, Bank Transfer, USSD) or direct showroom payments upon order confirmation.`,
      requiresAgentTransfer: false,
    };
  }

  // Product search matching
  const matchingProducts = PRODUCTS_DATA.filter((p) =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    (p.description && p.description.toLowerCase().includes(query))
  );

  if (matchingProducts.length > 0) {
    const product = matchingProducts[0];
    const priceStr = product.price ? `₦${product.price.toLocaleString()}` : "Contact for price";
    return {
      text: `We carry "${product.name}" (${product.category}) for ${priceStr}!\n\n${product.description || "High quality culinary equipment trusted by homes and caterers across Lagos."}`,
      requiresAgentTransfer: false,
    };
  }

  // Chafing dishes / Food warmers
  if (query.includes("chafer") || query.includes("chafing") || query.includes("warmer") || query.includes("buffet") || query.includes("food warmer")) {
    return {
      text: `✨ We specialize in luxury gold & stainless steel Chafing Dishes, Dubai Food Warmers, and 10L Buffet Warmers. They feature heat retention, glass view windows, and elegant handles for event caterers and homes.`,
      requiresAgentTransfer: false,
    };
  }

  // Cooking pots / Cookware
  if (query.includes("pot") || query.includes("cookware") || query.includes("pan") || query.includes("granite") || query.includes("non-stick")) {
    return {
      text: `🍳 Our premium Cooking Pots and Cookware Sets range from heavy-duty commercial stockpots to die-cast granite non-stick cookware sets designed for intense daily cooking.`,
      requiresAgentTransfer: false,
    };
  }

  // Default fallback when system cannot answer specific query
  return {
    text: `Thank you for your message! I want to make sure you get the most accurate answer regarding your specific inquiry. Would you like me to transfer this conversation to our sales agent on WhatsApp?`,
    requiresAgentTransfer: true,
    transferReason: "Specific inquiry beyond automated knowledge base",
  };
}

export async function sendMessageToAI(
  userMsg: string,
  history: ChatMessage[]
): Promise<{ text: string; requiresAgentTransfer: boolean; transferReason?: string }> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMsg,
        history: history.map((m) => ({ sender: m.sender, text: m.text })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data && typeof data.text === "string") {
      return {
        text: data.text,
        requiresAgentTransfer: !!data.requiresAgentTransfer,
        transferReason: data.transferReason || undefined,
      };
    }

    throw new Error("Invalid response schema from API");
  } catch (err) {
    console.warn("API route unreachable or error, utilizing intelligent client fallback:", err);
    return generateClientFallbackResponse(userMsg, history);
  }
}

export function generateWhatsAppTransferUrl(userMessage: string, assistantMessage?: string): string {
  const phoneNumber = "2348123221174"; // Rozay Kitchen official line
  
  let text = `Hello Rozay Kitchen Sales Team! 👋\n\nI was chatting with your AI assistant on your website and would like human agent support.`;
  
  if (userMessage) {
    text += `\n\n*My Question:* "${userMessage.trim()}"`;
  }
  if (assistantMessage) {
    text += `\n\n*AI Summary:* "${assistantMessage.trim().slice(0, 200)}..."`;
  }
  
  text += `\n\nPlease connect me with an agent to assist me. Thank you!`;

  return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;
}
