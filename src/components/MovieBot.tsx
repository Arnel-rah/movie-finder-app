import { useState, useRef, useEffect } from 'react';
import puter from '@heyputer/puter.js';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const MovieBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatLog, isLoading]);

  const askAI = async () => {
    if (!message.trim() || isLoading) return;

    const userInput = message.trim();
    setMessage('');
    setChatLog((prev) => [...prev, { role: 'user', content: userInput }]);
    setIsLoading(true);

    try {
      // Vérification de l'authentification Puter
      if (!puter.auth.isSignedIn()) {
        await puter.auth.signIn();
      }

      // Appel à l'IA avec gestion correcte de l'asynchronisme
      const response = await puter.ai.chat(
        `You are the official SaintStream AI assistant. 
         Your tone is professional, sleek, and movie-expert.
         Brand Identity: Dark theme with Green accents (#00925d).
         If the user asks for recommendations, suggest movies like "Avatar: Fire and Ash".`,
        userInput
      );

      // Extraction du texte depuis l'objet réponse
      const aiResponse = response.toString();

      setChatLog((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Puter Error:", error);
      setChatLog((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I'm having trouble connecting to the stream. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-100">
      {/* Bouton Flottant Vert SaintStream */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#00925d] p-4 rounded-full shadow-lg shadow-[#00925d]/40 text-white hover:scale-110 transition-all cursor-pointer"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Fenêtre de Chat */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[320px] md:w-95 h-125 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-[#00925d] rounded-full animate-pulse" />
              <span className="text-sm font-bold text-white tracking-wide">SaintStream AI</span>
            </div>
            <Bot size={18} className="text-gray-500" />
          </div>

          {/* Corps de la discussion */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {chatLog.length === 0 && (
              <div className="text-center mt-10">
                <p className="text-xs text-gray-500">How can I help you find a movie today?</p>
              </div>
            )}
            
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`text-sm p-3 rounded-2xl max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-white/10 ml-auto text-white rounded-tr-none'
                    : 'bg-[#00925d]/20 text-white border border-[#00925d]/20 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-[#00925d] text-xs font-medium animate-pulse">
                <span>AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Zone d'input */}
          <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-[#00925d] transition-colors"
              placeholder="Type your movie request..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askAI()}
            />
            <button
              onClick={askAI}
              disabled={isLoading}
              className="bg-[#00925d] p-2.5 rounded-xl text-white hover:bg-[#007a4d] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieBot;