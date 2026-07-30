import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Clock,
  List,
  Settings,
  LogOut,
  History,
  Blocks,
  Sparkles,
  Server
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
    { path: "/rewind", label: "AI Incident Rewind", icon: Clock },
    { path: "/events", label: "Telemetry Feed", icon: List },
    { path: "/integrations", label: "Ingestion Channels", icon: Blocks },
    { path: "/services", label: "Services & Keys", icon: Server },
    { path: "/settings", label: "Configuration", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen font-sans selection:bg-accent/30 selection:text-white bg-grid">
      {/* Sidebar - Sleek Dark Pane */}
      <aside className="w-64 border-r border-white/[0.05] bg-black/45 backdrop-blur-2xl flex flex-col fixed h-full z-50">
        <div className="p-6 pb-3">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 shadow-[0_0_15px_rgba(45,212,191,0.15)] group-hover:shadow-[0_0_25px_rgba(45,212,191,0.3)] transition-all duration-300 group-hover:scale-105 overflow-hidden">
               <div className="absolute inset-0 bg-accent/20 animate-[spin_3s_linear_infinite] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <History className="h-4 w-4 text-accent relative z-10 group-hover:-rotate-45 transition-transform duration-500" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hover:text-white">
              Last<span className="text-accent font-mono italic opacity-90 tracking-tighter">Good</span>
            </span>
          </div>
        </div>

        {/* AI Agent Status Badge */}
        <div className="px-4 py-2.5 border-b border-white/[0.05] mb-2 bg-black/10">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-accent/20 bg-accent/5 shadow-[0_0_15px_rgba(45,212,191,0.05)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white tracking-wide uppercase leading-none flex items-center gap-1">
                Diagnostic AI
                <Sparkles size={8} className="text-accent fill-accent/45 animate-pulse" />
              </span>
              <span className="text-[9px] text-accent font-semibold mt-0.5 leading-none">Agent Online</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-1">
           <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 mt-2 ml-2">AI Diagnostic Suite</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative overflow-hidden ${
                    isActive
                      ? "bg-accent/10 border border-accent/20 text-accent shadow-[0_0_15px_rgba(45,212,191,0.05)]"
                      : "text-text-secondary hover:text-white hover:bg-white/5 border border-transparent"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className={isActive ? "text-accent" : "text-text-muted group-hover:text-white"} />
                    <span className="relative z-10">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Organization & Logout Info */}
        <div className="p-4 border-t border-white/[0.05] bg-black/10">
          <div className="surface p-2 rounded-xl flex items-center gap-3 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-blue-500 flex items-center justify-center shadow-lg uppercase font-bold text-white text-xs">
              {org?.name?.charAt(0) || 'O'}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-bold text-white truncate leading-tight">
                {org?.name || 'Loading...'}
              </span>
              <span className="text-xs text-accent leading-tight">{org?.plan || 'Free'} Plan</span>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-text-muted hover:text-status-error transition-colors p-1.5 rounded-lg hover:bg-status-error/10"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 relative min-w-0 bg-transparent">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="p-4">
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
