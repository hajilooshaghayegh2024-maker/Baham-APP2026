import { useEffect, useState } from "react";
import { 
  LogOut,
  User as UserIcon,
  Heart,
  LayoutDashboard,
  ShieldCheck,
  MessageSquare,
  UserPlus
} from "lucide-react";
import { useAuth } from "./contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useParams } from "react-router-dom";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import ChatRoom from "./components/ChatRoom";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export default function App() {
  const { user, loading } = useAuth();
  const [dbLoading, setDbLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    if (user) {
      import('firebase/firestore').then(({ doc, getDoc, getFirestore }) => {
        const db = getFirestore();
        getDoc(doc(db, "users", user.uid)).then((docSnap) => {
          if (docSnap.exists() && docSnap.data().onboarded) {
            setIsOnboarded(true);
          }
          setDbLoading(false);
        });
      });
    } else {
      setDbLoading(false);
      setIsOnboarded(false);
    }
  }, [user]);

  if (loading || dbLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-sans text-gray-400">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <Heart className="w-4 h-4 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col">
        <Navbar user={user} />
        
        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/onboarding" 
              element={user ? (isOnboarded ? <Navigate to="/dashboard" /> : <Onboarding />) : <Navigate to="/" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? (isOnboarded ? <Dashboard /> : <Navigate to="/onboarding" />) : <Navigate to="/" />} 
            />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route 
              path="/chat" 
              element={user ? <div className="h-[calc(100vh-4rem)] p-6"><ChatRoom chatId="main_lounge" /></div> : <Navigate to="/" />} 
            />
            <Route 
              path="/chat/:chatId" 
              element={user ? <div className="h-[calc(100vh-4rem)] p-6"><ChatRouteWrapper /></div> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
        
        <Toaster />
      </div>
    </Router>
  );
}

function ChatRouteWrapper() {
  const { chatId } = useParams();
  return <ChatRoom chatId={chatId || "main_lounge"} />;
}

function Navbar({ user }: { user: any }) {
  const location = useLocation();
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Onboarding", path: "/onboarding", icon: UserPlus },
    { name: "Chat", path: "/chat", icon: MessageSquare },
    { name: "Admin", path: "/admin", icon: ShieldCheck },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform duration-200">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-gray-900">BaHam</span>
        </Link>
        
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200",
                location.pathname === link.path 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <link.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-xs font-bold text-gray-900 leading-none">{user.displayName}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Verified Member</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                className="w-10 h-10 rounded-2xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogin} 
                className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors hidden sm:block"
              >
                Log in
              </button>
              <Button 
                onClick={handleLogin} 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 h-11 font-bold shadow-xl shadow-blue-100 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Join BaHam
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}


