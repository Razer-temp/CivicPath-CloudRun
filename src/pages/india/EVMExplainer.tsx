import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Printer, Volume2, CheckCircle2 } from "lucide-react";

export const EVMExplainer = () => {
  const [step, setStep] = useState(1);
  const [beepPlayed, setBeepPlayed] = useState(false);

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Auto progression for VVPAT step
  useEffect(() => {
    if (step === 5) {
      const timer = setTimeout(() => {
        setStep(6);
      }, 7000); // exactly 7 seconds like real VVPAT
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
      <div className="flex flex-col md:flex-row">
        {/* Left: Animation Canvas */}
        <div className="w-full md:w-3/5 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-white">
                <div className="w-48 h-64 border-4 border-slate-700 bg-slate-800 rounded-lg mx-auto flex flex-col justify-around p-4 opacity-50">
                  <div className="w-full h-8 bg-slate-700 rounded blur-sm"></div>
                  <div className="w-full h-8 bg-slate-700 rounded blur-sm"></div>
                  <div className="w-full h-8 bg-slate-700 rounded blur-sm"></div>
                </div>
                <p className="mt-6 font-bold text-slate-300">Approaching the Voting Compartment...</p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="w-64 bg-[#F5F5DC] p-4 rounded shadow-2xl relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-700 text-white text-[10px] uppercase px-4 py-1 rounded w-max">Ballot Unit</div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-300/50 py-3">
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs ml-2">Logo</div>
                    <div className="text-sm font-bold w-24">Candidate {i}</div>
                    <div className="w-4 h-8 bg-slate-200 border-2 border-slate-300 rounded shadow-inner mr-2"></div>
                    <div className="w-10 h-10 bg-blue-500 rounded-full shadow-md border-2 border-blue-400"></div>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative text-center">
                <div className="w-24 h-24 bg-blue-500 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center mx-auto relative z-10 border-4 border-blue-400">
                  <motion.div 
                    animate={{ scale: [1, 0.9, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-16 h-16 bg-blue-600 rounded-full"
                  />
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: -10 }}
                  className="absolute top-0 right-0"
                >
                  <span className="text-4xl text-white">👈</span>
                </motion.div>
                <p className="mt-8 font-bold text-white uppercase tracking-widest text-lg">Press Blue Button</p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }} 
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <Volume2 className="w-32 h-32 text-red-500 mx-auto" />
                </motion.div>
                <h1 className="text-6xl font-black text-red-500 mt-4 tracking-widest animate-pulse">BEEP</h1>
                <p className="mt-4 text-slate-300">Confirmation successful</p>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="w-64 bg-slate-200 p-2 rounded-t-xl mx-auto shadow-2xl border-4 border-slate-700 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] uppercase px-4 py-1 rounded w-max">VVPAT Transparent Window</div>
                <div className="w-full bg-[#111] h-48 rounded p-2 overflow-hidden flex flex-col justify-between items-center relative">
                  {/* Paper Slip */}
                  <motion.div 
                    initial={{ y: -100 }}
                    animate={{ y: 10 }}
                    transition={{ type: "spring" }}
                    className="w-4/5 bg-[#ffe] h-32 p-3 font-mono text-[10px] shadow-sm transform border-b-2 border-dashed border-slate-300"
                  >
                    <div className="text-center mb-2 font-bold border-b border-black pb-1">VOTE RECEIPT</div>
                    <div>S.No: 02</div>
                    <div className="font-bold text-sm my-1">Candidate 2</div>
                    <div>Symbol: Logo</div>
                  </motion.div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-rose-500 text-6xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] opacity-20 z-0">7 SEC</div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-64 h-64 bg-slate-800 rounded-xl mx-auto relative border-4 border-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-24 h-24 text-green-500" />
                <p className="absolute bottom-6 font-bold text-green-400">Vote Secured</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Copy & Controls */}
        <div className="w-full md:w-2/5 p-8 flex flex-col justify-center">
          <div className="mb-6 flex gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-orange-500' : 'bg-slate-200'}`} />
            ))}
          </div>

          <div className="min-h-[150px]">
            {step === 1 && (
              <>
                <h3 className="text-xl font-bold text-slate-800 mb-2">1. Enter the Compartment</h3>
                <p className="text-slate-600">The Presiding Officer will enable the ballot. Proceed alone behind the cardboard secrecy screen where the EVM Ballot Unit is kept.</p>
              </>
            )}
            {step === 2 && (
              <>
                <h3 className="text-xl font-bold text-slate-800 mb-2">2. Verify the Candidate List</h3>
                <p className="text-slate-600">Look at the Ballot Unit carefully. You will see candidate names, their photos, and their official party symbols aligned in rows.</p>
              </>
            )}
            {step === 3 && (
              <>
                <h3 className="text-xl font-bold text-slate-800 mb-2">3. Press the Blue Button</h3>
                <p className="text-slate-600">Press the blue button positioned directly next to the symbol of the candidate you wish to vote for. You only need to press it once.</p>
              </>
            )}
            {step === 4 && (
              <>
                <h3 className="text-xl font-bold text-slate-800 mb-2">4. Wait for the Beep</h3>
                <p className="text-slate-600">The EVM will emit a loud, continuous "BEEP" sound. This audio confirmation means your vote has been securely recorded in the machine.</p>
              </>
            )}
            {step === 5 && (
              <>
                <h3 className="text-xl font-bold text-slate-800 mb-2">5. Check the VVPAT Window</h3>
                <p className="text-slate-600">Immediately look at the printer (VVPAT) next to the EVM. A printed slip will appear behind the glass. It stays fully visible for exactly <strong className="text-slate-900">7 seconds</strong>. Verify the details match your choice.</p>
              </>
            )}
            {step === 6 && (
              <>
                <h3 className="text-xl font-bold text-slate-800 mb-2">6. The Slip Drops</h3>
                <p className="text-slate-600">The VVPAT automatically cuts the slip and it drops into a sealed, secure box below. Congratulations! Your vote is cast and you can exit.</p>
              </>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 font-semibold text-slate-500 disabled:opacity-30 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Back
            </button>
            <button 
              onClick={nextStep}
              disabled={step === 6}
              className="flex-1 bg-civic-blue text-white font-bold py-3 rounded-xl shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:bg-[rgba(0,118,255,0.9)] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {step === 5 ? "Wait 7s..." : step === 6 ? "Finish" : "Next Step"}
              {step !== 6 && step !== 5 && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
