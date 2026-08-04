import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, Clock, AlertCircle, History, Sparkles, SlidersHorizontal, ShieldAlert } from "lucide-react";
import api from "../api";
import RewindTimeline from "../components/Rewind/RewindTimeline";
import RewindAiDiagnosisPanel from "../components/Rewind/RewindAiDiagnosisPanel";
import { RewindIncidentBrief } from "../components/Rewind/RewindIncidentBrief";
import { LoadingState } from "../components/LoadingState/LoadingState";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const Rewind = () => {
  // Default to "now" formatted for datetime-local input (YYYY-MM-DDThh:mm)
  const [incidentTime, setIncidentTime] = useState(() => {
    return dayjs().utc().format("YYYY-MM-DDTHH:mm");
  });
  const [windowMinutes, setWindowMinutes] = useState(30);
  const [service, setService] = useState("");
  const [environment, setEnvironment] = useState("");
  const [queryParams, setQueryParams] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [viewMode, setViewMode] = useState('brief'); // 'brief' | 'detailed'

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

  // Auto-select primary trigger event or first event when result is fetched
  useEffect(() => {
    if (result) {
      const items = result.individual_scores || result.individualScores || [];
      if (items.length > 0) {
        const primary = items.find(i => i.role === 'primary');
        const target = primary ? (primary.event?.id || primary.id) : (items[0].event?.id || items[0].id);
        setSelectedEventId(target);
      }
    }
  }, [result]);

  return (
    <div className="flex flex-col min-h-full max-w-7xl w-full mx-auto p-4 md:p-6 animate-fade-in text-text-primary">
      {/* Fixed Header & Controls */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2 text-white tracking-tight">
              <div className="p-1.5 bg-accent/10 rounded-lg border border-accent/20 shadow-sm">
                <History className="text-accent h-5 w-5" />
              </div>
              AI Diagnostics Rewind
            </h1>
            <p className="text-text-muted text-xs">
              Time-travel through infrastructure changes to isolate root cause triggers during outages.
            </p>
          </div>
        </div>

        {/* Search Controls Form */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>
          
          <form
            onSubmit={handleSearch}
            className="flex flex-wrap items-end gap-3.5 relative z-10"
          >
            <div className="min-w-[180px] flex-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold text-text-secondary flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar size={12} className="text-accent" /> Incident Time (UTC)
                </label>
                <button
                  type="button"
                  onClick={() => setIncidentTime(dayjs().utc().format("YYYY-MM-DDTHH:mm"))}
                  className="text-[10px] text-accent hover:underline font-bold uppercase tracking-wider"
                >
                  Set to Now
                </button>
              </div>
              <input
                type="datetime-local"
                value={incidentTime}
                onChange={(e) => setIncidentTime(e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all cursor-pointer"
                required
              />
            </div>

            <div className="w-36">
              <label className="text-[11px] font-semibold text-text-secondary mb-1 flex items-center gap-1.5 uppercase tracking-wide">
                <Clock size={12} className="text-accent" /> Window
              </label>
              <select
                value={windowMinutes}
                onChange={(e) => setWindowMinutes(Number(e.target.value))}
                className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all cursor-pointer"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={120}>2 Hours</option>
                <option value={360}>6 Hours</option>
                <option value={1440}>24 Hours</option>
              </select>
            </div>

            <div className="w-40">
              <label className="text-[11px] font-semibold text-text-secondary mb-1 block uppercase tracking-wide">
                Target Service
              </label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g. user-fe"
                className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-text-muted"
              />
            </div>

            <div className="w-32">
              <label className="text-[11px] font-semibold text-text-secondary mb-1 block uppercase tracking-wide">
                Environment
              </label>
              <input
                type="text"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                placeholder="e.g. prod"
                className="w-full bg-black/60 border border-white/10 hover:border-accent/50 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-text-muted"
              />
            </div>

            <button
              type="submit"
              className="bg-accent hover:opacity-90 text-black font-bold px-5 py-2 rounded-xl flex items-center gap-2 transition-all h-[34px] text-xs shadow-lg shadow-accent/15"
            >
              <Search size={14} />
              Analyze Incident
            </button>
          </form>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="flex-1 space-y-6">
        {isLoading && <LoadingState message="Running AI Root Cause Diagnostic Pipeline..." />}

        {error && (
          <div className="bg-status-error/10 border border-status-error/20 text-status-error p-4 rounded-xl flex items-center gap-3 text-xs">
            <AlertCircle size={18} />
            <span>{error.message || "Failed to fetch timeline data"}</span>
          </div>
        )}

        {isFetched && result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* View Mode Segmented Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('brief')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'brief'
                      ? 'bg-accent text-black shadow-md'
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  <Sparkles size={14} />
                  <span>Incident Brief (Fast SRE Mode)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('detailed')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'detailed'
                      ? 'bg-accent text-black shadow-md'
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  <Clock size={14} />
                  <span>Detailed Timeline & Risk Scoring</span>
                </button>
              </div>

              <div className="text-[10px] font-mono text-text-muted flex items-center gap-2">
                <span>View Mode:</span>
                <span className="text-accent font-bold uppercase bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                  {viewMode === 'brief' ? '2-Paragraph Incident Brief' : 'Full Timeline Breakdown'}
                </span>
              </div>
            </div>

            {/* View Mode 1: Incident Brief Mode (Default) */}
            {viewMode === 'brief' && (
              <RewindIncidentBrief
                scoringResult={result}
                queryParams={queryParams}
                onSwitchToDetailed={() => setViewMode('detailed')}
              />
            )}

            {/* View Mode 2: Detailed Split Timeline & Diagnosis Mode */}
            {viewMode === 'detailed' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column (1/3 Width): Interactive Timeline */}
                <div className="lg:col-span-1 space-y-3">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Clock size={14} className="text-accent" />
                      Change Timeline
                    </h3>
                    <span className="text-[10px] font-mono text-text-muted">
                      {(result.individual_scores || result.individualScores || []).length} events
                    </span>
                  </div>

                  <div className="max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
                    <RewindTimeline
                      events={result.individual_scores || result.individualScores || []}
                      selectedEventId={selectedEventId}
                      onSelectEvent={setSelectedEventId}
                      windowMinutes={queryParams?.windowMinutes || windowMinutes}
                    />
                  </div>
                </div>

                {/* Right Column (2/3 Width): Live AI Diagnosis Panel */}
                <div className="lg:col-span-2 space-y-6">
                  <RewindAiDiagnosisPanel
                    scoringResult={result}
                    selectedEventId={selectedEventId}
                    queryParams={queryParams}
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {!queryParams && (
          <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center space-y-3">
            <Sparkles size={24} className="text-accent mx-auto animate-pulse" />
            <h3 className="text-sm font-semibold text-white">Ready for Incident Analysis</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
              Enter the timestamp of an incident above to perform time-travel root cause correlation across your services.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewind;
