import React from 'react';
import { Menu, Bell, ChevronDown, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TopBar: React.FC = () => {
  const { setSideMenuOpen, setMegaMenuOpen, megaMenuOpen, setNotificationsOpen, navigate } = useApp();

  return (
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
          className={`px-4 py-2 rounded-full border text-xs font-bold transition-all flex items-center gap-2 ${
            megaMenuOpen ? 'bg-rose text-ivory border-rose' : 'bg-white text-rose border-slate-100'
          }`}
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
};

export default TopBar;
