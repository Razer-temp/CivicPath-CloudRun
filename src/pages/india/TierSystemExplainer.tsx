import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, ChevronDown, Users, Calendar, Gavel, Crown } from "lucide-react";

type Chamber = {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  icon: LucideIcon;
  role: string;
  members: string;
  term: string;
  elected: string;
};

const chambers: Chamber[] = [
  {
    id: "lok-sabha",
    name: "Lok Sabha",
    subtitle: "House of the People (National)",
    color: "from-blue-500 to-blue-700",
    icon: Users,
    role: "The primary legislative body. The party with a majority here forms the Union Government and chooses the Prime Minister.",
    members: "543 MPs (Members of Parliament)",
    term: "5 Years",
    elected: "Directly elected by citizens in General Elections using First-Past-The-Post."
  },
  {
    id: "rajya-sabha",
    name: "Rajya Sabha",
    subtitle: "Council of States (National)",
    color: "from-red-500 to-red-700",
    icon: Crown,
    role: "Acts as a house of review representing the states and union territories at the national level.",
    members: "245 MPs (Maximum 250)",
    term: "6 Years (1/3rd retire every 2 years)",
    elected: "Indirectly elected by Members of the Legislative Assemblies (MLAs) of states."
  },
  {
    id: "vidhan-sabha",
    name: "Vidhan Sabha",
    subtitle: "Legislative Assembly (State)",
    color: "from-green-600 to-green-800",
    icon: Gavel,
    role: "The state-level legislature. The party with a majority forms the State Government and chooses the Chief Minister.",
    members: "Varies by state (e.g. UP has 403, Goa has 40)",
    term: "5 Years",
    elected: "Directly elected by citizens in State Elections (crucial for 2026)."
  }
];

export const TierSystemExplainer = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="w-full grid gap-4 md:grid-cols-3">
      {chambers.map((chamber) => (
        <div
          key={chamber.id}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
        >
          <div
            onClick={() => setExpandedId(expandedId === chamber.id ? null : chamber.id)}
            className={`p-6 bg-gradient-to-br ${chamber.color} text-white cursor-pointer hover:opacity-95 transition-opacity relative overflow-hidden`}
          >
            <div className="absolute right-[-10%] top-[-10%] opacity-10">
              <chamber.icon className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-bold mb-1 relative z-10">{chamber.name}</h3>
            <p className="text-white/80 font-medium text-sm relative z-10 pr-6">{chamber.subtitle}</p>

            <motion.div
              animate={{ rotate: expandedId === chamber.id ? 180 : 0 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/20"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </motion.div>
          </div>

          <AnimatePresence>
            {expandedId === chamber.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white"
              >
                <div className="p-6 space-y-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role & Power</div>
                    <p className="text-sm text-slate-700">{chamber.role}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Members</div>
                      <p className="text-sm font-medium text-slate-800">{chamber.members}</p>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Term Length</div>
                      <p className="text-sm font-medium text-slate-800 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-400" /> {chamber.term}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">How Elected</div>
                    <p className="text-sm text-slate-700">{chamber.elected}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
