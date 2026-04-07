import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, Plus } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message { id: string; role: 'user' | 'expert'; text: string; }

interface Props {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: (val: string) => void;
  isTyping: boolean;
  setIsTyping: (val: boolean) => void;
}

const ExpertChatModal: React.FC<Props> = ({
  isOpen, onClose, messages, setMessages, input, setInput, isTyping, setIsTyping,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio context failed', e);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    const userMsgId = Math.random().toString(36).substring(2, 11);
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction:
            'You are a professional Indian wedding expert and planner for the Vivaha app. Your goal is to help couples plan their dream wedding. Be helpful, enthusiastic, and knowledgeable about Indian traditions, venues (especially Udaipur), budgets, and vendor categories. Keep responses concise but informative. Use bullet points for lists. Always encourage the user to explore vendors on the app.',
        },
      });
      const expertMsgId = Math.random().toString(36).substring(2, 11);
      setMessages(prev => [
        ...prev,
        { id: expertMsgId, role: 'expert', text: response.text || "I'm sorry, I couldn't process that. How else can I help?" },
      ]);
      playNotificationSound();
    } catch {
      const errorId = Math.random().toString(36).substring(2, 11);
      setMessages(prev => [
        ...prev,
        { id: errorId, role: 'expert', text: "I'm having trouble connecting to my wedding database. Please try again in a moment!" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-end sm:items-center justify-center p-0 sm:p-6"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-ivory w-full max-w-md h-[85vh] sm:h-[600px] rounded-t-[40px] sm:rounded-[40px] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 bg-rose text-ivory flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm md:text-base truncate">Chat with Wedding Expert</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-70">Online now</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Plus className="rotate-45" size={24} />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-ivory">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-rose text-ivory rounded-tr-none'
                        : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-rose/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-rose/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 bg-rose/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:border-rose/30 transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className="w-12 h-12 rounded-2xl bg-rose text-ivory flex items-center justify-center shadow-lg shadow-rose/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExpertChatModal;
