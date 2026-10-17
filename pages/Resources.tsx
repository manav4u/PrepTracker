
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
            className={`group relative w-full flex items-center gap-4 pl-4 pr-3 py-3 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                isSelected
                ? 'bg-[#F63C49]/10 border-[#F63C49]/60'
                : 'border-transparent hover:border-white/10 hover:bg-white/[0.03]'
            }`}
        >
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                item.type === 'video' || isYoutube
                ? 'bg-[#F63C49]/10 border-[#F63C49]/20 text-[#F63C49]'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}>
                {isYoutube ? <Youtube size={14} /> : item.type === 'video' ? <Video size={14} /> : <FileText size={14} />}
            </div>

            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-snug truncate transition-colors ${
                    isSelected ? 'text-[#F63C49]' : 'text-slate-100 group-hover:text-white'
                }`}>
                    {item.title}
                </p>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5 truncate">
                    {item.category} <span className="text-slate-700">/</span> {item.isSystem ? `By ${item.author}` : 'Added by you'}
                </p>
            </div>

            {isSelectionMode ? (
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                    ? 'bg-[#D61A40] border-[#F63C49] text-white'
                    : 'bg-transparent border-white/30 text-transparent hover:border-[#F63C49]/50'
                }`}>
                    <Check size={12} strokeWidth={4} />
                </div>
            ) : (
                <ArrowUpRight size={15} className="shrink-0 text-slate-600 group-hover:text-[#F63C49] transition-colors" />
            )}
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

  // Group the index by subject, following the user's subject order, GENERAL/GLOBAL last
  const subjectName = (code: string) => SUBJECTS.find(x => x.code === code || x.code.replace(/-[A-Z]+$/, '') === code)?.name;
  const groupOrder = (profile?.selectedSubjects || [])
    .map(id => SUBJECTS.find(x => x.id === id)?.code)
    .filter(Boolean) as string[];
  const groupKeys = Array.from(new Set(filteredResources.map(r => r.subject)));
  groupKeys.sort((a, b) => {
    const rank = (k: string) => {
      if (k === 'GENERAL' || k === 'GLOBAL') return 999;
      const i = groupOrder.indexOf(k);
      return i === -1 ? 500 : i;
    };
    return rank(a) - rank(b) || a.localeCompare(b);
  });
  const indexGroups = groupKeys.map(k => ({
    key: k,
    label: k === 'GENERAL' || k === 'GLOBAL' ? 'General' : (subjectName(k) ? `${k} · ${subjectName(k)}` : k),
    items: filteredResources.filter(r => r.subject === k)
  }));

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

      {/* Compact working header */}
      <header className="flex items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#F63C49] mb-2">
            <Database size={13} />
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em]">Resource Library</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tighter leading-none">Library</h1>
        </div>
        <div className="text-right">
          <span className="block text-2xl lg:text-3xl font-display font-bold text-white leading-none">{resources.length}</span>
          <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Items</span>
        </div>
      </header>

      {/* Control bar: search + tabs + select, slim and sticky */}
      <div className="sticky top-24 lg:top-8 z-30 bg-[#030303]/85 backdrop-blur-xl border border-white/5 rounded-2xl p-2 mb-4 shadow-2xl">
         <div className="flex flex-col lg:flex-row gap-2 items-stretch lg:items-center">

            {/* CLI Search */}
            <div className="flex-1 w-full bg-black/50 rounded-xl border border-white/10 flex items-center px-4 group focus-within:border-[#F63C49]/50 transition-colors">
                <span className="text-[#F63C49] font-mono mr-3 text-lg">{'>'}</span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources..."
                    className="w-full bg-transparent border-none py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none uppercase tracking-wider"
                />
                <Command size={16} className="text-slate-600" />
            </div>

            {/* Tab Matrix */}
            <div className="flex overflow-x-auto no-scrollbar gap-1 p-1 w-full lg:w-auto">
                {['all', 'notes', 'lecture streams', 'textbooks', 'solved pyqs'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3.5 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all border border-transparent ${
                            activeTab === tab
                            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                            : 'text-slate-500 hover:text-white hover:bg-white/5 hover:border-white/10'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Selection Mode Controls */}
            {isSelectionMode ? (
                <div className="w-full lg:w-auto flex items-center gap-2 bg-[#F63C49]/10 rounded-xl p-1 pr-2 border border-[#F63C49]/30 shrink-0">
                    <div className="px-3 py-2 text-[#F63C49] font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <CheckSquare size={14} />
                        {selectedIds.size} Selected
                    </div>
                    <div className="h-6 w-px bg-[#F63C49]/20"></div>
                    <button
                        onClick={handleBulkDelete}
                        disabled={selectedIds.size === 0}
                        className="px-3.5 py-2 bg-[#D61A40] text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                    >
                        <Trash2 size={11} /> Delete
                    </button>
                    <button
                        onClick={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }}
                        className="px-3.5 py-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsSelectionMode(true)}
                    className="w-full lg:w-auto px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 font-bold uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 transition-all shrink-0 hover:border-white/20"
                >
                    <MousePointer2 size={13} /> Select
                </button>
            )}
         </div>
      </div>

      {/* Subject filter */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6" role="group" aria-label="Filter by subject">
        {[{ label: 'All subjects', value: 'ALL' }, ...userSubjectOptions].map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={subjectFilter === o.value}
            onClick={() => setSubjectFilter(o.value)}
            className={`px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.12em] whitespace-nowrap border transition-all ${
              subjectFilter === o.value ? 'bg-[#F63C49]/10 border-[#F63C49]/40 text-[#F63C49]' : 'border-white/10 text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {o.value === 'ALL' || o.value === 'GENERAL' ? o.label : o.value}
          </button>
        ))}
      </div>

      {/* Add row */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="group w-full mb-8 rounded-xl border border-dashed border-white/10 hover:border-[#F63C49]/50 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex items-center justify-center gap-3 py-3.5"
      >
        <Plus size={15} className="text-slate-500 group-hover:text-[#F63C49] transition-colors" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Add Resource</span>
      </button>

      {/* The Index: grouped by subject */}
      {filteredResources.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">No resources match</p>
          <p className="text-slate-600 text-xs mt-1">Try another search, tab, or subject.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {indexGroups.map(g => (
            <section key={g.key}>
              <div className="flex items-center gap-3 mb-2 px-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400">{g.label}</span>
                <span className="text-[9px] font-mono text-slate-600">{g.items.length}</span>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>
              <div className="space-y-1">
                {g.items.map((item) => (
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
