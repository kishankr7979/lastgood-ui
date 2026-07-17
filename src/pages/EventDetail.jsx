import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Code, GitCommit, User, Activity, Clock, Box } from 'lucide-react';
import { LoadingState } from '../components/LoadingState/LoadingState';
import api from '../api';

const fetchEvent = async ({ queryKey }) => {
    const [_, id] = queryKey;
    const response = await api.get(`/change-events/${id}`);
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error('Failed to fetch event');
};

const EventDetail = () => {
    const { id } = useParams();
    const { data: event, isLoading, error } = useQuery({
        queryKey: ['event', id],
        queryFn: fetchEvent,
    });

    if (isLoading) return <LoadingState message="Retrieving event details..." />;
    if (error) return <div className="p-8 text-center text-status-error flex items-center justify-center h-64"><div className="bg-status-error/10 border border-status-error/20 p-6 rounded-2xl">Error: {error.message}</div></div>;
    if (!event) return <div className="p-8 text-center text-text-muted h-64 flex items-center justify-center">Event not found</div>;

    const formattedDate = new Date(event.occurred_at).toLocaleString();

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto animate-fade-in">
            <Link to="/events" className="inline-flex items-center gap-2 text-text-muted hover:text-accent mb-6 transition-all hover:-translate-x-1 group text-sm">
                <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-accent/10 transition-colors">
                    <ArrowLeft size={14} className="group-hover:text-accent" />
                </div>
                Back to Dashboard
            </Link>

            <div className="surface border border-white/10 rounded-2xl overflow-hidden shadow-xl relative min-w-0">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-blue-500 to-purple-500"></div>
                <div className="p-6 md:p-8 border-b border-white/5 relative bg-gradient-to-b from-white/[0.02] to-transparent">
                    <div className="absolute right-0 top-0 p-6 opacity-5">
                       <Activity size={80} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
                        <span className="px-2 py-1 bg-accent/15 border border-accent/20 text-accent rounded text-xs font-bold uppercase tracking-widest shadow-sm">
                            {event.service}
                        </span>
                        <span className="px-2 py-1 bg-white/5 border border-white/10 text-white rounded text-xs uppercase tracking-widest">
                            {event.environment}
                        </span>
                        <span className="ml-auto text-text-muted text-sm font-medium flex items-center gap-2">
                           <Clock size={14} /> {formattedDate}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">{event.summary || "Configuration Change Event"}</h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs mt-4 relative z-10">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 rounded-lg border border-white/5">
                            <User size={14} className="text-accent" />
                            <span className="text-white font-medium">{event.meta?.author || 'System'}</span>
                        </div>
                        {event.meta?.commit && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 rounded-lg border border-white/5 font-mono">
                                <GitCommit size={14} className="text-blue-400" />
                                <span className="text-text-secondary">{event.meta.commit}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 rounded-lg border border-white/5 font-mono">
                            <Box size={14} className="text-purple-400" />
                            <span className="text-text-secondary">{event.type}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6 bg-black/60">
                    <div className="bg-black/80 rounded-xl border border-white/10 overflow-hidden shadow-inner min-w-0">
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex gap-1.5 mr-4">
                                <div className="w-3 h-3 rounded-full bg-status-error/80"></div>
                                <div className="w-3 h-3 rounded-full bg-status-warning/80"></div>
                                <div className="w-3 h-3 rounded-full bg-status-success/80"></div>
                            </div>
                            <Code size={14} className="text-text-muted" />
                            <span className="text-xs font-mono text-text-muted uppercase tracking-widest">RAW_PAYLOAD.JSON</span>
                        </div>
                        <pre className="p-4 sm:p-6 overflow-x-auto text-xs font-mono text-text-secondary border-t border-white/5">
                            <code className="text-[#a6accd]">
                                {JSON.stringify(event, null, 2)}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
