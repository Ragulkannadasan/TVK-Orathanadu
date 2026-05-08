"use client";

import { useState, useEffect, useRef } from "react";
import { sendMessage } from "@/actions/chat";
import { Send, User as UserIcon, Shield, Star, Crown } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ChatView({ initialMessages }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Real-time updates via SSE (Server-Sent Events)
  useEffect(() => {
    let eventSource;

    const setupSSE = () => {
      if (document.visibilityState !== 'visible') return;
      
      if (eventSource) eventSource.close();
      
      eventSource = new EventSource('/api/chat/stream');
      
      eventSource.onmessage = (event) => {
        // When a new message arrives via SSE, refresh the list
        // We fetch the full list to ensure we have populated user data and correct order
        fetchLatest();
      };

      eventSource.onerror = (err) => {
        console.error("SSE Error:", err);
        eventSource.close();
      };
    };

    const fetchLatest = async () => {
      try {
        const response = await fetch('/api/chat/messages');
        if (response.ok) {
          const latest = await response.json();
          setMessages(prev => {
            if (latest.length > 0 && prev.length > 0) {
              const latestId = latest[latest.length - 1]._id;
              const prevId = prev[prev.length - 1]._id;
              if (latestId === prevId) return prev;
            }
            return latest;
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    // Initial setup
    setupSSE();
    const interval = setInterval(fetchLatest, 60000); // Slow fallback poll

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchLatest();
        setupSSE();
      } else {
        if (eventSource) eventSource.close();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const text = inputText.trim();
    setInputText("");
    setIsSending(true);

    // Optimistic update
    const tempId = Date.now().toString();
    const optimisticMessage = {
      _id: tempId,
      text,
      createdAt: new Date().toISOString(),
      userId: {
        name: session?.user?.name,
        username: session?.user?.email?.split('@')[0],
        role: session?.user?.role,
        image: session?.user?.image,
        email: session?.user?.email
      },
      isOptimistic: true
    };

    setMessages(prev => [...prev, optimisticMessage]);

    const res = await sendMessage(text);
    if (res.error) {
      alert(res.error);
      setMessages(prev => prev.filter(m => m._id !== tempId));
    } else {
      // Refresh messages using GET API
      try {
        const response = await fetch('/api/chat/messages');
        if (response.ok) {
          const latest = await response.json();
          setMessages(latest);
        }
      } catch (err) {
        console.error("Refresh error:", err);
      }
    }
    setIsSending(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin": return <Crown size={12} className="text-red-500" />;
      case "MLA": return <Crown size={12} className="text-purple-500" />;
      case "Poruppalar": return <Shield size={12} className="text-[#FFD700]" />;
      case "DistSecretary": return <Star size={12} className="text-blue-500" />;
      default: return null;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin": return "text-red-500";
      case "MLA": return "text-purple-500";
      case "Poruppalar": return "text-[#FFD700]";
      case "DistSecretary": return "text-blue-400";
      default: return "text-white/60";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] md:h-[calc(100vh-120px)] max-w-6xl mx-auto w-full glass-card overflow-hidden border-white/5 shadow-2xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <h2 className="text-white font-black uppercase tracking-widest text-xs">Constituency Live Chat</h2>
        </div>
        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
          {messages.length} Messages
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 pb-10"
      >
        {messages.map((msg, i) => {
          const isMe = msg.userId?.email === session?.user?.email || (msg.isOptimistic && msg.userId?.name === session?.user?.name);
          const showAvatar = (i === 0 || messages[i-1].userId?._id !== msg.userId?._id) && !isMe;

          return (
            <div key={msg._id} className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 ${showAvatar ? 'mt-4' : 'mt-1'}`}>
              {!isMe && (
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10 bg-[#1a1a1a] flex items-center justify-center mb-1">
                  {showAvatar ? (
                    msg.userId?.image ? (
                      <img src={msg.userId.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold text-white/40">{msg.userId?.name?.[0]}</span>
                    )
                  ) : null}
                </div>
              )}
              
              <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && showAvatar && (
                  <div className="flex items-center gap-2 mb-1 ml-1">
                    <span className={`text-[9px] font-black uppercase tracking-tight ${getRoleColor(msg.userId?.role)}`}>
                      {msg.userId?.name}
                    </span>
                    {getRoleIcon(msg.userId?.role)}
                  </div>
                )}
                
                <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words shadow-lg
                  ${isMe 
                    ? 'bg-gradient-to-br from-[#800000] to-[#4a0000] text-white rounded-br-none border border-white/10' 
                    : 'bg-white/5 text-white/80 rounded-bl-none border border-white/5'}
                  ${msg.isOptimistic ? 'opacity-50' : ''}
                `}>
                  {msg.text}
                  <div className={`text-[8px] mt-1 font-bold uppercase tracking-widest opacity-30 ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white/2 border-t border-white/5">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#FFD700]/50 transition-all pr-14"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-[#FFD700] text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[9px] text-white/20 text-center mt-2 uppercase font-bold tracking-[0.2em]">
          Everyone in the constituency can see your messages
        </p>
      </form>
    </div>
  );
}
