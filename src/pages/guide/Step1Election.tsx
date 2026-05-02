import { logger } from "../../utils/logger";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { generateGuideContent, ContentSource } from "../../services/geminiService";
import { MythBuster } from "./MythBuster";
import { GeminiQuiz } from "./GeminiQuiz";
import { Landmark, AlertTriangle, Globe, HardDrive } from "lucide-react";
import type { JourneyProfile } from "../../types";

interface WikiSummary {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
  };
}

export const Step1Election = ({ profile, onPass }: { profile: JourneyProfile, onPass?: () => void }) => {
  const [intro, setIntro] = useState("");
  const [wikiData, setWikiData] = useState<WikiSummary | null>(null);
  const [source, setSource] = useState<ContentSource | null>(null);

  useEffect(() => {    // 1. Fetch AI Intro using Quad-Layer cache
    const fetchIntro = async () => {
      const prompt = `Write a 3-paragraph plain language explanation of what an election is and why democracy matters. 
      Tailor it specifically for a ${profile.persona} in ${profile.countryName}. 
      Use simple, encouraging language. Write in markdown. Output ONLY the markdown text.`;

      const response = await generateGuideContent(prompt, {
        country: profile.country,
        persona: profile.persona,
        step: 'step1_election'
      });

      setIntro(response.content);
      setSource(response.source);
    };

    fetchIntro();

    // 2. Fetch Wikipedia Data for Parliament
    const fetchWiki = async () => {
      // Map country codes to their parliament/congress names for Wikipedia search
      const parliamentNames: Record<string, string> = {
        in: "Parliament_of_India",
        us: "United_States_Congress",
        gb: "Parliament_of_the_United_Kingdom",
        br: "National_Congress_of_Brazil",
        ca: "Parliament_of_Canada",
        au: "Parliament_of_Australia",
        za: "Parliament_of_South_Africa"
      };

      const title = parliamentNames[profile.country] || "Legislature";
      if (title !== "Legislature") {
        try {
          const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, {
            headers: { 'Api-User-Agent': 'CivicPath/1.0 (https://github.com/prompt-wars)' }
          });
          const data = await res.json();
          setWikiData(data);
        } catch (e) {
          logger.error('Wikidata fetch failed', e);
        }
      }
    };

    fetchWiki();
  }, [profile]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          What is an Election?
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          The foundation of democracy is your voice. Let's understand how the system works.
        </p>
      </div>

      {wikiData && (
        <div className="bg-white border text-center sm:text-left border-slate-200 rounded-2xl overflow-hidden mb-8 shadow-sm flex flex-col sm:flex-row">
          {wikiData.thumbnail ? (
            <img
              src={wikiData.thumbnail.source}
              alt={wikiData.title}
              className="w-full sm:w-48 h-48 sm:h-auto object-cover shrink-0 filter contrast-125"
            />
          ) : (
             <div className="w-full sm:w-48 h-48 bg-slate-100 flex items-center justify-center shrink-0">
               <Landmark className="w-12 h-12 text-slate-300" />
             </div>
          )}
          <div className="p-5 sm:p-6 flex flex-col justify-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Institution Focus</div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">{wikiData.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
              {wikiData.extract}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm [&>p]:mb-4 [&>p]:text-slate-600 [&>p]:leading-relaxed [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-6 [&>h3]:font-bold [&>h3]:text-lg [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>li]:text-slate-600 [&>li]:mb-1">
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

        {intro ? (
          <ReactMarkdown>{intro}</ReactMarkdown>
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          </div>
        )}
      </div>

      <MythBuster topic="How Democracy Works" country={profile.countryName} />
      <GeminiQuiz topic="Fundamentals of Elections" country={profile.countryName} onPass={onPass} />
    </div>
  );
};
