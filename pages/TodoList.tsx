import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import { 
  Plus, 
  Trash2, 
  Circle, 
  AlertCircle, 
  Calendar, 
  Tag, 
  Filter, 
  CheckSquare, 
  LayoutList,
  Flame,
  Clock,
  Briefcase,
  BookOpen,
  FlaskConical,
  X,
  Check,
  ChevronDown,
  Loader2,
  Pencil
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Task, Priority, TaskCategory as Category } from '../types';

// --- CONSTANTS ---
const CATEGORY_CONFIG: Record<Category, { color: string, icon: any, label: string }> = {
  EXAM: { color: 'text-red-400', icon: Flame, label: 'Exam Prep' },
  LAB: { color: 'text-slate-400', icon: FlaskConical, label: 'Lab Work' },
  SUBMISSION: { color: 'text-slate-400', icon: Briefcase, label: 'Submission' },
  GENERAL: { color: 'text-slate-400', icon: BookOpen, label: 'General' }
};

const PRIORITY_CONFIG: Record<Priority, { color: string, border: string, glow: string }> = {
  CRITICAL: { color: 'text-[#F63C49]', border: 'border-[#F63C49]', glow: 'shadow-[0_0_15px_rgba(246,60,73,0.15)]' },
  NORMAL: { color: 'text-blue-400', border: 'border-blue-500/50', glow: '' },
  LOW: { color: 'text-slate-400', border: 'border-slate-700', glow: '' }
};

const dueWords = (iso: string): { text: string; overdue: boolean } => {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return { text: iso, overdue: false };
  const due = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return { text: 'Today', overdue: false };
  if (diff === 1) return { text: 'Tomorrow', overdue: false };
  if (diff === -1) return { text: 'Yesterday', overdue: true };
  if (diff > 1 && diff < 7) return { text: due.toLocaleDateString('en-GB', { weekday: 'long' }), overdue: false };
  return { text: due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), overdue: diff < 0 };
};

// --- MICRO COMPONENTS ---

