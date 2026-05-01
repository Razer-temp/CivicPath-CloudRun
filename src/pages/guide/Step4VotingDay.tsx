import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { generateGuideContent, ContentSource } from "../../services/geminiService";
import { MythBuster } from "./MythBuster";
import { GeminiQuiz } from "./GeminiQuiz";
import { MapPin, Navigation, Clock, AlertTriangle, Globe, HardDrive } from "lucide-react";
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const DEFAULT_CENTERS: Record<string, [number, number]> = {
  "India": [28.6139, 77.2090], // New Delhi
  "United States": [38.8951, -77.0364], // Washington D.C.
  "United Kingdom": [51.505, -0.09], // London
};

import { JourneyProfile } from "../../types";

export const Step4VotingDay = ({ profile, onPass }: { profile: JourneyProfile, onPass?: () => void }) => {
  const [content, setContent] = useState("");
  const [locationError, setLocationError] = useState("");
  const initialLoc: [number, number] = profile?.countryName && DEFAULT_CENTERS[profile.countryName] ? DEFAULT_CENTERS[profile.countryName] : [28.6139, 77.2090];
  const [userLoc, setUserLoc] = useState<[number, number]>(initialLoc);
  const [boothLoc, setBoothLoc] = useState<{ lat: number, lng: number } | null>(null);
  const [source, setSource] = useState<ContentSource | null>(null);

  useEffect(() => {
    // Generate a consistently random nearby booth based on userLoc
    const seed = Math.abs(Math.sin(userLoc[0] * userLoc[1]) * 10000);
    const offsetLat = (seed - Math.floor(seed) - 0.5) * 0.01; // ~500m to 1km offset
    const offsetLng = (Math.cos(seed) - 0.5) * 0.01;
    setBoothLoc({ lat: userLoc[0] + offsetLat, lng: userLoc[1] + offsetLng });
  }, [userLoc]);

  useEffect(() => {
    const fetchContent = async () => {
      const prompt = `Describe what to expect on voting day in ${profile.countryName}. 
      What specific IDs do they need to bring? Explain the process inside the polling booth (e.g., if it's India, briefly explain EVM and VVPAT. If US, explain paper ballots/machines). 
      Output in markdown, no code blocks.`;

      const response = await generateGuideContent(prompt, {
        country: profile.country,
        persona: profile.persona,
        step: 'step4_votingday'
      });

      setContent(response.content);
      setSource(response.source);
    };
    fetchContent();

    // Try to get user's location via browser API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLoc([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          setLocationError("Could not access your location. Showing default map.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, [profile]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Voting Day
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          The big day is here. Know what to bring and where to go to make your vote count smoothly.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-civic-blue/5 p-5 rounded-2xl border border-civic-blue/20">
          <Clock className="w-6 h-6 text-civic-blue mb-2" />
          <h3 className="font-bold text-slate-800 mb-1">Go Early</h3>
          <p className="text-sm text-slate-600">Morning hours generally have shorter lines. Check local polling hours carefully.</p>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
          <MapPin className="w-6 h-6 text-red-500 mb-2" />
          <h3 className="font-bold text-slate-800 mb-1">Verify Location</h3>
          <p className="text-sm text-slate-600">Polling locations can change. Double-check your exact booth assignment online.</p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm [&>p]:mb-4 [&>p]:text-slate-600 [&>p]:leading-relaxed [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-6 [&>h3]:font-bold [&>h3]:text-lg [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>li]:text-slate-600 [&>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4">
        {source === 'cms_fallback' && (
          <div className="mb-4 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Offline Mode: AI network congestion detected. Showing pre-verified CMS curriculum.
          </div>
        )}
        {source === 'crowd_cache' && (
          <div className="mb-4 bg-sky-50 text-sky-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global Cache: Pulled latest response from community due to offline limits.
          </div>
        )}
        {source === 'local_cache' && (
          <div className="mb-4 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            Edge Cache: Instant load from your device.
          </div>
        )}

        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-20 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mt-6"></div>
            <div className="h-20 bg-slate-100 rounded w-full"></div>
          </div>
        )}
      </div>

      {/* Simulated Nearest Polling Booth */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 shadow-sm text-center sm:text-left">
        <div className="bg-white p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-800 flex items-center justify-center sm:justify-start gap-2">
              <Navigation className="w-5 h-5 text-civic-blue" />
              Nearest Polling Station
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {locationError ? locationError : "Simulated location based on your GPS."}
            </p>
          </div>
          <a
            href={boothLoc ? `https://www.google.com/maps/dir/?api=1&destination=${boothLoc.lat},${boothLoc.lng}` : "#"}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-sm transition-colors mx-auto sm:mx-0 inline-flex items-center gap-2"
          >
            Get Directions
          </a>
        </div>

        <div className="h-64 w-full bg-slate-100 relative z-0">
          <Map
            center={{ lat: userLoc[0], lng: userLoc[1] }}
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapId="a05d8fcc595180f1"
            style={{ width: "100%", height: "100%" }}
          >
            {/* User Loc Marker */}
            <AdvancedMarker position={{ lat: userLoc[0], lng: userLoc[1] }}>
              <Pin background={'#3b82f6'} glyphColor={'#fff'} borderColor={'#2563eb'} />
            </AdvancedMarker>
            {/* Simulated Booth slightly offset */}
            {boothLoc && (
              <AdvancedMarker position={{ lat: boothLoc.lat, lng: boothLoc.lng }}>
                <Pin background={'#ef4444'} glyphColor={'#fff'} borderColor={'#b91c1c'} />
              </AdvancedMarker>
            )}
          </Map>
        </div>
      </div>

      <MythBuster topic="Voting Inside the Booth" country={profile.countryName} />
      <GeminiQuiz topic="Voting Day Workflow" country={profile.countryName} onPass={onPass} />
    </div>
  );
};
