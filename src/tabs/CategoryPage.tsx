import React, { useState } from 'react';
import { ChevronLeft, MapPin, Star, Search, ArrowUpDown, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { VENDORS } from '../constants';

const CategoryPage: React.FC = () => {
  const { state, navigate, setSelectedVendor } = useApp();
  const [sortBy, setSortBy] = useState<'rating' | 'priceLow' | 'priceHigh'>('rating');
  const [filterCity, setFilterCity] = useState('All');
  const [filterMinBudget, setFilterMinBudget] = useState(0);
  const [filterMaxBudget, setFilterMaxBudget] = useState(2000000);
  const [filterDate, setFilterDate] = useState('');
  const [filterService, setFilterService] = useState('All');

  const availableServices = Array.from(new Set(VENDORS.filter(v => state.selectedCategory ? v.category.toLowerCase().includes(state.selectedCategory.toLowerCase()) : true).flatMap(v => v.specificServices || [])));

  const filteredVendors = VENDORS.filter(v => {
    const matchesCategory = state.selectedCategory ? v.category.toLowerCase().includes(state.selectedCategory.toLowerCase()) || v.name.toLowerCase().includes(state.selectedCategory.toLowerCase()) : true;
    const matchesCity = filterCity === 'All' || v.location === filterCity;
    const matchesBudget = v.priceValue >= filterMinBudget && v.priceValue <= filterMaxBudget;
    const matchesDate = !filterDate || (v.availability && v.availability.includes(filterDate));
    const matchesService = filterService === 'All' || (v.specificServices && v.specificServices.includes(filterService));
    return matchesCategory && matchesCity && matchesBudget && matchesDate && matchesService;
  }).sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : sortBy === 'priceLow' ? a.priceValue - b.priceValue : b.priceValue - a.priceValue);

  return (
    <div className="absolute inset-0 bg-ivory flex flex-col z-[80]">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => navigate('dashboard')} className="text-rose flex items-center gap-1 font-bold"><ChevronLeft size={20} /> Back</button>
        <h2 className="text-xl font-bold text-rose">{state.selectedCategory || 'Vendors'}</h2>
        <div className="w-10" />
      </div>
      <div className="p-6 space-y-6 flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="space-y-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50">
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Location</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {['All', 'Mumbai', 'Delhi', 'Kolkata', 'Udaipur'].map(city => (
                <button key={city} onClick={() => setFilterCity(city)} className={`px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap transition-all ${filterCity === city ? 'bg-rose text-ivory border-rose' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>{city}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Availability</p>
            <div className="relative"><Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-rose" size={18} /><input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none" /></div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Services</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              <button onClick={() => setFilterService('All')} className={`px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap ${filterService === 'All' ? 'bg-gold text-rose border-gold' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>All Services</button>
              {availableServices.map(s => <button key={s} onClick={() => setFilterService(s)} className={`px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap ${filterService === s ? 'bg-gold text-rose border-gold' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>{s}</button>)}
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <p className="text-xs font-medium text-slate-400">Showing {filteredVendors.length} results</p>
            <button onClick={() => setSortBy(sortBy === 'rating' ? 'priceLow' : sortBy === 'priceLow' ? 'priceHigh' : 'rating')} className="bg-slate-100 px-4 py-2 rounded-xl text-slate-600 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <ArrowUpDown size={14} /> {sortBy === 'rating' ? 'Top Rated' : sortBy === 'priceLow' ? 'Price: Low' : 'Price: High'}
            </button>
          </div>
        </div>
        <div className="space-y-6">
          {filteredVendors.length > 0 ? filteredVendors.map(vendor => (
            <motion.div layout key={vendor.id} className="premium-card overflow-hidden group" onClick={() => setSelectedVendor(vendor)}>
              <div className="relative h-48"><img src={vendor.image} className="w-full h-full object-cover" alt={vendor.name} referrerPolicy="no-referrer" />{vendor.isPremium && <div className="absolute top-4 right-4 bg-gold text-rose text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">PREMIUM</div>}</div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div><h4 className="font-bold text-slate-800 text-lg">{vendor.name}</h4><p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12} /> {vendor.location}</p></div>
                  <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold"><Star size={14} className="fill-current" /> {vendor.rating}</div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50"><p className="text-rose font-bold">{vendor.price}</p><button className="text-gold text-xs font-bold uppercase tracking-widest">View Portfolio</button></div>
              </div>
            </motion.div>
          )) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300"><Search size={40} /></div>
              <p className="text-slate-500 font-medium">No vendors found matching your criteria.</p>
              <button onClick={() => { setFilterCity('All'); setFilterMinBudget(0); setFilterMaxBudget(2000000); setFilterDate(''); setFilterService('All'); }} className="text-rose font-bold">Reset All Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
