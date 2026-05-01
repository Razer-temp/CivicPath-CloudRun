import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Volume2, Globe, Loader2, Play } from "lucide-react";

const INDIC_LANGUAGES = [
  "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", 
  "Urdu", "Gujarati", "Kannada", "Odia", "Malayalam", 
  "Punjabi", "Assamese", "Maithili", "Sanskrit", "Dogri", 
  "Manipuri", "Bodo", "Santali", "Kashmiri", "Sindhi", 
  "Konkani", "Nepali"
];

// Fallback logic for Hackathon since actual Bhashini keys are hard to get
// We will simulate the latency and provide a mocked translation flow if native APIs fail
export const SakshamVoice = () => {
  const [selectedLang, setSelectedLang] = useState("Hindi");
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  
  const handleMicClick = () => {
    if (status === "idle") {
      setStatus("listening");
      setIsRecording(true);
      setTranscript("");
      setAiResponse("");
      
      // Simulate listening for 4 seconds
      setTimeout(() => {
        setStatus("processing");
        setIsRecording(false);
        setTranscript(`आप कैसे मतदान कर सकते हैं? (Mocked ASR in ${selectedLang})`);
        
        // Simulate Gemini API processing + Translation
        setTimeout(() => {
          setStatus("speaking");
          setAiResponse("मतदान करने के लिए, आपको मतदाता सूची में पंजीकृत होना होगा। मतदान के दिन पोलिंग बूथ पर अपना EPIC कार्ड ले जाएं।");
          
          // Simulate TTS finishing
          setTimeout(() => {
            setStatus("idle");
          }, 6000);
          
        }, 2500);
      }, 4000);
    } else if (status === "listening") {
      // Manual stop
      setStatus("processing");
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
      {/* Left side: Controls */}
      <div className="md:w-1/3 bg-slate-50 p-6 md:p-8 flex flex-col justify-between border-r border-slate-200">
        <div>
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" /> 
            Select Language
          </label>
          <select 
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none appearance-none cursor-pointer"
            disabled={status !== "idle"}
          >
            {INDIC_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-2">Powered by Bhashini AI & Gemini 2.5 Flash</p>
        </div>

        <div className="mt-10 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMicClick}
            disabled={status === "processing" || status === "speaking"}
            className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-2xl relative ${
              status === "listening" 
                ? "bg-red-500 animate-pulse" 
                : status === "processing" 
                  ? "bg-blue-500" 
                  : status === "speaking"
                    ? "bg-green-500"
                    : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {/* Wave rings */}
            {status === "listening" && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-red-500 opacity-20 animate-ping" style={{ animationDuration: '1.5s' }} />
                <div className="absolute -inset-4 rounded-full border-4 border-red-500 opacity-10 animate-ping" style={{ animationDuration: '2s' }} />
              </>
            )}
            
            {status === "listening" && <Square className="w-10 h-10 fill-current" />}
            {status === "processing" && <Loader2 className="w-10 h-10 animate-spin" />}
            {status === "speaking" && <Volume2 className="w-10 h-10 animate-pulse" />}
            {status === "idle" && <Mic className="w-12 h-12" />}
          </motion.button>
          
          <div className="mt-6 text-center font-bold text-slate-700 h-6">
            {status === "listening" && "Listening... Tap to stop"}
            {status === "processing" && "Translating & Thinking..."}
            {status === "speaking" && "Speaking Answer..."}
            {status === "idle" && "Speak in your language"}
          </div>
        </div>
      </div>

      {/* Right side: Transcript & AI Output */}
      <div className="md:w-2/3 p-6 md:p-10 flex flex-col">
        <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-6 mb-4 relative overflow-hidden">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">You asked:</div>
          <div className="text-lg text-slate-700 min-h-[40px] italic">
            {transcript || <span className="text-slate-300">Your transcribed speech will appear here...</span>}
          </div>
        </div>

        <div className="flex-1 bg-orange-50/50 rounded-2xl border border-orange-100 p-6 relative overflow-hidden">
          <div className="text-xs font-bold text-orange-600/70 uppercase tracking-widest mb-2 flex items-center gap-2">
            CivicPath AI 
            {status === "speaking" && (
              <span className="flex gap-1">
                <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-orange-500 rounded-full"></motion.span>
                <motion.span animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-orange-500 rounded-full"></motion.span>
                <motion.span animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-orange-500 rounded-full"></motion.span>
              </span>
            )}
          </div>
          <div className="text-xl text-slate-800 font-medium leading-relaxed min-h-[100px]">
            {aiResponse || <span className="text-slate-300 font-normal">The AI's answer in your language...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
