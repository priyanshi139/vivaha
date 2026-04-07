import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props { onDone: () => void; }

const SplashScreen: React.FC<Props> = ({ onDone }) => {
  const [splashStep, setSplashStep] = useState(0);
  const { state, navigate, setActiveTab } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (splashStep < 3) setSplashStep(s => s + 1);
    }, 3500);
    return () => clearTimeout(timer);
  }, [splashStep]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-rose flex flex-col items-center justify-center text-center p-6 z-50 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full border-[1px] border-gold animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full border-[1px] border-gold animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <AnimatePresence mode="wait">
        {splashStep === 0 && (
          <motion.div key="ganesha" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.1, y: -20 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center space-y-6">
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-5xl md:text-6xl font-serif text-gold tracking-tight w-full text-center break-words">
              श्री गणेशाय नमः
            </motion.h2>
            <div className="w-24 h-[1px] bg-gold/30 mx-auto" />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-champagne/60 tracking-[0.3em] uppercase text-[10px] font-bold">
              Om Gan Ganapataye Namah
            </motion.p>
          </motion.div>
        )}

        {splashStep === 1 && (
          <motion.div key="shloka1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 1, ease: 'easeOut' }} className="flex flex-col items-center space-y-10 max-w-sm">
            <div className="w-24 h-[1px] bg-gold/30" />
            <div className="space-y-8">
              <h3 className="text-4xl font-serif italic text-gold leading-tight">ॐ सर्वे भवन्तु सुखिनः</h3>
              <div className="space-y-4">
                <p className="text-ivory/90 italic leading-relaxed text-xl font-serif">
                  "May all be happy,<br />May all be free from illness."
                </p>
                <p className="text-champagne/50 text-sm uppercase tracking-widest">Universal Peace Prayer</p>
              </div>
            </div>
            <div className="w-24 h-[1px] bg-gold/30" />
          </motion.div>
        )}

        {splashStep === 2 && (
          <motion.div key="shloka2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 1 }} className="flex flex-col items-center space-y-10 max-w-sm">
            <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Flame size={300} className="text-gold" />
            </motion.div>
            <div className="z-10 space-y-8 w-full">
              <h3 className="text-3xl md:text-4xl font-serif italic text-gold w-full text-center break-words">ॐ भूर्भुवः स्वः</h3>
              <p className="text-ivory/90 italic leading-relaxed text-lg md:text-xl font-serif px-4 w-full text-center break-words">
                "May the Divine Light enlighten our minds and guide our path."
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold/30" />)}
              </div>
            </div>
          </motion.div>
        )}

        {splashStep === 3 && (
          <motion.div key="logo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center max-w-lg">
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="mb-8 text-center">
              <motion.h2 className="text-4xl font-serif text-gold mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                श्री गणेशाय नमः
              </motion.h2>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ivory mb-4 leading-tight w-full text-center break-words">
                Start Your Wedding Journey with Blessings
              </h1>
              <p className="text-champagne/80 text-base md:text-lg font-serif italic mb-8 w-full text-center break-words">
                Plan, manage and celebrate your big day — all in one place.
              </p>
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 w-full px-6">
              <button
                onClick={() => {
                  onDone();
                  if (state.screen === 'splash') navigate('onboarding_info');
                }}
                className="flex-1 bg-gold text-rose font-bold py-4 px-8 rounded-full shadow-2xl transition-all hover:shadow-gold/20 hover:-translate-y-1 active:translate-y-0"
              >
                Get Started
              </button>
              <button
                onClick={() => {
                  onDone();
                  navigate('dashboard');
                  setActiveTab('home');
                }}
                className="flex-1 bg-white/10 backdrop-blur-md text-ivory border border-white/20 font-bold py-4 px-8 rounded-full transition-all hover:bg-white/20 hover:-translate-y-1 active:translate-y-0"
              >
                Explore Vendors
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SplashScreen;
