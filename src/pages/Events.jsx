import React from 'react';
import { useEvents } from '../hooks/useEvents';
import { Timeline } from '../components/Timeline/Timeline';

const Events = () => {
    const { data: events, isLoading, error } = useEvents();

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Events</h1>
                <p className="text-text-secondary">Full audit log of all system changes.</p>
            </div>
            <Timeline events={events} isLoading={isLoading} error={error} />
        </div>
    );
};

export default Events;
