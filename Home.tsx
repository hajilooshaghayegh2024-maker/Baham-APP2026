import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  UserCheck, 
  Search, 
  MessageCircle, 
  Heart, 
  ShieldAlert,
  ArrowRight,
  Fingerprint,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-[#2D2D2D] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background shapes for Scandinavian feel */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F0F7FF] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 -z-10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FDF9F3] rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4 -z-10 opacity-80"></div>

        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border-blue-100 text-blue-700 font-medium tracking-wide border shadow-sm">
              Trusted Human Connection
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-gray-900">
              Find safe, verified <br />
              <span className="text-blue-600/80 italic font-serif">companionship</span> for life.
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              BaHam connects you with vetted individuals for grocery trips, morning walks, or simple conversation. Not a date, not a doctor—just a human being.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => navigate("/dashboard")} 
                size="lg" 
                className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-100 group transition-all cursor-pointer"
              >
                I need companionship
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => navigate("/onboarding")} 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 rounded-2xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm transition-all cursor-pointer"
              >
                I want to become a companion
              </Button>
            </div>
          </motion.div>

          {/* Hero Image / Mockup Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-20 relative mx-auto max-w-4xl"
          >
            <div className="aspect-[21/9] bg-gradient-to-br from-blue-50 to-white rounded-[2.5rem] border border-white/50 shadow-2xl p-8 flex items-center justify-center overflow-hidden">
               <div className="grid grid-cols-3 gap-6 w-full opacity-40">
                  <div className="h-64 bg-blue-100 rounded-3xl"></div>
                  <div className="h-64 bg-gray-100 rounded-3xl mt-12"></div>
                  <div className="h-64 bg-blue-50 rounded-3xl"></div>
               </div>
               <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="text-center">
                    <Heart className="w-16 h-16 text-blue-500/20 mb-4 mx-auto" />
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Safe Space Verified</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 tracking-tight">How it works</h2>
            <p className="text-gray-500 max-w-xl text-lg">Three simple steps to bridge the gap between isolation and connection.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Search,
                title: "1. Browse verified profiles",
                desc: "Filter by location, shared interests, and availability. See detailed background-checked profiles."
              },
              {
                icon: MessageCircle,
                title: "2. Safe connection",
                desc: "Start a conversation through our encrypted platform. All messages are moderated for your safety."
              },
              {
                icon: Heart,
                title: "3. Meet with peace of mind",
                desc: "Meet in public spaces, share your location with emergency contacts, and enjoy meaningful connection."
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="w-16 h-16 bg-[#F0F7FF] rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <step.icon className="w-7 h-7 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section id="safety" className="py-24 px-6 bg-[#FDF9F3]">
        <div className="max-w-6xl mx-auto bg-white rounded-[3rem] p-8 md:p-16 shadow-xl shadow-orange-100/50 border border-orange-50 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-50 rounded-full blur-2xl"></div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mb-6 rounded-full border-none px-4 py-1">Safety First</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight text-gray-900 leading-tight">Your safety is our only priority.</h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                We've built BaHam with multi-layered protection protocols to ensure every connection is respectful, safe, and transparent.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Fingerprint className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">ID Verification</h4>
                    <p className="text-gray-500 text-sm">Every companion undergoes mandatory government ID verification and background checks.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">AI Anomaly Detection</h4>
                    <p className="text-gray-500 text-sm">Our AI monitors platform interactions in real-time to flag unusual behavior or safety risks.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
               <div className="aspect-square bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col p-8 justify-between relative z-10">
                  <div className="flex justify-between items-center">
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                    <UserCheck className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-green-100 rounded-full"></div>
                    <div className="h-2 w-4/5 bg-gray-100 rounded-full"></div>
                    <div className="h-2 w-3/5 bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
                    <div className="flex-1">
                       <div className="h-2 w-20 bg-gray-100 rounded mb-2"></div>
                       <div className="h-3 w-32 bg-blue-600 rounded"></div>
                    </div>
                    <ShieldAlert className="w-5 h-5 text-gray-200" />
                  </div>
               </div>
               {/* Shadow decorative dots */}
               <div className="absolute -bottom-6 -left-6 grid grid-cols-5 gap-2 opacity-10">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Ready for real connection?</h2>
          <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto">
            Join thousands of others rediscovering the joy of simple human presence in a safe, controlled environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/onboarding")}
              size="lg" 
              className="h-16 px-10 rounded-full bg-black hover:bg-gray-900 text-white font-bold transition-all shadow-xl shadow-gray-200 cursor-pointer"
            >
               Get Started Free
            </Button>
            <Button 
              onClick={() => document.getElementById("safety")?.scrollIntoView({ behavior: "smooth" })}
              size="lg" 
              variant="ghost" 
              className="h-16 px-10 rounded-full font-bold hover:bg-gray-100 text-gray-700 cursor-pointer"
            >
               Learn about safety
            </Button>
          </div>
        </div>
      </section>

      {/* Modern Scandinavian Footer */}
      <footer className="py-20 px-6 border-t border-gray-100 md:px-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#1a1a1a]">BaHam</span>
            </div>
            <p className="text-gray-400 max-w-xs leading-relaxed text-sm">
              Connecting people through safe, trusted human companionship. Built with safety and ethics as core pillars.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-sm uppercase tracking-widest mb-6 opacity-30">Platform</h5>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Safety center</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Verification</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm uppercase tracking-widest mb-6 opacity-30">Company</h5>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Ethics charter</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
          <p>© 2026 BaHam Companionship Platforms. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
