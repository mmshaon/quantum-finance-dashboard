import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Users, UserPlus, Briefcase, Video, Mic, MicOff, PhoneOff, 
  Sparkles, BrainCircuit, Activity, FileText, Zap, ShieldCheck, 
  Search, VideoOff, MessageSquare, AlertCircle, TrendingUp, Cpu
} from 'lucide-react';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { mockDb, currentUser } from '../store';
import { useRipple } from '../App';
import { EmployeeRecord } from '../types';

type HRView = 'DIRECTORY' | 'VIDEO_CALL' | 'ANALYTICS';

const HRModule: React.FC = () => {
  const ripple = useRipple();
  const [view, setView] = useState<HRView>('DIRECTORY');
  const [employees] = useState<EmployeeRecord[]>(mockDb.employees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<EmployeeRecord | null>(null);
  const [yusraTranscript, setYusraTranscript] = useState("Initializing neural briefing...");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callTime, setCallTime] = useState(0);

  // AI Participation Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    let timer: any;
    if (view === 'VIDEO_CALL') {
      timer = setInterval(() => setCallTime(prev => prev + 1), 1000);
      initVideoCall();
    } else {
      stopVideoCall();
      setCallTime(0);
    }
    return () => {
      clearInterval(timer);
      stopVideoCall();
    };
  }, [view]);

  const initVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      // Initialize Yusra Voice Participation
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const session = await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `You are YUSRA, the AI Participant in this HR call. 
          The CEO is ${currentUser.fullName}. The Agent being interviewed is ${selectedAgent?.fullName}.
          Current Financial Health: Total Income $${mockDb.income.reduce((a,b)=>a+b.amount,0)}.
          Speak aloud automatically to provide strategic insights during the call.`,
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        },
        callbacks: {
          onmessage: async (msg) => {
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
              playYusraAudio(base64);
            }
            if (msg.serverContent?.outputTranscription) {
              setYusraTranscript(msg.serverContent.outputTranscription.text);
            }
          }
        }
      });
      sessionRef.current = session;
    } catch (err) {
      console.error("NEURAL_COMM_FAILURE", err);
    }
  };

  const playYusraAudio = async (base64: string) => {
    if (!audioContextRef.current) return;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = audioContextRef.current.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  const stopVideoCall = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    if (sessionRef.current) sessionRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const filteredEmployees = employees.filter(e => 
    e.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {view === 'DIRECTORY' ? (
        <>
          <header className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white/[0.02] p-8 rounded-[40px] border border-white/5">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Agent_Directory</h2>
              <p className="text-[10px] text-[#EC4899] font-black uppercase tracking-[0.4em]">Yeaf_Neural_Talent_Registry</p>
            </div>
            <div className="flex bg-white/5 p-4 rounded-3xl border border-white/10 w-full max-w-md">
              <Search size={18} className="text-white/20 mr-4" />
              <input 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="QUERY_AGENT..." 
                className="bg-transparent border-none outline-none text-xs font-black text-white uppercase tracking-widest w-full"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEmployees.map(emp => (
              <div key={emp.id} className="atomic-glass p-8 rounded-[48px] border-white/5 group hover:border-[#EC4899]/50 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#A855F7] flex items-center justify-center font-black text-white text-xl">
                    {emp.fullName[0]}
                  </div>
                  <button 
                    onClick={() => { setSelectedAgent(emp); setView('VIDEO_CALL'); }}
                    className="p-4 bg-[#00FFA3]/10 text-[#00FFA3] rounded-2xl border border-[#00FFA3]/20 hover:bg-[#00FFA3] hover:text-black transition-all"
                  >
                    <Video size={20} />
                  </button>
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic">{emp.fullName}</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{emp.department}</p>
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                   <div className="space-y-1">
                      <p className="text-[8px] text-white/20 uppercase font-black">Efficiency</p>
                      <p className="text-sm font-black text-[#00FFA3] mono">98.5%</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] text-white/20 uppercase font-black">Node_ID</p>
                      <p className="text-[10px] font-black text-white/40 mono">{emp.id}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <section className="fixed inset-0 z-[1000] bg-[#020408] flex flex-col lg:flex-row overflow-hidden animate-in zoom-in-95 duration-500">
          {/* VIDEO FEED */}
          <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
            
            {/* NEURAL HUD */}
            <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none">
              <div className="flex justify-between items-start">
                <div className="atomic-glass p-6 rounded-3xl border-[#00FFA3]/30 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00FFA3] animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural_Sync: SOVEREIGN</span>
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{selectedAgent?.fullName}</h3>
                  <p className="text-[10px] text-[#00FFA3] font-black uppercase tracking-widest">{selectedAgent?.department} // {selectedAgent?.id}</p>
                </div>
                <div className="atomic-glass p-6 rounded-3xl border-rose-500/30 text-right backdrop-blur-xl">
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Temporal_Duration</p>
                  <p className="text-2xl font-black text-white mono">{Math.floor(callTime / 60)}:{(callTime % 60).toString().padStart(2, '0')}</p>
                </div>
              </div>

              {/* CONTROLS */}
              <div className="flex justify-center items-center gap-8 pointer-events-auto pb-12">
                <button onClick={() => setIsMicOn(!isMicOn)} className={`p-6 rounded-full border-2 transition-all ${isMicOn ? 'bg-white/10 border-white/20' : 'bg-rose-600 border-rose-700 shadow-[0_0_30px_#e11d48]'}`}>
                  {isMicOn ? <Mic size={28} /> : <MicOff size={28} />}
                </button>
                <button onClick={() => setView('DIRECTORY')} className="p-8 rounded-full bg-rose-600 text-white border-4 border-rose-900 shadow-[0_0_50px_#e11d48] hover:scale-110 active:scale-95 transition-all">
                  <PhoneOff size={36} />
                </button>
                <button onClick={() => setIsCamOn(!isCamOn)} className={`p-6 rounded-full border-2 transition-all ${isCamOn ? 'bg-white/10 border-white/20' : 'bg-rose-600 border-rose-700'}`}>
                  {isCamOn ? <Video size={28} /> : <VideoOff size={28} />}
                </button>
              </div>
            </div>
          </div>

          {/* YUSRA AI SIDEBAR */}
          <aside className="w-full lg:w-[450px] bg-[#05070a] border-l border-white/10 flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center text-[#00FFA3] shadow-lg">
                <BrainCircuit size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black text-white uppercase italic">Yusra_Voice_AI</h4>
                <p className="text-[9px] text-[#00FFA3] font-black uppercase tracking-[0.3em]">ACTIVE_PARTICIPANT</p>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto space-y-10 custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/20">
                  <Sparkles size={16} className="text-[#00FFA3]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Neural_Insight_Feed</span>
                </div>
                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl border-l-4 border-l-[#00FFA3] italic text-xs text-white/80 leading-relaxed uppercase tracking-wider font-medium">
                  "{yusraTranscript}"
                </div>
              </div>

              <div className="space-y-6">
                <h5 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Agent_Metrics_Overlay</h5>
                <div className="grid grid-cols-2 gap-4">
                  <MetricNode label="Loyalty" val="94%" />
                  <MetricNode label="Yield_Risk" val="LOW" />
                  <MetricNode label="Stress_Index" val="12%" />
                  <MetricNode label="Net_Valuation" val={`$${selectedAgent?.salary.toLocaleString()}`} />
                </div>
              </div>

              <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-3xl space-y-4 mt-auto">
                <div className="flex items-center gap-3 text-rose-500">
                  <Activity size={18} />
                  <span className="text-[10px] font-black uppercase">Crisis_Monitor</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">Yusra is cross-referencing biometric stress spikes with financial audit logs in real-time.</p>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 space-y-4">
              <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <FileText size={16} /> Save_Neural_Transcript
              </button>
              <button className="w-full py-5 bg-[#00FFA3] text-black font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl shadow-xl hover:scale-105 transition-all">
                Execute_Briefing
              </button>
            </div>
          </aside>
        </section>
      )}
    </div>
  );
};

const MetricNode: React.FC<{ label: string, val: string }> = ({ label, val }) => (
  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
    <p className="text-[8px] text-white/20 uppercase font-black mb-1">{label}</p>
    <p className="text-sm font-black text-white mono italic">{val}</p>
  </div>
);

export default HRModule;