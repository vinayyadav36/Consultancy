import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, Volume2, VolumeX, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  'What marketing plans do you offer?',
  'How can you help grow my business?',
  'What is your pricing?',
  'How do I get started?',
];

// Fallback responses when API is unavailable
const FALLBACK_RESPONSES: Record<string, string> = {
  default: 'Namaste! 🙏 I am Nandi, your divine marketing guide. I am here to help you discover the sacred path to business growth. How may I serve you today?',
  pricing: 'Our sacred marketing plans start from ₹15,000/month. We offer Digital Growth, Brand Identity, Social Media, and Analytics Pro plans. Each is tailored to your divine business journey. Would you like to explore our checkout page for detailed pricing?',
  grow: 'Through the cosmic power of digital marketing, we can help you achieve 3× organic traffic growth, 40% better conversions, and measurable ROI within 6 months. Shall we begin your journey?',
  start: 'Starting is simple! Visit our Checkout page to select your sacred plan, or contact us directly. Our team will guide you through every step of your divine marketing journey.',
  plan: 'We offer four sacred plans: 1) Digital Growth - SEO & paid search, 2) Brand Identity - visual framework, 3) Social Media - community growth, 4) Analytics Pro - data insights. Each plan is blessed for business transformation.',
};

function getFallbackResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes('price') || msg.includes('cost') || msg.includes('fee') || msg.includes('₹') || msg.includes('rupee')) {
    return FALLBACK_RESPONSES.pricing;
  }
  if (msg.includes('grow') || msg.includes('help') || msg.includes('result')) {
    return FALLBACK_RESPONSES.grow;
  }
  if (msg.includes('start') || msg.includes('begin') || msg.includes('how')) {
    return FALLBACK_RESPONSES.start;
  }
  if (msg.includes('plan') || msg.includes('service') || msg.includes('offer')) {
    return FALLBACK_RESPONSES.plan;
  }
  return FALLBACK_RESPONSES.default;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
  // Web Speech API types
  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
    readonly resultIndex: number;
  }
  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }
  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Namaste! 🙏 I am Nandi, your divine marketing guide. Ask me anything about our sacred marketing services, pricing, or how we can help your business ascend to new heights. ॐ नमः शिवाय',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<InstanceType<typeof window.SpeechRecognition> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const speak = useCallback((text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 200));
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_BASE;
      let responseText: string;

      if (apiBase) {
        const res = await fetch(`${apiBase}/api/ai/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: content.trim(), sessionId }),
        });
        if (res.ok) {
          const data = await res.json() as { response: string };
          responseText = data.response;
        } else {
          responseText = getFallbackResponse(content);
        }
      } else {
        // No backend configured — use local fallback
        await new Promise((r) => setTimeout(r, 800));
        responseText = getFallbackResponse(content);
      }

      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speak(responseText);
    } catch {
      const errMsg: Message = {
        id: `e_${Date.now()}`,
        role: 'assistant',
        content: getFallbackResponse(content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId, speak]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please try Chrome.');
      return;
    }

    const recognition = new SpeechRecognition() as InstanceType<typeof window.SpeechRecognition>;
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      void sendMessage(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [sendMessage]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleTts = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
    setTtsEnabled((v) => !v);
  }, [isSpeaking]);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        style={{
          background: 'linear-gradient(135deg, #312e81, #1e1b4b)',
          border: '2px solid rgba(34,211,238,0.5)',
          boxShadow: '0 0 20px rgba(34,211,238,0.3)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ['0 0 10px rgba(34,211,238,0.3)', '0 0 25px rgba(34,211,238,0.6)', '0 0 10px rgba(34,211,238,0.3)'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="Open AI chat assistant"
      >
        <MessageCircle className="h-6 w-6 text-cyan-400" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden flex flex-col"
            style={{
              height: '520px',
              background: 'linear-gradient(135deg, #131328 0%, #0a0a14 100%)',
              border: '1px solid rgba(49,46,129,0.6)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(34,211,238,0.1)',
            }}
            role="dialog"
            aria-label="Nandi AI Chat Assistant"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ background: 'rgba(30,27,75,0.8)', borderBottom: '1px solid rgba(34,211,238,0.2)' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                    style={{ background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.4)' }}>
                    🐂
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#131328]" />
                </div>
                <div>
                  <div className="font-semibold text-cyan-400 text-sm">Nandi AI</div>
                  <div className="text-xs text-gray-500">
                    {isLoading ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Online'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTts}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  title={ttsEnabled ? 'Disable voice' : 'Enable voice'}
                  aria-label={ttsEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
                >
                  {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-tr-sm text-white'
                        : 'rounded-tl-sm text-gray-200'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #312e81, #1e1b4b)', border: '1px solid rgba(34,211,238,0.3)' }
                        : { background: 'rgba(30,27,75,0.6)', border: '1px solid rgba(49,46,129,0.4)' }
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm px-4 py-2.5" style={{ background: 'rgba(30,27,75,0.6)', border: '1px solid rgba(49,46,129,0.4)' }}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-2 h-2 rounded-full bg-cyan-400"
                          animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => void sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                    style={{ border: '1px solid rgba(34,211,238,0.3)' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(49,46,129,0.4)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Nandi anything..."
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                disabled={isLoading}
                maxLength={500}
                aria-label="Message input"
              />
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                  isListening ? 'text-red-400 bg-red-400/10' : 'text-gray-400 hover:text-cyan-400'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-lg bg-cyan-400 text-[#0a0a14] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
