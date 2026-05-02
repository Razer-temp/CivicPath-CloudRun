import { logger } from "../utils/logger";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Volume2,
  Languages,
  Sparkles,
  ChevronDown,
  X,
  MessageSquare,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { LEARN_TOPICS, LearnTopic } from "../data/LearnData";
import { generateText } from "../services/geminiService";
import { searchKnowledgeGraph, KnowledgeGraphEntity } from "../services/knowledgeGraphService";
import { useLanguage } from "../lib/LanguageContext";

export const LearnPage = () => {
  const { t } = useLanguage();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [kgDataCache, setKgDataCache] = useState<Record<string, KnowledgeGraphEntity>>({});
  const [loadingKg, setLoadingKg] = useState(false);

  // Translation State
  const [translatingCard, setTranslatingCard] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [targetLanguage, setTargetLanguage] = useState<string>("Spanish"); // Default

  // AI Panel State
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<LearnTopic | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isTyping]);

  const fetchKnowledgeData = async (query: string, id: string) => {
    if (expandedCard === id) {
      setExpandedCard(null);
      return;
    }

    setExpandedCard(id);

    if (kgDataCache[id]) return; // Already cached

    setLoadingKg(true);
    try {
      // First try Knowledge Graph
      const kgResult = await searchKnowledgeGraph(query);
      if (kgResult) {
         setKgDataCache((prev) => ({ ...prev, [id]: kgResult }));
      } else {
         // Fallback to Wikipedia if KG has nothing
         const res = await fetch(
           `https://en.wikipedia.org/api/rest_v1/page/summary/${query.replace(" ", "_")}`,
           { headers: { 'Api-User-Agent': 'CivicPath/1.0 (https://github.com/prompt-wars)' } }
         );
         if (res.ok) {
           const data = await res.json();
           setKgDataCache((prev) => ({ ...prev, [id]: {
             name: data.title,
             description: "Wikipedia Article",
             detailedDescription: {
               articleBody: data.extract,
               url: data.content_urls?.desktop?.page || ""
             },
             image: data.thumbnail ? { contentUrl: data.thumbnail.source } : undefined
           } }));
         }
      }
    } catch (err) {
      logger.error("Failed to fetch Knowledge data", err);
    } finally {
      setLoadingKg(false);
    }
  };

  const handleListen = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const handleTranslate = async (text: string, id: string) => {
    if (translations[id]) {
      // Toggle back to English or re-translate?
      // For simplicity, we just trigger it again if they change language later, or we can toggle.
      // Let's just run it.
    }
    setTranslatingCard(id);
    try {
      const prompt = `Translate the following text into ${targetLanguage}. Return ONLY the translated text, no other commentary:\n\n"${text}"`;
      const res = await generateText(prompt);
      setTranslations((prev) => ({ ...prev, [id]: res }));
    } catch (err) {
      logger.error("Translation failed", err);
    } finally {
      setTranslatingCard(null);
    }
  };

  const openAiPanel = (topic: LearnTopic) => {
    setActiveTopic(topic);
    setChatHistory([
      {
        role: "ai",
        text: `Hi! I'm your civic guide. What would you like to know about "${topic.title}"?`,
      },
    ]);
    setAiPanelOpen(true);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || !activeTopic) return;

    const userMessage = chatInput;
    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const prompt = `You are a friendly civic educator. The user is asking about the following topic: "${activeTopic.title}". 
User's specific question: "${userMessage}".
Answer their question concisely in simple, easy-to-understand terms. Keep it informative but accessible to a first-time voter.`;

      const response = await generateText(prompt);
      setChatHistory((prev) => [...prev, { role: "ai", text: response }]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: "Oops, I encountered an issue. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 pb-24 relative">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight flex items-center gap-3 mb-4">
          <BookOpen className="text-civic-blue w-10 h-10 md:w-12 md:h-12" />
          {t("Learning Library")}
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mb-6">
          {t("Browse and understand essential civic topics. Use the tools to listen, translate, or ask AI for a deeper dive. No sign-up required.")}
        </p>

        {/* Global Translation Selector */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl inline-flex shadow-sm border border-slate-200">
          <Languages className="w-5 h-5 text-slate-400 ml-2" />
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 outline-none pr-4 cursor-pointer"
          >
            <option value="Spanish">Español (Spanish)</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="French">Français (French)</option>
            <option value="Tamil">தமிழ் (Tamil)</option>
            <option value="Swahili">Kiswahili (Swahili)</option>
          </select>
        </div>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEARN_TOPICS.map((topic) => {
          const isExpanded = expandedCard === topic.id;
          const wiki = kgDataCache[topic.id];
          const displayedText =
            translations[topic.id] || topic.shortDescription;
          const isTranslating = translatingCard === topic.id;

          return (
            <motion.div
              layout
              key={topic.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-3">
                {t(topic.title)}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                {displayedText}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => handleListen(displayedText)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" /> {t("Listen")}
                </button>
                <button
                  onClick={() =>
                    handleTranslate(topic.shortDescription, topic.id)
                  }
                  disabled={isTranslating}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isTranslating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Languages className="w-3.5 h-3.5" />
                  )}
                  {t("Translate")}
                </button>
                <button
                  onClick={() => openAiPanel(topic)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-civic-blue hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors ml-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {t("Ask AI")}
                </button>
              </div>

              {/* Knowledge Read More */}
              <div className="mt-auto border-t border-slate-100 pt-4">
                <button
                  onClick={() => fetchKnowledgeData(topic.title, topic.id)}
                  className="w-full flex items-center justify-between text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {t("Read more")}{wiki?.description !== 'Wikipedia Article' && wiki ? " (Verified)" : ""}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      {loadingKg && !wiki ? (
                        <div className="flex items-center gap-2 text-slate-400 text-xs py-4">
                          <Loader2 className="w-3 h-3 animate-spin" /> {t("Searching Knowledge Graph...")}
                        </div>
                      ) : wiki ? (
                        <div className="pt-4 pb-2">
                          {wiki.description !== 'Wikipedia Article' && (
                            <div className="flex items-center gap-1 mb-2 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3" /> Verified by Google Knowledge Graph
                            </div>
                          )}
                          <div className="flex gap-4 mb-3">
                            {wiki.image && (
                              <img
                                src={wiki.image.contentUrl}
                                alt={wiki.name}
                                className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-200"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-slate-800 leading-none mb-1">{wiki.name}</h4>
                              <p className="text-xs text-slate-500 mb-1">{wiki.description}</p>
                              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                {wiki.detailedDescription?.articleBody || "No further details available."}
                              </p>
                            </div>
                          </div>
                          {wiki.detailedDescription?.url && (
                             <a
                               href={wiki.detailedDescription.url}
                               target="_blank"
                               rel="noreferrer"
                               className="text-xs text-civic-blue font-bold hover:underline"
                             >
                               {t("View full article")} ↗
                             </a>
                          )}
                        </div>
                      ) : (
                        <div className="py-4 text-xs text-red-500">
                          {t("Failed to load Knowledge Graph data.")}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Side Panel */}
      <AnimatePresence>
        {aiPanelOpen && activeTopic && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiPanelOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-civic-blue rounded-full flex items-center justify-center text-white shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-none mb-1">
                      {t("Civic AI Tutor")}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {t("Topic:")} {t(activeTopic.title)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAiPanelOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-slate-800 text-white rounded-tr-sm"
                          : "bg-white text-slate-700 border border-slate-200 rounded-tl-sm shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-100 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t("Ask a clarifying question...")}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-civic-blue focus:ring-1 focus:ring-civic-blue transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isTyping}
                    className="p-3 bg-civic-blue text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </form>
                <div className="text-center mt-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {t("Powered by Google Gemini")}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
