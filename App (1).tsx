/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Calendar, 
  MapPin, 
  Bell, 
  Menu, 
  CheckCircle2, 
  Plus, 
  Image as ImageIcon, 
  Package as PackageIcon, 
  LayoutDashboard, 
  Sparkles, 
  Search, 
  Filter, 
  LogOut, 
  Settings, 
  ShieldCheck, 
  Crown,
  Share2,
  MessageSquare,
  ArrowRight,
  Sun,
  Flame,
  Star,
  Users,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageCircle,
  Send,
  Lock,
  X,
  ChevronDown,
  ArrowUpDown,
  MoreVertical,
  GripVertical
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GoogleGenAI } from "@google/genai";
import { AppState, UserType, UserDetails, WeddingDetails, Task, Vendor, InspirationBoard, Blog, RealWedding } from './types';
import { INITIAL_TASKS, VENDORS, POWER_PAIRS, BLOGS, INSPIRATION_BOARDS, REAL_WEDDINGS, CATEGORIES } from './constants';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SortableTask: React.FC<{ task: Task; toggleTask: (id: string) => void }> = ({ task, toggleTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' : 'bg-white border-slate-100 shadow-sm'}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300">
        <GripVertical size={20} />
      </div>
      <motion.div 
        onClick={() => toggleTask(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${task.completed ? 'bg-emerald-500 border-emerald-500 text-ivory' : 'border-slate-200'}`}
        whileTap={{ scale: 0.8 }}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <CheckCircle2 size={14} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <span 
        onClick={() => toggleTask(task.id)}
        className={`font-medium flex-1 cursor-pointer ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}
      >
        {task.title}
      </span>
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<AppState>({
    screen: 'splash',
    userType: null,
    userDetails: null,
    fianceDetails: null,
    weddingDetails: null,
    isPremium: false,
  });

  const [showSplash, setShowSplash] = useState(true);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [userId, setUserId] = useState<string | null>(null);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isExpertChatOpen, setIsExpertChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, role: 'user' | 'expert', text: string}>>([
    { id: 'initial', role: 'expert', text: "Hi! 👋 I'm your Vivah Wedding Expert. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<InspirationBoard | null>(null);

  // Persistence Logic
  useEffect(() => {
    let id = localStorage.getItem('vivaha_user_id');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('vivaha_user_id', id);
    }
    setUserId(id);

    // Load state from DB
    if (id) {
      fetch(`/api/state/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            // If we are recovering state, we still want to show splash if it's a fresh load
            // but we don't want to overwrite the recovered screen once splash is done
            setState(data.state);
            setTasks(data.tasks || INITIAL_TASKS);
          }
        })
        .catch(err => console.error("Failed to load state", err));
    }
  }, []);

  useEffect(() => {
    if (userId && state.screen !== 'splash') {
      fetch(`/api/state/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, tasks })
      }).catch(err => console.error("Failed to save state", err));
    }
  }, [state, tasks, userId]);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- Components ---

  const MegaMenu = () => (
    <AnimatePresence>
      {megaMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-[72px] left-0 right-0 bg-white z-[100] shadow-2xl rounded-b-[2rem] overflow-hidden border-t border-slate-100"
        >
          <div className="p-8 grid grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="space-y-4">
                <h3 className="text-rose font-bold text-lg flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  {cat.name}
                </h3>
                <div className="flex flex-col gap-2">
                  {cat.items.map((item) => (
                    <button 
                      key={item}
                      onClick={() => {
                        setState(prev => ({ ...prev, screen: 'category_page', selectedCategory: item }));
                        setMegaMenuOpen(false);
                      }}
                      className="text-slate-600 hover:text-gold text-sm text-left transition-colors flex items-center justify-between group"
                    >
                      {item}
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-rose/5 p-6 flex justify-between items-center border-t border-rose/10">
            <p className="text-xs text-rose font-medium italic">Find the best wedding vendors across India</p>
            <button 
              onClick={() => setMegaMenuOpen(false)}
              className="text-rose font-bold text-sm flex items-center gap-1"
            >
              Close Menu <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const Skeleton = ({ className }: { className?: string }) => (
    <div className={`bg-slate-200 animate-pulse rounded-2xl ${className}`} />
  );

  const SplashScreen = () => {
    const [splashStep, setSplashStep] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (splashStep < 3) {
          setSplashStep(s => s + 1);
        }
      }, 3500); // Slightly longer for readability
      return () => clearTimeout(timer);
    }, [splashStep]);

    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-rose flex flex-col items-center justify-center text-center p-6 z-50 overflow-hidden"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full border-[1px] border-gold animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full border-[1px] border-gold animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <AnimatePresence mode="wait">
          {splashStep === 0 && (
            <motion.div 
              key="ganesha"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center space-y-6"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl md:text-6xl font-serif text-gold tracking-tight w-full text-center break-words"
              >
                श्री गणेशाय नमः
              </motion.h2>
              <div className="w-24 h-[1px] bg-gold/30 mx-auto" />
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-champagne/60 tracking-[0.3em] uppercase text-[10px] font-bold"
              >
                Om Gan Ganapataye Namah
              </motion.p>
            </motion.div>
          )}

          {splashStep === 1 && (
            <motion.div 
              key="shloka1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col items-center space-y-10 max-w-sm"
            >
              <div className="w-24 h-[1px] bg-gold/30" />
              <div className="space-y-8">
                <h3 className="text-4xl font-serif italic text-gold leading-tight">ॐ सर्वे भवन्तु सुखिनः</h3>
                <div className="space-y-4">
                  <p className="text-ivory/90 italic leading-relaxed text-xl font-serif">
                    "May all be happy,<br/>May all be free from illness."
                  </p>
                  <p className="text-champagne/50 text-sm uppercase tracking-widest">Universal Peace Prayer</p>
                </div>
              </div>
              <div className="w-24 h-[1px] bg-gold/30" />
            </motion.div>
          )}

          {splashStep === 2 && (
            <motion.div 
              key="shloka2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center space-y-10 max-w-sm"
            >
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Flame size={300} className="text-gold" />
              </motion.div>
              <div className="z-10 space-y-8 w-full">
                <h3 className="text-3xl md:text-4xl font-serif italic text-gold w-full text-center break-words">ॐ भूर्भुवः स्वः</h3>
                <p className="text-ivory/90 italic leading-relaxed text-lg md:text-xl font-serif px-4 w-full text-center break-words">
                  "May the Divine Light enlighten our minds and guide our path."
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold/30" />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {splashStep === 3 && (
            <motion.div 
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center max-w-lg"
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="mb-8 text-center"
              >
                <motion.h2 
                  className="text-4xl font-serif text-gold mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  श्री गणेशाय नमः
                </motion.h2>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ivory mb-4 leading-tight w-full text-center break-words">
                  Start Your Wedding Journey with Blessings
                </h1>
                <p className="text-champagne/80 text-base md:text-lg font-serif italic mb-8 w-full text-center break-words">
                  Plan, manage and celebrate your big day — all in one place.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 w-full px-6"
              >
                <button 
                  onClick={() => {
                    setShowSplash(false);
                    if (state.screen === 'splash') {
                      navigate('onboarding_info');
                    }
                  }}
                  className="flex-1 bg-gold text-rose font-bold py-4 px-8 rounded-full shadow-2xl transition-all hover:shadow-gold/20 hover:-translate-y-1 active:translate-y-0"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => {
                    setShowSplash(false);
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

  const OnboardingInfo = () => {
    const [step, setStep] = useState(0);
    const screens = [
      {
        title: "Welcome to your personal Wedding Command Center.",
        desc: "Everything you need to orchestrate your grand celebration in one place.",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Create checklists & design inspiration boards.",
        desc: "Build your dream vendor package with our curated selection of top-tier experts.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
      },
      {
        title: "Unlock Premium for AI planning assistance.",
        desc: "Get exclusive vendor offers and priority matching for an elite experience.",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800"
      }
    ];

    return (
      <motion.div className="absolute inset-0 bg-ivory flex flex-col">
        <div className="relative h-[60vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img 
              key={step}
              src={screens[step].image}
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
            <h2 className="text-3xl font-bold text-rose mb-4 leading-tight">
              {screens[step].title}
            </h2>
            <p className="text-slate-600">
              {screens[step].desc}
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {screens.map((_, i) => (
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
                <button 
                  onClick={() => navigate('user_type')}
                  className="w-full bg-emerald-500 text-ivory py-4 rounded-2xl font-semibold"
                >
                  Let’s Begin
                </button>
                <button 
                  onClick={() => navigate('auth')}
                  className="w-full text-rose font-bold text-sm"
                >
                  Already have an account? Login
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const UserTypeSelection = () => (
    <div className="absolute inset-0 bg-ivory p-8 flex flex-col justify-center">
      <h2 className="text-4xl font-bold text-rose mb-2 text-center">Who are you?</h2>
      <p className="text-slate-500 text-center mb-12">Tailoring your experience...</p>
      
      <div className="grid grid-cols-1 gap-4">
        {[
          { id: 'bride', label: 'Bride', icon: <Heart className="text-rose" /> },
          { id: 'groom', label: 'Groom', icon: <User className="text-rose" /> },
          { id: 'vendor', label: 'Vendor', icon: <PackageIcon className="text-gold" /> },
          { id: 'planner', label: 'Wedding Planner', icon: <Sparkles className="text-gold" /> },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => {
              if (type.id === 'bride' || type.id === 'groom') {
                setState(prev => ({ ...prev, userType: type.id as UserType }));
                navigate('auth');
              } else {
                alert("Vendor/Planner flows coming soon!");
              }
            }}
            className="premium-card p-6 flex items-center gap-4 hover:border-gold transition-colors text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-ivory flex items-center justify-center group-hover:scale-110 transition-transform">
              {type.icon}
            </div>
            <span className="text-xl font-medium text-slate-800">{type.label}</span>
            <ChevronRight className="ml-auto text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );

  const AuthScreen = () => {
    const [method, setMethod] = useState<'phone' | 'google' | null>(null);
    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const handleOtpChange = (index: number, value: string) => {
      if (value.length > 1) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) otpRefs[index + 1].current?.focus();
    };

    return (
      <div className="absolute inset-0 bg-ivory p-8 flex flex-col justify-center">
        {!method ? (
          <div className="space-y-6">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-rose rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Heart className="text-gold fill-current" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-rose">Welcome Back</h2>
              <p className="text-slate-500">Securely access your wedding plans</p>
            </div>
            
            <button 
              onClick={() => setMethod('phone')}
              className="w-full bg-white border border-slate-200 py-4 rounded-2xl font-medium flex items-center justify-center gap-3 shadow-sm"
            >
              <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">📱</div>
              Continue with Mobile
            </button>
            <button 
              onClick={() => navigate('onboarding_form')}
              className="w-full bg-white border border-slate-200 py-4 rounded-2xl font-medium flex items-center justify-center gap-3 shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => setMethod(null)} className="mb-8 text-rose flex items-center gap-1">
              <ChevronLeft size={20} /> Back
            </button>
            <h2 className="text-3xl font-bold text-rose mb-2">Verify Mobile</h2>
            <p className="text-slate-500 mb-8">Enter the 4-digit code sent to your number</p>
            
            <div className="flex justify-between gap-4 mb-12">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  type="number"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-16 h-20 text-center text-3xl font-bold bg-white border-2 border-slate-100 rounded-2xl focus:border-gold outline-none transition-colors"
                />
              ))}
            </div>
            
            <button 
              onClick={() => navigate('onboarding_form')}
              className="w-full bg-rose text-ivory py-4 rounded-2xl font-bold shadow-lg shadow-rose/20"
            >
              Verify & Continue
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  const OnboardingForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      name: '', state: '', city: '', address: '',
      fName: '', fState: '', fCity: '',
      wDate: '', wState: '', wCity: '', venue: 'no', vName: '', vLoc: ''
    });

    const next = () => {
      if (step < 3) setStep(s => s + 1);
      else {
        setState(prev => ({
          ...prev,
          userDetails: { fullName: formData.name, state: formData.state, city: formData.city, address: formData.address },
          fianceDetails: { fullName: formData.fName, state: formData.fState, city: formData.fCity, address: '' },
          weddingDetails: { 
            date: formData.wDate, 
            state: formData.wState, 
            city: formData.wCity, 
            venueFinalized: formData.venue as any,
            venueName: formData.vName,
            venueLocation: formData.vLoc
          },
          screen: 'dashboard'
        }));
      }
    };

    return (
      <div className="absolute inset-0 bg-ivory p-6 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? 'w-8 bg-gold' : 'w-4 bg-gold/20'}`} />
            ))}
          </div>
          <span className="text-gold font-medium">Step {step} of 3</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {step === 1 && (
              <>
                <h2 className="text-3xl font-bold text-rose">Your Details</h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input type="text" placeholder="Enter your name" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">State</label>
                      <select className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold">
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                        <option>Rajasthan</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">City</label>
                      <input type="text" placeholder="Mumbai" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</label>
                    <textarea placeholder="Residential address" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold h-24" />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-3xl font-bold text-rose">Fiancé Details</h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input type="text" placeholder="Enter fiancé's name" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">State</label>
                      <select className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold">
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                        <option>Rajasthan</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">City</label>
                      <input type="text" placeholder="Mumbai" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex flex-col items-center mb-6">
                  <motion.h2 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-serif text-gold mb-4"
                  >
                    श्री गणेशाय नमः
                  </motion.h2>
                  <h2 className="text-3xl font-bold text-rose">Wedding Details</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wedding Date</label>
                    <input type="date" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wedding State</label>
                      <select className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold">
                        <option>Rajasthan</option>
                        <option>Goa</option>
                        <option>Uttarakhand</option>
                        <option>Maharashtra</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wedding City</label>
                      <input type="text" placeholder="Udaipur" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Have you finalized venue?</label>
                    <div className="flex gap-2">
                      {['Yes', 'No', 'In Discussion'].map(opt => (
                        <button key={opt} className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${formData.venue === opt.toLowerCase() ? 'bg-rose text-ivory border-rose' : 'bg-white text-slate-600 border-slate-100'}`} onClick={() => setFormData({...formData, venue: opt.toLowerCase()})}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-8 left-6 right-6">
          <button 
            onClick={next}
            className="w-full bg-rose text-ivory py-4 rounded-2xl font-bold shadow-xl shadow-rose/20 flex items-center justify-center gap-2"
          >
            {step === 3 ? 'Complete Setup' : 'Continue'} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  // --- Main Layout Components ---

  const [activeTab, setActiveTab] = useState<'home' | 'checklist' | 'inspiration' | 'packages' | 'profile'>('home');

  // Navigation Helper
  const navigate = (screen: AppState['screen']) => setState(prev => ({ ...prev, screen }));

  const TopBar = () => (
    <div className="sticky top-0 z-[110] bg-ivory/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSideMenuOpen(true)}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose hover:scale-110 active:scale-95 transition-transform"
        >
          <Menu size={20} />
        </button>
        <button 
          onClick={() => setMegaMenuOpen(!megaMenuOpen)}
          className={`px-4 py-2 rounded-full border text-xs font-bold transition-all flex items-center gap-2 ${megaMenuOpen ? 'bg-rose text-ivory border-rose' : 'bg-white text-rose border-slate-100'}`}
        >
          Vendors <ChevronDown size={14} className={`transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate('dashboard')}>
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-gold mandala-glow" />
          <h1 className="brand-logo gold-shimmer">VIVAHA</h1>
          <Sparkles size={16} className="text-gold mandala-glow" />
        </div>
        <div className="flourish-underline" />
      </div>
      <button 
        onClick={() => setNotificationsOpen(true)}
        className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose relative hover:scale-110 active:scale-95 transition-transform"
      >
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
      </button>
    </div>
  );

  const BottomNav = () => (
    <div className="absolute bottom-0 left-0 right-0 bottom-nav-blur px-4 py-3 flex items-center justify-between z-40 border-t border-slate-100">
      {[
        { id: 'home', icon: <LayoutDashboard size={24} />, label: 'Home' },
        { id: 'checklist', icon: <CheckCircle2 size={24} />, label: 'Checklist' },
        { id: 'inspiration', icon: <ImageIcon size={24} />, label: 'Inspiration' },
        { id: 'packages', icon: <PackageIcon size={24} />, label: 'Packages' },
        { id: 'profile', icon: <User size={24} />, label: 'Profile' },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id as any);
            if (state.screen !== 'dashboard') navigate('dashboard');
          }}
          className={`flex flex-col items-center gap-1 transition-all group ${activeTab === tab.id ? 'text-rose scale-110' : 'text-slate-400 hover:text-rose/60'}`}
        >
          <div className={`transition-transform group-active:scale-90 ${activeTab === tab.id ? 'text-gold' : ''}`}>
            {tab.icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
        </button>
      ))}
    </div>
  );

  // --- Tab Screens ---

  const HomeTab = () => {
    const [featuredIndex, setFeaturedIndex] = useState(0);
    const featuredVendors = VENDORS.filter(v => v.isPremium);

    useEffect(() => {
      const interval = setInterval(() => {
        setFeaturedIndex(prev => (prev + 1) % featuredVendors.length);
      }, 5000);
      return () => clearInterval(interval);
    }, [featuredVendors.length]);

    if (isLoading) {
      return (
        <div className="p-6 space-y-8 pb-24">
          <Skeleton className="h-64 w-full" />
          <div className="flex gap-4 overflow-hidden">
            <Skeleton className="h-32 w-32 shrink-0" />
            <Skeleton className="h-32 w-32 shrink-0" />
            <Skeleton className="h-32 w-32 shrink-0" />
          </div>
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      );
    }

    return (
      <div className="p-6 space-y-10 pb-24">
        {/* Hero Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-rose to-petal p-8 rounded-[2.5rem] text-ivory shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-serif text-gold mb-6"
            >
              श्री गणेशाय नमः
            </motion.h2>
            
            <h3 className="text-3xl font-bold mb-2 font-serif italic">Priya & Rohan</h3>
            <div className="flex items-center gap-4 text-champagne/80 text-sm mb-6">
              <span className="flex items-center gap-1"><Calendar size={14} /> Dec 12, 2026</span>
              <div className="w-1 h-1 rounded-full bg-gold/40" />
              <span className="flex items-center gap-1"><MapPin size={14} /> Udaipur</span>
            </div>

            <div className="w-full bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-champagne/60 tracking-widest">Countdown</p>
                <p className="font-bold text-lg">284 Days to go</p>
              </div>
              <button 
                onClick={() => alert('Invitation link copied!')}
                className="bg-gold text-rose px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
              >
                Share Invite
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Vendors Carousel */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-rose">Featured Vendors</h2>
            <div className="flex gap-1">
              {featuredVendors.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === featuredIndex ? 'w-4 bg-gold' : 'w-1 bg-gold/20'}`} />
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] shadow-xl aspect-[16/10]">
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute inset-0"
              >
                <img 
                  src={featuredVendors[featuredIndex].image} 
                  className="w-full h-full object-cover" 
                  alt={featuredVendors[featuredIndex].name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="bg-gold text-rose text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block uppercase tracking-widest">Premium Partner</span>
                      <h4 className="text-2xl font-bold text-white mb-1">{featuredVendors[featuredIndex].name}</h4>
                      <p className="text-white/70 text-sm flex items-center gap-2">
                        <Star size={14} className="text-gold fill-current" /> {featuredVendors[featuredIndex].rating} • {featuredVendors[featuredIndex].category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-bold text-lg">{featuredVendors[featuredIndex].price}</p>
                      <p className="text-white/50 text-[10px] uppercase tracking-widest">Starting Price</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Browse Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-rose">Browse Categories</h2>
            <button onClick={() => setMegaMenuOpen(true)} className="text-gold text-sm font-bold flex items-center gap-1">
              All Categories <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <div 
                key={cat.name} 
                className="min-w-[160px] premium-card p-6 flex flex-col items-center text-center cursor-pointer hover:border-gold/50 transition-all hover:-translate-y-1"
                onClick={() => {
                  setState(prev => ({ ...prev, screen: 'category_page', selectedCategory: cat.items[0] }));
                }}
              >
                <div className="w-20 h-20 rounded-full bg-rose/5 flex items-center justify-center mb-4 border border-rose/10 group-hover:bg-rose/10 transition-colors">
                  <Sparkles className="text-rose" size={32} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">{cat.name}</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{cat.items.length} Options</p>
              </div>
            ))}
          </div>
        </section>

        {/* Real Weddings Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-rose">Real Weddings</h2>
            <button onClick={() => navigate('real_weddings')} className="text-gold text-sm font-bold">View All</button>
          </div>
          <div className="space-y-6">
            {REAL_WEDDINGS.map(wedding => (
              <div key={wedding.id} className="premium-card overflow-hidden group cursor-pointer" onClick={() => navigate('real_weddings')}>
                <div className="relative h-64">
                  <img src={wedding.mainImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={wedding.couple} referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <p className="text-xs font-bold text-rose flex items-center gap-1">
                      <MapPin size={12} /> {wedding.location}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-2xl font-bold text-slate-800 mb-2">{wedding.couple}</h4>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 italic">"{wedding.story}"</p>
                  <div className="flex flex-wrap gap-2">
                    {wedding.vendors.map((v, i) => (
                      <span key={`${v.category}-${i}`} className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg">
                        {v.category}: {v.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-rose">Wedding Tips & Ideas</h2>
            <button onClick={() => navigate('blogs')} className="text-gold text-sm font-bold">Read Blog</button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {BLOGS.map(blog => (
              <div key={blog.id} className="premium-card flex flex-col sm:flex-row overflow-hidden hover:shadow-xl transition-shadow">
                <div className="sm:w-48 h-48 shrink-0 relative">
                  <img src={blog.image} className="w-full h-full object-cover" alt={blog.title} referrerPolicy="no-referrer" />
                  <div className="absolute top-2 left-2 bg-rose text-ivory text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">
                    {blog.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xl mb-2 leading-tight hover:text-rose transition-colors cursor-pointer">{blog.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2">{blog.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{blog.date}</span>
                    <button className="text-gold text-xs font-bold uppercase tracking-widest flex items-center gap-1 group">
                      Read Full Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    );
  };

  const ChecklistTab = () => {
    const [aiChatOpen, setAiChatOpen] = useState(false);
    const [aiResponse, setAiResponse] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        setTasks((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };

    const toggleTask = (id: string) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const handleAddTask = () => {
      if (!newTaskTitle.trim()) return;
      const newTask: Task = {
        id: Math.random().toString(36).substring(2, 9),
        title: newTaskTitle,
        completed: false
      };
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setIsAddTaskOpen(false);
    };

    const askAi = async () => {
      setLoadingAi(true);
      setAiChatOpen(true);
      try {
        const model = ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Generate a personalized wedding planning timeline and checklist for an Indian wedding in Udaipur for 500 guests with a budget of 50 lakhs. Format as a concise list of priority tasks.",
        });
        const response = await model;
        setAiResponse(response.text || 'No response');
      } catch (e) {
        setAiResponse('Error connecting to AI assistant.');
      }
      setLoadingAi(false);
    };

    return (
      <div className="p-6 space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-rose">Wedding Checklist</h2>
          <button 
            onClick={() => setIsAddTaskOpen(true)}
            className="bg-rose text-ivory p-3 rounded-2xl shadow-lg"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={tasks.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((task) => (
                <SortableTask key={task.id} task={task} toggleTask={toggleTask} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* AI Assistant Floating Button */}
        <button 
          onClick={state.isPremium ? askAi : () => alert("Upgrade to Premium for AI assistance!")}
          className="absolute bottom-36 right-4 w-16 h-16 bg-gradient-to-br from-rose to-petal rounded-full shadow-2xl flex items-center justify-center text-gold border-2 border-gold/20 z-50 animate-bounce"
        >
          <Sparkles size={28} />
        </button>

        {/* Add Task Modal */}
        <AnimatePresence>
          {isAddTaskOpen && (
            <motion.div 
              key="add-task-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div 
                key="add-task-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-ivory w-full max-w-sm rounded-[2rem] p-8 shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-rose mb-6">Add New Task</h3>
                <input 
                  autoFocus
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold mb-6"
                />
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsAddTaskOpen(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-slate-400"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddTask}
                    className="flex-1 bg-rose text-ivory py-4 rounded-2xl font-bold shadow-lg shadow-rose/20"
                  >
                    Add Task
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Modal */}
        <AnimatePresence>
          {aiChatOpen && (
            <motion.div 
              key="ai-concierge-modal"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end"
            >
              <div className="bg-ivory w-full rounded-t-[3rem] p-8 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center text-gold">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-rose">AI Concierge</h3>
                      <p className="text-xs text-slate-500">Premium Planning Assistant</p>
                    </div>
                  </div>
                  <button onClick={() => setAiChatOpen(false)} className="text-slate-400">
                    <Plus className="rotate-45" size={24} />
                  </button>
                </div>
                
                {loadingAi ? (
                  <div className="py-12 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 italic">Crafting your perfect timeline...</p>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                      {aiResponse}
                    </div>
                    <button className="w-full mt-8 bg-rose text-ivory py-4 rounded-2xl font-bold">
                      Add to My Checklist
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const CategoryPage = () => {
    const [sortBy, setSortBy] = useState<'rating' | 'priceLow' | 'priceHigh'>('rating');
    const [filterCity, setFilterCity] = useState<string>('All');
    const [filterBudget, setFilterBudget] = useState<number>(2000000);

    const filteredVendors = VENDORS.filter(v => {
      const matchesCategory = state.selectedCategory ? v.category.toLowerCase().includes(state.selectedCategory.toLowerCase()) || v.name.toLowerCase().includes(state.selectedCategory.toLowerCase()) : true;
      const matchesCity = filterCity === 'All' || v.location === filterCity;
      const matchesBudget = v.priceValue <= filterBudget;
      return matchesCategory && matchesCity && matchesBudget;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'priceLow') return a.priceValue - b.priceValue;
      if (sortBy === 'priceHigh') return b.priceValue - a.priceValue;
      return 0;
    });

    return (
      <div className="absolute inset-0 bg-ivory flex flex-col z-[80]">
        <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
          <button onClick={() => navigate('dashboard')} className="text-rose flex items-center gap-1 font-bold">
            <ChevronLeft size={20} /> Back
          </button>
          <h2 className="text-xl font-bold text-rose">{state.selectedCategory || 'Vendors'}</h2>
          <div className="w-10" />
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto no-scrollbar pb-24">
          {/* Filters */}
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-2">
              {['All', 'Mumbai', 'Delhi', 'Kolkata', 'Udaipur'].map(city => (
                <button 
                  key={city}
                  onClick={() => setFilterCity(city)}
                  className={`px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap transition-all ${filterCity === city ? 'bg-rose text-ivory border-rose' : 'bg-white text-slate-500 border-slate-100'}`}
                >
                  {city}
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Max Budget: ₹{filterBudget.toLocaleString()}</p>
                <input 
                  type="range" 
                  min="50000" 
                  max="2000000" 
                  step="50000"
                  value={filterBudget}
                  onChange={(e) => setFilterBudget(parseInt(e.target.value))}
                  className="w-full accent-rose"
                />
              </div>
              <button 
                onClick={() => {
                  if (sortBy === 'rating') setSortBy('priceLow');
                  else if (sortBy === 'priceLow') setSortBy('priceHigh');
                  else setSortBy('rating');
                }}
                className="bg-slate-100 p-3 rounded-xl text-slate-600 flex items-center gap-2 text-xs font-bold"
              >
                <ArrowUpDown size={16} /> {sortBy === 'rating' ? 'Top Rated' : sortBy === 'priceLow' ? 'Price: Low' : 'Price: High'}
              </button>
            </div>
          </div>

          {/* Vendor List */}
          <div className="space-y-6">
            {filteredVendors.length > 0 ? filteredVendors.map(vendor => (
              <motion.div 
                layout
                key={vendor.id} 
                className="premium-card overflow-hidden group"
                onClick={() => setSelectedVendor(vendor)}
              >
                <div className="relative h-48">
                  <img src={vendor.image} className="w-full h-full object-cover" alt={vendor.name} referrerPolicy="no-referrer" />
                  {vendor.isPremium && (
                    <div className="absolute top-4 right-4 bg-gold text-rose text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                      PREMIUM
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{vendor.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12} /> {vendor.location}</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold">
                      <Star size={14} className="fill-current" /> {vendor.rating}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
                    <p className="text-rose font-bold">{vendor.price}</p>
                    <button className="text-gold text-xs font-bold uppercase tracking-widest">View Portfolio</button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <Search size={40} />
                </div>
                <p className="text-slate-500 font-medium">No vendors found matching your criteria.</p>
                <button onClick={() => {setFilterCity('All'); setFilterBudget(2000000);}} className="text-rose font-bold">Reset Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const RealWeddingsPage = () => (
    <div className="absolute inset-0 bg-ivory flex flex-col z-[80]">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => navigate('dashboard')} className="text-rose flex items-center gap-1 font-bold">
          <ChevronLeft size={20} /> Back
        </button>
        <h2 className="text-xl font-bold text-rose">Real Weddings</h2>
        <div className="w-10" />
      </div>
      <div className="p-6 space-y-8 overflow-y-auto no-scrollbar pb-24">
        {REAL_WEDDINGS.map(wedding => (
          <div key={wedding.id} className="space-y-6">
            <div className="premium-card overflow-hidden">
              <img src={wedding.mainImage} className="w-full h-80 object-cover" alt={wedding.couple} referrerPolicy="no-referrer" />
              <div className="p-6">
                <h3 className="text-3xl font-bold text-slate-800 mb-2">{wedding.couple}</h3>
                <p className="text-rose font-medium mb-4 flex items-center gap-2"><MapPin size={16} /> {wedding.location}</p>
                <p className="text-slate-600 leading-relaxed italic mb-8">"{wedding.story}"</p>
                
                <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">The Dream Team</h4>
                <div className="grid grid-cols-2 gap-4">
                  {wedding.vendors.map((v, i) => (
                    <div key={`${v.category}-${i}`} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{v.category}</p>
                      <p className="font-bold text-slate-800 text-sm">{v.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const BlogsPage = () => (
    <div className="absolute inset-0 bg-ivory flex flex-col z-[80]">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => navigate('dashboard')} className="text-rose flex items-center gap-1 font-bold">
          <ChevronLeft size={20} /> Back
        </button>
        <h2 className="text-xl font-bold text-rose">Wedding Blog</h2>
        <div className="w-10" />
      </div>
      <div className="p-6 space-y-8 overflow-y-auto no-scrollbar pb-24">
        {BLOGS.map(blog => (
          <div key={blog.id} className="premium-card overflow-hidden">
            <img src={blog.image} className="w-full h-64 object-cover" alt={blog.title} referrerPolicy="no-referrer" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-rose/10 text-rose text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">{blog.category}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{blog.date}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 leading-tight">{blog.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{blog.excerpt}</p>
              <button className="w-full bg-rose text-ivory py-4 rounded-2xl font-bold">Read Full Article</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const InspirationTab = () => (
    <div className="p-6 space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-rose">Inspiration Boards</h2>
        <button className="bg-gold text-rose p-3 rounded-2xl shadow-lg">
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {INSPIRATION_BOARDS.map((board) => (
          <div 
            key={board.id} 
            className="premium-card relative aspect-square overflow-hidden group cursor-pointer"
            onClick={() => setSelectedBoard(board)}
          >
            <img src={board.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={board.name} referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
              <h4 className="text-ivory font-bold text-lg">{board.name}</h4>
              <p className="text-gold/80 text-[10px] font-bold uppercase tracking-widest">{board.count} Items</p>
            </div>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-2xl font-bold text-rose mb-4">Real Weddings</h2>
        <div className="space-y-4">
          {[
            { couple: 'Ananya & Kabir', city: 'Jaipur', type: 'Destination', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800' },
            { couple: 'Meera & Arjun', city: 'Mumbai', type: 'Grand', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800' },
          ].map((wedding, idx) => (
            <div key={`${wedding.couple}-${idx}`} className="premium-card overflow-hidden">
              <img src={wedding.img} className="w-full h-48 object-cover" alt={wedding.couple} referrerPolicy="no-referrer" />
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800">{wedding.couple}</h4>
                  <p className="text-xs text-slate-500">{wedding.city} • {wedding.type} Wedding</p>
                </div>
                <button className="bg-gold/10 text-gold p-2 rounded-xl">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const PackagesTab = () => {
    const [subTab, setSubTab] = useState<'pairs' | 'experts' | 'top'>('pairs');

    return (
      <div className="p-6 space-y-8 pb-24">
        <h2 className="text-3xl font-bold text-rose">Design Your Package</h2>

        <div className="flex bg-white/50 p-1 rounded-2xl border border-slate-100">
          {[
            { id: 'pairs', label: 'Power Pairs' },
            { id: 'experts', label: 'Solo Experts' },
            { id: 'top', label: 'Top Vendors' },
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setSubTab(t.id as any)}
              className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${subTab === t.id ? 'bg-rose text-ivory shadow-lg' : 'text-slate-400'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {subTab === 'pairs' && POWER_PAIRS.map(pkg => (
            <div key={pkg.id} className="premium-card overflow-hidden">
              <img src={pkg.image} className="w-full h-48 object-cover" alt={pkg.name} referrerPolicy="no-referrer" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-rose">{pkg.name}</h3>
                    <p className="text-xs text-slate-500">{pkg.members.join(' + ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">{pkg.price}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Starting At</p>
                  </div>
                </div>
                <button className="w-full bg-rose/5 text-rose border border-rose/10 py-3 rounded-xl font-bold hover:bg-rose hover:text-ivory transition-all">
                  View Package Details
                </button>
              </div>
            </div>
          ))}

          {subTab === 'experts' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Search vendor type..." className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold" />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {['Photographer', 'Makeup', 'DJ', 'Planner', 'Caterer'].map(cat => (
                  <button key={cat} className="whitespace-nowrap px-6 py-2 rounded-full border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest bg-gold/5">
                    {cat}
                  </button>
                ))}
              </div>
              {VENDORS.map(vendor => (
                <div 
                  key={vendor.id} 
                  className="premium-card flex p-4 gap-4 cursor-pointer hover:border-gold/50 transition-colors"
                  onClick={() => setSelectedVendor(vendor)}
                >
                  <img src={vendor.image} className="w-24 h-24 rounded-2xl object-cover" alt={vendor.name} referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-slate-800">{vendor.name}</h4>
                      <div className="flex items-center gap-1 text-gold">
                        <Sparkles size={12} fill="currentColor" />
                        <span className="text-xs font-bold">{vendor.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{vendor.category} • {vendor.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-bold">{vendor.price}</span>
                      <button className="bg-rose text-ivory p-2 rounded-lg">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {subTab === 'top' && (
             <div className="text-center py-12">
                <Crown className="text-gold mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold text-rose mb-2">Most Loved Vendors</h3>
                <p className="text-slate-500 text-sm">Curated selection for our premium couples.</p>
             </div>
          )}
        </div>

        {/* Sticky Summary */}
        <div className="absolute bottom-24 left-6 right-6 bg-rose text-ivory p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-gold/20">
          <div>
            <p className="text-[10px] uppercase font-bold text-champagne/60 tracking-widest">My Package</p>
            <p className="font-bold">₹0 Selected</p>
          </div>
          <button className="bg-gold text-rose px-6 py-2 rounded-xl font-bold text-sm">
            Save Package
          </button>
        </div>
      </div>
    );
  };

  const BookingsPage = () => (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('dashboard')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-rose">My Bookings</h2>
      </div>
      
      <div className="space-y-4">
        {/* Placeholder for bookings - assuming empty for now */}
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-rose/5 rounded-full flex items-center justify-center text-rose/30">
            <Calendar size={40} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">No bookings yet</h3>
            <p className="text-slate-500 text-sm max-w-[240px]">Start exploring vendors and book your favorites for your big day.</p>
          </div>
          <button 
            onClick={() => {
              navigate('dashboard');
              setActiveTab('home');
            }}
            className="bg-gold text-rose px-6 py-3 rounded-xl font-bold text-sm shadow-lg"
          >
            Explore Vendors
          </button>
        </div>
      </div>
    </div>
  );

  const SavedVendorsPage = () => (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('dashboard')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-rose">Saved Vendors</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {VENDORS.slice(0, 2).map(vendor => (
          <div key={vendor.id} className="premium-card overflow-hidden flex">
            <img src={vendor.image} className="w-24 h-24 object-cover" alt={vendor.name} referrerPolicy="no-referrer" />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{vendor.name}</h4>
                <p className="text-[10px] text-slate-400 uppercase font-bold">{vendor.category}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-gold">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold">{vendor.rating}</span>
                </div>
                <button className="text-rose/40 hover:text-rose transition-colors">
                  <Heart size={18} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className="p-6 space-y-8 pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('dashboard')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-rose">Settings</h2>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Account</h3>
          <div className="premium-card divide-y divide-slate-50">
            {[
              { label: 'Edit Profile', icon: <User size={18} /> },
              { label: 'Change Password', icon: <Lock size={18} /> },
              { label: 'Notifications', icon: <Bell size={18} />, toggle: true },
            ].map((item) => (
              <div key={item.label} className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-rose/60">{item.icon}</div>
                  <span className="font-medium text-slate-700">{item.label}</span>
                </div>
                {item.toggle ? (
                  <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                ) : (
                  <ChevronRight size={18} className="text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Danger Zone</h3>
          <div className="premium-card">
            <button className="w-full p-5 flex items-center gap-4 text-red-500 font-medium hover:bg-red-50 transition-colors">
              <LogOut size={18} />
              <span>Delete Account</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );

  const HelpSupportPage = () => (
    <div className="p-6 space-y-8 pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('dashboard')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-rose">Help & Support</h2>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Common Questions</h3>
          <div className="space-y-3">
            {[
              "How do I book a vendor?",
              "What is included in Premium?",
              "How to share my wedding invite?",
              "Can I change my wedding date later?"
            ].map((q) => (
              <div key={q} className="premium-card p-4 flex items-center justify-between group cursor-pointer">
                <span className="text-sm font-medium text-slate-700">{q}</span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-gold transition-colors" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Contact Us</h3>
          <div className="premium-card p-6 space-y-4">
            <div 
              onClick={() => setIsExpertChatOpen(true)}
              className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-rose/5 rounded-full flex items-center justify-center text-rose">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Chat with us</p>
                <p className="text-xs text-slate-500">Available 10 AM - 8 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose/5 rounded-full flex items-center justify-center text-rose">
                <Bell size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Email Support</p>
                <p className="text-xs text-slate-500">support@vivaha.com</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const AboutVivahPage = () => (
    <div className="p-6 space-y-8 pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('dashboard')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-rose">About Vivah</h2>
      </div>

      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-24 h-24 bg-gold rounded-3xl flex items-center justify-center shadow-xl">
          <Heart className="text-rose w-12 h-12 fill-current" />
        </div>
        <div className="space-y-2 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-gold mandala-glow" />
            <h3 className="brand-logo-large gold-shimmer">VIVAHA</h3>
            <Sparkles size={24} className="text-gold mandala-glow" />
          </div>
          <div className="flourish-underline w-24" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Version 2.4.0</p>
        </div>
        
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>Vivah is India's premier AI-powered wedding planning platform, designed to make your journey to the altar as beautiful as the wedding itself.</p>
          <p>Our vision is to simplify the complex world of wedding planning by connecting couples with the finest vendors and providing intelligent tools to manage every detail.</p>
        </div>

        <div className="pt-8 w-full">
          <div className="premium-card p-6 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Terms of Service</span>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="p-6 space-y-8 pb-24">
      <div className="flex flex-col items-center text-center pt-8">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-gold p-1">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" className="w-full h-full rounded-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
          </div>
          {state.isPremium && (
            <div className="absolute -bottom-2 -right-2 bg-gold text-rose p-2 rounded-full shadow-lg border-2 border-ivory">
              <Crown size={20} />
            </div>
          )}
        </div>
        <h2 className="text-3xl font-bold text-rose">Priya Sharma</h2>
        <p className="text-slate-500">Bride • Wedding in 286 Days</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Saved', count: 12, icon: <Heart size={18} />, screen: 'saved_vendors' },
          { label: 'Bookings', count: 0, icon: <Calendar size={18} />, screen: 'bookings' },
          { label: 'Boards', count: 6, icon: <ImageIcon size={18} />, screen: 'inspiration' },
        ].map(stat => (
          <button 
            key={stat.label} 
            onClick={() => {
              if (stat.screen === 'inspiration') {
                setActiveTab('inspiration');
              } else {
                navigate(stat.screen as any);
              }
            }}
            className="premium-card p-4 text-center hover:bg-slate-50 transition-colors"
          >
            <div className="text-gold flex justify-center mb-1">{stat.icon}</div>
            <p className="text-lg font-bold text-rose">{stat.count}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400">{stat.label}</p>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Account Settings</h3>
        <div className="premium-card divide-y divide-slate-50">
          {[
            { icon: <User size={20} />, label: 'Personal Information', screen: 'settings' },
            { icon: <Heart size={20} />, label: 'Fiancé Information', screen: 'settings' },
            { icon: <Calendar size={20} />, label: 'Wedding Details', screen: 'settings' },
            { icon: <Crown size={20} />, label: 'Subscription Plan', extra: state.isPremium ? 'Premium' : 'Free', screen: 'packages' },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => {
                if (item.screen === 'packages') {
                  setActiveTab('packages');
                } else {
                  navigate(item.screen as any);
                }
              }}
              className="w-full p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="text-rose/60">{item.icon}</div>
              <span className="font-medium text-slate-700">{item.label}</span>
              {item.extra && <span className="ml-auto text-xs font-bold text-gold uppercase">{item.extra}</span>}
              {!item.extra && <ChevronRight className="ml-auto text-slate-300" size={18} />}
            </button>
          ))}
        </div>

        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 pt-4">Support & Privacy</h3>
        <div className="premium-card divide-y divide-slate-50">
          {[
            { icon: <MessageSquare size={20} />, label: 'Help & Support', screen: 'help_support' },
            { icon: <ShieldCheck size={20} />, label: 'About Vivah', screen: 'about_vivah' },
            { icon: <LogOut size={20} />, label: 'Logout', color: 'text-red-500' },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => {
                if (item.label === 'Logout') {
                  setShowSplash(true);
                  setState(prev => ({ ...prev, screen: 'splash' }));
                } else if (item.screen) {
                  navigate(item.screen as any);
                }
              }}
              className={`w-full p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors ${item.color || 'text-slate-700'}`}>
              <div className="opacity-60">{item.icon}</div>
              <span className="font-medium">{item.label}</span>
              <ChevronRight className="ml-auto text-slate-300" size={18} />
            </button>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );

  const InspirationDetailModal: React.FC<{ board: InspirationBoard, onClose: () => void }> = ({ board, onClose }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-ivory w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[80vh] rounded-t-[40px] sm:rounded-[40px] overflow-hidden flex flex-col"
      >
        <div className="relative h-64 flex-shrink-0">
          <img src={board.img} className="w-full h-full object-cover" alt={board.name} referrerPolicy="no-referrer" />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-ivory hover:bg-black/40 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-3xl font-bold text-ivory">{board.name} Catalogue</h2>
            <p className="text-gold font-bold text-xs uppercase tracking-widest">{board.count} Curated Ideas</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Description</h3>
            <p className="text-slate-600 leading-relaxed">
              {board.description}
            </p>
          </section>

          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Gallery</h3>
            <div className="grid grid-cols-2 gap-4">
              {board.catalogue.map((item) => (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-[3/4]">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-ivory text-[10px] font-bold uppercase tracking-widest">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );

  const VendorDetailModal: React.FC<{ vendor: Vendor, onClose: () => void }> = ({ vendor, onClose }) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-ivory w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[80vh] rounded-t-[40px] sm:rounded-[40px] overflow-hidden flex flex-col"
      >
        <div className="relative h-64 flex-shrink-0">
          <img src={vendor.image} className="w-full h-full object-cover" alt={vendor.name} referrerPolicy="no-referrer" />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-ivory hover:bg-black/40 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex justify-between items-end">
              <div>
                <span className="bg-gold text-rose text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">
                  {vendor.category}
                </span>
                <h2 className="text-3xl font-bold text-ivory">{vendor.name}</h2>
              </div>
              <div className="flex items-center gap-1 text-gold bg-black/20 backdrop-blur-md px-3 py-1 rounded-full">
                <Sparkles size={14} fill="currentColor" />
                <span className="text-sm font-bold">{vendor.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">About the Vendor</h3>
            <p className="text-slate-600 leading-relaxed">
              {vendor.description || "A premier wedding service provider dedicated to making your special day unforgettable with exceptional quality and attention to detail."}
            </p>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Portfolio Catalogue</h3>
              <span className="text-[10px] font-bold text-gold uppercase tracking-widest">View All</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {vendor.portfolio?.map((item) => (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-square">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-ivory text-[10px] font-bold uppercase tracking-widest">{item.title}</p>
                  </div>
                </div>
              )) || (
                <div className="col-span-2 py-8 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                  <ImageIcon className="mx-auto text-slate-200 mb-2" size={32} />
                  <p className="text-xs text-slate-400">No portfolio items available yet.</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-rose/5 p-6 rounded-3xl border border-rose/10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Starting Price</p>
                <p className="text-2xl font-bold text-rose">{vendor.price}</p>
              </div>
              <button className="bg-rose text-ivory px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose/20 active:scale-95 transition-transform">
                Book Now
              </button>
            </div>
            <p className="text-[10px] text-slate-400 italic text-center">*Prices may vary based on customization and requirements.</p>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );

  const Footer = () => (
    <footer className="bg-slate-800 text-slate-300 pt-12 pb-8 px-6 mt-12">
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="col-span-2">
          <div className="flex flex-col items-start mb-8">
            <div className="flex items-center gap-3">
              <Sparkles size={24} className="text-gold mandala-glow" />
              <h2 className="brand-logo-large gold-shimmer">VIVAHA</h2>
            </div>
            <div className="flourish-underline-left w-32" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <h4 className="text-ivory font-bold uppercase tracking-widest mb-2">About Vivaha</h4>
              <p className="hover:text-gold cursor-pointer">Who are we?</p>
              <p className="hover:text-gold cursor-pointer">Careers</p>
              <p className="hover:text-gold cursor-pointer">Authenticity</p>
              <p className="hover:text-gold cursor-pointer">Testimonials</p>
              <p className="hover:text-gold cursor-pointer">Sustainability</p>
              <p className="hover:text-gold cursor-pointer text-rose">Investor Relations</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-ivory font-bold uppercase tracking-widest mb-2">Help</h4>
              <p className="hover:text-gold cursor-pointer">Contact Us</p>
              <p className="hover:text-gold cursor-pointer">FAQs</p>
              <p className="hover:text-gold cursor-pointer">Wedding Concierge</p>
              <p className="hover:text-gold cursor-pointer">Cancellation & Refund</p>
              <p className="hover:text-gold cursor-pointer">Vendor Support</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <h4 className="text-ivory font-bold uppercase tracking-widest mb-2">Inspire Me</h4>
          <p className="hover:text-gold cursor-pointer">Wedding Blog</p>
          <p className="hover:text-gold cursor-pointer">Mood Boards</p>
          <p className="hover:text-gold cursor-pointer">Planning Guides</p>
          <p className="hover:text-gold cursor-pointer">Success Stories</p>
        </div>

        <div className="space-y-3 text-xs">
          <h4 className="text-ivory font-bold uppercase tracking-widest mb-2">Quick Links</h4>
          <p className="hover:text-gold cursor-pointer">Special Offers</p>
          <p className="hover:text-gold cursor-pointer">New Vendors</p>
          <p className="hover:text-gold cursor-pointer">Destination Weddings</p>
          <p className="hover:text-gold cursor-pointer">Luxury Packages</p>
          <p className="hover:text-gold cursor-pointer">Sitemap</p>
        </div>

        <div className="col-span-2 space-y-3 text-xs">
          <h4 className="text-ivory font-bold uppercase tracking-widest mb-2">Top Categories</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <p className="hover:text-gold cursor-pointer">Venues</p>
            <p className="hover:text-gold cursor-pointer">Photography</p>
            <p className="hover:text-gold cursor-pointer">Makeup Artists</p>
            <p className="hover:text-gold cursor-pointer">Decorators</p>
            <p className="hover:text-gold cursor-pointer">Catering</p>
            <p className="hover:text-gold cursor-pointer">Bridal Wear</p>
            <p className="hover:text-gold cursor-pointer">Groom Wear</p>
            <p className="hover:text-gold cursor-pointer">Invitations</p>
            <p className="hover:text-gold cursor-pointer">Jewelry</p>
            <p className="hover:text-gold cursor-pointer">Honeymoon</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-8 pb-4">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center text-rose">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h5 className="text-[10px] font-bold text-ivory uppercase">Verified Vendors</h5>
              <p className="text-[9px] text-slate-500">Curated & Vetted</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center text-rose">
              <Lock size={20} />
            </div>
            <div>
              <h5 className="text-[10px] font-bold text-ivory uppercase">Secure Booking</h5>
              <p className="text-[9px] text-slate-500">100% Payment Protection</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center text-rose">
              <Star size={20} />
            </div>
            <div>
              <h5 className="text-[10px] font-bold text-ivory uppercase">Authentic Reviews</h5>
              <p className="text-[9px] text-slate-500">Real Couple Feedback</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center text-rose">
              <Users size={20} />
            </div>
            <div>
              <h5 className="text-[10px] font-bold text-ivory uppercase">5000+ Vendors</h5>
              <p className="text-[9px] text-slate-500">Across 50+ Cities</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-slate-700 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Show us some love ❤️ on social media</p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-rose transition-colors cursor-pointer">
              <Instagram size={16} />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-rose transition-colors cursor-pointer">
              <Facebook size={16} />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-rose transition-colors cursor-pointer">
              <Twitter size={16} />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-rose transition-colors cursor-pointer">
              <Youtube size={16} />
            </div>
          </div>
        </div>
      </div>

    </footer>
  );

  const ExpertChatModal = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [chatMessages, isTyping]);

    const playNotificationSound = () => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1); // A4

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
        console.warn('Audio context failed', e);
      }
    };

    const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      
      const userMsg = chatInput;
      const userMsgId = Math.random().toString(36).substring(2, 11);
      setChatMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userMsg }]);
      setChatInput('');
      setIsTyping(true);

      // Simple auto-response system
      setTimeout(() => {
        let response = "I'm here to help! Could you tell me more about your requirements?";
        const lowerMsg = userMsg.toLowerCase();
        
        if (lowerMsg.includes('vendor')) {
          response = "We can help you find the perfect vendors for your wedding. Which category are you looking for first?";
        } else if (lowerMsg.includes('budget')) {
          response = "Planning your budget is crucial. Would you like help setting up a budget tracker?";
        } else if (lowerMsg.includes('city') || lowerMsg.includes('location') || lowerMsg.includes('where')) {
          response = "Tell us your wedding city, and we'll show you the best local options!";
        } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
          response = "Hello! How can I assist you with your wedding planning today?";
        }

        const expertMsgId = Math.random().toString(36).substring(2, 11);
        setChatMessages(prev => [...prev, { id: expertMsgId, role: 'expert', text: response }]);
        setIsTyping(false);
        playNotificationSound();
      }, 1500);
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-end sm:items-center justify-center p-0 sm:p-6"
      >
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="bg-ivory w-full max-w-md h-[85vh] sm:h-[600px] rounded-t-[40px] sm:rounded-[40px] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 bg-rose text-ivory flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm md:text-base truncate">Chat with Wedding Expert</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-70">Online now</p>
              </div>
            </div>
            <button 
              onClick={() => setIsExpertChatOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Plus className="rotate-45" size={24} />
            </button>
          </div>

          {/* Chat Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-ivory"
          >
            {chatMessages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-rose text-ivory rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-rose/40 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-rose/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 bg-rose/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-100 shrink-0">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:border-rose/30 transition-colors"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="w-12 h-12 rounded-2xl bg-rose text-ivory flex items-center justify-center shadow-lg shadow-rose/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // --- Render Logic ---

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-ivory shadow-2xl relative overflow-x-hidden flex flex-col box-border">
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
        
        <AnimatePresence>
          {selectedVendor && (
            <VendorDetailModal 
              key="vendor-modal"
              vendor={selectedVendor} 
              onClose={() => setSelectedVendor(null)} 
            />
          )}
          {selectedBoard && (
            <InspirationDetailModal 
              key="board-modal"
              board={selectedBoard} 
              onClose={() => setSelectedBoard(null)} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExpertChatOpen && <ExpertChatModal key="expert-chat-modal" />}
        </AnimatePresence>

        {!showSplash && state.screen === 'onboarding_info' && <OnboardingInfo key="info" />}
        {!showSplash && state.screen === 'user_type' && <UserTypeSelection key="type" />}
        {!showSplash && state.screen === 'auth' && <AuthScreen key="auth" />}
        {!showSplash && state.screen === 'onboarding_form' && <OnboardingForm key="form" />}
        
        {!showSplash && ['dashboard', 'checklist', 'inspiration', 'packages', 'profile', 'category_page', 'real_weddings', 'blogs', 'bookings', 'saved_vendors', 'settings', 'help_support', 'about_vivah'].includes(state.screen) && (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col relative overflow-hidden"
          >
            {!['bookings', 'saved_vendors', 'settings', 'help_support', 'about_vivah'].includes(state.screen) && <TopBar />}
            <MegaMenu />
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              <AnimatePresence mode="wait">
                {state.screen === 'category_page' && <motion.div key="cp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-50"><CategoryPage /></motion.div>}
                {state.screen === 'real_weddings' && <motion.div key="rw" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-50"><RealWeddingsPage /></motion.div>}
                {state.screen === 'blogs' && <motion.div key="bl" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-50"><BlogsPage /></motion.div>}
                {state.screen === 'bookings' && <motion.div key="bk" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-50"><BookingsPage /></motion.div>}
                {state.screen === 'saved_vendors' && <motion.div key="sv" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-50"><SavedVendorsPage /></motion.div>}
                {state.screen === 'settings' && <motion.div key="st" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-50"><SettingsPage /></motion.div>}
                {state.screen === 'help_support' && <motion.div key="hs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-50"><HelpSupportPage /></motion.div>}
                {state.screen === 'about_vivah' && <motion.div key="av" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 z-50"><AboutVivahPage /></motion.div>}
                
                {activeTab === 'home' && state.screen === 'dashboard' && <motion.div key="h" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><HomeTab /></motion.div>}
                {activeTab === 'checklist' && state.screen === 'dashboard' && <motion.div key="c" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><ChecklistTab /></motion.div>}
                {activeTab === 'inspiration' && state.screen === 'dashboard' && <motion.div key="i" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><InspirationTab /></motion.div>}
                {activeTab === 'packages' && state.screen === 'dashboard' && <motion.div key="p" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><PackagesTab /></motion.div>}
                {activeTab === 'profile' && state.screen === 'dashboard' && <motion.div key="pr" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}><ProfileTab /></motion.div>}
              </AnimatePresence>
            </div>
            {!['bookings', 'saved_vendors', 'settings', 'help_support', 'about_vivah'].includes(state.screen) && <BottomNav />}

            {/* Side Menu Drawer */}
            <AnimatePresence>
              {sideMenuOpen && (
                <>
                  <motion.div 
                    key="sidemenu-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSideMenuOpen(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                  />
                  <motion.div 
                    key="sidemenu-drawer"
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    className="absolute top-0 left-0 bottom-0 w-4/5 bg-ivory z-[101] shadow-2xl p-8 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-12">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          <Sparkles size={20} className="text-gold mandala-glow" />
                          <h2 className="brand-logo-large gold-shimmer">VIVAHA</h2>
                        </div>
                        <div className="flourish-underline-left w-24" />
                      </div>
                      <button onClick={() => setSideMenuOpen(false)} className="text-rose">
                        <Plus className="rotate-45" size={28} />
                      </button>
                    </div>
                    <div className="space-y-6 flex-1">
                      {[
                        { icon: <LayoutDashboard />, label: 'Dashboard', screen: 'dashboard' },
                        { icon: <Calendar />, label: 'Wedding Timeline' },
                        { icon: <User />, label: 'Guest Management' },
                        { icon: <Sparkles />, label: 'AI Planning' },
                        { icon: <Settings />, label: 'App Settings' },
                      ].map((item) => (
                        <button 
                          key={item.label} 
                          onClick={() => {
                            if (item.screen) navigate(item.screen as any);
                            setSideMenuOpen(false);
                          }}
                          className="flex items-center gap-4 text-slate-700 font-medium text-lg w-full text-left"
                        >
                          <div className="text-rose/60">{item.icon}</div>
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <button className="flex items-center gap-4 text-red-500 font-bold text-lg mt-auto">
                      <LogOut /> Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Notifications Drawer */}
            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <motion.div 
                    key="notifications-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setNotificationsOpen(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                  />
                  <motion.div 
                    key="notifications-drawer"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    className="absolute top-0 right-0 bottom-0 w-4/5 bg-ivory z-[101] shadow-2xl p-8 flex flex-col"
                  >
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold text-rose">Notifications</h2>
                      <button onClick={() => setNotificationsOpen(false)} className="text-rose">
                        <Plus className="rotate-45" size={28} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: 'New Vendor Offer', desc: 'The Wedding Salad offered 10% discount!', time: '2h ago' },
                        { title: 'Checklist Update', desc: "Don't forget to finalize the guest list.", time: '5h ago' },
                        { title: 'AI Suggestion', desc: 'New decor themes available for Udaipur.', time: '1d ago' },
                      ].map((n, i) => (
                        <div key={`notification-${i}`} className="premium-card p-4 border-l-4 border-rose">
                          <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                          <p className="text-xs text-slate-500 mb-1">{n.desc}</p>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {!showSplash && !isExpertChatOpen && (
            <motion.div 
              key="chat-button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpertChatOpen(true)}
              className="absolute bottom-20 right-4 z-[150] bg-white rounded-full shadow-2xl p-3 flex items-center gap-3 border border-slate-100 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center text-ivory">
                <MessageCircle size={24} />
              </div>
              <span className="text-xs font-bold text-slate-700 pr-2">How may we help you?</span>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}
