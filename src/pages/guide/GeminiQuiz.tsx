import { logger } from "../../utils/logger";
import { useState, useEffect } from "react";
import { BrainCircuit, Trophy, ArrowRight, CheckCircle, AlertCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateText } from "../../services/geminiService";
import { crowdCache } from "../../services/firestoreCache";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

interface GeminiQuizProps {
  topic: string;
  country: string;
  onPass?: () => void;
}

interface Question {
  q: string;
  options: string[];
  answer: number;
}

export const GeminiQuiz = ({ topic, country, onPass }: GeminiQuizProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || questions.length === 0) return;

    setIsSaved(true);
    const contentId = `quiz_${Date.now()}`;
    const payload = {
      id: contentId,
      type: "quiz",
      content: JSON.stringify({ topic, country, questions }),
      savedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "users", user.uid, "saved_content", contentId), payload);
    } catch (err) {
      logger.warn("Failed to bookmark quiz", err);
      setIsSaved(false);
    }
  };

  useEffect(() => {
    if (finished && score === 3) {
      onPass?.();
    }
  }, [finished, score, onPass]);

  const startQuiz = async () => {
    setIsOpen(true);
    if (!hasStarted) {
      setLoading(true);
      const cacheKey = `quiz_${country}_${topic.replace(/[^a-zA-Z0-9]/g, '_')}`;

      const cached = await crowdCache.getQuiz(cacheKey);
      if (cached && cached.content) {
        try {
          const parsed = JSON.parse(cached.content);
          setQuestions(parsed);
          setHasStarted(true);
          setLoading(false);
          return;
        } catch { /* JSON parse fallback — cached content may be malformed */ }
      }

      const prompt = `Generate exactly 3 multiple-choice questions about '${topic}' for elections in ${country}. 
      Format strictly as a JSON array of objects. Keys: "q" (string, the question), "options" (array of exactly 4 strings), "answer" (number 0-3, the index of the correct option). Don't use markdown blocks.`;

      const response = await generateText(prompt);
      try {
        const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        const newData = parsed.slice(0, 3);
        setQuestions(newData);
        setHasStarted(true);

        crowdCache.saveQuiz({
          cache_key: cacheKey,
          country,
          topic,
          content: JSON.stringify(newData),
          timestamp: new Date().toISOString()
        });
      } catch {
        // Fallback silently
        setQuestions([
          { q: "What is the minimum voting age?", options: ["16", "18", "21", "25"], answer: 1 },
          { q: "Which document is primarily used to identify voters at the booth?", options: ["Library Card", "Voter ID Card", "Utility Bill", "Bank Statement"], answer: 1 },
          { q: "Why is voting important?", options: ["To win prizes", "To shape the government", "To get a day off", "It's not important"], answer: 1 }
        ]);
        setHasStarted(true);
      }
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);

    if (idx === questions[currentQ].answer) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      setSelected(null);
      if (currentQ < 2) {
        setCurrentQ(c => c + 1);
      } else {
        setFinished(true);
      }
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={startQuiz}
        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 relative overflow-hidden group text-left shadow-md hover:shadow-lg transition-all"
      >
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <BrainCircuit className="w-6 h-6 text-blue-50" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 shadow-sm">Take the Step Quiz</h3>
              <p className="text-blue-100 text-sm font-medium">3 short questions • Earn a badge</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
      </button>
    );
  }

  return (
    <div className="w-full mt-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <BrainCircuit className="w-5 h-5 text-civic-blue" />
          {finished ? "Quiz Complete!" : `Question ${currentQ + 1} of 3`}
        </div>
        <div className="flex items-center gap-4">
          {!finished && (
            <div className="text-sm font-medium text-slate-400">Score: {score}</div>
          )}
          {hasStarted && user && (
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={cn(
                "p-1.5 rounded-full transition-colors flex items-center gap-1",
                isSaved ? "text-civic-blue bg-blue-100" : "text-slate-400 hover:text-civic-blue hover:bg-blue-50"
              )}
              title="Save Quiz to your Vault"
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-full mb-6"></div>
            {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>)}
          </div>
        ) : finished ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-amber-50/50">
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">You scored {score}/3</h3>
            <p className="text-slate-500 mb-6">
              {score === 3 ? "Perfect! You earned the Step Badge." : "Great effort! Review the guide to master this topic."}
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
            >
              Close Quiz
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <fieldset className="w-full">
                <legend className="text-lg font-bold text-slate-800 mb-6 leading-snug w-full">
                  {questions[currentQ]?.q}
                </legend>

                <div className="space-y-3">
                  {questions[currentQ]?.options.map((opt, idx) => {
                    const isSelected = selected === idx;
                    const isCorrect = idx === questions[currentQ].answer;
                    const showResult = selected !== null;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={showResult}
                        aria-pressed={isSelected}
                        className={cn(
                          "w-full p-4 text-left font-medium rounded-xl border-2 transition-all duration-200 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-civic-blue",
                          !showResult && "border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/50 text-slate-700",
                          showResult && isCorrect && "border-green-500 bg-green-50 text-green-800",
                          showResult && isSelected && !isCorrect && "border-red-500 bg-red-50 text-red-800",
                          showResult && !isSelected && !isCorrect && "border-slate-100 bg-slate-50 text-slate-400 opacity-50"
                        )}
                      >
                        {opt}
                        {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" aria-label="Correct" />}
                        {showResult && isSelected && !isCorrect && <AlertCircle className="w-5 h-5 text-red-500" aria-label="Incorrect" />}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
