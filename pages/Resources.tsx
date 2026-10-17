
import React, { useState, useEffect, useRef } from 'react';
import { Search, Video, FileText, Download, FolderOpen, ArrowUpRight, Database, Command, Hash, Plus, X, Globe, Youtube, ExternalLink, Link as LinkIcon, AlertTriangle, Play, MonitorPlay, ChevronDown, Layers, Check, Trash2, CheckSquare, Square, MousePointer2 } from 'lucide-react';
import { SUBJECTS, getYouTubeID } from '../constants';
import { ResourceItem } from '../types';
import ResourceViewerModal from '../components/ResourceViewerModal';
import { useModalA11y } from '../components/useModalA11y';
import { useData } from '../context/DataContext';

// --- TYPES ---

interface SelectOption {
    label: string;
    value: string;
    sub?: string;
}

// --- COMPONENTS ---

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, count }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, count: number }) => {
    const dialogRef = useModalA11y(isOpen, onClose);
    if (!isOpen) return null;
    return (
        <div role="dialog" aria-modal="true" aria-label="Confirm deletion" ref={dialogRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-[#0a0a0a] border border-red-500/30 rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-4 text-red-500">
                    <AlertTriangle size={24} />
                    <h3 className="text-lg font-display font-bold">Confirm Deletion</h3>
                </div>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                    Permanently delete <span className="text-white font-bold">{count}</span> selected resource{count > 1 ? 's' : ''}?
                    <br/><span className="text-xs text-slate-600 mt-2 block font-mono">This action cannot be undone.</span>
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-900/20 transition-all">Delete</button>
                </div>
            </div>
        </div>
    );
}

// 1. Custom Aesthetic Select Component
const CustomSelect = ({ label, options, value, onChange, placeholder = "Select..." }: { label: string, options: SelectOption[], value: string, onChange: (val: string) => void, placeholder?: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">{label}</label>
            
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-all duration-300 ${
                    isOpen ? 'border-[#F63C49] shadow-[0_0_15px_rgba(246,60,73,0.1)]' : 'border-white/10 hover:border-white/20'
                }`}
            >
                <div className="flex flex-col items-start text-left">
                     {selectedOption ? (
                        <>
                            <span className="text-white font-medium">{selectedOption.label}</span>
                            {selectedOption.sub && <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">{selectedOption.sub}</span>}
                        </>
                     ) : (
                        <span className="text-slate-500">{placeholder}</span>
                     )}
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#F63C49]' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
                        >
                            <div className="flex flex-col">
                                <span className={`text-sm font-medium ${value === opt.value ? 'text-[#F63C49]' : 'text-slate-300 group-hover:text-white'}`}>
                                    {opt.label}
                                </span>
                                {opt.sub && <span className="text-[9px] text-slate-600 font-mono uppercase tracking-wider">{opt.sub}</span>}
                            </div>
                            {value === opt.value && <Check size={14} className="text-[#F63C49]" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ResourceCardProps {
    item: ResourceItem;
    onClick: () => void;
    isSelectionMode: boolean;
    isSelected: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ item, onClick, isSelectionMode, isSelected }) => {
    const isYoutube = getYouTubeID(item.url);

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={isSelectionMode ? isSelected : undefined}
            className={`group relative border rounded-xl p-6 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer hover:-translate-y-1 text-left w-full ${
                isSelected 
                ? 'bg-[#F63C49]/10 border-[#F63C49] shadow-[0_0_20px_rgba(246,60,73,0.15)]' 
                : 'surface-1 hover:border-[#F63C49]/50 hover:shadow-xl hover:shadow-[#F63C49]/5'
            }`}
        >
            {/* Hover Scan Effect - disabled if selected or in selection mode */}
            {!isSelectionMode && (
                <div className="pointer-events-none absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F63C49] to-transparent -translate-x-full group-hover:animate-[scan_1.5s_ease-in-out_infinite]"></div>
            )}

            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border ${
                        item.type === 'video' || isYoutube
                        ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                        : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500'
                    }`}>
                        {isYoutube ? <Youtube size={16} /> : item.type === 'video' ? <Video size={16} /> : <FileText size={16} />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">{item.category}</span>
                        <span className="text-[10px] font-bold text-white bg-white/10 px-1.5 py-0.5 rounded w-fit">{item.subject}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isSelectionMode ? (
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isSelected 
                            ? 'bg-[#D61A40] border-[#F63C49] text-white' 
                            : 'bg-transparent border-white/30 text-transparent hover:border-[#F63C49]/50'
                        }`}>
                            <Check size={12} strokeWidth={4} />
                        </div>
                    ) : (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
                            <ArrowUpRight size={16} className="text-white" />
                        </div>
                    )}
                </div>
            </div>

            <p className={`text-lg font-display font-bold mb-2 leading-tight transition-colors line-clamp-2 ${
                isSelected ? 'text-[#F63C49]' : 'text-white group-hover:text-[#F63C49]'
            }`}>
                {item.title}
            </p>

            <div className={`mt-auto pt-6 border-t flex items-center justify-between ${isSelected ? 'border-[#F63C49]/30' : 'border-white/5'}`}>
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors ${item.isSystem ? 'bg-slate-700 group-hover:bg-[#D61A40]' : 'bg-green-500'}`}></span> 
                    {item.isSystem ? `By ${item.author}` : 'Added by you'}
                </span>
            </div>
        </button>
    );
};

const AddResourceModal = ({ isOpen, onClose, onAdd, userSubjects }: { isOpen: boolean, onClose: () => void, onAdd: any, userSubjects: SelectOption[] }) => {
    const [form, setForm] = useState({ title: '', url: '', category: 'notes', subject: '' });
    const dialogRef = useModalA11y(isOpen, onClose);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!form.title || !form.url || !form.subject) return;
        onAdd(form);
        setForm({ title: '', url: '', category: 'notes', subject: '' });
        onClose();
    };

    const categoryOptions: SelectOption[] = [
        { label: 'Lecture Notes (PDF)', value: 'notes', sub: 'Handwritten / Digital' },
        { label: 'Lecture Stream', value: 'lecture streams', sub: 'Video Content' },
        { label: 'Reference Book', value: 'textbooks', sub: 'Standard Material' },
        { label: 'Solved PYQ', value: 'solved pyqs', sub: 'Previous Papers' },
        { label: 'Cheat Sheet', value: 'cheatsheets', sub: 'Quick Revision' },
        { label: 'Other', value: 'other' }
    ];

    return (
        <div role="dialog" aria-modal="true" aria-label="Add new resource" ref={dialogRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
                
                <div className="flex items-center gap-3 mb-8">
                    <LinkIcon size={20} className="text-[#F63C49]" />
                    <h3 className="text-xl font-display font-bold text-white">Add New Resource</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Resource Title</label>
                        <input 
                            type="text" 
                            value={form.title}
                            onChange={e => setForm({...form, title: e.target.value})}
                            placeholder="e.g. FPL Unit 3 Cheat Sheet"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#F63C49] outline-none transition-colors"
                            autoFocus
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Public Access Link</label>
                        <input 
                            type="url" 
                            value={form.url}
                            onChange={e => setForm({...form, url: e.target.value})}
                            placeholder="https://..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#F63C49] outline-none transition-colors font-mono"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <CustomSelect 
                            label="Category" 
                            options={categoryOptions} 
                            value={form.category} 
                            onChange={(val) => setForm({...form, category: val})} 
                        />
                        
                        <CustomSelect 
                            label="Subject Core" 
                            options={userSubjects} 
                            value={form.subject} 
                            onChange={(val) => setForm({...form, subject: val})}
                            placeholder="Select Subject"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={!form.title || !form.url || !form.subject}
                        className="w-full py-4 bg-[#D61A40] hover:bg-[#B3123B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        <Plus size={16} /> Add to Library
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---

const Resources: React.FC = () => {
  const { profile, resources, addResource, deleteResources } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Dynamic Subjects
  const [userSubjectOptions, setUserSubjectOptions] = useState<SelectOption[]>([]);

  // Selection Logic
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewResource, setViewResource] = useState<ResourceItem | null>(null);
  
  // New: Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Load User Subjects on Mount/Profile Change
  useEffect(() => {
      if (profile && profile.selectedSubjects) {
          const opts: SelectOption[] = SUBJECTS
              .filter(s => profile.selectedSubjects.includes(s.id))
              .map(s => ({ label: s.name, value: s.code, sub: s.code }));

          // Add 'General' option if not present
          opts.push({ label: 'General / Other', value: 'GENERAL' });
          setUserSubjectOptions(opts);
      } else {
          setUserSubjectOptions([{ label: 'General', value: 'GENERAL' }]);
      }
  }, [profile]);

  const handleAddResource = (data: { title: string, url: string, category: string, subject: string }) => {
      const newResource: ResourceItem = {
          id: `res_${Date.now()}`,
          type: getYouTubeID(data.url) ? 'video' : 'link',
          title: data.title,
          author: 'YOU',
          downloads: '0',
          subject: data.subject,
          category: data.category,
          url: data.url,
          isSystem: false
      };
      addResource(newResource);
  };

  const toggleSelection = (id: string) => {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(id)) {
          newSelected.delete(id);
      } else {
          newSelected.add(id);
      }
      setSelectedIds(newSelected);
  };

  // Trigger Modal
  const handleBulkDelete = () => {
      if (selectedIds.size === 0) return;
      setIsDeleteModalOpen(true);
  };

  // Actual Delete Logic
  const executeDelete = () => {
      deleteResources(Array.from(selectedIds));
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      setIsDeleteModalOpen(false);
  };

  const filteredResources = resources.filter(res => {
    const matchesTab = activeTab === 'all' || res.category.includes(activeTab) || (activeTab === 'notes (pdf)' && res.type === 'pdf') || (activeTab === 'textbooks' && res.type === 'book');
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      subjectFilter === 'ALL' ||
      (subjectFilter === 'GENERAL' ? res.subject === 'GENERAL' || res.subject === 'GLOBAL' : res.subject === subjectFilter || subjectFilter.startsWith(res.subject));
    return matchesTab && matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-full animate-in fade-in duration-700 pb-20">
      
      {/* Modals */}
      <AddResourceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddResource} 
        userSubjects={userSubjectOptions}
      />
      <ResourceViewerModal isOpen={!!viewResource} onClose={() => setViewResource(null)} resource={viewResource} />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        count={selectedIds.size}
      />

      {/* Cinematic Header */}
      <header className="mb-12 lg:mb-16 border-b border-white/5 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#F63C49] mb-2">
                    <Database size={16} />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">Resource Library</span>
                </div>
                <h1 className="text-6xl lg:text-8xl font-display font-bold text-white tracking-tighter leading-[0.85]">
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Library</span>
                </h1>
            </div>
            
            {/* System Status Indicators */}
            <div className="flex gap-4 lg:gap-8">
                <div className="text-right">
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Items</p>
                    <p className="text-xs font-bold text-white font-mono">{resources.length}</p>
                </div>
            </div>
        </div>
      </header>

      {/* Control Deck */}
      <div className="sticky top-24 lg:top-8 z-30 bg-[#030303]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 mb-8 shadow-2xl transition-all">
         <div className="flex flex-col lg:flex-row gap-4 items-center">
            
            {/* Selection Mode Controls */}
            {isSelectionMode ? (
                <div className="w-full lg:w-auto flex items-center gap-2 bg-[#F63C49]/10 rounded-xl p-1 pr-2 border border-[#F63C49]/30">
                    <div className="px-3 py-2 text-[#F63C49] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <CheckSquare size={16} />
                        {selectedIds.size} Selected
                    </div>
                    <div className="h-6 w-px bg-[#F63C49]/20"></div>
                    <button 
                        onClick={handleBulkDelete}
                        disabled={selectedIds.size === 0}
                        className="px-4 py-2 bg-[#D61A40] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
                    >
                        <Trash2 size={12} /> Delete
                    </button>
                    <button 
                        onClick={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }}
                        className="px-4 py-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => setIsSelectionMode(true)}
                    className="w-full lg:w-auto px-6 py-4 lg:py-0 h-[52px] rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all shrink-0 hover:border-white/20"
                >
                    <MousePointer2 size={16} /> Select
                </button>
            )}

            {/* CLI Search */}
            <div className="flex-1 w-full bg-black/50 rounded-xl border border-white/10 flex items-center px-4 group focus-within:border-[#F63C49]/50 transition-colors">
                <span className="text-[#F63C49] font-mono mr-3 text-lg">{'>'}</span>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources..."
                    className="w-full bg-transparent border-none py-4 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none uppercase tracking-wider"
                />
                <Command size={16} className="text-slate-600" />
            </div>

            {/* Tab Matrix */}
            <div className="flex overflow-x-auto no-scrollbar gap-1 p-1 w-full lg:w-auto">
                {['all', 'notes', 'lecture streams', 'textbooks', 'solved pyqs'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all border border-transparent ${
                            activeTab === tab 
                            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                            : 'text-slate-500 hover:text-white hover:bg-white/5 hover:border-white/10'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
         </div>
      </div>

      {/* Subject filter */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 -mt-6" role="group" aria-label="Filter by subject">
        {[{ label: 'All subjects', value: 'ALL' }, ...userSubjectOptions].map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={subjectFilter === o.value}
            onClick={() => setSubjectFilter(o.value)}
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] whitespace-nowrap border transition-all ${
              subjectFilter === o.value ? 'bg-[#F63C49]/10 border-[#F63C49]/40 text-[#F63C49]' : 'border-white/10 text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {o.value === 'ALL' || o.value === 'GENERAL' ? o.label : o.value}
          </button>
        ))}
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {/* Add New Node Card */}
         <button 
            onClick={() => setIsAddModalOpen(true)}
            className="group relative rounded-xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-[#F63C49]/50 transition-all flex flex-col items-center justify-center p-8 h-[220px] gap-4"
         >
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-[#F63C49] group-hover:bg-[#F63C49]/10 transition-all duration-500">
                 <Plus size={32} />
             </div>
             <p className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Add Resource</p>
         </button>

         {filteredResources.map((item) => (
             <ResourceCard 
                key={item.id} 
                item={item} 
                onClick={() => {
                    if (isSelectionMode) {
                        toggleSelection(item.id);
                    } else {
                        setViewResource(item);
                    }
                }}
                isSelectionMode={isSelectionMode}
                isSelected={selectedIds.has(item.id)}
            />
         ))}
      </div>
    </div>
  );
};

export default Resources;
