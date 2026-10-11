import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles, BookOpen, Layers, Shield, User, GraduationCap, School } from 'lucide-react';
import EditionNav from '../components/EditionNav';
import { useData } from '../context/DataContext';
import { CATALOG } from '../lib/catalog';
import { selectableCourses, selectionGroup, chooseCourse } from '../lib/onboarding.mjs';
import '../map.css';

const STAGES = ['Year', 'Branch', 'Semester', 'Courses', 'Launch'];

export default function Onboarding() {
  const { setProfile, profile } = useData();
  const [step, setStep] = useState(0);
  const [year, setYear] = useState('FE');
  const [branch, setBranch] = useState('fe');
  const [semester, setSemester] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState(profile?.name || '');
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Derived Catalog Data
  const branches = Array.from(new Map(CATALOG.filter(c => c.year === year).map(c => [c.branchSlug, c.branch])).entries());
  const courses = selectableCourses(CATALOG, year, branch, semester);
  const groups: string[] = [...new Set<string>(courses.map(c => String(selectionGroup(c) || 'Core courses')))];
  const branchName = branches.find(([id]) => id === branch)?.[1] || (year === 'FE' ? 'First Year Common' : '');
  const held = branch && !CATALOG.some(c => c.branchSlug === branch && c.trackerReady);
  const semesters = year === 'FE' ? [1, 2] : year === 'SE' ? [3, 4] : [5, 6];

  // Auto-initialize selected courses when semester or step changes
  useEffect(() => {
    if (courses.length > 0 && selected.length === 0) {
      // Auto-select core courses and first items in groups
      const initial: string[] = [];
      groups.forEach(g => {
        const groupCourses = courses.filter(c => (selectionGroup(c) || 'Core courses') === g);
        if (groupCourses.length > 0) {
          initial.push(groupCourses[0].id);
        }
      });
      setSelected(initial);
    }
  }, [semester, year, branch]);

  const isReady =
    step === 0 ? !!year :
    step === 1 ? !!branch && !held :
    step === 2 ? !!semester :
    step === 3 ? selected.length > 0 :
    !!name.trim();

  const handleNext = () => {
    setError('');
    if (step === 2 && selected.length === 0) {
      const autoSelected = courses.map(c => c.id);
      setSelected(autoSelected);
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      try {
        const p = {
          ...profile,
          name: name.trim(),
          theme: 'light',
          selectedSubjects: selected,
          setupComplete: true,
          streak: profile?.streak || 0,
          lastStudyDate: profile?.lastStudyDate || ''
        };
        localStorage.setItem('sppu_profile', JSON.stringify(p));
        setProfile(p as any);
      } catch (err) {
        setError('Could not save profile in this browser. Please check local storage permissions.');
      }
    }
  };

  const yearInfo = [
    { id: 'FE', title: 'First Year', subtitle: 'The common engineering foundation', badge: 'Pattern 2024' },
    { id: 'SE', title: 'Second Year', subtitle: 'Specialized branch core topics', badge: 'Core Branch' },
    { id: 'TE', title: 'Third Year', subtitle: 'Advanced branch electives & labs', badge: 'Upper Division' }
  ];

  return (
    <div className="map-page bg-slate-50 min-h-screen">
      <EditionNav setup />

      <main className="map-main">
        {/* Left Sidebar Progress Card */}
        <aside className="map-sidebar mb-8 lg:mb-0">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <GraduationCap size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-rose-600 uppercase">Setup Edition</span>
              <h2 className="text-lg font-bold text-slate-900 font-display">Study Setup</h2>
            </div>
          </div>

          <div className="map-step-nav">
            {STAGES.map((title, idx) => {
              const isCurrent = idx === step;
              const isDone = idx < step;
              return (
                <button
                  key={title}
                  disabled={idx > step}
                  onClick={() => setStep(idx)}
                  className={`map-step-item ${isCurrent ? 'active' : isDone ? 'complete' : ''}`}
                >
                  <div className="map-step-badge">
                    {isDone ? <Check size={16} strokeWidth={2.5} /> : idx + 1}
                  </div>
                  <div>
                    <span className="text-xs font-semibold block text-slate-900">{title}</span>
                    <span className="text-[11px] text-slate-500">
                      {idx === 0
                        ? year || 'Select year'
                        : idx === 1
                        ? branchName || 'Select branch'
                        : idx === 2
                        ? semester ? `Semester ${semester}` : 'Select sem'
                        : idx === 3
                        ? `${selected.length} subjects`
                        : name || 'Desk name'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Local Storage Active</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your subject configuration and study progress are stored private to this browser.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Main Panel */}
        <section className="map-panel">
          <div>
            {/* Step Header */}
            <header className="map-heading">
              <span className="map-eyebrow">Step 0{step + 1} of 05</span>
              <h1>
                {step === 0 && 'Select your academic year.'}
                {step === 1 && 'Choose your engineering branch.'}
                {step === 2 && 'Which semester are you in?'}
                {step === 3 && 'Configure your active subject shelf.'}
                {step === 4 && 'Name your study desk & review.'}
              </h1>
              <p>
                {step === 0 && 'Choose your current year of study to load official SPPU 2024 syllabus requirements.'}
                {step === 1 && 'Select your department to tailor course tracking to your curriculum.'}
                {step === 2 && 'Each semester provides specific theory unit outlines and credit allocations.'}
                {step === 3 && 'Pick your active courses or First Year rotation subjects.'}
                {step === 4 && 'Enter your name to personalize your study dashboard.'}
              </p>
            </header>

            {/* STEP 0: YEAR SELECTION */}
            {step === 0 && (
              <div className="map-choice-grid">
                {yearInfo.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setYear(item.id);
                      setBranch(item.id === 'FE' ? 'fe' : '');
                      setSemester(item.id === 'FE' ? 1 : item.id === 'SE' ? 3 : 5);
                      setSelected([]);
                    }}
                    className={`map-choice-card ${year === item.id ? 'selected' : ''}`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-rose-600 px-2.5 py-1 bg-rose-50 rounded-md border border-rose-100">
                          {item.badge}
                        </span>
                        {year === item.id && (
                          <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center">
                            <Check size={14} strokeWidth={2.5} />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 font-display mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-600">{item.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 1: BRANCH SELECTION */}
            {step === 1 && (
              <div className="map-choice-grid">
                {branches.map(([id, title]) => {
                  const available = CATALOG.some(c => c.branchSlug === id && c.trackerReady);
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setBranch(id);
                        setSemester(year === 'FE' ? 1 : year === 'SE' ? 3 : 5);
                        setSelected([]);
                      }}
                      className={`map-choice-card ${branch === id ? 'selected' : ''} ${!available ? 'disabled' : ''}`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${available ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                            {available ? 'Ready' : 'Reference'}
                          </span>
                          {branch === id && (
                            <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center">
                              <Check size={14} strokeWidth={2.5} />
                            </div>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 font-display mt-2">{title}</h3>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 2: SEMESTER SELECTION */}
            {step === 2 && (
              <div className="map-choice-grid">
                {semesters.map(num => (
                  <button
                    key={num}
                    onClick={() => {
                      setSemester(num);
                      setSelected([]);
                    }}
                    className={`map-choice-card ${semester === num ? 'selected' : ''}`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                          {num % 2 !== 0 ? 'Autumn Term' : 'Spring Term'}
                        </span>
                        {semester === num && (
                          <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center">
                            <Check size={14} strokeWidth={2.5} />
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 font-display mb-1">Semester 0{num}</h3>
                      <p className="text-xs text-slate-600">
                        {year === 'FE' ? 'Includes core engineering mathematics & foundation subjects' : `Semester ${num} curriculum`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 3: COURSE SELECTION */}
            {step === 3 && (
              <div className="space-y-6">
                {groups.map(groupName => {
                  const groupCourses = courses.filter(c => (selectionGroup(c) || 'Core courses') === groupName);
                  return (
                    <div key={groupName} className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{groupName}</h3>
                        <span className="text-xs text-slate-500 font-medium">
                          {groupName === 'Core courses' ? 'Selected courses' : 'Choose one'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {groupCourses.map(course => {
                          const isSelected = selected.includes(course.id);
                          return (
                            <button
                              key={course.id}
                              type="button"
                              onClick={() => setSelected(chooseCourse(selected, course, courses))}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${
                                isSelected
                                  ? 'border-rose-600 bg-rose-50/60 text-slate-900 shadow-sm'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[11px] font-bold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded">
                                  {course.code}
                                </span>
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                  isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isSelected && <Check size={12} strokeWidth={3} />}
                                </div>
                              </div>
                              <h4 className="font-bold text-sm text-slate-900 mb-1">{course.name}</h4>
                              <p className="text-xs text-slate-500">
                                {course.units.length} units · {course.credits} credits
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 4: LAUNCH DESK */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <label htmlFor="student-name-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Student Dashboard Name
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="student-name-input"
                      type="text"
                      maxLength={60}
                      placeholder="Enter your name (e.g. Alex)"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-base font-medium focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Configuration Summary</span>
                      <h3 className="text-lg font-bold text-slate-900 font-display">
                        {year} · {branchName}
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-lg">
                      Semester 0{semester}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-500 block mb-2">Enrolled Courses ({selected.length})</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {courses.filter(c => selected.includes(c.id)).map(c => (
                        <li key={c.id} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80">
                          <Check size={14} className="text-rose-600 flex-shrink-0" />
                          <span className="truncate">{c.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <footer className="map-actions">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
              className="map-btn-back"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <button
              type="button"
              disabled={!isReady}
              onClick={handleNext}
              className="map-btn-next"
            >
              {step === 4 ? 'Launch Dashboard' : 'Continue'} <ArrowRight size={16} />
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}
