import { BrainCircuit, Globe, AudioLines } from "lucide-react";
import { motion } from "motion/react";

export const FeatureHighlights = ({ t }: { t: (key: string) => string }) => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">{t("Why use CivicPath?")}</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">{t("Built to eliminate friction, linguistic barriers, and misinformation for first-time voters.")}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-100 transition-colors group">
          <div className="w-12 h-12 bg-blue-50 text-civic-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t("AI-Powered Companion")}</h3>
          <p className="text-slate-600">{t("Got a question about voting? Our CivicBot answers it instantly, fact-checking against verified sources.")}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-green-100 transition-colors group">
          <div className="w-12 h-12 bg-green-50 text-civic-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t("Deep Localization")}</h3>
          <p className="text-slate-600">{t("Not just translations. Our platform maps exactly to your country's local democratic framework and processes.")}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-orange-100 transition-colors group">
          <div className="w-12 h-12 bg-orange-50 text-saffron rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <AudioLines className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t("Accessible Voice Mode")}</h3>
          <p className="text-slate-600">{t("Prefer listening? Every step can be read aloud, and you can speak directly to the assistant in 22+ languages.")}</p>
        </motion.div>
      </div>
    </section>
  );
};
