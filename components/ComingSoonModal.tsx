
import React from 'react';
import { Construction } from 'lucide-react';

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose, feature = "System Module" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E11D48]/20 blur-[50px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative group">
                        <div className="absolute inset-0 rounded-full border border-[#E11D48] opacity-20 animate-[ping_3s_ease-in-out_infinite]"></div>
                        <Construction size={28} className="text-[#E11D48]" />
                    </div>

                    <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-tight">
                        Under Construction
                    </h3>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse"></span>
                        <p className="text-[10px] font-mono font-bold text-[#E11D48] uppercase tracking-widest">
                            {feature} Locked
                        </p>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed mb-8 font-medium">
                        This module is currently being engineered by our development team. Access will be restored in the upcoming patch v9.1.
                    </p>

                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-white text-black font-bold uppercase text-[10px] tracking-[0.25em] rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        Acknowledge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonModal;
