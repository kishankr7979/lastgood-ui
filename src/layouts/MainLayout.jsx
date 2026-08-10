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
    { path: "/events", label: "Events", icon: List },
    { path: "/integrations", label: "Integrations", icon: Blocks },
    { path: "/services", label: "Services", icon: Server },
    { path: "/postmortems", label: "Postmortems", icon: FileText },
    { path: "/topology", label: "Topology", icon: Network },
    { path: "/settings", label: "Project Profile", icon: UserCircle },
  ];

  return (
    <div className="flex min-h-screen font-sans selection:bg-white/20 selection:text-white bg-[#050507] text-white">
      {/* Sidebar - Sleek Enterprise Pane */}
      <aside className="w-64 border-r border-white/[0.08] bg-[#09090b] flex flex-col fixed h-full z-50">
        <div className="p-5 pb-3">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-white/15 shadow-sm group-hover:border-white/30 transition-all duration-200">
               <History className="h-4 w-4 text-white relative z-10 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
                Last<span className="text-zinc-400 font-mono tracking-tighter">Good</span>
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Observability</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-white/10 bg-white/[0.03]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-zinc-300 font-medium truncate">Workspace Active</span>
          </div>
        </div>

        <div className="px-4 py-1">
           <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Platform Navigation</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                    isActive
                      ? "bg-white/10 text-white font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-accent"></span>
                    )}
                    <Icon size={16} className={isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"} />
                    <span className="relative z-10">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Organization & Logout Info */}
        <div className="p-3 border-t border-white/[0.08] bg-[#070709]">
          <div className="p-2.5 rounded-lg flex items-center gap-3 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <div className="w-7 h-7 rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center font-mono font-bold text-white text-xs">
              {org?.name?.charAt(0) || 'O'}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-xs font-bold text-white truncate leading-tight">
                {org?.name || 'Organization'}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono leading-tight">{org?.plan || 'Free'} Plan</span>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-zinc-500 hover:text-rose-400 transition-colors p-1.5 rounded-md hover:bg-rose-500/10"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 ml-64 relative min-w-0 bg-[#050507] min-h-screen flex flex-col overflow-x-hidden">
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
