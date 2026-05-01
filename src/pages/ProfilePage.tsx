import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Target,
  Globe,
  BookOpen,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Share2,
  Activity,
  MessageSquare,
  Edit2,
  Check,
  X,
  Users
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useLanguage } from "../lib/LanguageContext";
import { useNavigate } from "react-router-dom";
import { COUNTRIES, PERSONAS } from "./JourneySetup";

const ALL_STEPS = [
  {
    id: 1,
    title: "What is an Election?",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    title: "Voter Registration",
    icon: ShieldCheck,
    color: "bg-teal-100 text-teal-600",
  },
  {
    id: 3,
    title: "Know Your Candidates",
    icon: Target,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 4,
    title: "Voting Day",
    icon: MapPin,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 5,
    title: "Results & Beyond",
    icon: Globe,
    color: "bg-indigo-100 text-indigo-600",
  },
];

export const ProfilePage = () => {
  const { t } = useLanguage();
  const { user, profile, saveProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [handle, setHandle] = useState(profile?.handle || "");
  const [bio, setBio] = useState(profile?.bio || "");
  
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [detailsData, setDetailsData] = useState({
    country: profile?.profile?.country || "",
    region: profile?.profile?.region || "",
    postalCode: profile?.profile?.postalCode || "",
    persona: profile?.profile?.persona || "",
    isFirstTimeVoter: profile?.profile?.isFirstTimeVoter ?? false,
    registrationStatus: profile?.profile?.registrationStatus || ""
  });

  const handleSaveDetails = async () => {
    const updatedProfileDetails = {
      ...profile?.profile,
      ...detailsData,
      countryName: profile?.profile?.countryName || detailsData.country || '',
      language: profile?.profile?.language || 'en',
    };
    await saveProfile({ profile: updatedProfileDetails });
    setIsEditingDetails(false);
  };
  
  // Safe fallbacks and formatting
  const currentHandle = profile?.handle || `@citizen_${user?.uid?.substring(0, 5) || "xyz"}`;
  const currentBio = profile?.bio || "On a journey to understand and participate in the democratic process.";
  const followersCount = profile?.followersCount ?? 0;
  const followingCount = profile?.followingCount ?? 0;

  const handleSaveProfile = async () => {
    // Only save if it changed
    if (handle !== profile?.handle || bio !== profile?.bio) {
        let cleanHandle = handle.trim();
        // ensure handle starts with @
        if (cleanHandle && !cleanHandle.startsWith('@')) {
            cleanHandle = `@${cleanHandle}`;
        }
        await saveProfile({ handle: cleanHandle, bio });
    }
    setIsEditing(false);
  };

  const stamps = profile?.stamps || [];
  const completionPercentage =
    Math.round((stamps.length / ALL_STEPS.length) * 100) || 0;

  // Formatting persona for display
  const personaDisplay = profile?.profile?.persona
    ? profile.profile.persona.charAt(0).toUpperCase() +
      profile.profile.persona.slice(1)
    : "Citizen";
  const countryDisplay = profile?.profile?.country || "Unselected";
  const regionDisplay = profile?.profile?.region || "";
  const postalCodeDisplay = profile?.profile?.postalCode || "";
  const firstTimeDisplay = profile?.profile?.isFirstTimeVoter ? "First-Time Voter" : "Experienced Voter";
  const statusDisplay = profile?.profile?.registrationStatus 
    ? profile.profile.registrationStatus.charAt(0).toUpperCase() + profile.profile.registrationStatus.slice(1) 
    : "Unsure";

  // Synthesize an activity feed from user stamps and chat interactions
  const generateActivityFeed = () => {
    let activities = [];

    // Add initialization event
    activities.push({
      id: "joined",
      type: "status",
      title: t("Joined CivicPath"),
      desc: t("Registered as a verified") + " " + t(personaDisplay.toLowerCase()) + " " + t("in") + " " + t(countryDisplay) + ".",
      icon: ShieldCheck,
      color: "bg-green-100 text-green-600",
      time: t("Recently"),
    });

    // Add badge events
    stamps.forEach((stampId: number) => {
      const step = ALL_STEPS.find((s) => s.id === stampId);
      if (step) {
        activities.push({
          id: `stamp-${stampId}`,
          type: "achievement",
          title: t("Unlocked:") + " " + t(step.title),
          desc: t("Completed the module and earned the civic badge."),
          icon: Award,
          color: "bg-yellow-100 text-yellow-600",
          time: t("Recently"),
        });
      }
    });

    // Add chat events
    if (profile?.chatHistory && profile.chatHistory.length > 1) {
      activities.push({
        id: "chat",
        type: "interaction",
        title: t("Consulted CivicBot"),
        desc: t("Asked") + " " + Math.floor(profile.chatHistory.length / 2) + " " +  t("questions about electoral processes."),
        icon: MessageSquare,
        color: "bg-blue-100 text-blue-600",
        time: t("Active"),
      });
    }

    return activities.reverse();
  };

  const activities = generateActivityFeed();

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {t("Civic Passport")}
            </h1>
            <p className="text-slate-500 font-medium">
              {t("Your verifiable identity and progress dashboard.")}
            </p>
          </div>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: t("My CivicPath Passport"),
                  text: t("I'm a verified") + " " + t(personaDisplay) + " " + t("on CivicPath, exploring democracy in") + " " + t(countryDisplay) + "!",
                  url: window.location.href,
                });
              } else {
                alert(t("Sharing is not supported on this device."));
              }
            }}
            className="flex items-center gap-2 bg-civic-blue text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
          >
            <Share2 className="w-4 h-4" /> {t("Share Passport")}
          </button>
        </div>

        {/* Bento Grid layout change to 3 columns, with Activity taking 1 col */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Identity Card (Hero) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm group hover:shadow-md transition-shadow"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-civic-blue to-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-black shadow-xl">
                      {user?.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                    <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold">
                      {t("Verified Voter")}
                    </div>
                    
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-slate-400 hover:text-civic-blue transition-colors p-2 rounded-full hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={handleSaveProfile}
                          className="text-white bg-civic-blue transition-colors p-2 rounded-full shadow-md"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    {user?.displayName || "Anonymous Citizen"}
                  </h2>

                  {isEditing ? (
                    <div className="space-y-3 mt-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Handle</label>
                        <input 
                          type="text" 
                          value={handle} 
                          onChange={(e) => setHandle(e.target.value)} 
                          placeholder="@handle" 
                          className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-civic-blue outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bio</label>
                        <textarea 
                          rows={2}
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)} 
                          placeholder="Your civic journey..." 
                          className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-civic-blue outline-none resize-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-civic-blue font-bold text-sm mb-3">
                        {currentHandle}
                      </p>
                      <p className="text-slate-600 text-sm mb-6 max-w-md">
                        {currentBio}
                      </p>
                    </>
                  )}

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2">
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-sm font-bold text-slate-700">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>{followersCount}</span> <span className="text-slate-400 font-medium">{t("Followers")}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-sm font-bold text-slate-700">
                      <span>{followingCount}</span> <span className="text-slate-400 font-medium">{t("Following")}</span>
                    </div>
                    <div className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 font-mono flex items-center justify-center">
                      ID: {user?.uid.substring(0, 6)}...
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trophy Case (Stamps) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex-1"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-500" />
                  {t("Achievement Badges")}
                </h3>
                <button
                  onClick={() => navigate("/guide")}
                  className="text-sm font-bold text-civic-blue hover:text-blue-700"
                >
                  {t("Continue Course")} &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {ALL_STEPS.map((step) => {
                  const isEarned = stamps.includes(step.id);
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all ${
                        isEarned
                          ? "bg-white border-green-200 shadow-sm hover:-translate-y-1"
                          : "bg-slate-50 border-transparent opacity-50 grayscale"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isEarned ? step.color : "bg-slate-200 text-slate-400"}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 leading-tight">
                        {t(step.title)}
                      </span>
                    </div>
                  );
                })}
              </div>
              {stamps.length === 0 && (
                <div className="mt-6 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-500 text-center">
                    {t("No badges earned yet.")}
                    <br />
                    {t("Head to the Guide to start your journey!")}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Custom layout for single col side sections */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
              {/* Persona Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-civic-blue text-white rounded-[2rem] p-8 shadow-lg shadow-blue-500/20 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <button 
                    onClick={() => setIsEditingDetails(true)} 
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    aria-label="Edit Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-blue-100 mb-1">{t("Location")}</h3>
                <p className="text-3xl font-black tracking-tight mb-2">
                  {t(countryDisplay)}
                </p>
                {(regionDisplay || postalCodeDisplay) && (
                  <p className="text-blue-200 font-medium mb-auto">
                    {regionDisplay} {postalCodeDisplay && `(${postalCodeDisplay})`}
                  </p>
                )}

                <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1">
                      {t("Persona")}
                    </h3>
                    <p className="text-md font-bold">{t(personaDisplay)}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1">
                      {t("Experience")}
                    </h3>
                    <p className="text-md font-bold">{t(firstTimeDisplay)}</p>
                  </div>
                  <div className="col-span-2 mt-2">
                    <h3 className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-1">
                      {t("Registration Status")}
                    </h3>
                    <p className="text-md font-bold">{t(statusDisplay)}</p>
                  </div>
                </div>
              </motion.div>

              {/* Progress Tracker Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-center items-center text-center"
              >
                <div className="relative w-24 h-24 mb-4">
                  <svg
                    className="w-full h-full -rotate-90 transform"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="10"
                      strokeDasharray={`${(completionPercentage / 100) * 283} 283`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-800">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
                <h3 className="text-md font-bold text-slate-800">{t("Readiness")}</h3>
              </motion.div>
            </div>

            {/* Social Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex-1"
            >
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-civic-blue" />
                <h3 className="font-bold text-slate-800">
                  {t("Activity & Telemetry")}
                </h3>
              </div>

              <div className="space-y-6">
                {activities.map((item, idx) => (
                  <div key={item.id} className="relative pl-6">
                    {/* Line connector */}
                    {idx !== activities.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-200 -my-4 z-0"></div>
                    )}

                    {/* Node marker */}
                    <div
                      className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ${item.color}`}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                    </div>

                    {/* Content */}
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditingDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Edit Details</h2>
                <button
                  onClick={() => setIsEditingDetails(false)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Location (Country Code)</label>
                  <select
                    value={detailsData.country}
                    onChange={(e) => setDetailsData({ ...detailsData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-civic-blue outline-none transition-all"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">State/Region</label>
                    <input
                      type="text"
                      value={detailsData.region}
                      onChange={(e) => setDetailsData({ ...detailsData, region: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-civic-blue outline-none transition-all"
                      placeholder="e.g. California"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={detailsData.postalCode}
                      onChange={(e) => setDetailsData({ ...detailsData, postalCode: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-civic-blue outline-none transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Learning Persona</label>
                  <select
                    value={detailsData.persona}
                    onChange={(e) => setDetailsData({ ...detailsData, persona: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-civic-blue outline-none transition-all"
                  >
                    <option value="">Select persona</option>
                    {PERSONAS.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Voting Experience</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={detailsData.isFirstTimeVoter === true}
                        onChange={() => setDetailsData({ ...detailsData, isFirstTimeVoter: true })}
                        className="w-5 h-5 text-civic-blue"
                      />
                      <span className="text-slate-700">First-time Voter</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={detailsData.isFirstTimeVoter === false}
                        onChange={() => setDetailsData({ ...detailsData, isFirstTimeVoter: false })}
                        className="w-5 h-5 text-civic-blue"
                      />
                      <span className="text-slate-700">Experienced</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Registration Status</label>
                  <select
                    value={detailsData.registrationStatus}
                    onChange={(e) => setDetailsData({ ...detailsData, registrationStatus: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-civic-blue outline-none transition-all"
                  >
                    <option value="">Select status</option>
                    <option value="registered">Registered to Vote</option>
                    <option value="unregistered">Not Registered</option>
                    <option value="unsure">Unsure / Don't Know</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-4 justify-end">
                <button
                  onClick={() => setIsEditingDetails(false)}
                  className="px-6 py-3 rounded-full font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="px-8 py-3 rounded-full font-bold text-white bg-civic-blue hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Save Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
