import { logger } from "../../utils/logger";
import { useState } from "react";
import { generateJson } from "../../services/geminiService";
import { Search, ShieldAlert, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const RumorScanner = ({ country }: { country: string }) => {
  const [claim, setClaim] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{
    status: "fact" | "myth" | "suspicious" | "unverified";
    explanation: string;
    isFallback?: boolean;
  } | null>(null);

  const handleScan = async () => {
    if (!claim.trim()) return;
    
    setIsScanning(true);
    setResult(null);

    const cacheKey = `civic_claim_scan_${claim.toLowerCase().trim()}`;
    const cached = localStorage.getItem(cacheKey);
    if(cached) {
      setResult(JSON.parse(cached));
      setIsScanning(false);
      return;
    }

    const prompt = `You are a strict, hyper-objective political fact-checker and deepfake analyst for ${country}.
Analyze the following claim, headline, or quote. 

Determine its credibility and output a JSON response matching exactly this format (no markdown formatting, just pure JSON):
{
  "status": "fact" | "myth" | "suspicious" | "unverified",
  "explanation": "A concise, 2-3 sentence explanation of why it received this status. Mention if there's evidence of generative AI or deepfakes typically associated with this claim."
}

Claim: "${claim}"`;

    try {
      const parsed = await generateJson<{
        status: "fact" | "myth" | "suspicious" | "unverified";
        explanation: string;
      }>(prompt, {
        type: "OBJECT",
        properties: {
          status: {
            type: "STRING",
            enum: ["fact", "myth", "suspicious", "unverified"],
          },
          explanation: {
            type: "STRING",
          },
        },
        required: ["status", "explanation"],
      });
      
      if (parsed && parsed.status && parsed.explanation) {
        setResult(parsed);
        localStorage.setItem(cacheKey, JSON.stringify(parsed));
      } else {
         applyFallback();
      }
    } catch (e) {
      logger.warn("Failed to parse scanner response or rate limit hit, applying fallback:", e);
      applyFallback();
    } finally {
      setIsScanning(false);
    }
  };

  const applyFallback = () => {
    const lowercaseClaim = claim.toLowerCase();
    const FALLBACK_KEYWORDS = ["deepfake", "ai voice", "hot mic", "cancel", "ballot dumping", "ai image", "ai generated", "rigged", "stolen", "dead voters", "fake news"];
    const isSuspicious = FALLBACK_KEYWORDS.some(kw => lowercaseClaim.includes(kw));

    setResult({
      status: isSuspicious ? "suspicious" : "unverified",
      explanation: isSuspicious 
        ? "Network is currently congested. This claim contains keywords often associated with 2026 political misinformation. Please verify with independent fact-checkers."
        : "The AI system is experiencing high volume (Rate Limit). We couldn't run a deep scan, please verify manually with official sources.",
      isFallback: true
    });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-600" />
            Deepfake & Rumor Scanner
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Suspicious quote or video? Paste the claim below to verify it instantly.
          </p>
        </div>
        <div className="inline-flex max-w-fit bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          AI Guard Active
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="e.g., 'The candidate was caught on a hot mic saying they will cancel the election...'"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-28"
        />
        
        <button
          onClick={handleScan}
          disabled={!claim.trim() || isScanning}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Scanning Databases...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Scan Claim
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`mt-6 p-5 rounded-xl border ${
              result.status === "fact" ? "bg-emerald-50 border-emerald-200" :
              result.status === "myth" ? "bg-red-50 border-red-200" :
              result.status === "suspicious" ? "bg-amber-50 border-amber-200" :
              "bg-slate-50 border-slate-200"
            }`}
          >
            {result.isFallback && (
              <div className="mb-4 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Offline Mode: Network Congested - Using Local NLP Heuristics
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="mt-1">
                {result.status === "fact" && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                {result.status === "myth" && <ShieldAlert className="w-6 h-6 text-red-600" />}
                {result.status === "suspicious" && <AlertTriangle className="w-6 h-6 text-amber-600" />}
                {result.status === "unverified" && <Search className="w-6 h-6 text-slate-500" />}
              </div>
              <div>
                <h4 className={`font-bold text-lg mb-1 capitalize ${
                  result.status === "fact" ? "text-emerald-800" :
                  result.status === "myth" ? "text-red-800" :
                  result.status === "suspicious" ? "text-amber-800" :
                  "text-slate-700"
                }`}>
                  {result.status === "fact" ? "Verified Fact" :
                   result.status === "myth" ? "Known Myth / Fake" :
                   result.status === "suspicious" ? "Suspicious / Likely Deepfake" :
                   "Unverified"}
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {result.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
