import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  CalendarPlus,
  Trophy,
  CheckCircle2,
  MapPin,
  Award,
  User,
  Flame,
  Sparkles,
  X,
  Calendar
} from "lucide-react";
import confetti from "canvas-confetti";
import { generateText } from "../services/geminiService";
import { useLanguage } from "../lib/LanguageContext";

// Mock implementation of user data
const USER_DATA = {
  country: "India",
  persona: "Student / Youth",
  language: "English",
  overallScore: 92,
  badges: ["Democracy Rookie", "Mythbuster Pro", "Ready to Vote"],
  pollingStation: "Government Boys Higher Secondary School, Mylapore, Chennai",
  completionDates: {
    registration: "April 20, 2026",
    research: "April 22, 2026",
    candidates: "April 24, 2026",
    votingDay: "April 25, 2026",
    postElection: "April 26, 2026",
  },
};

const REPORT_EVENTS = [
  {
    title: "Voter Registration Deadline",
    start: "20260415T000000Z",
    end: "20260415T235959Z",
    description: "Last day to register to vote.",
  },
  {
    title: "Election Day",
    start: "20260515T013000Z",
    end: "20260515T123000Z",
    description: "Go vote at your assigned polling station!",
  },
  {
    title: "Results Day",
    start: "20260604T023000Z",
    end: "20260604T103000Z",
    description: "Tune in for the final election results.",
  },
];

const createCalLink = (title: string, startDate: string, endDate: string, details: string) => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startDate}/${endDate}`,
    details: details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const generateICS = (countryName: string) => {
  let icsString =
    "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CivicPath//Voter Calendar//EN\n";
  REPORT_EVENTS.forEach((event) => {
    icsString += "BEGIN:VEVENT\n";
    icsString += `DTSTART:${event.start}\n`;
    icsString += `DTEND:${event.end}\n`;
    icsString += `SUMMARY:${countryName} - ${event.title}\n`;
    icsString += `DESCRIPTION:${event.description}\n`;
    icsString += "END:VEVENT\n";
  });
  icsString += "END:VCALENDAR";

  const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `CivicPath_${countryName.replace(/\s+/g, "_")}_Election_Dates.ics`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const ReportPage = () => {
  const { t, language } = useLanguage();
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [summary, setSummary] = useState<string>(
    t("Loading your personalized civic readiness summary from AI...")
  );
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reducedMotion) {
      const duration = 3500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ["#3b82f6", "#f59e0b", "#10b981"],
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ["#3b82f6", "#f59e0b", "#10b981"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }

    const fetchSummary = async () => {
      setLoadingSummary(true);
      const prompt = `Write a 3-sentence highly encouraging and inspiring summary for a first-time voter in ${USER_DATA.country} (Persona: ${USER_DATA.persona}) who just completed their civic readiness journey and scored ${USER_DATA.overallScore}% on their quizzes. Emphasize that their vote is their voice. Address them directly ("You") and keep it concise but powerful. Don't use bullet points.
