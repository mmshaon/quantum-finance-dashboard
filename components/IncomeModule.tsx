import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Tag, Plus, 
  Trash2, Edit3, BarChart3, PieChart as PieIcon, Layers, 
  Search, Filter, ChevronDown, CheckCircle2, Paperclip, 
  X, Image as ImageIcon, ArrowUpRight, ArrowDownRight, Activity,
  ShieldCheck, MoreHorizontal, AlertCircle, Zap, Globe
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { mockDb } from '../store';
import { useRipple } from '../App';
import { IncomeRecord } from '../types';

type ViewState = 'LIST' | 'ADD' | 'ANALYTICS';
const INITIAL_CATEGORIES = ['Services', 'Consulting', 'Partnership', 'Licensing', 'Dividends'];
const COLORS = ['#00FFA3', '#00D4FF', '#FFD500', '#A855F7', '#FF6EC7'];

const IncomeModule: React.FC = () => {
  const ripple = useRipple();
  const [view, setView] = useState<ViewState>('LIST');
  const [records] = useState<IncomeRecord[]>(mockDb.income);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 spectrum-income">
      {/* Dynamic Spectrum Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-gradient-to-br from-[#00FFA3]/10 to-transparent p-12 rounded-[56px] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <TrendingUp size={180} />
        </div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-[#00FFA3] shadow-[0_0_15px_#00FFA3] animate-pulse" />
             <span className="text-[10px] font-black text-[#00FFA3] uppercase tracking-[0.5em]">Revenue_Engine_Core</span>
          </div>
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Yield_Log</h2>
        </div>
        
        <div className="flex flex-wrap gap-4 relative z-10 w-full lg:w-auto">
          <nav className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 flex-1 lg:flex-none">
            {['LIST', 'ANALYTICS'].map(v => (
              <button key={v} onClick={() => setView(v as ViewState)} className={`flex-1 lg:flex-none px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === v ? 'bg-white/10 text-white shadow-xl' : 'text-white/30 hover:text-white/60'}`}>{v}</button>
            ))}
          </nav>
          <button onMouseDown={ripple} onClick={() => setView('ADD')} className="flex-1 lg:flex-none px-10 py-4 bg-[#00FFA3] text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,255,163,0.3)]">New_Inflow</button>
        </div>
      </header>

      {view === 'LIST' && (
        <section className="space-y-10">
           {/* High-Impact Stat Nodes */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="atomic-glass p-10 rounded-[56px] border-white/5 bg-gradient-to-tr from-[#00FFA3]/5 to-transparent">
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Aggregate_Yield_2024</p>
                 <p className="text-5xl font-black text-[#00FFA3] mono italic tracking-tighter">$15.4M</p>
                 <div className="mt-6 flex items-center gap-2 text-[#00FFA3] text-[10px] font-black uppercase tracking-widest">
                    <ArrowUpRight size={14}/> +22.4% vs Last Cycle
                 </div>
              </div>
              <div className="atomic-glass p-10 rounded-[56px] border-white/5">
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Active_Subscriptions</p>
                 <p className="text-5xl font-black text-white mono italic tracking-tighter">84_NODES</p>
              </div>
           </div>

           {/* Inflow Grid with Vibrant Accents */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {records.map(r => (
                <article key={r.id} className="atomic-glass p-10 rounded-[56px] border-white/5 group hover:border-[#00FFA3]/40 transition-all relative overflow-hidden flex flex-col justify-between h-[450px]">
                   <div>
                      <div className="flex justify-between items-start mb-12">
                         <div className="w-16 h-16 rounded-[28px] bg-[#00FFA3]/10 text-[#00FFA3] flex items-center justify-center border border-[#00FFA3]/20 shadow-xl group-hover:scale-110 transition-transform">
                            <ArrowUpRight size={32} />
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mono">{r.id}</span>
                            <div className="mt-2 px-3 py-1 bg-[#00FFA3]/10 border border-[#00FFA3]/20 rounded-full text-[8px] font-black text-[#00FFA3] uppercase tracking-widest">Verified_Sync</div>
                         </div>
                      </div>
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-glow transition-all">{r.source}</h4>
                      <p className="text-[10px] font-black text-[#00FFA3] uppercase tracking-[0.4em] mt-3">{r.category}</p>
                   </div>
                   
                   <div className="pt-10 border-t border-white/5 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Inflow_Valuation</p>
                        <p className="text-4xl font-black text-white mono italic tracking-tighter text-glow">+${r.amount.toLocaleString()}</p>
                      </div>
                      <button className="p-4 rounded-2xl bg-white/5 text-white/20 hover:text-[#00FFA3] transition-all hover:bg-white/10"><Globe size={24}/></button>
                   </div>
                </article>
              ))}
           </div>
        </section>
      )}

      {view === 'ANALYTICS' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in-95 duration-500">
           <div className="lg:col-span-8 atomic-glass p-12 rounded-[64px] border-white/10 h-[550px]">
              <div className="flex justify-between items-center mb-12">
                 <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] flex items-center gap-3"><BarChart3 size={18} className="text-[#00FFA3]"/> Inflow_Velocity_Analysis</h3>
                 <div className="px-5 py-2.5 bg-[#00FFA3]/10 border border-[#00FFA3]/20 rounded-2xl text-[10px] font-black text-[#00FFA3] uppercase tracking-widest animate-pulse">Live_Feed_Linked</div>
              </div>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={[
                  { name: 'Jan', val: 45000 }, { name: 'Feb', val: 52000 }, { name: 'Mar', val: 48000 }, 
                  { name: 'Apr', val: 72000 }, { name: 'May', val: 89000 }, { name: 'Jun', val: 94000 }
                ]}>
                   <defs>
                      <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FFA3" stopOpacity={0.4}/><stop offset="95%" stopColor="#00FFA3" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                   <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} />
                   <YAxis stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} tickFormatter={(v)=>`$${v/1000}k`} />
                   <Tooltip contentStyle={{ backgroundColor: '#05070a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', fontWeight: 'bold' }} />
                   <Area type="monotone" dataKey="val" stroke="#00FFA3" strokeWidth={5} fill="url(#yieldGrad)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>

           <div className="lg:col-span-4 atomic-glass p-12 rounded-[64px] border-white/10 h-[550px] flex flex-col">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] mb-12 flex items-center gap-3"><PieIcon size={18} className="text-[#A855F7]"/> Sector_Yield_Weight</h3>
              <div className="flex-1 flex flex-col justify-center">
                 <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                       <Pie data={[{name:'Ops',value:400},{name:'Lic',value:600},{name:'Div',value:200}]} innerRadius={80} outerRadius={110} paddingAngle={10} dataKey="value">
                          {COLORS.map((c, i) => <Cell key={i} fill={c} stroke="none" />)}
                       </Pie>
                       <Tooltip contentStyle={{ backgroundColor: '#05070a', border: 'none', borderRadius: '16px' }} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                 {['Operations', 'Licensing', 'Dividends'].map((l, i) => (
                    <div key={l} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                       <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{l}</span>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      )}
    </div>
  );
};

export default IncomeModule;