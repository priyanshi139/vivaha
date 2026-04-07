import React, { useState } from 'react';
import { MessageSquare, Calendar, Crown, Star, CheckCircle2, Package as PackageIcon, Image as ImageIcon, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'profile'>('dashboard');
  const { navigate } = useApp();

  const stats = [
    { label: 'New Inquiries', value: '8', icon: <MessageSquare className="text-rose" /> },
    { label: 'Bookings', value: '24', icon: <Calendar className="text-gold" /> },
    { label: 'Earnings', value: '₹12.5L', icon: <Crown className="text-emerald-500" /> },
    { label: 'Rating', value: '4.9', icon: <Star className="text-gold fill-current" /> },
  ];

  return (
    <div className="absolute inset-0 bg-ivory flex flex-col overflow-hidden z-[200]">
      <div className="bg-rose p-6 flex items-center justify-between text-ivory">
        <div className="flex items-center gap-3">
          <PackageIcon className="text-gold" />
          <h2 className="text-xl font-bold">Vendor Portal</h2>
        </div>
        <button onClick={() => navigate('role_selection')} className="text-xs font-bold uppercase tracking-widest bg-white/10 px-4 py-2 rounded-lg">Logout</button>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-ivory flex items-center justify-center mb-2">{stat.icon}</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-6">
        <div className="flex gap-2">
          {['dashboard', 'bookings', 'profile'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 rounded-full text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-rose text-ivory' : 'bg-white text-slate-500 border border-slate-100'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Recent Inquiries</h3>
            {[{ name: 'Priya & Rahul', date: 'Dec 12, 2026', status: 'New' }, { name: 'Amit & Sneha', date: 'Jan 05, 2027', status: 'Pending' }].map((inq, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div><p className="text-sm font-bold text-slate-800">{inq.name}</p><p className="text-xs text-slate-500">{inq.date}</p></div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${inq.status === 'New' ? 'bg-rose/10 text-rose' : 'bg-amber-50 text-amber-600'}`}>{inq.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Confirmed Bookings</h3>
            {[{ name: 'Mehta Wedding', date: 'Dec 12, 2026', amount: '₹2.5L' }, { name: 'Kapoor Wedding', date: 'Jan 15, 2027', amount: '₹1.8L' }].map((b, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div><p className="text-sm font-bold text-slate-800">{b.name}</p><p className="text-xs text-slate-500">{b.date} • {b.amount}</p></div>
                <div className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={14} /><span className="text-[10px] font-bold uppercase">Confirmed</span></div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-rose/10 flex items-center justify-center text-rose mb-4 relative">
                <ImageIcon size={40} />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gold text-rose rounded-full flex items-center justify-center shadow-lg"><Plus size={16} /></button>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Royal Palace Weddings</h3>
              <p className="text-xs text-slate-500">Premium Venue • Udaipur</p>
            </div>
            <div className="space-y-4">
              <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Business Name</label><input type="text" defaultValue="Royal Palace Weddings" className="w-full p-4 bg-white rounded-xl border border-slate-100 outline-none focus:border-gold" /></div>
              <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Description</label><textarea defaultValue="A premier wedding venue in the heart of Udaipur..." className="w-full p-4 bg-white rounded-xl border border-slate-100 outline-none focus:border-gold h-32" /></div>
              <button className="w-full bg-rose text-ivory py-4 rounded-2xl font-bold shadow-lg shadow-rose/20">Save Profile</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
