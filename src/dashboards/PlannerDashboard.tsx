import React, { useState } from 'react';
import { Sparkles, FileText, LayoutDashboard } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PlannerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'clients' | 'ai_tools' | 'tasks'>('clients');
  const { navigate, setIsExpertChatOpen } = useApp();

  return (
    <div className="absolute inset-0 bg-ivory flex flex-col overflow-hidden z-[200]">
      <div className="bg-slate-800 p-6 flex items-center justify-between text-ivory">
        <div className="flex items-center gap-3">
          <Sparkles className="text-gold" />
          <h2 className="text-xl font-bold">Planner Studio</h2>
        </div>
        <button onClick={() => navigate('role_selection')} className="text-xs font-bold uppercase tracking-widest bg-white/10 px-4 py-2 rounded-lg">Logout</button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['clients', 'ai_tools', 'tasks'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 rounded-full text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-slate-800 text-ivory' : 'bg-white text-slate-500 border border-slate-100'}`}>
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {activeTab === 'clients' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Active Clients</h3>
            {[{ name: 'The Mehta Wedding', progress: 65, date: 'Dec 2026' }, { name: 'Kapoor & Singh', progress: 30, date: 'Feb 2027' }].map((client, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div><h4 className="font-bold text-slate-800">{client.name}</h4><p className="text-xs text-slate-500">{client.date} • Udaipur</p></div>
                  <div className="w-12 h-12 rounded-full border-4 border-gold/20 border-t-gold flex items-center justify-center text-[10px] font-bold text-gold">{client.progress}%</div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gold h-full" style={{ width: `${client.progress}%` }} />
                </div>
                <button className="w-full mt-4 py-3 rounded-xl border border-slate-100 text-xs font-bold text-slate-600">Open Project</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ai_tools' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] text-ivory relative overflow-hidden">
              <Sparkles className="absolute top-4 right-4 text-gold/20" size={80} />
              <h3 className="text-2xl font-bold mb-2">AI Planner Pro</h3>
              <p className="text-ivory/60 text-sm mb-6 leading-relaxed">Generate complex itineraries, vendor comparisons, and budget reports in seconds.</p>
              <button onClick={() => setIsExpertChatOpen(true)} className="bg-gold text-slate-900 px-6 py-3 rounded-xl font-bold text-xs">
                Launch AI Assistant
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mb-3"><FileText size={20} /></div><h4 className="text-sm font-bold text-slate-800">Budget Gen</h4><p className="text-[10px] text-slate-500">Auto-calculate costs</p></div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100"><div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 mb-3"><LayoutDashboard size={20} /></div><h4 className="text-sm font-bold text-slate-800">Moodboard</h4><p className="text-[10px] text-slate-500">AI image generation</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlannerDashboard;
