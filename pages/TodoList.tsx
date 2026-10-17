import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import {
  Plus,
  Trash2,
  Calendar,
  CheckSquare,
  Flame,
  Clock,
  Briefcase,
  BookOpen,
  FlaskConical,
  X,
  Check,
  ChevronDown,
  Loader2,
  Pencil,
  SlidersHorizontal
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Task, Priority, TaskCategory as Category } from '../types';

// --- CONSTANTS ---
const CATEGORY_CONFIG: Record<Category, { color: string, icon: any, label: string }> = {
  EXAM: { color: 'text-red-400', icon: Flame, label: 'Exam Prep' },
  LAB: { color: 'text-cyan-400', icon: FlaskConical, label: 'Lab Work' },
  SUBMISSION: { color: 'text-yellow-400', icon: Briefcase, label: 'Submission' },
  GENERAL: { color: 'text-slate-400', icon: BookOpen, label: 'General' }
};

const PRIORITY_CONFIG: Record<Priority, { color: string, border: string, glow: string }> = {
  CRITICAL: { color: 'text-[#F63C49]', border: 'border-[#F63C49]', glow: 'shadow-[0_0_15px_rgba(246,60,73,0.15)]' },
  NORMAL: { color: 'text-blue-400', border: 'border-blue-500/50', glow: '' },
  LOW: { color: 'text-slate-400', border: 'border-slate-700', glow: '' }
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
        className={`w-full bg-white/5 border rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 ${
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

  // --- Horizon grouping ---
  const todayStr = new Date().toISOString().slice(0, 10);
  const horizonOf = (t: Task): 'overdue' | 'today' | 'upcoming' | 'anytime' => {
    if (!t.dueDate) return 'anytime';
    if (t.dueDate < todayStr) return 'overdue';
    if (t.dueDate === todayStr) return 'today';
    return 'upcoming';
  };
  const activeTasks = filteredTasks.filter(t => !t.completed);
  const doneTasks = filteredTasks.filter(t => t.completed);
  const HORIZONS: { key: 'overdue' | 'today' | 'upcoming' | 'anytime'; label: string; tone: string }[] = [
    { key: 'overdue', label: 'Overdue', tone: 'text-[#F63C49]' },
    { key: 'today', label: 'Today', tone: 'text-white' },
    { key: 'upcoming', label: 'Upcoming', tone: 'text-slate-400' },
    { key: 'anytime', label: 'Anytime', tone: 'text-slate-500' },
  ];
  const groups = HORIZONS.map(h => ({ ...h, items: activeTasks.filter(t => horizonOf(t) === h.key) })).filter(g => g.items.length > 0);
  const showCompletedGroup = filter !== 'ACTIVE' && doneTasks.length > 0;

  const [detailsOpen, setDetailsOpen] = useState(false);

  const renderRow = (task: Task) => {
    const catConfig = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG['GENERAL'];
    const CategoryIcon = catConfig.icon;
    const spine = task.priority === 'CRITICAL'
      ? 'bg-[#F63C49] shadow-[0_0_10px_rgba(246,60,73,0.5)]'
      : task.priority === 'LOW' ? 'bg-white/10' : 'bg-white/25';
    const overdue = !task.completed && task.dueDate && task.dueDate < todayStr;
    return (
      <div
        key={task.id}
        className={`group relative surface-1 rounded-2xl pl-5 pr-3 py-3.5 transition-all duration-300 hover:border-white/15 flex items-center gap-3.5 ${task.completed ? 'opacity-45' : ''}`}
      >
        <span className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${spine}`}></span>

        <button
          onClick={() => toggleTask(task.id)}
          aria-label={task.completed ? `Mark not done: ${task.text}` : `Mark done: ${task.text}`}
          aria-pressed={task.completed}
          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
            task.completed
              ? 'bg-[#F63C49] border-[#F63C49] text-white'
              : 'bg-transparent border-white/25 hover:border-[#F63C49] text-transparent hover:text-[#F63C49]/40'
          }`}
        >
          <Check size={12} strokeWidth={3.5} />
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug ${task.completed ? 'text-slate-500 line-through decoration-slate-700' : 'text-slate-100'}`}>
            {task.text}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className={`text-[9px] font-bold flex items-center gap-1 uppercase tracking-wider ${task.category === 'EXAM' ? 'text-[#F63C49]/80' : 'text-slate-500'}`}>
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
                  <Link to={`/subject/${unitLabel(task.unitId)!.subjectId}`} className="text-[9px] font-bold uppercase tracking-wider text-slate-400 hover:text-white border border-white/10 rounded px-1.5 py-0.5 transition-colors">
                    {unitLabel(task.unitId)!.text}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setEditingUnitTaskId(task.id)}
                  aria-label={task.unitId ? `Change linked unit for task: ${task.text}` : `Link a unit to task: ${task.text}`}
                  title={task.unitId ? 'Change linked unit' : 'Link a unit'}
                  className="lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 text-slate-600 hover:text-white rounded p-0.5 transition-all"
                >
                  <Pencil size={10} />
                </button>
              </>
            )}

            {task.dueDate && (
              <span className={`text-[9px] font-mono flex items-center gap-1 uppercase tracking-wider ${overdue ? 'text-[#F63C49]' : 'text-slate-500'}`}>
                <Clock size={10} />
                {overdue ? 'Due ' : ''}{new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => deleteTask(task.id)}
          aria-label={`Delete task: ${task.text}`}
          className="lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 p-2 text-slate-600 hover:text-[#F63C49] transition-all rounded-lg hover:bg-white/5"
        >
          <X size={15} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="max-w-3xl mx-auto">

        {/* Working header: compact, progress inline */}
        <header className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#F63C49] mb-2">
              <CheckSquare size={13} />
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em]">Local Task Management</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tighter leading-none">Tasks</h1>
          </div>
          <div className="text-right">
            <span className="block text-2xl lg:text-3xl font-display font-bold text-white leading-none" data-testid="tasks-done">
              {totalCount === 0 ? '--' : `${completedCount}/${totalCount}`}
            </span>
            <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Done</span>
            <div className="h-1 w-24 lg:w-28 bg-white/5 rounded-full overflow-hidden mt-2 ml-auto">
              <div
                className={`h-full bg-[#F63C49] shadow-[0_0_10px_rgba(246,60,73,0.6)] transition-all duration-700 ease-out ${loading ? 'animate-pulse' : ''}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </header>

        {/* Quick-add composer */}
        <form onSubmit={addTask} className="mb-3">
          <div className="surface-1 rounded-2xl pl-4 pr-2 py-2 flex items-center gap-2 focus-within:border-[#F63C49]/60 transition-colors">
            <Plus size={16} className="text-slate-500 shrink-0" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Add a task, press Enter"
              aria-label="Task title"
              className="flex-1 min-w-0 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-slate-600 font-medium"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setDetailsOpen(v => !v)}
              aria-expanded={detailsOpen}
              aria-label="Task details: priority, category, unit, due date"
              className={`p-2.5 rounded-xl transition-all ${detailsOpen ? 'text-[#F63C49] bg-[#F63C49]/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <SlidersHorizontal size={15} />
            </button>
            <button
              type="submit"
              disabled={!inputText}
              className="px-4 py-2.5 bg-[#D61A40] hover:bg-[#B3123B] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_16px_rgba(246,60,73,0.25)]"
            >
              Add
            </button>
          </div>

          {detailsOpen && (
            <div className="surface-1 rounded-2xl p-5 mt-2 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <CustomSelect label="Priority" value={inputPriority} onChange={(v) => setInputPriority(v as Priority)} options={priorityOptions} />
              <CustomSelect label="Category" value={inputCategory} onChange={(v) => setInputCategory(v as Category)} options={categoryOptions} />
              <CustomSelect label="Unit" value={inputUnit} onChange={(v) => setInputUnit(v)} options={unitOptions} />
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Due</label>
                <div className="relative group">
                  <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#F63C49] transition-colors" />
                  <input
                    type="date"
                    aria-label="Due date"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-xs font-mono text-slate-300 focus:border-[#F63C49] outline-none transition-colors uppercase"
                  />
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex surface-2 p-1 rounded-xl">
            {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="px-3 py-1.5 text-[9px] font-bold text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl uppercase tracking-widest flex items-center gap-2 transition-all"
            >
              <Trash2 size={11} /> Clear Completed
            </button>
          )}
        </div>

        {/* Queue */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 size={40} className="mx-auto text-[#F63C49] animate-spin mb-4" />
            <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
            {/* Empty-state mark (shape from shapes.gallery, recolored brand red) */}
            <svg viewBox="0 0 256 256" aria-hidden="true" className="mx-auto mb-4 w-14 h-14 text-[#F63C49] drop-shadow-[0_0_18px_rgba(246,60,73,0.35)]">
              <path fill="currentColor" fillRule="evenodd" d="M192 0c35.346 0 64 28.654 64 64s-28.654 64-64 64c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64c0 35.346-28.654 64-64 64S0 227.346 0 192s28.654-64 64-64C28.654 128 0 99.346 0 64S28.654 0 64 0s64 28.654 64 64c0-35.346 28.654-64 64-64m-64 100c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28"/>
            </svg>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Nothing queued</p>
            <p className="text-slate-600 text-xs mt-1">Add the next thing above.</p>
          </div>
        ) : (
          <div>
            {groups.map(g => (
              <section key={g.key} className="mb-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${g.tone}`}>{g.label}</span>
                  <span className="text-[9px] font-mono text-slate-600">{g.items.length}</span>
                  <div className="flex-1 h-px bg-white/5"></div>
                </div>
                <div className="space-y-2.5">
                  {g.items.map(renderRow)}
                </div>
              </section>
            ))}
            {showCompletedGroup && (
              <section className="mb-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-slate-500">Completed</span>
                  <span className="text-[9px] font-mono text-slate-600">{doneTasks.length}</span>
                  <div className="flex-1 h-px bg-white/5"></div>
                </div>
                <div className="space-y-2.5">
                  {doneTasks.map(renderRow)}
                </div>
              </section>
            )}
          </div>
        )}
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
