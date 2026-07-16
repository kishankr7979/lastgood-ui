import React from 'react';
import { useEvents } from '../hooks/useEvents';
import { Timeline } from '../components/Timeline/Timeline';
import { Activity, ShieldCheck, AlertTriangle, List, Loader2, Info } from 'lucide-react';

const Events = () => {
    const { 
        data, 
        isLoading, 
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useEvents();

    const events = data ? data.pages.flatMap(page => page.data) : null;
    const totalEvents = data?.pages[0]?.pagination?.total || 0;

    return (
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1 text-white">Dashboard</h1>
                    <p className="text-text-muted text-sm">Monitor infrastructure configurations and code deployments.</p>
                </div>
                <div className="flex items-center gap-3 surface px-3 py-1.5 rounded-lg shadow-sm border border-accent/20">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-status-success"></span>
                    </span>
                    <span className="text-xs font-bold text-status-success tracking-wide uppercase">Operational</span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 flex-wrap animate-slide-up">
                {/* Total Events */}
                <div className="surface p-5 rounded-xl relative overflow-hidden group hover:border-accent/40 hover:shadow-[0_0_25px_rgba(45,212,191,0.1)] shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Activity size={64} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-text-secondary font-medium text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Activity size={14} className="text-accent animate-pulse" /> 
                            Total Events (24h)
                        </h3>
                        <p className="text-3xl font-bold text-white tracking-tight">{totalEvents}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent to-transparent w-full opacity-50"></div>
                </div>
                
                {/* Security Posture */}
                <div className="surface p-5 rounded-xl relative overflow-hidden group hover:border-status-success/40 hover:shadow-[0_0_25px_rgba(52,211,153,0.1)] shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <ShieldCheck size={64} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-text-secondary font-medium text-xs uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-status-success" /> 
                                Security posture
                            </span>
                            <div className="group/tooltip relative inline-block cursor-help z-20">
                                <Info size={14} className="text-text-muted hover:text-white transition-colors" />
                                <span className="pointer-events-none absolute bottom-full right-0 mb-2 w-48 bg-[#0a0a0c]/90 backdrop-blur-md border border-white/10 text-[10px] text-text-secondary p-2 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity shadow-xl text-center leading-normal font-sans normal-case">
                                    Simulated posture score for MVP launch monitoring. Real-time scanning rules coming soon.
                                </span>
                            </div>
                        </h3>
                        <p className="text-3xl font-bold text-white tracking-tight">98 <span className="text-base text-text-muted font-normal">/ 100</span></p>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-status-success to-transparent w-full opacity-50"></div>
                </div>
                
                {/* Active Alerts */}
                <div className="surface p-5 rounded-xl relative overflow-hidden group hover:border-status-warning/40 hover:shadow-[0_0_25px_rgba(251,191,36,0.1)] shadow-md transition-all duration-300">
                    <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <AlertTriangle size={64} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-text-secondary font-medium text-xs uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <AlertTriangle size={14} className="text-status-warning" /> 
                                Active Alerts
                            </span>
                            <div className="group/tooltip relative inline-block cursor-help z-20">
                                <Info size={14} className="text-text-muted hover:text-white transition-colors" />
                                <span className="pointer-events-none absolute bottom-full right-0 mb-2 w-48 bg-[#0a0a0c]/90 backdrop-blur-md border border-white/10 text-[10px] text-text-secondary p-2 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity shadow-xl text-center leading-normal font-sans normal-case">
                                    Alert rules are running in simulation mode against sandbox environments.
                                </span>
                            </div>
                        </h3>
                        <p className="text-3xl font-bold text-white tracking-tight">0</p>
                    </div>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-status-warning to-transparent w-full opacity-50"></div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl animate-slide-up relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <List size={16} className="text-accent" />
                    </div>
                    Recent Activity
                </h2>
                <Timeline events={events} isLoading={isLoading} error={error} />
                
                {hasNextPage && (
                    <div className="mt-8 mb-4 flex justify-center">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="flex items-center gap-2 px-6 py-2.5 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-accent/40 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-lg"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 size={16} className="animate-spin text-accent" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <span>Load More Events</span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
