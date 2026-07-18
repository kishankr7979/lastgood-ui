import React, { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Timeline } from '../components/Timeline/Timeline';
import { Activity, ShieldCheck, AlertTriangle, List, Loader2, Info, Filter } from 'lucide-react';
import { DateRangeFilter } from '../components/EventFilters/DateRangeFilter';
import { SearchBar, MultiSelectFilter, SimpleSelectFilter } from '../components/EventFilters/FilterComponents';
import { SimpleBarChart, SimpleLineChart, StatsCard } from '../components/EventFilters/ChartComponents';
import dayjs from 'dayjs';

const Events = () => {
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

    const events = data ? data.pages.flatMap(page => page.data) : null;
    const totalEvents = data?.pages[0]?.pagination?.total || 0;

    // Extract unique services and environments
    const uniqueServices = useMemo(() => {
        if (!events) return [];
        return [...new Set(events.map(e => e.service))].sort();
    }, [events]);

    const uniqueEnvironments = useMemo(() => {
        if (!events) return [];
        return [...new Set(events.map(e => e.environment))].sort();
    }, [events]);

    // Filter events based on criteria
    const filteredEvents = useMemo(() => {
        if (!events) return [];
        
        return events.filter(event => {
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
    }, [events, searchQuery, fromDate, toDate, selectedServices, selectedEnvironments]);

    // Calculate analytics
    const analytics = useMemo(() => {
        const eventsByService = {};
        const eventsByEnvironment = {};
        const eventsByHour = {};

        filteredEvents.forEach(event => {
            // By service
            eventsByService[event.service] = (eventsByService[event.service] || 0) + 1;

            // By environment
            eventsByEnvironment[event.environment] = (eventsByEnvironment[event.environment] || 0) + 1;

            // By hour
            const hour = dayjs(event.occurred_at).format('HH:00');
            eventsByHour[hour] = (eventsByHour[hour] || 0) + 1;
        });

        return {
            byService: Object.entries(eventsByService).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
            byEnvironment: Object.entries(eventsByEnvironment).map(([label, value]) => ({ label, value })),
            byHour: Object.entries(eventsByHour).map(([label, value]) => ({ label, value })).sort((a, b) => a.label.localeCompare(b.label))
        };
    }, [filteredEvents]);

    return (
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-1 text-white">Dashboard</h1>
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
                <StatsCard label="Total Events" value={filteredEvents.length} icon={Activity} color="accent" />
                <StatsCard label="Security Posture" value="98 / 100" icon={ShieldCheck} color="success" />
                <StatsCard label="Active Alerts" value="0" icon={AlertTriangle} color="warning" />
            </div>

            {/* Filters Section */}
            <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-8 animate-slide-up">
                <div className="flex items-center gap-2 mb-4">
                    <Filter size={16} className="text-accent" />
                    <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Filters & Search</h2>
                </div>
                
                <div className="space-y-3">
                    {/* Search Bar */}
                    <SearchBar 
                        value={searchQuery} 
                        onChange={setSearchQuery}
                        placeholder="Search by commit, author, service, or summary..."
                    />

                    {/* Filters Row */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <DateRangeFilter
                            fromDate={fromDate}
                            toDate={toDate}
                            onFromDateChange={setFromDate}
                            onToDateChange={setToDate}
                            onClear={() => { setFromDate(''); setToDate(''); }}
                        />
                    </div>

                    {/* Service & Environment Filters */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <MultiSelectFilter
                            label="Service"
                            options={uniqueServices}
                            selected={selectedServices}
                            onChange={setSelectedServices}
                            placeholder="Select services..."
                        />
                        <MultiSelectFilter
                            label="Environment"
                            options={uniqueEnvironments}
                            selected={selectedEnvironments}
                            onChange={setSelectedEnvironments}
                            placeholder="Select environments..."
                        />
                        
                        {/* Active Filters Summary */}
                        {(searchQuery || fromDate || toDate || selectedServices.length > 0 || selectedEnvironments.length > 0) && (
                            <div className="text-xs text-text-muted ml-auto">
                                Showing {filteredEvents.length} of {events?.length || 0} events
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 animate-slide-up">
                <SimpleBarChart 
                    data={analytics.byService.slice(0, 5)} 
                    title="Top Services" 
                    height="h-48"
                />
                <SimpleBarChart 
                    data={analytics.byEnvironment} 
                    title="Events by Environment" 
                    height="h-48"
                />
                <SimpleLineChart 
                    data={analytics.byHour.slice(-8)} 
                    title="Events Timeline (Last 8h)" 
                    height="h-48"
                />
            </div>

            {/* Timeline Section */}
            <div className="bg-black/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl animate-slide-up relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <List size={16} className="text-accent" />
                    </div>
                    Recent Activity
                </h2>
                <Timeline events={filteredEvents} isLoading={isLoading} error={error} />
                
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
