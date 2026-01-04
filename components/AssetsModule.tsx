import React, { useState, useMemo } from 'react';
import { 
  Warehouse, ArrowUp, ArrowDown, Shield, MapPin, 
  Search, Filter, Plus, QrCode, Cpu, History,
  TrendingUp, BarChart3, Activity, Zap, X, AlertCircle,
  Wrench, Archive, CheckCircle, FileText, Calendar,
  MoreVertical, ShieldCheck, PieChart as PieIcon, LineChart as LineIcon,
  Tag, Download, Edit3, Trash2
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, Cell, PieChart, Pie, Legend, AreaChart, Area
} from 'recharts';
import { mockDb } from '../store';
import { useRipple } from '../App';
import { AssetRecord } from '../types';

type ViewState = 'REGISTRY' | 'ADD' | 'DETAILS' | 'REPORTS';

const CATEGORIES = ['Infrastructure', 'Hardware', 'IP', 'Vehicles', 'Real Estate'];
const COLORS = ['#A855F7', '#00D4FF', '#00FFA3', '#FFD500', '#FF6EC7'];

const AssetsModule: React.FC = () => {
  const ripple = useRipple();
  const [view, setView] = useState<ViewState>('REGISTRY');
  const [assets, setAssets] = useState<AssetRecord[]>(mockDb.assets);
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'maintenance' | 'retired'>('all');

  // Form State
  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    purchaseDate: new Date().toISOString().split('T')[0],
    value: '',
    depreciation: 'Linear',
    warranty: '',
    attachment: null as string | null
  });

  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
      // Note: Status is conceptual here, we'll map current db assets to 'active'
      const matchesStatus = statusFilter === 'all' || 'active' === statusFilter; 
      return matchesSearch && matchesStatus;
    });
  }, [assets, searchQuery, statusFilter]);

  const reportData = useMemo(() => {
    const totalValue = assets.reduce((acc, a) => acc + a.currentValue, 0);
    const categoryDist = CATEGORIES.map(cat => ({
      name: cat,
      value: assets.filter(a => a.type === cat).reduce((s, a) => s + a.currentValue, 0)
    })).filter(d => d.value > 0);
    
    // Fake depreciation projection for chart
    const projection = [
      { year: '2024', val: totalValue },
      { year: '2025', val: totalValue * 0.85 },
      { year: '2026', val: totalValue * 0.72 },
      { year: '2027', val: totalValue * 0.60 },
      { year: '2028', val: totalValue * 0.50 },
    ];

    return { totalValue, categoryDist, projection };
  }, [assets]);

  const handleAddAsset = () => {
    if (!form.name || !form.value) return;
    const newAsset: AssetRecord = {
      id: `AST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: form.name,
      type: form.category,
      purchaseValue: parseFloat(form.value),
      currentValue: parseFloat(form.value),
      purchaseDate: form.purchaseDate
    };
    setAssets([newAsset, ...assets]);
    setForm({ name: '', category: CATEGORIES[0], purchaseDate: new Date().toISOString().split('T')[0], value: '', depreciation: 'Linear', warranty: '', attachment: null });
    setView('REGISTRY');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER PROTOCOL */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/[0.02] p-8 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7] animate-pulse" />
             <span className="text-[10px] font-black text-[#A855F7] uppercase tracking-[0.4em]">Infrastructure_Pulse_Active</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Capital_Core</h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <nav className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button onClick={() => setView('REGISTRY')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'REGISTRY' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>Matrix</button>
            <button onClick={() => setView('REPORTS')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'REPORTS' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}>Valuation</button>
          </nav>
          <button onMouseDown={ripple} onClick={() => setView('ADD')} className="px-8 py-4 bg-[#A855F7] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_40px_rgba(168,85,247,0.3)] flex items-center gap-3">
            <Plus size={16} /> New Asset Node
          </button>
        </div>
      </header>

      {/* VIEW: ADD ASSET */}
      {view === 'ADD' && (
        <section className="atomic-glass p-10 rounded-[48px] border-[#A855F7]/20 space-y-10 animate-in zoom-in-95 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
               <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">1. Acquisition_Registry</h3>
               <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Asset Name / Identity</label>
                   <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Quantum Cluster G-9" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs font-black text-white uppercase outline-none focus:border-[#A855F7]/40 transition-all" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Initial Value (USD)</label>
                     <div className="relative">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A855F7] font-black mono">$</span>
                       <input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder="0.00" className="w-full bg-white/5 border border-white/10 p-5 pl-10 rounded-2xl text-sm font-black text-white mono outline-none focus:border-[#A855F7]/40" />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Purchase Date</label>
                     <input type="date" value={form.purchaseDate} onChange={e => setForm({...form, purchaseDate: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-[10px] font-black text-white uppercase outline-none" />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Asset Class</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-[10px] font-black text-white uppercase outline-none appearance-none cursor-pointer">
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#05070a]">{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/20 uppercase ml-2 tracking-widest">Depreciation Model</label>
                      <select value={form.depreciation} onChange={e => setForm({...form, depreciation: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-[10px] font-black text-white uppercase outline-none appearance-none cursor-pointer">
                        <option value="Linear" className="bg-[#05070a]">Linear (Straight Line)</option>
                        <option value="DoubleDeclining" className="bg-[#05070a]">Double Declining</option>
                        <option value="UnitsOfProduction" className="bg-[#05070a]">Units of Production</option>
                      </select>
                    </div>
                 </div>
               </div>
            </div>

            <div className="space-y-8">
               <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">2. Technical_Proof</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="h-48 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center space-y-4 hover:border-[#A855F7]/40 hover:bg-white/[0.02] transition-all cursor-pointer relative overflow-hidden group">
                      <FileText size={24} className="text-white/20" />
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Legal_Deed_PDF</span>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <div className="h-48 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center space-y-4 hover:border-[#A855F7]/40 hover:bg-white/[0.02] transition-all cursor-pointer relative overflow-hidden group">
                      <ShieldCheck size={24} className="text-white/20" />
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Warranty_Cert</span>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
               </div>
               
               <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap size={16} className="text-[#FFD500]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural_Tagging_Status</span>
                  </div>
                  <p className="text-[9px] text-white/40 uppercase leading-relaxed italic">Upon verification, a unique QR identifier will be synthesized for physical core synchronization.</p>
               </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-10 border-t border-white/5">
            <div className="flex items-center gap-4 text-white/20 italic">
               <Shield size={20} className="text-[#A855F7]" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em]">Lifecycle_Audit_Active</span>
            </div>
            <button onClick={handleAddAsset} className="px-12 py-5 bg-[#A855F7] text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-105 transition-all">Verify & Append Asset</button>
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
                   <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="QUERY_ASSET_NODE..." className="bg-transparent border-none outline-none text-[10px] font-black text-white uppercase tracking-widest w-full placeholder:text-white/10" />
                 </div>
                 <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                    {(['all', 'active', 'maintenance', 'retired'] as const).map(s => (
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
              <div className="flex items-center gap-3 bg-[#A855F7]/5 px-6 py-3 rounded-2xl border border-[#A855F7]/10">
                 <span className="text-[9px] font-black text-[#A855F7]/50 uppercase tracking-widest">Gross_Valuation:</span>
                 <span className="text-xl font-black text-white mono italic">${reportData.totalValue.toLocaleString()}</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map(a => (
                <article key={a.id} onClick={() => { setSelectedAsset(a); setView('DETAILS'); }} className="atomic-glass p-8 rounded-[48px] border-white/5 group hover:border-[#A855F7]/40 transition-all relative overflow-hidden cursor-pointer">
                   <div className="flex justify-between items-start mb-10">
                      <div className="p-4 bg-[#A855F7]/10 text-[#A855F7] rounded-2xl border border-[#A855F7]/20 shadow-lg group-hover:scale-110 transition-transform">
                        <Warehouse size={24} />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{a.id}</span>
                        <span className="text-[7px] font-black text-[#00FFA3] uppercase tracking-widest mt-1">Status_Healthy</span>
                      </div>
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase italic tracking-tight truncate group-hover:text-glow transition-all">{a.name}</h4>
                   <div className="mt-4 flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Tag size={12}/> {a.type}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <span>{a.purchaseDate}</span>
                   </div>
                   <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-black text-white/20 uppercase mb-1">Current Valuation</p>
                        <p className="text-3xl font-black text-white mono italic">${a.currentValue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 group-hover:text-[#A855F7] transition-all">
                        <QrCode size={20}/>
                      </div>
                   </div>
                </article>
              ))}
           </div>
        </section>
      )}

      {/* VIEW: ASSET DETAILS (DEEP VIEW) */}
      {view === 'DETAILS' && selectedAsset && (
        <section className="space-y-12 animate-in zoom-in-95 duration-500">
           <div className="flex items-center gap-4">
              <button onClick={() => setView('REGISTRY')} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"><X size={20}/></button>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Node_Breakdown: {selectedAsset.id}</h3>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Pillar 1: Identity & QR */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="atomic-glass p-10 rounded-[48px] border-white/10 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="p-8 bg-white text-black rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                       <QrCode size={120} />
                    </div>
                    <div>
                       <p className="text-xs font-black text-white uppercase italic">Neural_Identity_Tag</p>
                       <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">Unique physical verification point</p>
                    </div>
                    <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                       <Download size={14} /> Download_Print_Tag
                    </button>
                 </div>

                 <div className="atomic-glass p-8 rounded-[40px] border-white/10 space-y-6">
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Maintenance_Log</h3>
                    <div className="space-y-4">
                       <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                          <div className="p-2 bg-[#00FFA3]/10 text-[#00FFA3] rounded-lg"><CheckCircle size={14}/></div>
                          <div>
                             <p className="text-[10px] font-black text-white uppercase">Health Check Complete</p>
                             <p className="text-[8px] text-white/30 uppercase">Synced 02 days ago</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                          <div className="p-2 bg-[#FFD500]/10 text-[#FFD500] rounded-lg"><Wrench size={14}/></div>
                          <div>
                             <p className="text-[10px] font-black text-white uppercase">Component Swap #91</p>
                             <p className="text-[8px] text-white/30 uppercase">Synced 12 days ago</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Pillar 2: Financials & Depreciation */}
              <div className="lg:col-span-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="atomic-glass p-8 rounded-[40px] border-white/5">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Acquisition</p>
                       <p className="text-2xl font-black text-white mono italic">${selectedAsset.purchaseValue.toLocaleString()}</p>
                    </div>
                    <div className="atomic-glass p-8 rounded-[40px] border-white/5">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Current Delta</p>
                       <p className="text-2xl font-black text-[#00FFA3] mono italic">+$300,000</p>
                    </div>
                    <div className="atomic-glass p-8 rounded-[40px] border-white/5">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Retention</p>
                       <p className="text-2xl font-black text-[#A855F7] mono italic">112%</p>
                    </div>
                 </div>

                 <div className="atomic-glass p-10 rounded-[48px] border-white/10 h-[450px]">
                    <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] mb-10 flex items-center gap-3"><LineIcon size={18} className="text-[#A855F7]"/> Projected_Depreciation_Matrix</h3>
                    <ResponsiveContainer width="100%" height="80%">
                       <AreaChart data={reportData.projection}>
                          <defs>
                             <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/><stop offset="95%" stopColor="#A855F7" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="year" stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} tickFormatter={(v)=>`$${v/1000}k`} />
                          <Tooltip contentStyle={{ backgroundColor: '#05070a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                          <Area type="monotone" dataKey="val" stroke="#A855F7" strokeWidth={4} fill="url(#colorVal)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* VIEW: REPORTS (ANALYTICS) */}
      {view === 'REPORTS' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
           <div className="lg:col-span-8 atomic-glass p-10 rounded-[48px] border-white/10 h-[500px]">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] mb-10 flex items-center gap-3"><BarChart3 size={18} className="text-[#00FFA3]"/> Asset_Class_Valuation</h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={reportData.categoryDist}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} />
                  <YAxis stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} tickFormatter={(v)=>`$${v/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#05070a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                  <Bar dataKey="value" fill="#00FFA3" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>

           <div className="lg:col-span-4 atomic-glass p-10 rounded-[48px] border-white/10 h-[500px]">
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] mb-10 flex items-center gap-3"><PieIcon size={18} className="text-[#A855F7]"/> Sector_Weight_Distribution</h3>
              <ResponsiveContainer width="100%" height="80%">
                 <PieChart>
                    <Pie data={reportData.categoryDist} dataKey="value" innerRadius={80} outerRadius={120} paddingAngle={10}>
                       {reportData.categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#05070a', border: 'none', borderRadius: '16px' }} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                 </PieChart>
              </ResponsiveContainer>
           </div>
        </section>
      )}
    </div>
  );
};

export default AssetsModule;