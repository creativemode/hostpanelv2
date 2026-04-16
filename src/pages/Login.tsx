import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(credentials);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0e12] p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-6 shadow-xl shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
           </div>
           <h1 className="text-3xl font-bold text-[#f1f5f9] tracking-tight mb-2">Host<span className="text-blue-500">Panel</span> Pro</h1>
           <p className="text-[#94a3b8] text-xs uppercase tracking-widest font-medium opacity-60">Authentication Gateway</p>
        </div>

        <div className="p-8 rounded-2xl bg-[#1c222c] border border-[#2d3646] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">User Identifier</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] opacity-50" />
                <input
                  required
                  type="email"
                  placeholder="admin@hostpanel.io"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="input-elegant w-full pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">Security Cipher</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] opacity-50" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="input-elegant w-full pl-12 font-mono"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] text-red-500 font-bold uppercase tracking-wider text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full btn-primary-elegant py-3 text-sm flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-[#2d3646] text-center">
            <p className="text-[9px] text-[#94a3b8] font-medium uppercase tracking-[0.2em] opacity-40">
              SECURE ENCRYPTION ACTIVE • V1.4.2
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

