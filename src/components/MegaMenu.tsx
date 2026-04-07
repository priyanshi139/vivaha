import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../constants';

const MegaMenu: React.FC = () => {
  const { megaMenuOpen, setMegaMenuOpen, setState } = useApp();

  return (
    <AnimatePresence>
      {megaMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-[72px] left-0 right-0 bg-white z-[100] shadow-2xl rounded-b-[2rem] overflow-hidden border-t border-slate-100"
        >
          <div className="p-8 grid grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto no-scrollbar">
            {CATEGORIES.map(cat => (
              <div key={cat.name} className="space-y-4">
                <h3 className="text-rose font-bold text-lg flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  {cat.name}
                </h3>
                <div className="flex flex-col gap-2">
                  {cat.items.map(item => (
                    <button
                      key={item}
                      onClick={() => {
                        setState(prev => ({ ...prev, screen: 'category_page', selectedCategory: item }));
                        setMegaMenuOpen(false);
                      }}
                      className="text-slate-600 hover:text-gold text-sm text-left transition-colors flex items-center justify-between group"
                    >
                      {item}
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-rose/5 p-6 flex justify-between items-center border-t border-rose/10">
            <p className="text-xs text-rose font-medium italic">Find the best wedding vendors across India</p>
            <button onClick={() => setMegaMenuOpen(false)} className="text-rose font-bold text-sm flex items-center gap-1">
              Close Menu <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
