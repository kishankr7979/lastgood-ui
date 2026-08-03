import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldAlert, Cpu, Terminal, Check, Copy, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';
import { RiskScoreRing } from '../RiskScoreRing/RiskScoreRing';
import dayjs from 'dayjs';
import { toast } from '../ui/Toast';

const RewindAiDiagnosisPanel = ({ scoringResult, selectedEventId, queryParams }) => {
  const [copiedCmd, setCopiedCmd] = useState(null);

  if (!scoringResult) {
    return (
      <div className="h-full border border-white/5 rounded-2xl bg-black/40 p-12 flex flex-col items-center justify-center text-center space-y-3 text-text-muted">
        <Sparkles size={28} className="text-accent/50" />
        <h3 className="text-sm font-semibold text-white">AI Diagnosis Standby</h3>
        <p className="text-xs max-w-sm leading-relaxed">
          Select an incident timestamp and click <span className="text-accent">Analyze</span> to generate live root-cause intelligence.
        </p>
      </div>
    );
  }

  const overallScore = scoringResult.overall_assessment?.score || scoringResult.overallScore?.score || 0;
  const overallLevel = scoringResult.overall_assessment?.level || scoringResult.overallScore?.level || 'low';
  const explanation = scoringResult.overall_assessment?.explanation || scoringResult.overallScore?.explanation || 'Analysis complete.';
  const recommendations = scoringResult.overall_assessment?.recommendations || scoringResult.overallScore?.recommendations || [];
  const correlations = scoringResult.correlations || [];

  // Find selected event
  const individualScores = scoringResult.individual_scores || scoringResult.individualScores || [];
  const selectedItem = individualScores.find(i => (i.event?.id || i.id) === selectedEventId) || individualScores[0];
  const selectedEvent = selectedItem?.event || selectedItem;
  const selectedScore = selectedItem?.score;

  const handleCopyCommand = (cmd, index) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(index);
    setTimeout(() => setCopiedCmd(null), 2000);
    toast.success('Command copied to clipboard!');
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-rose-500/20 border-rose-500/30 text-rose-400';
      case 'high': return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
      case 'medium': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      default: return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-gradient-to-r from-accent/10 via-transparent to-transparent flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-widest ${getLevelColor(overallLevel)}`}>
              {overallLevel} SEVERITY
            </span>
            {queryParams?.service && (
              <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                Service: {queryParams.service}
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-status-error" size={18} />
            AI Root Cause Diagnosis
          </h2>
          <p className="text-xs text-text-muted">
            Incident Window: <span className="text-white font-mono">{queryParams?.windowMinutes || 30}m</span> | Target Time: <span className="text-white font-mono">{dayjs(queryParams?.incidentTime).format('HH:mm UTC')}</span>
          </p>
        </div>

        <div className="w-14 h-14 shrink-0 flex items-center justify-center">
          <RiskScoreRing score={overallScore} level={overallLevel} radius={26} stroke={4} />
        </div>
      </div>

      {/* AI Summary Banner */}
      <div className="p-5 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-accent uppercase tracking-wider">
          <Sparkles size={14} className="animate-pulse" />
          Executive Analysis
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {explanation}
        </p>
      </div>

      {/* Selected Event Focus Card */}
      {selectedEvent && (
        <div className="p-5 border-b border-white/5 space-y-3 bg-black/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted flex items-center gap-1">
              <FileCode size={12} className="text-accent" /> Selected Change Event Focus
            </span>
            {selectedItem?.role && (
              <span className="text-[9px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {selectedItem.role} trigger
              </span>
            )}
          </div>

          <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="text-xs font-bold text-white leading-snug">
                {selectedEvent.summary || selectedEvent.type}
              </h4>
              <span className="text-xs font-mono font-bold text-accent">
                {selectedScore?.score || 0}/100
              </span>
            </div>
            
            {selectedScore?.explanation && (
              <p className="text-[11px] text-text-secondary leading-relaxed">
                {selectedScore.explanation}
              </p>
            )}

            {/* Factors breakdown */}
            {selectedScore?.factors?.length > 0 && (
              <div className="pt-2 border-t border-white/5 space-y-1">
                <span className="text-[9px] uppercase font-mono text-text-muted block">Risk Factors:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {selectedScore.factors.map((f, i) => (
                    <div key={i} className="flex justify-between text-[10px] bg-white/5 px-2 py-1 rounded">
                      <span className="text-text-secondary">{f.name}</span>
                      <span className="font-mono text-white font-semibold">{Math.round(f.score * f.weight)} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Correlated Changes */}
      {correlations.length > 0 && (
        <div className="p-5 border-b border-white/5 space-y-3 bg-white/[0.01]">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Cpu size={14} className="text-accent" />
            Correlated Change Signals ({correlations.length})
          </h3>
          <div className="space-y-2">
            {correlations.map((corr, idx) => (
              <div key={idx} className="p-3 bg-black/50 border border-white/5 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">{corr.description}</div>
                  <div className="text-[10px] text-text-muted">
                    Confidence: <span className="text-accent font-mono font-bold">{corr.confidence}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                    +{corr.riskIncrease} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Recommendations (Hidden for now) */}
      {/* 
      <div className="p-5 flex-1 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-400" />
          Recommended SRE Actions
        </h3>
        ...
      </div>
      */}
    </div>
  );
};

export default RewindAiDiagnosisPanel;
