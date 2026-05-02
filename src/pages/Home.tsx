import { Globe } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "../lib/LanguageContext";
import { useElectionNews } from "../hooks/useElectionNews";

// Sub-components
import { HeroSection } from "../components/home/HeroSection";
import { NewsWidget } from "../components/home/NewsWidget";
import { FeatureHighlights } from "../components/home/FeatureHighlights";

export const Home = () => {
  const { t } = useTranslation([
    "Now supporting 15+ countries globally",
    "Your guided journey to",
    "understanding democracy.",
    "Democracy isn't just about voting; it's about knowing how your voice counts. CivicPath simplifies the election process step by step, in your own language.",
    "Start My Journey",
    "Explore Library",
    "Available For Voters In",
    "Live Election News",
    "Real-time updates to keep you informed",
    "Check back later for live updates.",
    "Why use CivicPath?",
    "Built to eliminate friction, linguistic barriers, and misinformation for first-time voters.",
    "AI-Powered Companion",
    "Got a question about voting? Our CivicBot answers it instantly, fact-checking against verified sources.",
    "Deep Localization",
    "Not just translations. Our platform maps exactly to your country's local democratic framework and processes.",
    "Accessible Voice Mode",
    "Prefer listening? Every step can be read aloud, and you can speak directly to the assistant in 22+ languages.",
    "How it works",
    "Three simple steps to becoming an informed and prepared voter.",
    "Choose Your Country",
    "Select where you vote. We adapt the entire guide to your local election commission rules.",
    "Follow The Journey",
    "Walk through step-by-step interactive modules covering registration, candidates, and voting day.",
    "Vote With Confidence",
    "Earn your readiness badge, get directions to your polling station, and make your voice heard."
  ]);
  const flags = [
    { country: "India", code: "in" },
    { country: "United States", code: "us" },
    { country: "United Kingdom", code: "gb" },
    { country: "Brazil", code: "br" },
    { country: "Canada", code: "ca" },
    { country: "Australia", code: "au" },
    { country: "South Africa", code: "za" },
    { country: "Japan", code: "jp" },
    { country: "Mexico", code: "mx" },
    { country: "Indonesia", code: "id" },
  ];

  const { news, loadingNews } = useElectionNews();

  return (
    <div className="flex flex-col items-center">

      {/* 1. Hero Section */}
      <HeroSection t={t} />

      {/* 2. Infinite Flag Marquee */}
      <section className="w-full bg-slate-50 border-y border-slate-200 overflow-hidden py-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 mb-6 text-center relative z-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Globe className="w-4 h-4 text-slate-300" /> {t("Available For Voters In")}
          </p>
        </div>

        {/* Marquee Container */}
        <div className="flex w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-2">
            {[...flags, ...flags, ...flags, ...flags, ...flags, ...flags].map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-2.5 mx-3 shrink-0 justify-center bg-white rounded-full shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group cursor-default">
                <img
                  src={`https://flagcdn.com/w40/${f.code}.png`}
                  srcSet={`https://flagcdn.com/w80/${f.code}.png 2x`}
                  alt={`${f.country} flag`}
                  className="w-7 h-7 rounded-full object-cover shadow-sm bg-slate-100 border border-slate-100 group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="font-semibold text-sm text-slate-600 group-hover:text-civic-blue transition-colors duration-300">{f.country}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live News Feature Section */}
      <NewsWidget t={t} news={news} loadingNews={loadingNews} />

      {/* 3. Feature Highlights */}
      <FeatureHighlights t={t} />

      {/* 4. How it Works */}
      <section className="w-full bg-slate-900 text-white py-24 rounded-t-[3rem] mt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{t("How it works")}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">{t("Three simple steps to becoming an informed and prepared voter.")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-civic-blue via-saffron to-civic-green rounded-full opacity-50 -z-10" />

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-civic-blue text-white rounded-full flex items-center justify-center text-3xl font-bold border-8 border-slate-900 mb-6 shadow-[0_0_30px_rgba(30,58,138,0.5)]">1</div>
              <h3 className="text-xl font-bold mb-3">{t("Choose Your Country")}</h3>
              <p className="text-slate-400">{t("Select where you vote. We adapt the entire guide to your local election commission rules.")}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-saffron text-white rounded-full flex items-center justify-center text-3xl font-bold border-8 border-slate-900 mb-6 shadow-[0_0_30px_rgba(249,115,22,0.5)]">2</div>
              <h3 className="text-xl font-bold mb-3">{t("Follow The Journey")}</h3>
              <p className="text-slate-400">{t("Walk through step-by-step interactive modules covering registration, candidates, and voting day.")}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-civic-green text-white rounded-full flex items-center justify-center text-3xl font-bold border-8 border-slate-900 mb-6 shadow-[0_0_30px_rgba(22,163,74,0.5)]">3</div>
              <h3 className="text-xl font-bold mb-3">{t("Vote With Confidence")}</h3>
              <p className="text-slate-400">{t("Earn your readiness badge, get directions to your polling station, and make your voice heard.")}</p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};
