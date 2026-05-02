import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const HeroSection = ({ t }: { t: (key: string) => string }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pt-20 pb-24 text-center overflow-hidden">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col items-center">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4 text-saffron" />
          <span>{t("Now supporting 15+ countries globally")}</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 text-balance leading-tight">
          {t("Your guided journey to")} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-civic-blue to-blue-500">{t("understanding democracy.")}</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto text-balance">
          {t("Democracy isn't just about voting; it's about knowing how your voice counts. CivicPath simplifies the election process step by step, in your own language.")}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/journey-setup"
            className="group relative inline-flex justify-center items-center gap-2 bg-saffron text-white px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/20"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative">{t("Start My Journey")}</span>
            <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/learn"
            className="inline-flex justify-center items-center gap-2 bg-white text-slate-700 hover:text-slate-900 px-8 py-4 rounded-full font-semibold text-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            {t("Explore Library")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};
