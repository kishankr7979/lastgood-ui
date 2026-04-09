import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Clock,
  List,
  Settings,
  BookOpen,
  LogOut,
  History,
  Blocks
} from "lucide-react";
import { useOrganization } from "../hooks/useOrganization";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal/LogoutConfirmationModal";
import { useApiKeys } from "../hooks/useApiKeys";
import { OnboardingModal } from "../components/OnboardingModal/OnboardingModal";

const MainLayout = () => {
  const { data: org } = useOrganization();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { hasApiKeys, refetch } = useApiKeys();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const navItems = [
    { path: "/rewind", label: "Rewind", icon: Clock },
    { path: "/events", label: "Dashboard", icon: List },
    { path: "/integrations", label: "Integrations", icon: Blocks },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen font-sans selection:bg-accent/30 selection:text-white bg-grid">
      {/* Sidebar - Sleek dark pane */}
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col fixed h-full z-50">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 shadow-[0_0_15px_rgba(45,212,191,0.15)] group-hover:shadow-[0_0_25px_rgba(45,212,191,0.3)] transition-all duration-300 group-hover:scale-105 overflow-hidden">
               <div className="absolute inset-0 bg-accent/20 animate-[spin_3s_linear_infinite] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <History className="h-4 w-4 text-accent relative z-10 group-hover:-rotate-45 transition-transform duration-500" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white hover:text-white">
              Last<span className="text-accent font-mono italic opacity-90 tracking-tighter">Good</span>
            </span>
          </div>
        </div>

        <div className="px-4 py-2">
           <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 mt-2 ml-2">Main Menu</div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative overflow-hidden ${
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
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-md shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="surface p-2 rounded-xl flex items-center gap-3 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-blue-500 flex items-center justify-center shadow-lg uppercase font-bold text-white text-xs">
              {org?.name?.charAt(0) || 'O'}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-bold text-white truncate leading-tight">
                {org?.name || 'Loading...'}
              </span>
              <span className="text-[10px] text-accent leading-tight">{org?.plan || 'Free'} Plan</span>
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
      <main className="flex-1 ml-64 relative min-w-0">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="p-4">
          {hasApiKeys ? <Outlet /> : <OnboardingModal onFinished={refetch} />}
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
