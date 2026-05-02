import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, ExternalLink, Calendar, Users, AlertTriangle } from "lucide-react";

// Mock data matching the 2026 plan (Tamil Nadu, West Bengal, Kerala, Assam, Puducherry)
const STATES = [
  "Assam", "Kerala", "Puducherry", "Tamil Nadu", "West Bengal",
  "Maharashtra", "Uttar Pradesh", "Delhi", "Karnataka"
];

interface StateElectionData {
  electionDate: string;
  ceo: string;
  deadline: string;
  turnout: string;
  status: string;
}

const mockStateData: Record<string, StateElectionData> = {
  "Tamil Nadu": {
    electionDate: "May 2026 (Expected)",
    ceo: "Mr. Satyabrata Sahoo, IAS",
    deadline: "April 2026",
    turnout: "72.81% (2021 Assembly)",
    status: "Upcoming Assembly Election",
  },
  "West Bengal": {
    electionDate: "May 2026 (Expected)",
    ceo: "Dr. Aariz Aftab, IAS",
    deadline: "April 2026",
    turnout: "81.70% (2021 Assembly)",
    status: "Upcoming Assembly Election",
  },
  "Assam": {
    electionDate: "April 2026 (Expected)",
    ceo: "Mr. Anurag Goel, IAS",
    deadline: "March 2026",
    turnout: "82.04% (2021 Assembly)",
    status: "Upcoming Assembly Election",
  }
};

const defaultData = {
  electionDate: "Unknown",
  ceo: "Contact State CEO",
  deadline: "Check with ECI",
  turnout: "N/A",
  status: "No imminent state assembly election",
};

export const IndiaDashboard = () => {
  const [selectedState, setSelectedState] = useState("Tamil Nadu");
  const [constituency, setConstituency] = useState("");
  const [searched, setSearched] = useState(false);

  const data = mockStateData[selectedState] || defaultData;

  const handleKYCSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(constituency.trim()) {
      setSearched(true);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* State Selector & Info */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
          Select State / UT
        </label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none mb-6"
        >
          {STATES.sort().map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="space-y-4 mb-6 flex-1">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-500">Status</span>
            <span className="font-bold text-amber-600">{data.status}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-500">Expected Date</span>
            <span className="font-bold text-slate-800 flex items-center gap-2"><Calendar className="w-4 h-4"/> {data.electionDate}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-500">Historical Turnout</span>
            <span className="font-bold text-slate-800">{data.turnout}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-500">CEO Contact</span>
            <span className="font-bold text-slate-800 text-right">{data.ceo}</span>
          </div>
        </div>

        <a
          href="https://electoralsearch.eci.gov.in/"
          target="_blank"
          rel="noreferrer"
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
        >
          Check Registration via ECI Portal <ExternalLink className="w-5 h-5"/>
        </a>
      </div>

      <div className="space-y-6 flex flex-col">
        {/* Candidate Lookup (KYC) Wrapper */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex-1">
          <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-civic-blue" />
            Know Your Candidate (KYC) Search
          </h3>
          <p className="text-sm text-slate-500 mb-6">Enter your Vidhan Sabha or Lok Sabha constituency name to view declared assets and records.</p>

          <form onSubmit={handleKYCSearch} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="e.g. Chennai South"
              value={constituency}
              onChange={e => setConstituency(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-xl transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {searched && constituency ? (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800">Candidate A</h4>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-0.5">Major National Party</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">0 Criminal Cases</span>
                  <div className="text-xs text-slate-500 mt-1">Assets: ₹2.5 Cr</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800">Candidate B</h4>
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-widest mt-0.5">Key Opposition Party</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded"><AlertTriangle className="w-3 h-3"/> 2 Pending Cases</span>
                  <div className="text-xs text-slate-500 mt-1">Assets: ₹12.4 Cr</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">Mock data wrapping data.gov.in concepts</p>
            </div>
          ) : (
            <div className="h-40 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm">
              Search a constituency to fetch data
            </div>
          )}
        </div>

        {/* Polling Booth locator */}
        <Link
          to="/map"
          className="bg-civic-blue p-6 rounded-3xl text-white shadow-md hover:bg-blue-700 transition-colors flex items-center justify-between group"
        >
          <div>
            <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Find Polling Station
            </h4>
            <p className="text-blue-100 text-sm">Locate booths based on ECI data & Google Maps</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5 text-white" />
          </div>
        </Link>
      </div>
    </div>
  );
};
