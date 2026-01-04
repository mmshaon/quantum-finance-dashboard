import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Fingerprint, ArrowRight, Eye, EyeOff, Key, Globe, Smartphone, AlertCircle, Languages
} from 'lucide-react';
import { useRipple } from '../App';
import { currentUser, GOD_PASSWORD, GOD_USERS } from '../store';

interface AuthGatewayProps {
  onAuthenticated: () => void;
}

type Lang = 'EN' | 'BN' | 'AR';

const translations: Record<Lang, any> = {
  EN: {
    title: 'Quantum_Auth',
    subtitle: 'Sovereign_Control_v6.0',
    idPlaceholder: 'AGENT_IDENTITY_NODE',
    passPlaceholder: 'SECURITY_PASSPHRASE',
    btnLink: 'Establish_Link',
    bioScan: 'Bio_Identity_Scan',
    bioDesc: 'Master-Level Biometric Override',
    handshake: 'Neural_Handshake...',
    verifying: 'Verifying God Mode Protocol',
    error: 'CREDENTIAL_MISMATCH: ACCESS_DENIED',
    footerLeft: 'Global_Sync_Enabled',
    footerRight: 'Secure_Mobile_Core'
  },
  BN: {
    title: 'কোয়ান্টাম_অথ',
    subtitle: 'সার্বভৌম_নিয়ন্ত্রণ_v6.0',
    idPlaceholder: 'এজেন্ট_আইডেন্টিটি_নোড',
    passPlaceholder: 'নিরাপত্তা_পাসফ্রেজ',
    btnLink: 'লিঙ্ক_স্থাপন_করুন',
    bioScan: 'বায়ো_আইডেন্টিটি_স্ক্যান',
    bioDesc: 'মাস্টার-লেভেল বায়োমেট্রিক ওভাররাইড',
    handshake: 'নিউরন_হ্যান্ডশেক...',
    verifying: 'গড মোড প্রোটোকল যাচাই করা হচ্ছে',
    error: 'তথ্য_বেমানান: অ্যাক্সেস_প্রত্যাখ্যাত',
    footerLeft: 'গ্লোবাল_সিঙ্ক_সক্ষম',
    footerRight: 'নিরাপদ_মোবাইল_কোর'
  },
  AR: {
    title: 'توثيق_الكم',
    subtitle: 'التحكم_السيادي_v6.0',
    idPlaceholder: 'عقدة_هوية_الوكيل',
    passPlaceholder: 'عبارة_مرور_الأمان',
    btnLink: 'إنشاء_الارتباط',
    bioScan: 'فحص_الهوية_الحيوية',
    bioDesc: 'تجاوز بيومتري للمستوى المتقدم',
    handshake: 'مصافحة_عصبية...',
    verifying: 'التحقق من بروتوكول وضع الإله',
    error: 'عدم_تطابق_البيانات: تم_رفض_الوصول',
    footerLeft: 'مزامنة_عالمية_مفعلة',
    footerRight: 'نواة_المحمول_الآمنة'
  }
};

