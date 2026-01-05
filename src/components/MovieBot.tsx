import { useState, useRef, useEffect } from "react";
import puter from "@heyputer/puter.js";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

const MovieBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true); // État pour éviter le flash du bouton
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const signedIn = await puter.auth.isSignedIn();
        setIsUserSignedIn(signedIn);
      } catch (err) {
        setIsUserSignedIn(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatLog, isLoading]);

  if (isChecking || !isUserSignedIn) return null;

  const toggleChat = async () => {
    const signedIn = await puter.auth.isSignedIn();
    if (!signedIn) {
      setIsUserSignedIn(false);
      setIsOpen(false);
      return;
    }
    setIsOpen(!isOpen);
  };

  const askAI = async () => {
    if (!message.trim() || isLoading) return;

    const userInput = message.trim();
    setMessage("");
    setChatLog((prev) => [...prev, { role: "user", content: userInput }]);
    setIsLoading(true);

    try {
      const response = await puter.ai.chat([
        {
          role: "system",
          content: "You are the official SaintStream AI assistant. Be helpful, concise and use a premium cinematic tone. Brand color: #00925d.",
        },
        { role: "user", content: userInput },
      ]);
      
      const aiResponse = response.toString();
      setChatLog((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      console.error("Puter Error:", error);
      setChatLog((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting to the stream. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-100 font-sans">
      <button
        onClick={toggleChat}
        className="relative bg-[#00925d] p-4 rounded-full shadow-[0_0_20px_rgba(0,146,93,0.4)] text-white hover:scale-110 active:scale-95 transition-all cursor-pointer group"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && <span className="absolute top-0 right-0 h-3 w-3 bg-white rounded-full border-2 border-[#00925d] animate-ping" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-87.5 md:w-100 h-137.5 bg-[#0f0f0f] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Premium */}
          <div className="p-5 bg-linear-to-r from-[#00925d]/20 to-transparent border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 bg-[#00925d]/20 rounded-xl flex items-center justify-center text-[#00925d]">
                  <Bot size={22} />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#00925d] rounded-full border-2 border-[#0f0f0f]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none">SaintStream AI</h3>
                <span className="text-[10px] text-[#00925d] font-medium uppercase tracking-wider">Online Assistant</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Chat Zone */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth">
            {chatLog.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="p-4 bg-white/5 rounded-full text-[#00925d]">
                  <Sparkles size={32} />
                </div>
                <p className="text-sm text-gray-400 px-8">
                  Welcome back! I can help you find the perfect movie or explain our features.
                </p>
              </div>
            )}

            {chatLog.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center ${
                  msg.role === "user" ? "bg-white/10 text-gray-300" : "bg-[#00925d]/20 text-[#00925d]"
                }`}>
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-white/10 text-white rounded-tr-none" 
                    : "bg-white/3 text-gray-200 border border-white/5 rounded-tl-none"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-lg bg-[#00925d]/10 flex items-center justify-center text-[#00925d]">
                  <Bot size={16} />
                </div>
                <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 bg-[#00925d] rounded-full animate-bounce" />
                    <div className="h-1.5 w-1.5 bg-[#00925d] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="h-1.5 w-1.5 bg-[#00925d] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/2 border-t border-white/5">
            <div className="relative flex items-center">
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#00925d]/50 focus:ring-1 focus:ring-[#00925d]/50 transition-all"
                placeholder="Ask me anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askAI()}
              />
              <button
                onClick={askAI}
                disabled={isLoading}
                className="absolute right-2 p-2 text-[#00925d] hover:bg-[#00925d] hover:text-white rounded-xl transition-all disabled:opacity-30 cursor-pointer"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[9px] text-gray-600 text-center mt-3 uppercase tracking-widest">
              Powered by SaintStream Intelligence
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieBot;