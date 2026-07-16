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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-3 text-white">
             <div className="p-1.5 bg-accent/10 rounded-lg border border-accent/20 shadow-sm">
                <History className="text-accent h-5 w-5" />
             </div>
             AI Diagnostics Rewind
          </h1>
          <p className="text-text-muted text-sm">
            Time-travel through infrastructure changes to identify the root cause of an incident.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="surface border border-accent/20 rounded-2xl p-6 mb-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>
        
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-end gap-4 relative z-10"
        >
          <div className="min-w-[180px] flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5 uppercase tracking-wide">
                <Calendar size={12} className="text-accent" /> Incident Time (UTC)
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
              className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all placeholder-white/20 cursor-pointer shadow-inner"
              required
            />
          </div>

          <div className="w-36">
            <label className="text-xs font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <Clock size={12} className="text-accent" /> Analysis Window
            </label>
            <select
              value={windowMinutes}
              onChange={(e) => setWindowMinutes(Number(e.target.value))}
              className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all appearance-none cursor-pointer shadow-inner"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>1 Hour</option>
              <option value={120}>2 Hours</option>
              <option value={360}>6 Hours</option>
              <option value={1440}>24 Hours</option>
            </select>
          </div>

          <div className="w-44">
            <label className="text-xs font-semibold text-text-secondary mb-1.5 block uppercase tracking-wide">
              Target Service
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. payments"
              className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all placeholder-white/20 shadow-inner block"
            />
          </div>

          <div className="w-36">
            <label className="text-xs font-semibold text-text-secondary mb-1.5 block uppercase tracking-wide">
              Environment
            </label>
            <input
              type="text"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              placeholder="e.g. prod"
              className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all placeholder-white/20 shadow-inner block"
            />
          </div>

          <button
            type="submit"
            className="bg-accent hover:bg-accent-hover text-background font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-all h-[38px] shadow-sm transform hover:-translate-y-0.5 text-sm"
          >
            <Search size={16} />
            Analyze
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
