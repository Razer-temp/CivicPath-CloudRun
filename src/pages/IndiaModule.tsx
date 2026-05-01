import { motion } from "framer-motion";
import { Mic, MapPin, Search, Calendar, Landmark, CheckCircle, Smartphone } from "lucide-react";
import { SakshamVoice } from "./india/SakshamVoice";
import { TierSystemExplainer } from "./india/TierSystemExplainer";
import { EVMExplainer } from "./india/EVMExplainer";
import { IndiaDashboard } from "./india/IndiaDashboard";

export const IndiaModule = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Saffron Gradient Banner */}
      <div className="w-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 py-16 relative overflow-hidden">
        {/* Abstract Ashoka Chakra watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2"/>
            {Array.from({ length: 24 }).map((_, i) => (
              <line 
                key={i}
                x1="50" y1="50" x2="50" y2="5" 
                stroke="currentColor" strokeWidth="1"
                transform={`rotate(${i * 15} 50 50)`} 
              />
            ))}
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center text-white"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/30 text-sm font-semibold uppercase tracking-wider">
              <span>🇮🇳</span> CivicPath Exclusive Module
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-md">
              Democracy deeply localized.
            </h1>
            <p className="text-lg md:text-xl font-medium text-orange-50 max-w-2xl drop-shadow">
              Welcome to the India specific voter journey. 
              Built for 968 million voters across 22 scheduled languages, with deep insights into the most complex electoral process on Earth.
            </p>
          </motion.div>
        </div>
        
        {/* Tricolor Bottom Edge */}
        <div className="absolute bottom-0 left-0 w-full flex h-2">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-16">
        {/* Section 1: Saksham Voice Mode */}
        <section className="relative group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] rounded-full" />
          <div className="pl-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <Mic className="w-7 h-7 text-orange-500" />
              Saksham Voice Mode
            </h2>
            <p className="text-slate-600 mb-8 max-w-3xl">
              Don't want to read? No problem. Speak your question in any of India's 22 scheduled languages. 
              Our AI will transcribe, analyze, and reply aloud in your exact language. Designed for high accessibility.
            </p>
            <SakshamVoice />
          </div>
        </section>

        {/* Section 2: 3-Tier System Explainer */}
        <section className="relative group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] rounded-full" />
          <div className="pl-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <Landmark className="w-7 h-7 text-orange-500" />
              The 3-Tier System
            </h2>
            <p className="text-slate-600 mb-8 max-w-3xl">
              A common point of confusion for first-time voters is understanding who they are actually voting for in a given year. 
              Explore the differences between the national and state legislative bodies.
            </p>
            <TierSystemExplainer />
          </div>
        </section>

        {/* Section 3: EVM + VVPAT Explainer */}
        <section className="relative group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] rounded-full" />
          <div className="pl-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <CheckCircle className="w-7 h-7 text-[#138808]" />
              Inside the Polling Booth: EVM & VVPAT
            </h2>
            <p className="text-slate-600 mb-8 max-w-3xl">
              India uses Electronic Voting Machines. Step through this simulation to see exactly how your vote is cast 
              and how the physical paper trail (VVPAT) guarantees your choice is recorded correctly.
            </p>
            <EVMExplainer />
          </div>
        </section>

        {/* Sections 4, 5, 6, 7: State Dashboard */}
        <section className="relative group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] rounded-full" />
          <div className="pl-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <MapPin className="w-7 h-7 text-blue-800" />
              Your State & Constituency Data
            </h2>
            <p className="text-slate-600 mb-8 max-w-3xl">
              Every state has a distinct timeline, Chief Electoral Officer, and registration portal. 
              Look up your local candidates, check your registration, and countdown to 2026.
            </p>
            <IndiaDashboard />
          </div>
        </section>

      </div>
    </div>
  );
};
