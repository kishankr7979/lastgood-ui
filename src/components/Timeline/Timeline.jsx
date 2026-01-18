import React from 'react';
import { EventCard } from '../EventCard/EventCard';
import { LoadingState } from '../LoadingState/LoadingState';

export const Timeline = ({ events, isLoading, error }) => {
    if (isLoading) {
        return <LoadingState message="Fetching events..." />;
    }

    if (error) {
        return <div className="text-center p-8 text-status-error text-lg">Error: {error.message}</div>;
    }

    if (!events || events.length === 0) {
        return <div className="text-center p-8 text-text-muted text-lg">No events found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            {events.map((event, index) => (
                <EventCard
                    key={event.id}
                    event={event}
                    isLast={index === events.length - 1}
                />
            ))}
        </div>
    );
};
