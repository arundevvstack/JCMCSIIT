"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, MessageSquare, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call when backend is connected)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAutoResponse(userMessage.content),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-3xl flex flex-col overflow-hidden z-50 border border-slate-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
          >
            {/* Header */}
            <div className="bg-white border-b border-slate-100 p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">JCMCSIIT Intelligence</h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Always Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-900 hover:bg-slate-50 p-1.5 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50">
              {messages.length === 0 && (
                <div className="text-center text-slate-400 text-sm mt-12">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="font-medium text-slate-600 mb-1">How can I help you today?</p>
                  <p className="text-xs">Ask me about admissions, courses, or campus life.</p>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="h-6 w-6 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mr-3 mt-1">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed ${
                      m.role === "user"
                        ? "bg-slate-100 text-slate-900 rounded-2xl rounded-tr-sm font-medium"
                        : "bg-transparent text-slate-700"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-center">
                  <div className="h-6 w-6 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mr-3">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex gap-1 items-center px-4 py-3">
                    <span className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message JCMCSIIT Intelligence..."
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-1.5 h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center text-white disabled:opacity-50 transition-opacity hover:bg-slate-800"
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center z-50 hover:bg-slate-800 transition-colors shadow-slate-900/20 border border-slate-800"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </motion.button>
    </>
  );
}

function getAutoResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("admission") || q.includes("apply")) {
    return "Admissions for 2026 are now open! You can apply through KEAM counseling or management quota. Visit our Admissions page for complete details and eligibility criteria.";
  }
  if (q.includes("placement") || q.includes("job") || q.includes("salary")) {
    return "Our placement rate is 98.5% with the highest package of 45 LPA. Top recruiters include Microsoft, Amazon, TCS, and Infosys. Visit the Placements page for detailed statistics.";
  }
  if (q.includes("course") || q.includes("department") || q.includes("branch")) {
    return "We offer 7 B.Tech programs: AI & ML, Computer Science, Biomedical Engineering, Electronics & Communication, Electrical Engineering, Mechanical Engineering, and Civil Engineering.";
  }
  if (q.includes("fee") || q.includes("cost") || q.includes("tuition")) {
    return "For accurate and up-to-date fee information, please contact our admissions office at +91 9496981555 or email admissions@jcmcsiit.ac.in. Fee structures vary by program and quota.";
  }
  if (q.includes("hostel") || q.includes("accommodation")) {
    return "We have separate hostels for boys and girls with Wi-Fi, mess facilities, and 24/7 security. Admission is on a first-come, first-served basis.";
  }
  return "Thank you for your question! For detailed information, please visit the relevant section on our website or contact us at +91 9496981555. I can help with admissions, courses, placements, and campus facilities.";
}
