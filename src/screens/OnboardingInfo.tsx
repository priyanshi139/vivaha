import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SCREENS = [
  {
    title: 'Welcome to your personal Wedding Command Center.',
    desc: 'Everything you need to orchestrate your grand celebration in one place.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Create checklists & design inspiration boards.',
    desc: 'Build your dream vendor package with our curated selection of top-tier experts.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Unlock Premium for AI planning assistance.',
    desc: 'Get exclusive vendor offers and priority matching for an elite experience.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',
  },
];

const OnboardingInfo: React.FC = () => {
  const [step, setStep] = useState(0);
  const { navigate } = useApp();

  return (
    <motion.div className="absolute inset-0 bg-ivory flex flex-col">
      <div className="relative h-[60vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={step}
            src={SCREENS[step].image}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ivory via-transparent to-transparent" />
      </div>

      <div className="flex-1 p-8 flex flex-col justify-between">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-rose mb-4 leading-tight">{SCREENS[step].title}</h2>
          <p className="text-slate-600">{SCREENS[step].desc}</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {SCREENS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-gold' : 'w-2 bg-gold/30'}`} />
            ))}
          </div>

          {step < 2 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="w-full bg-rose text-ivory py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
              Next <ChevronRight size={20} />
            </button>
          ) : (
            <div className="w-full space-y-4">
              <button onClick={() => navigate('user_type')} className="w-full bg-emerald-500 text-ivory py-4 rounded-2xl font-semibold">
                Let's Begin
              </button>
              <button onClick={() => navigate('role_selection')} className="w-full text-rose font-bold text-sm">
                Already have an account? Login
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardingInfo;
