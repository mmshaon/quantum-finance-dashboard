import React, { useState, useMemo } from 'react';
import { 
  CreditCard, Calendar, AlertTriangle, CheckCircle, 
  Plus, Bell, ArrowRight, Clock, ShieldCheck, Zap,
  ChevronLeft, ChevronRight, Search, Filter, X,
  Trash2, FileText, Download, BarChart3, PieChart as PieIcon,
  User, Layers, History, Paperclip, MoreHorizontal, MoreVertical
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { mockDb } from '../store';
import { useRipple } from '../App';
import { BillRecord } from '../types';

type ViewState = 'REGISTRY' | 'CALENDAR' | 'ADD' | 'REPORTS';

const CATEGORIES = ['Infrastructure', 'Services', 'Marketing', 'Utilities', 'Taxes', 'Misc'];
const COLORS = ['#FFD500', '#FF6EC7', '#00D4FF', '#00FFA3', '#A855F7', '#EC4899'];

const BillsModule: React.FC = () => {
  const ripple = useRipple();
  const [view, setView] = useState<ViewState>('REGISTRY');
  const [bills, setBills] = useState<BillRecord[]>(mockDb.bills);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');

  // Form State
  const [form, setForm] = useState({
    name: '',
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    category: CATEGORIES[0],
    attachment: null as string | null
  });

  // Filter Logic
  const filteredBills = useMemo(() => {
    return bills.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bills, searchQuery, statusFilter]);

  // Analytics Logic
  const reportData = useMemo(() => {
    const statusDist = [
      { name: 'Pending', value: bills.filter(b => b.status === 'pending').length, fill: '#FFD500' },
      { name: 'Paid', value: bills.filter(b => b.status === 'paid').length, fill: '#00FFA3' },
      { name: 'Overdue', value: bills.filter(b => b.status === 'overdue').length, fill: '#FF6EC7' }
    ];
    
    const monthlyData = bills.reduce((acc: any[], b) => {
      const month = b.dueDate.split('-')[1];
      const existing = acc.find(a => a.name === month);
      if (existing) existing.total += b.amount;
      else acc.push({ name: month, total: b.amount });
      return acc;
    }, []);

    return { statusDist, monthlyData };
  }, [bills]);

  const handleAddBill = () => {
    if (!form.name || !form.amount) return;
    const newBill: BillRecord = {
      id: `BIL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: form.name,
      amount: parseFloat(form.amount),
      dueDate: form.dueDate,
      status: 'pending'
    };
    setBills([newBill, ...bills]);
    setForm({ name: '', amount: '', dueDate: new Date().toISOString().split('T')[0], category: CATEGORIES[0], attachment: null });
    setView('REGISTRY');
  };

  const toggleStatus = (id: string) => {
    setBills(bills.map(b => b.id === id ? { ...b, status: b.status === 'paid' ? 'pending' : 'paid' } : b));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER CONTROL PROTOCOL */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/[0.02] p-8 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-[#FFD500] shadow-[0_0_10px_#FFD500] animate-pulse" />
             <span className="text-[10px] font-black text-[#FFD500] uppercase tracking-[0.4em]">Liability_Registry_Pulse</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Strategic_Debt</h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <nav className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button onClick={() => setView('REGISTRY')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'REGISTRY' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>Matrix</button>
            <button onClick={() => setView('CALENDAR')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'CALENDAR' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>Temporal</button>
            <button onClick={() => setView('REPORTS')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'REPORTS' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>Reports</button>
          </nav>
          <button onMouseDown={ripple} onClick={() => setView('ADD')} className="px-8 py-4 bg-[#FFD500] text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,213,0,0.3)] flex items-center gap-3">
            <Plus size={16} /> Schedule Bill
          </button>
        </div>
      </header>

      {/* VIEW: ADD BILL */}
      {view === 'ADD' && (
        <section className="atomic-glass p-10 rounded-[48px] border-[#FFD500]/20 space-y-10 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
               <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">1. Liability_Intake</h3>
               <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Vendor / Payee</label>
                   <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. AWS Cloud Cluster Alpha" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-black text-white uppercase outline-none focus:border-[#FFD500]/40 transition-all" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Amount (USD)</label>
                     <div className="relative">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FFD500] font-black mono">$</span>
                       <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" className="w-full bg-white/5 border border-white/10 p-5 pl-10 rounded-2xl text-sm font-black text-white mono outline-none focus:border-[#FFD500]/40" />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Due Date</label>
                     <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-[10px] font-black text-white uppercase outline-none" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Cost Category</label>
                   <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-[10px] font-black text-white uppercase outline-none appearance-none cursor-pointer">
                     {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#05070a]">{c}</option>)}
                   </select>
                 </div>
               </div>
            </div>

            <div className="space-y-8">
               <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">2. Invoice_Verification</h3>
               <div className="h-64 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center space-y-4 hover:border-[#FFD500]/40 hover:bg-white/[0.02] transition-all cursor-pointer relative overflow-hidden group">
                  {form.attachment ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#FFD500]/5">
                       <CheckCircle size={48} className="text-[#FFD500] mb-4" />
                       <span className="text-[10px] font-black text-[#FFD500] uppercase tracking-widest">Invoice_Document_Linked</span>
                       <button onClick={(e) => { e.stopPropagation(); setForm({...form, attachment: null}); }} className="mt-4 p-2 bg-rose-500 rounded-full text-white shadow-lg"><X size={14}/></button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#FFD500] transition-all">
                        <Paperclip size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Upload_Invoice_PDF</p>
                        <p className="text-[9px] text-white/20 uppercase mt-1">Digital Bill Registry (Max 10MB)</p>
                      </div>
                    </>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={() => setForm({...form, attachment: 'dummy_bill_uri'})} />
               </div>
               
               <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle size={16} className="text-[#FFD500]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Reminder_Protocol</span>
                  </div>
                  <p className="text-[9px] text-white/40 uppercase leading-relaxed">System will initiate high-visibility spectral alerts 48 hours prior to the temporal deadline.</p>
               </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-10 border-t border-white/5">
            <div className="flex items-center gap-4 text-white/20 italic">
               <ShieldCheck size={20} className="text-[#FFD500]" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em]">Transaction_Audit_Hash_Locked</span>
            </div>
            <button onClick={handleAddBill} className="px-12 py-5 bg-[#FFD500] text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-105 transition-all">Append_to_Liabilities</button>
          </div>
        </section>
      )}

      {/* VIEW: REGISTRY (MATRIX) */}
      {view === 'REGISTRY' && (
        <section className="space-y-8 animate-in fade-in duration-500">
           <div className="flex flex-wrap gap-4 items-center justify-between bg-white/[0.03] p-6 rounded-[32px] border border-white/5">
              <div className="flex items-center gap-6 flex-1 max-w-xl">
                 <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex-1">
                   <Search size={16} className="text-white/20" />
                   <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="QUERY_VENDOR..." className="bg-transparent border-none outline-none text-[10px] font-black text-white uppercase tracking-widest w-full placeholder:text-white/10" />
                 </div>
                 <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                    {(['all', 'pending', 'paid', 'overdue'] as const).map(s => (
                      <button 
                        key={s} 
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}
                      >
                        {s}
                      </button>
                    ))}
                 </div>
              </div>
              <div className="flex items-center gap-3 bg-[#FFD500]/5 px-6 py-3 rounded-2xl border border-[#FFD500]/10">
                 <span className="text-[9px] font-black text-[#FFD500]/50 uppercase tracking-widest">Active_Liability:</span>
                 <span className="text-xl font-black text-white mono italic">${filteredBills.filter(b=>b.status !== 'paid').reduce((a,b)=>a+b.amount, 0).toLocaleString()}</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBills.map(b => (
                <article key={b.id} className="atomic-glass p-8 rounded-[48px] border-white/5 group hover:border-[#FFD500]/40 transition-all relative overflow-hidden">
                   <div className="flex justify-between items-start mb-10">
                      <div className={`p-4 rounded-2xl border shadow-lg group-hover:scale-110 transition-transform ${
                        b.status === 'paid' ? 'bg-[#00FFA3]/10 text-[#00FFA3] border-[#00FFA3]/20' : 
                        b.status === 'overdue' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                        'bg-[#FFD500]/10 text-[#FFD500] border-[#FFD500]/20'
                      }`}>
                        {b.status === 'paid' ? <CheckCircle size={24} /> : <Zap size={24} />}
                      </div>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{b.id}</span>
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase italic tracking-tight truncate group-hover:text-glow transition-all">{b.name}</h4>
                   <div className="mt-4 flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar size={12}/> {b.dueDate}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <span className={`${b.status === 'overdue' ? 'text-rose-500' : 'text-white/30'}`}>{b.status.toUpperCase()}</span>
                   </div>
                   <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-black text-white/20 uppercase mb-1">Total Valuation</p>
                        <p className="text-3xl font-black text-white mono italic">${b.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => toggleStatus(b.id)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-[#00FFA3] transition-all"><CheckCircle size={20}/></button>
                        <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-white transition-all"><MoreVertical size={20}/></button>
                      </div>
                   </div>
                </article>
              ))}
           </div>
        </section>
      )}

      {/* VIEW: TEMPORAL (CALENDAR) */}
      {view === 'CALENDAR' && (
        <section className="atomic-glass p-10 rounded-[48px] border-white/10 animate-in zoom-in-95 duration-700 min-h-[600px] flex flex-col">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-3">
                <Calendar size={18} className="text-[#FFD500]" /> Temporal_Liability_Matrix
              </h3>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-4">
                    <button className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-white/40 hover:text-white"><ChevronLeft size={20}/></button>
                    <span className="text-[11px] font-black text-white uppercase tracking-widest">May 2024</span>
                    <button className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-white/40 hover:text-white"><ChevronRight size={20}/></button>
                 </div>
              </div>
           </div>
           <div className="grid grid-cols-7 gap-4 flex-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[9px] font-black text-white/20 uppercase tracking-widest mb-4">{d}</div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 3; 
                const dayBills = bills.filter(b => new Date(b.dueDate).getDate() === day && new Date(b.dueDate).getMonth() === 4);
                return (
                  <div key={i} className={`aspect-square rounded-[24px] border ${day > 0 && day <= 31 ? 'bg-white/5 border-white/5 hover:border-[#FFD500]/40 hover:bg-white/[0.08]' : 'opacity-10 pointer-events-none'} transition-all p-3 flex flex-col justify-between relative group cursor-pointer overflow-hidden`}>
                    <span className="text-xs font-black text-white/40 group-hover:text-white transition-colors">{day > 0 && day <= 31 ? day : ''}</span>
                    <div className="space-y-1">
                      {dayBills.map(db => (
                        <div key={db.id} className={`h-1.5 w-full rounded-full ${db.status === 'paid' ? 'bg-[#00FFA3]/30' : 'bg-[#FFD500] shadow-[0_0_8px_#FFD500]'}`} title={db.name} />
                      ))}
                    </div>
                  </div>
                );
              })}
           </div>
        </section>
      )}

      {/* VIEW: REPORTS (ANALYTICS) */}
      {view === 'REPORTS' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
           <div className="lg:col-span-8 atomic-glass p-10 rounded-[48px] border-white/10 h-[500px]">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] mb-10 flex items-center gap-3"><BarChart3 size={18} className="text-[#FFD500]"/> Monthly_Liability_Burn</h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={reportData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} />
                  <YAxis stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} tickFormatter={(v)=>`$${v/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#05070a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                  <Bar dataKey="total" fill="#FFD500" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>

           <div className="lg:col-span-4 atomic-glass p-10 rounded-[48px] border-white/10 h-[500px]">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] mb-10 flex items-center gap-3"><PieIcon size={18} className="text-[#FF6EC7]"/> Debt_Aging_Distribution</h3>
              <ResponsiveContainer width="100%" height="80%">
                 <PieChart>
                    <Pie data={reportData.statusDist} dataKey="value" innerRadius={80} outerRadius={120} paddingAngle={10}>
                       {reportData.statusDist.map((entry, i) => <Cell key={i} fill={entry.fill} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#05070a', border: 'none', borderRadius: '16px' }} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                 </PieChart>
              </ResponsiveContainer>
           </div>

           <div className="lg:col-span-12 atomic-glass p-10 rounded-[48px] border-white/10">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] mb-8 flex items-center gap-3"><History size={18} className="text-[#00D4FF]"/> Vendor_Debt_Summary</h3>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-white/[0.01] text-[10px] font-black uppercase text-white/30 tracking-widest">
                       <tr><th className="p-6">Vendor Name</th><th className="p-6">Total Liabilities</th><th className="p-6">Next Due</th><th className="p-6 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {bills.map(b => (
                         <tr key={b.id} className="hover:bg-white/[0.02] transition-all group">
                            <td className="p-6 flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-[#FFD500] transition-all"><User size={18}/></div>
                               <span className="text-sm font-black text-white uppercase italic">{b.name}</span>
                            </td>
                            <td className="p-6 font-black text-[#FF6EC7] mono">${b.amount.toLocaleString()}</td>
                            <td className="p-6 text-[10px] font-black text-white/40 uppercase">{b.dueDate}</td>
                            <td className="p-6 text-right"><button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-white transition-all"><ArrowRight size={18}/></button></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </section>
      )}
    </div>
  );
};

export default BillsModule;