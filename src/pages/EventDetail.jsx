import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Code, GitCommit, User, Activity, Clock, Box, Database, ShieldAlert, Sparkles, ExternalLink, ChevronDown, Check, FileText, Server } from 'lucide-react';
import { LoadingState } from '../components/LoadingState/LoadingState';
import api from '../api';
import dayjs from 'dayjs';

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
    const navigate = useNavigate();
    const [showRawJson, setShowRawJson] = useState(false);

    const { data: event, isLoading, error } = useQuery({
        queryKey: ['event', id],
        queryFn: fetchEvent,
    });

    if (isLoading) return <LoadingState message="Retrieving event details..." />;
    if (error) return (
        <div className="p-8 text-center text-status-error flex items-center justify-center h-64">
            <div className="bg-status-error/10 border border-status-error/20 p-6 rounded-2xl">
                Error: {error.message}
            </div>
        </div>
    );
    if (!event) return (
        <div className="p-8 text-center text-text-muted h-64 flex items-center justify-center">
            Event not found
        </div>
    );

    const formattedDate = dayjs(event.occurred_at).utc().format('MMM DD, YYYY • HH:mm:ss UTC');
    const relativeTime = dayjs(event.occurred_at).fromNow();
    const meta = event.meta || {};

    const commitUrl = meta.commit_url || meta.url || (meta.repository && meta.commit ? `https://github.com/${meta.repository}/commit/${meta.commit}` : null);

    const handleRunRewind = () => {
        const timeIso = dayjs.utc(event.occurred_at).format('YYYY-MM-DDTHH:mm');
        navigate(`/rewind`);
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in text-text-primary space-y-6">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <Link to="/events" className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-all hover:-translate-x-1 group text-xs font-semibold uppercase tracking-wider">
                    <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-accent/10 transition-colors">
                        <ArrowLeft size={14} className="group-hover:text-accent" />
                    </div>
                    Back to Production Feed
                </Link>

                <button
                    onClick={handleRunRewind}
                    className="bg-accent hover:opacity-90 text-black font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-xs shadow-lg shadow-accent/15"
                >
                    <Sparkles size={14} />
                    <span>Analyze Anomaly in Rewind</span>
                </button>
            </div>

            {/* Event Hero Card */}
            <div className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-blue-500 to-purple-500"></div>
                
                <div className="p-6 md:p-8 border-b border-white/5 relative bg-gradient-to-b from-white/[0.02] to-transparent space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-accent/15 border border-accent/20 text-accent rounded text-xs font-bold uppercase tracking-widest shadow-sm">
                            {event.service}
                        </span>
                        <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-white rounded text-xs uppercase tracking-widest">
                            {event.environment}
                        </span>
                        <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded text-xs font-mono uppercase tracking-widest">
                            {event.type}
                        </span>
                        <span className="ml-auto text-text-muted text-xs font-mono flex items-center gap-1.5">
                            <Clock size={13} className="text-accent" /> {formattedDate} ({relativeTime})
                        </span>
                    </div>

                    <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">
                        {event.summary || `${event.type} on ${event.service}`}
                    </h1>
                </div>

                {/* Structured Metadata Breakdown (High-Signal Grid) */}
                <div className="p-6 bg-black/40 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Author */}
                        <div className="p-4 bg-black/60 border border-white/5 rounded-xl space-y-1">
                            <span className="text-[10px] uppercase font-mono text-text-muted block font-semibold flex items-center gap-1">
                                <User size={12} className="text-accent" /> Change Author
                            </span>
                            <span className="text-sm font-bold text-white">
                                {meta.author ? `@${meta.author}` : (event.source || 'CI/CD Automated')}
                            </span>
                        </div>

                        {/* Commit / Hash */}
                        <div className="p-4 bg-black/60 border border-white/5 rounded-xl space-y-1">
                            <span className="text-[10px] uppercase font-mono text-text-muted block font-semibold flex items-center gap-1">
                                <GitCommit size={12} className="text-blue-400" /> Commit Reference
                            </span>
                            {meta.commit ? (
                                commitUrl ? (
                                    <a
                                        href={commitUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-mono font-bold text-accent hover:underline flex items-center gap-1.5"
                                    >
                                        {meta.commit.substring(0, 7)} <ExternalLink size={12} />
                                    </a>
                                ) : (
                                    <span className="text-sm font-mono font-bold text-accent">
                                        {meta.commit.substring(0, 7)}
                                    </span>
                                )
                            ) : (
                                <span className="text-sm text-text-muted">N/A</span>
                            )}
                        </div>

                        {/* Environment & Source */}
                        <div className="p-4 bg-black/60 border border-white/5 rounded-xl space-y-1">
                            <span className="text-[10px] uppercase font-mono text-text-muted block font-semibold flex items-center gap-1">
                                <Server size={12} className="text-purple-400" /> Source & Scope
                            </span>
                            <span className="text-sm font-semibold text-white">
                                {event.source || 'System'} • {event.environment}
                            </span>
                        </div>

                        {/* Version */}
                        {meta.version && (
                            <div className="p-4 bg-black/60 border border-white/5 rounded-xl space-y-1">
                                <span className="text-[10px] uppercase font-mono text-text-muted block font-semibold flex items-center gap-1">
                                    <Box size={12} className="text-emerald-400" /> Version Tag
                                </span>
                                <span className="text-sm font-mono font-bold text-white">
                                    {meta.version}
                                </span>
                            </div>
                        )}

                        {/* Branch */}
                        {meta.branch && (
                            <div className="p-4 bg-black/60 border border-white/5 rounded-xl space-y-1">
                                <span className="text-[10px] uppercase font-mono text-text-muted block font-semibold">
                                    Branch Target
                                </span>
                                <span className="text-sm font-mono text-white font-semibold">
                                    {meta.branch}
                                </span>
                            </div>
                        )}

                        {/* Tables Affected */}
                        {meta.tables_affected && meta.tables_affected.length > 0 && (
                            <div className="p-4 bg-black/60 border border-white/5 rounded-xl space-y-1 sm:col-span-2">
                                <span className="text-[10px] uppercase font-mono text-text-muted block font-semibold flex items-center gap-1">
                                    <Database size={12} className="text-amber-400" /> Database Tables Affected
                                </span>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {meta.tables_affected.map((table, idx) => (
                                        <span key={idx} className="text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-semibold">
                                            {table}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Collapsible Raw Telemetry JSON Payload */}
                    <div className="pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => setShowRawJson(!showRawJson)}
                            className="flex items-center justify-between w-full py-2.5 px-4 bg-black/60 hover:bg-black/80 border border-white/10 rounded-xl text-xs font-mono text-text-secondary hover:text-white transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <Code size={14} className="text-accent" />
                                {showRawJson ? 'Hide Raw Telemetry JSON Payload' : 'View Raw Telemetry JSON Payload'}
                            </span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showRawJson ? 'rotate-180 text-accent' : ''}`} />
                        </button>

                        {showRawJson && (
                            <div className="mt-3 bg-black/90 rounded-xl border border-white/10 overflow-hidden shadow-inner animate-in fade-in duration-200">
                                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                                    <Code size={13} className="text-text-muted" />
                                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">RAW_TELEMETRY.JSON</span>
                                </div>
                                <pre className="p-4 overflow-x-auto text-xs font-mono text-text-secondary custom-scrollbar max-h-96">
                                    <code className="text-[#a6accd]">
                                        {JSON.stringify(event, null, 2)}
                                    </code>
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
