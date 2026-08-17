import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Clock,
  List,
  Settings,
  LogOut,
  History,
  Blocks,
  Server,
  UserCircle,
  FileText,
  Network
} from "lucide-react";
import { useOrganization } from "../hooks/useOrganization";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal/LogoutConfirmationModal";

const MainLayout = () => {
  const { data: org } = useOrganization();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const navItems = [
    { path: "/rewind", label: "Rewind", icon: Clock },
    { path: "/events", label: "Events Stream", icon: List },
    { path: "/integrations", label: "Integrations", icon: Blocks },
    { path: "/services", label: "Services Catalog", icon: Server },
    { path: "/postmortems", label: "Postmortems", icon: FileText },
    { path: "/topology", label: "Topology Map", icon: Network },
    { path: "/settings", label: "Project Profile", icon: UserCircle },
  ];

  return (
    <div className="flex min-h-screen font-sans bg-[#0b0e14] text-slate-100">
      {/* Sidebar - Obsidian Enterprise Pane */}
      <aside className="w-64 border-r border-slate-800 bg-[#111827] flex flex-col fixed h-full z-50">
        <div className="p-5 pb-3">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-indigo-950/60 border border-indigo-500/30 shadow-sm group-hover:border-indigo-400 transition-all duration-300">
               <History className="h-4 w-4 text-indigo-400 relative z-10 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
                Last<span className="text-slate-400 font-mono tracking-tighter">Good</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none">Enterprise Platform</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-emerald-500/30 bg-emerald-950/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-medium truncate">Telemetry Active</span>
          </div>
        </div>

        <div className="px-4 py-1">
           <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 block">Platform Navigation</span>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 group relative ${
                    isActive
                      ? "bg-indigo-950/60 text-white font-semibold shadow-sm border border-indigo-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-500"></span>
                    )}
                    <Icon size={16} className={isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"} />
                    <span className="relative z-10">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Organization & Logout Info */}
        <div className="p-3 border-t border-slate-800 bg-[#0b0e14]">
          <div className="p-2.5 rounded-lg flex items-center gap-3 border border-slate-800 bg-[#111827] hover:border-slate-700 transition-colors">
            <div className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-white text-xs">
              {org?.name?.charAt(0) || 'O'}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-xs font-bold text-white truncate leading-tight">
                {org?.name || 'Organization'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono leading-tight">{org?.plan || 'Free'} Plan</span>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-md hover:bg-rose-950/50 cursor-pointer"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 ml-64 relative min-w-0 bg-[#0b0e14] min-h-screen flex flex-col overflow-x-hidden">
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
      
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default MainLayout;
