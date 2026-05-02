import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarRange, CalendarPlus, ChevronRight, BarChart3, AlertCircle } from "lucide-react";
import { TIMELINE_CMS } from "../data/TimelineData";
import { COUNTRIES } from "./JourneySetup";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "../lib/LanguageContext";

const data = [
  { year: "2004", turnout: 58.07, youth: 45 },
  { year: "2009", turnout: 58.21, youth: 48 },
  { year: "2014", turnout: 66.44, youth: 55 },
  { year: "2019", turnout: 67.40, youth: 61 },
  { year: "2024", turnout: 65.79, youth: 58 },
];

export const TimelinePage = () => {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<string>("in"); // Default India
  const [activeEvent, setActiveEvent] = useState<string | null>(null);

  const currentTimeline = TIMELINE_CMS[selectedCountry] || TIMELINE_CMS["in"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

      {/* Header & Country Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight flex items-center gap-3 mb-4">
            <CalendarRange className="text-civic-blue w-10 h-10 md:w-12 md:h-12" />
            {t("Election Timeline")}
          </h1>
          <p className="text-slate-500 text-lg md:text-xl">
            {t("Never miss a deadline. Follow the complete electoral life cycle and sync key dates directly to your calendar.")}
          </p>
        </div>

        <div className="shrink-0 w-full md:w-72 bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5">{t("Select Country")}</label>
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setActiveEvent(null);
              }}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 text-slate-800 text-base font-bold rounded-xl py-3.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-civic-blue cursor-pointer"
            >
              {COUNTRIES.filter(c => TIMELINE_CMS[c.id]).map(country => (
                <option key={country.id} value={country.id}>{t(country.name)}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <ChevronRight className="w-5 h-5 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Timeline Interactive Container */}
      <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-sm border border-slate-200 mb-12 overflow-visible relative">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <CalendarRange className="w-64 h-64 text-slate-900" />
        </div>

        {/* Horizontal Desktop / Vertical Mobile Container */}
        <div className="relative z-10 w-full pt-4 md:pt-16 pb-4">

          {/* The connecting line (background) */}
          <div className="absolute top-8 md:top-[85px] bottom-8 md:bottom-auto left-[27px] md:left-[5%] md:right-[5%] md:translate-x-0 w-[3px] md:w-[90%] md:h-[3px] bg-slate-100 rounded-full z-0"></div>

          <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-4 relative z-10">
            {currentTimeline.map((event, index) => {
              const isActive = activeEvent === event.id;

              return (
                <div key={event.id} className="flex-1 flex flex-row md:flex-col items-start md:items-center relative group min-w-[120px]">

                  {/* Node Marker */}
                  <button
                    onClick={() => setActiveEvent(isActive ? null : event.id)}
                    className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm relative z-20 ${
                      event.isVotingDay
                        ? "bg-civic-blue border-white text-white drop-shadow-lg md:scale-125"
                        : event.isMCC
                          ? "bg-amber-500 border-white text-white drop-shadow-md"
                          : isActive
                            ? "bg-slate-800 border-white text-white scale-110 drop-shadow-md"
                            : "bg-white border-slate-200 text-slate-400 hover:border-civic-blue hover:text-civic-blue hover:scale-110"
                    }`}
                  >
                    <span className="font-bold text-lg">{index + 1}</span>
                    {isActive && (
                      <span className="absolute -inset-2 rounded-full border border-slate-800/10 animate-ping z-0"></span>
                    )}
                  </button>

                  {/* Content Container */}
                  <div className={`mt-0 ml-6 md:ml-0 md:mt-8 w-full text-left md:text-center transition-all duration-300 ${isActive || event.isVotingDay ? 'opacity-100 translate-y-0' : 'opacity-70 group-hover:opacity-100 group-hover:-translate-y-1'}`}>

                    {event.isMCC && (
                      <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-2 md:mx-auto">{t("MCC Enforced")}</span>
                    )}

                    <h3 className={`font-bold leading-tight md:text-lg mb-1 md:break-words md:px-2 ${event.isVotingDay ? 'text-civic-blue' : 'text-slate-800'}`}>
                      {t(event.title)}
                    </h3>
                    <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wide">{t(event.date)}</p>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 bg-white p-5 rounded-2xl border border-slate-200 text-left overflow-hidden w-full md:absolute md:w-[320px] md:left-1/2 md:-translate-x-1/2 md:mt-6 z-50 shadow-2xl"
                        >
                          {event.isVotingDay && selectedCountry === "in" && (
                            <div className="mb-4 bg-blue-50 text-civic-blue p-3 rounded-lg flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <p className="text-xs font-semibold leading-relaxed">{t("India runs its elections in multiple geographic phases. Your exact polling day depends on your constituency.")}</p>
                            </div>
                          )}
                          <p className="text-sm text-slate-600 mb-5 leading-relaxed">{t(event.description)}</p>

                          {event.calendarLink && (
                            <a
                              href={event.calendarLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex w-full items-center justify-center gap-2 bg-slate-900 text-white text-sm font-bold py-3 px-4 rounded-xl hover:bg-civic-blue transition-colors shadow-sm"
                            >
                              <CalendarPlus className="w-4 h-4" /> {t("Add to Calendar")}
                            </a>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Looker Studio Embed Section - Historical Data Overlay */}
      <div className="bg-slate-900 rounded-[2rem] p-6 md:p-12 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-900/40 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">

          <div className="flex-1 text-white">
            <div className="inline-flex bg-white/10 border border-white/20 text-blue-200 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> {t("Live Public Data")}
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">{t("Voter Turnout Trends")}</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              {t("Explore historical voting data directly connected to a live Google Sheets database via Looker Studio (simulated here via Recharts for the hackathon). See how your demographic has participated in past elections to understand the power of your vote today.")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                 <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
                   <div className="w-2 h-2 bg-blue-400 rounded-full"></div> {t("General Turnout")}
                 </div>
                 <div className="text-2xl font-black text-white">65.8%</div>
                 <div className="text-xs text-slate-400 mt-1">{t("2024 National Average")}</div>
               </div>
               <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                 <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
                   <div className="w-2 h-2 bg-indigo-400 rounded-full"></div> {t("Youth Turnout (18-25)")}
                 </div>
                 <div className="text-2xl font-black text-white">58.0%</div>
                 <div className="text-xs text-slate-400 mt-1">{t("2024 National Average")}</div>
               </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 h-[350px] bg-slate-800 rounded-2xl overflow-hidden shadow-2xl relative group border border-slate-700/50 p-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-white font-bold text-sm uppercase tracking-wide">{t("Historical Turnout (%)")}</h3>
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded font-mono">{t("Looker Studio Embed")}</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorTurnout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorYouth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontWeight: 'bold' }}
                  itemStyle={{ fontWeight: 'normal' }}
                />
                <Area type="monotone" dataKey="turnout" name={t("Overall Turnout")} stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTurnout)" />
                <Area type="monotone" dataKey="youth" name={t("Youth Turnout")} stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorYouth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>

    </div>
  );
};

