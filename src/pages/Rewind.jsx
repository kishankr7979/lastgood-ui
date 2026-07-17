import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, Clock, AlertCircle, History } from "lucide-react";
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
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header with improved hierarchy */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-white">
             <div className="p-2 bg-accent/10 rounded-lg border border-accent/20 shadow-md">
                <History className="text-accent h-6 w-6" />
             </div>
             AI Incident Rewind
          </h1>
          <p className="text-text-muted text-sm leading-relaxed">
            Analyze infrastructure changes during an incident window to identify root causes instantly.
          </p>
        </div>
      </div>

      {/* Controls - Improved layout with better visual hierarchy */}
      <div className="surface border border-accent/20 rounded-2xl p-8 mb-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>
        
        {/* Form label */}
        <div className="mb-6 relative z-10">
          <h2 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-accent"></div>
            Query Parameters
          </h2>
          <p className="text-xs text-text-muted">Specify incident time and analysis window</p>
        </div>
        
        <form
          onSubmit={handleSearch}
          className="space-y-5 relative z-10"
        >
          {/* Primary Row: Incident Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar size={13} className="text-accent" /> Incident Time (UTC)
                </label>
                <button
                  type="button"
                  onClick={() => setIncidentTime(dayjs().utc().format("YYYY-MM-DDTHH:mm"))}
                  className="text-[10px] text-accent hover:text-accent-hover hover:underline transition-colors uppercase tracking-wider font-bold"
                >
                  Set to Now
                </button>
              </div>
              <input
                type="datetime-local"
                value={incidentTime}
                onChange={(e) => setIncidentTime(e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/20 transition-all placeholder-white/20 cursor-pointer shadow-inner"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-1.5 uppercase tracking-wide block">
                <Clock size={13} className="text-accent" /> Window
              </label>
              <select
                value={windowMinutes}
                onChange={(e) => setWindowMinutes(Number(e.target.value))}
                className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/20 transition-all appearance-none cursor-pointer shadow-inner"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={360}>6 hours</option>
                <option value={1440}>24 hours</option>
              </select>
            </div>
          </div>

          {/* Secondary Row: Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-2 block uppercase tracking-wide">
                Target Service <span className="text-text-muted font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g., payments, auth, api-gateway"
                className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/20 transition-all placeholder-white/20 shadow-inner"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary mb-2 block uppercase tracking-wide">
                Environment <span className="text-text-muted font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                placeholder="e.g., prod, staging, canary"
                className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/20 transition-all placeholder-white/20 shadow-inner"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full md:w-auto bg-accent hover:bg-accent-hover active:bg-accent-active text-background font-bold px-8 py-2.5 rounded-lg flex items-center justify-center gap-2.5 transition-all shadow-md shadow-accent/20 transform hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            <Search size={16} />
            Analyze Timeline
          </button>
        </form>
      </div>

      {/* Results - Improved layout */}
      <div className="space-y-6">
        {isLoading && (
          <div className="surface border border-accent/20 rounded-2xl p-8 shadow-md">
            <LoadingState message="Analyzing incident timeline..." />
          </div>
        )}

        {error && (
          <div className="bg-status-error/10 border border-status-error/30 text-status-error p-5 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-1">Analysis Failed</p>
              <p className="text-xs leading-relaxed">{error.message || "Unable to fetch timeline. Please check your parameters and try again."}</p>
            </div>
          </div>
        )}

        {isFetched && result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column: Timeline */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent"></div>
                  Timeline of Changes
                </h2>
                <span className="text-xs text-text-muted bg-white/5 px-2.5 py-1 rounded-full">
                  {result.individual_scores.length} events
                </span>
              </div>
              {result.individual_scores.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border rounded-xl bg-white/[0.02]">
                  <History className="mx-auto mb-3 text-text-muted opacity-50" size={32} />
                  <p className="text-text-muted text-sm">No events found in this time window.</p>
                  <p className="text-text-muted text-xs mt-2">Try adjusting the incident time or analysis window.</p>
                </div>
              ) : (
                <Timeline eventsWithScores={result.individual_scores} />
              )}
            </div>

            {/* Right Column: Analysis & Recommendations */}
            <div className="lg:col-span-1 space-y-5">
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
