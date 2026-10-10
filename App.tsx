const Planner = React.lazy(() => import('./pages/Planner'));
const Progress = React.lazy(() => import('./pages/Progress'));
const Study = React.lazy(() => import('./pages/Study'));
import React, { useState, useEffect, ReactNode, Component } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutGrid,
  Library,
  Calculator,
  Settings,
  Bell,
  Search,
  Hexagon,
  Menu,
  AlertTriangle,
  RefreshCw,
  ListTodo,
  HardDrive
} from 'lucide-react';
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Directory = React.lazy(() => import('./pages/Directory'));
const AddToPlan = React.lazy(() => import('./pages/AddToPlan'));
const SubjectDetail = React.lazy(() => import('./pages/SubjectDetail'));
const Resources = React.lazy(() => import('./pages/Resources'));
const CalculatorPage = React.lazy(() => import('./pages/Calculator'));
const SettingsPage = React.lazy(() => import('./pages/Settings'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const TodoList = React.lazy(() => import('./pages/TodoList'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
import { UnitStatus } from './types';
import { useData } from './context/DataContext';

import './round2-palette.css';

// --- ERROR BOUNDARY COMPONENT ---
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("CRITICAL APP CRASH:", error, errorInfo);
  }

  handleHardReset = () => {
    // Only clear session storage to avoid wiping local data backup if unnecessary
    sessionStorage.clear();
    // Potentially clear specific corrupt keys from local storage if known,
    // but avoid full clear to preserve 'sppu_profile' etc. if they are valid.
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="edition-error">
          <section role="alert">
            <p>THE EXAM EDITION / PAGE COULD NOT OPEN</p>
            <div className="edition-error-mark" aria-hidden="true">!</div>
            <h1>This page could not open.</h1>
            <p>Your saved work has not been cleared. Reload to try again.</p>
            <button onClick={this.handleHardReset}><RefreshCw size={16} /> Reload page</button>
            <small>If this keeps happening, restore a recent backup from Settings after the app opens.</small>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const { profile } = useData();
  const ready = !!profile?.setupComplete;
  return <ErrorBoundary><button className="edition-skip" onClick={()=>{const main=document.querySelector<HTMLElement>('main');if(main){main.setAttribute('tabindex','-1');main.focus();main.scrollIntoView({block:'start'});}}}>Skip to page content</button><React.Suspense fallback={<p className="route-loading" role="status">Opening your exam desk…</p>}><Routes>
    <Route path="/directory" element={<Directory />} />
    <Route path="/add/:id" element={<AddToPlan />} />
    <Route path="/landing" element={ready ? <Navigate to="/" /> : <LandingPage />} />
    <Route path="/onboarding" element={ready ? <Navigate to="/" /> : <Onboarding />} />
    <Route path="/" element={ready ? <Dashboard /> : <LandingPage />} />
    <Route path="/subject/:id" element={ready ? <SubjectDetail /> : <Navigate to="/landing" />} />
    <Route path="/planner" element={ready ? <Planner /> : <Navigate to="/landing" />} />
    <Route path="/study" element={ready ? <Study /> : <Navigate to="/landing" />} />
    <Route path="/progress" element={ready ? <Progress /> : <Navigate to="/landing" />} />
    <Route path="/resources" element={ready ? <Resources /> : <Navigate to="/landing" />} />
    <Route path="/tasks" element={ready ? <TodoList /> : <Navigate to="/landing" />} />
    <Route path="/calculator" element={ready ? <CalculatorPage /> : <Navigate to="/landing" />} />
    <Route path="/settings" element={ready ? <SettingsPage /> : <Navigate to="/landing" />} />
    <Route path="*" element={<div className="library-page"><main className="library-add"><h1>Page not found.</h1><p>This address is not part of your exam desk.</p><Link to="/">Go to your desk ↗</Link><Link to="/directory">Browse Courses ↗</Link></main></div>} />
  </Routes></React.Suspense></ErrorBoundary>;
}
