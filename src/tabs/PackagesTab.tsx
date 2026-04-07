import React, { useState } from 'react';
import { Search, Crown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { POWER_PAIRS, VENDORS } from '../constants';

const PackagesTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'pairs' | 'experts' | 'top'>('pairs');
  const { setSelectedVendor } = useApp();

  return (
    <div className="p-6 space-y-8 pb-24">
      <h2 className="text-3xl font-bold text-rose">Design Your Package</h2>

      <div className="flex bg-white/50 p-1 rounded-2xl border border-slate-100">
        {[{ id: 'pairs', label: 'Power Pairs' }, { id: 'experts', label: 'Solo Experts' }, { id: 'top', label: 'Top Vendors' }].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id as any)} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${subTab === t.id ? 'bg-rose text-ivory shadow-lg' : 'text-slate-400'}`}>{t.label}</button>
        ))}
      </div>

      <div className="space-y-6">
        {subTab === 'pairs' && POWER_PAIRS.map(pkg => (
          <div key={pkg.id} className="premium-card overflow-hidden">
            <img src={pkg.image} className="w-full h-48 object-cover" alt={pkg.name} referrerPolicy="no-referrer" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div><h3 className="text-xl font-bold text-rose">{pkg.name}</h3><p className="text-xs text-slate-500">{pkg.members.join(' + ')}</p></div>
                <div className="text-right"><p className="text-lg font-bold text-emerald-600">{pkg.price}</p><p className="text-[10px] text-slate-400 uppercase font-bold">Starting At</p></div>
              </div>
              <button className="w-full bg-rose/5 text-rose border border-rose/10 py-3 rounded-xl font-bold hover:bg-rose hover:text-ivory transition-all">View Package Details</button>
            </div>
          </div>
        ))}

        {subTab === 'experts' && (
          <div className="space-y-6">
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Search vendor type..." className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold" /></div>
            {VENDORS.map(vendor => (
              <div key={vendor.id} className="premium-card flex p-4 gap-4 cursor-pointer hover:border-gold/50 transition-colors" onClick={() => setSelectedVendor(vendor)}>
                <img src={vendor.image} className="w-24 h-24 rounded-2xl object-cover" alt={vendor.name} referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{vendor.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">{vendor.category} • {vendor.location}</p>
                  <div className="flex items-center justify-between"><span className="text-emerald-600 font-bold">{vendor.price}</span></div>
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

      <div className="absolute bottom-24 left-6 right-6 bg-rose text-ivory p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-gold/20">
        <div><p className="text-[10px] uppercase font-bold text-champagne/60 tracking-widest">My Package</p><p className="font-bold">₹0 Selected</p></div>
        <button className="bg-gold text-rose px-6 py-2 rounded-xl font-bold text-sm">Save Package</button>
      </div>
    </div>
  );
};

export default PackagesTab;
