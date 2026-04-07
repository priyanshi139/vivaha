import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { navigate } = useApp();

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter both email and password'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (data.success) navigate('admin_dashboard' as any);
      else setError(data.error || 'Invalid credentials');
    } catch { setError('Connection error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="absolute inset-0 bg-ivory p-8 flex flex-col justify-center">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <ShieldCheck className="text-gold" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Admin Portal</h2>
        <p className="text-slate-500">Authorized Access Only</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto w-full">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@wedding.com" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold transition-all" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:border-gold transition-all" />
        </div>

        {error && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm text-center font-bold bg-red-50 p-3 rounded-xl border border-red-100">
            {error}
          </motion.p>
        )}

        <button onClick={handleLogin} disabled={loading} className={`w-full bg-slate-800 text-ivory py-4 rounded-2xl font-bold shadow-xl mt-4 active:scale-95 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
          {loading ? (<><div className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />Verifying...</>) : 'Login to Dashboard'}
        </button>

        <div className="mt-8 p-4 bg-gold/10 rounded-2xl border border-gold/20">
          <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2 text-center">Demo Credentials</p>
          <div className="flex justify-between text-xs"><span className="text-slate-500">Email:</span><span className="font-mono text-slate-800">admin@wedding.com</span></div>
          <div className="flex justify-between text-xs mt-1"><span className="text-slate-500">Pass:</span><span className="font-mono text-slate-800">admin123</span></div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
