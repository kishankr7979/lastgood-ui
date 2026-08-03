import React from 'react';
import { GitCommit, Box, ToggleRight, AlertTriangle, Database, Terminal, ShieldAlert, CheckCircle2, ExternalLink } from 'lucide-react';
import dayjs from 'dayjs';

const getIconForType = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('migration') || t.includes('db')) return <Database size={16} />;
  if (t.includes('commit') || t.includes('push') || t.includes('github')) return <GitCommit size={16} />;
  if (t.includes('flag')) return <ToggleRight size={16} />;
  if (t.includes('alert') || t.includes('error')) return <AlertTriangle size={16} />;
  return <Box size={16} />;
};

const getRoleBadge = (role, level) => {
  if (role === 'primary') {
    return (
      <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
        <ShieldAlert size={10} /> Primary Trigger
      </span>
    );
  }
  if (role === 'contributing') {
    return (
      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-semibold text-[9px] uppercase tracking-wider flex items-center gap-1">
        <AlertTriangle size={10} /> Contributing
      </span>
    );
  }
  return null;
};

const RewindTimeline = ({ events, selectedEventId, onSelectEvent }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-text-muted text-xs">
        No change events detected in this time window.
      </div>
    );
  }

  return (
    <div className="relative border-l border-white/10 ml-3 py-2 space-y-4">
      {events.map((item) => {
        const event = item.event || item;
        const scoreObj = item.score || {};
        const score = scoreObj.score || 0;
        const level = scoreObj.level || 'low';
        const role = item.role;
        const isSelected = event.id === selectedEventId;

        const timeFormatted = event.occurred_at
          ? dayjs(event.occurred_at).format('HH:mm:ss UTC')
          : 'Unknown';

        const isHighRisk = score >= 60 || level === 'critical' || level === 'high';

        return (
          <div
            key={event.id}
            className="relative pl-6 group cursor-pointer"
            onClick={() => onSelectEvent(event.id)}
          >
            {/* Timeline Dot */}
            <div
              className={`absolute -left-2.5 top-2.5 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center transition-all ${
                isSelected ? 'scale-125 ring-2 ring-accent/50' : 'group-hover:scale-110'
              } ${
                role === 'primary' || score >= 80
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : isHighRisk
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-blue-500/20 border-blue-500 text-blue-400'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  role === 'primary' || score >= 80
                    ? 'bg-rose-500'
                    : isHighRisk
                    ? 'bg-amber-500'
                    : 'bg-blue-400'
                }`}
              />
            </div>

            {/* Event Card */}
            <div
              className={`p-4 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                  : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-2 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="p-1.5 rounded-md border border-white/10 bg-white/5 text-accent">
                    {getIconForType(event.type)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                    {event.service}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                    {event.environment}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-text-muted shrink-0">{timeFormatted}</span>
              </div>

              {/* Title / Summary */}
              <h4 className="text-xs font-semibold text-white mb-2 line-clamp-2">
                {event.summary || `${event.type} to ${event.service}`}
              </h4>

              {/* Role Badges & Risk Tag */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                <div className="flex items-center gap-2">
                  {getRoleBadge(role, level)}
                  <span className="text-text-muted text-[10px]">
                    By: <span className="text-white font-medium">{event.meta?.author || event.source || 'CI/CD'}</span>
                  </span>
                </div>

                <span
                  className={`font-mono font-bold text-[11px] ${
                    score >= 80
                      ? 'text-rose-400'
                      : score >= 60
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  Score: {score}/100
                </span>
              </div>

              {/* Expanded details when selected */}
              {isSelected && event.meta && (
                <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-text-muted space-y-1.5 animate-in fade-in duration-200">
                  {event.meta.commit && (() => {
                    const commitUrl = event.meta.commit_url || event.meta.url || (event.meta.repository ? `https://github.com/${event.meta.repository}/commit/${event.meta.commit}` : null);
                    return (
                      <div className="flex items-center justify-between">
                        <span>Commit Hash:</span>
                        {commitUrl ? (
                          <a
                            href={commitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-accent text-[10px] bg-accent/10 hover:bg-accent/20 border border-accent/20 px-1.5 py-0.5 rounded inline-flex items-center gap-1 font-bold"
                            title="View Commit on GitHub"
                          >
                            {event.meta.commit.substring(0, 7)} <ExternalLink size={10} />
                          </a>
                        ) : (
                          <code className="font-mono text-accent text-[10px] bg-accent/10 px-1.5 py-0.5 rounded">
                            {event.meta.commit.substring(0, 7)}
                          </code>
                        )}
                      </div>
                    );
                  })()}
                  {event.meta.branch && (
                    <div className="flex items-center justify-between">
                      <span>Branch:</span>
                      <span className="font-mono text-white text-[10px]">{event.meta.branch}</span>
                    </div>
                  )}
                  {event.meta.diff_stats?.files_changed_count > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Files Changed:</span>
                      <span className="font-mono text-white text-[10px]">
                        {event.meta.diff_stats.files_changed_count} files
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RewindTimeline;