const CustomSelect = <T extends string>({ 
  label, 
  value, 
  onChange, 
  options 
}: { 
  label: string, 
  value: T, 
  onChange: (val: T) => void, 
  options: { value: T, label: string, icon?: any, color?: string }[] 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full surface-2 border rounded-2xl px-4 h-12 flex items-center justify-between transition-all duration-300 ${
            isOpen ? 'border-[#F63C49] bg-white/[0.07] shadow-[0_0_15px_rgba(246,60,73,0.1)]' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex items-center gap-3">
            {selectedOption?.icon && <selectedOption.icon size={14} className={selectedOption.color} />}
            {selectedOption?.color && !selectedOption.icon && <div className={`w-2 h-2 rounded-full ${selectedOption.color}`} />}
            <span className={`truncate text-left text-xs font-bold uppercase tracking-wider ${selectedOption?.color && !selectedOption.icon ? 'text-slate-300' : (selectedOption?.icon ? 'text-slate-300' : '')}`}>
                {selectedOption?.label}
            </span>
        </div>
        <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#F63C49]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
                >
                    <div className="flex items-center gap-3">
                         {opt.icon && <opt.icon size={14} className={opt.color || 'text-slate-500'} />}
                         {opt.color && !opt.icon && <div className={`w-2 h-2 rounded-full ${opt.color}`} />}
                         <span className={`text-xs font-bold uppercase tracking-wider ${value === opt.value ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                             {opt.label}
                         </span>
                    </div>
                    {value === opt.value && <Check size={12} className="text-[#F63C49]" />}
                </button>
            ))}
        </div>
      )}
    </div>
  );
};


// --- MAIN COMPONENT ---

const TodoList: React.FC = () => {
  // State
  const { tasks, setTasks, profile } = useData();
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputPriority, setInputPriority] = useState<Priority>('NORMAL');
  const [inputCategory, setInputCategory] = useState<Category>('GENERAL');
  const [inputDate, setInputDate] = useState('');
  const [inputUnit, setInputUnit] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [editingUnitTaskId, setEditingUnitTaskId] = useState<string | null>(null);

  const updateTaskUnit = (id: string, unitId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const { unitId: _drop, ...rest } = t;
      return unitId ? { ...rest, unitId } : rest;
    }));
    setEditingUnitTaskId(null);
  };

  // Handlers
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputText,
      completed: false,
      priority: inputPriority,
      category: inputCategory,
      dueDate: inputDate || '',
      ...(inputUnit ? { unitId: inputUnit } : {}),
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    setInputText('');
    setInputUnit('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const [undo, setUndo] = useState<{ removed: Task[]; label: string } | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const offerUndo = (removed: Task[], label: string) => {
    if (removed.length === 0) return;
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndo({ removed, label });
    undoTimer.current = setTimeout(() => setUndo(null), 7000);
  };

  useEffect(() => () => { if (undoTimer.current) clearTimeout(undoTimer.current); }, []);

  const deleteTask = (id: string) => {
    const removed = tasks.filter(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    offerUndo(removed, 'Task deleted');
  };

  const clearCompleted = () => {
    const removed = tasks.filter(t => t.completed);
    setTasks(prev => prev.filter(t => !t.completed));
    offerUndo(removed, removed.length === 1 ? '1 task cleared' : `${removed.length} tasks cleared`);
  };

  const undoRemove = () => {
    if (!undo) return;
    const back = undo.removed;
    setTasks(prev => [...back.filter(b => !prev.some(p => p.id === b.id)), ...prev]);
    setUndo(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  };

  // Metrics
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Filtering
  const filteredTasks = tasks.filter(t => {
    if (filter === 'ACTIVE') return !t.completed;
    if (filter === 'COMPLETED') return t.completed;
    return true;
  }).sort((a, b) => {
    // Sort: Critical Active First, then Normal, then Low, then Completed
    if (a.completed === b.completed) {
        const pMap = { CRITICAL: 3, NORMAL: 2, LOW: 1 };
        // Safety check for priority
        const pA = pMap[a.priority] || 1;
        const pB = pMap[b.priority] || 1;
        return pB - pA;
    }
    return a.completed ? 1 : -1;
  });

  // Dropdown Options Configuration
  const priorityOptions = [
    { value: 'CRITICAL', label: 'Critical', color: 'bg-[#D61A40]' },
    { value: 'NORMAL', label: 'Normal', color: 'bg-blue-400' },
    { value: 'LOW', label: 'Low', color: 'bg-slate-500' }
  ];

  const unitOptions = [
    { value: '', label: 'No unit' },
    ...SUBJECTS.filter(s => profile?.selectedSubjects?.includes(s.id)).flatMap(s =>
      s.units.map(u => ({ value: u.id, label: `${s.code.replace(/-[A-Z]+$/, '')} · Unit ${u.unit_number}: ${u.title}` }))
    )
  ];
  const unitLabel = (id: string) => {
    for (const s of SUBJECTS) {
      const u = s.units.find(x => x.id === id);
      if (u) return { subjectId: s.id, text: `${s.code.replace(/-[A-Z]+$/, '')} · Unit ${u.unit_number}` };
    }
    return null;
  };

  const categoryOptions = Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
      value: key as Category,
      label: config.label,
      icon: config.icon,
      color: config.color
  }));

  return (
    <div className="min-h-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER */}
      <header className="mb-8 lg:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-white/10 bg-white/[0.03] text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F63C49]"></span>Local Task Management
           </span>
           <h1 className="text-white leading-[0.95]">
              <span className="block text-6xl lg:text-8xl tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>Task List<span className="text-[#F63C49]">.</span></span>
           </h1>
        </div>

        {/* Progress: ivory card, same material as the dashboard streak card */}
        <div className="relative w-full md:w-64 px-5 py-4 rounded-3xl flex flex-col justify-between gap-3 overflow-hidden bg-[linear-gradient(180deg,#FDFBF6_0%,#F6F1E8_52%,#EEE8DC_100%)] shadow-[0_1px_2px_rgba(0,0,0,0.45),0_18px_38px_-22px_rgba(0,0,0,0.85),0_0_34px_-10px_rgba(255,247,235,0.22)]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-black/[0.05] pointer-events-none"></div>
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.05)] pointer-events-none"></div>
            <div className="absolute inset-0 rounded-3xl ring-1 ring-black/[0.06] pointer-events-none"></div>

            <div className="relative flex items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#8a8172]">Tasks done</span>
                    <span className="text-4xl lg:text-5xl font-display font-bold tracking-tighter text-[#17171c] leading-[0.85]" data-testid="tasks-done">{totalCount === 0 ? '--' : `${completedCount}/${totalCount}`}</span>
                </div>
                {totalCount > 0 && <span className="text-4xl lg:text-5xl font-display font-bold tracking-tighter text-[#17171c]/30 leading-[0.85]">{progress}%</span>}
            </div>

            <div className="relative h-1.5 w-full rounded-full bg-black/[0.06] overflow-hidden ring-1 ring-inset ring-black/10">
                <div
                    className={`h-full rounded-full bg-[#F63C49] transition-all duration-700 ease-out ${loading ? 'animate-pulse' : ''}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* INPUT CONSOLE */}
        <div className="lg:col-span-4 space-y-6">
            <div className="surface-1 rounded-3xl p-5 lg:p-7 sticky top-8">
                <div className="flex items-center gap-2 mb-5 text-white/50">
                    <LayoutList size={16} />
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.18em]">Add New Task</h2>
                </div>

                <form onSubmit={addTask} className="space-y-5">
                    
                    {/* Text Input */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Task Title</label>
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ex: Complete Unit 3 PYQs..."
                            className="w-full surface-2 border border-white/10 rounded-2xl px-4 h-12 text-sm text-white focus:border-[#F63C49] outline-none transition-all placeholder:text-slate-600 font-medium"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Custom Dropdowns */}
                        <CustomSelect 
                            label="Priority"
                            value={inputPriority}
                            onChange={(v) => setInputPriority(v as Priority)}
                            options={priorityOptions}
                        />

                        <CustomSelect 
                            label="Category"
                            value={inputCategory}
                            onChange={(v) => setInputCategory(v as Category)}
                            options={categoryOptions}
                        />
                    </div>

                    <CustomSelect
                        label="Linked Unit (Optional)"
                        value={inputUnit}
                        onChange={(v) => setInputUnit(v)}
                        options={unitOptions}
                    />

                    {/* Date Input */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Due date (optional)</label>
                        <div className="relative group">
                            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#F63C49] transition-colors" />
                            <input 
                                type="date" 
                                aria-label="Due date"
                                value={inputDate}
                                onChange={(e) => setInputDate(e.target.value)}
                                className="w-full surface-2 border border-white/10 rounded-2xl pl-10 pr-4 h-12 text-xs font-mono text-slate-300 focus:border-[#F63C49] outline-none transition-colors uppercase"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={!inputText}
                        className="w-full h-12 bg-gradient-to-br from-[#F63C49] to-[#9f1239] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-[0.2em] rounded-2xl transition-all duration-[250ms] flex items-center justify-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_22px_-8px_rgba(246,60,73,0.6)]"
                    >
                        <Plus size={16} /> Add Task
                    </button>
                </form>
            </div>
        </div>

        {/* TASK MATRIX (List) */}
        <div className="lg:col-span-8">
            
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex gap-1">
                    {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 h-10 rounded-full border text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-[250ms] ${
                                filter === f 
                                ? 'text-white border-white/10 bg-gradient-to-br from-[#F63C49] to-[#9f1239] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_22px_-8px_rgba(246,60,73,0.6)]' 
                                : 'border-transparent text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {completedCount > 0 && (
                    <button 
                        onClick={clearCompleted}
                        className="px-4 py-2 text-[10px] font-bold text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl uppercase tracking-widest flex items-center gap-2 transition-all"
                    >
                        <Trash2 size={12} /> Clear Completed
                    </button>
                )}
            </div>

            {/* List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="py-20 text-center">
                        <Loader2 size={48} className="mx-auto text-[#F63C49] animate-spin mb-4" />
                        <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">Loading tasks...</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                        {/* Empty-state mark (shape from shapes.gallery, recolored brand red) */}
                        <svg viewBox="0 0 256 256" aria-hidden="true" className="mx-auto mb-4 w-14 h-14 text-[#F63C49] drop-shadow-[0_0_18px_rgba(246,60,73,0.35)]">
                          <path fill="currentColor" fillRule="evenodd" d="M192 0c35.346 0 64 28.654 64 64s-28.654 64-64 64c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64c0 35.346-28.654 64-64 64S0 227.346 0 192s28.654-64 64-64C28.654 128 0 99.346 0 64S28.654 0 64 0s64 28.654 64 64c0-35.346 28.654-64 64-64m-64 100c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28"/>
                        </svg>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">No Active Tasks</p>
                    </div>
                ) : (
                    filteredTasks.map(task => {
                        // Safety Checks for Configs
                        const catConfig = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG['GENERAL'];
                        const priConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['NORMAL'];
                        const CategoryIcon = catConfig.icon;

                        return (
                            <div 
                                key={task.id}
                                className={`group relative surface-1 rounded-3xl px-5 py-4 lg:px-6 lg:py-5 transition-opacity duration-[250ms] flex items-start gap-4 ${task.completed ? 'opacity-50' : ''}`}
                            >
                                {/* Checkbox */}
                                <button 
                                    onClick={() => toggleTask(task.id)}
                                    aria-label={task.completed ? `Mark not done: ${task.text}` : `Mark done: ${task.text}`}
                                    aria-pressed={task.completed}
                                    className={`
                                        mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-[250ms]
                                        ${task.completed 
                                            ? 'bg-gradient-to-br from-[#F63C49] to-[#9f1239] border-white/10 text-white' 
                                            : 'bg-transparent border-white/25 hover:border-white text-transparent'
                                        }
                                    `}
                                >
                                    <Check size={14} strokeWidth={3} />
                                </button>

                                <div className="flex-1 min-w-0">
                                    <p className={`text-base font-medium leading-snug ${task.completed ? 'text-slate-500 line-through decoration-slate-700' : 'text-white'}`}>
                                        {task.text}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                                        {/* Priority */}
                                        <span className={`text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider ${priConfig.color}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                            {task.priority || 'NORMAL'}
                                        </span>

                                        {/* Category */}
                                        <span className={`text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider ${catConfig.color}`}>
                                            <CategoryIcon size={10} />
                                            {catConfig.label}
                                        </span>

                                        {editingUnitTaskId === task.id ? (
                                            <div className="w-64 max-w-full" onClick={(e) => e.stopPropagation()}>
                                                <CustomSelect
                                                    label="Linked unit"
                                                    value={task.unitId || ''}
                                                    onChange={(v) => updateTaskUnit(task.id, v)}
                                                    options={unitOptions}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                {task.unitId && unitLabel(task.unitId) && (
                                                    <Link to={`/subject/${unitLabel(task.unitId)!.subjectId}`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white border border-white/10 rounded-full px-2 py-0.5">
                                                        {unitLabel(task.unitId)!.text}
                                                    </Link>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingUnitTaskId(task.id)}
                                                    aria-label={task.unitId ? `Change linked unit for task: ${task.text}` : `Link a unit to task: ${task.text}`}
                                                    title={task.unitId ? 'Change linked unit' : 'Link a unit'}
                                                    className="lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 text-slate-500 hover:text-white border border-transparent hover:border-white/10 rounded p-0.5 transition-all"
                                                >
                                                    <Pencil size={10} />
                                                </button>
                                            </>
                                        )}

                                        {/* Due date in plain words */}
                                        {task.dueDate && (() => {
                                            const due = dueWords(task.dueDate);
                                            return (
                                                <span className={`text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider ml-auto ${due.overdue && !task.completed ? 'text-[#F63C49]' : 'text-slate-500'}`}>
                                                    <Clock size={10} />
                                                    {due.text}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => deleteTask(task.id)}
                                    aria-label={`Delete task: ${task.text}`}
                                    className="lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 p-2 -mr-2 text-slate-600 hover:text-red-500 transition-all rounded-lg hover:bg-white/5"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
      </div>
      {undo && (
        <div role="status" className="fixed bottom-28 left-4 right-4 lg:bottom-8 lg:left-auto lg:right-8 lg:w-80 z-[60] bg-[#0a0a0a] border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <span className="text-xs font-bold text-slate-300">{undo.label}</span>
          <button onClick={undoRemove} className="text-[10px] font-bold uppercase tracking-widest text-[#F63C49] hover:text-white px-3 py-2 rounded-lg hover:bg-white/5">Undo</button>
        </div>
      )}
    </div>
  );
};

export default TodoList;
