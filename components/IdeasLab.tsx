import React, { useState, useMemo, useEffect } from 'react';
import { 
  Lightbulb, Rocket, Target, BarChart3, ShieldAlert, 
  Plus, Search, ArrowRight, Brain, Globe, Zap, 
  Activity, Layers, FileText, DollarSign, Clock,
  CheckCircle2, XCircle, ChevronRight, Sparkles,
  PieChart as PieIcon, TrendingUp, Info, ListChecks,
  AlertTriangle, BarChart, GANTTChartSquare, Coins,
  Scale, Briefcase, Microscope, Workflow
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell, 
  BarChart as ReBarChart, Bar, Legend 
} from 'recharts';
import { GoogleGenAI, Type } from '@google/genai';
import { useRipple } from '../App';

type LabView = 'DASHBOARD' | 'WIZARD' | 'PLAN' | 'BUDGET' | 'SCHEDULE' | 'MONITOR';

const COLORS = ['#00D4FF', '#00FFA3', '#A855F7', '#FF6EC7', '#FFD500'];

const IdeasLab: React.FC = () => {
  const ripple = useRipple();
  const [view, setView] = useState<LabView>('DASHBOARD');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rawIdea, setRawIdea] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);

  // AI ANALYSIS & GENERATION ENGINE
  const runSynthesis = async () => {
    if (!rawIdea) return;
    setIsAnalyzing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Act as Yusra, an expert business strategist. Analyze this idea: "${rawIdea}". Provide a structured implementation plan in JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              feasibilityScore: { type: Type.NUMBER },
              complexity: { type: Type.STRING },
              marketPotential: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              swot: {
                type: Type.OBJECT,
                properties: {
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  threats: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              budget: {
                type: Type.OBJECT,
                properties: {
                  capex: { type: Type.NUMBER },
                  opex: { type: Type.NUMBER },
                  contingency: { type: Type.NUMBER },
                  roiYears: { type: Type.NUMBER }
                }
              },
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phase: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    milestone: { type: Type.STRING }
                  }
                }
              },
              insights: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setAnalysisResult(data);
      setActiveIdeaId(`NODE-${Math.random().toString(36).substr(2, 5).toUpperCase()}`);
      setView('PLAN');
    } catch (err) {
      console.error("Neural Link Error:", err);
      alert("Synthesis Failed: Consult Console Logs");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. HEADER PROTOCOL */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/[0.02] p-8 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-[#00D4FF] shadow-[0_0_10px_#00D4FF] animate-pulse" />
             <span className="text-[10px] font-black text-[#00D4FF] uppercase tracking-[0.4em]">Strategic_Synthesis_Core</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Ideas_Lab</h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <nav className="flex bg-white/5 p-1 rounded-2xl border border-white/10 overflow-hidden">
            {['DASHBOARD', 'PLAN', 'BUDGET', 'SCHEDULE', 'MONITOR'].map((v) => (
              <button 
                key={v}
                onClick={() => setView(v as LabView)}
                disabled={!analysisResult && v !== 'DASHBOARD' && v !== 'WIZARD'}
                className={`px-5 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${view === v ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40 disabled:opacity-0'}`}
              >
                {v}
              </button>
            ))}
          </nav>
          <button onMouseDown={ripple} onClick={() => setView('WIZARD')} className="px-8 py-4 bg-[#00D4FF] text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_40px_rgba(0,212,255,0.3)] flex items-center gap-3">
            <Plus size={16} /> New Concept
          </button>
        </div>
      </header>

      {/* VIEW: DASHBOARD */}
      {view === 'DASHBOARD' && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
           <article onClick={() => setView('WIZARD')} className="atomic-glass p-10 rounded-[56px] border-dashed border-white/10 hover:border-[#00D4FF]/50 flex flex-col items-center justify-center text-center space-y-6 group transition-all h-[400px] cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#00D4FF] group-hover:bg-[#00D4FF]/10 transition-all">
                <Brain size={40} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-white uppercase italic">Incept_New_Vision</h4>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Neural translation of concepts into roadmaps</p>
              </div>
           </article>

           <ActiveConceptCard 
              id="QN-942" 
              title="Quantum API Nexus" 
              stage="ANALYSIS_COMPLETE" 
              feasibility={0.88} 
              onSelect={() => setView('PLAN')}
           />
           <ActiveConceptCard 
              id="VX-101" 
              title="Spectral UI Engine" 
              stage="IMPLEMENTATION" 
              feasibility={0.94} 
              onSelect={() => setView('MONITOR')}
           />
        </section>
      )}

      {/* VIEW: WIZARD */}
      {(view === 'WIZARD' || (view === 'DASHBOARD' && !activeIdeaId && false)) && (
        <section className="atomic-glass p-12 rounded-[56px] border-[#00D4FF]/20 space-y-12 animate-in zoom-in-95 duration-500 relative overflow-hidden">
           <div className="space-y-4 relative z-10">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">1. Neural_Ingestion_Protocol</h3>
              <textarea 
                value={rawIdea}
                onChange={(e) => setRawIdea(e.target.value)}
                placeholder="DESCRIBE_YOUR_VISION_IN_DETAIL... (Industry, Problem, Solution, Scale)"
                className="w-full bg-white/5 border border-white/10 p-10 rounded-[40px] text-xl font-black text-white uppercase tracking-tighter h-72 outline-none focus:border-[#00D4FF]/40 transition-all resize-none placeholder:text-white/5"
              />
           </div>
           
           <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4 text-white/20 italic">
                 <Sparkles size={24} className="text-[#00D4FF] animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Yusra_Intelligence_Online</span>
              </div>
              <button 
                onClick={runSynthesis}
                disabled={isAnalyzing || !rawIdea}
                className={`px-12 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center gap-4 ${isAnalyzing ? 'bg-white/10 text-white/20 cursor-wait' : 'bg-[#00D4FF] text-black hover:scale-105 shadow-[0_0_50px_rgba(0,212,255,0.4)]'}`}
              >
                {isAnalyzing ? <><Activity size={20} className="animate-spin" /> Processing_Strategic_Nodes</> : <><Rocket size={20}/> Initialize_Synthesis</>}
              </button>
           </div>
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00D4FF]/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        </section>
      )}

      {/* VIEW: PLAN (STRATEGIC OVERVIEW) */}
      {view === 'PLAN' && analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-8 duration-700">
           <div className="lg:col-span-4 space-y-8">
              <div className="atomic-glass p-10 rounded-[56px] border-white/10 flex flex-col items-center justify-center text-center">
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-8">FEASIBILITY_INDEX</p>
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                       <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * analysisResult.feasibilityScore)} className="text-[#00FFA3] transition-all duration-[2000ms]" />
                    </svg>
                    <span className="absolute text-5xl font-black text-white italic">{(analysisResult.feasibilityScore * 100).toFixed(0)}%</span>
                 </div>
                 <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[8px] text-white/20 uppercase font-black">Risk</p>
                       <p className={`text-xs font-black uppercase ${analysisResult.riskLevel.includes('High') ? 'text-rose-500' : 'text-[#00FFA3]'}`}>{analysisResult.riskLevel}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[8px] text-white/20 uppercase font-black">Market</p>
                       <p className="text-xs font-black uppercase text-[#00D4FF]">{analysisResult.marketPotential}</p>
                    </div>
                 </div>
              </div>

              <div className="atomic-glass p-8 rounded-[48px] border-white/5 space-y-6">
                 <h3 className="text-xs font-black text-[#00D4FF] uppercase tracking-[0.4em] flex items-center gap-2">
                    <Zap size={16}/> Yusra_Insights
                 </h3>
                 <div className="space-y-4">
                    {analysisResult.insights.map((insight: string, i: number) => (
                      <div key={i} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-[#00D4FF]/30 transition-all">
                         <div className="w-2 h-2 rounded-full bg-[#00D4FF] mt-1.5 shrink-0 group-hover:animate-ping" />
                         <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest leading-relaxed">{insight}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="lg:col-span-8 space-y-8">
              <div className="atomic-glass p-12 rounded-[56px] border-white/10 space-y-8">
                 <div className="flex justify-between items-start">
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{analysisResult.title}</h3>
                       <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] mt-2">Executive_Summary_Node</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-white/20">
                       <FileText size={24}/>
                    </div>
                 </div>
                 <p className="text-sm text-white/60 uppercase leading-relaxed tracking-wider italic bg-white/[0.01] p-6 rounded-3xl border border-white/5 border-l-4 border-l-[#00D4FF]">
                    {analysisResult.summary}
                 </p>

                 <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                    <SWOTColumn label="STRENGTHS" items={analysisResult.swot.strengths} color="#00FFA3" />
                    <SWOTColumn label="WEAKNESSES" items={analysisResult.swot.weaknesses} color="#FF6EC7" />
                    <SWOTColumn label="OPPORTUNITIES" items={analysisResult.swot.opportunities} color="#00D4FF" />
                    <SWOTColumn label="THREATS" items={analysisResult.swot.threats} color="#FFD500" />
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* VIEW: BUDGET (COST ESTIMATION) */}
      {view === 'BUDGET' && analysisResult && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
           <div className="lg:col-span-4 space-y-8">
              <div className="atomic-glass p-10 rounded-[56px] border-white/10 flex flex-col justify-center space-y-8 h-full">
                 <div>
                    <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Total_Capital_Req</p>
                    <p className="text-6xl font-black text-white mono italic">${(analysisResult.budget.capex + analysisResult.budget.opex).toLocaleString()}</p>
                 </div>
                 <div className="space-y-4">
                    <BudgetStatic label="CapEx (Initial)" value={analysisResult.budget.capex} color="#00D4FF" />
                    <BudgetStatic label="OpEx (Monthly)" value={analysisResult.budget.opex} color="#A855F7" />
                    <BudgetStatic label="Contingency (15%)" value={analysisResult.budget.contingency} color="#FFD500" />
                 </div>
              </div>
           </div>
           <div className="lg:col-span-8 atomic-glass p-12 rounded-[56px] border-white/10 space-y-12">
              <div className="flex justify-between items-center">
                 <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">ROI_Projection_Matrix</h3>
                 <div className="flex gap-4">
                    <div className="px-4 py-2 bg-[#00FFA3]/10 border border-[#00FFA3]/20 rounded-xl text-[10px] font-black text-[#00FFA3] uppercase italic">Payback: {analysisResult.budget.roiYears} Years</div>
                 </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                 <AreaChart data={[
                   { name: 'Y1', burn: analysisResult.budget.capex + (analysisResult.budget.opex * 12), yield: analysisResult.budget.opex * 4 },
                   { name: 'Y2', burn: analysisResult.budget.opex * 12, yield: analysisResult.budget.opex * 14 },
                   { name: 'Y3', burn: analysisResult.budget.opex * 10, yield: analysisResult.budget.opex * 24 },
                   { name: 'Y4', burn: analysisResult.budget.opex * 8, yield: analysisResult.budget.opex * 40 },
                 ]}>
                    <defs>
                       <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00FFA3" stopOpacity={0.3}/><stop offset="95%" stopColor="#00FFA3" stopOpacity={0}/></linearGradient>
                       <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF6EC7" stopOpacity={0.1}/><stop offset="95%" stopColor="#FF6EC7" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} />
                    <YAxis stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} tickFormatter={(v)=>`$${v/1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#05070a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px' }} />
                    <Area type="monotone" dataKey="yield" stroke="#00FFA3" strokeWidth={4} fill="url(#yieldGrad)" />
                    <Area type="monotone" dataKey="burn" stroke="#FF6EC7" strokeWidth={2} strokeDasharray="5 5" fill="url(#burnGrad)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </section>
      )}

      {/* VIEW: SCHEDULE (GANTT ROADMAP) */}
      {view === 'SCHEDULE' && analysisResult && (
        <section className="atomic-glass p-12 rounded-[56px] border-white/10 space-y-12 animate-in slide-in-from-left-8 duration-700 overflow-hidden relative">
           <div className="flex justify-between items-center relative z-10">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">Temporal_Implementation_Nodes</h3>
              <div className="flex gap-4">
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2"><Clock size={14}/> Total Est: 14 Months</span>
              </div>
           </div>

           <div className="space-y-12 relative z-10">
              {analysisResult.roadmap.map((phase: any, i: number) => (
                <div key={i} className="flex gap-10 group">
                   <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-[#00D4FF] italic text-xl group-hover:bg-[#00D4FF] group-hover:text-black transition-all">
                        0{i+1}
                      </div>
                      <div className="w-[1px] h-full bg-white/10 mt-4 group-last:hidden" />
                   </div>
                   <div className="flex-1 pb-12 space-y-6">
                      <div className="flex justify-between items-end">
                         <div>
                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">{phase.phase}</h4>
                            <p className="text-[10px] font-black text-[#00D4FF] uppercase tracking-widest mt-1">Duration: {phase.duration}</p>
                         </div>
                         <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[9px] font-black text-white/40 uppercase italic flex items-center gap-2">
                           <Target size={14} className="text-[#FFD500]"/> {phase.milestone}
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {phase.tasks.map((task: string, j: number) => (
                           <div key={j} className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-4 hover:border-white/20 transition-all">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#00FFA3]"><ListChecks size={16}/></div>
                              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{task}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              ))}
           </div>
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#A855F7]/5 blur-[150px] rounded-full -mr-[400px] -mt-[400px] pointer-events-none" />
        </section>
      )}

      {/* VIEW: MONITOR (PROGRESS & AI AGENT) */}
      {view === 'MONITOR' && analysisResult && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in-95 duration-700">
           <div className="lg:col-span-8 space-y-8">
              <div className="atomic-glass p-10 rounded-[56px] border-white/10">
                 <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] mb-12 flex items-center gap-3"><Activity size={18} className="text-[#00FFA3]"/> Implementation_Health_Pulse</h3>
                 <div className="space-y-12">
                    <MonitoringGauge label="Technical Integrity" percent={82} color="#00D4FF" />
                    <MonitoringGauge label="Budget Retention" percent={94} color="#00FFA3" />
                    <MonitoringGauge label="Market Readiness" percent={45} color="#FFD500" />
                    <MonitoringGauge label="Timeline Accuracy" percent={68} color="#FF6EC7" />
                 </div>
              </div>

              <div className="atomic-glass p-10 rounded-[56px] border-white/10 space-y-8">
                 <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-3"><Workflow size={18} className="text-[#A855F7]"/> Critical_Path_Activity</h3>
                 <div className="space-y-4">
                    <ActivityLog 
                      icon={Sparkles} 
                      title="Neural Core Initialized" 
                      time="02H AGO" 
                      desc="System has synced with the primary concept node. Verification hash locked." 
                      color="#00D4FF" 
                    />
                    <ActivityLog 
                      icon={Scale} 
                      title="Budget Allocation Shift" 
                      time="05H AGO" 
                      desc="Yusra detected 4% variance in server allocation. Auto-rescheduling applied." 
                      color="#FFD500" 
                    />
                    <ActivityLog 
                      icon={Microscope} 
                      title="Market Scan Update" 
                      time="12H AGO" 
                      desc="Competitor identified in the Fin-Tech sector. Adjusting Phase 2 priorities." 
                      color="#A855F7" 
                    />
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="atomic-glass p-10 rounded-[56px] border-[#00FFA3]/20 bg-[#00FFA3]/5 space-y-8 h-full">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-[#00FFA3]/10 text-[#00FFA3] rounded-2xl border border-[#00FFA3]/20"><ShieldAlert size={28}/></div>
                    <h3 className="text-xl font-black text-white uppercase italic">Yusra_Guardian</h3>
                 </div>
                 <p className="text-[11px] text-white/60 font-medium uppercase leading-relaxed tracking-wider italic p-6 bg-black/20 rounded-3xl border border-white/5">
                    "Founder Hasan, I am currently monitoring the 'Quantum API Nexus' lifecycle. Technical feasibility remains optimal at 88%. Recommend accelerating the 'Architecture Finalization' task to mitigate potential Q4 bottleneck."
                 </p>
                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-[#00FFA3] uppercase tracking-[0.3em]">PROACTIVE_ALERTS</p>
                    <AlertNode icon={TrendingUp} label="Competitor Entry" desc="Alpha-Corp launched similar API." color="#FFD500" />
                    <AlertNode icon={Coins} label="Cost Optimization" desc="Save 12% on cloud nodes." color="#00D4FF" />
                 </div>
                 <button className="w-full py-5 bg-[#00FFA3] text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-105 transition-all mt-auto flex items-center justify-center gap-3">
                   <Plus size={16}/> Acknowledge & Execute
                 </button>
              </div>
           </div>
        </section>
      )}
    </div>
  );
};

// HELPER COMPONENTS
const ActiveConceptCard: React.FC<{ id: string, title: string, stage: string, feasibility: number, onSelect: () => void }> = ({ id, title, stage, feasibility, onSelect }) => (
  <article onClick={onSelect} className="atomic-glass p-10 rounded-[56px] border-white/5 hover:border-[#00D4FF]/40 transition-all group relative overflow-hidden cursor-pointer h-[400px] flex flex-col">
    <div className="flex justify-between items-start mb-10">
      <div className="p-5 bg-[#00D4FF]/10 text-[#00D4FF] rounded-3xl border border-[#00D4FF]/20 group-hover:scale-110 transition-transform shadow-xl">
        <Rocket size={32} />
      </div>
      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{id}</span>
    </div>
    <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">{title}</h4>
    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 w-fit mb-auto">
      <span className="text-[8px] font-black text-[#00FFA3] uppercase tracking-widest">{stage}</span>
    </div>
    <div className="pt-8 border-t border-white/5 flex justify-between items-end">
       <div>
         <p className="text-[9px] font-black text-white/20 uppercase mb-2">Feasibility</p>
         <p className="text-3xl font-black text-white mono italic">{(feasibility * 100).toFixed(0)}%</p>
       </div>
       <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 group-hover:text-[#00D4FF] transition-all"><ChevronRight size={24}/></div>
    </div>
  </article>
);

const SWOTColumn: React.FC<{ label: string, items: string[], color: string }> = ({ label, items, color }) => (
  <div className="space-y-4">
     <h5 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4" style={{ color }}>{label}</h5>
     <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-[10px] text-white/40 font-black uppercase tracking-widest leading-relaxed">
             <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
             {item}
          </div>
        ))}
     </div>
  </div>
);

const BudgetStatic: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div className="p-5 bg-white/[0.03] border border-white/5 rounded-3xl flex justify-between items-center group hover:border-white/20 transition-all">
     <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</span>
     <span className="text-xl font-black text-white mono italic" style={{ color }}>${value.toLocaleString()}</span>
  </div>
);

const MonitoringGauge: React.FC<{ label: string, percent: number, color: string }> = ({ label, percent, color }) => (
  <div className="space-y-4">
     <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{label}</span>
        <span className="text-xl font-black text-white mono italic" style={{ color }}>{percent}%</span>
     </div>
     <div className="h-2 w-full bg-white/5 rounded-full p-0.5 border border-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-[2000ms] shadow-lg" style={{ width: `${percent}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
     </div>
  </div>
);

const ActivityLog: React.FC<any> = ({ icon: Icon, title, time, desc, color }) => (
  <div className="flex gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-[32px] hover:border-white/20 transition-all group">
     <div className="p-4 rounded-2xl bg-white/5 text-white/20 group-hover:scale-110 transition-transform" style={{ color }}>
        <Icon size={24} />
     </div>
     <div className="space-y-1">
        <div className="flex justify-between items-center">
           <h4 className="text-sm font-black text-white uppercase italic">{title}</h4>
           <span className="text-[8px] font-black text-white/20 uppercase mono">{time}</span>
        </div>
        <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">{desc}</p>
     </div>
  </div>
);

const AlertNode: React.FC<any> = ({ icon: Icon, label, desc, color }) => (
  <div className="flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
     <div className="p-2 rounded-lg bg-white/5" style={{ color }}><Icon size={16}/></div>
     <div>
        <p className="text-[10px] font-black text-white uppercase">{label}</p>
        <p className="text-[8px] text-white/30 uppercase tracking-widest">{desc}</p>
     </div>
  </div>
);

export default IdeasLab;