import React from 'react';
import { AlertTriangle, RefreshCw, LayoutGrid } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
  /** 'page' keeps the app shell and nav alive. 'app' is the last-resort full-screen fallback. */
  scope: 'page' | 'app';
  /** When this value changes (for example the route), the boundary clears its error. */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('PrepTracker render error:', error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const full = this.props.scope === 'app';
    return (
      <div
        role="alert"
        className={
          full
            ? 'min-h-screen bg-[#030303] text-white flex items-center justify-center p-6 text-center'
            : 'w-full flex items-center justify-center py-16 text-center'
        }
      >
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="w-14 h-14 bg-[#F63C49]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#F63C49]">
            <AlertTriangle size={26} />
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-2">This page hit a problem</h1>
          <p className="text-slate-400 text-sm mb-2 leading-relaxed">
            Your saved progress, tasks and marks are still in this browser. Nothing was deleted.
          </p>
          <p className="text-slate-600 text-[11px] font-mono mb-8 break-words">{error.message}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-3 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} /> Reload
            </button>
            <a
              href="#/"
              onClick={() => this.setState({ error: null })}
              className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <LayoutGrid size={14} /> Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }
}
