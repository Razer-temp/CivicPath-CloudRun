import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { generateGuideContent, ContentSource } from "../../services/geminiService";
import { MythBuster } from "./MythBuster";
import { GeminiQuiz } from "./GeminiQuiz";
import { PieChart, ListChecks, CalendarSync, AlertTriangle, Globe, HardDrive } from "lucide-react";

import { JourneyProfile } from "../../types";

export const Step5Results = ({ profile, onPass, stamps = [] }: { profile: JourneyProfile, onPass?: () => void, stamps?: number[] }) => {
  const [content, setContent] = useState("");
  const [source, setSource] = useState<ContentSource | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const prompt = `Explain the election results counting process and government formation in ${profile.countryName}. 
      Explain concepts like "Majority", "Coalition government", and what happens immediately after results are announced. 
      Output in markdown, no code blocks, use simple language.`;
      
      const response = await generateGuideContent(prompt, {
        country: profile.country,
        persona: profile.persona,
        step: 'step5_results'
      });

      setContent(response.content);
      setSource(response.source);
    };
    fetchContent();
  }, [profile]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Results & Beyond
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          The vote is cast, but the process isn't over. How do we count the votes and form a government?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-3">
            <ListChecks className="w-6 h-6 text-blue-500" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Counting Day</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-3">
            <PieChart className="w-6 h-6 text-indigo-500" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Majority Analysis</h4>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-3">
            <CalendarSync className="w-6 h-6 text-green-500" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">New Government</h4>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm [&>p]:mb-4 [&>p]:text-slate-600 [&>p]:leading-relaxed [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-6 [&>h3]:font-bold [&>h3]:text-lg [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>li]:text-slate-600 [&>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4">
        {source === 'cms_fallback' && (
          <div className="mb-4 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Offline Mode: AI network congestion detected. Showing pre-verified CMS curriculum.
          </div>
        )}
        {source === 'crowd_cache' && (
          <div className="mb-4 bg-sky-50 text-sky-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global Cache: Pulled latest response from community due to offline limits.
          </div>
        )}
        {source === 'local_cache' && (
          <div className="mb-4 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            Edge Cache: Instant load from your device.
          </div>
        )}
        
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-24 bg-slate-100 rounded w-full"></div>
            <div className="h-24 bg-slate-100 rounded w-full"></div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white text-center sm:text-left relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <h3 className="text-2xl font-bold mb-2">Your Civic Duty Continues</h3>
        <p className="text-slate-300 max-w-md mx-auto sm:mx-0 leading-relaxed">
          Democracy isn't just about voting every few years. It's about ongoing participation, holding leaders accountable, and staying informed.
        </p>
      </div>

      <MythBuster topic="Vote Counting and Results" country={profile.countryName} />
      <GeminiQuiz topic="Forming a Government" country={profile.countryName} onPass={onPass} />

      {/* Civic Passport Final Reward */}
      {stamps.length === 5 && (
        <div className="mt-12 bg-amber-50 rounded-3xl p-8 border-4 border-amber-200 text-center relative overflow-hidden shadow-xl animate-in fade-in zoom-in duration-700">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
           <div className="relative z-10">
             <div className="w-24 h-24 mx-auto bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white mb-6 transform -rotate-12">
               <span className="text-5xl">🏛️</span>
             </div>
             <h2 className="text-3xl font-black text-amber-900 mb-2 uppercase tracking-tight">2026 Voter Ready</h2>
             <p className="text-amber-700 font-medium mb-6 uppercase tracking-widest text-sm">Official Civic Passport • {profile.countryName}</p>
             <p className="text-amber-800/80 mb-8 max-w-md mx-auto">
               Congratulations! You have completed all steps and passed the tests. You are officially prepared for the 2026 elections.
             </p>
             <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 active:scale-95">
               Share Official Status
             </button>
           </div>
        </div>
      )}
    </div>
  );
};
