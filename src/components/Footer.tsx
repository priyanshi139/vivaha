import React from 'react';
import { Sparkles, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="bg-slate-800 text-slate-300 pt-12 pb-8 px-6 mt-12">
    <div className="grid grid-cols-2 gap-8 mb-12">
      <div className="col-span-2">
        <div className="flex flex-col items-start mb-8">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-gold mandala-glow" />
            <h2 className="brand-logo-large gold-shimmer">VIVAHA</h2>
          </div>
          <div className="flourish-underline-left w-32" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-3">
            <h4 className="text-ivory font-bold uppercase tracking-widest mb-2">About Vivaha</h4>
            {['Who are we?', 'Careers', 'Authenticity', 'Testimonials', 'Sustainability'].map(link => (
              <p key={link} className="hover:text-gold cursor-pointer">{link}</p>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="text-ivory font-bold uppercase tracking-widest mb-2">Planning Tools</h4>
            {['Wedding Checklist', 'Budget Planner', 'Inspiration Board', 'Guest Manager', 'AI Planner'].map(link => (
              <p key={link} className="hover:text-gold cursor-pointer">{link}</p>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-slate-700 pt-8 flex flex-col items-center gap-4">
      <div className="flex gap-4">
        {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
          <div key={i} className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 hover:text-gold hover:bg-slate-600 transition-colors cursor-pointer">
            <Icon size={16} />
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-500 text-center">
        © 2026 Vivaha Wedding Platform. All rights reserved.<br />
        Crafted with love in India 🇮🇳
      </p>
    </div>
  </footer>
);

export default Footer;
