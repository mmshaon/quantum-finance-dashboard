import React, { useState, useMemo } from 'react';
import { 
  UserCircle, Target, TrendingUp, Wallet, ArrowRight, 
  ShieldAlert, Sparkles, Gem, Activity, CreditCard,
  Lock, EyeOff, Diamond, ShieldCheck, Filter, Search, 
  ChevronDown, X, Plus, Trash2, Edit3, Save, 
  Key, Shield, Zap, List, LayoutGrid, AlertCircle,
  FileText, ArrowUpRight, ArrowDownRight, Fingerprint
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell, 
  BarChart, Bar, Legend, RadialBarChart, RadialBar 
} from 'recharts';
import { mockDb } from '../store';
import { useRipple } from '../App';

type PersonalView = 'DASHBOARD' | 'LEDGER' | 'BUDGET' | 'GOALS' | 'NOTES';

const COLORS = ['#6366F1', '#00D4FF', '#A855F7', '#00FFA3', '#FF6EC7'];

const PersonalModule: React.FC = () => {
  const ripple = useRipple();
  const [view, setView] = useState<PersonalView>('DASHBOARD');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [isNotesLocked, setIsNotesLocked] = useState(true);
  
  // Local Personal Data
  const [personalTransactions, setPersonalTransactions] = useState([
    { id: 'PT-01', name: 'Dividend Yield Alpha', category: 'Investment', amount: 45000, type: 'in', date: '2024-05-18' },
    { id: 'PT-02', name: 'Offshore Server Rent', category: 'Tech', amount: 1200, type: 'out', date: '2024-05-20' },
    { id: 'PT-03', name: 'Strategic Reserve Sync', category: 'Savings', amount: 50000, type: 'in', date: '2024-05-22' },
  ]);

  const [personalGoals, setPersonalGoals] = useState(mockDb.personalGoals);
  const [notes, setNotes] = useState([
    { id: 1, title: 'Private Vault Keys', content: 'Recovery seeds: [ENCRYPTED_SHA256]', date: '2024-05-01' },
    { id: 2, title: 'Wealth Strategy 2025', content: 'Focus on neural equity and land acquisition.', date: '2024-05-15' },
  ]);

  // Analytics
  const personalStats = useMemo(() => {
    const totalIn = personalTransactions.filter(t => t.type === 'in').reduce((s, t) => s + t.amount, 0);
    const totalOut = personalTransactions.filter(t => t.type === 'out').reduce((s, t) => s + t.amount, 0);
    const netWealth = 15248000 + (totalIn - totalOut);
    
    const budgetData = [
      { name: 'Lifestyle', used: 4500, limit: 10000 },
      { name: 'Investments', used: 85000, limit: 100000 },
      { name: 'Tech Ops', used: 12000, limit: 15000 },
    ];

    return { totalIn, totalOut, netWealth, budgetData };
  }, [personalTransactions]);

  const filteredLedger = personalTransactions.filter(t => 
    t.name.toLowerCase().includes(ledgerSearch.toLowerCase()) || 
    t.category.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* 1. PRIVATE HEADER PROTOCOL */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/[0.02] p-8 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-[#6366F1] shadow-[0_0_10px_#6366F1] animate-pulse" />
             <span className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.4em]">Private_Yeaf_Vault_v4</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Personal_Wealth_Core</h2>
        </div>
        
        <nav className="flex bg-white/5 p-1 rounded-2xl border border-white/10 flex-wrap">
          <button onClick={() => setView('DASHBOARD')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'DASHBOARD' ? 'bg-[#6366F1] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>Deck</button>
          <button onClick={() => setView('LEDGER')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'LEDGER' ? 'bg-[#6366F1] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>Ledger</button>
          <button onClick={() => setView('BUDGET')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'BUDGET' ? 'bg-[#6366F1] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>Budget</button>
          <button onClick={() => setView('GOALS')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'GOALS' ? 'bg-[#6366F1] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>Milestones</button>
          <button onClick={() => setView('NOTES')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'NOTES' ? 'bg-[#6366F1] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>Neural_Notes</button>
        </nav>
      </header>

      {/* 2. VIEW: DASHBOARD */}
      {view === 'DASHBOARD' && (
        <section className="space-y-12 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 atomic-glass p-12 rounded-[56px] border-[#6366F1]/20 bg-gradient-to-br from-[#6366F1]/10 to-transparent relative overflow-hidden flex flex-col justify-between h-[450px]">
               <div className="flex justify-between items-start z-10">
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/10 text-[#6366F1]">
                    <Gem size={40} />
                  </div>
                  <div className="flex gap-4">
                    <div className="px-4 py-1.5 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 text-[#00FFA3] text-[9px] font-black uppercase tracking-widest">Growth Optimal</div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/40"><ShieldCheck size={20}/></div>
                  </div>
               </div>
               <div className="z-10">
                  <p className="text-[12px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Aggregate_Net_Capital</p>
                  <p className="text-7xl font-black text-white italic tracking-tighter mono">${personalStats.netWealth.toLocaleString()}</p>
                  <div className="mt-8 flex gap-8">
                     <div>
                        <p className="text-[10px] font-black text-white/20 uppercase mb-1">Monthly Yield</p>
                        <p className="text-xl font-black text-[#00FFA3] mono">+${personalStats.totalIn.toLocaleString()}</p>
                     </div>
                     <div className="w-[1px] h-10 bg-white/10" />
                     <div>
                        <p className="text-[10px] font-black text-white/20 uppercase mb-1">Monthly Burn</p>
                        <p className="text-xl font-black text-rose-500 mono">-${personalStats.totalOut.toLocaleString()}</p>
                     </div>
                  </div>
               </div>
               <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#6366F1]/10 blur-[120px] rounded-full" />
            </div>

            <div className="lg:col-span-4 atomic-glass p-10 rounded-[48px] border-white/10 space-y-8 flex flex-col justify-center">
               <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">Personal_Asset_Weight</h3>
               <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={[
                      { name: 'Liquid', value: 30 },
                      { name: 'Investments', value: 45 },
                      { name: 'Digital', value: 25 },
                    ]} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                      {COLORS.map((c, i) => <Cell key={i} fill={c} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#05070a', border: 'none', borderRadius: '16px' }} />
                  </PieChart>
               </ResponsiveContainer>
               <div className="grid grid-cols-2 gap-4">
                  {['Liquid', 'Investments', 'Digital'].map((label, i) => (
                    <div key={label} className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                       <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. VIEW: LEDGER (TRANSACTIONS) */}
      {view === 'LEDGER' && (
        <section className="space-y-8 animate-in slide-in-from-right-4 duration-500">
           <div className="flex flex-wrap gap-4 items-center justify-between bg-white/[0.03] p-6 rounded-[32px] border border-white/5">
              <div className="flex items-center gap-6 flex-1 max-w-xl">
                 <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex-1">
                   <Search size={16} className="text-white/20" />
                   <input value={ledgerSearch} onChange={e => setLedgerSearch(e.target.value)} placeholder="QUERY_PRIVATE_LEDGER..." className="bg-transparent border-none outline-none text-[10px] font-black text-white uppercase tracking-widest w-full" />
                 </div>
              </div>
              <button onMouseDown={ripple} className="px-8 py-3 bg-[#6366F1] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center gap-3">
                 <Plus size={16} /> New Entry
              </button>
           </div>

           <div className="atomic-glass rounded-[48px] border-white/5 overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-white/[0.01] text-[10px] font-black uppercase text-white/30 tracking-widest">
                    <tr><th className="p-6">Transaction</th><th className="p-6">Sector</th><th className="p-6">Date</th><th className="p-6 text-right">Valuation</th></tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {filteredLedger.map(t => (
                      <tr key={t.id} className="hover:bg-white/[0.02] transition-all group">
                         <td className="p-6 flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${t.type === 'in' ? 'bg-[#00FFA3]/10 text-[#00FFA3]' : 'bg-rose-500/10 text-rose-500'}`}>
                               {t.type === 'in' ? <ArrowUpRight size={18}/> : <ArrowDownRight size={18}/>}
                            </div>
                            <span className="text-sm font-black text-white uppercase italic">{t.name}</span>
                         </td>
                         <td className="p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">{t.category}</td>
                         <td className="p-6 text-[10px] font-black text-white/20 uppercase">{t.date}</td>
                         <td className={`p-6 text-right font-black mono text-lg ${t.type === 'in' ? 'text-[#00FFA3]' : 'text-rose-500'}`}>
                           {t.type === 'in' ? '+' : '-'}${t.amount.toLocaleString()}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>
      )}

      {/* 4. VIEW: BUDGET PLANNER */}
      {view === 'BUDGET' && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
           <div className="atomic-glass p-10 rounded-[48px] border-white/10 space-y-10">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-3"><Target size={18} className="text-[#6366F1]"/> Sector_Threshold_Matrix</h3>
              <div className="space-y-8">
                 {personalStats.budgetData.map(b => (
                   <div key={b.name} className="space-y-4">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-sm font-black text-white uppercase italic">{b.name}</p>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest">Utilized: ${b.used.toLocaleString()} / ${b.limit.toLocaleString()}</p>
                         </div>
                         <p className="text-lg font-black text-white mono">{Math.round((b.used / b.limit) * 100)}%</p>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                         <div className={`h-full rounded-full transition-all duration-1000 ${ (b.used/b.limit) > 0.8 ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-[#6366F1] shadow-[0_0_10px_#6366f1]'}`} style={{ width: `${(b.used / b.limit) * 100}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="atomic-glass p-10 rounded-[48px] border-white/10 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-48 h-48 rounded-full border-4 border-[#6366F1]/20 p-2 relative">
                 <div className="w-full h-full rounded-full bg-[#6366F1]/5 flex flex-col items-center justify-center">
                    <p className="text-4xl font-black text-white mono">84%</p>
                    <p className="text-[10px] font-black text-white/30 uppercase">Budget Safety</p>
                 </div>
                 <div className="absolute inset-0 border-4 border-[#6366F1] rounded-full border-t-transparent animate-spin duration-3000" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-xl font-black text-white uppercase italic">Optimal_Fiscal_Health</h4>
                 <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">System has identified 12% potential allocation waste in Lifestyle sector. Recommend re-sync.</p>
              </div>
              <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-[#6366F1] hover:text-white transition-all">Optimize Allocations</button>
           </div>
        </section>
      )}

      {/* 5. VIEW: SAVINGS GOALS */}
      {view === 'GOALS' && (
        <section className="space-y-12 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {personalGoals.map(goal => (
                <div key={goal.id} className="atomic-glass p-10 rounded-[48px] border-white/5 group hover:border-[#6366F1]/40 transition-all flex flex-col h-[400px]">
                   <div className="flex justify-between items-start mb-10">
                      <div className="p-5 bg-[#6366F1]/10 text-[#6366F1] rounded-3xl group-hover:scale-110 transition-transform shadow-lg">
                        <Diamond size={32} />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[8px] font-black text-[#6366F1] uppercase">Strategic Target</span>
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">{goal.name}</h4>
                   <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-auto">Target: ${goal.target.toLocaleString()}</p>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Progress</span>
                         <span className="text-xl font-black text-white mono italic">${goal.current.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                         <div className="h-full bg-gradient-to-r from-[#6366F1] to-[#00D4FF] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${(goal.current / goal.target) * 100}%` }} />
                      </div>
                      <p className="text-right text-[10px] font-black text-[#6366F1] mono">{( (goal.current / goal.target) * 100).toFixed(2)}% COMPLETE</p>
                   </div>
                </div>
              ))}
              <button className="atomic-glass p-10 rounded-[48px] border-dashed border-white/10 hover:border-[#6366F1]/50 flex flex-col items-center justify-center text-center space-y-4 group transition-all h-[400px]">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#6366F1] group-hover:bg-[#6366F1]/10 transition-all">
                    <Plus size={32} />
                 </div>
                 <div>
                    <p className="text-xs font-black text-white uppercase italic">Define_New_Milestone</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">Initialize temporal wealth target</p>
                 </div>
              </button>
           </div>
        </section>
      )}

      {/* 6. VIEW: NEURAL NOTES */}
      {view === 'NOTES' && (
        <section className="space-y-8 animate-in slide-in-from-left-4 duration-500">
           {isNotesLocked ? (
             <div className="atomic-glass p-20 rounded-[56px] border-rose-500/20 flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                   <Lock size={48} className="animate-pulse" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-white uppercase italic">Neural_Storage_Locked</h3>
                   <p className="text-xs text-white/30 uppercase tracking-widest leading-relaxed max-w-md">Private notes require biometric authorization or high-level master override to access temporal memory nodes.</p>
                </div>
                <button onClick={() => setIsNotesLocked(false)} className="px-12 py-5 bg-rose-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-4">
                   <Fingerprint size={18} /> Verify_Identity
                </button>
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                   <div className="atomic-glass p-8 rounded-[40px] border-[#6366F1]/30 space-y-6">
                      <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">Initialize_Thought</h3>
                      <div className="space-y-4">
                         <input placeholder="Note Title..." className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-black text-white uppercase outline-none focus:border-[#6366F1]/40 transition-all" />
                         <textarea placeholder="Write neural log..." className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs font-black text-white h-48 resize-none outline-none focus:border-[#6366F1]/40" />
                         <button className="w-full py-4 bg-[#6366F1] text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-lg">Save_Memory_Node</button>
                      </div>
                   </div>
                   <button onClick={() => setIsNotesLocked(true)} className="w-full py-4 bg-white/5 border border-rose-500/20 text-rose-500 font-black text-[10px] uppercase tracking-[0.3em] rounded-xl flex items-center justify-center gap-3">
                      <Shield size={16} /> Relock_Vault
                   </button>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                   {notes.map(note => (
                     <div key={note.id} className="atomic-glass p-8 rounded-[40px] border-white/5 flex flex-col group hover:border-[#6366F1]/40 transition-all">
                        <div className="flex justify-between items-start mb-6">
                           <FileText size={24} className="text-[#6366F1]" />
                           <span className="text-[8px] font-black text-white/20 uppercase mono">{note.date}</span>
                        </div>
                        <h4 className="text-lg font-black text-white uppercase italic mb-4">{note.title}</h4>
                        <p className="text-[11px] text-white/40 uppercase tracking-wider leading-relaxed mb-8 flex-1">{note.content}</p>
                        <div className="flex gap-2 justify-end">
                           <button className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white transition-all"><Edit3 size={16}/></button>
                           <button className="p-3 bg-white/5 rounded-xl text-rose-500/20 hover:text-rose-500 transition-all"><Trash2 size={16}/></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </section>
      )}
    </div>
  );
};

export default PersonalModule;