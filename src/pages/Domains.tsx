import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import { Globe, Plus, Trash2, Settings2, ExternalLink, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

interface Domain {
  id: number;
  domain_name: string;
  path: string;
  php_version: string;
  status: string;
}

export function Domains() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState({ name: '', path: '' });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchDomains();
  }, []);

  async function fetchDomains() {
    try {
      const data = await apiRequest('/domains');
      setDomains(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddDomain(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiRequest('/domains', {
        method: 'POST',
        body: JSON.stringify({ domain_name: newDomain.name, path: newDomain.path }),
      });
      setShowAddModal(false);
      setNewDomain({ name: '', path: '' });
      fetchDomains();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this domain?')) return;
    try {
       await apiRequest(`/domains/${id}`, { method: 'DELETE' });
       fetchDomains();
    } catch (err) {
       console.error(err);
    }
  }

  const filteredDomains = domains.filter(d => 
    d.domain_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
           <input 
              type="text"
              placeholder="Filter domains..."
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
          Add Domain
        </button>
      </div>

      <div className="table-section">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#94a3b8] uppercase tracking-wider font-semibold bg-[#151921]">
              <tr>
                <th className="px-6 py-4 border-b border-[#2d3646]">ID</th>
                <th className="px-6 py-4 border-b border-[#2d3646]">Domain & Path</th>
                <th className="px-6 py-4 border-b border-[#2d3646]">PHP Version</th>
                <th className="px-6 py-4 border-b border-[#2d3646]">Status</th>
                <th className="px-6 py-4 border-b border-[#2d3646] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3646]">
              <AnimatePresence initial={false}>
                {filteredDomains.map((domain, i) => (
                  <motion.tr
                    key={domain.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4 text-[#94a3b8] font-mono">#{domain.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-[#f1f5f9]">{domain.domain_name}</span>
                        <a href={`http://${domain.domain_name}`} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                           <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="text-[10px] text-[#94a3b8] font-mono uppercase tracking-tighter opacity-60">
                         {domain.path}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="bg-[#0c0e12] border border-[#2d3646] px-2 py-0.5 rounded text-[11px] font-mono text-blue-400">
                          {domain.php_version}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={cn(
                         "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                         domain.status === 'active' ? "bg-green-500/10 text-[#10b981]" : "bg-red-500/10 text-[#ef4444]"
                       )}>
                         {domain.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                        onClick={() => handleDelete(domain.id)}
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
          
          {filteredDomains.length === 0 && (
            <div className="px-8 py-20 text-center">
               <Globe className="w-12 h-12 text-[#2d3646] mx-auto mb-4" />
               <p className="text-[#94a3b8] font-serif italic italic text-sm">No domain protocols detected in current sector.</p>
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
              <h3 className="text-xl font-bold text-[#f1f5f9] tracking-tight mb-6">Create New Site</h3>
              
              <form onSubmit={handleAddDomain} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">Domain Name</label>
                  <input
                    required
                    type="text"
                    placeholder="example.com"
                    value={newDomain.name}
                    onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                    className="input-elegant w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">Path</label>
                  <input
                    type="text"
                    placeholder="/var/www/example.com"
                    value={newDomain.path}
                    onChange={(e) => setNewDomain({ ...newDomain, path: e.target.value })}
                    className="input-elegant w-full font-mono"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-[#2d3646] text-[#94a3b8] rounded-lg text-sm font-medium hover:bg-[#2d3646] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary-elegant"
                  >
                    Confirm Creation
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
