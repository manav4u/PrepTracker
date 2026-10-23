import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSubjects } from '../context/SubjectsContext';
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
import { FlameIcon, FlaskIcon, PaperStampIcon, OpenBookIcon, SignalBars, TickDraw } from '../components/TaskIcons';
import { useData } from '../context/DataContext';
import { Subject, Task, Priority, TaskCategory as Category } from '../types';

// --- CONSTANTS ---
const CATEGORY_CONFIG: Record<Category, { color: string, icon: any, label: string }> = {
  EXAM: { color: 'text-red-400', icon: FlameIcon, label: 'Exam Prep' },
  LAB: { color: 'text-slate-400', icon: FlaskIcon, label: 'Lab Work' },
  SUBMISSION: { color: 'text-slate-400', icon: PaperStampIcon, label: 'Submission' },
  GENERAL: { color: 'text-slate-400', icon: OpenBookIcon, label: 'General' }
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

const BarsLow = (p: { size?: number; className?: string }) => <SignalBars level={1} {...p} />;
const BarsNormal = (p: { size?: number; className?: string }) => <SignalBars level={2} {...p} />;
const BarsCritical = (p: { size?: number; className?: string }) => <SignalBars level={3} {...p} />;
const PRIORITY_BARS: Record<Priority, 1 | 2 | 3> = { LOW: 1, NORMAL: 2, CRITICAL: 3 };


// One row. Memoised so ticking or swiping one task does not re-render the other few hundred.
interface RowActions {
  edit: (t: Task) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  close: () => void;
  touchStart: (id: string, e: React.TouchEvent) => void;
  touchMove: (id: string, e: React.TouchEvent) => void;
  touchEnd: (id: string) => void;
}
const ACTIONS_W = 144;
const TaskRow = React.memo(function TaskRow({ task, open, dragX, editing, draw, unit, act }: {
  task: Task; open: boolean; dragX: number | null; editing: boolean; draw: boolean;
  unit: { subjectId: string; text: string } | null; act: RowActions;
}) {
  const catConfig = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG['GENERAL'];
  const priConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['NORMAL'];
  const CategoryIcon = catConfig.icon;
  return (
                            <div key={task.id} id={`task-${task.id}`} className="relative rounded-3xl overflow-hidden lg:overflow-visible scroll-mt-28">
                            {/* Phone: actions revealed by swiping the row left */}
                            <div
                                className="lg:hidden absolute inset-y-0 right-0 flex rounded-r-3xl overflow-hidden transition-opacity duration-[250ms]"
                                style={{ width: ACTIONS_W, opacity: open || dragX !== null ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
                            >
                                <button
                                    tabIndex={open ? 0 : -1}
                                    onClick={() => { act.edit(task); }}
                                    aria-label={`Edit task: ${task.text}`}
                                    className="flex-1 flex flex-col items-center justify-center gap-1 bg-[#1b1b20] text-white/80 text-[10px] font-bold uppercase tracking-wider"
                                >
                                    <Pencil size={16} />Edit
                                </button>
                                <button
                                    tabIndex={open ? 0 : -1}
                                    onClick={() => { act.close(); act.remove(task.id); }}
                                    aria-label={`Delete task: ${task.text}`}
                                    className="flex-1 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#F63C49] to-[#9f1239] text-white text-[10px] font-bold uppercase tracking-wider"
                                >
                                    <Trash2 size={16} />Delete
                                </button>
                            </div>
                            <div
                                className={`group relative surface-1 rounded-3xl px-5 py-4 lg:px-6 lg:py-5 transition-shadow duration-[250ms] ${editing ? 'ring-1 ring-inset ring-[#F63C49]/60' : ''}`}
                                style={{
                                    transform: `translateX(${dragX !== null ? dragX : open ? -ACTIONS_W : 0}px)`,
                                    transition: dragX !== null ? 'none' : 'transform 250ms cubic-bezier(0.4,0,0.2,1), border-radius 250ms cubic-bezier(0.4,0,0.2,1)',
                                    ...((open || (dragX !== null && dragX < -4)) ? { borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightColor: 'transparent' } : {}),
                                    touchAction: 'pan-y'
                                }}
                                onTouchStart={(e) => act.touchStart(task.id, e)}
                                onTouchMove={(e) => act.touchMove(task.id, e)}
                                onTouchEnd={() => act.touchEnd(task.id)}
                                onClickCapture={(e) => { if (open) { e.preventDefault(); e.stopPropagation(); act.close(); } }}
                            >
                            <div className={`flex items-start gap-4 transition-opacity duration-[250ms] ${task.completed ? 'opacity-50' : ''}`}>
                                {/* Checkbox */}
                                <button 
                                    onClick={() => act.toggle(task.id)}
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
                                    <TickDraw size={14} play={draw && task.completed} />
                                </button>

                                <div className="flex-1 min-w-0">
                                    
                                    <div className="flex items-start justify-between gap-3 lg:pr-16">
                                        <p className={`text-base font-medium leading-snug ${task.completed ? 'text-slate-500 line-through decoration-slate-700' : 'text-white'}`}>
                                            {task.text}
                                        </p>
                                        {/* Phone: date sits on the title line so the meta row stays one compact line */}
                                        {task.dueDate && (() => {
                                            const due = dueWords(task.dueDate);
                                            return (
                                                <span className={`lg:hidden shrink-0 mt-[3px] text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider ${due.overdue && !task.completed ? 'text-[#F63C49]' : 'text-slate-500'}`}>
                                                    <Clock size={10} />
                                                    {due.text}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                                        {/* Priority */}
                                        <span className={`text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider ${priConfig.color}`}>
                                            <SignalBars level={PRIORITY_BARS[task.priority] || 2} size={12} />
                                            {task.priority || 'NORMAL'}
                                        </span>

                                        {/* Category */}
                                        <span className={`text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider ${catConfig.color}`}>
                                            <CategoryIcon size={12} />
                                            {catConfig.label}
                                        </span>

                                        {task.unitId && unit && (
                                                    <Link to={`/subject/${unit!.subjectId}`} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white border border-white/10 rounded-full px-2 py-0.5">
                                                        {unit!.text}
                                                    </Link>
                                                )}

                                        {/* Due date in plain words */}
                                        {task.dueDate && (() => {
                                            const due = dueWords(task.dueDate);
                                            return (
                                                <span className={`text-[10px] font-bold hidden lg:flex items-center gap-1 uppercase tracking-wider ml-auto ${due.overdue && !task.completed ? 'text-[#F63C49]' : 'text-slate-500'}`}>
                                                    <Clock size={10} />
                                                    {due.text}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>

                            </div>
                                {/* Desktop: edit and delete appear on hover, top right */}
                                <div className={`hidden lg:flex absolute top-3 right-4 items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-[250ms]`}>
                                    <button
                                        type="button"
                                        onClick={() => act.edit(task)}
                                        aria-label={`Edit task: ${task.text}`}
                                        title="Edit"
                                        className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => act.remove(task.id)}
                                        aria-label={`Delete task: ${task.text}`}
                                        title="Delete"
                                        className="p-2 text-slate-500 hover:text-[#F63C49] rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            {/* Phone: soft vignette on the clipped left edge while a row is swiped open */}
                            <div
                                aria-hidden="true"
                                className="lg:hidden pointer-events-none absolute inset-y-0 left-0 w-10 rounded-l-3xl bg-gradient-to-r from-black via-black/60 to-transparent transition-opacity duration-[250ms]"
                                style={{ opacity: open || dragX !== null ? 1 : 0 }}
                            />
                            </div>
  );
});

// Which subject a unit belongs to. Built once per subject list, so rows do not search the syllabus on every render.
const buildUnitIndex = (subjects: Subject[]) => {
  const m = new Map<string, { subjectId: string; text: string }>();
  for (const s of subjects) for (const u of s.units) m.set(u.id, { subjectId: s.id, text: s.name });
  return m;
};

// Rows are drawn in pages as the list is scrolled, so a few hundred tasks never mount at once.
const PAGE = 40;

// --- MICRO COMPONENTS ---

const CustomSelect = <T extends string>({ 
  label, 
  value, 
  onChange, 
  options,
  disabled = false,
  compact = false
}: { 
  compact?: boolean,
  label: string, 
  value: T, 
  onChange: (val: T) => void, 
  options: { value: T, label: string, icon?: any, color?: string }[],
  disabled?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [picked, setPicked] = useState(0);
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
    <div className={`relative ${compact ? 'space-y-1 lg:space-y-2' : 'space-y-2'}`} ref={containerRef}>
      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full surface-2 border rounded-2xl px-3 ${compact ? 'h-10 lg:h-12' : 'h-12'} disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between transition-all duration-300 ${
            isOpen ? 'border-[#F63C49] bg-white/[0.07] shadow-[0_0_15px_rgba(246,60,73,0.1)]' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
            {selectedOption?.icon && <selectedOption.icon key={picked} size={16} className={selectedOption.color} play={picked > 0} />}
            {selectedOption?.color && !selectedOption.icon && <div className={`w-2 h-2 rounded-full ${selectedOption.color}`} />}
            <span className={`truncate text-left text-[11px] font-bold uppercase tracking-wide ${selectedOption?.color && !selectedOption.icon ? 'text-slate-300' : (selectedOption?.icon ? 'text-slate-300' : '')}`}>
                {selectedOption?.label}
            </span>
        </div>
        <ChevronDown size={14} className={`shrink-0 ml-1 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#F63C49]' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setPicked(n => n + 1); setIsOpen(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
                >
                    <div className="flex items-center gap-3">
                         {opt.icon && <opt.icon size={16} className={opt.color || 'text-slate-500'} />}
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
  const { subjects: allSubjects } = useSubjects();
  const unitIndex = useMemo(() => buildUnitIndex(allSubjects), [allSubjects]);
  const unitLabel = (id: string) => unitIndex.get(id) || null;
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputPriority, setInputPriority] = useState<Priority>('NORMAL');
  const [inputCategory, setInputCategory] = useState<Category>('GENERAL');
  const [inputDate, setInputDate] = useState('');
  const [inputUnit, setInputUnit] = useState('');
  const [inputSubject, setInputSubject] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const resetForm = () => {
    setEditingId(null);
    setInputText('');
    setInputPriority('NORMAL');
    setInputCategory('GENERAL');
    setInputDate('');
    setInputUnit('');
    setInputSubject('');
  };

  // Edit loads the task into the Add Task card; nothing is focused so the phone keyboard stays down
  const startEdit = (t: Task) => {
    setEditingId(t.id);
    setInputText(t.text);
    setInputPriority(t.priority);
    setInputCategory(t.category);
    setInputDate(t.dueDate || '');
    setInputUnit(t.unitId || '');
    setInputSubject(subjectOfUnit(t.unitId || ''));
    setOpenId(null);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));
  };

  // Handlers
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (editingId) {
      setTasks(prev => prev.map(t => {
        if (t.id !== editingId) return t;
        const { unitId: _drop, ...rest } = t;
        return { ...rest, text: inputText.trim(), priority: inputPriority, category: inputCategory, dueDate: inputDate || '', ...(inputUnit ? { unitId: inputUnit } : {}) };
      }));
      const editedId = editingId;
      resetForm();
      if (window.matchMedia('(max-width: 1023px)').matches) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        requestAnimationFrame(() => document.getElementById(`task-${editedId}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }));
      }
      return;
    }

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
    setInputSubject('');
  };

  const [drawId, setDrawId] = useState<string | null>(null);
  // Swipe-to-reveal (phone): one row open at a time. Tween only, no spring.
  const [openId, setOpenId] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number } | null>(null);
  const touch = useRef<{ x: number; y: number; base: number; horiz: boolean | null } | null>(null);
  const onRowTouchStart = (id: string, e: React.TouchEvent) => {
    if (openId && openId !== id) setOpenId(null);
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, base: openId === id ? -ACTIONS_W : 0, horiz: null };
  };
  const onRowTouchMove = (id: string, e: React.TouchEvent) => {
    const t = touch.current; if (!t) return;
    const dx = e.touches[0].clientX - t.x, dy = e.touches[0].clientY - t.y;
    if (t.horiz === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) t.horiz = Math.abs(dx) > Math.abs(dy);
    if (!t.horiz) return;
    setDrag({ id, x: Math.max(-ACTIONS_W, Math.min(0, t.base + dx)) });
  };
  const onRowTouchEnd = (id: string) => {
    const t = touch.current; touch.current = null;
    if (t?.horiz && drag?.id === id) setOpenId(drag.x < -ACTIONS_W / 2 ? id : null);
    setDrag(null);
  };
  const toggleTask = (id: string) => {
    setDrawId(id);
    const target = tasks.find(t => t.id === id);
    setBurst(!!target && !target.completed && tasks.every(t => t.id === id || t.completed));
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
    if (editingId === id) resetForm();
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
  const allClear = tasks.length > 0 && completedCount === tasks.length;
  const [burst, setBurst] = useState(false);
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Filtering
  const filteredTasks = useMemo(() => tasks.filter(t => {
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
  }), [tasks, filter]);

  const [shown, setShown] = useState(PAGE);
  useEffect(() => { setShown(PAGE); }, [filter]);
  const visibleTasks = filteredTasks.length > shown ? filteredTasks.slice(0, shown) : filteredTasks;
  const sentinel = useRef<HTMLDivElement>(null);
  const moreLeft = filteredTasks.length > shown;
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !moreLeft) return;
    if (typeof IntersectionObserver === 'undefined') { setShown(filteredTasks.length); return; }
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) setShown(n => n + PAGE); }, { rootMargin: '800px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [moreLeft, shown, filteredTasks.length]);

  // Stable handlers for the memoised rows; they always call the latest versions.
  const latest = useRef<RowActions>(null as unknown as RowActions);
  latest.current = {
    edit: startEdit, remove: deleteTask, toggle: toggleTask, close: () => setOpenId(null),
    touchStart: onRowTouchStart, touchMove: onRowTouchMove, touchEnd: onRowTouchEnd,
  };
  const act = useMemo<RowActions>(() => ({
    edit: t => latest.current.edit(t), remove: id => latest.current.remove(id), toggle: id => latest.current.toggle(id),
    close: () => latest.current.close(), touchStart: (id, e) => latest.current.touchStart(id, e),
    touchMove: (id, e) => latest.current.touchMove(id, e), touchEnd: id => latest.current.touchEnd(id),
  }), []);

  // Dropdown Options Configuration
  const priorityOptions = [
    { value: 'CRITICAL', label: 'Critical', icon: BarsCritical, color: 'text-[#F63C49]' },
    { value: 'NORMAL', label: 'Normal', icon: BarsNormal, color: 'text-blue-400' },
    { value: 'LOW', label: 'Low', icon: BarsLow, color: 'text-slate-400' }
  ];

  const subjectOfUnit = (id: string) => allSubjects.find(x => x.units.some(u => u.id === id))?.id || '';
  const subjectOptionsFor = (extra: string) => [
    { value: '', label: 'Select subject' },
    ...allSubjects.filter(s => profile?.selectedSubjects?.includes(s.id) || s.id === extra).map(s => ({ value: s.id, label: s.name }))
  ];
  const unitOptionsFor = (subjectId: string) => [
    { value: '', label: 'No unit' },
    ...(allSubjects.find(s => s.id === subjectId)?.units || []).map(u => ({ value: u.id, label: `Unit ${u.unit_number} · ${u.title}` }))
  ];

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
        <div className="relative w-full md:w-auto md:min-w-64 md:max-w-sm px-5 py-4 rounded-3xl flex flex-col justify-between gap-3 overflow-hidden bg-[linear-gradient(180deg,#FDFBF6_0%,#F6F1E8_52%,#EEE8DC_100%)] shadow-[0_1px_2px_rgba(0,0,0,0.45),0_18px_38px_-22px_rgba(0,0,0,0.85),0_0_34px_-10px_rgba(255,247,235,0.22)]">
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-black/[0.05] pointer-events-none"></div>
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.05)] pointer-events-none"></div>
            <div className="absolute inset-0 rounded-3xl ring-1 ring-black/[0.06] pointer-events-none"></div>

            <div className="relative flex items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8a8172]">Tasks done</span>
                    <span className="relative inline-block">
                        <span className={`font-display font-bold tracking-tighter text-[#17171c] leading-[0.85] ${allClear || totalCount >= 100 ? 'text-4xl' : 'text-4xl lg:text-5xl'}`} data-testid="tasks-done">{totalCount === 0 ? '--' : allClear ? 'All clear' : `${completedCount}/${totalCount}`}</span>
                        {burst && allClear && (
                            <span className="absolute left-[calc(100%+16px)] top-1/2 pointer-events-none" aria-hidden="true">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <span key={i} className="pt-burst-dot absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[#F63C49]" style={{ ['--a' as any]: `${i * 45}deg` }}></span>
                                ))}
                            </span>
                        )}
                    </span>
                </div>
                {totalCount > 0 && !allClear && <span className={`${totalCount >= 100 ? 'text-4xl' : 'text-4xl lg:text-5xl'} font-display font-bold tracking-tighter text-[#17171c]/30 leading-[0.85]`}>{progress}%</span>}
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
            <div ref={formRef} className={`surface-1 rounded-3xl p-5 lg:p-7 sticky top-8 scroll-mt-24 transition-shadow duration-[250ms] ${editingId ? 'ring-1 ring-[#F63C49]/50' : ''}`}>
                <div className="flex items-center gap-2 mb-5 text-white/50">
                    <LayoutList size={16} />
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.18em]">{editingId ? 'Edit Task' : 'Add New Task'}</h2>
                </div>

                <form onSubmit={addTask} className="space-y-5">
                    
                    {/* Text Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Task Title</label>
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ex: Complete Unit 3 PYQs..."
                            className="w-full surface-2 border border-white/10 rounded-2xl px-4 h-12 text-sm text-white focus:border-[#F63C49] outline-none transition-all placeholder:text-slate-600 font-medium"
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
                        label="Subject"
                        value={inputSubject}
                        onChange={(v) => { setInputSubject(v); setInputUnit(''); }}
                        options={subjectOptionsFor('')}
                    />

                    <CustomSelect
                        label="Linked Unit (Optional)"
                        value={inputUnit}
                        onChange={(v) => setInputUnit(v)}
                        options={unitOptionsFor(inputSubject)}
                        disabled={!inputSubject}
                    />

                    {/* Date Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Due date (optional)</label>
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

                    <div className="flex gap-3 lg:flex-col-reverse">
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 lg:flex-none h-12 lg:h-10 surface-2 lg:bg-transparent border border-white/10 lg:border-transparent rounded-2xl text-xs font-bold uppercase tracking-[0.2em] text-slate-300 lg:text-slate-500 hover:text-white transition-colors duration-[250ms]"
                            >
                                Cancel
                            </button>
                        )}
                    <button 
                        type="submit"
                        disabled={!inputText}
                        className={`${editingId ? 'flex-1 lg:flex-none lg:w-full' : 'w-full'} h-12 bg-gradient-to-br from-[#F63C49] to-[#9f1239] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-[0.12em] lg:tracking-[0.2em] rounded-2xl transition-all duration-[250ms] flex items-center justify-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_22px_-8px_rgba(246,60,73,0.6)]`}
                    >
                        {editingId ? <Check size={16} /> : <Plus size={16} />} {editingId ? 'Save changes' : 'Add Task'}
                    </button>
                    </div>
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
                    visibleTasks.map(task => (
                        <TaskRow key={task.id} task={task} open={openId === task.id} dragX={drag?.id === task.id ? drag.x : null} editing={editingId === task.id} draw={drawId === task.id} unit={task.unitId ? unitLabel(task.unitId) : null} act={act} />
                    ))
                )}
                {moreLeft && <div ref={sentinel} aria-hidden="true" className="h-px" />}
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
