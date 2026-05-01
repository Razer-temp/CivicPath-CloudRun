import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { generateGuideContent, ContentSource } from "../../services/geminiService";
import { MythBuster } from "./MythBuster";
import { GeminiQuiz } from "./GeminiQuiz";
import { AddToCalendar } from "./AddToCalendar";
import { FileText, Link as LinkIcon, Info, AlertTriangle, Globe, HardDrive } from "lucide-react";

import { JourneyProfile } from "../../types";

export const Step2Registration = ({ profile, onPass }: { profile: JourneyProfile, onPass?: () => void }) => {
  const [content, setContent] = useState("");
  const [source, setSource] = useState<ContentSource | null>(null);
  
  // Simulated CMS Data (In production, this would come from Google Sheets API)
  const deadlines: Record<string, { date: Date, display: string, link: string }> = {
    in: { date: new Date(2026, 3, 10), display: "April 10, 2026", link: "https://voters.eci.gov.in/" },
    us: { date: new Date(2026, 9, 15), display: "October 15, 2026", link: "https://vote.gov/" },
    gb: { date: new Date(2026, 4, 15), display: "May 15, 2026", link: "https://www.gov.uk/register-to-vote" },
    ca: { date: new Date(2026, 9, 15), display: "October 15, 2026", link: "https://ereg.elections.ca/CWelcome.aspx" },
    br: { date: new Date(2026, 4, 6), display: "May 6, 2026", link: "https://www.tse.jus.br/eleitor/titulo-de-eleitor" },
    au: { date: new Date(2025, 4, 1), display: "To Be Announced (Estimated May 2025)", link: "https://www.aec.gov.au/enrol/" },
  };

  const cData = deadlines[profile.country] || { date: new Date(2026, 5, 1), display: "June 1, 2026", link: "https://example.com/register" };

  useEffect(() => {
    const fetchContent = async () => {
      const prompt = `Explain the voter registration process step-by-step for a ${profile.persona} in ${profile.countryName}. 
      Mention the general eligibility age. Make it 3 clear steps. Output in markdown. Do not include markdown \`\`\` blocks, just the text.`;
      
      const response = await generateGuideContent(prompt, {
        country: profile.country,
        persona: profile.persona,
        step: 'step2_registration'
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
          Voter Registration
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          Before you can cast your vote, you must be on the electoral roll. Here is how to ensure you are registered.
        </p>
      </div>

      {/* Deadline Banner */}
      <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1">Upcoming Deadline</div>
          <div className="text-xl font-bold text-blue-900">{cData.display}</div>
          <div className="text-sm text-blue-700 mt-1">General cutoff for new registrations</div>
        </div>
        <AddToCalendar 
          title="Voter Registration Deadline" 
          description={`Last day to register to vote for the upcoming ${profile.countryName} elections.`} 
          date={cData.date} 
        />
      </div>

      {/* AI Generated Steps */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm [&>p]:mb-4 [&>p]:text-slate-600 [&>p]:leading-relaxed [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-6 [&>h3]:font-bold [&>h3]:text-lg [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>li]:text-slate-600 [&>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
          <FileText className="w-5 h-5 text-civic-blue" />
          <h2 className="!my-0 !text-lg">How to Register in {profile.countryName}</h2>
        </div>
        
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
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-20 bg-slate-100 rounded w-full"></div>
            <div className="h-20 bg-slate-100 rounded w-full"></div>
          </div>
        )}
      </div>

      {/* Action Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
         <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
           <Info className="w-8 h-8 text-slate-400" />
         </div>
         <div className="text-center sm:text-left flex-1">
           <h3 className="font-bold text-slate-800 mb-1">Ready to register?</h3>
           <p className="text-sm text-slate-500 mb-4 sm:mb-0">Visit the official portal to complete your registration online.</p>
         </div>
         <a 
           href={cData.link}
           target="_blank"
           rel="noopener noreferrer"
           className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center shrink-0"
         >
           Official Portal <LinkIcon className="w-4 h-4" />
         </a>
      </div>

      <MythBuster topic="Voter Registration" country={profile.countryName} />
      <GeminiQuiz topic="Registration Process" country={profile.countryName} onPass={onPass} />
    </div>
  );
};
