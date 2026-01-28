import React from 'react';
import { EventCard } from '../EventCard/EventCard';
import { LoadingState } from '../LoadingState/LoadingState';

export const Timeline = ({ events, eventsWithScores, isLoading, error }) => {
    if (isLoading) {
        return <LoadingState message="Fetching events..." />;
    }

    if (error) {
        return <div className="text-center p-8 text-status-error text-lg">Error: {error.message}</div>;
    }

    const items = eventsWithScores || events;

    if (!items || items.length === 0) {
        return <div className="text-center p-8 text-text-muted text-lg">No events found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            {items.map((item, index) => {
                const event = eventsWithScores ? item.event : item;
                const riskAssessment = eventsWithScores ? item.risk_assessment : null;

                return (
                    <EventCard
                        key={event.id}
                        event={event}
                        riskAssessment={riskAssessment}
                        isLast={index === items.length - 1}
                    />
                );
            })}
        </div>
    );
};
