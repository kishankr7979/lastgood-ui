import React, { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Timeline } from '../components/Timeline/Timeline';
import { List, Loader2, Info, Activity, Database, ShieldAlert, Sparkles, Filter, Server } from 'lucide-react';
import { DateRangeFilter } from '../components/EventFilters/DateRangeFilter';
import { SearchBar, MultiSelectFilter } from '../components/EventFilters/FilterComponents';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/ui/PageContainer';

const Events = () => {
    const navigate = useNavigate();
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useEvents();

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedEnvironments, setSelectedEnvironments] = useState([]);
    const [presetFilter, setPresetFilter] = useState('all'); // 'all' | 'prod' | 'migrations' | 'deployments'

    const events = data ? data.pages.flatMap(page => page.data) : null;
    const totalEventsCount = data?.pages[0]?.pagination?.total || (events ? events.length : 0);

    // Extract unique services and environments
    const uniqueServices = useMemo(() => {
        if (!events) return [];
        return [...new Set(events.map(e => e.service))].sort();
    }, [events]);

    const uniqueEnvironments = useMemo(() => {
        if (!events) return [];
        return [...new Set(events.map(e => e.environment))].sort();
    }, [events]);

    // Calculate SRE Quick Metrics
    const metrics = useMemo(() => {
        if (!events) return { prodCount: 0, migrationCount: 0, deployCount: 0, serviceCount: 0 };
        const prodCount = events.filter(e => e.environment?.toLowerCase() === 'prod').length;
        const migrationCount = events.filter(e => (e.type || '').toLowerCase().includes('migration')).length;
        const deployCount = events.filter(e => (e.type || '').toLowerCase().includes('deploy') || (e.type || '').toLowerCase().includes('commit')).length;
        const serviceCount = new Set(events.map(e => e.service)).size;
        return { prodCount, migrationCount, deployCount, serviceCount };
    }, [events]);

    // Filter events based on criteria + preset chips
    const filteredEvents = useMemo(() => {
        if (!events) return [];

        return events.filter(event => {
            // Preset chip filters
            if (presetFilter === 'prod' && event.environment?.toLowerCase() !== 'prod') return false;
            if (presetFilter === 'migrations' && !(event.type || '').toLowerCase().includes('migration')) return false;
            if (presetFilter === 'deployments' && !(event.type || '').toLowerCase().includes('deploy') && !(event.type || '').toLowerCase().includes('commit')) return false;

            // Date range filter
            if (fromDate || toDate) {
                const eventDate = dayjs(event.occurred_at).format('YYYY-MM-DD');
                if (fromDate && eventDate < fromDate) return false;
                if (toDate && eventDate > toDate) return false;
            }

            // Service filter
            if (selectedServices.length > 0 && !selectedServices.includes(event.service)) {
                return false;
            }

            // Environment filter
            if (selectedEnvironments.length > 0 && !selectedEnvironments.includes(event.environment)) {
                return false;
            }

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    event.summary?.toLowerCase().includes(query) ||
                    event.service?.toLowerCase().includes(query) ||
                    event.meta?.author?.toLowerCase().includes(query) ||
                    event.meta?.commit?.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [events, searchQuery, fromDate, toDate, selectedServices, selectedEnvironments, presetFilter]);

    return (
        <PageContainer>
            <PageHeader
                category="REAL-TIME TELEMETRY STREAM"
                icon={Activity}
                title="Production Audit Stream"
                description="Real-time telemetry audit feed tracking deployments, migrations, and infrastructure configuration mutations."
                actions={
                    <button
                        onClick={() => navigate('/rewind')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-xs shadow-sm cursor-pointer"
                    >
                        <Sparkles size={14} />
                        <span>Run AI Rewind Diagnosis</span>
                    </button>
                }
            />

            {/* SRE Stat Cards Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="p-3.5 bg-[#111827] border border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Total Telemetry Events</span>
                        <span className="text-xl font-bold text-white font-mono">{totalEventsCount}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
                        <List size={16} />
                    </div>
                </div>

                <div className="p-3.5 bg-[#111827] border border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Prod Changes</span>
                        <span className="text-xl font-bold text-rose-400 font-mono">{metrics.prodCount}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-400">
                        <ShieldAlert size={16} />
                    </div>
                </div>

                <div className="p-3.5 bg-[#111827] border border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">DB Schema Migrations</span>
                        <span className="text-xl font-bold text-amber-400 font-mono">{metrics.migrationCount}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400">
                        <Database size={16} />
                    </div>
                </div>

                <div className="p-3.5 bg-[#111827] border border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Services Changed</span>
                        <span className="text-xl font-bold text-white font-mono">{metrics.serviceCount}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
                        <Server size={16} />
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex-1">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search audit trail by commit SHA, service, author..."
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <DateRangeFilter
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                    />
                </div>
            </div>

            {/* Scrollable Timeline Section */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 relative shadow-sm">
                <Timeline events={filteredEvents} isLoading={isLoading || !data} error={error} />

                {hasNextPage && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="flex items-center gap-2 px-5 py-2 bg-[#0b0e14] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-mono font-bold text-white transition-all disabled:opacity-50 uppercase tracking-wider cursor-pointer"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 size={15} className="animate-spin text-indigo-400" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <span>Load More Events</span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default Events;
