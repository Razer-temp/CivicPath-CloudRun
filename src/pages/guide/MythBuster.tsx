import { logger } from "../../utils/logger";
import { useState } from "react";
import { Sparkles, Check, X, ChevronDown, ShieldAlert, Bookmark, BookmarkCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateText } from "../../services/geminiService";
import { crowdCache } from "../../services/firestoreCache";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

interface MythBusterProps {
  topic: string;
  country: string;
}

interface Myth {
  myth: string;
  fact: string;
}

export const MythBuster = ({ topic, country }: MythBusterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Myth[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || data.length === 0) return;

    setIsSaved(true);
    const contentId = `myth_${Date.now()}`;
    const payload = {
      id: contentId,
      type: "myth",
      content: JSON.stringify({ topic, country, data }),
      savedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "users", user.uid, "saved_content", contentId), payload);
    } catch (err) {
      logger.warn("Failed to bookmark content", err);
      setIsSaved(false);
    }
  };

  const handleReveal = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);

    if (!hasLoaded && data.length === 0) {
      setLoading(true);
      const cacheKey = `myth_${country}_${topic.replace(/[^a-zA-Z0-9]/g, '_')}`;

      const cached = await crowdCache.getMyth(cacheKey);
      if (cached && cached.content) {
        try {
          const parsed = JSON.parse(cached.content);
          setData(parsed);
          setHasLoaded(true);
          setLoading(false);
          return;
        } catch {
          // Fall through and regenerate
        }
      }

      const prompt = `Generate exactly 3 common myths and their facts about '${topic}' in the context of elections in ${country}. 
      Format strictly as a JSON array of objects with keys "myth" and "fact". Do not use markdown blocks, just the raw JSON array.`;

      const response = await generateText(prompt);

      try {
        // Strip markdown backticks if present
        const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        const newData = parsed.slice(0, 3);
        setData(newData);
        setHasLoaded(true);

        crowdCache.saveMyth({
          cache_key: cacheKey,
          country,
          myth: topic,
          content: JSON.stringify(newData),
          timestamp: new Date().toISOString()
        });
      } catch {
        // Fallback silently
        setData([
          { myth: "Elections are rigged.", fact: "Elections use highly secure, transparent systems checked by multiple independent observers." },
          { myth: "My vote doesn't matter.", fact: "Many local and national elections have been decided by incredibly small margins." },
          { myth: "Registering to vote is too difficult.", fact: "Registration has been simplified, often available online and taking less than 5 minutes." }
        ]);
        setHasLoaded(true);
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50/30 rounded-2xl border border-indigo-100 overflow-hidden mt-10">
      <div
        onClick={handleReveal}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              Myth Buster <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-sm text-slate-500 font-medium">{topic} - Reveal the truth</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {hasLoaded && user && (
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={cn(
                "p-2 rounded-full transition-colors flex items-center gap-1",
                isSaved ? "text-indigo-600 bg-indigo-100" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
              )}
              title="Save to your Vault"
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
          )}
          <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-indigo-100/50 mt-2 space-y-4">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white/50 p-4 rounded-xl space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                data.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100/50">
                    <div className="flex gap-3 mb-2">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 leading-snug">
                        <span className="text-red-600 uppercase text-[10px] tracking-wider mb-0.5 block">Myth</span>
                        {item.myth}
                      </p>
                    </div>

                    <div className="flex gap-3 pt-3 mt-3 border-t border-slate-50">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        <span className="text-green-600 font-bold uppercase text-[10px] tracking-wider mb-0.5 block">Fact</span>
                        {item.fact}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
