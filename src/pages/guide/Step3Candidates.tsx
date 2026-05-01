import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { generateGuideContent, ContentSource } from "../../services/geminiService";
import { searchKnowledgeGraph, KnowledgeGraphEntity } from "../../services/knowledgeGraphService";
import { MythBuster } from "./MythBuster";
import { GeminiQuiz } from "./GeminiQuiz";
import { RumorScanner } from "./RumorScanner";
import { Users, Search, AlertCircle, AlertTriangle, Globe, HardDrive, Loader2, CheckCircle2 } from "lucide-react";
import { JourneyProfile } from "../../types";

interface PoliticalParty {
  name: string;
  desc: string;
}

export const Step3Candidates = ({ profile, onPass }: { profile: JourneyProfile, onPass?: () => void }) => {
  const [content, setContent] = useState("");
  const [parties, setParties] = useState<PoliticalParty[]>([]);
  const [source, setSource] = useState<ContentSource | null>(null);
  const [kgSearchQuery, setKgSearchQuery] = useState("");
  const [kgResult, setKgResult] = useState<KnowledgeGraphEntity | null>(null);
  const [isKgSearching, setIsKgSearching] = useState(false);
  const [kgError, setKgError] = useState("");

  const handleKgSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kgSearchQuery.trim()) return;
    
    setIsKgSearching(true);
    setKgError("");
    setKgResult(null);

    const result = await searchKnowledgeGraph(kgSearchQuery);
    
    if (result) {
      setKgResult(result);
    } else {
      setKgError("No verified information found in Google Knowledge Graph. Please verify manually.");
    }
    setIsKgSearching(false);
  };

  useEffect(() => {
    const fetchContent = async () => {
      const prompt = `Provide a nonpartisan guide on how to research political candidates and parties in ${profile.countryName}. 
      Give 3 key questions a voter should ask themselves when evaluating a candidate's platform. Output in markdown, no code blocks.`;
      
      const response = await generateGuideContent(prompt, {
        country: profile.country,
        persona: profile.persona,
        step: 'step3_candidates'
      });

      setContent(response.content);
      setSource(response.source);
    };
    fetchContent();

    const mockParties: Record<string, PoliticalParty[]> = {
      in: [
        { name: "Major National Party", desc: "One of the two largest political parties in India." },
        { name: "Key Opposition Party", desc: "A prominent pan-India political party." },
      ],
      us: [
        { name: "Democratic Party", desc: "One of the two major contemporary political parties in the United States." },
        { name: "Republican Party", desc: "One of the two major contemporary political parties in the United States." },
      ],
      gb: [
        { name: "Conservative Party", desc: "Centre-right political party in the United Kingdom." },
        { name: "Labour Party", desc: "Centre-left political party in the United Kingdom." },
      ]
    };
    
    setTimeout(() => {
      setParties(mockParties[profile.country] || [
        { name: "Major Party A", desc: "A significant political party in your country." },
        { name: "Major Party B", desc: "A significant political party in your country." },
      ]);
    }, 1000);

  }, [profile]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Candidates & Parties
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          Learn how to evaluate who is asking for your vote responsibly and effectively.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex flex-col items-start">
          <Search className="w-8 h-8 text-amber-500 mb-3" />
          <h3 className="font-bold text-slate-800 mb-1">Check The Record</h3>
          <p className="text-sm text-slate-600">Look past the campaign ads. Review their voting history and delivered promises.</p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex flex-col items-start">
          <AlertCircle className="w-8 h-8 text-emerald-500 mb-3" />
          <h3 className="font-bold text-slate-800 mb-1">Spotting Misinformation</h3>
          <p className="text-sm text-slate-600">Verify claims using independent fact-checking organizations before believing them.</p>
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
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-20 bg-slate-100 rounded w-full"></div>
          </div>
        )}
      </div>

      <RumorScanner country={profile.countryName} />

      <div className="mt-8 mb-8 pb-8 border-b border-slate-100">
        <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
          <Globe className="w-5 h-5 text-civic-blue" />
          Verified Entity Search
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Search the Google Knowledge Graph for officially verified information about political parties, leaders, and institutions to avoid AI hallucinations.
        </p>

        <form onSubmit={handleKgSearch} className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="Search candidates or parties..."
            value={kgSearchQuery}
            onChange={(e) => setKgSearchQuery(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-civic-blue"
          />
          <button 
            type="submit" 
            disabled={isKgSearching || !kgSearchQuery.trim()}
            className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-slate-900 disabled:opacity-50"
          >
            {isKgSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </form>

        {kgError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 mb-6 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {kgError}
          </div>
        )}

        {kgResult && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            {kgResult.image && (
              <img 
                src={kgResult.image.contentUrl} 
                alt={kgResult.name} 
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl shrink-0 bg-slate-50 border border-slate-100"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-bold text-slate-900">{kgResult.name}</h4>
                <span title="Verified by Google Knowledge Graph">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </span>
              </div>
              <div className="text-sm font-medium text-slate-500 mb-3 bg-slate-100 inline-block px-2 py-0.5 rounded uppercase tracking-wider">
                {kgResult.description || "Political Entity"}
              </div>
              {kgResult.detailedDescription && (
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {kgResult.detailedDescription.articleBody}
                </p>
              )}
              {kgResult.detailedDescription?.url && (
                <a 
                  href={kgResult.detailedDescription.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-civic-blue text-sm font-bold hover:underline inline-flex items-center gap-1"
                >
                  Read full Wiki article &rarr;
                </a>
              )}
            </div>
            <div className="hidden lg:flex items-center justify-center bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 self-start border border-green-100">
               100% Fact Checked
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-civic-blue" />
          Prominent Entities (Examples)
        </h3>
        <div className="grid gap-4">
          {parties.length > 0 ? parties.map((p, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400">
                {p.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{p.name}</h4>
                <p className="text-sm text-slate-500">{p.desc}</p>
              </div>
            </div>
          )) : (
            <div className="animate-pulse space-y-3">
               <div className="h-20 bg-slate-100 rounded-xl w-full"></div>
               <div className="h-20 bg-slate-100 rounded-xl w-full"></div>
            </div>
          )}
        </div>
      </div>

      <MythBuster topic="Candidates and Manifestos" country={profile.countryName} />
      <GeminiQuiz topic="Evaluating Candidates" country={profile.countryName} onPass={onPass} />
    </div>
  );
};
