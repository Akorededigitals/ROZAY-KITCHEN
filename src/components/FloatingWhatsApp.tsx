import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, X, Bot, User, ArrowUpRight, RefreshCw, MessageSquare, ShieldCheck, HelpCircle } from "lucide-react";
import { BRAND_INFO } from "../data";
import { ChatMessage, sendMessageToAI, generateWhatsAppTransferUrl } from "../lib/chatService";

const QUICK_SUGGESTIONS = [
  "What chafing dishes do you have?",
  "Where is your showroom located?",
  "Do you deliver across Nigeria?",
  "I need a wholesale discount quote",
  "Connect me to a human agent"
];

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: "Hello! Welcome to Rozay Kitchen. I am your AI assistant. Ask me anything about our luxury chafing dishes, cookware, prices, or Lagos showroom location.\n\nIf I'm unable to answer your question, I will offer to transfer your conversation to our human agent on WhatsApp!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const result = await sendMessageToAI(text, messages);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        requiresAgentTransfer: result.requiresAgentTransfer,
        transferReason: result.transferReason,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Error sending message:", err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "assistant",
        text: "I wasn't able to process your message right now, but our human sales team is ready to assist you on WhatsApp!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        requiresAgentTransfer: true,
        transferReason: "Processing fallback",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleTransferToWhatsApp = (userText?: string, assistantText?: string) => {
    const lastUserMsg = userText || [...messages].reverse().find((m) => m.sender === "user")?.text || "General Inquiry";
    const lastAiMsg = assistantText || [...messages].reverse().find((m) => m.sender === "assistant")?.text || "";
    
    const url = generateWhatsAppTransferUrl(lastUserMsg, lastAiMsg);
    window.open(url, "_blank");
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "assistant",
        text: "Chat cleared! How can I help you today? Ask about our cookware, delivery, or transfer to a sales agent on WhatsApp.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex flex-col items-end">
      
      {/* Help popover teaser bubble */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="mb-3 mr-1 bg-stone-900 text-white rounded-2xl p-3.5 shadow-2xl border border-stone-800 max-w-xs text-xs relative flex flex-col gap-1.5"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              <span>Ask AI or WhatsApp Agent</span>
            </div>
            <p className="text-stone-200 leading-normal font-medium text-[11px]">
              Have questions about cookware or wholesale prices? Chat with our AI or connect to an agent on WhatsApp!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Slideout AI Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="mb-4 bg-white rounded-3xl shadow-2xl border border-stone-200 w-[92vw] sm:w-96 max-h-[85vh] flex flex-col overflow-hidden text-gray-900"
          >
            {/* Header */}
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-stone-900 rounded-full" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm tracking-wide text-white flex items-center gap-1.5">
                    Rozay AI Assistant
                  </h4>
                  <p className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Instant Support & WhatsApp Transfer
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Clear conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Always Available Top Banner to Transfer to WhatsApp */}
            <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-emerald-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Need a human sales agent?
              </span>
              <button
                onClick={() => handleTransferToWhatsApp()}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>WhatsApp Transfer</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="p-4 bg-stone-50 overflow-y-auto flex-1 space-y-3.5 min-h-[280px] max-h-[380px] text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1 text-[10px] text-stone-400 font-mono px-1">
                    {msg.sender === "user" ? (
                      <>
                        <span>You</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 text-emerald-600" />
                        <span className="font-bold text-stone-600">Rozay AI</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-xs whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-tr-xs"
                        : "bg-white text-stone-800 border border-stone-200 rounded-tl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Fallback / Transfer to Agent Trigger Card */}
                  {msg.requiresAgentTransfer && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-[90%] text-emerald-950 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-900">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Transfer to Human Agent</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-normal">
                        Our sales team is ready on WhatsApp to assist you directly with custom quotes, orders, or detailed inquiries.
                      </p>
                      <button
                        onClick={() => handleTransferToWhatsApp(messages.find(m => m.id === msg.id.replace("ai-", "user-"))?.text, msg.text)}
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.261 2.266 3.504 5.277 3.505 8.483-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.19 1.449 4.825 1.451 5.436 0 9.859-4.417 9.863-9.848.002-2.63-1.023-5.101-2.885-6.963C16.58 1.93 14.113.87 11.487.87 6.05 1.87 1.628 6.287 1.624 11.717c-.001 1.693.45 3.345 1.306 4.787L1.925 21.05l4.722-1.238zm11.373-7.513c-.3-.15-1.771-.875-2.046-.975-.276-.1-.476-.15-.675.15-.199.3-.773.975-.948 1.176-.176.2-.351.225-.651.075-.3-.15-1.267-.467-2.413-1.49-1.202-1.07-1.41-1.611-1.558-1.91-.148-.3-.016-.462.133-.612.135-.135.3-.349.45-.524.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.115 3.23 5.125 4.532.715.31 1.273.495 1.708.634.718.228 1.371.196 1.888.118.575-.088 1.771-.725 2.021-1.425.25-.7.25-1.3 1.75-.425zm0 0" />
                        </svg>
                        <span>Chat on WhatsApp Now</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-stone-500 text-[11px] p-2 font-mono">
                  <Bot className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                  <span>Rozay AI is typing...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-2 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
              {QUICK_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 rounded-full whitespace-nowrap border border-stone-200 transition-colors cursor-pointer shrink-0 font-medium"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Footer Form */}
            <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask AI or type message..."
                disabled={isLoading}
                className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-stone-900"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 bg-stone-900 hover:bg-stone-950 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleTransferToWhatsApp(inputMessage)}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all cursor-pointer shrink-0"
                title="Direct WhatsApp Transfer"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.261 2.266 3.504 5.277 3.505 8.483-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.19 1.449 4.825 1.451 5.436 0 9.859-4.417 9.863-9.848.002-2.63-1.023-5.101-2.885-6.963C16.58 1.93 14.113.87 11.487.87 6.05 1.87 1.628 6.287 1.624 11.717c-.001 1.693.45 3.345 1.306 4.787L1.925 21.05l4.722-1.238zm11.373-7.513c-.3-.15-1.771-.875-2.046-.975-.276-.1-.476-.15-.675.15-.199.3-.773.975-.948 1.176-.176.2-.351.225-.651.075-.3-.15-1.267-.467-2.413-1.49-1.202-1.07-1.41-1.611-1.558-1.91-.148-.3-.016-.462.133-.612.135-.135.3-.349.45-.524.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.115 3.23 5.125 4.532.715.31 1.273.495 1.708.634.718.228 1.371.196 1.888.118.575-.088 1.771-.725 2.021-1.425.25-.7.25-1.3 1.75-.425zm0 0" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl shadow-emerald-500/35 transition-all cursor-pointer relative z-50 group"
        title="Chat with Rozay AI or Sales Agent"
      >
        <span className="sr-only">Support Chat</span>
        {isOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <div className="relative flex items-center justify-center">
            <svg
              className="w-7 h-7 fill-white transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.261 2.266 3.504 5.277 3.505 8.483-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.19 1.449 4.825 1.451 5.436 0 9.859-4.417 9.863-9.848.002-2.63-1.023-5.101-2.885-6.963C16.58 1.93 14.113.87 11.487.87 6.05 1.87 1.628 6.287 1.624 11.717c-.001 1.693.45 3.345 1.306 4.787L1.925 21.05l4.722-1.238zm11.373-7.513c-.3-.15-1.771-.875-2.046-.975-.276-.1-.476-.15-.675.15-.199.3-.773.975-.948 1.176-.176.2-.351.225-.651.075-.3-.15-1.267-.467-2.413-1.49-1.202-1.07-1.41-1.611-1.558-1.91-.148-.3-.016-.462.133-.612.135-.135.3-.349.45-.524.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.493-.51-.675-.52-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 375-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.115 3.23 5.125 4.532.715.31 1.273.495 1.708.634.718.228 1.371.196 1.888.118.575-.088 1.771-.725 2.021-1.425.25-.7.25-1.3 1.75-.425zm0 0" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-emerald-500 rounded-full animate-ping" />
          </div>
        )}
      </motion.button>

    </div>
  );
}
