import { useState, useRef, useEffect, memo } from "react";
import puter from "@heyputer/puter.js";
import { MessageCircle, X, Send, Bot, User, Sparkles, StopCircle, Trash2, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const ChatMessage = memo(({ msg, userAvatar }: { msg: Message; userAvatar: string | null }) => {
  const isTyping = msg.role === "assistant" && msg.content === "";

  return (
    <div className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center overflow-hidden ${msg.role === "user" ? "bg-white/10" : "bg-[#00925d]/20 text-[#00925d]"}`}>
        {msg.role === "assistant" ? <Bot size={16} /> : userAvatar ? <img src={userAvatar} className="h-full w-full object-cover" alt="User" /> : <User size={16} />}
      </div>
      <div className={`px-4 py-3 rounded-2xl text-sm max-w-[80%] ${msg.role === "user" ? "bg-[#00925d]/10 text-white rounded-tr-none" : "bg-white/5 text-gray-200 border border-white/5 rounded-tl-none"}`}>
        {isTyping ? (
          <div className="flex items-center gap-2 opacity-70 h-6">
            <div className="w-2 h-2 bg-[#00925d] rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-[#00925d] rounded-full animate-bounce delay-150" />
            <div className="w-2 h-2 bg-[#00925d] rounded-full animate-bounce delay-300" />
          </div>
        ) : (
          <div className="prose prose-invert prose-sm wrap-break-word">
            <ReactMarkdown
              components={{
                p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }: any) => <ul className="list-disc ml-4 my-2">{children}</ul>,
                li: ({ children }: any) => <li className="marker:text-[#00925d]">{children}</li>,
                strong: ({ children }: any) => <strong className="text-[#00925d] font-bold">{children}</strong>,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
});

const MovieBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const aborted = useRef(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved: any = await puter.kv.get("saintstream_chat_history");
        if (typeof saved === "string" && saved.length > 0) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setChatLog(parsed);
        }
      } catch (e) {}
    };
    if (isUserSignedIn) loadHistory();
  }, [isUserSignedIn]);

  useEffect(() => {
    if (isUserSignedIn && chatLog.length > 0) {
      puter.kv.set("saintstream_chat_history", JSON.stringify(chatLog)).catch(() => {});
    }
  }, [chatLog, isUserSignedIn]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const signedIn = await puter.auth.isSignedIn();
        setIsUserSignedIn(signedIn);
        if (signedIn) {
          const userData: any = await puter.auth.getUser();
          setUserAvatar(userData?.avatar_url || null);
        }
      } catch {
        setIsUserSignedIn(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatLog, isLoading]);

  const confirmClear = async () => {
    try {
      await puter.kv.del("saintstream_chat_history");
      setChatLog([]);
      setShowConfirm(false);
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const askAI = async () => {
    if (!message.trim() || isLoading) return;
    aborted.current = false;
    const userInput = message.trim();
    setMessage("");

    setChatLog((prev) => [...prev, { role: "user", content: userInput }, { role: "assistant", content: "" }]);
    setIsLoading(true);

    try {
      const response = await puter.ai.chat(
        [
          { role: "system", content: "You are SaintStream AI. Recommendations for movies/series. Concise. Bullet points. **Bold** titles." },
          ...chatLog.slice(-10),
          { role: "user", content: userInput },
        ],
        { stream: true, model: "gemini-2.0-flash-lite" }
      );

      let fullContent = "";
      for await (const part of response) {
        if (aborted.current) {
          fullContent += "\n\n*(Interrompu)*";
          break;
        }
        if (part?.text) {
          fullContent += part.text;
          setChatLog((prev) => {
            const newLog = [...prev];
            newLog[newLog.length - 1] = { ...newLog[newLog.length - 1], content: fullContent };
            return newLog;
          });
        }
      }
    } catch {
      setChatLog((prev) => {
        const newLog = [...prev];
        newLog[newLog.length - 1] = { role: "assistant", content: "Une erreur est survenue." };
        return newLog;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking || !isUserSignedIn) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-[#00925d] p-4 rounded-full shadow-lg text-white hover:scale-110 transition-all cursor-pointer">
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 h-137.5 bg-[#0f0f0f] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* MODALE DE CONFIRMATION INTERNE */}
          {showConfirm && (
            <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-300">
                <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold">Tout supprimer ?</h4>
                  <p className="text-xs text-gray-400 mt-1">Cette action est irréversible et effacera votre historique.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-xl transition-all cursor-pointer">
                    Annuler
                  </button>
                  <button onClick={confirmClear} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all cursor-pointer">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-[#00925d]/20 rounded-lg flex items-center justify-center text-[#00925d]"><Bot size={20} /></div>
              <h3 className="text-sm font-bold text-white">SaintStream AI</h3>
            </div>
            <div className="flex items-center gap-1">
              {chatLog.length > 0 && (
                <button onClick={() => setShowConfirm(true)} className="p-2 text-gray-500 hover:text-red-400 transition-all cursor-pointer">
                  <Trash2 size={18} />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-white transition-all cursor-pointer"><X size={18} /></button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
            {chatLog.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-400">
                <Sparkles size={32} className="text-[#00925d]" />
                <p className="text-sm px-8">Quelle série cherchez-vous ?</p>
              </div>
            )}
            {chatLog.map((msg, i) => (
              <ChatMessage key={i} msg={msg} userAvatar={userAvatar} />
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-white/2">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                disabled={isLoading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-sm text-white outline-none focus:border-[#00925d]/50 transition-all placeholder:text-gray-600"
                placeholder="Votre message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askAI()}
              />
              <button onClick={isLoading ? () => (aborted.current = true) : askAI} className="absolute right-2 p-2 text-[#00925d] hover:text-white transition-all disabled:opacity-30 cursor-pointer">
                {isLoading ? <StopCircle size={18} /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieBot;