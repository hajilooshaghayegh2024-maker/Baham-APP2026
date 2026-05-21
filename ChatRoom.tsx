import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Smile, 
  Paperclip, 
  MoreHorizontal, 
  ArrowLeft,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: any;
}

interface ChatRoomProps {
  chatId: string;
  onBack?: () => void;
}

export default function ChatRoom({ chatId, onBack }: ChatRoomProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    // Fetch chat info (e.g. participant name)
    const fetchChatInfo = async () => {
      const chatDoc = await getDoc(doc(db, "chats", chatId));
      if (chatDoc.exists()) {
        setChatInfo(chatDoc.data());
      }
    };
    fetchChatInfo();

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setLoading(false);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }, (error) => {
      console.error("Chat listener error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !user || !chatId) return;

    const text = inputText;
    setInputText("");

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text,
        senderId: user.uid,
        senderName: user.displayName || "User",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm font-medium">Opening secure channel...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden font-sans">
      {/* Header */}
      <div className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-gray-50">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
              {chatInfo?.companionName?.charAt(0) || "C"}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-none mb-1">
                {chatInfo?.companionName || "Companion Chat"}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Verified Channel
              </div>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full text-gray-400">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide"
      >
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isMe = msg.senderId === user?.uid;
            const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex items-end gap-3",
                  isMe ? "flex-row-reverse" : "flex-row"
                )}
              >
                {!isMe && showAvatar ? (
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-bold text-gray-400 mb-1">
                    {msg.senderName.charAt(0)}
                  </div>
                ) : (
                  <div className="w-8" />
                )}

                <div className={cn(
                  "max-w-[70%] space-y-1",
                  isMe ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-5 py-3 rounded-3xl text-sm leading-relaxed shadow-sm",
                    isMe 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                  )}>
                    {msg.text}
                  </div>
                  {showAvatar && (
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest px-1">
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100">
        <form 
          onSubmit={handleSendMessage}
          className="relative flex items-center gap-3 bg-gray-50 p-2 rounded-3xl border border-transparent focus-within:border-blue-100 focus-within:bg-white transition-all shadow-inner"
        >
          <Button type="button" variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-blue-600">
            <Smile className="w-5 h-5" />
          </Button>
          <Input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a thoughtful message..."
            className="border-none bg-transparent focus-visible:ring-0 px-0 h-10 font-medium placeholder:text-gray-300"
          />
          <div className="flex items-center gap-1 pr-1">
            <Button type="button" variant="ghost" size="icon" className="rounded-full text-gray-300 hover:text-gray-600">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button 
              type="submit" 
              disabled={!inputText.trim()}
              size="icon" 
              className={cn(
                "rounded-2xl transition-all shadow-lg active:scale-95",
                inputText.trim() 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100" 
                  : "bg-gray-100 text-gray-300 shadow-none pointer-events-none"
              )}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
        </form>
        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-4 text-center">
          Messaging is end-to-end moderated for trust and safety
        </p>
      </div>
    </div>
  );
}
