import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Clock, List, Settings, BookOpen, Activity } from 'lucide-react';
import useOrgStore from '../stores/useOrgStore';

const MainLayout = () => {
    const location = useLocation();

    const { org } = useOrgStore();

    const navItems = [
        { path: '/rewind', label: 'Rewind', icon: Clock },
        { path: '/events', label: 'Events', icon: List },
        { path: '/docs', label: 'Docs', icon: BookOpen },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen font-sans selection:bg-accent/30 selection:text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col fixed h-full z-50">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
                            <Activity size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">LastGood</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-accent/10 text-accent'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-purple-500"></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-text-primary">{org?.name}</span>
                            <span className="text-xs text-text-muted">{org?.plan} Plan</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
