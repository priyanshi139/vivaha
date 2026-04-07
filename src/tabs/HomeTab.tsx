import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Star, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VENDORS, CATEGORIES, REAL_WEDDINGS, BLOGS } from '../constants';
import Skeleton from '../components/Skeleton';
import Footer from '../components/Footer';

const HomeTab: React.FC = () => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const { navigate, setMegaMenuOpen, setState, isLoading, setIsExpertChatOpen } = useApp();
  const featuredVendors = VENDORS.filter(v => v.isPremium);

  useEffect(() => {
    const interval = setInterval(() => setFeaturedIndex(prev => (prev + 1) % featuredVendors.length), 5000);
    return () => clearInterval(interval);
  }, [featuredVendors.length]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-8 pb-24">
        <Skeleton className="h-64 w-full" />
        <div className="flex gap-4 overflow-hidden"><Skeleton className="h-32 w-32 shrink-0" /><Skeleton className="h-32 w-32 shrink-0" /><Skeleton className="h-32 w-32 shrink-0" /></div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 pb-24">
      {/* Hero */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-gradient-to-br from-rose to-petal p-8 rounded-[2.5rem] text-ivory shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-gold/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-serif text-gold mb-6">श्री गणेशाय नमः</motion.h2>
          <h3 className="text-3xl font-bold mb-2 font-serif italic">Priya & Rohan</h3>
          <div className="flex items-center gap-4 text-champagne/80 text-sm mb-6">
            <span className="flex items-center gap-1"><Calendar size={14} /> Dec 12, 2026</span>
            <div className="w-1 h-1 rounded-full bg-gold/40" />
            <span className="flex items-center gap-1"><MapPin size={14} /> Udaipur</span>
          </div>
          <div className="w-full bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="text-left"><p className="text-[10px] uppercase font-bold text-champagne/60 tracking-widest">Countdown</p><p className="font-bold text-lg">284 Days to go</p></div>
            <button onClick={() => navigate('guest_list')} className="bg-gold text-rose px-4 py-2 rounded-xl text-xs font-bold shadow-lg">Share Invite</button>
          </div>
        </div>
      </motion.div>

      {/* AI Planner Promo */}
      <section>
        <div onClick={() => setIsExpertChatOpen(true)} className="bg-gradient-to-br from-rose to-petal p-8 rounded-[2.5rem] text-ivory relative overflow-hidden shadow-xl shadow-rose/20 cursor-pointer group">
          <Sparkles className="absolute top-4 right-4 text-gold/20 group-hover:scale-110 transition-transform" size={100} />
          <div className="relative z-10">
            <span className="bg-gold text-rose text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">New Feature</span>
            <h3 className="text-3xl font-bold mb-2">AI Wedding Planner</h3>
            <p className="text-ivory/80 text-sm mb-6 max-w-[200px]">Get instant advice on venues, budgets, and traditions.</p>
            <div className="flex items-center gap-2 text-gold font-bold">Start Planning <ArrowRight size={20} /></div>
          </div>
        </div>
      </section>

      {/* Featured Vendors Carousel */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-rose">Featured Vendors</h2>
          <div className="flex gap-1">{featuredVendors.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all ${i === featuredIndex ? 'w-4 bg-gold' : 'w-1 bg-gold/20'}`} />)}</div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] shadow-xl aspect-[16/10]">
          <AnimatePresence mode="wait">
            <motion.div key={featuredIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="absolute inset-0">
              <img src={featuredVendors[featuredIndex].image} className="w-full h-full object-cover" alt={featuredVendors[featuredIndex].name} referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="bg-gold text-rose text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block uppercase tracking-widest">Premium Partner</span>
                    <h4 className="text-2xl font-bold text-white mb-1">{featuredVendors[featuredIndex].name}</h4>
                    <p className="text-white/70 text-sm flex items-center gap-2"><Star size={14} className="text-gold fill-current" /> {featuredVendors[featuredIndex].rating} • {featuredVendors[featuredIndex].category}</p>
                  </div>
                  <div className="text-right"><p className="text-gold font-bold text-lg">{featuredVendors[featuredIndex].price}</p><p className="text-white/50 text-[10px] uppercase tracking-widest">Starting Price</p></div>
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
          <button onClick={() => setMegaMenuOpen(true)} className="text-gold text-sm font-bold flex items-center gap-1">All Categories <ChevronRight size={16} /></button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
          {CATEGORIES.slice(0, 4).map(cat => (
            <div key={cat.name} onClick={() => setState(prev => ({ ...prev, screen: 'category_page', selectedCategory: cat.items[0] }))} className="min-w-[160px] premium-card p-6 flex flex-col items-center text-center cursor-pointer hover:border-gold/50 transition-all hover:-translate-y-1">
              <div className="w-20 h-20 rounded-full bg-rose/5 flex items-center justify-center mb-4 border border-rose/10"><Sparkles className="text-rose" size={32} /></div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{cat.name}</h4>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">{cat.items.length} Options</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real Weddings */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-rose">Real Weddings</h2>
          <button onClick={() => navigate('real_weddings')} className="text-gold text-sm font-bold">View All</button>
        </div>
        <div className="space-y-6">
          {REAL_WEDDINGS.map(wedding => (
            <div key={wedding.id} className="premium-card overflow-hidden group cursor-pointer" onClick={() => navigate('real_weddings')}>
              <div className="relative h-64"><img src={wedding.mainImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={wedding.couple} referrerPolicy="no-referrer" /><div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"><p className="text-xs font-bold text-rose flex items-center gap-1"><MapPin size={12} /> {wedding.location}</p></div></div>
              <div className="p-6"><h4 className="text-2xl font-bold text-slate-800 mb-2">{wedding.couple}</h4><p className="text-slate-500 text-sm line-clamp-2 mb-6 italic">"{wedding.story}"</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-rose">Wedding Tips & Ideas</h2>
          <button onClick={() => navigate('blogs')} className="text-gold text-sm font-bold">Read Blog</button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {BLOGS.map(blog => (
            <div key={blog.id} className="premium-card flex flex-col sm:flex-row overflow-hidden">
              <div className="sm:w-48 h-48 shrink-0 relative"><img src={blog.image} className="w-full h-full object-cover" alt={blog.title} referrerPolicy="no-referrer" /><div className="absolute top-2 left-2 bg-rose text-ivory text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">{blog.category}</div></div>
              <div className="p-6 flex flex-col justify-between"><h4 className="font-bold text-slate-800 text-xl mb-2 leading-tight">{blog.title}</h4><p className="text-sm text-slate-500 line-clamp-2">{blog.excerpt}</p><div className="flex items-center justify-between mt-4"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{blog.date}</span><button className="text-gold text-xs font-bold uppercase tracking-widest flex items-center gap-1">Read Full Story <ArrowRight size={14} /></button></div></div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeTab;
