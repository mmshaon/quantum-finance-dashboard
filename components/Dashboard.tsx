import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { mockDb } from '../store';
import { 
  TrendingUp, TrendingDown, Package, Zap, 
  Activity, Sparkles, Receipt, Clock, 
  History, LineChart as LineIcon, ShieldCheck,
  ChevronRight, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const metrics = useMemo(() => {
    const expenses = mockDb.expenses.reduce((a, c) => a + c.totalAmount, 0);
    const income = mockDb.income.reduce((a, c) => a + c.amount, 0);
    const pendingBills = mockDb.bills.filter(b => b.status === 'pending').length;
    const assets = mockDb.assets.reduce((a, c) => a + c.currentValue, 0);
    const hr = mockDb.employees.length;
    return { expenses, income, pendingBills, assets, hr };
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* Dynamic Spectral Metrics - Perfect Alignment Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <LiveCounter title="Expenses" value={`$${metrics.expenses.toLocaleString()}`} icon={TrendingDown} color="#FF6EC7" trend="-4.2%" glow="shadow-[0_0_40px_rgba(255,110,199,0.2)]" />
        <LiveCounter title="Income" value={`$${metrics.income.toLocaleString()}`} icon={TrendingUp} color="#00FFA3" trend="+12.5%" glow="shadow-[0_0_40px_rgba(0,255,163,0.2)]" />
        <LiveCounter title="Bills" value={metrics.pendingBills} icon={Clock} color="#FFD500" trend="Active" glow="shadow-[0_0_40px_rgba(255,213,0,0.2)]" />
        <LiveCounter title="Assets" value={`$${(metrics.assets / 1000000).toFixed(1)}M`} icon={Package} color="#00D4FF" trend="+8.1%" glow="shadow-[0_0_40px_rgba(0,212,255,0.2)]" />
        <LiveCounter title="Staff" value={metrics.hr} icon={Activity} color="#A855F7" trend="Synced" glow="shadow-[0_0_40px_rgba(168,85,247,0.2)]" />
      </section>

      {/* Main Command Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 atomic-glass p-12 rounded-[64px] border-white/5 h-[520px] bg-gradient-to-br from-white/[0.02] to-transparent relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-12">
             <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] flex items-center gap-3">
               <LineIcon size={20} className="text-[#00D4FF]" /> Global_Yield_Burn
             </h3>
             <div className="flex gap-6">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]"/><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Yield</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#FF6EC7] shadow-[0_0_10px_#FF6EC7]"/><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Burn</span></div>
             </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{n:'W1',i:45,o:12},{n:'W2',i:52,o:34},{n:'W3',i:38,o:15},{n:'W4',i:85,o:22}]}>
                <defs>
                  <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00FFA3" stopOpacity={0.4}/><stop offset="95%" stopColor="#00FFA3" stopOpacity={0}/></linearGradient>
                  <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF6EC7" stopOpacity={0.1}/><stop offset="95%" stopColor="#FF6EC7" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="n" stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.1)" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#05070a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="i" stroke="#00FFA3" strokeWidth={5} fill="url(#yieldGrad)" />
                <Area type="monotone" dataKey="o" stroke="#FF6EC7" strokeWidth={3} strokeDasharray="8 8" fill="url(#burnGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 atomic-glass p-12 rounded-[64px] border-white/5 h-[520px] bg-gradient-to-tr from-white/[0.02] to-transparent flex flex-col justify-between">
          <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] mb-12">Sector_Matrix</h3>
          <div className="flex-1 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={[{name:'Ops',value:40},{name:'Tech',value:60}]} innerRadius={75} outerRadius={105} paddingAngle={12} dataKey="value" stroke="none">
                  <Cell fill="#00FFA3" />
                  <Cell fill="#A855F7" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
             <SectorRow label="Operations_Node" color="#00FFA3" percent="40%" />
             <SectorRow label="Engineering_Node" color="#A855F7" percent="60%" />
          </div>
        </div>
      </div>

      <section className="atomic-glass p-12 rounded-[64px] border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent">
        <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
          <History size={20} className="text-[#00FFA3]" /> Neural_Event_Stream
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <TimelineItem icon={ArrowDownRight} label="Burn_Registry_Entry" time="02m ago" color="#FF6EC7" desc="Capital burn node TRX-ALPHA synced to ledger." />
          <TimelineItem icon={ShieldCheck} label="Audit_Verification" time="15m ago" color="#00FFA3" desc="Neural audit node verification successful." />
        </div>
      </section>
    </div>
  );
};

const SectorRow: React.FC<any> = ({ label, color, percent }) => (
  <div className="flex items-center justify-between p-5 bg-white/5 rounded-[28px] border border-white/5 group hover:border-white/20 transition-all">
    <div className="flex items-center gap-4">
      <div className="w-3.5 h-3.5 rounded-full shadow-lg" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
      <span className="text-[11px] font-black text-white uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-[12px] font-black text-white/60 mono italic">{percent}</span>
  </div>
);

const LiveCounter: React.FC<any> = ({ title, value, icon: Icon, color, trend, glow }) => (
  <div className={`atomic-glass p-10 rounded-[48px] border-white/10 relative overflow-hidden group hover:scale-[1.05] hover:-translate-y-2 transition-all duration-500 h-[220px] flex flex-col justify-between ${glow}`}>
    <div className="flex justify-between items-start">
      <div className="w-16 h-16 rounded-[28px] bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white/10 shadow-lg border border-white/5" style={{ color }}>
        <Icon size={32} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-2xl bg-white/5 border border-white/5" style={{ color }}>{trend}</span>
      </div>
    </div>
    <div>
      <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mb-2 italic leading-none">{title}</p>
      <p className="text-3xl font-black text-white mono italic tracking-tighter leading-none">{value}</p>
    </div>
  </div>
);

const TimelineItem: React.FC<any> = ({ icon: Icon, label, time, color, desc }) => (
  <div className="flex gap-8 items-start group">
    <div className="w-16 h-16 rounded-[28px] bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-2xl group-hover:scale-110 transition-all" style={{ color }}>
      <Icon size={28} />
    </div>
    <div className="flex-1 pb-10 border-b border-white/[0.03]">
      <div className="flex justify-between items-center mb-3">
        <p className="text-[13px] font-black text-white uppercase italic tracking-widest group-hover:text-glow transition-all">{label}</p>
        <span className="text-[10px] font-black text-white/20 uppercase mono">{time}</span>
      </div>
      <p className="text-[11px] text-white/40 font-medium uppercase tracking-[0.1em] leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Dashboard;