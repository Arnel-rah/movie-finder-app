import { useState, useRef, useEffect, memo } from "react";
import puter from "@heyputer/puter.js";
import { MessageCircle, X, Send, Bot, User, Sparkles, StopCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const ChatMessage = memo(({ msg, userAvatar }: { msg: Message; userAvatar: string | null }) => {
  const isTyping = msg.role === "assistant" && msg.content === "";

  return (
    <div className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center overflow-hidden ${
          msg.role === "user" ? "bg-white/10" : "bg-[#00925d]/20 text-[#00925d]"
        }`}
      >
        {msg.role === "assistant" ? (
          <Bot size={16} />
        ) : userAvatar ? (
          <img src={userAvatar} className="h-full w-full object-cover" alt="User" />
        ) : (
          <User size={16} />
        )}
      </div>

      <div
        className={`px-4 py-3 rounded-2xl text-sm max-w-[80%] ${
          msg.role === "user"
            ? "bg-[#00925d]/10 text-white rounded-tr-none"
            : "bg-white/5 text-gray-200 border border-white/5 rounded-tl-none"
        }`}
      >
        {isTyping ? (
          <div className="flex items-center gap-2 opacity-70 h-6">
            <div className="w-2 h-2 bg-[#00925d] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-[#00925d] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-[#00925d] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setChatLog(parsed);
            }
          } catch {}
        }
      } catch {}
    };

    if (isUserSignedIn) {
      loadHistory();
    }
  }, [isUserSignedIn]);

  useEffect(() => {
    if (chatLog.length > 0 && isUserSignedIn) {
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
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
    if (isNearBottom) {
      scrollRef.current.scrollTo({ top: scrollHeight, behavior: "smooth" });
    }
  }, [chatLog]);

  if (isChecking || !isUserSignedIn) return null;

  const handleStop = () => {
    aborted.current = true;
    setIsLoading(false);
  };

  const askAI = async () => {
    if (!message.trim() || isLoading) return;

    aborted.current = false;

    const userInput = message.trim();
    setMessage("");

    setChatLog((prev) => [
      ...prev,
      { role: "user" as const, content: userInput },
      { role: "assistant" as const, content: "" },
    ]);

    setIsLoading(true);

    try {
      const recentHistory = chatLog.slice(-20);

      const apiMessages = [
        {
          role: "system" as const,
          content:
            "You are SaintStream AI, a fast and friendly assistant specialized in movie and series recommendations. " +
            "Always respond concisely and quickly. Use bullet points for lists. Use **bold** for titles. " +
            "Keep answers short and engaging – max 300-400 words.",
        },
        ...recentHistory,
        { role: "user" as const, content: userInput },
      ];

      const response = await puter.ai.chat(apiMessages, {
        stream: true,
        model: "gemini-2.5-flash-lite",
        max_tokens: 400,
        temperature: 0.7,
      });

      let fullContent = "";
      for await (const part of response) {
        if (aborted.current) {
          fullContent += "\n\n*(Réponse interrompue par l'utilisateur)*";
          setChatLog((prev) => {
            const newLog = [...prev];
            newLog[newLog.length - 1] = { ...newLog[newLog.length - 1], content: fullContent };
            return newLog;
          });
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
        newLog[newLog.length - 1] = {
          ...newLog[newLog.length - 1],
          content: "Désolé, une erreur est survenue. Réessayez.",
        };
        return newLog;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-[#00925d] p-4 rounded-full shadow-lg text-white hover:scale-110 transition-all cursor-pointer"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 h-137.5 bg-[#0f0f0f] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-5 bg-linear-to-r from-[#00925d]/20 to-transparent border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-[#00925d]/20 rounded-xl flex items-center justify-center text-[#00925d]">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none">SaintStream AI</h3>
                <span className="text-[10px] text-[#00925d] uppercase tracking-widest">Assistant</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
            {chatLog.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-400">
                <Sparkles size={32} className="text-[#00925d]" />
                <p className="text-sm px-8">Prêt à trouver votre prochain film ou série ?</p>
              </div>
            )}

            {chatLog.map((msg, i) => (
              <ChatMessage key={i} msg={msg} userAvatar={userAvatar} />
            ))}
          </div>

          <div className="p-4 border-t border-white/5 bg-white/2">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                disabled={isLoading}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-sm text-white outline-none focus:border-[#00925d]/50 transition-all placeholder:text-gray-500 disabled:opacity-50"
                placeholder="Posez une question sur un film ou série..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && askAI()}
              />
              <button
                onClick={isLoading ? handleStop : askAI}
                disabled={!message.trim() && !isLoading}
                className="absolute right-2 p-2 text-[#00925d] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
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