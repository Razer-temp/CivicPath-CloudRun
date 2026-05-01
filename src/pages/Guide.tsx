import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, CheckCircle, ChevronRight, FileText, 
  MapPin, Users, Flag, BrainCircuit, Play, Pause
} from "lucide-react";
import { cn } from "../lib/utils";
import { Logo } from "../components/ui/Logo";
import { useLanguage } from "../lib/LanguageContext";

// Lazy load steps
const Step1Election = lazy(() => import("./guide/Step1Election").then(m => ({ default: m.Step1Election })));
const Step2Registration = lazy(() => import("./guide/Step2Registration").then(m => ({ default: m.Step2Registration })));
const Step3Candidates = lazy(() => import("./guide/Step3Candidates").then(m => ({ default: m.Step3Candidates })));
const Step4VotingDay = lazy(() => import("./guide/Step4VotingDay").then(m => ({ default: m.Step4VotingDay })));
const Step5Results = lazy(() => import("./guide/Step5Results").then(m => ({ default: m.Step5Results })));

import { useAuth } from "../lib/AuthContext";
import { UserProfile } from "../types";

const STEPS = [
  { id: 1, title: "What is an Election?", icon: BookOpen },
  { id: 2, title: "Voter Registration", icon: FileText },
  { id: 3, title: "Candidates & Parties", icon: Users },
  { id: 4, title: "Voting Day", icon: MapPin },
  { id: 5, title: "Results & Beyond", icon: Flag },
];

