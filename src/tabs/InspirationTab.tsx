import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INSPIRATION_BOARDS } from '../constants';

const InspirationTab: React.FC = () => {
  const { setSelectedBoard } = useApp();
  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-rose">Inspiration Boards</h2>
        <button className="bg-gold text-rose p-3 rounded-2xl shadow-lg"><Plus size={20} /></button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {INSPIRATION_BOARDS.map(board => (
          <div key={board.id} className="premium-card relative aspect-square overflow-hidden group cursor-pointer" onClick={() => setSelectedBoard(board)}>
            <img src={board.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={board.name} referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
              <h4 className="text-ivory font-bold text-lg">{board.name}</h4>
              <p className="text-gold/80 text-[10px] font-bold uppercase tracking-widest">{board.count} Items</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspirationTab;
