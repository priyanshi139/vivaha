import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, LayoutDashboard, Calendar, User, Settings, Users, LogOut, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SideMenuDrawer: React.FC = () => {
  const { sideMenuOpen, setSideMenuOpen, navigate, setState } = useApp();

  const menuItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', screen: 'dashboard' },
    { icon: <Calendar />, label: 'Wedding Timeline' },
    { icon: <User />, label: 'Guest Management', screen: 'guest_list' },
    { icon: <Sparkles />, label: 'AI Planning' },
    { icon: <Settings />, label: 'App Settings', screen: 'settings' },
    { icon: <Users />, label: 'Switch Role', screen: 'role_selection' },
  ];

  return (
    <AnimatePresence>
      {sideMenuOpen && (
        <>
          <motion.div
            key="sidemenu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSideMenuOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            key="sidemenu-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="absolute top-0 left-0 bottom-0 w-4/5 bg-ivory z-[101] shadow-2xl p-8 flex flex-col"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-gold mandala-glow" />
                  <h2 className="brand-logo-large gold-shimmer">VIVAHA</h2>
                </div>
                <div className="flourish-underline-left w-24" />
              </div>
              <button onClick={() => setSideMenuOpen(false)} className="text-rose">
                <Plus className="rotate-45" size={28} />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              {menuItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.screen) navigate(item.screen as any);
                    setSideMenuOpen(false);
                  }}
                  className="flex items-center gap-4 text-slate-700 font-medium text-lg w-full text-left"
                >
                  <div className="text-rose/60">{item.icon}</div>
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setState(prev => ({ ...prev, screen: 'role_selection', userType: null }));
                setSideMenuOpen(false);
              }}
              className="flex items-center gap-4 text-red-500 font-bold text-lg mt-auto"
            >
              <LogOut /> Logout
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenuDrawer;
