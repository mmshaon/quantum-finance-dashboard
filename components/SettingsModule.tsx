
import React, { useState } from 'react';
import { 
  Settings, Shield, Bell, Globe, Database, HelpCircle, LogOut, CheckCircle2, 
  Target, Zap, User, Users, Lock, Palette, Languages, HardDrive, 
  ShieldCheck, ShieldAlert, Key, Fingerprint, Eye, EyeOff, Trash2, 
  UserPlus, Edit3, Save, RefreshCcw, Download, Upload, Monitor,
  Cpu, Clock, Smartphone, BellRing, Sparkles, ChevronRight, X, Plus
} from 'lucide-react';
import { currentUser, GOD_USERS } from '../store';
import { useRipple } from '../App';
import { UserRole } from '../types';

type SettingsTab = 'PROFILE' | 'USERS' | 'PERMISSIONS' | 'TAXONOMY' | 'AESTHETICS' | 'SOVEREIGNTY' | 'SECURITY' | 'LFG';

const SettingsModule: React.FC = () => {
  const ripple = useRipple();
  const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  // Mock State for expanded settings
  const [users, setUsers] = useState([
    { id: 'U-001', name: 'M. Maynul Hasan', role: UserRole.ADMIN, dept: 'Executive' },
    { id: 'U-002', name: 'Engineering Lead', role: UserRole.MANAGER, dept: 'Tech Ops' },
  ]);

  const [categories, setCategories] = useState({
    expense: ['Infrastructure', 'Growth', 'IT', 'Marketing'],
    income: ['Licensing', 'Consulting', 'Partnership'],
    assets: ['Hardware', 'IP', 'Real Estate']
  });

  const [isBioEnabled, setIsBioEnabled] = useState(true);
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('Deep Emerald');

  const triggerSave = () => {
    setSaveStatus("SYNCING_CORE...");
    setTimeout(() => {
      setSaveStatus("SYNK_COMPLETE");
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1000);
  };

  const isAdmin = currentUser.role === UserRole.ADMIN;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* 1. SYSTEM HEADER PROTOCOL */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/[0.02] p-8 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-[0_0_10px_#94a3b8] animate-pulse" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Exec_Core_Config_v4</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">System_Matrix</h2>
        </div>
        
        {saveStatus && (
          <div className="px-6 py-3 bg-[#00FFA3]/10 border border-[#00FFA3]/20 rounded-2xl flex items-center gap-3 animate-bounce">
            <ShieldCheck size={18} className="text-[#00FFA3]" />
            <span className="text-[10px] font-black text-[#00FFA3] uppercase tracking-widest">{saveStatus}</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. NAVIGATION SIDEBAR */}
        <aside className="lg:col-span-3 space-y-2">
           <NavBtn active={activeTab === 'PROFILE'} icon={User} label="Operator Profile" onClick={() => setActiveTab('PROFILE')} />
           {isAdmin && (
             <>
               <NavBtn active={activeTab === 'USERS'} icon={Users} label="Agent Directory" onClick={() => setActiveTab('USERS')} />
               <NavBtn active={activeTab === 'PERMISSIONS'} icon={Lock} label="Auth Matrix" onClick={() => setActiveTab('PERMISSIONS')} />
             </>
           )}
           <NavBtn active={activeTab === 'TAXONOMY'} icon={Target} label="Sector Taxonomy" onClick={() => setActiveTab('TAXONOMY')} />
           <NavBtn active={activeTab === 'AESTHETICS'} icon={Palette} label="Neural Interface" onClick={() => setActiveTab('AESTHETICS')} />
           <NavBtn active={activeTab === 'SOVEREIGNTY'} icon={Database} label="Vault Sovereignty" onClick={() => setActiveTab('SOVEREIGNTY')} />
           <NavBtn active={activeTab === 'SECURITY'} icon={ShieldAlert} label="Security Protocol" onClick={() => setActiveTab('SECURITY')} />
           <NavBtn active={activeTab === 'LFG'} icon={Languages} label="Linguistic Sync" onClick={() => setActiveTab('LFG')} />
           
           <div className="pt-6">
              <button onMouseDown={ripple} className="w-full flex items-center justify-center gap-3 p-5 rounded-3xl border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em] shadow-lg">
                <LogOut size={16} /> Sever Neural Link
              </button>
           </div>
        </aside>

        {/* 3. CONTENT AREA */}
        <main className="lg:col-span-9 atomic-glass p-10 rounded-[56px] border-white/10 min-h-[700px]">
           
           {/* TAB: PROFILE */}
           {activeTab === 'PROFILE' && (
             <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex items-center gap-10">
                   <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-[#00FFA3] to-[#00D4FF] flex items-center justify-center text-4xl font-black text-[#05070a] shadow-[0_0_40px_rgba(0,255,163,0.3)] border-2 border-white/20">
                     {currentUser.fullName.split(' ').map(n=>n[0]).join('')}
                   </div>
                   <div className="space-y-3">
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{currentUser.fullName}</h3>
                      <div className="flex items-center gap-4">
                         <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-[#00FFA3] uppercase">{currentUser.employeeId}</span>
                         <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{currentUser.department}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                   <FieldGroup label="Network ID" value={currentUser.username} />
                   <FieldGroup label="Security Clearance" value={currentUser.role.toUpperCase()} />
                   <FieldGroup label="Emergency Contact" value="+1 (555) 942-ALPHA" />
                   <FieldGroup label="Biometric Seed" value="SHA256_FINGERPRINT_LOCKED" />
                </div>

                <button onClick={triggerSave} className="px-10 py-5 bg-[#00FFA3] text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-105 transition-all">Synchronize Operator Data</button>
             </div>
           )}

           {/* TAB: USERS */}
           {activeTab === 'USERS' && (
             <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-center">
                   <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">Agent_Inventory</h3>
                   <button className="px-6 py-3 bg-[#00FFA3] text-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                      <UserPlus size={14} /> New Agent
                   </button>
                </div>
                <div className="space-y-4">
                   {users.map(u => (
                     <div key={u.id} className="atomic-glass p-6 rounded-3xl border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-white/40">{u.name[0]}</div>
                           <div>
                              <p className="text-sm font-black text-white uppercase italic">{u.name}</p>
                              <p className="text-[9px] text-white/20 uppercase tracking-widest">{u.dept} • {u.role}</p>
                           </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><Edit3 size={16}/></button>
                           <button className="p-3 bg-rose-500/10 rounded-xl text-rose-500/40 hover:text-rose-500 transition-all"><Trash2 size={16}/></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* TAB: PERMISSIONS */}
           {activeTab === 'PERMISSIONS' && (
             <div className="space-y-10 animate-in zoom-in-95 duration-500">
                <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl space-y-3">
                   <div className="flex items-center gap-3 text-amber-500">
                      <ShieldAlert size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">Authority_Matrix_Warning</span>
                   </div>
                   <p className="text-[10px] text-amber-500/60 uppercase leading-relaxed tracking-wider">Modifying permission nodes affects global terminal command availability. Misconfiguration may result in module lockout.</p>
                </div>

                <div className="atomic-glass rounded-[40px] border-white/5 overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-white/[0.01] text-[9px] font-black uppercase text-white/20 tracking-widest">
                         <tr><th className="p-6">Capability</th><th className="p-6">Admin</th><th className="p-6">Manager</th><th className="p-6">User</th></tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {['Capital Burn Access', 'Revenue Visualization', 'Workforce Management', 'Vault Encryption'].map(cap => (
                           <tr key={cap}>
                              <td className="p-6 text-[11px] font-black text-white uppercase italic">{cap}</td>
                              <td className="p-6"><div className="w-4 h-4 bg-[#00FFA3] rounded-full shadow-[0_0_8px_#00FFA3]" /></td>
                              <td className="p-6"><div className="w-4 h-4 bg-[#00FFA3]/40 rounded-full border border-[#00FFA3]" /></td>
                              <td className="p-6"><div className="w-4 h-4 bg-white/5 rounded-full border border-white/10" /></td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
           )}

           {/* TAB: TAXONOMY */}
           {activeTab === 'TAXONOMY' && (
             <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="atomic-glass p-8 rounded-[40px] border-white/5 space-y-6">
                      <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Expense_Sectors</h3>
                      <div className="flex flex-wrap gap-2">
                         {categories.expense.map(c => <span key={c} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-3">{c} <X size={12} className="text-white/20 hover:text-rose-500 cursor-pointer"/></span>)}
                         <button className="px-4 py-2 bg-[#FF6EC7]/10 border border-[#FF6EC7]/20 rounded-xl text-[9px] font-black text-[#FF6EC7] uppercase tracking-widest flex items-center gap-2"><Plus size={12}/> New Sector</button>
                      </div>
                   </div>
                   <div className="atomic-glass p-8 rounded-[40px] border-white/5 space-y-6">
                      <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Revenue_Sectors</h3>
                      <div className="flex flex-wrap gap-2">
                         {categories.income.map(c => <span key={c} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-3">{c} <X size={12} className="text-white/20 hover:text-rose-500 cursor-pointer"/></span>)}
                         <button className="px-4 py-2 bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-xl text-[9px] font-black text-[#00D4FF] uppercase tracking-widest flex items-center gap-2"><Plus size={12}/> New Sector</button>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* TAB: AESTHETICS */}
           {activeTab === 'AESTHETICS' && (
             <div className="space-y-12 animate-in fade-in duration-500">
                <div className="space-y-6">
                   <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">Neural_Spectrum_Profile</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {['Deep Emerald', 'Neon Cyber', 'Spectral Rose', 'Atomic Amber'].map(t => (
                        <button key={t} onClick={() => setTheme(t)} className={`p-6 rounded-[32px] border transition-all text-center flex flex-col items-center gap-4 ${theme === t ? 'bg-white/10 border-white/40 shadow-xl scale-105' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                           <div className={`w-12 h-12 rounded-2xl shadow-lg ${t === 'Deep Emerald' ? 'bg-[#00FFA3]' : t === 'Neon Cyber' ? 'bg-[#00D4FF]' : t === 'Spectral Rose' ? 'bg-[#FF6EC7]' : 'bg-[#FFD500]'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${theme === t ? 'text-white' : 'text-white/40'}`}>{t}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="pt-10 border-t border-white/5 space-y-8">
                   <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">Kinetic_Calibrations</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <RangeGroup label="Animation Velocity" value="84%" />
                      <RangeGroup label="Glass Refraction Depth" value="28px" />
                   </div>
                </div>
             </div>
           )}

           {/* TAB: SOVEREIGNTY */}
           {activeTab === 'SOVEREIGNTY' && (
             <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="atomic-glass p-8 rounded-[40px] border-white/5 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-white/5 rounded-2xl text-[#00FFA3]"><Download size={24}/></div>
                         <h4 className="text-lg font-black text-white uppercase italic">Local_Export</h4>
                      </div>
                      <p className="text-[10px] text-white/30 uppercase leading-relaxed tracking-widest">Generate an immutable JSON artifact containing all synchronized terminal records.</p>
                      <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-[#00FFA3] hover:text-black transition-all">Download Artifact</button>
                   </div>
                   <div className="atomic-glass p-8 rounded-[40px] border-white/5 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-white/5 rounded-2xl text-[#00D4FF]"><RefreshCcw size={24}/></div>
                         <h4 className="text-lg font-black text-white uppercase italic">Neural_Cloud_Sync</h4>
                      </div>
                      <p className="text-[10px] text-white/30 uppercase leading-relaxed tracking-widest">Restore terminal state from your persistent encrypted neural backup nodes.</p>
                      <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] hover:bg-[#00D4FF] hover:text-black transition-all">Restore_State</button>
                   </div>
                </div>
             </div>
           )}

           {/* TAB: SECURITY */}
           {activeTab === 'SECURITY' && (
             <div className="space-y-10 animate-in fade-in duration-500">
                <div className="space-y-6">
                   <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">Auth_Protocols</h3>
                   <div className="space-y-4">
                      <ToggleBtn label="Biometric Authority Requirement" desc="Ask for neural verification for every strategic allocation." active={isBioEnabled} onClick={() => setIsBioEnabled(!isBioEnabled)} icon={Fingerprint} />
                      <ToggleBtn label="Auto-Lockdown Protocol" desc="Automatically sever the neural link after 10 minutes of inactivity." active={true} icon={Clock} />
                      <ToggleBtn label="Ghost Mode Navigation" desc="Obfuscate high-value valuations in public view environments." active={false} icon={EyeOff} />
                   </div>
                </div>
             </div>
           )}

           {/* TAB: LFG (LANGUAGES) */}
           {activeTab === 'LFG' && (
             <div className="space-y-12 animate-in zoom-in-95 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {['English', 'Arabic', 'Bangla'].map(l => (
                     <button key={l} onClick={() => setLanguage(l)} className={`p-8 rounded-[40px] border transition-all text-left flex items-center justify-between group ${language === l ? 'bg-[#00FFA3]/10 border-[#00FFA3]/40' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                        <div className="space-y-2">
                           <p className={`text-xl font-black uppercase italic ${language === l ? 'text-[#00FFA3]' : 'text-white'}`}>{l}</p>
                           <p className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-black">Neural_Dictionary_v4</p>
                        </div>
                        {language === l && <ShieldCheck size={20} className="text-[#00FFA3]" />}
                     </button>
                   ))}
                </div>
             </div>
           )}

        </main>
      </div>
    </div>
  );
};

// UI Components
const NavBtn: React.FC<{ active: boolean, icon: any, label: string, onClick: () => void }> = ({ active, icon: Icon, label, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-500 group ${active ? 'bg-white/10 border border-white/20 shadow-xl' : 'hover:bg-white/[0.04]'}`}>
     <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl transition-all duration-500 ${active ? 'bg-[#00FFA3] text-black shadow-lg shadow-[#00FFA3]/20' : 'bg-white/5 text-white/20 group-hover:text-white/40'}`}>
           <Icon size={18} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}>{label}</span>
     </div>
     {active && <ChevronRight size={14} className="text-[#00FFA3]" />}
  </button>
);

const FieldGroup: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 space-y-2 group hover:border-white/20 transition-all">
     <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] px-1">{label}</label>
     <input defaultValue={value} className="w-full bg-transparent border-none text-white font-black text-sm uppercase italic outline-none placeholder:text-white/10" />
  </div>
);

const RangeGroup: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="space-y-4">
     <div className="flex justify-between items-center">
        <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">{label}</label>
        <span className="text-[10px] font-black text-[#00FFA3] mono">{value}</span>
     </div>
     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
        <div className="h-full bg-gradient-to-r from-[#00FFA3] to-[#00D4FF] rounded-full shadow-[0_0_10px_rgba(0,255,163,0.5)]" style={{ width: value }} />
     </div>
  </div>
);

const ToggleBtn: React.FC<{ label: string, desc: string, active: boolean, onClick?: () => void, icon: any }> = ({ label, desc, active, onClick, icon: Icon }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between p-6 rounded-[32px] border transition-all group ${active ? 'bg-white/5 border-white/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
     <div className="flex items-center gap-6">
        <div className={`p-4 rounded-2xl transition-all ${active ? 'bg-[#00FFA3]/10 text-[#00FFA3]' : 'bg-white/5 text-white/10'}`}>
           <Icon size={24} />
        </div>
        <div className="text-left">
           <p className={`text-sm font-black uppercase italic ${active ? 'text-white' : 'text-white/40'}`}>{label}</p>
           <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">{desc}</p>
        </div>
     </div>
     <div className={`w-14 h-7 rounded-full p-1 transition-all flex items-center ${active ? 'bg-[#00FFA3] justify-end shadow-[0_0_15px_#00FFA344]' : 'bg-white/10 justify-start'}`}>
        <div className="w-5 h-5 bg-black rounded-full shadow-lg" />
     </div>
  </button>
);

export default SettingsModule;
