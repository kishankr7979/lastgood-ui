import React, { useState } from 'react';
import { History, Sparkles, List, Clock, Blocks, Server } from 'lucide-react';
import SandboxTimeline from '../components/sandbox/SandboxTimeline';
import AiDiagnosisPanel from '../components/sandbox/AiDiagnosisPanel';
import SandboxServices from '../components/sandbox/SandboxServices';
import SandboxIntegrations from '../components/sandbox/SandboxIntegrations';
import SandboxTelemetry from '../components/sandbox/SandboxTelemetry';
import { mockIncident, mockTimelineEvents, mockAiDiagnosis, initialMockServices } from '../components/sandbox/MockData';

const Sandbox = () => {
  const [activeTab, setActiveTab] = useState('rewind');
  const [selectedEventId, setSelectedEventId] = useState(mockTimelineEvents[2].id);
  const [mockServices, setMockServices] = useState(initialMockServices);

  const tabs = [
    { id: 'rewind', label: 'AI Incident Rewind', icon: Clock },
    { id: 'telemetry', label: 'Telemetry Feed', icon: List },
    { id: 'ingestions', label: 'Ingestion Channels', icon: Blocks },
    { id: 'services', label: 'Services & Keys', icon: Server },
  ];

  return (
    <div className="flex min-h-screen font-sans selection:bg-accent/30 selection:text-white bg-grid">
      {/* Background gradients */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[128px] pointer-events-none z-0"></div>
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/[0.05] bg-black/45 backdrop-blur-2xl flex flex-col fixed h-full z-50">
        <div className="p-6 pb-3">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 shadow-[0_0_15px_rgba(45,212,191,0.15)] group-hover:shadow-[0_0_25px_rgba(45,212,191,0.3)] transition-all duration-300 group-hover:scale-105 overflow-hidden">
               <div className="absolute inset-0 bg-accent/20 animate-[spin_3s_linear_infinite] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <History className="h-4 w-4 text-accent relative z-10 group-hover:-rotate-45 transition-transform duration-500" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hover:text-white">
              Last<span className="text-accent font-mono italic opacity-90 tracking-tighter">Good</span>
            </span>
          </div>
        </div>

        <div className="px-4 py-2.5 border-b border-white/[0.05] mb-2 bg-black/10">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-accent/20 bg-accent/5 shadow-[0_0_15px_rgba(45,212,191,0.05)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white tracking-wide uppercase leading-none flex items-center gap-1">
                Diagnostic AI
                <Sparkles size={8} className="text-accent fill-accent/45 animate-pulse" />
              </span>
              <span className="text-[9px] text-accent font-semibold mt-0.5 leading-none">Agent Online</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-1">
           <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 mt-2 ml-2">AI Diagnostic Suite</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-medium transition-all group relative overflow-hidden ${
                     isActive
                        ? "bg-accent/10 border border-accent/20 text-accent shadow-[0_0_15px_rgba(45,212,191,0.05)]"
                        : "text-text-secondary hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
               >
                  <Icon size={16} className={isActive ? "text-accent" : "text-text-muted group-hover:text-white"} />
                  <span className="relative z-10">{tab.label}</span>
               </button>
            );
          })}
        </nav>

        {/* Footer Organization & Info */}
        <div className="p-4 border-t border-white/[0.05] bg-black/10">
          <div className="surface p-2 rounded-xl flex items-center gap-3 border border-white/5 hover:border-white/10 transition-colors cursor-pointer" title="This is a Sandbox Environment">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-blue-500 flex items-center justify-center shadow-lg uppercase font-bold text-white text-xs">
              S
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-[13px] font-bold text-white truncate leading-tight">
                Sandbox Environment
              </span>
              <span className="text-[10px] text-accent leading-tight mt-0.5">Interactive Demo</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 relative min-w-0 bg-transparent">
         <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
         <div className="p-4">
           {activeTab === 'telemetry' && (
            <SandboxTelemetry events={mockTimelineEvents} />
         )}
         
         {activeTab === 'rewind' && (
            <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 h-full animate-fade-in">
               {/* Timeline Section */}
               <div className="w-full md:w-1/3 flex flex-col h-full">
                  <div className="mb-4">
                     <h2 className="text-xl font-bold text-white">Event Timeline</h2>
                     <p className="text-sm text-text-muted mt-1">Select an event to view AI analysis.</p>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                     <SandboxTimeline 
                       events={mockTimelineEvents} 
                       selectedEventId={selectedEventId}
                       onSelectEvent={setSelectedEventId} 
                     />
                  </div>
               </div>

               {/* AI Diagnosis Section */}
               <div className="w-full md:w-2/3 flex flex-col h-[600px] md:h-auto md:min-h-[700px]">
                  <AiDiagnosisPanel 
                     incident={mockIncident} 
                     diagnosis={mockAiDiagnosis} 
                  />
               </div>
            </div>
         )}

         {activeTab === 'ingestions' && (
            <SandboxIntegrations />
         )}

         {activeTab === 'services' && (
            <SandboxServices 
               services={mockServices} 
               setServices={setMockServices} 
            />
         )}
         </div>
      </main>
    </div>
  );
};

export default Sandbox;
