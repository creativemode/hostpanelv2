import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import { Download, RotateCcw, Trash2, Clock, Database, Shield, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

interface Backup {
  id: number;
  filename: string;
  size: string;
  type: string;
  db_name: string | null;
  created_at: string;
  owner?: string;
}

export function Backups() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  useEffect(() => {
    fetchBackups();
  }, []);

  async function fetchBackups() {
    try {
      const data = await apiRequest('/backups');
      setBackups(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateBackup() {
    setLoading(true);
    try {
      await apiRequest('/backups', {
        method: 'POST',
        body: JSON.stringify({ type: 'full' }),
      });
      fetchBackups();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(id: number) {
    if (!confirm('Warning: Restoring will overwrite existing data. Continue?')) return;
    setRestoringId(id);
    try {
      const res = await apiRequest(`/backups/restore/${id}`, { method: 'POST' });
      alert(res.message);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRestoringId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this backup permanentely?')) return;
    try {
       await apiRequest(`/backups/${id}`, { method: 'DELETE' });
       fetchBackups();
    } catch (err) {
       console.error(err);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#f1f5f9]">Snapshot Management</h2>
          <p className="text-[#94a3b8] text-xs uppercase tracking-widest mt-1 opacity-60">System consistency & recovery points</p>
        </div>
        <button 
          onClick={handleCreateBackup}
          disabled={loading}
          className="btn-primary-elegant flex items-center gap-2"
        >
          {loading ? (
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Initiate Full Backup
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main List */}
        <div className="lg:col-span-3">
          <div className="table-section">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#94a3b8] uppercase tracking-wider font-semibold bg-[#151921]">
                  <tr>
                    <th className="px-6 py-4 border-b border-[#2d3646]">Recovery Snapshot</th>
                    <th className="px-6 py-4 border-b border-[#2d3646]">Target</th>
                    <th className="px-6 py-4 border-b border-[#2d3646]">Size</th>
                    <th className="px-6 py-4 border-b border-[#2d3646]">Generated At</th>
                    <th className="px-6 py-4 border-b border-[#2d3646] text-right">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d3646]">
                  <AnimatePresence initial={false}>
                    {backups.map((bk) => (
                      <motion.tr
                        key={bk.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#0c0e12] border border-[#2d3646] flex items-center justify-center text-blue-500">
                               <Clock className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-[#f1f5f9] font-mono text-[11px]">{bk.filename}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-[#94a3b8] font-semibold uppercase tracking-widest text-[10px]">
                              {bk.db_name || 'FULL-SYSTEM'}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-[#94a3b8]">{bk.size}</span>
                        </td>
                        <td className="px-6 py-4 text-[#94a3b8] opacity-60">
                           {new Date(bk.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => handleRestore(bk.id)}
                               disabled={restoringId === bk.id}
                               className="p-2 hover:bg-green-500/10 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                               title="Restore"
                             >
                               {restoringId === bk.id ? (
                                  <div className="w-4 h-4 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                               ) : (
                                  <RotateCcw className="w-4 h-4" />
                               )}
                             </button>
                             <button 
                              onClick={() => handleDelete(bk.id)}
                              className="p-2 hover:bg-red-500/10 text-[#94a3b8] hover:text-red-500 rounded-lg transition-colors"
                              title="Delete"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              
              {backups.length === 0 && (
                <div className="px-8 py-20 text-center">
                   <Shield className="w-12 h-12 text-[#2d3646] mx-auto mb-4" />
                   <p className="text-[#94a3b8] font-serif italic text-sm">Deployment sequence secured. No snapshots available.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="stat-card">
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                 <Shield className="w-4 h-4" />
                 <h4 className="text-[10px] uppercase font-bold tracking-widest">DR Protocol</h4>
              </div>
              <p className="text-[11px] text-[#94a3b8] leading-relaxed mb-4">
                 Snapshots capture the current state of managed databases and system configuration. 
              </p>
              <div className="p-3 rounded-lg bg-[#0c0e12] border border-[#2d3646] space-y-2">
                 <div className="flex justify-between text-[10px]">
                    <span className="text-[#94a3b8]">Stored Snapshots</span>
                    <span className="font-bold text-[#f1f5f9]">{backups.length}</span>
                 </div>
                 <div className="flex justify-between text-[10px]">
                    <span className="text-[#94a3b8]">Last Sync</span>
                    <span className="font-bold text-[#f1f5f9]">{backups[0] ? 'Recent' : 'N/A'}</span>
                 </div>
              </div>
           </div>

           <div className="stat-card border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-center gap-2 mb-2 text-yellow-500">
                 <AlertCircle className="w-4 h-4" />
                 <h4 className="text-[10px] uppercase font-bold tracking-widest">Critical Note</h4>
              </div>
              <p className="text-[10px] text-yellow-500/80 leading-relaxed">
                 Restoring a backup will terminate all active connections and revert the state. Ensure all users are notified.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
