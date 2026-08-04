import React, { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Timeline } from '../components/Timeline/Timeline';
import { List, Loader2, Info, Activity, Database, GitCommit, ShieldAlert, Sparkles, Filter, Server, Clock } from 'lucide-react';
import { DateRangeFilter } from '../components/EventFilters/DateRangeFilter';
import { SearchBar, MultiSelectFilter } from '../components/EventFilters/FilterComponents';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

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
        <div className="flex flex-col h-full max-w-[1400px] w-full mx-auto p-4 md:p-6 animate-fade-in text-text-primary">
            {/* Header & SRE Golden Signal Metrics */}
            <div className="flex-shrink-0 space-y-4 mb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-1 text-white flex items-center gap-2 tracking-tight">
                            <Activity className="text-accent h-6 w-6" />
                            Production Audit Stream
                        </h1>
                        <p className="text-text-muted text-xs">
                            Real-time telemetry audit feed tracking deployments, migrations, and system configuration mutations.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/rewind')}
                        className="bg-accent hover:opacity-90 text-black font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-xs shadow-lg shadow-accent/15"
                    >
                        <Sparkles size={14} />
                        <span>Run AI Rewind Diagnosis</span>
                    </button>
                </div>

                {/* SRE Stat Cards Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Total Telemetry Events</span>
                            <span className="text-lg font-bold text-white font-mono">{totalEventsCount}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-accent">
                            <List size={16} />
                        </div>
                    </div>

                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Prod Changes</span>
                            <span className="text-lg font-bold text-rose-400 font-mono">{metrics.prodCount}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                            <ShieldAlert size={16} />
                        </div>
                    </div>

                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">DB Schema Migrations</span>
                            <span className="text-lg font-bold text-amber-400 font-mono">{metrics.migrationCount}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <Database size={16} />
                        </div>
                    </div>

                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Services Changed</span>
                            <span className="text-lg font-bold text-white font-mono">{metrics.serviceCount}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-accent">
                            <Server size={16} />
                        </div>
                    </div>
                </div>

                {/* SRE Fast Preset Filter Chips */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                            <Filter size={12} className="text-accent" /> Fast Filters:
                        </span>
                        <button
                            onClick={() => setPresetFilter('all')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                presetFilter === 'all'
                                    ? 'bg-accent text-black font-bold shadow-md'
                                    : 'bg-black/60 border border-white/10 text-text-secondary hover:text-white'
                            }`}
                        >
                            All Events ({events ? events.length : 0})
                        </button>
                        <button
                            onClick={() => setPresetFilter('prod')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                presetFilter === 'prod'
                                    ? 'bg-rose-500 text-white font-bold shadow-md'
                                    : 'bg-black/60 border border-white/10 text-text-secondary hover:text-white'
                            }`}
                        >
                            Prod Only
                        </button>
                        <button
                            onClick={() => setPresetFilter('migrations')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                presetFilter === 'migrations'
                                    ? 'bg-amber-500 text-black font-bold shadow-md'
                                    : 'bg-black/60 border border-white/10 text-text-secondary hover:text-white'
                            }`}
                        >
                            DB Migrations
                        </button>
                        <button
                            onClick={() => setPresetFilter('deployments')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                presetFilter === 'deployments'
                                    ? 'bg-blue-500 text-white font-bold shadow-md'
                                    : 'bg-black/60 border border-white/10 text-text-secondary hover:text-white'
                            }`}
                        >
                            Deployments
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="w-56">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search commits, authors..."
                            />
                        </div>
                        <DateRangeFilter
                            fromDate={fromDate}
                            toDate={toDate}
                            onFromDateChange={setFromDate}
                            onToDateChange={setToDate}
                            onClear={() => { setFromDate(''); setToDate(''); }}
                        />
                        <MultiSelectFilter
                            label="Service"
                            options={uniqueServices}
                            selected={selectedServices}
                            onChange={setSelectedServices}
                            placeholder="All Services"
                        />
                        <MultiSelectFilter
                            label="Env"
                            options={uniqueEnvironments}
                            selected={selectedEnvironments}
                            onChange={setSelectedEnvironments}
                            placeholder="All Envs"
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable Timeline Section */}
            <div className="flex-1 overflow-y-auto bg-black/40 border border-white/10 rounded-2xl p-6 relative shadow-xl custom-scrollbar">

                <div className="flex items-center justify-between sticky top-0 bg-[#090d16]/95 backdrop-blur-md py-3 z-10 -mt-2 -mx-2 px-3 border-b border-white/5 mb-6">
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Clock size={14} className="text-accent" />
                        Audit Stream Timeline
                    </h2>
                    <span className="text-[10px] font-mono text-text-muted bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                        Showing {filteredEvents.length} events
                    </span>
                </div>

                <Timeline events={filteredEvents} isLoading={isLoading || !data} error={error} />

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