Respond in the language specified by this BCP-47 tag: ${language}`;
      const response = await generateText(prompt);
      setSummary(response);
      setLoadingSummary(false);
    };

    fetchSummary();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCalendarSync = () => {
    setShowCalendarModal(true);
  };

  // Circular progress calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (USER_DATA.overallScore / 100) * circumference;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-16 pb-24">
      
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-4 mb-10"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t("Your Action Plan")}</h1>
          <p className="text-slate-500 font-medium mt-1">{t("Export, save, and sync your details to ensure you're ready.")}</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto mt-4 sm:mt-0">
          <button
            onClick={handleCalendarSync}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-sm"
          >
            <CalendarPlus className="w-5 h-5 text-civic-blue" /> {t("Sync Dates")}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-civic-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" /> {t("Save PDF")}
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-[2rem] p-8 md:p-16 shadow-2xl border border-slate-200 printable-report relative overflow-hidden"
        id="report-document"
      >
        {/* Decorative Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-100/40 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between border-b-[3px] border-slate-100 pb-10 mb-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              <div className="w-24 h-24 bg-gradient-to-br from-civic-blue to-blue-700 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-900/20 shrink-0 border border-white relative">
                <CheckCircle2 className="w-12 h-12 text-white" />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="mt-2 md:mt-1">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest rounded-md mb-3">
                  {t("Official Completion Record")}
                 </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-none mb-3">
                  {t("Civic Readiness Report")}
                </h1>
                <p className="text-slate-500 font-semibold text-lg">
                  {t("Issued on")} {new Date().toLocaleDateString(language, { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
            
            {/* Circular Knowledge Score */}
            <div className="mt-8 md:mt-0 flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r={radius} stroke="#f1f5f9" strokeWidth="10" fill="none" />
                  <motion.circle 
                    cx="56" cy="56" r={radius} 
                    stroke="currentColor" 
                    strokeWidth="10" 
                    fill="none" 
                    className="text-civic-blue"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    style={{ strokeDasharray: circumference }}
                  />
                </svg>
                <div className="text-center absolute">
                  <span className="text-3xl font-black text-slate-800">{USER_DATA.overallScore}</span>
                  <span className="text-slate-400 font-bold text-sm">/100</span>
                </div>
              </div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2 block text-center">Score</span>
            </div>
          </div>

          {/* User Meta info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
                <MapPin className="text-blue-500 w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Region</div>
                <div className="font-black text-slate-800 text-lg">{USER_DATA.country}</div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
                <User className="text-slate-700 w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("Voting Profile")}</div>
                <div className="font-black text-slate-800 text-lg">{USER_DATA.persona}</div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200">
                <Flame className="text-amber-500 w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("Language")}</div>
                <div className="font-black text-slate-800 text-lg">{USER_DATA.language}</div>
              </div>
            </div>
          </div>

          {/* AI Summary - Emphasized */}
          <div className="mb-12 p-8 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-xl flex items-start gap-5 relative overflow-hidden">
            {/* Sparkle background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>
            
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center shrink-0 shadow-inner relative z-10">
              <Sparkles className="w-6 h-6 text-blue-100" />
            </div>
            <div className="relative z-10 w-full">
              <h3 className="font-black text-xl text-white mb-3 tracking-tight">{t("Your Civic Potential")}</h3>
              {loadingSummary ? (
                <div className="space-y-2 w-full animate-pulse opacity-80">
                  <div className="h-4 bg-white/30 rounded w-full"></div>
                  <div className="h-4 bg-white/30 rounded w-5/6"></div>
                  <div className="h-4 bg-white/30 rounded w-4/6"></div>
                </div>
              ) : (
                <p className="text-blue-50 leading-relaxed font-medium md:text-lg">
                  {summary}
                </p>
              )}
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/20 text-blue-100/70">
                <span className="text-[10px] uppercase font-black tracking-widest">{t("Powered securely by Google Gemini Flash")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Modules Tracking */}
            <div>
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-6 bg-civic-blue rounded-full"></div> {t("Modules Completed")}
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Registration Setup", date: USER_DATA.completionDates.registration },
                  { name: "Research & Facts", date: USER_DATA.completionDates.research },
                  { name: "Candidate Verification", date: USER_DATA.completionDates.candidates },
                  { name: "Voting Day Plan", date: USER_DATA.completionDates.votingDay }
                ].map((step, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                    key={idx} 
                    className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-civic-blue/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-bold text-slate-700">{t(step.name)}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-sm">{step.date}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Badges & Location */}
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-5 flex items-center gap-2">
                  <div className="w-2 h-6 bg-amber-500 rounded-full"></div> {t("Badges Earned")}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {USER_DATA.badges.map((badge, i) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + (i * 0.1), type: "spring" }}
                      key={i} 
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl"
                    >
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span className="font-black text-sm">{t(badge)}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800 mb-5 flex items-center gap-2">
                  <div className="w-2 h-6 bg-indigo-500 rounded-full"></div> {t("Polling Booth Assigned")}
                </h3>
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110">
                    <MapPin className="w-24 h-24" />
                  </div>
                  <div className="relative z-10 flex gap-4 items-start">
                    <div className="mt-1 bg-white p-2 rounded-lg border border-slate-200">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">{t("Official Location")}</div>
                      <div className="text-base font-bold text-slate-800 leading-snug pr-8">
                        {USER_DATA.pollingStation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t-2 border-dashed border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-slate-300" />
              <p className="text-xs font-black uppercase tracking-widest">CivicPath • 2026 Edition</p>
            </div>
            <div className="text-xs font-bold font-mono bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
              ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </div>
          </div>

        </div>
      </motion.div>

      {/* Calendar Sync Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm print:hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-civic-blue" /> {t("Save Dates to Calendar")}
              </h2>
              <button 
                onClick={() => setShowCalendarModal(false)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {REPORT_EVENTS.map((event, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm">{event.title}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {new Date(event.start.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, "$1-$2-$3T$4:$5:$6Z")).toLocaleDateString(language, { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <a 
                    href={createCalLink(event.title, event.start, event.end, event.description)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 bg-white text-xs font-bold text-slate-700 border border-slate-200 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Google
                  </a>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => generateICS(USER_DATA.country)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors"
              >
                <Download className="w-4 h-4" /> {t("Download All (.ics)")}
              </button>
              <p className="mt-3 text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
                {t("Supported by Apple & Outlook")}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

