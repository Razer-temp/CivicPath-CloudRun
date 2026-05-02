import { logger } from "../utils/logger";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, MapPin, Search, ThermometerSun, AlertTriangle, ExternalLink, Sun, CloudRain, Cloud, X, Info } from "lucide-react";
import { Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { fetchHistoricalWeather } from "../services/weatherService";
import { useLanguage } from "../lib/LanguageContext";
import { useToast } from "../lib/ToastContext";

type Booth = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: string;
};

interface GoogleMapInnerProps {
  mapCenter: [number, number];
  mapZoom: number;
  results: Booth[];
  activeBooth: Booth | null;
  setActiveBooth: (booth: Booth | null) => void;
  getDirectionsUrl: (lat: number, lng: number) => string;
}

// -- Inner Component for Google Map handling --
const GoogleMapInner = ({ mapCenter, mapZoom, results, activeBooth, setActiveBooth, getDirectionsUrl }: GoogleMapInnerProps) => {
  const { t } = useLanguage();

  return (
    <Map
      center={{ lat: mapCenter[0], lng: mapCenter[1] }}
      zoom={mapZoom}
      disableDefaultUI={false}
      gestureHandling="greedy"
      mapId="a05d8fcc595180f1"
      style={{ width: "100%", height: "100%" }}
    >
      {results.map((booth: Booth) => (
        <AdvancedMarker
          key={booth.id}
          position={{ lat: booth.lat, lng: booth.lng }}
          onClick={() => setActiveBooth(booth)}
        >
          <Pin background={'#ef4444'} glyphColor={'#fff'} borderColor={'#b91c1c'} />
        </AdvancedMarker>
      ))}

      {activeBooth && (
        <InfoWindow
          position={{ lat: activeBooth.lat, lng: activeBooth.lng }}
          onCloseClick={() => setActiveBooth(null)}
        >
          <div className="font-sans min-w-[200px]">
            <div className="bg-slate-800 text-white p-2 text-xs font-bold uppercase tracking-wider rounded-t-lg mt-[-10px] mx-[-10px]">{activeBooth.distance} {t("away")}</div>
            <div className="p-3 pt-4 mx-[-10px] mb-[-10px] bg-white rounded-b-lg">
              <h4 className="font-bold text-slate-800 mb-1 leading-tight">{activeBooth.name}</h4>
              <p className="text-xs text-slate-500 leading-snug mb-2">{activeBooth.address}</p>
              <a
                href={getDirectionsUrl(activeBooth.lat, activeBooth.lng)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-blue-600 px-2 py-1 rounded hover:bg-blue-700 w-full justify-center mt-2"
              >
                {t("Navigate")} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
};

const geocode = async (query: string): Promise<{ lat: number, lng: number } | null> => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`);
    const data = await res.json();
    if (data && data.results && data.results.length > 0) {
      const loc = data.results[0].geometry.location;
      return { lat: loc.lat, lng: loc.lng };
    }
  } catch (err) {
    logger.error("Geocoding failed", err);
  }
  return null;
};

const generateSimulatedBooths = (lat: number, lng: number, isIndia: boolean): Booth[] => {
  const names = isIndia
    ? ["Govt Higher Secondary School", "Town Community Hall", "Municipal Corporation Office", "Public Library", "Primary Health Centre"]
    : ["Central High School Gym", "Civic Recreation Center", "Public Library", "Town Hall", "Main Post Office"];

  return Array.from({ length: Math.floor(Math.random() * 3) + 3 }).map((_, i) => {
    // +/- 0.03 degrees is roughly a few kilometers
    const oLat = lat + (Math.random() - 0.5) * 0.05;
    const oLng = lng + (Math.random() - 0.5) * 0.05;
    const distanceKm = (Math.random() * 3 + 0.1).toFixed(1);

    return {
      id: `sim_${i}_${Date.now()}`,
      name: names[i % names.length],
      address: isIndia ? "Sector Validation Block, Regional Election Zone" : "Local Polling Center, Main District",
      lat: oLat,
      lng: oLng,
      distance: isIndia ? `${distanceKm} km` : `${(Number(distanceKm) * 0.621371).toFixed(1)} miles`
    };
  }).sort((a, b) => parseFloat(a.distance as string) - parseFloat(b.distance as string));
};

interface WeatherInfo {
  maxTemp: number;
  minTemp: number;
  type: string;
  description: string;
}

export const MapPage = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [mode, setMode] = useState<"india" | "global">("india");

  // India Mode State
  const [inState, setInState] = useState("");
  const [inDistrict, setInDistrict] = useState("");
  const [inConstituency, setInConstituency] = useState("");

  // Global Mode State
  const [globalAddress, setGlobalAddress] = useState("");

  // Results & Loaders
  const [results, setResults] = useState<Booth[]>([]);
  const [activeBooth, setActiveBooth] = useState<Booth | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);

  const [showPurposeModal, setShowPurposeModal] = useState(false);

  const handleIndiaSearch = async () => {
    if (inState && inDistrict && inConstituency) {
      setIsSearching(true);
      const query = `${inConstituency}, ${inDistrict}, ${inState}, India`;
      const coords = await geocode(query);
      if (coords) {
        setMapCenter([coords.lat, coords.lng]);
        setMapZoom(13);
        setResults(generateSimulatedBooths(coords.lat, coords.lng, true));
      } else {
        // Fallback if not found
        setMapCenter([20.5937, 78.9629]);
        setResults([]);
        showToast("Could not load regional simulation data. Please try another area.", "error");
      }
      setIsSearching(false);
    }
  };

  const handleGlobalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (globalAddress.trim()) {
      setIsSearching(true);
      const coords = await geocode(globalAddress);
      if (coords) {
        setMapCenter([coords.lat, coords.lng]);
        setMapZoom(13);
        setResults(generateSimulatedBooths(coords.lat, coords.lng, false));
      } else {
        showToast("Location not found globally.", "error");
      }
      setIsSearching(false);
    }
  };

  const handleSelectBooth = async (booth: Booth) => {
    setActiveBooth(booth);
    setMapCenter([booth.lat, booth.lng]);
    setMapZoom(16);

    setLoadingWeather(true);
    try {
      const wData = await fetchHistoricalWeather(booth.lat, booth.lng, new Date());
      setWeather(wData);
    } finally {
      setLoadingWeather(false);
    }
  };

  const getDirectionsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  const renderWeatherIcon = (type: string) => {
    if (type === "sunny") return <Sun className="w-8 h-8 text-amber-500" />;
    if (type === "rain") return <CloudRain className="w-8 h-8 text-blue-500" />;
    return <Cloud className="w-8 h-8 text-slate-500" />;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50 relative">

      {/* Purpose Verification Modal */}
      <AnimatePresence>
        {showPurposeModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-indigo-600 p-6 text-white flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2"><Info className="w-5 h-5" /> {t("Quick Verification")}</h2>
                  <p className="opacity-90 text-sm mt-1">{t("To give you the best data, answer one question:")}</p>
                </div>
                <button onClick={() => setShowPurposeModal(false)} className="opacity-50 hover:opacity-100 transition-opacity">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-slate-600 text-sm font-medium">{t("Why are you searching for polling stations right now?")}</p>

                <a
                  href="https://electoralsearch.eci.gov.in/"
                  target="_blank" rel="noreferrer"
                  onClick={() => setShowPurposeModal(false)}
                  className="block w-full p-4 border-2 border-indigo-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
                >
                  <strong className="block text-slate-800">{t("I need to go vote today/soon")}</strong>
                  <span className="text-xs text-slate-500 block mt-1">{t("We will redirect you securely to the official Govt. Portal for exact 100% accurate listings based on your EPIC ID.")}</span>
                </a>

                <button
                  onClick={() => { setShowPurposeModal(false); /* The simulator handles the rest naturally */ }}
                  className="block w-full p-4 border-2 border-slate-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
                >
                  <strong className="block text-slate-800">{t("I am just exploring / learning")}</strong>
                  <span className="text-xs text-slate-500 block mt-1">{t("We will use our simulated 2026 data sandbox so you can test features without giving PII.")}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row h-full">

        {/* Left Side: Controls & Results */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-r border-slate-200 flex flex-col h-[50vh] md:h-full overflow-y-auto shadow-xl z-20">

          <div className="p-6 bg-white border-b border-slate-100">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 mb-2">
              <MapPin className="text-civic-blue w-7 h-7" />
              {t("Polling Station Finder")}
            </h1>
            <p className="text-slate-500 text-sm mb-6">{t("Find designated booths, plan routes, and check the forecast.")}</p>

            <div className="flex rounded-xl bg-slate-100 p-1 mb-6 shadow-inner">
              <button
                onClick={() => { setMode("india"); setResults([]); setMapCenter([20.5937, 78.9629]); setMapZoom(5); }}
                className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all duration-300 ${mode === "india" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-700"}`}
              >
                🇮🇳 {t("India Mode")}
              </button>
              <button
                onClick={() => { setMode("global"); setResults([]); setMapCenter([20, 0]); setMapZoom(2); }}
                className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all duration-300 ${mode === "global" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-700"}`}
              >
                🌍 {t("Global Search")}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === "india" ? (
                <motion.div key="india" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                  <div className="group">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 group-focus-within:text-civic-blue transition-colors">{t("State / UT")}</label>
                    <input
                      type="text"
                      placeholder={t("e.g. Maharashtra, Delhi")}
                      value={inState}
                      onChange={e => setInState(e.target.value)}
                      className="w-full p-3 text-sm rounded-xl border border-slate-200 outline-none focus:border-civic-blue focus:ring-4 focus:ring-civic-blue/10 bg-slate-50 hover:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 group-focus-within:text-civic-blue transition-colors">{t("District / City")}</label>
                    <input
                      type="text"
                      placeholder={t("e.g. Mumbai, New Delhi")}
                      value={inDistrict}
                      onChange={e => setInDistrict(e.target.value)}
                      className="w-full p-3 text-sm rounded-xl border border-slate-200 outline-none focus:border-civic-blue focus:ring-4 focus:ring-civic-blue/10 bg-slate-50 hover:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 group-focus-within:text-civic-blue transition-colors">{t("Constituency / Area")}</label>
                    <input
                      type="text"
                      placeholder={t("e.g. Colaba, South")}
                      value={inConstituency}
                      onChange={e => setInConstituency(e.target.value)}
                      className="w-full p-3 text-sm rounded-xl border border-slate-200 outline-none focus:border-civic-blue focus:ring-4 focus:ring-civic-blue/10 bg-slate-50 hover:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <button
                    onClick={handleIndiaSearch}
                    disabled={!inState || !inDistrict || !inConstituency || isSearching}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:shadow-none mt-2 flex justify-center items-center gap-2"
                  >
                    {isSearching ? <span className="animate-pulse">{t("Locating...")}</span> : <><Search className="w-5 h-5" /> {t("Generate Local Simulator")}</>}
                  </button>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center">
                    <button
                      onClick={() => setShowPurposeModal(true)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline decoration-blue-300 underline-offset-4"
                    >
                      {t("I need my 100% official exact polling booth")}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="global" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <form onSubmit={handleGlobalSearch} className="space-y-5">
                    <div className="group">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 group-focus-within:text-civic-blue transition-colors">{t("Location Search")}</label>
                      <input
                        type="text"
                        placeholder={t("e.g. London, UK or Springfield, IL")}
                        value={globalAddress}
                        onChange={e => setGlobalAddress(e.target.value)}
                        className="w-full p-3 text-sm rounded-xl border border-slate-200 outline-none focus:border-civic-blue focus:ring-4 focus:ring-civic-blue/10 bg-slate-50 hover:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!globalAddress || isSearching}
                      className="w-full bg-civic-blue hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isSearching ? <span className="animate-pulse">{t("Loading API...")}</span> : <><Search className="w-5 h-5" /> {t("Search Civic Data")}</>}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 p-4 bg-slate-50/50 overflow-y-auto">
            {results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t("Available Centers")}</h3>
                  <span className="text-[10px] text-slate-400 bg-slate-200 px-2 rounded-full py-0.5">{t("Sandbox Data")}</span>
                </div>
                {results.map((booth) => (
                  <div
                    key={booth.id}
                    onClick={() => handleSelectBooth(booth)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer shadow-sm ${activeBooth?.id === booth.id ? "border-civic-blue bg-blue-50/30 scale-[1.02]" : "border-slate-100 hover:border-slate-300 hover:shadow bg-white"}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 leading-tight pr-4">{booth.name}</h4>
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md shrink-0">{booth.distance}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug mb-4">{booth.address}</p>

                    <a
                      href={getDirectionsUrl(booth.lat, booth.lng)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white shadow-sm border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-civic-blue transition-all w-full justify-center"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Navigate
                    </a>
                  </div>
                ))}

                <AnimatePresence>
                  {activeBooth && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 border-t border-slate-200 pt-6 px-1"
                    >
                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full pointer-events-none" />

                        <div className="flex items-center justify-between mb-5 relative z-10">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <ThermometerSun className="w-5 h-5 text-amber-500" />
                            {t("Forecast")}
                          </h4>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Open-Meteo API</span>
                        </div>

                        {loadingWeather ? (
                          <div className="py-6 text-center text-slate-500 text-sm animate-pulse flex flex-col items-center gap-2">
                            <Cloud className="w-6 h-6 animate-bounce" />
                            {t("Loading metrics...")}
                          </div>
                        ) : weather ? (
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                              {renderWeatherIcon(weather.type)}
                            </div>
                            <div>
                              <div className="text-3xl font-black text-slate-800 tracking-tighter">
                                {weather.maxTemp}°C <span className="text-lg text-slate-400 font-bold ml-1">/ {weather.minTemp}°C</span>
                              </div>
                              <div className="text-sm text-slate-600 font-medium capitalize mt-0.5">{weather.description}</div>
                            </div>
                          </div>
                        ) : null}

                        {weather && (weather.maxTemp >= 30 || weather.type === 'rain') && (
                          <div className={`mt-5 p-3.5 text-xs font-semibold rounded-xl flex items-start gap-2 border relative z-10 shadow-inner ${weather.maxTemp >= 30 ? "bg-amber-50 text-amber-900 border-amber-200" : "bg-blue-50 text-blue-900 border-blue-200"}`}>
                            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${weather.maxTemp >= 30 ? "text-amber-600" : "text-blue-600"}`} />
                            <span className="leading-relaxed">
                              {weather.maxTemp >= 30
                                ? "High heat expected. Tip: Vote early in the morning between 7 AM - 9 AM to avoid long queues under the sun. Carry water."
                                : "Rain expected today. Bring an umbrella and anticipate minor outdoor delays."}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center px-8">
                <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-5 rotate-12">
                  <MapPin className="w-8 h-8 text-civic-blue opacity-50 block" />
                </div>
                <p className="text-sm font-medium leading-relaxed">{t("Enter an area to magically generate 2026 simulated polling data.")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Google Map */}
        <div className="flex-1 relative z-10 w-full bg-slate-100">
          <div className="absolute inset-0">
            <GoogleMapInner
              mapCenter={mapCenter}
              mapZoom={mapZoom}
              results={results}
              activeBooth={activeBooth}
              setActiveBooth={setActiveBooth}
              getDirectionsUrl={getDirectionsUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

