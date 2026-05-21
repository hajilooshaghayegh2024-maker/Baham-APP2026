import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  UserCircle2, 
  Users2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Loader2
} from "lucide-react";

type Step = "role" | "profile" | "success";

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("role");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    role: "" as "Seeker" | "Companion" | "",
    fullName: user?.displayName || "",
    languages: "",
    bio: ""
  });

  const handleRoleSelect = (role: "Seeker" | "Companion") => {
    setFormData({ ...formData, role });
    setStep("profile");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // 1. Save to Firebase Firestore (Primary)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: formData.role,
        fullName: formData.fullName,
        languages: formData.languages.split(",").map(l => l.trim()),
        bio: formData.bio,
        onboarded: true,
        createdAt: new Date().toISOString()
      });

      // 2. Synchronize with FastAPI/SQLite Backend
      try {
        await fetch("/api/profiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            role: formData.role,
            fullName: formData.fullName,
            bio: formData.bio,
            languages: formData.languages.split(",").map(l => l.trim())
          })
        });
      } catch (backendError) {
        console.warn("Backend synchronization failed, but Firestore saved.", backendError);
      }

      setStep("success");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {step === "role" && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome to BaHam</h1>
                <p className="text-gray-500">To get started, tell us how you'd like to use the platform.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card 
                  className={`cursor-pointer transition-all border-2 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 ${formData.role === "Seeker" ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-100'}`}
                  onClick={() => handleRoleSelect("Seeker")}
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                      <UserCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold">Seeker</h3>
                    <p className="text-sm text-gray-500">I'm looking for a safe and trusted companion for support or tasks.</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all border-2 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 ${formData.role === "Companion" ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-100'}`}
                  onClick={() => handleRoleSelect("Companion")}
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto text-orange-600">
                      <Users2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold">Companion</h3>
                    <p className="text-sm text-gray-500">I want to provide companionship and support to others in my community.</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {step === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button 
                onClick={() => setStep("role")}
                className="flex items-center text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to role selection
              </button>

              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
                <h2 className="text-2xl font-bold mb-8">Complete your profile</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName"
                      placeholder="Jane Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="h-12 rounded-xl focus-visible:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages spoken</Label>
                    <Input 
                      id="languages"
                      placeholder="English, Spanish, French..."
                      value={formData.languages}
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                      required
                      className="h-12 rounded-xl focus-visible:ring-blue-600"
                    />
                    <p className="text-[10px] text-gray-400">Separate with commas</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio"
                      placeholder="Tell us a bit about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="min-h-[120px] rounded-2xl focus-visible:ring-blue-600 p-4"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all relative overflow-hidden"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Complete Onboarding
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">You're all set!</h1>
                <p className="text-gray-500">Your profile has been verified and saved.</p>
              </div>
              <Button 
                onClick={() => navigate("/dashboard")}
                className="h-14 px-12 bg-black hover:bg-gray-900 text-white rounded-2xl font-bold"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
