import { logger } from "../utils/logger";
import { useState, useEffect, useRef } from "react";
import { motion, } from "framer-motion";
import { Mic, Send, Bot, AlertCircle, Loader2, Sparkles, Languages, CheckCircle2, RefreshCw } from "lucide-react";
import Markdown from "react-markdown";
import DOMPurify from "dompurify";
import { generateChat } from "../services/geminiService";
import { useAuth } from "../lib/AuthContext";
import { useLanguage } from "../lib/LanguageContext";
import { useToast } from "../lib/ToastContext";

interface AssistantChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  source?: string;
}

const SUGGESTED_PROMPTS = [
  "How does an EVM work?",
  "What is the Model Code of Conduct?",
  "What is NOTA?",
  "How many Lok Sabha seats are there?",
  "How do I check my Voter ID?",
  "What happens if no party gets a majority?"
];

export const AssistantPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<AssistantChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { profile: authProfile, saveProfile } = useAuth();

  // Persistence
  useEffect(() => {
    if (authProfile?.chatHistory) {
      setMessages(authProfile.chatHistory as AssistantChatMessage[]);
    } else {
      const saved = localStorage.getItem("civicpath_assistant_chat");
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
        } catch {
          /* Intentionally suppressed: localStorage may contain corrupt JSON from older versions */
        }
      } else {
        // Intro message
        setMessages([{
          id: "intro",
          role: "ai",
          text: t("Namaskaram! I am your **CivicBot AI Assistant**. I'm here to answer any questions you have about voting, elections, candidates, and democratic processes in India.\n\nHow can I help you prepare today?"),
        } as AssistantChatMessage]);
      }
    }
  }, [authProfile]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("civicpath_assistant_chat", JSON.stringify(messages));
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    let newMessages = [...messages];
    const userMsg: AssistantChatMessage = { id: Date.now().toString(), role: "user", text: text.trim() };
    newMessages.push(userMsg);
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Save user message to cloud immediately
    await saveProfile({ chatHistory: newMessages.slice(-50) });

    try {
      const langNames: Record<string, string> = { "en": "English", "hi": "Hindi", "ta": "Tamil", "es": "Spanish" };
      const currentLangName = langNames[language] || "English";
      const completedSteps = authProfile?.stamps?.length || 0;

      const systemInstruction = `You are CivicBot, an official, strictly non-partisan AI assistant for first-time voters in India (2026).
Your goal is to educate voters on civic duties, election processes (EVM, VVPAT, Lok Sabha, Model Code of Conduct), and voter rights.
CRITICAL RULES:
- ONLY answer questions related to civics, voting, democracy, elections, or government processes.
- For non-civic questions (e.g., "how to bake a cake", "write a poem", "write code"), politely decline and steer the conversation back to voting.
- Do NOT express political opinions, biases, or endorse any party.
- If asked about facts, formulate your answer based on official Election Commission of India guidelines.
- Context: The user has completed ${completedSteps} out of 5 steps in their civic journey. Praise them if they talk about their progress!
- The user's preferred language is ${currentLangName}. You MUST reply entirely in ${currentLangName}.`;

      // Pass only last 10 messages for context
      const history = newMessages.slice(-10).map(m => ({ role: m.role, text: m.text }));

      const rawResponse = await generateChat(history, systemInstruction);

      // Sanitize response to prevent XSS
      const cleanResponse = DOMPurify.sanitize(rawResponse);

      const aiMsg: AssistantChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: cleanResponse,
        source: "Election Commission Guidelines (Simulated AI)"
      };

      newMessages = [...newMessages, aiMsg];
      setMessages(newMessages);

      // Save AI message to cloud
      await saveProfile({ chatHistory: newMessages.slice(-50) });

      // Automatically speak the response if the user just used voice input previously
      // (This is a simplified version; normally we'd trigger TTS here if voice mode is active)

    } catch {
      newMessages = [...newMessages, { id: Date.now().toString(), role: "ai", text: "I encountered a network issue. Please try asking again." }];
      setMessages(newMessages);
    } finally {
      setIsTyping(false);
    }
  };

  // Web Speech API for Native STT
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast("Voice input is not supported in your browser.", "error");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    // Access the vendor-prefixed SpeechRecognition constructor
    // Types are declared globally in vite-env.d.ts
    interface WindowWithSpeech extends Window {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    }
    const windowWithSpeech = window as unknown as WindowWithSpeech;
    const SpeechRec = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
    if (!SpeechRec) return;
    const recognition = new SpeechRec();

    recognition.continuous = false;
    recognition.interimResults = false;
    // Map language to BCP 47 tags for recognition accuracy
    const langMap: Record<string, string> = { "en": "en-IN", "hi": "hi-IN", "ta": "ta-IN", "es": "es-ES" };
    recognition.lang = langMap[language] || "en-IN";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto send after speaking? Let's just put it in the input box so user can edit.
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      logger.error(event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleClearHistory = async () => {
    localStorage.removeItem("civicpath_assistant_chat");
    const initChat: AssistantChatMessage[] = [{
      id: "intro",
      role: "ai",
      text: t("Chat history cleared. I'm ready for your questions!"),
    }];
    setMessages(initChat);
    await saveProfile({ chatHistory: initChat });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 relative">

      {/* Header Panel */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-civic-blue rounded-xl flex items-center justify-center text-white shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-slate-800 text-lg leading-tight">{t("CivicBot Assistant")}</h1>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t("Online & Ready")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleClearHistory} className="p-2 text-slate-400 hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-civic-blue rounded" title={t("Clear Chat")}>
            <RefreshCw className="w-4 h-4" />
            <span className="sr-only">{t("Clear Chat")}</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-civic-blue">
            <Languages className="w-4 h-4 text-slate-500 ml-1" aria-hidden="true" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none pr-2 cursor-pointer"
              aria-label={t("Select Language")}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" aria-live="polite" aria-atomic="false">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === "user" ? "bg-slate-800 text-white" : "bg-civic-blue text-white shadow-md"
                }`}>
                  {msg.role === "user" ? "U" : <Bot className="w-5 h-5" />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-1.5">
                  <div className={`p-4 rounded-[1.5rem] text-sm md:text-base leading-relaxed ${
                    msg.role === "user"
                      ? "bg-slate-800 text-white rounded-tr-sm"
                      : "bg-white text-slate-700 border border-slate-200 rounded-tl-sm shadow-sm markdown-body"
                  }`}>
                    {msg.role === "user" ? (
                      msg.text
                    ) : (
                      <Markdown>{msg.text}</Markdown>
                    )}
                  </div>

                  {/* Fact Check Badge for AI */}
                  {msg.role === "ai" && msg.source && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold ml-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {msg.source}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-civic-blue flex items-center justify-center shrink-0 mt-1 shadow-md text-white">
                   <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-[1.5rem] rounded-tl-sm shadow-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Prompts (Only show if history is short) */}
      {messages.length <= 2 && !isTyping && (
        <div className="px-4 pb-4 max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t("Suggested Queries")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(t(prompt))}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:border-civic-blue hover:text-civic-blue transition-colors shadow-sm text-left"
              >
                {t(prompt)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">

          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-end gap-2 relative"
          >
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                aria-label={t("Ask about EVMs, candidates, or polling booths")}
                placeholder={t("Ask about EVMs, candidates, or polling booths...")}
                rows={input.split('\\n').length > 1 ? Math.min(input.split('\\n').length, 4) : 1}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-14 py-4 text-base focus:outline-none focus:border-civic-blue focus:ring-2 focus:ring-civic-blue transition-colors resize-none overflow-hidden block"
                style={{ minHeight: "56px" }}
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-3 bottom-2.5 p-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-civic-blue ${
                  isListening
                    ? "bg-red-50 text-red-500 animate-pulse"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Mic className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">{isListening ? t("Stop listening") : t("Start listening")}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-4 bg-civic-blue text-white rounded-2xl hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-civic-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shrink-0 h-[56px] w-[56px] flex items-center justify-center"
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Send className="w-5 h-5 ml-1" aria-hidden="true" />}
              <span className="sr-only">{t("Send message")}</span>
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            <AlertCircle className="w-3 h-3" />
            {t("AI can make mistakes. Always verify with official EC guidelines.")}
          </div>
        </div>
      </div>
    </div>
  );
};
