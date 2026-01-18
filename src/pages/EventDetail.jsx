import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Code, GitCommit, User } from 'lucide-react';
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
    if (error) return <div className="p-8 text-center text-status-error">Error: {error.message}</div>;
    if (!event) return <div className="p-8 text-center text-text-muted">Event not found</div>;

    const formattedDate = new Date(event.occurred_at).toLocaleString();

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <Link to="/events" className="inline-flex items-center gap-2 text-text-muted hover:text-accent mb-6 transition-colors">
                <ArrowLeft size={16} /> Back to Events
            </Link>

            <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-bold uppercase tracking-wide">
                            {event.service}
                        </span>
                        <span className="px-2 py-1 bg-bg-tertiary text-text-secondary rounded text-xs uppercase tracking-wide">
                            {event.environment}
                        </span>
                        <span className="ml-auto text-text-muted text-sm">{formattedDate}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">{event.summary}</h1>
                    <div className="flex items-center gap-6 text-sm text-text-muted mt-4">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            {event.meta.author}
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                            <GitCommit size={16} />
                            {event.meta.commit}
                        </div>
                    </div>
                </div>

                <div className="p-0">
                    <div className="bg-bg-tertiary border-b border-border px-6 py-2 text-xs font-mono text-text-muted flex items-center gap-2">
                        <Code size={14} /> RAW JSON
                    </div>
                    <pre className="p-6 overflow-x-auto text-sm font-mono text-text-secondary bg-bg-primary">
                        {JSON.stringify(event, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
