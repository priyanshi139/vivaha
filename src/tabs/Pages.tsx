import React from 'react';
import { ChevronLeft, MapPin, Calendar, Heart, Star, Bell, Lock, User, LogOut, ChevronRight, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REAL_WEDDINGS, BLOGS, VENDORS } from '../constants';

// ─── Real Weddings Page ───────────────────────────────────────────────────────
export const RealWeddingsPage: React.FC = () => {
  const { navigate } = useApp();
  return (
    <div className="absolute inset-0 bg-ivory flex flex-col z-[80]">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => navigate('dashboard')} className="text-rose flex items-center gap-1 font-bold"><ChevronLeft size={20} /> Back</button>
        <h2 className="text-xl font-bold text-rose">Real Weddings</h2>
        <div className="w-10" />
      </div>
      <div className="p-6 space-y-8 overflow-y-auto no-scrollbar pb-24">
        {REAL_WEDDINGS.map(wedding => (
          <div key={wedding.id} className="premium-card overflow-hidden">
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
        ))}
      </div>
    </div>
  );
};

// ─── Blogs Page ───────────────────────────────────────────────────────────────
export const BlogsPage: React.FC = () => {
  const { navigate } = useApp();
  return (
    <div className="absolute inset-0 bg-ivory flex flex-col z-[80]">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => navigate('dashboard')} className="text-rose flex items-center gap-1 font-bold"><ChevronLeft size={20} /> Back</button>
        <h2 className="text-xl font-bold text-rose">Wedding Blog</h2>
        <div className="w-10" />
      </div>
      <div className="p-6 space-y-8 overflow-y-auto no-scrollbar pb-24">
        {BLOGS.map(blog => (
          <div key={blog.id} className="premium-card overflow-hidden">
            <img src={blog.image} className="w-full h-64 object-cover" alt={blog.title} referrerPolicy="no-referrer" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4"><span className="bg-rose/10 text-rose text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">{blog.category}</span><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{blog.date}</span></div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 leading-tight">{blog.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{blog.excerpt}</p>
              <button className="w-full bg-rose text-ivory py-4 rounded-2xl font-bold">Read Full Article</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Bookings Page ────────────────────────────────────────────────────────────
export const BookingsPage: React.FC = () => {
  const { navigate, setActiveTab } = useApp();
  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('dashboard')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose"><ChevronLeft size={24} /></button>
        <h2 className="text-2xl font-bold text-rose">My Bookings</h2>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-rose/5 rounded-full flex items-center justify-center text-rose/30"><Calendar size={40} /></div>
        <h3 className="text-lg font-bold text-slate-800">No bookings yet</h3>
        <p className="text-slate-500 text-sm max-w-[240px]">Start exploring vendors and book your favorites for your big day.</p>
        <button onClick={() => { navigate('dashboard'); setActiveTab('home'); }} className="bg-gold text-rose px-6 py-3 rounded-xl font-bold text-sm shadow-lg">Explore Vendors</button>
      </div>
    </div>
  );
};

// ─── Saved Vendors Page ───────────────────────────────────────────────────────
export const SavedVendorsPage: React.FC = () => {
  const { navigate } = useApp();
  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('dashboard')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose"><ChevronLeft size={24} /></button>
        <h2 className="text-2xl font-bold text-rose">Saved Vendors</h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {VENDORS.slice(0, 2).map(vendor => (
          <div key={vendor.id} className="premium-card overflow-hidden flex">
            <img src={vendor.image} className="w-24 h-24 object-cover" alt={vendor.name} referrerPolicy="no-referrer" />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div><h4 className="font-bold text-slate-800 text-sm">{vendor.name}</h4><p className="text-[10px] text-slate-400 uppercase font-bold">{vendor.category}</p></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-gold"><Star size={12} fill="currentColor" /><span className="text-xs font-bold">{vendor.rating}</span></div>
                <button className="text-rose/40 hover:text-rose transition-colors"><Heart size={18} fill="currentColor" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Settings Page ────────────────────────────────────────────────────────────
export const SettingsPage: React.FC = () => {
  const { navigate } = useApp();
  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('dashboard')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose"><ChevronLeft size={24} /></button>
        <h2 className="text-2xl font-bold text-rose">Settings</h2>
      </div>
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Account</h3>
        <div className="premium-card divide-y divide-slate-50">
          {[{ label: 'Edit Profile', icon: <User size={18} /> }, { label: 'Change Password', icon: <Lock size={18} /> }, { label: 'Notifications', icon: <Bell size={18} />, toggle: true }].map(item => (
            <div key={item.label} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4"><div className="text-rose/60">{item.icon}</div><span className="font-medium text-slate-700">{item.label}</span></div>
              {item.toggle ? <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" /></div> : <ChevronRight size={18} className="text-slate-300" />}
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Danger Zone</h3>
        <div className="premium-card">
          <button className="w-full p-5 flex items-center gap-4 text-red-500 font-medium hover:bg-red-50 transition-colors"><LogOut size={18} /><span>Delete Account</span></button>
        </div>
      </section>
    </div>
  );
};

// ─── Help & Support Page ──────────────────────────────────────────────────────
export const HelpSupportPage: React.FC = () => {
  const { navigate, setIsExpertChatOpen } = useApp();
  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('dashboard')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose"><ChevronLeft size={24} /></button>
        <h2 className="text-2xl font-bold text-rose">Help & Support</h2>
      </div>
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Common Questions</h3>
        <div className="space-y-3">
          {['How do I book a vendor?', 'What is included in Premium?', 'How to share my wedding invite?', 'Can I change my wedding date later?'].map(q => (
            <div key={q} className="premium-card p-4 flex items-center justify-between group cursor-pointer"><span className="text-sm font-medium text-slate-700">{q}</span><ChevronRight size={16} className="text-slate-300 group-hover:text-gold transition-colors" /></div>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Contact Us</h3>
        <div className="premium-card p-6 space-y-4">
          <div onClick={() => setIsExpertChatOpen(true)} className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-xl transition-colors">
            <div className="w-10 h-10 bg-rose/5 rounded-full flex items-center justify-center text-rose"><MessageCircle size={20} /></div>
            <div><p className="text-sm font-bold text-slate-800">Chat with us</p><p className="text-xs text-slate-500">Available 10 AM - 8 PM</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-rose/5 rounded-full flex items-center justify-center text-rose"><Bell size={20} /></div>
            <div><p className="text-sm font-bold text-slate-800">Email Support</p><p className="text-xs text-slate-500">support@vivaha.com</p></div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── About Vivah Page ─────────────────────────────────────────────────────────
export const AboutVivahPage: React.FC = () => {
  const { navigate } = useApp();
  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('dashboard')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose"><ChevronLeft size={24} /></button>
        <h2 className="text-2xl font-bold text-rose">About Vivah</h2>
      </div>
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-24 h-24 bg-gold rounded-3xl flex items-center justify-center shadow-xl"><Heart className="text-rose w-12 h-12 fill-current" /></div>
        <div className="space-y-4 text-slate-600 leading-relaxed">
          <p>Vivah is India's premier AI-powered wedding planning platform, designed to make your journey to the altar as beautiful as the wedding itself.</p>
          <p>Our vision is to simplify the complex world of wedding planning by connecting couples with the finest vendors and providing intelligent tools to manage every detail.</p>
        </div>
        <div className="pt-8 w-full"><div className="premium-card p-6 flex items-center justify-between"><span className="text-sm font-bold text-slate-800">Terms of Service</span><ChevronRight size={18} className="text-slate-300" /></div></div>
      </div>
    </div>
  );
};
