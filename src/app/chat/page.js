"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getMessages, sendMessage } from "@/actions/chat";
import { ArrowLeft, Send, User, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function LightChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const scrollRef = useRef(null);

  const fetchMessages = async () => {
    const data = await getMessages(50);
    if (!data.error) {
      setMessages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // 5s polling
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleBack = () => {
    setIsNavigating(true);
    router.push("/dashboard");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    const tempInput = input;
    setInput("");
    
    const res = await sendMessage(tempInput);
    if (res.error) {
      alert(res.error);
      setInput(tempInput);
    } else {
      await fetchMessages();
    }
    setSending(false);
  };

  if (!session) return null;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground transition-colors">
      {/* Simple Navigation Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-gold-dynamic" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dynamic">Loading...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-surface/80 border-b border-surface-border sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-surface-border/10 transition-all text-gold-dynamic"
            disabled={isNavigating}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-sm tracking-tight uppercase">Constituency Chat</h1>
            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">TVK Orathanadu</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">Live</span>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 0 ? "items-end" : "items-start"} animate-pulse`}>
                <div className="w-20 h-2 bg-surface-border/10 rounded mb-2" />
                <div className={`h-10 ${i % 2 === 0 ? "w-48" : "w-64"} bg-surface-border/10 rounded-2xl`} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted/50">
            <User size={48} className="mb-2 opacity-10" />
            <p className="text-xs uppercase font-bold tracking-widest">No messages yet</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderEmail === session.user.email;
            return (
              <div 
                key={msg._id} 
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!isMe && (
                    <span className="text-[10px] font-bold text-gold-dynamic uppercase tracking-tighter">
                      {msg.senderName}
                    </span>
                  )}
                  <span className="text-[8px] text-text-muted/50 font-black">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-lg transition-all ${
                  isMe 
                    ? "bg-maroon text-white rounded-tr-none border border-maroon-dark" 
                    : "bg-surface border border-surface-border text-foreground rounded-tl-none backdrop-blur-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-surface border-t border-surface-border relative">
        {sending && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#800000] rounded-full flex items-center gap-2 shadow-lg animate-bounce">
            <Loader2 size={10} className="animate-spin text-gold-dynamic" />
            <span className="text-[8px] font-black uppercase tracking-widest text-gold-dynamic">Sending...</span>
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-background border border-surface-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-maroon/30 transition-all placeholder:text-text-muted/50 disabled:opacity-50"
            disabled={sending || isNavigating}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending || isNavigating}
            className="w-10 h-10 rounded-full bg-[#800000] flex items-center justify-center text-gold-dynamic disabled:opacity-50 disabled:grayscale transition-all shadow-[0_0_15px_rgba(128,0,0,0.3)] active:scale-95"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
