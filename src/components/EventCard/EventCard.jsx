import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export const EventCard = ({ event, isLast }) => {
    const { summary, occurred_at, meta, service, environment, id, time_before_incident } = event;

    const date = dayjs(occurred_at).utc().format('MMM DD, h:mm A');

    return (
        <div className="flex gap-4">
            {/* Timeline Column */}
            <div className="flex flex-col items-center relative">
                <div className="w-3 h-3 rounded-full bg-accent mt-6 shadow-[0_0_10px_rgba(45,212,191,0.5)] z-10"></div>
                {!isLast && <div className="w-px bg-border flex-1 absolute top-9 bottom-0"></div>}
            </div>

            {/* Content Column */}
            <div className="flex-1 pb-8">
                <Link to={`/events/${id}`} className="block bg-gradient-card border border-white/5 rounded-lg p-5 transition-all duration-300 hover:border-accent/50 group hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="relative z-10 flex items-center gap-2 mb-3 text-sm text-text-secondary">
                        <span className="font-semibold uppercase tracking-wide text-accent">{service}</span>
                        <span className="bg-black/30 px-2 py-0.5 rounded text-xs border border-white/10">{environment}</span>
                        <span className="ml-auto text-text-muted font-mono text-xs flex items-center gap-3">
                            {time_before_incident && (
                                <span className="text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                                    {time_before_incident}
                                </span>
                            )}
                            {date}
                        </span>
                    </div>

                    <h3 className="m-0 mb-3 text-xl font-medium text-text-primary group-hover:text-accent transition-colors">{summary}</h3>

                    <div className="flex flex-wrap gap-4 text-sm text-text-muted border-t border-border pt-3 mt-1">
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            {meta.author}
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs bg-bg-tertiary px-1.5 rounded">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                            {meta.commit}
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};
