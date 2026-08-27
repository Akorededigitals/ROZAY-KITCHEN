import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check endpoint for Truehost, cPanel, and uptime monitoring
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Rozay Kitchen",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// API Endpoint for AI Assistant Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        text: "I am Rozay Kitchen's virtual assistant. To get instant personalized support, custom wholesale pricing, or direct answers, I can connect you with an agent on WhatsApp!",
        requiresAgentTransfer: true,
        transferReason: "Agent consultation recommended"
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are the friendly, helpful AI Assistant for "Rozay Kitchen", a premier kitchenware, cookware, and catering equipment merchant in Lagos, Nigeria.
Company Profile:
- Name: Rozay Kitchen
- Showroom Address: Idumota, Block N, shop 89,90,91,92 New Pepsi Building, Merciful line, Ebute-ero Market Gorodom, Lagos Island, Lagos.
- Phone/WhatsApp: +234 812 322 1174
- Products: Luxury gold & stainless steel chafing dishes, Dubai food warmers, 2in1 carp jugs, breakable dish sets, cookware sets, coolers, catering tools, kitchen electronics.
- Operating Hours: Monday - Saturday 8:00 AM - 6:00 PM (Closed Sundays).
- Delivery: Same-day or next-day delivery in Lagos; interstate shipping across Nigeria.
- Payment: Paystack online payments, direct bank transfer, or showroom pickup.

Your Guidelines:
1. Provide concise, warm, helpful, and professional answers.
2. If the user's inquiry requires custom negotiations (e.g. wholesale price discounts), complex order modifications, dispute resolution, custom catering box branding, or explicitly asks for a human/agent/WhatsApp:
   - Provide what helpful information you can.
   - Mention that a human sales agent on WhatsApp can assist them further.
   - Include the marker "[AGENT_TRANSFER_REQUIRED]" on its own line at the end of your response.
3. Keep answers under 150 words whenever possible.`;

    let promptLines = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-6)) {
        promptLines.push(`${h.sender === "user" ? "User" : "Assistant"}: ${h.text}`);
      }
    }
    promptLines.push(`User: ${message}`);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptLines.join("\n"),
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseText = response.text || "";
    const lowerMessage = message.toLowerCase();
    const needsTransferByKeyword = lowerMessage.includes("whatsapp") ||
      lowerMessage.includes("human") ||
      lowerMessage.includes("agent") ||
      lowerMessage.includes("discount") ||
      lowerMessage.includes("wholesale price") ||
      lowerMessage.includes("custom order") ||
      lowerMessage.includes("speak to someone") ||
      lowerMessage.includes("call me");

    const hasTag = responseText.includes("[AGENT_TRANSFER_REQUIRED]");
    const requiresAgentTransfer = hasTag || needsTransferByKeyword;

    const cleanText = responseText.replace("[AGENT_TRANSFER_REQUIRED]", "").trim();

    res.json({
      text: cleanText,
      requiresAgentTransfer,
      transferReason: requiresAgentTransfer ? "Human Agent Transfer Offered" : null,
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.json({
      text: "I wasn't able to process your question directly, but our sales team is ready on WhatsApp to assist you!",
      requiresAgentTransfer: true,
      transferReason: "Automated response fallback",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
