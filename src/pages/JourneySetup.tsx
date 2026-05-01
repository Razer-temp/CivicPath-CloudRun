import { logger } from "../utils/logger";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, GraduationCap, Map, User, BookOpen, 
  Target, Presentation, History, Globe, FileText,
  BadgeCheck, School
} from "lucide-react";
import { cn } from "../lib/utils";
import { Logo } from "../components/ui/Logo";
import { useAuth } from "../lib/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useLanguage } from "../lib/LanguageContext";

// --- Data Types ---
type OnboardState = {
  country: string | null;
  residence: string | null;
  region: string | null;
  postalCode: string | null;
  persona: string | null;
  language: string | null;
  goal: string | null;
  isFirstTimeVoter: boolean | null;
  registrationStatus: string | null;
};

// --- Mock Data ---
export const COUNTRIES = [
  { id: "in", name: "India" },
  { id: "us", name: "United States" },
  { id: "gb", name: "United Kingdom" },
  { id: "br", name: "Brazil" },
  { id: "ca", name: "Canada" },
  { id: "au", name: "Australia" },
  { id: "za", name: "South Africa" },
  { id: "jp", name: "Japan" },
  { id: "mx", name: "Mexico" },
  { id: "id", name: "Indonesia" },
  { id: "fr", name: "France" },
  { id: "de", name: "Germany" },
];

export const PERSONAS = [
  { id: "voter", icon: BadgeCheck, title: "First-time Voter", desc: "I want to learn how to vote and participate." },
  { id: "student", icon: School, title: "Student", desc: "I'm learning about the political system for school." },
  { id: "researcher", icon: Globe, title: "Researcher", desc: "I need raw data, timelines, and facts." },
  { id: "educator", icon: Presentation, title: "Educator", desc: "I want resources to teach others." },
];

export const GOALS = [
  { id: "full", icon: Map, title: "The Full Journey", desc: "From understanding democracy to election day." },
  { id: "register", icon: FileText, title: "Voter Registration", desc: "Deadlines, eligibility, and how to register." },
  { id: "voting_day", icon: Target, title: "Voting Day Guide", desc: "What to bring, EVMs, and polling stations." },
  { id: "results", icon: History, title: "Results & Aftermath", desc: "How counting works and governments form." },
];

export const JourneySetup = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { setLanguage, t } = useLanguage();
  const [step, setStep] = useState(-1); // -1 is the Quick Start branch
  
  // Register static texts mapping dynamically
  useEffect(() => {
    // Actually, useLanguage doesn't auto-register.
    // It's better to rely on dynamic t(str) which will register if missing.
  }, []);
  
  const [data, setData] = useState<OnboardState>({
    country: "in",
    residence: "",
    region: "",
    postalCode: "",
    persona: "voter",
    language: "en",
    goal: "full",
    isFirstTimeVoter: null,
    registrationStatus: null,
  });

  // Derived Languages based on Country
  const getLanguages = () => {
    if (data.country === "in") {
      return [
        { id: "en", name: "English" },
        { id: "hi", name: "Hindi (हिन्दी)" },
        { id: "ta", name: "Tamil (தமிழ்)" },
        { id: "te", name: "Telugu (తెలుగు)" },
        { id: "bn", name: "Bengali (বাংলা)" },
        { id: "mr", name: "Marathi (मराठी)" },
        { id: "kn", name: "Kannada (ಕನ್ನಡ)" },
        { id: "gu", name: "Gujarati (ગુજરાતી)" },
        { id: "ml", name: "Malayalam (മലയാളം)" },
        { id: "or", name: "Odia (ଓଡ଼ିଆ)" },
        { id: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
      ];
    }
    if (data.country === "us" || data.country === "gb" || data.country === "au" || data.country === "ca") {
      return [
        { id: "en", name: "English" },
        { id: "es", name: "Spanish (Español)" },
        { id: "fr", name: "French (Français)" }, 
      ];
    }
    return [
      { id: "en", name: "English" },
      { id: "local", name: "Primary Local Language" }
    ];
  };

  // Handlers
  const handleSelect = (key: keyof OnboardState, value: string | boolean | null) => {
    setData((prev) => ({ ...prev, [key]: value }));
    
    if (key === 'language' && typeof value === 'string') {
      setLanguage(value);
    }

    // Auto-advance
    setTimeout(() => {
      if (step < 6) {
        setStep((s) => s + 1);
      } else {
        finishSetup({ ...data, [key]: value });
      }
    }, 400);
  };

  const startWithRealProfile = () => {
    if (profile?.profile) {
       finishSetup(profile.profile as Partial<OnboardState>);
    } else {
       // fallback if no profile is set up: just start scenario
       setStep(0);
    }
  };

  const finishSetup = async (finalData: Partial<OnboardState>) => {
    const journeyId = "current_journey"; // Usually would generate unique id: Date.now().toString()
    const journeyData = {
      ...finalData,
      id: journeyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage (The Sandbox / Blueprint)
    localStorage.setItem("civicpath_journey", JSON.stringify(journeyData));
    
    // Tier 2: Save to User Sandbox in Firestore if logged in
    if (user?.uid) {
      try {
        await setDoc(doc(db, "users", user.uid, "journeys", journeyId), journeyData, { merge: true });
      } catch (err) {
        logger.warn("Failed to sync journey to backend", err);
      }
    }

    navigate("/guide");
  };

  // Animation variants
  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation / Progress */}
      <div className="w-full h-16 flex items-center justify-between px-4 sm:px-6 bg-white shrink-0 sticky top-0 z-10">
        <button 
          onClick={() => step > -1 ? setStep(step - 1) : navigate("/")}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Progress Dots */}
        <div className="flex gap-2.5">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === step ? "bg-civic-blue w-8" : "bg-slate-200 w-2",
                i < step ? "bg-blue-300 w-2" : ""
              )}
            />
          ))}
        </div>

        <button 
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Cancel Onboarding"
        >
          <Logo className="w-6 h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:py-12 flex flex-col items-center">
        <div className="max-w-2xl w-full">
          
          <AnimatePresence mode="wait">

            {/* QUICK START BRANCH */}
            {step === -1 && (
              <motion.div key="step-1" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="flex flex-col">
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">{t("Welcome to your learning journey")}</h1>
                  <p className="text-slate-500">{t("How would you like to explore today?")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={startWithRealProfile}
                    className="flex flex-col items-start gap-4 p-6 bg-white rounded-2xl border text-left transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-95 group border-slate-200 hover:border-civic-blue"
                  >
                    <div className="p-3 rounded-xl bg-blue-50 text-civic-blue">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-1">{t("Use My Profile")}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{t("Explore the election process based on my actual location and experience level.")}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setStep(0)}
                    className="flex flex-col items-start gap-4 p-6 bg-white rounded-2xl border text-left transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-95 group border-slate-200 hover:border-saffron"
                  >
                    <div className="p-3 rounded-xl bg-orange-50 text-saffron">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-1">{t("Explore New Scenario")}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{t("Simulate a journey for a different country, region, or learning objective.")}</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* STEP 1: COUNTRY */}
            {step === 0 && (
              <motion.div key="step0" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="flex flex-col">
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">{t("Where are you voting?")}</h1>
                  <p className="text-slate-500">{t("Select your country to get customized election information.")}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {COUNTRIES.map((c) => {
                    const isSelected = data.country === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleSelect("country", c.id)}
                        className={cn(
                          "flex flex-col items-center justify-center p-6 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-95",
                          isSelected 
                            ? "border-civic-blue bg-blue-50/50 ring-2 ring-civic-blue/20" 
                            : "border-slate-200"
                        )}
                      >
                        <img 
                          src={`https://flagcdn.com/w80/${c.id}.png`} 
                          alt={`${c.name} flag`}
                          className="w-12 h-12 object-cover rounded-full shadow-sm mb-3 border border-slate-100"
                        />
                        <span className="font-medium text-slate-800 text-sm text-center">{t(c.name)}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: RESIDENCE */}
            {step === 1 && (
              <motion.div key="step1_residence" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="flex flex-col">
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">{t("Where do you live?")}</h1>
                  <p className="text-slate-500">{t("Election laws depend heavily on your current region of residence.")}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t("State / Province / Region")}</label>
                    <input 
                      type="text" 
                      value={data.region || ""}
                      onChange={(e) => setData(prev => ({ ...prev, region: e.target.value }))}
                      placeholder={t("e.g. California, Maharashtra")} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-civic-blue transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t("Postal Code / Zip Code")}</label>
                    <input 
                      type="text" 
                      value={data.postalCode || ""}
                      onChange={(e) => setData(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder={t("e.g. 90210, 400001")} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-civic-blue transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => {
                        // Advance to the next step
                        if (data.region && data.postalCode) {
                            setStep(2);
                        }
                    }}
                    disabled={!data.region || !data.postalCode}
                    className="w-full mt-6 bg-civic-blue text-white py-3 px-6 rounded-xl font-medium transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("Continue")}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: FIRST-TIME VOTER */}
            {step === 2 && (
              <motion.div key="step2_first_time" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="flex flex-col">
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">{t("Are you a first-time voter?")}</h1>
                  <p className="text-slate-500">{t("We'll simplify things if you are.")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSelect("isFirstTimeVoter", true)}
                    className={cn(
                        "flex flex-col items-center justify-center p-6 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-95",
                        data.isFirstTimeVoter === true 
                        ? "border-civic-blue bg-blue-50/50 ring-2 ring-civic-blue/20" 
                        : "border-slate-200"
                    )}
                  >
                    <span className="text-4xl mb-2">🎈</span>
                    <span className="font-semibold text-lg text-slate-900">{t("Yes, it's my first time")}</span>
                  </button>
                  <button
                    onClick={() => handleSelect("isFirstTimeVoter", false)}
                    className={cn(
                        "flex flex-col items-center justify-center p-6 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-95",
                        data.isFirstTimeVoter === false 
                        ? "border-civic-blue bg-blue-50/50 ring-2 ring-civic-blue/20" 
                        : "border-slate-200"
                    )}
                  >
                    <span className="text-4xl mb-2">✅</span>
                    <span className="font-semibold text-lg text-slate-900">{t("No, I've voted before")}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: CURRENT REGISTRATION STATUS */}
            {step === 3 && (
              <motion.div key="step3_registration" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="flex flex-col">
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">{t("Are you registered?")}</h1>
                  <p className="text-slate-500">{t("This helps us point you toward early deadlines.")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['Not registered', 'Unsure', 'Registered'].map((status) => (
                    <button
                        key={status}
                        onClick={() => handleSelect("registrationStatus", status.toLowerCase())}
                        className={cn(
                            "flex flex-col items-center justify-center p-6 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-95",
                            data.registrationStatus === status.toLowerCase() 
                            ? "border-civic-blue bg-blue-50/50 ring-2 ring-civic-blue/20" 
                            : "border-slate-200"
                        )}
                    >
                        <span className="font-semibold text-slate-900">{t(status)}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: PERSONA */}
            {step === 4 && (
              <motion.div key="step1" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="flex flex-col">
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">{t("Which best describes you?")}</h1>
                  <p className="text-slate-500">{t("This helps us tailor the language and complexity of the information.")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PERSONAS.map((p) => {
                    const isSelected = data.persona === p.id;
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelect("persona", p.id)}
                        className={cn(
                          "flex items-start gap-4 p-6 bg-white rounded-2xl border text-left transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-95 group",
                          isSelected 
                            ? "border-civic-blue bg-blue-50/50 ring-2 ring-civic-blue/20" 
                            : "border-slate-200"
                        )}
                      >
                        <div className={cn(
                          "p-3 rounded-xl transition-colors",
                          isSelected ? "bg-civic-blue text-white" : "bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-civic-blue"
                        )}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900 mb-1">{t(p.title)}</h3>
                          <p className="text-sm text-slate-500 leading-relaxed">{t(p.desc)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 6: LANGUAGE */}
            {step === 5 && (
              <motion.div key="step2" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="flex flex-col">
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">{t("Choose your language")}</h1>
                  <p className="text-slate-500">{t("We'll provide your guided journey in this language.")}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {getLanguages().map((lang) => {
                    const isSelected = data.language === lang.id;
                    const isDetected = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith(lang.id);
                    
                    return (
                      <button
                        key={lang.id}
                        onClick={() => handleSelect("language", lang.id)}
                        className={cn(
                          "relative p-4 bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-md active:scale-95 text-center flex flex-col items-center justify-center gap-1",
                          isSelected 
                            ? "border-civic-blue bg-blue-50/50" 
                            : "border-slate-100 hover:border-slate-200"
                        )}
                      >
                        {isDetected && (
                          <span className="absolute -top-2.5 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-white">
                            {t("Detected")}
                          </span>
                        )}
                        <span className={cn(
                          "font-semibold text-base",
                          isSelected ? "text-civic-blue" : "text-slate-700"
                        )}>
                          {lang.name.split(" ")[0]}
                        </span>
                        {lang.name.includes("(") && (
                          <span className={cn(
                            "text-sm font-medium",
                            isSelected ? "text-blue-500" : "text-slate-400"
                          )}>
                            {lang.name.match(/\((.*?)\)/)?.[1]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 7: GOAL */}
            {step === 6 && (
              <motion.div key="step3" variants={slideVariants} initial="initial" animate="enter" exit="exit" className="flex flex-col">
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">{t("What's your goal today?")}</h1>
                  <p className="text-slate-500">{t("Select what you want to learn so we can jump right in.")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GOALS.map((g) => {
                    const isSelected = data.goal === g.id;
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.id}
                        onClick={() => handleSelect("goal", g.id)}
                        className={cn(
                           "flex flex-col items-center text-center gap-3 p-6 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-95 group",
                           isSelected 
                             ? "border-civic-blue bg-blue-50/50 ring-2 ring-civic-blue/20" 
                             : "border-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center transition-colors mb-2",
                          isSelected ? "bg-civic-blue text-white" : "bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-civic-blue"
                        )}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900 mb-1">{t(g.title)}</h3>
                          <p className="text-sm text-slate-500 leading-relaxed">{t(g.desc)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

