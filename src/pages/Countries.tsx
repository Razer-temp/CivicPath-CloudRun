import { logger } from "../utils/logger";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, Users, Vote, Crown, Calendar, AlertTriangle, ArrowRight } from "lucide-react";
import { COUNTRIES } from "../data/CountryData";
import { fetchHeadsOfGovernment } from "../services/wikidataService";
import { useAuth } from "../lib/AuthContext";
import { useLanguage } from "../lib/LanguageContext";

interface RestCountryData {
  flag: string;
  population: number;
  emoji: string;
}

/** Shape of individual country objects returned by the REST Countries v3.1 API */
interface RestCountryApiResponse {
  cca2: string;
  population: number;
  flag: string;
  flags?: {
    svg?: string;
    png?: string;
  };
}

export const Countries = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { saveProfile } = useAuth();
  const [restData, setRestData] = useState<Record<string, RestCountryData>>({});
  const [headsOfGov, setHeadsOfGov] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Current simulation date for "within 6 months" logic
  const SIMULATION_NOW = new Date("2026-04-26");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch REST Countries API (Populations, flags, exact naming)
        const codes = COUNTRIES.map(c => c.id).join(',');
        const restResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes}`);
        if (restResponse.ok) {
          const rawRest = await restResponse.json();
          const mappedRest: Record<string, RestCountryData> = {};
          rawRest.forEach((country: RestCountryApiResponse) => {
            mappedRest[country.cca2.toLowerCase()] = {
              flag: country.flags?.svg || country.flags?.png || '',
              population: country.population,
              emoji: country.flag // Fallback emoji
            };
          });
          setRestData(mappedRest);
        }

        // 2. Fetch Live Wikidata (Head of Government via SPARQL)
        const wikidataIds = COUNTRIES.map(c => c.wikidataId);
        const fetchedHeads = await fetchHeadsOfGovernment(wikidataIds);
        setHeadsOfGov(fetchedHeads);
      } catch (err) {
        logger.error("Failed fetching external APIs in /countries", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCountrySelect = async (countryId: string, countryName: string) => {
    // Read existing profile to keep persona if already onboarded
    const rawProfile = localStorage.getItem("civicpath_profile");
    const profile = rawProfile ? JSON.parse(rawProfile) : { persona: "citizen", language: "en" };

    profile.country = countryId;
    profile.countryName = countryName;
    localStorage.setItem("civicpath_profile", JSON.stringify(profile));

    await saveProfile({ profile });

    // Jump straight into the guide Step 1
    navigate("/guide");
  };

  const isUrgent = (date: Date) => {
    const diffTime = date.getTime() - SIMULATION_NOW.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 180; // Within 6 months
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 py-16 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 w-96 h-96 pointer-events-none translate-x-1/3 -translate-y-1/3">
          <Globe className="w-full h-full text-white" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">
            {t("Country Explorer")}
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto drop-shadow font-medium">
            {t("Browse 15+ major democracies. Track upcoming global elections, electoral systems, and navigate directly into a tailored voting guide.")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl shadow-sm border border-slate-200">
            <Globe className="w-12 h-12 text-blue-500 animate-spin mb-4 opacity-50" />
            <p className="font-bold text-slate-500">{t("Synchronizing Global Electoral Data...")}</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {COUNTRIES.map((country) => {
              const rData = restData[country.id] || {};
              const urgent = isUrgent(country.nextElectionDate);
              const head = headsOfGov[country.wikidataId] || "Loading...";

              return (
                <motion.div
                  key={country.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  onClick={() => handleCountrySelect(country.id, country.name)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col relative"
                >
                  {urgent && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-amber-500"></div>
                  )}

                  {/* Top: Flag & Title */}
                  <div className="p-5 flex items-start gap-4 border-b border-slate-50">
                    <div className="w-16 h-12 rounded bg-slate-100 overflow-hidden shrink-0 shadow-sm border border-slate-200 flex items-center justify-center text-3xl relative">
                      <img
                        src={`https://flagcdn.com/${country.id}.svg`}
                        alt={`${country.name} flag`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <span className="opacity-0">{rData.emoji || "🏳️"}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{t(country.name)}</h3>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" />
                        {rData.population ? (rData.population / 1000000).toFixed(1) + "M" : `${country.estimatedVoters.replace('~', '')} Voters`}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Details Grid */}
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">{t("Head of Government")}</div>
                        <div className="text-sm font-semibold text-slate-800 leading-snug">{head === "Loading..." ? t(head) : head}</div>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <Vote className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">{t("System & Method")}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">{t(country.systemType)}</span>
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">{t(country.votingMethod)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${urgent ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                        {urgent ? <AlertTriangle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">{t("Next Election")}</div>
                        <div className={`text-sm font-bold ${urgent ? 'text-amber-600' : 'text-slate-800'}`}>
                          {t(country.nextElection)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Action bar */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center group-hover:bg-blue-50 transition-colors">
                    <div className="text-xs font-semibold text-slate-500">
                      ~{country.estimatedVoters} {t("Voters")}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                      {t("Guide")} <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

