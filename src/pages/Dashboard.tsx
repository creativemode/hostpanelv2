import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import { Globe, Mail, Database, Activity, Cpu, Download, FolderOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

export function Dashboard() {
  const [stats, setStats] = useState({ domains: 0, databases: 0, emails: 0, load: '14%' });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const data = await apiRequest('/dashboard/stats');
      setStats({ ...data, load: '14%' }); // Hardcoding load for theme fidelity
    } catch (err) {
      console.error(err);
    }
  }

  const statCards = [
    { label: 'CPU Usage', value: stats.load, progress: 14, color: 'bg-blue-500' },
    { label: 'Memory (RAM)', value: '2.4 / 8 GB', progress: 30, color: 'bg-blue-500' },
    { label: 'Disk Space', value: '45.2 / 120 GB', progress: 38, color: 'bg-yellow-500' },
    { label: 'Bandwidth', value: '1.2 TB', progress: 10, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div className="text-[12px] text-[#94a3b8] mb-2 font-medium">{stat.label}</div>
            <div className="text-2xl font-semibold mb-3 tracking-tight">{stat.value}</div>
            <div className="h-1.5 bg-[#2d3646] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stat.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={cn("h-full", stat.color)} 
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3">
          <div className="table-section">
            <div className="px-6 py-4 border-b border-[#2d3646] flex justify-between items-center bg-[#1c222c]">
              <div className="font-semibold text-sm">Active Websites</div>
              <button className="btn-primary-elegant">
                + Create New Site
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#94a3b8] uppercase tracking-wider font-semibold bg-[#151921]">
                  <tr>
                    <th className="px-6 py-3 border-b border-[#2d3646]">Domain Name</th>
                    <th className="px-6 py-3 border-b border-[#2d3646]">Status</th>
                    <th className="px-6 py-3 border-b border-[#2d3646]">PHP</th>
                    <th className="px-6 py-3 border-b border-[#2d3646]">Database</th>
                    <th className="px-6 py-3 border-b border-[#2d3646]">SSL</th>
                    <th className="px-6 py-3 border-b border-[#2d3646]">Traffic (24h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d3646]">
                  <TableRow name="stellar-app.com" status="Live" php="8.3" db="db_stellar_prod" ssl="Active" traffic="12.4k" />
                  <TableRow name="myportfolio.net" status="Live" php="8.2" db="db_folio" ssl="Active" traffic="1.2k" />
                  <TableRow name="staging.dev.io" status="Pending" php="8.1" db="-" ssl="Not set" traffic="0" />
                  <TableRow name="ecommerce-store.shop" status="Live" php="8.3" db="shop_main" ssl="Active" traffic="45.8k" />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-5">
           <div className="stat-card flex flex-col h-full uppercase tracking-[0.1em]">
              <h3 className="text-[10px] font-bold text-[#94a3b8] mb-6 border-b border-[#2d3646] pb-2">Recent Activities</h3>
              <div className="space-y-6 flex-1">
                 <ActivityItem title="Domain Added" detail="stellar-app.com" time="2m ago" />
                 <ActivityItem title="SSL Issued" detail="stellar-app.com" time="15m ago" />
                 <ActivityItem title="Backup Complete" detail="Daily system backup" time="1h ago" />
                 <ActivityItem title="WP Installed" detail="blog.travel.com" time="3h ago" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ name, status, php, db, ssl, traffic }: any) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors">
      <td className="px-6 py-4 font-bold">{name}</td>
      <td className="px-6 py-4">
        <span className={cn(
          "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
          status === 'Live' ? "bg-green-500/10 text-[#10b981]" : "bg-yellow-500/10 text-[#f59e0b]"
        )}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="bg-[#0c0e12] border border-[#2d3646] px-2 py-0.5 rounded text-[11px] font-mono">{php}</span>
      </td>
      <td className="px-6 py-4 text-[#94a3b8]">{db}</td>
      <td className="px-6 py-4">
        <span className={cn(
          "flex items-center gap-1",
          ssl === 'Active' ? "text-[#10b981]" : "text-[#94a3b8]"
        )}>
          {ssl === 'Active' && '✔'} {ssl}
        </span>
      </td>
      <td className="px-6 py-4 text-[#94a3b8]">{traffic}</td>
    </tr>
  );
}


function ActivityItem({ title, detail, time }: { title: string, detail: string, time: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="mt-1">
        <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
      </div>
      <div className="flex-1 border-l border-[#2d3646] pl-4 py-0.5">
        <p className="text-[10px] font-bold text-[#f1f5f9] uppercase tracking-wider">{title}</p>
        <p className="text-[10px] text-[#94a3b8] font-mono mt-1 opacity-60">{detail}</p>
        <p className="text-[9px] text-[#94a3b8] mt-2 opacity-40 font-medium">{time}</p>
      </div>
    </div>
  );
}
