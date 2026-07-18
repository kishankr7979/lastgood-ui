import React from 'react';
import { EventCard } from '../EventCard/EventCard';
import { LoadingState } from '../LoadingState/LoadingState';

export const Timeline = ({ eventsWithScores, isLoading, error }) => {
    if (isLoading) {
        return <LoadingState message="Fetching events..." />;
    }

    if (error) {
        return <div className="text-center p-8 text-status-error text-base">Error: {error.message}</div>;
    }

    if (!eventsWithScores || eventsWithScores.length === 0) {
        return <div className="text-center p-8 text-text-muted text-base">No events found.</div>;
    }

    // Find the first event that belongs to the causal chain (lowest causal_position).
    // The "CAUSAL PATH" section label is inserted immediately before it.
    const firstCausalItem = eventsWithScores
        .filter(item => item.causal_position != null)
        .reduce((min, item) => (!min || item.causal_position < min.causal_position ? item : min), null);
    const firstCausalId = firstCausalItem?.event?.id ?? null;

    // Only show the causal path label when there are 2+ causal events (i.e. a chain exists).
    const hasCausalChain = eventsWithScores.filter(item => item.causal_position != null).length >= 2;

    return (
        <div className="max-w-3xl mx-auto py-8">
            {eventsWithScores.map((item, index) => {
                const { event, risk_assessment, role, causal_position } = item;
                const showCausalLabel = hasCausalChain && event.id === firstCausalId;

                return (
                    <React.Fragment key={event.id}>
                        {showCausalLabel && (
                            <div className="text-xs font-semibold uppercase tracking-widest text-accent/60 mb-2 mt-4">
                                Causal Path
                            </div>
                        )}
                        <EventCard
                            event={event}
                            riskAssessment={risk_assessment}
                            isLast={index === eventsWithScores.length - 1}
                            roleBadge={role ?? null}
                            causalChainPosition={causal_position ?? null}
                        />
                    </React.Fragment>
                );
            })}
        </div>
    );
};
