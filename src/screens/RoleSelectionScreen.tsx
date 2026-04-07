import React from 'react';
import { Heart, ChevronRight, Lock, Package as PackageIcon, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ROLES = [
  { id: 'bride', label: 'Bride / Groom', icon: <Heart className="text-rose" />, desc: 'Plan your dream wedding' },
  { id: 'vendor', label: 'Vendor', icon: <PackageIcon className="text-gold" />, desc: 'Manage your services' },
  { id: 'planner', label: 'Wedding Planner', icon: <Sparkles className="text-gold" />, desc: 'Organize grand events' },
  { id: 'admin', label: 'Admin', icon: <ShieldCheck className="text-slate-800" />, desc: 'System management' },
];

const RoleSelectionScreen: React.FC = () => {
  const { setState, navigate } = useApp();

  const handleSelect = (id: string) => {
    if (id === 'bride') { setState(prev => ({ ...prev, userType: 'bride' })); navigate('auth'); }
    else if (id === 'admin') { setState(prev => ({ ...prev, userType: 'admin' })); navigate('admin_login'); }
    else if (id === 'vendor') { setState(prev => ({ ...prev, userType: 'vendor' })); navigate('vendor_dashboard'); }
    else if (id === 'planner') { setState(prev => ({ ...prev, userType: 'planner' })); navigate('planner_dashboard'); }
  };

  return (
    <div className="absolute inset-0 bg-ivory p-8 flex flex-col justify-center">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-rose rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Lock className="text-gold" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-rose">Login As</h2>
        <p className="text-slate-500">Select your role to continue</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {ROLES.map(role => (
          <button
            key={role.id}
            onClick={() => handleSelect(role.id)}
            className="premium-card p-5 flex items-center gap-4 hover:border-gold transition-all text-left group active:scale-95"
          >
            <div className="w-14 h-14 rounded-2xl bg-ivory flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              {role.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-slate-800">{role.label}</h4>
              <p className="text-xs text-slate-500">{role.desc}</p>
            </div>
            <ChevronRight className="text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      <button onClick={() => navigate('splash')} className="mt-8 text-rose font-bold text-sm text-center">
        Back to Home
      </button>
    </div>
  );
};

export default RoleSelectionScreen;
