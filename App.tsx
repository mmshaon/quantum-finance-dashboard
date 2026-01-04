
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Receipt, TrendingUp, CreditCard, 
  Warehouse, Users, UserCircle, Settings, Menu, X, 
  ShieldCheck, Sparkles, Search, Bell, LogOut, Brain
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ExpensesModule from './components/ExpensesModule';
import IncomeModule from './components/IncomeModule';
import BillsModule from './components/BillsModule';
import AssetsModule from './components/AssetsModule';
import HRModule from './components/HRModule';
import PersonalModule from './components/PersonalModule';
import SettingsModule from './components/SettingsModule';
import IdeasLab from './components/IdeasLab';
import YusraVoice from './components/YusraVoice';
import AuthGateway from './components/AuthGateway';
import { currentUser } from './store';

export const useRipple = () => {
  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple-effect");
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  };
  return createRipple;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('quantum_session_active') === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Command Deck', icon: LayoutDashboard, color: '#00FFA3' },
    { id: 'ideas', label: 'Ideas Lab', icon: Brain, color: '#00D4FF' },
    { id: 'expenses', label: 'Capital Burn', icon: Receipt, color: '#FF6EC7' },
    { id: 'income', label: 'Revenue Engine', icon: TrendingUp, color: '#00D4FF' },
    { id: 'bills', label: 'Liabilities', icon: CreditCard, color: '#FFD500' },
    { id: 'assets', label: 'Core Valuation', icon: Warehouse, color: '#A855F7' },
    { id: 'hr', label: 'Human Capital', icon: Users, color: '#EC4899' },
    { id: 'personal', label: 'Private Vault', icon: UserCircle, color: '#6366F1' },
    { id: 'settings', label: 'Configurations', icon: Settings, color: '#94A3B8' },
  ];

  if (!isAuthenticated) return <AuthGateway onAuthenticated={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex h-screen bg-[#020408] text-[#ffffff] overflow-hidden font-sans">
      {/* Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-[500] w-72 bg-[#05070a] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={24} className="text-[#00FFA3]" />
              <h1 className="text-xl font-black uppercase italic tracking-tighter">Quantum</h1>
            </div>
            <button className="lg:hidden text-white/40" onClick={() => setSidebarOpen(false)}><X size={20}/></button>
          </div>
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); if(window.innerWidth < 1024) setSidebarOpen(false); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}>
                <item.icon size={20} style={{ color: item.color }} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-8 border-t border-white/5">
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="flex items-center gap-3 text-rose-500/60 hover:text-rose-500 text-[9px] font-black uppercase tracking-widest"><LogOut size={16}/> Terminate_Session</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-20 lg:h-24 border-b border-white/5 bg-[#05070a]/60 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl text-white active:scale-95 transition-all"><Menu size={20}/></button>
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <Search size={14} className="text-white/20" /><input type="text" placeholder="QUERY..." className="bg-transparent border-none outline-none text-[10px] font-black text-white w-32 uppercase" />
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-tr from-[#00FFA3] to-[#00D4FF] flex items-center justify-center font-black text-black shadow-lg">
                {currentUser.fullName[0]}
              </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-12">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'ideas' && <IdeasLab />}
            {activeTab === 'expenses' && <ExpensesModule />}
            {activeTab === 'income' && <IncomeModule />}
            {activeTab === 'bills' && <BillsModule />}
            {activeTab === 'assets' && <AssetsModule />}
            {activeTab === 'hr' && <HRModule />}
            {activeTab === 'personal' && <PersonalModule />}
            {activeTab === 'settings' && <SettingsModule />}
          </div>
        </main>
        
        {/* Yusra - The Dynamic Floating Orb */}
        <YusraVoice />
      </div>

      {isSidebarOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[450]" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default App;