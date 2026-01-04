import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Type, FunctionDeclaration } from '@google/genai';
import { 
  Mic, MicOff, Zap, Sparkles, Activity, BrainCircuit, 
  ShieldCheck, X, Send, MessageSquare, Maximize2, Move,
  Volume2, VolumeX, Headphones
} from 'lucide-react';
import { mockDb, currentUser } from '../store';

const SYSTEM_TOOLS: FunctionDeclaration[] = [
  {
    name: 'lock_financial_registry',
    parameters: {
      type: Type.OBJECT,
      description: 'Immediately locks all financial records from further editing.',
      properties: {
        reason: { type: Type.STRING, description: 'The audit reason for locking.' }
      },
      required: ['reason']
    }
  }
];

const YusraVoice: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [position, setPosition] = useState({ x: window.innerWidth - 120, y: window.innerHeight - 180 });
  const [isDragging, setIsDragging] = useState(false);
  const [volume, setVolume] = useState(0); 
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Smooth dragging
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMove = (e: any) => {
      if (!isDragging) return;
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      setPosition({
        x: Math.min(Math.max(20, clientX - 48), window.innerWidth - 120),
        y: Math.min(Math.max(20, clientY - 48), window.innerHeight - 120)
      });
    };
    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  // Visual feedback for sound
  useEffect(() => {
    let int: number;
    if (isActive) {
      int = window.setInterval(() => setVolume(Math.random() * 100), 100);
    } else {
      setVolume(0);
    }
    return () => clearInterval(int);
  }, [isActive]);

  const startSession = async () => {
    if (isConnecting || isActive) return;
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: SYSTEM_TOOLS }],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: `You are YUSRA, the Neural Chief Operating Officer. You are strategic, human-like, and authoritative. Speak concisely.`,
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            if (!audioContextRef.current || !streamRef.current) return;
            const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
            const scriptProcessor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const bytes = new Uint8Array(int16.buffer);
              let binary = '';
              for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
              const base64 = btoa(binary);
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const binary = atob(msg.serverContent.modelTurn.parts[0].inlineData.data);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              const dataInt16 = new Int16Array(bytes.buffer);
              const buffer = audioContextRef.current!.createBuffer(1, dataInt16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
              const source = audioContextRef.current!.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current!.destination);
              source.start();
            }
            if (msg.serverContent?.outputTranscription) {
              const text = msg.serverContent.outputTranscription.text;
              setTranscript(text);
              if (msg.serverContent.turnComplete) setChatHistory(prev => [...prev, {role: 'ai', text}]);
            }
          },
          onerror: () => stopSession(),
          onclose: () => stopSession()
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setIsConnecting(false);
      stopSession();
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (sessionRef.current) sessionRef.current.close();
  };

  return (
    <>
      {/* Yusra Dynamic Neural Orb */}
      <div 
        ref={dragRef}
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={() => !isDragging && setIsChatOpen(true)}
        className={`fixed z-[1000] w-24 h-24 rounded-full cursor-grab active:cursor-grabbing transition-transform flex items-center justify-center ${isDragging ? 'scale-90 opacity-80' : 'hover:scale-110'}`}
      >
        {/* Animated Spectrum Rings */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full bg-[#00FFA3]/20 neural-wave" />
            <div className="absolute inset-[-12px] rounded-full bg-[#00D4FF]/10 neural-wave" style={{animationDelay: '0.4s'}} />
            <div className="absolute inset-[-24px] rounded-full bg-[#FF6EC7]/5 neural-wave" style={{animationDelay: '0.8s'}} />
          </>
        )}
        
        {/* The Chromatic Core */}
        <div className={`relative w-20 h-20 rounded-full orb-gradient p-[2px] shadow-[0_0_60px_rgba(0,255,163,0.4)] transition-all duration-1000 ${isActive ? 'scale-110 brightness-125' : 'grayscale-[40%]'}`}>
          <div className="w-full h-full rounded-full bg-[#05070a] flex items-center justify-center overflow-hidden border border-white/20">
            {isConnecting ? (
              <Zap size={32} className="text-[#00FFA3] animate-spin" />
            ) : (
              <BrainCircuit size={40} className={`transition-all duration-1000 ${isActive ? 'text-[#00FFA3] scale-110 drop-shadow-[0_0_10px_#00FFA3]' : 'text-white/20'}`} />
            )}
            
            {/* Visualizer bars */}
            {isActive && (
               <div className="absolute bottom-4 flex gap-[2px] items-end h-4">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-[#00FFA3] rounded-full transition-all duration-150 shadow-[0_0_10px_#00FFA3]" 
                      style={{ height: `${20 + (volume * Math.random())}%` }} 
                    />
                  ))}
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Chromatic Chat */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[1100] bg-[#020408]/90 backdrop-blur-3xl p-4 lg:p-12 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-full max-w-2xl h-[85vh] atomic-glass rounded-[64px] flex flex-col overflow-hidden border-white/10 shadow-[0_0_100px_rgba(0,212,255,0.2)]">
            
            <header className="p-10 border-b border-white/5 bg-gradient-to-r from-[#00FFA3]/10 via-[#00D4FF]/10 to-[#FF6EC7]/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[28px] bg-[#00FFA3] flex items-center justify-center text-black shadow-[0_0_20px_#00FFA3]">
                  <Sparkles size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Yusra_Neural_Link</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-[#00FFA3] animate-pulse shadow-[0_0_15px_#00FFA3]' : 'bg-white/10'}`} />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{isActive ? 'CHANNEL_STABLE' : 'STANDBY_PROTOCOLS'}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-5 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
                <X size={28} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-gradient-to-b from-transparent via-[#05070a]/50 to-transparent">
              {chatHistory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20">
                  <Headphones size={100} className="text-white" />
                  <p className="text-[12px] font-black uppercase tracking-[0.5em] max-w-xs leading-loose">Initialize the neural handshake to begin strategic synthesis.</p>
                </div>
              )}
              {chatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}>
                  <div className={`max-w-[85%] p-7 rounded-[40px] text-[11px] font-black uppercase tracking-widest leading-relaxed shadow-2xl ${
                    chat.role === 'user' 
                      ? 'bg-gradient-to-tr from-[#00D4FF] via-[#A855F7] to-[#FF6EC7] text-black italic' 
                      : 'bg-white/[0.05] border border-white/10 text-white'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {isActive && transcript && (
                <div className="flex justify-start">
                   <div className="max-w-[85%] p-7 rounded-[40px] text-[11px] font-black uppercase tracking-widest leading-relaxed bg-[#00FFA3]/5 border border-[#00FFA3]/30 text-[#00FFA3] animate-pulse">
                    {transcript}
                  </div>
                </div>
              )}
            </div>

            <footer className="p-10 border-t border-white/5 bg-white/[0.02]">
              <div className="flex gap-6">
                <button 
                  onClick={() => isActive ? stopSession() : startSession()}
                  className={`p-7 rounded-[32px] transition-all shadow-2xl group flex items-center justify-center ${isActive ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-[#00FFA3] text-black hover:scale-105 shadow-[#00FFA3]/20'}`}
                >
                  {isActive ? <MicOff size={32}/> : <Mic size={32} className="group-hover:scale-110" />}
                </button>
                <div className="flex-1 relative">
                  <input 
                    placeholder="QUERY NEURAL CORE..." 
                    className="w-full h-full bg-white/5 border border-white/10 rounded-[32px] px-10 text-[11px] font-black text-white uppercase outline-none focus:border-[#00D4FF]/40 transition-all placeholder:text-white/10"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 p-5 text-[#00D4FF] hover:scale-110 transition-transform">
                    <Send size={28} />
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default YusraVoice;