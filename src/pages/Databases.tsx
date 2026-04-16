import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import { Database, Plus, Trash2, Search, Key, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

interface DB {
  id: number;
  name: string;
  db_user: string;
  db_pass: string;
  size: string;
  owner?: string;
  created_at: string;
}

export function Databases() {
  const [databases, setDatabases] = useState<DB[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDB, setNewDB] = useState({ name: '', user: '', pass: '' });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchDatabases();
  }, []);

  async function fetchDatabases() {
    try {
      const data = await apiRequest('/databases');
      setDatabases(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddDB(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiRequest('/databases', {
        method: 'POST',
        body: JSON.stringify({ name: newDB.name, db_user: newDB.user, db_pass: newDB.pass }),
      });
      setShowAddModal(false);
      setNewDB({ name: '', user: '', pass: '' });
      fetchDatabases();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this database? This action is IRREVERSIBLE.')) return;
    try {
       await apiRequest(`/databases/${id}`, { method: 'DELETE' });
       fetchDatabases();
    } catch (err) {
       console.error(err);
    }
  }

  const filteredDBs = databases.filter(db => 
    db.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
           <input 
              type="text"
              placeholder="Search databases..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-elegant w-full pl-10"
           />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary-elegant flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Database
        </button>
      </div>

      <div className="table-section">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#94a3b8] uppercase tracking-wider font-semibold bg-[#151921]">
              <tr>
                <th className="px-6 py-4 border-b border-[#2d3646]">Database Name</th>
                <th className="px-6 py-4 border-b border-[#2d3646]">User</th>
                <th className="px-6 py-4 border-b border-[#2d3646]">Size</th>
                <th className="px-6 py-4 border-b border-[#2d3646]">Created</th>
                <th className="px-6 py-4 border-b border-[#2d3646] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3646]">
              <AnimatePresence initial={false}>
                {filteredDBs.map((db) => (
                  <motion.tr
                    key={db.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Database className="w-3 h-3 text-blue-500 opacity-60" />
                        <span className="font-bold text-[#f1f5f9]">{db.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Key className="w-3 h-3 text-[#94a3b8] opacity-40" />
                        <span className="text-[#94a3b8]">{db.db_user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="bg-[#0c0e12] border border-[#2d3646] px-2 py-0.5 rounded text-[10px] font-mono text-[#94a3b8]">
                          {db.size}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-[#94a3b8] opacity-60">
                       {new Date(db.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                        onClick={() => handleDelete(db.id)}
                        className="p-2 hover:bg-red-500/10 text-[#94a3b8] hover:text-red-500 rounded-lg transition-colors"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredDBs.length === 0 && (
            <div className="px-8 py-20 text-center">
               <Database className="w-12 h-12 text-[#2d3646] mx-auto mb-4" />
               <p className="text-[#94a3b8] font-serif italic text-sm">No databases records found in this cluster.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#1c222c] border border-[#2d3646] rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                   <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#f1f5f9] tracking-tight">Provision Database</h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#94a3b8] opacity-60">Initialize structured storage</p>
                </div>
              </div>
              
              <form onSubmit={handleAddDB} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">Database Identifier</label>
                  <input
                    required
                    type="text"
                    placeholder="app_production"
                    value={newDB.name}
                    onChange={(e) => setNewDB({ ...newDB, name: e.target.value })}
                    className="input-elegant w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">Username</label>
                    <input
                      required
                      type="text"
                      placeholder="db_admin"
                      value={newDB.user}
                      onChange={(e) => setNewDB({ ...newDB, user: e.target.value })}
                      className="input-elegant w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">Access Cipher</label>
                    <input
                      required
                      type="password"
                      placeholder="••••••••"
                      value={newDB.pass}
                      onChange={(e) => setNewDB({ ...newDB, pass: e.target.value })}
                      className="input-elegant w-full"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-[#2d3646] text-[#94a3b8] rounded-lg text-sm font-medium hover:bg-[#2d3646] transition-colors"
                  >
                    Abort
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary-elegant"
                  >
                    Execute Provision
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
