import React, { useState, useEffect } from "react";
import api from "../api";
import { FileText, Plus, Sparkles, Copy, Check, Trash2, Calendar, AlertTriangle, ShieldAlert, Layers } from "lucide-react";
import { toast } from "../components/ui/Toast";

export default function Postmortems() {
  const [postmortems, setPostmortems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedPostmortem, setSelectedPostmortem] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form State for generating new postmortem
  const [service, setService] = useState("order-service");
  const [incidentTitle, setIncidentTitle] = useState("Production Outage: order-service DB Migration Failure");
  const [severity, setSeverity] = useState("CRITICAL");
  const [incidentTimestamp, setIncidentTimestamp] = useState(
    new Date(Date.now() - 30 * 60 * 1000).toISOString().substring(0, 16)
  );

  useEffect(() => {
    fetchPostmortems();
  }, []);

  const fetchPostmortems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/v1/postmortem");
      if (res.data?.success) {
        setPostmortems(res.data.data || []);
        if (res.data.data.length > 0 && !selectedPostmortem) {
          setSelectedPostmortem(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch postmortems:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      const res = await api.post("/v1/postmortem/generate", {
        service,
        incidentTitle,
        severity,
        incidentTimestamp: new Date(incidentTimestamp).toISOString(),
      });

      if (res.data?.success) {
        toast.success("Automated SRE Postmortem generated successfully!");
        fetchPostmortems();
        setSelectedPostmortem(res.data.data);
      }
    } catch (err) {
      console.error("Postmortem generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this postmortem?")) return;
    try {
      await api.delete(`/v1/postmortem/${id}`);
      toast.success("Postmortem deleted");
      fetchPostmortems();
      if (selectedPostmortem?.id === id) {
        setSelectedPostmortem(null);
      }
    } catch (err) {
      console.error("Delete postmortem error:", err);
    }
  };

  const handleCopyMarkdown = () => {
    if (!selectedPostmortem?.markdown_report) return;
    navigator.clipboard.writeText(selectedPostmortem.markdown_report);
    setCopied(true);
    toast.success("Markdown report copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <FileText size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SRE Incident Postmortems</h1>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Automated 1-click postmortem generation with root-cause analysis, chronological timelines, and action items.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Generator Form & Recent Postmortems List */}
        <div className="space-y-6 lg:col-span-1">
          {/* Generator Form */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Sparkles size={16} className="text-accent" />
              <span>Generate New SRE Postmortem</span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Target Service</label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                  placeholder="e.g. order-service"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Incident Title</label>
                <input
                  type="text"
                  value={incidentTitle}
                  onChange={(e) => setIncidentTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                  placeholder="e.g. Production Outage: order-service DB Migration"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                  >
                    <option value="CRITICAL" className="bg-zinc-900">CRITICAL</option>
                    <option value="HIGH" className="bg-zinc-900">HIGH</option>
                    <option value="MEDIUM" className="bg-zinc-900">MEDIUM</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Incident Time</label>
                  <input
                    type="datetime-local"
                    value={incidentTimestamp}
                    onChange={(e) => setIncidentTimestamp(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-[11px] text-white focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-2.5 px-4 rounded-xl bg-accent text-black font-semibold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Sparkles size={14} className="animate-spin" />
                    <span>Analyzing Telemetry...</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>Generate Postmortem Report</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* History List */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Past Postmortems</h3>

            {loading ? (
              <div className="py-6 text-center text-xs text-text-muted">Loading postmortems...</div>
            ) : postmortems.length === 0 ? (
              <div className="py-6 text-center text-xs text-text-muted">No postmortems generated yet.</div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {postmortems.map((p) => {
                  const isSelected = selectedPostmortem?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPostmortem(p)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-accent/10 border-accent/40 text-white"
                          : "bg-white/5 border-white/5 text-text-secondary hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="space-y-1 min-w-0 pr-2">
                        <div className="text-xs font-semibold truncate">{p.title}</div>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted">
                          <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-mono">{p.severity}</span>
                          <span>{new Date(p.incident_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p.id);
                        }}
                        className="text-text-muted hover:text-red-400 transition-colors p-1"
                        title="Delete Postmortem"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Postmortem Document Viewer */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPostmortem ? (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
              {/* Report Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedPostmortem.title}</h2>
                  <p className="text-xs text-text-muted">
                    Incident Date: {new Date(selectedPostmortem.incident_at).toUTCString()}
                  </p>
                </div>
                <button
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white flex items-center gap-2 transition-all"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? "Copied Markdown" : "Copy Markdown"}</span>
                </button>
              </div>

              {/* Executive Summary Card */}
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-red-400">
                  <ShieldAlert size={16} />
                  <span>Executive Summary</span>
                </div>
                <p>{selectedPostmortem.executive_summary}</p>
                <div className="pt-1 text-[11px] font-mono text-red-300">
                  Headline: "{selectedPostmortem.primary_cause_headline}"
                </div>
              </div>

              {/* Action Items List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Preventative SRE Action Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(selectedPostmortem.action_items_json || []).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent font-mono">
                          {item.priority}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">{item.owner}</span>
                      </div>
                      <p className="text-xs text-white font-medium line-clamp-2">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Chronological Incident Timeline</h3>
                <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5">
                  {(selectedPostmortem.timeline_json || []).map((t, idx) => (
                    <div key={idx} className="p-3 bg-black/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-text-muted">
                          {new Date(t.timestamp).toISOString().substring(11, 19)} UTC
                        </span>
                        <span className="font-semibold text-white">{t.summary}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          t.impact_level === "PRIMARY_CULPRIT"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-white/10 text-text-secondary"
                        }`}
                      >
                        {t.impact_level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Markdown Raw Preview Box */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Raw Markdown Report</h3>
                <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-text-secondary text-[11px] font-mono whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">
                  {selectedPostmortem.markdown_report}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-12 text-center text-text-muted space-y-3">
              <FileText size={32} className="mx-auto text-text-muted" />
              <p className="text-sm">Select a postmortem from the left or generate a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
