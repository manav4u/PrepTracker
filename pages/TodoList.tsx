import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
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
  ChevronDown
} from 'lucide-react';

// --- TYPES ---
type Priority = 'CRITICAL' | 'NORMAL' | 'LOW';
type Category = 'EXAM' | 'LAB' | 'SUBMISSION' | 'GENERAL';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: string; // ISO Date
  createdAt: string;
}

// --- CONSTANTS ---
const CATEGORY_CONFIG: Record<Category, { color: string, icon: any, label: string }> = {
  EXAM: { color: 'text-red-400', icon: Flame, label: 'Exam Prep' },
  LAB: { color: 'text-cyan-400', icon: FlaskConical, label: 'Lab Work' },
  SUBMISSION: { color: 'text-yellow-400', icon: Briefcase, label: 'Submission' },
  GENERAL: { color: 'text-slate-400', icon: BookOpen, label: 'General' }
};

const PRIORITY_CONFIG: Record<Priority, { color: string, border: string, glow: string }> = {
  CRITICAL: { color: 'text-[#E11D48]', border: 'border-[#E11D48]', glow: 'shadow-[0_0_15px_rgba(225,29,72,0.15)]' },
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
            isOpen ? 'border-[#E11D48] bg-white/[0.07] shadow-[0_0_15px_rgba(225,29,72,0.1)]' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex items-center gap-3">
            {selectedOption?.icon && <selectedOption.icon size={14} className={selectedOption.color} />}
            {selectedOption?.color && !selectedOption.icon && <div className={`w-2 h-2 rounded-full ${selectedOption.color}`} />}
            <span className={`text-xs font-bold uppercase tracking-wider ${selectedOption?.color && !selectedOption.icon ? 'text-slate-300' : (selectedOption?.icon ? 'text-slate-300' : '')}`}>
                {selectedOption?.label}
            </span>
        </div>
        <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#E11D48]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
                    {value === opt.value && <Check size={12} className="text-[#E11D48]" />}
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
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('sppu_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [inputText, setInputText] = useState('');
  const [inputPriority, setInputPriority] = useState<Priority>('NORMAL');
  const [inputCategory, setInputCategory] = useState<Category>('GENERAL');
  const [inputDate, setInputDate] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  // Persistence
  useEffect(() => {
    localStorage.setItem('sppu_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handlers
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      text: inputText,
      completed: false,
      priority: inputPriority,
      category: inputCategory,
      dueDate: inputDate,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    setInputText('');
    // Keep settings for rapid entry
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
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
        return pMap[b.priority] - pMap[a.priority];
    }
    return a.completed ? 1 : -1;
  });

  // Dropdown Options Configuration
  const priorityOptions = [
    { value: 'CRITICAL', label: 'Critical', color: 'bg-[#E11D48]' },
    { value: 'NORMAL', label: 'Normal', color: 'bg-blue-400' },
    { value: 'LOW', label: 'Low', color: 'bg-slate-500' }
  ];

  const categoryOptions = Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
      value: key as Category,
      label: config.label,
      icon: config.icon,
      color: config.color
  }));

  return (
    <div className="min-h-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER HUD */}
      <header className="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-[#E11D48] mb-2">
                <CheckSquare size={16} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]">Task Management</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-white tracking-tighter leading-none">
                Task <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700">List</span>
            </h1>
        </div>
        
        {/* Progress Unit */}
        <div className="w-full md:w-64 bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-end mb-2 relative z-10">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Efficiency</span>
                <span className="text-2xl font-display font-bold text-white">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                <div 
                    className="h-full bg-[#E11D48] shadow-[0_0_10px_#E11D48] transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            {/* Background noise */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* INPUT CONSOLE */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#050505] border border-white/10 rounded-3xl p-6 lg:p-8 sticky top-8">
                <div className="flex items-center gap-2 mb-6 text-white/50">
                    <LayoutList size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Add New Task</h3>
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
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#E11D48] focus:bg-white/[0.07] outline-none transition-all placeholder:text-slate-600 font-medium"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Custom Dropdowns */}
                        <CustomSelect 
                            label="Priority Vector"
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

                    {/* Date Input */}
                    <div className="space-y-2">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Dead-Line (Optional)</label>
                        <div className="relative group">
                            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#E11D48] transition-colors" />
                            <input 
                                type="date" 
                                value={inputDate}
                                onChange={(e) => setInputDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-slate-300 focus:border-[#E11D48] outline-none transition-colors uppercase"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={!inputText}
                        className="w-full py-4 bg-[#E11D48] hover:bg-[#be123c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.2)] hover:shadow-[0_0_30px_rgba(225,29,72,0.4)]"
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
                <div className="flex bg-[#0a0a0a] border border-white/10 p-1 rounded-xl">
                    {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                filter === f 
                                ? 'bg-white text-black shadow-lg' 
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
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
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                        <CheckCircle2 size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">No Active Tasks</p>
                    </div>
                ) : (
                    filteredTasks.map(task => {
                        const CategoryIcon = CATEGORY_CONFIG[task.category].icon;
                        const isCritical = task.priority === 'CRITICAL';

                        return (
                            <div 
                                key={task.id}
                                className={`
                                    group relative bg-[#0a0a0a] border rounded-2xl p-5 transition-all duration-300 
                                    hover:translate-x-1 flex items-start gap-5
                                    ${task.completed ? 'opacity-50 border-white/5' : `hover:border-white/20 ${PRIORITY_CONFIG[task.priority].border} ${PRIORITY_CONFIG[task.priority].glow}`}
                                `}
                            >
                                {/* Checkbox Node */}
                                <button 
                                    onClick={() => toggleTask(task.id)}
                                    className={`
                                        mt-1 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all
                                        ${task.completed 
                                            ? 'bg-green-500 border-green-500 text-black' 
                                            : 'bg-transparent border-white/20 hover:border-white text-transparent'
                                        }
                                    `}
                                >
                                    <Check size={14} strokeWidth={3} />
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        {/* Priority Badge */}
                                        <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded uppercase tracking-wider ${PRIORITY_CONFIG[task.priority].color} border-current opacity-80`}>
                                            {task.priority}
                                        </span>
                                        
                                        {/* Category Badge */}
                                        <span className={`text-[9px] font-bold flex items-center gap-1 uppercase tracking-wider ${CATEGORY_CONFIG[task.category].color}`}>
                                            <CategoryIcon size={10} />
                                            {CATEGORY_CONFIG[task.category].label}
                                        </span>

                                        {/* Date Badge */}
                                        {task.dueDate && (
                                            <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1 uppercase tracking-wider ml-auto">
                                                <Clock size={10} />
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    <p className={`text-sm font-medium leading-relaxed ${task.completed ? 'text-slate-500 line-through decoration-slate-700' : 'text-slate-200'}`}>
                                        {task.text}
                                    </p>
                                </div>

                                <button 
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-500 transition-all rounded-lg hover:bg-white/5"
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
    </div>
  );
};

export default TodoList;