const AuthGateway: React.FC<AuthGatewayProps> = ({ onAuthenticated }) => {
  const ripple = useRipple();
  const [lang, setLang] = useState<Lang>('EN');
  const [mode, setMode] = useState<'LOGIN' | 'BIOMETRIC'>('LOGIN');
  const [isScanning, setIsScanning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const t = translations[lang];

  const handleBiometricAuth = () => {
    setMode('BIOMETRIC');
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      localStorage.setItem('quantum_session_active', 'true');
      localStorage.setItem('quantum_god_mode', 'true');
      onAuthenticated();
    }, 2000);
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isPassCorrect = formData.password === GOD_PASSWORD;
    if (isPassCorrect) {
      localStorage.setItem('quantum_session_active', 'true');
      onAuthenticated();
    } else {
      setAuthError(t.error);
      setTimeout(() => setAuthError(null), 3000);
    }
  };

  return (
    <div className={`fixed inset-0 z-[1000] bg-[#020408] flex items-center justify-center p-6 overflow-hidden font-sans ${lang === 'AR' ? 'rtl' : 'ltr'}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00FFA3]/15 blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#FF6EC7]/10 blur-[180px] animate-pulse" />
      </div>

      <div className="w-full max-w-xl relative animate-in fade-in zoom-in-95 duration-1000">
        {/* Language Selector */}
        <div className="flex justify-center gap-4 mb-8">
           {(['EN', 'BN', 'AR'] as Lang[]).map(l => (
             <button key={l} onClick={() => setLang(l)} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${lang === l ? 'bg-white/20 text-white border border-white/20' : 'text-white/20 hover:text-white/50'}`}>
               {l}
             </button>
           ))}
        </div>

        <div className="atomic-glass p-10 md:p-14 rounded-[64px] border-white/10 shadow-[0_0_100px_rgba(0,255,163,0.1)] relative overflow-hidden backdrop-blur-3xl">
          <header className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#00FFA3] to-[#00D4FF] rounded-[32px] shadow-[0_0_50px_rgba(0,255,163,0.3)] mb-4 animate-bounce duration-[4000ms]">
               <ShieldCheck size={40} className="text-black" />
            </div>
            <div className="space-y-1">
               <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none text-glow">{t.title}</h1>
               <p className="text-[10px] font-black text-[#00FFA3] uppercase tracking-[0.4em] opacity-60">{t.subtitle}</p>
            </div>
          </header>

          {mode === 'BIOMETRIC' ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-10">
               <div className="relative">
                  <div className={`w-40 h-40 rounded-full border-4 ${isScanning ? 'border-[#00FFA3] animate-pulse' : 'border-white/10'} flex items-center justify-center`}>
                     <Fingerprint size={80} className={isScanning ? 'text-[#00FFA3]' : 'text-white/20'} />
                  </div>
                  {isScanning && <div className="absolute top-0 left-0 w-full h-1 bg-[#00FFA3] shadow-[0_0_20px_#00FFA3] animate-[scan_2s_infinite] rounded-full" />}
               </div>
               <div className="text-center space-y-2">
                  <h3 className="text-xl font-black text-white uppercase italic">{t.handshake}</h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest italic">{t.verifying}</p>
               </div>
            </div>
          ) : (
            <div className="space-y-8 mt-10">
              <form onSubmit={handleStandardLogin} className="space-y-6">
                 <div className="relative group">
                    <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00FFA3] transition-colors" size={18} />
                    <input 
                      value={formData.username} 
                      onChange={e => setFormData({...formData, username: e.target.value})}
                      placeholder={t.idPlaceholder} 
                      className="w-full bg-white/5 border border-white/10 p-6 pl-14 rounded-3xl text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-[#00FFA3]/40 transition-all" 
                    />
                 </div>
                 <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00FFA3] transition-colors" size={18} />
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      placeholder={t.passPlaceholder} 
                      className="w-full bg-white/5 border border-white/10 p-6 pl-14 rounded-3xl text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-[#00FFA3]/40 transition-all" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                 </div>

                 {authError && <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-[10px] font-black uppercase text-center tracking-widest italic animate-shake">{authError}</div>}

                 <button onMouseDown={ripple} type="submit" className="w-full py-6 bg-[#00FFA3] text-black font-black text-xs uppercase tracking-[0.4em] rounded-[28px] shadow-[0_10px_40px_rgba(0,255,163,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                    {t.btnLink} <ArrowRight size={18} />
                 </button>
              </form>

              <div className="relative flex items-center py-4">
                 <div className="flex-grow border-t border-white/5"></div>
                 <span className="flex-shrink mx-6 text-[9px] font-black text-white/10 uppercase tracking-widest italic">NEURAL_IDENT_LINK</span>
                 <div className="flex-grow border-t border-white/5"></div>
              </div>

              <button onClick={handleBiometricAuth} className="w-full py-6 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center gap-5 group hover:bg-white/10 transition-all border-l-4 border-l-[#00D4FF]">
                 <Fingerprint size={28} className="text-[#00D4FF] group-hover:scale-110 transition-transform" />
                 <div className="text-left">
                    <p className="text-[11px] font-black text-white uppercase italic leading-none">{t.bioScan}</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">{t.bioDesc}</p>
                 </div>
              </button>
            </div>
          )}
          
          <footer className="pt-10 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
             <div className="flex items-center gap-2"><Globe size={12} /> {t.footerLeft}</div>
             <div className="flex items-center gap-2"><Smartphone size={12} /> {t.footerRight}</div>
          </footer>
        </div>
      </div>
      <style>{`
        @keyframes scan { 0% { top: 0% } 50% { top: 100% } 100% { top: 0% } }
        .rtl { direction: rtl; }
        .ltr { direction: ltr; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default AuthGateway;