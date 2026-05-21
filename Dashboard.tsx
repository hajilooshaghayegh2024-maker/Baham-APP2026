import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Settings,
  Bell,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import BookingModal from "./BookingModal";

const MOCK_COMPANIONS = [
  {
    uid: "comp_lukas",
    fullName: "Lukas Lindqvist",
    role: "Companion",
    rating: 4.9,
    distance_km: 2.1,
    languages: ["Finnish", "English", "Swedish"],
    bio: "Passionate about literature, nature walking, and chess. Happy to join you for peaceful afternoon coffee and talking about history or books.",
    location: "Helsinki",
    availability: ["Monday", "Wednesday", "Friday"],
    avatar: "L",
    category: "conversation"
  },
  {
    uid: "comp_elin",
    fullName: "Elin Salonen",
    role: "Companion",
    rating: 4.8,
    distance_km: 5.4,
    languages: ["Finnish", "English"],
    bio: "Love helping with basic grocery shopping, running errands, or enjoying walks in the local park. Let's make everyday chores fun and friendly!",
    location: "Espoo",
    availability: ["Tuesday", "Thursday", "Saturday"],
    avatar: "E",
    category: "errands"
  },
  {
    uid: "comp_oliver",
    fullName: "Oliver Virtanen",
    role: "Companion",
    rating: 5.0,
    distance_km: 8.9,
    languages: ["Finnish", "Swedish", "English"],
    bio: "Art teacher and hobby enthusiast. Let's sketch, talk paintings, share hobbies, or simply spend some high-quality conversation time together.",
    location: "Vantaa",
    availability: ["Monday", "Tuesday", "Thursday"],
    avatar: "O",
    category: "hobby"
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [viewTab, setViewTab] = useState<"companions" | "schedule">("companions");

  useEffect(() => {
    if (!user) return;
    
    // Real-time listener for user's booking interactions
    const bQuery = query(
      collection(db, "bookings"),
      where("seekerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(bQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(list);
    }, (error) => {
      console.warn("Firestore listener not fully configured yet:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Filters
  const filteredCompanions = MOCK_COMPANIONS.filter((c) => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? c.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.displayName?.split(' ')[0] || "Friend"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-gray-100 bg-white hover:bg-gray-50 transition-colors shadow-sm">
              <Bell className="w-5 h-5 text-gray-500" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-gray-100 bg-white hover:bg-gray-50 transition-colors shadow-sm">
               <Settings className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </header>

        {/* Dashboard Status Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white overflow-hidden p-8 flex flex-col justify-between h-44">
            <CardHeader className="p-0">
              <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Active Bookings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <span className="text-5xl font-extrabold text-gray-900">{bookings.filter(b => b.status === "confirmed").length}</span>
              <p className="text-xs text-gray-400 mt-2 font-medium">Pending confirmation: {bookings.filter(b => b.status === "pending").length}</p>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-gray-100 shadow-sm bg-white overflow-hidden p-8 flex flex-col justify-between h-44">
            <CardHeader className="p-0">
              <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Messages</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <span className="text-5xl font-extrabold text-gray-900">{bookings.length > 0 ? 1 : 0}</span>
              <p className="text-xs text-blue-600 font-semibold mt-2 cursor-pointer hover:underline" onClick={() => navigate("/chat")}>View Chat Rooms →</p>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-xl shadow-blue-50 bg-blue-600 text-white overflow-hidden p-8 flex flex-col justify-between h-44 relative">
            <CardHeader className="p-0">
              <CardTitle className="text-xs font-bold text-blue-100 uppercase tracking-widest leading-none mb-1">Safety Rating</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">100% Secure</div>
                <div className="text-[10px] text-blue-100 tracking-wider font-semibold uppercase mt-1">Verified Member</div>
              </div>
            </CardContent>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </Card>
        </div>

        {/* Dynamic Controls Navigation */}
        <div className="flex border-b border-gray-100 mt-12 mb-8 gap-6">
          <button 
            onClick={() => setViewTab("companions")}
            className={`pb-4 text-base font-bold transition-colors relative ${viewTab === "companions" ? "text-blue-600" : "text-gray-400 hover:text-gray-900"}`}
          >
            Find Companions
            {viewTab === "companions" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-fade-in" />}
          </button>
          <button 
            onClick={() => setViewTab("schedule")}
            className={`pb-4 text-base font-bold transition-colors relative ${viewTab === "schedule" ? "text-blue-600" : "text-gray-400 hover:text-gray-900"}`}
          >
            My Schedule & Bookings ({bookings.length})
            {viewTab === "schedule" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-fade-in" />}
          </button>
        </div>

        {/* Tab 1: Companions Directory */}
        {viewTab === "companions" && (
          <div className="space-y-8">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Search companions by name, location, or bio details..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 bg-white border-transparent rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-100 transition-all font-medium placeholder:text-gray-300 shadow-sm w-full"
                />
              </div>

              {/* Service Categories Quick Filter */}
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                {[
                  { id: null, label: "All Services" },
                  { id: "conversation", label: "☕ Coffee & Chat" },
                  { id: "errands", label: "🛒 Basic Errands" },
                  { id: "hobby", label: "🎨 Hobby Sharing" },
                ].map((cat) => (
                  <Button
                    key={cat.id ?? "all"}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`h-12 rounded-2xl font-bold border-gray-100 ${selectedCategory === cat.id ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Companions Card List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompanions.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-bold text-gray-800 text-lg">No companions found</h4>
                  <p className="text-gray-400 max-w-sm mx-auto text-sm mt-1">Please adjust your search terms or filter category to browse other verified profiles.</p>
                </div>
              ) : (
                filteredCompanions.map((comp) => (
                  <Card key={comp.uid} className="rounded-[2.5rem] border-gray-100 bg-white shadow-xl shadow-gray-200/40 overflow-hidden flex flex-col h-full hover:-translate-y-1.5 transition-all duration-300 group">
                    <CardContent className="p-8 flex-1 flex flex-col justify-between">
                      {/* Top Details */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[1.25rem] flex items-center justify-center font-extrabold text-xl group-hover:scale-105 transition-transform duration-200">
                            {comp.avatar}
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge variant="outline" className="border-green-100 text-green-700 bg-green-50/50 hover:bg-green-50/50 rounded-xl px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Checked
                            </Badge>
                            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                              ⭐ {comp.rating}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{comp.fullName}</h3>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                            <MapPin className="w-3.5 h-3.5" /> {comp.location} ({comp.distance_km} km away)
                          </div>
                        </div>

                        <p className="text-gray-500 text-sm leading-relaxed">{comp.bio}</p>

                        {/* Languages */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {comp.languages.map((lang) => (
                            <span key={lang} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Call to Actions */}
                      <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-gray-50">
                        <BookingModal 
                          companionId={comp.uid} 
                          companionName={comp.fullName}
                          trigger={
                            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 select-none cursor-pointer">
                              Book 
                            </Button>
                          }
                        />
                        <Button 
                          variant="outline" 
                          onClick={() => navigate(`/chat`)}
                          className="h-12 border-gray-100 rounded-2xl font-bold bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: My Bookings & Schedule */}
        {viewTab === "schedule" && (
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-bold text-2xl tracking-tight text-gray-900">Your Bookings List</h3>
                  <p className="text-gray-500 text-sm mt-1">Real-time tracker connected safely with Cloud Firestore storage.</p>
                </div>
                <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
              </div>

              {bookings.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl p-6">
                  <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-bold text-lg text-gray-800">No scheduled activities yet</h4>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto mt-1">To book companionship, go to the Find Companions list and select a service category.</p>
                  <Button 
                    onClick={() => setViewTab("companions")}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl h-11 px-6 text-white"
                  >
                    Select Companion
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white transition-all hover:shadow-md hover:shadow-gray-100"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                          {booking.companionName?.charAt(0) || "C"}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">Meeting with {booking.companionName}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                            <span className="flex items-center gap-1 text-blue-600 bg-blue-50/30 px-2 py-0.5 rounded-lg border border-blue-50">
                              ☕ {booking.serviceCategory}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5" /> {booking.date ? new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : "Pick a date"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {booking.timeSlot}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <Badge 
                          className={`rounded-xl px-3 py-1 font-bold text-[10px] uppercase tracking-wider border-none ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {booking.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          onClick={() => navigate("/chat")}
                          className="h-10 text-gray-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl font-bold text-xs"
                        >
                          Enter Chat 
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