export const Guide = () => {
  const navigate = useNavigate();
  const { user, profile: authProfile, saveProfile } = useAuth();
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [stamps, setStamps] = useState<number[]>([]);

  useEffect(() => {
    // Attempt load from context first, otherwise fallback to local
    if (authProfile?.stamps) {
      setStamps(authProfile.stamps);
    } else {
      const savedStamps = localStorage.getItem("civicpath_stamps");
      if (savedStamps) setStamps(JSON.parse(savedStamps));
    }
  }, [authProfile]);

  const handleStampEarned = async (stepId: number) => {
    if (!stamps.includes(stepId)) {
      const newStamps = [...stamps, stepId];
      setStamps(newStamps);
      localStorage.setItem("civicpath_stamps", JSON.stringify(newStamps));
      await saveProfile({ stamps: newStamps });
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("civicpath_journey");
    
    // Create a mapping so prompt interpolation works correctly
    const COUNTRY_MAP: Record<string, string> = {
      in: "India", us: "United States", gb: "United Kingdom",
      br: "Brazil", ca: "Canada", au: "Australia", za: "South Africa",
      jp: "Japan", mx: "Mexico", id: "Indonesia", fr: "France", de: "Germany"
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.countryName = COUNTRY_MAP[parsed.country] || "India";
      setProfile({ uid: "", name: "", email: "", profile: parsed } as UserProfile);
    } else if (authProfile?.profile) {
      const parsed = { ...authProfile.profile };
      parsed.countryName = parsed.country ? COUNTRY_MAP[parsed.country] : "India";
      setProfile({ ...authProfile, profile: parsed } as UserProfile);
    } else {
      // If no profile, we can still show a default fallback or redirect to onboard
      setProfile({ uid: "", name: "", email: "", profile: { country: "in", countryName: "India", persona: "voter", language: "en" } });
    }
  }, [authProfile]);

  // Handle Speech
  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      // Find the text content of the active step
      const contentElement = document.getElementById("guide-content-area");
      if (contentElement && profile) {
        const textToSpeak = contentElement.innerText || "";
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // Try to set language based on profile
        if (profile.profile?.language) {
          utterance.lang = profile.profile.language === 'en' ? 'en-US' : `${profile.profile.language}-IN`;
        }
        
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!profile) return <div className="p-10 text-center">{t("Loading your guided journey...")}</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header & Progress */}
      <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Logo className="w-8 h-8" />
            <span className="font-bold text-civic-blue text-lg hidden sm:block">CivicPath</span>
          </div>
          
          <div className="flex-1 max-w-md mx-4 sm:mx-8">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-civic-blue transition-all duration-500 ease-out"
                style={{ width: `${(activeStep / 5) * 100}%` }}
              />
            </div>
            <div className="text-right mt-1 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              {t("Step")} {activeStep} {t("of")} 5
            </div>
          </div>

          <button
            onClick={toggleSpeech}
            aria-label={isSpeaking ? t("Pause narration") : t("Start narration")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-civic-blue",
              isSpeaking ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-civic-blue"
            )}
          >
            {isSpeaking ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
            <span className="hidden sm:inline" aria-hidden="true">{isSpeaking ? t("Pause") : t("Listen")}</span>
          </button>
        </div>

        {/* Mobile Horizontal Tabs */}
        <div className="md:hidden flex overflow-x-auto px-4 py-3 gap-2 hide-scrollbar border-t border-slate-100" role="tablist">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                id={`tab-step-mobile-${step.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`step-panel-${step.id}`}
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-civic-blue",
                  isActive 
                    ? "bg-civic-blue text-white border-civic-blue" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
              >
                <Icon className="w-4 h-4" />
                {t(step.title)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 container mx-auto flex">
        <div className="hidden md:block w-80 shrink-0 bg-slate-900 text-slate-100 p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-slate-800 flex flex-col">
          
          {/* Passport Header */}
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-800/50 border border-slate-700/50 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <BookOpen className="w-24 h-24" />
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-amber-500/80 font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {t("Civic Passport")}
            </div>
            <div className="flex items-end gap-3">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-500 font-bold text-xl uppercase italic">
                {profile.profile?.country}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg leading-tight capitalize">{t(profile.profile?.persona || "voter")}</h3>
                <p className="text-sm text-slate-400">{t("Class of 2026")}</p>
              </div>
            </div>
            
            {/* Stamps Grid */}
            <div className="grid grid-cols-5 gap-2 mt-6">
              {[1, 2, 3, 4, 5].map(stepId => {
                const hasStamp = stamps.includes(stepId);
                return (
                  <div 
                    key={stepId} 
                    className={cn(
                      "aspect-square rounded-full flex items-center justify-center transition-all duration-500 relative",
                      hasStamp 
                        ? "bg-amber-500/10 border-2 border-amber-500/50 scale-100 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                        : "border-2 border-dashed border-slate-700 scale-95 opacity-50"
                    )}
                    title={hasStamp ? t("Earned Step Stamp") : t("Complete Step Quiz")}
                  >
                    {hasStamp ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: [-10, 10, 0] }}
                        className="text-amber-500"
                      >
                        {stepId === 5 ? <Flag className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </motion.div>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-bold">{stepId}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {profile.profile?.country === 'in' && (
              <div className="mt-6">
                <a href="/india" className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-500 to-[#138808] rounded-xl text-white font-bold hover:scale-105 transition-transform shadow-lg group">
                  <span className="text-xl">🇮🇳</span>
                  <span className="text-sm">{t("Deep Module")}</span>
                  <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}
          </div>
          
          <nav className="flex flex-col gap-2 relative flex-1" role="tablist">
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              const hasStamp = stamps.includes(step.id);
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  id={`tab-step-${step.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`step-panel-${step.id}`}
                  onClick={() => setActiveStep(step.id)}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-left relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
                    isActive ? "bg-white text-slate-900 shadow-md" : "hover:bg-slate-800 text-slate-300"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-colors relative z-10",
                    isActive ? "bg-civic-blue text-white shadow-sm" : 
                    hasStamp ? "bg-amber-500/20 text-amber-500" : "bg-slate-800 text-slate-500 group-hover:bg-slate-700"
                  )}>
                    {hasStamp ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="relative z-10">
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-wider mb-0.5 transition-colors",
                      isActive ? "text-blue-500" : hasStamp ? "text-amber-500/80" : "text-slate-500"
                    )}>{t("Step")} {step.id}</div>
                    <div className={cn(
                      "text-sm font-bold transition-colors",
                      isActive ? "text-slate-900" : "group-hover:text-white"
                    )}>
                      {t(step.title)}
                    </div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 py-6 px-4 md:py-10 md:px-12 flex justify-center pb-32">
          <div className="w-full max-w-[680px]" id="guide-content-area">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                id={`step-panel-${activeStep}`}
                role="tabpanel"
                aria-labelledby={`tab-step-${activeStep}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="animate-pulse w-8 h-8 rounded-full bg-slate-200"></div></div>}>
                  {activeStep === 1 && profile.profile && <Step1Election profile={profile.profile} onPass={() => handleStampEarned(1)} />}
                  {activeStep === 2 && profile.profile && <Step2Registration profile={profile.profile} onPass={() => handleStampEarned(2)} />}
                  {activeStep === 3 && profile.profile && <Step3Candidates profile={profile.profile} onPass={() => handleStampEarned(3)} />}
                  {activeStep === 4 && profile.profile && <Step4VotingDay profile={profile.profile} onPass={() => handleStampEarned(4)} />}
                  {activeStep === 5 && profile.profile && <Step5Results profile={profile.profile} onPass={() => handleStampEarned(5)} stamps={stamps} />}
                </Suspense>
              </motion.div>
            </AnimatePresence>

            {/* Next/Prev Navigation */}
            <div className="mt-12 flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-colors text-slate-500 flex items-center gap-2 hover:bg-slate-100",
                  activeStep === 1 && "invisible"
                )}
              >
                {t("Previous")}
              </button>
              
              {activeStep < 5 ? (
                <button
                  onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                  className="px-6 py-2.5 bg-civic-blue hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm active:scale-95 transition-all flex items-center gap-2"
                >
                  {t("Next Step")} <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-sm active:scale-95 transition-all flex items-center gap-2"
                >
                  {t("Finish Journey")} <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
