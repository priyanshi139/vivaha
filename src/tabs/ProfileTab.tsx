import React from 'react';
import { Heart, Calendar, Image as ImageIcon, User, Crown, MessageSquare, ShieldCheck, LogOut, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Footer from '../components/Footer';

const ProfileTab: React.FC = () => {
  const { state, setState, navigate, setActiveTab, setShowSplash } = useApp();

  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="flex flex-col items-center text-center pt-8">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-gold p-1">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" className="w-full h-full rounded-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
          </div>
          {state.isPremium && <div className="absolute -bottom-2 -right-2 bg-gold text-rose p-2 rounded-full shadow-lg border-2 border-ivory"><Crown size={20} /></div>}
        </div>
        <h2 className="text-3xl font-bold text-rose">Priya Sharma</h2>
        <p className="text-slate-500">Bride • Wedding in 286 Days</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Saved', count: 12, icon: <Heart size={18} />, screen: 'saved_vendors' },
          { label: 'Bookings', count: 0, icon: <Calendar size={18} />, screen: 'bookings' },
          { label: 'Boards', count: 6, icon: <ImageIcon size={18} />, tab: 'inspiration' },
        ].map(stat => (
          <button key={stat.label} onClick={() => { if (stat.tab) setActiveTab(stat.tab as any); else navigate(stat.screen as any); }} className="premium-card p-4 text-center hover:bg-slate-50 transition-colors">
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
            { icon: <Crown size={20} />, label: 'Subscription Plan', extra: state.isPremium ? 'Premium' : 'Free', tab: 'packages' },
          ].map((item, i) => (
            <button key={i} onClick={() => { if (item.tab) setActiveTab(item.tab as any); else navigate(item.screen as any); }} className="w-full p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
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
            <button key={i} onClick={() => { if (item.label === 'Logout') { setShowSplash(true); setState(prev => ({ ...prev, screen: 'splash' })); } else if (item.screen) navigate(item.screen as any); }} className={`w-full p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors ${item.color || 'text-slate-700'}`}>
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
};

export default ProfileTab;
