import React, { useState, useEffect } from "react";
import api from "../api";
import { Network, Plus, Trash2, Server, ArrowRight, ShieldCheck, Layers, GitFork } from "lucide-react";
import { toast } from "../components/ui/Toast";

export default function Topology() {
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [service, setService] = useState("order-service");
  const [dependsOnService, setDependsOnService] = useState("postgres-db");
  const [type, setType] = useState("hard");

  useEffect(() => {
    fetchTopology();
  }, []);

  const fetchTopology = async () => {
    try {
      setLoading(true);
      const res = await api.get("/v1/topology/dependencies");
      if (res.data?.success) {
        setDependencies(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch topology:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDependency = async (e) => {
    e.preventDefault();
    if (service.trim() === dependsOnService.trim()) {
      toast.error("A service cannot depend on itself");
      return;
    }

    try {
      setAdding(true);
      const res = await api.post("/v1/topology/dependencies", {
        service: service.trim(),
        dependsOnService: dependsOnService.trim(),
        type
      });

      if (res.data?.success) {
        toast.success(`Added dependency: ${service} ➔ ${dependsOnService}`);
        fetchTopology();
      }
    } catch (err) {
      console.error("Add dependency error:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteDependency = async (svc, depSvc) => {
    try {
      await api.delete("/v1/topology/dependencies", {
        data: { service: svc, dependsOnService: depSvc }
      });
      toast.success(`Removed dependency: ${svc} ➔ ${depSvc}`);
      fetchTopology();
    } catch (err) {
      console.error("Delete dependency error:", err);
    }
  };

  // Group dependencies by service
  const serviceMap = {};
  dependencies.forEach((d) => {
    if (!serviceMap[d.service]) {
      serviceMap[d.service] = { upstream: [], downstream: [] };
    }
    serviceMap[d.service].upstream.push(d);

    if (!serviceMap[d.depends_on_service]) {
      serviceMap[d.depends_on_service] = { upstream: [], downstream: [] };
    }
    serviceMap[d.depends_on_service].downstream.push(d);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Network size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Service Topology & Blast Radius Map</h1>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Map microservice dependencies so LastGood scoring engine automatically computes multi-hop blast radius during outages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Add Dependency Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <GitFork size={16} className="text-accent" />
              <span>Add Service Dependency</span>
            </div>

            <form onSubmit={handleAddDependency} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Source Service</label>
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
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Depends On (Upstream)</label>
                <input
                  type="text"
                  value={dependsOnService}
                  onChange={(e) => setDependsOnService(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                  placeholder="e.g. postgres-db or auth-service"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Dependency Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                >
                  <option value="hard" className="bg-zinc-900">Hard Dependency (Outage Cascades)</option>
                  <option value="soft" className="bg-zinc-900">Soft Dependency (Degraded Mode)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full py-2.5 px-4 rounded-xl bg-accent text-black font-semibold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
              >
                <Plus size={14} />
                <span>Link Service Dependency</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Topology Visualizer Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Service Dependency Topology Cards</h2>

            {loading ? (
              <div className="py-12 text-center text-xs text-text-muted">Loading topology...</div>
            ) : Object.keys(serviceMap).length === 0 ? (
              <div className="py-12 text-center text-xs text-text-muted space-y-2">
                <Network size={28} className="mx-auto text-text-muted" />
                <p>No service dependencies registered yet. Add dependencies to calculate blast radius.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(serviceMap).map(([svcName, data]) => (
                  <div key={svcName} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Server size={16} className="text-accent" />
                        <span className="font-bold text-white text-xs">{svcName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-text-muted">
                        {data.upstream.length} Upstream | {data.downstream.length} Downstream
                      </span>
                    </div>

                    {/* Upstream Dependencies */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-semibold text-text-muted uppercase">Depends On (Upstream):</span>
                      {data.upstream.length === 0 ? (
                        <div className="text-[11px] text-text-muted italic">None</div>
                      ) : (
                        <div className="space-y-1">
                          {data.upstream.map((dep) => (
                            <div key={dep.id} className="flex items-center justify-between text-xs bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5">
                              <div className="flex items-center gap-1.5">
                                <ArrowRight size={12} className="text-accent" />
                                <span className="font-mono text-white text-[11px]">{dep.depends_on_service}</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 font-mono text-text-secondary">{dep.dependency_type}</span>
                              </div>
                              <button
                                onClick={() => handleDeleteDependency(dep.service, dep.depends_on_service)}
                                className="text-text-muted hover:text-red-400 p-1"
                                title="Remove Link"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
