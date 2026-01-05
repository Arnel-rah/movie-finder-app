import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const MovieBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<{role: string, content: string}[]>([]);

  const askAI = async () => {
    if (!message.trim()) return;
    
    const userMsg = { role: 'user', content: message };
    setChatLog([...chatLog, userMsg]);
    setMessage('');

    // Utilisation de Puter.js pour l'IA (Gratuit & Serverless)
    // @ts-ignore (Puter est chargé via script ou npm)
    const response = await puter.ai.chat(
      `You are the SaintStream assistant. Help the user find a movie. 
       Keep it sleek and cool. Use the brand color Green (#00925d).`,
      message
    );

    setChatLog(prev => [...prev, { role: 'assistant', content: response.toString() }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#00925d] p-4 rounded-full shadow-lg shadow-[#00925d]/30 text-white hover:scale-110 transition-all cursor-pointer"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
            <div className="h-2 w-2 bg-[#00925d] rounded-full animate-pulse" />
            <span className="text-sm font-bold text-white">SaintStream AI</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatLog.length === 0 && (
              <p className="text-xs text-gray-500 text-center mt-10">
                Ask me anything! "Suggest an action movie like Avatar"
              </p>
            )}
            {chatLog.map((msg, i) => (
              <div key={i} className={`text-xs p-3 rounded-xl max-w-[80%] ${
                msg.role === 'user' ? 'bg-white/10 ml-auto text-white' : 'bg-[#00925d]/20 text-white'
              }`}>
                {msg.content}
              </div>
            ))}
          </div>

          <div className="p-3 bg-white/5 flex gap-2">
            <input 
              className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#00925d]/50"
              placeholder="Type your request..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askAI()}
            />
            <button onClick={askAI} className="bg-[#00925d] p-2 rounded-lg text-white cursor-pointer">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieBot;