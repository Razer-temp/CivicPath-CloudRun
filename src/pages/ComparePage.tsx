import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Users, LayoutTemplate, Clock, AlertCircle, BarChart3, Fingerprint, RefreshCcw, Sparkles, Building, ArrowRight } from "lucide-react";
import { COMPARE_DATA, CountryElectionData } from "../data/CompareData";
import { generateText } from "../services/geminiService";
import { useLanguage } from "../lib/LanguageContext";

export const ComparePage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [countryAId, setCountryAId] = useState<string>("india");
  const [countryBId, setCountryBId] = useState<string>("australia");
  
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const countryA = COMPARE_DATA.find(c => c.id === countryAId)!;
  const countryB = COMPARE_DATA.find(c => c.id === countryBId)!;

  useEffect(() => {
    // Generate AI Summary whenever the countries change
    const fetchSummary = async () => {
      setLoadingSummary(true);
      setSummary(null);
      try {
        const prompt = `Compare the election systems of ${countryA.name} and ${countryB.name} based on the following respective data arrays:
Country A: ${JSON.stringify(countryA)}
Country B: ${JSON.stringify(countryB)}

Write exactly a 3-sentence summary highlighting the fundamental differences in their democratic function in plain language. Keep it educational and non-partisan.
Respond in the language specified by this BCP-47 tag: ${language}`;
        const res = await generateText(prompt);
        setSummary(res);
      } catch (err) {
        setSummary(t("Failed to generate AI comparison. Please try again later."));
      } finally {
        setLoadingSummary(false);
      }
    };
    
    if (countryA && countryB && countryA.id !== countryB.id) {
       fetchSummary();
    } else {
       setSummary(t("Please select two different countries to compare."));
    }
  }, [countryAId, countryBId]);

  const swapCountries = () => {
    setCountryAId(countryBId);
    setCountryBId(countryAId);
  };

  const renderDataRow = (icon: React.ReactNode, label: string, valA: string | number | boolean, valB: string | number | boolean) => {
    const strA = typeof valA === "boolean" ? (valA ? t("Yes") : t("No")) : String(valA);
    const strB = typeof valB === "boolean" ? (valB ? t("Yes") : t("No")) : String(valB);
    const isMatch = strA.toLowerCase().trim() === strB.toLowerCase().trim();
    
    const highlightClasses = isMatch 
      ? "bg-emerald-50 border border-emerald-100" 
      : "bg-amber-50 border border-amber-100";

    return (
      <div className={`grid grid-cols-1 md:grid-cols-[1fr_200px_1fr] gap-4 items-center py-5 transition-colors px-4 rounded-xl ${highlightClasses}`}>
        {/* Country A Value */}
        <div className={`text-right font-bold md:order-1 order-2 ${isMatch ? "text-emerald-800" : "text-amber-900"}`}>
          {strA}
        </div>
        
        {/* Label */}
        <div className={`flex flex-col items-center justify-center text-center px-4 md:order-2 order-1 md:border-x ${isMatch ? "border-emerald-200" : "border-amber-200"}`}>
          <div className={`${isMatch ? "text-emerald-500" : "text-amber-500"} mb-1`}>{icon}</div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isMatch ? "text-emerald-600/70" : "text-amber-700/70"}`}>{t(label)}</span>
        </div>
        
        {/* Country B Value */}
        <div className={`text-left font-bold order-3 ${isMatch ? "text-emerald-800" : "text-amber-900"}`}>
          {strB}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 pb-24">
      
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center justify-center w-16 h-16 bg-civic-blue text-white rounded-[2rem] shadow-xl shadow-blue-900/20 mb-6">
          <Scale className="w-8 h-8" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">{t("Election System Comparator")}</h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          {t("Discover how democracies operate around the world by comparing their electoral rules, systems, and voter engagement.")}
        </p>
      </div>

      {/* Main Compare Container */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 relative overflow-hidden">
        
        {/* Selectors Area */}
        <div className="bg-slate-50 p-6 md:p-10 border-b border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 relative z-10">
            
            {/* Country A Selection */}
            <div className="w-full md:w-auto flex-1 max-w-xs">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 text-center md:text-right">{t("Country A")}</label>
              <div className="relative">
                <select 
                  value={countryAId}
                  onChange={(e) => setCountryAId(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-4 font-bold text-slate-800 text-lg appearance-none cursor-pointer focus:border-civic-blue focus:outline-none transition-colors shadow-sm text-center"
                >
                  {COMPARE_DATA.map(c => (
                    <option key={`A-${c.id}`} value={c.id}>{c.flagEmoji} {c.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
              </div>
            </div>

            {/* Swap Button */}
            <button 
              onClick={swapCountries}
              className="w-12 h-12 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-civic-blue hover:bg-slate-100 hover:scale-110 transition-all shadow-sm z-20 shrink-0"
              title={t("Swap Countries")}
            >
              <RefreshCcw className="w-5 h-5" />
            </button>

            {/* Country B Selection */}
            <div className="w-full md:w-auto flex-1 max-w-xs">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 text-center md:text-left">{t("Country B")}</label>
              <div className="relative">
                <select 
                  value={countryBId}
                  onChange={(e) => setCountryBId(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-4 font-bold text-slate-800 text-lg appearance-none cursor-pointer focus:border-civic-blue focus:outline-none transition-colors shadow-sm text-center"
                >
                  {COMPARE_DATA.map(c => (
                    <option key={`B-${c.id}`} value={c.id}>{c.flagEmoji} {c.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
              </div>
            </div>

          </div>
        </div>

        {/* Data Comparison Rows */}
        <div className="p-4 md:p-10 border-b border-slate-100">
          
          {/* Header Row (Desktop only visualization) */}
          <div className="hidden md:grid grid-cols-[1fr_200px_1fr] gap-4 items-center mb-6 px-4">
            <div className="text-right text-4xl">{countryA.flagEmoji}</div>
            <div className="text-center text-xs font-black text-slate-300 uppercase tracking-widest">{t("Vs")}</div>
            <div className="text-left text-4xl">{countryB.flagEmoji}</div>
          </div>

          <div className="flex flex-col gap-3">
            {renderDataRow(<LayoutTemplate className="w-5 h-5" />, "Government System", t(countryA.systemType), t(countryB.systemType))}
            {renderDataRow(<Fingerprint className="w-5 h-5" />, "Voting Method", t(countryA.votingMethod), t(countryB.votingMethod))}
            {renderDataRow(<Users className="w-5 h-5" />, "Voting Age", countryA.votingAge, countryB.votingAge)}
            {renderDataRow(<AlertCircle className="w-5 h-5" />, "Mandatory Voting", countryA.mandatoryVoting, countryB.mandatoryVoting)}
            {renderDataRow(<Clock className="w-5 h-5" />, "Term Frequency", t(countryA.electionFrequency), t(countryB.electionFrequency))}
            {renderDataRow(<Building className="w-5 h-5" />, "Elections Run By", t(countryA.runsElections), t(countryB.runsElections))}
            {renderDataRow(<BarChart3 className="w-5 h-5" />, "Avg Voter Turnout", countryA.voterTurnout, countryB.voterTurnout)}
            {renderDataRow(<Users className="w-5 h-5" />, "Registered Voters", countryA.registeredVoters, countryB.registeredVoters)}
          </div>
          
          {/* Action Row */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_1fr] gap-4 items-center mt-8">
            <div className="text-right flex justify-end">
              <button 
                onClick={() => navigate(`/${countryA.id}`)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
               >
                 {t("Start Journey for")} {countryA.name} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div></div>
            <div className="text-left flex justify-start">
               <button 
                 onClick={() => navigate(`/${countryB.id}`)}
                 className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
               >
                 {t("Start Journey for")} {countryB.name} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* AI Insight Bar (Bottom) */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 md:p-10 flex gap-4 items-start relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white opacity-40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
          
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-white/50 relative z-10">
            <Sparkles className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="relative z-10 w-full">
            <h3 className="text-indigo-900 font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
              {t("Gemini AI Key Difference Summary")}
            </h3>
            
            <AnimatePresence mode="wait">
              {loadingSummary ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-2 animate-pulse mt-3"
                >
                  <div className="h-4 bg-indigo-200/50 rounded w-full"></div>
                  <div className="h-4 bg-indigo-200/50 rounded w-5/6"></div>
                  <div className="h-4 bg-indigo-200/50 rounded w-4/6"></div>
                </motion.div>
              ) : (
                <motion.div 
                  key="content"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="font-medium text-indigo-800/80 leading-relaxed md:text-lg"
                >
                  {summary}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
};
