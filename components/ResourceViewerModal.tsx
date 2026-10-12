
import React, { useState, useEffect } from 'react';
import { X, Globe, Youtube, MonitorPlay, ExternalLink, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { ResourceItem } from '../types';
import { getYouTubeID } from '../constants';

interface ResourceViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    resource: ResourceItem | null;
}

const ResourceViewerModal: React.FC<ResourceViewerModalProps> = ({ isOpen, onClose, resource }) => {
    const [playVideo, setPlayVideo] = useState(false);

    // Reset state when resource changes
    useEffect(() => {
        setPlayVideo(false);
    }, [resource]);

    if (!isOpen || !resource) return null;

    const youtubeId = getYouTubeID(resource.url);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`w-full ${playVideo && youtubeId ? 'max-w-6xl bg-black border-none' : 'max-w-lg bg-[#0a0a0a] border border-white/10'} rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col`}>
                
                {/* Header (Only show full header for non-video to keep cinema mode immersive) */}
                {!(playVideo && youtubeId) && (
                    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <Globe size={18} className="text-slate-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider truncate max-w-[200px] sm:max-w-md">{resource.title}</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Content Logic */}
                {youtubeId && !playVideo ? (
                     // YOUTUBE CHOICE INTERFACE
                     <div className="p-8">
                         <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-2 relative group">
                                <div className="absolute inset-0 rounded-full border border-red-500 opacity-20 animate-[ping_2s_ease-in-out_infinite]"></div>
                                <Youtube size={32} className="text-red-500 relative z-10" />
                            </div>

                            <div>
                                <h4 className="text-2xl font-display font-bold text-white mb-2">Video Signal Detected</h4>
                                <p className="text-sm text-slate-400 font-medium text-balance">
                                    This resource contains a video stream. How would you like to proceed?
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 w-full">
                                <button 
                                    onClick={() => setPlayVideo(true)}
                                    className="w-full py-4 bg-[#E11D48] text-white font-bold uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-[#be123c] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
                                >
                                    <MonitorPlay size={16} /> Initialize Cinema Mode
                                </button>
                                
                                <div className="flex gap-3">
                                    <a 
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={onClose}
                                        className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink size={14} /> Open Externally
                                    </a>
                                    <button 
                                        onClick={onClose}
                                        className="py-4 px-6 bg-white/5 border border-white/10 text-slate-500 font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                         </div>
                     </div>
                ) : youtubeId && playVideo ? (
                    // CINEMA MODE PLAYER (RESPONSIVE 16:9)
                    <div className="relative w-full bg-black flex flex-col group overflow-hidden">
                        {/* Immersive Controls Header */}
                        <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-between items-start pointer-events-none">
                            <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-lg font-bold text-white drop-shadow-lg">{resource.title}</h3>
                                <p className="text-[10px] text-[#E11D48] font-mono font-bold mt-1 tracking-widest uppercase">Streaming from Secure Vault Node</p>
                            </div>
                            <button onClick={onClose} className="pointer-events-auto p-3 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 text-white transition-all hover:scale-110 active:scale-95">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Aspect Ratio Container (16:9) */}
                        <div className="relative w-full pb-[56.25%] bg-[#050505]">
                            <iframe 
                                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0`}
                                title="YouTube video player"
                                className="absolute inset-0 w-full h-full border-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                        
                        {/* Footer Status Bar */}
                        <div className="h-1 bg-[#E11D48] w-full animate-pulse shadow-[0_0_20px_#E11D48]"></div>
                    </div>
                ) : (
                    // STANDARD REDIRECT CONFIRMATION
                    <div className="p-8">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2 relative group">
                                <div className="absolute inset-0 rounded-full border border-[#E11D48] opacity-20 animate-[ping_2s_ease-in-out_infinite]"></div>
                                <div className="absolute inset-0 rounded-full border border-[#E11D48] opacity-10 animate-[ping_3s_ease-in-out_infinite_delay-100]"></div>
                                <ExternalLink size={32} className="text-[#E11D48] relative z-10" />
                            </div>
                            
                            <div>
                                <h4 className="text-2xl font-display font-bold text-white mb-2">Initiate External Link Jump?</h4>
                                <p className="text-sm text-slate-400 font-mono break-all bg-black/50 p-4 rounded-xl border border-white/5 mx-auto max-w-sm">
                                    {resource.url}
                                </p>
                            </div>

                            <div className="flex items-start gap-3 bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-xl text-left w-full">
                                <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-200/80 leading-relaxed font-medium">
                                    You are leaving the secure PrepTracker Vault environment. We cannot verify the integrity of external nodes. Proceed with caution.
                                </p>
                            </div>

                            <div className="flex gap-4 w-full pt-4">
                                <button 
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 text-slate-400 font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    Abort
                                </button>
                                <a 
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-white text-black font-bold uppercase text-xs tracking-widest rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                                >
                                    Proceed <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceViewerModal;