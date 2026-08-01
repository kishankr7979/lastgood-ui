import React, { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Timeline } from '../components/Timeline/Timeline';
import { List, Loader2, Info } from 'lucide-react';
import { DateRangeFilter } from '../components/EventFilters/DateRangeFilter';
import { SearchBar, MultiSelectFilter, SimpleSelectFilter } from '../components/EventFilters/FilterComponents';

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
        <div className="flex flex-col h-full max-w-[1400px] w-full mx-auto p-6 animate-fade-in">
            {/* Sticky Header & Filters */}
            <div className="flex-shrink-0 space-y-4 mb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-1 text-white">Events Feed</h1>
                        <p className="text-text-muted text-sm">Monitor configuration changes and deployments.</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="w-64">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search commits, services..."
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
                    
                    {(searchQuery || fromDate || toDate || selectedServices.length > 0 || selectedEnvironments.length > 0) && (
                        <div className="text-xs text-text-muted ml-auto">
                            {filteredEvents.length} results
                        </div>
                    )}
                </div>
            </div>

            {/* Scrollable Timeline Section */}
            <div className="flex-1 overflow-y-auto bg-black/20 border border-white/5 rounded-2xl p-6 relative">

                <h2 className="text-lg font-semibold text-white mb-6 sticky top-0 bg-[#090d16] py-2 z-10 -mt-2 -mx-2 px-2 shadow-[0_10px_20px_-10px_#090d16]">
                    Timeline
                </h2>
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
