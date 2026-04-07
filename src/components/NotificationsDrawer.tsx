import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NOTIFICATIONS = [
  { title: 'New Vendor Offer', desc: 'The Wedding Salad offered 10% discount!', time: '2h ago' },
  { title: 'Checklist Update', desc: "Don't forget to finalize the guest list.", time: '5h ago' },
  { title: 'AI Suggestion', desc: 'New decor themes available for Udaipur.', time: '1d ago' },
];

const NotificationsDrawer: React.FC = () => {
  const { notificationsOpen, setNotificationsOpen } = useApp();

  return (
    <AnimatePresence>
      {notificationsOpen && (
        <>
          <motion.div
            key="notifications-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            key="notifications-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute top-0 right-0 bottom-0 w-4/5 bg-ivory z-[101] shadow-2xl p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-rose">Notifications</h2>
              <button onClick={() => setNotificationsOpen(false)} className="text-rose">
                <Plus className="rotate-45" size={28} />
              </button>
            </div>
            <div className="space-y-4">
              {NOTIFICATIONS.map((n, i) => (
                <div key={`notification-${i}`} className="premium-card p-4 border-l-4 border-rose">
                  <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                  <p className="text-xs text-slate-500 mb-1">{n.desc}</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{n.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsDrawer;
