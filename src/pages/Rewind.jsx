import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, Clock, AlertCircle } from "lucide-react";
import api from "../api";
import { Timeline } from "../components/Timeline/Timeline";
import { OverallRiskSummary } from '../components/OverallRiskSummary/OverallRiskSummary';
import { Recommendations } from '../components/Recommendations/Recommendations';
import { Correlations } from '../components/Correlations/Correlations';
import { LoadingState } from "../components/LoadingState/LoadingState";
import dayjs from "dayjs";

const Rewind = () => {
  // Default to "now" formatted for datetime-local input (YYYY-MM-DDThh:mm)
  const [incidentTime, setIncidentTime] = useState(() => {
    return dayjs().utc().format("YYYY-MM-DDTHH:mm");
  });
  const [windowMinutes, setWindowMinutes] = useState(30);
  const [service, setService] = useState("");
  const [environment, setEnvironment] = useState("");
  const [queryParams, setQueryParams] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setQueryParams({
      incidentTime,
      windowMinutes,
      service,
      environment,
    });
  };

  const fetchRewindEvents = async () => {
    if (!queryParams) return null;

    const params = {
      incidentAt: dayjs.utc(queryParams.incidentTime).toISOString(),
      window: `${queryParams.windowMinutes}m`,
    };

    if (queryParams.service) params.service = queryParams.service;
    if (queryParams.environment) params.environment = queryParams.environment;

    // Updated to use the scoring API endpoint
    const response = await api.get("/scoring/incident", { params });

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to fetch scoring data");
  };

  const {
    data: result,
    isLoading,
    error,
    isFetched,
  } = useQuery({
    queryKey: ["rewind", queryParams],
    queryFn: fetchRewindEvents,
    enabled: !!queryParams,
    retry: false,
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rewind</h1>
        <p className="text-text-secondary">
          Find what changed before production broke.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gradient-card border border-white/10 rounded-xl p-6 mb-8 shadow-xl">
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-end gap-4"
        >
          <div className="min-w-[200px] flex-1">
            <label className="block text-sm font-medium text-text-muted mb-2 flex items-center gap-2">
              <Calendar size={16} /> Incident Time (UTC)
            </label>
            <input
              type="datetime-local"
              value={incidentTime}
              onChange={(e) => setIncidentTime(e.target.value)}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent/50 transition-colors placeholder-white/20 cursor-pointer icon-white"
              required
            />
          </div>

          <div className="w-40">
            <label className="block text-sm font-medium text-text-muted mb-2 flex items-center gap-2">
              <Clock size={16} /> Window
            </label>
            <select
              value={windowMinutes}
              onChange={(e) => setWindowMinutes(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent/50 transition-colors appearance-none"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>1 Hour</option>
              <option value={120}>2 Hours</option>
              <option value={360}>6 Hours</option>
              <option value={1440}>24 Hours</option>
            </select>
          </div>

          <div className="w-48">
            <label className="block text-sm font-medium text-text-muted mb-2">
              Service (Optional)
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. payments"
              className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent/50 transition-colors placeholder-white/20"
            />
          </div>

          <div className="w-40">
            <label className="block text-sm font-medium text-text-muted mb-2">
              Env (Optional)
            </label>
            <input
              type="text"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              placeholder="e.g. prod"
              className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent/50 transition-colors placeholder-white/20"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-accent hover:opacity-90 text-white font-bold px-8 py-2.5 rounded-lg flex items-center gap-2 transition-opacity h-[46px] shadow-lg shadow-accent/20"
          >
            <Search size={18} />
            Rewind
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {isLoading && <LoadingState message="Analyzing timeline..." />}

        {error && (
          <div className="bg-status-error/10 border border-status-error/20 text-status-error p-4 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error.message || "Failed to fetch timeline"}</span>
          </div>
        )}

        {isFetched && result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column: Timeline */}
            <div className="lg:col-span-2">
              {result.individual_scores.length === 0 ? (
                <div className="text-center py-12 text-text-muted border border-dashed border-border rounded-xl">
                  No events found in this time window.
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-4 text-sm text-text-secondary">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    Timeline of Changes
                  </div>
                  <Timeline eventsWithScores={result.individual_scores} />
                </div>
              )}
            </div>

            {/* Right Column: Analysis & Recommendations */}
            <div className="lg:col-span-1 space-y-6">
                            <OverallRiskSummary assessment={result.overall_assessment} />
              <Recommendations recommendations={result.overall_assessment.recommendations} />
              <Correlations correlations={result.correlations} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewind;
