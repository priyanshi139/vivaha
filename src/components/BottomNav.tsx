import React from 'react';
import { LayoutDashboard, CheckCircle2, Image as ImageIcon, Package as PackageIcon, User, PieChart } from 'lucide-react';
import { useApp } from '../context/AppContext';

const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, state, navigate } = useApp();

  const tabs = [
    { id: 'home', icon: <LayoutDashboard size={24} />, label: 'Home' },
    { id: 'checklist', icon: <CheckCircle2 size={24} />, label: 'Checklist' },
    { id: 'budget', icon: <PieChart size={24} />, label: 'Budget' },
    { id: 'inspiration', icon: <ImageIcon size={24} />, label: 'Inspiration' },
    { id: 'packages', icon: <PackageIcon size={24} />, label: 'Packages' },
    { id: 'profile', icon: <User size={24} />, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bottom-nav-blur px-4 py-3 flex items-center justify-between z-40 border-t border-slate-100">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id as any);
            if (state.screen !== 'dashboard') navigate('dashboard');
          }}
          className={`flex flex-col items-center gap-1 transition-all group ${
            activeTab === tab.id ? 'text-rose scale-110' : 'text-slate-400 hover:text-rose/60'
          }`}
        >
          <div className={`transition-transform group-active:scale-90 ${activeTab === tab.id ? 'text-gold' : ''}`}>
            {tab.icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
