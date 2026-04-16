import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Globe, 
  Database, 
  Mail, 
  FolderOpen, 
  Settings, 
  Users, 
  Terminal, 
  Download,
  LogOut,
  Cpu,
  Save
} from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'motion/react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick, collapsed }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "nav-item-elegant",
        active && "active"
      )}
    >
      <Icon className={cn("w-4 h-4 min-w-[16px]", active ? "text-blue-500" : "text-[#94a3b8]")} />
      {!collapsed && (
        <span className="font-medium whitespace-nowrap transition-all duration-200">
          {label}
        </span>
      )}
    </button>
  );
}

export function Layout({ children, activePage, onNavigate }: { children: React.ReactNode, activePage: string, onNavigate: (page: string) => void }) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuGroups = [
    {
      label: 'Main Menu',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'domains', label: 'Domain Manager', icon: Globe },
        { id: 'databases', label: 'Database Manager', icon: Database },
        { id: 'dns', label: 'DNS Zone Editor', icon: Terminal },
        { id: 'emails', label: 'Email Accounts', icon: Mail },
        { id: 'backups', label: 'Backup & Restore', icon: Save },
      ]
    },
    {
      label: 'Services',
      items: [
        { id: 'files', label: 'File Explorer', icon: FolderOpen },
        { id: 'php', label: 'PHP Configuration', icon: Cpu },
        { id: 'installer', label: '1-Click Installer', icon: Download },
        ...(user?.role === 'admin' ? [{ id: 'users', label: 'User Management', icon: Users }] : []),
      ]
    },
    {
      label: 'Settings',
      items: [
        { id: 'settings', label: 'System Settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#0c0e12] text-[#f1f5f9] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "flex flex-col border-r border-[#2d3646] bg-[#151921] transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="h-20 flex items-center px-6 gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            H
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-[#f1f5f9]">
              Host<span className="text-blue-500">Panel</span> Pro
            </span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar pt-2">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              {!collapsed && (
                <p className="px-6 mb-2 text-[10px] uppercase tracking-widest font-semibold text-[#94a3b8]/60">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activePage === item.id}
                  onClick={() => onNavigate(item.id)}
                  collapsed={collapsed}
                />
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2d3646]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#1c222c] border border-[#2d3646]">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white uppercase">
              {user?.username[0]}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#f1f5f9] truncate text-right">{user?.username}</p>
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider text-right">{user?.role}</p>
              </div>
            )}
            {!collapsed && (
              <button 
                onClick={logout}
                className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0c0e12]">
        <header className="h-16 flex items-center justify-between px-8 border-b border-[#2d3646] bg-[#151921]">
          <div className="flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="Search domains, files or settings..."
              className="w-full bg-[#1c222c] border border-[#2d3646] px-4 py-2 rounded-lg text-xs transition-focus focus:border-blue-500 outline-none text-[#94a3b8]"
            />
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-[#f1f5f9]">Admin User</div>
                <div className="text-[10px] text-[#94a3b8]">vps-7742.host.io</div>
             </div>
             <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#2d3646]">
                A
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

