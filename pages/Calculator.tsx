import "../marks-ledger.css";
import EditionNav from "../components/EditionNav";

import React from "react";
import { semesterCourses, extraHeads } from "../lib/feMarks.mjs";
import { SUBJECTS } from "../constants";
import { CATALOG } from "../lib/catalog";
import { RotateCcw, Activity, Cpu, AlertCircle } from "lucide-react";
import { useData } from "../context/DataContext";
import { writeLocal } from "../lib/local-write.mjs";
import { summarizeMarks, gradeFor } from "../lib/marks.mjs";

const MARKS_KEY = "sppu_calculator_marks";

type MarkRow = { inSem?: number; endSem?: number; termWork?: number };

// Grade table from the SPPU UG Credit Framework handbook (2024 pattern), Table of grade letters and grade points.
// CGPA class bands from the same handbook (shown here for the SGPA as a guide).
const bandFor = (v: number): string => {
  if (v >= 9.5) return "Outstanding (O)";
  if (v >= 8.5) return "Excellent (A+)";
  if (v >= 7.5) return "Very Good (A)";
  if (v >= 6.25) return "Good (B+)";
  if (v >= 5.25) return "Above Average (B)";
  if (v >= 4.75) return "Average (C)";
  if (v >= 4) return "Pass (D)";
  return "Fail (F)";
};

const CalculatorPage: React.FC = () => {
  const { profile, study, setStudy } = useData();
  const config = study.marksConfig;
  const semester = config?.semester || 1;
  const workshop = config?.workshop || "workshop";
  const [marks, setMarksState] = React.useState<Record<string, MarkRow>>(() => {
    try {
      return JSON.parse(localStorage.getItem(MARKS_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const [saveError, setSaveError] = React.useState("");
  const setMarks = (next: Record<string, MarkRow>) => {
    try {
      writeLocal(localStorage, MARKS_KEY, next);
      setMarksState(next);
      setSaveError("");
    } catch (e) {
      setSaveError((e as Error).message);
    }
  };

  if (!profile) return null;
  const selectedIds = profile.selectedSubjects || [];

  const unsupported = CATALOG.filter(
    (s) => selectedIds.includes(s.id) && s.year !== "FE",
  );
  const baseSubjects = SUBJECTS.filter((s) => selectedIds.includes(s.id));
  const basket = semesterCourses(CATALOG, selectedIds, semester);
  const fullMode = !!config && basket.valid;
  const filteredSubjects = fullMode
    ? [...baseSubjects, ...extraHeads(semester, workshop)]
    : baseSubjects;

  const updateMarks = (
    sId: string,
    field: "inSem" | "endSem" | "termWork",
    val: string,
  ) => {
    const max = field === "inSem" ? 30 : field === "endSem" ? 70 : 25;
    const n =
      val === "" ? undefined : Math.min(max, Math.max(0, parseInt(val) || 0));
    setMarks({ ...marks, [sId]: { ...(marks[sId] || {}), [field]: n } });
  };

  const summary = summarizeMarks(filteredSubjects, marks);
  const sgpa = Number(summary.value || 0);
  const totalCredits = filteredSubjects.reduce((acc, s) => acc + s.credits, 0);

  return (
    <div className="marks-ledger">
      <EditionNav />
      <main>
        <header className="marks-heading">
          <div>
            <p>THE EXAM EDITION / FE ONLY</p>
            <h1>
              Every mark.
              <br />
              <i>An honest estimate.</i>
            </h1>
          </div>
          <div className="marks-stamp">
            NOT AN
            <br />
            OFFICIAL RESULT
          </div>
        </header><section className="marks-completeness" aria-label="Assessment-head coverage"><div className="marks-fraction"><b>{summary.completeHeads}</b><span>/ {summary.totalHeads}</span><small>COMPLETE ASSESSMENT HEADS</small></div><div className="marks-head-track"><div>{Array.from({length:summary.totalHeads},(_,i)=><span key={i} className={i<summary.completeHeads?'entered':''} aria-hidden="true">{i<summary.completeHeads?'✓':'·'}</span>)}</div><p>{!summary.totalHeads?'Choose FE courses or a semester basket below.':summary.isComplete?'All selected heads entered.':'Still a partial entry.'} {summary.gradedCredits} of {summary.possibleCredits} credits have complete marks.</p></div></section>
        <div className="marks-layout">
          <section className="marks-inputs">
            <details className="marks-coverage" open>
              <summary>Choose your coverage.</summary>
              <p>
                Full 22-credit coverage requires exactly five theory courses:
                the right Maths and Programming course plus one
                Physics/Chemistry, one BEE/BXE and one Graphics/Mechanics.
                Verify your college combination.
              </p>
              <div className="marks-selects">
                <label>
                  Semester
                  <select
                    aria-label="Semester"
                    value={config?.semester || ""}
                    onChange={(e) =>
                      setStudy((old) => ({
                        ...old,
                        marksConfig: e.target.value
                          ? {
                              semester: Number(e.target.value) as 1 | 2,
                              workshop,
                            }
                          : undefined,
                      }))
                    }
                  >
                    <option value="">Selected courses only</option>
                    <option value="1">Semester I</option>
                    <option value="2">Semester II</option>
                  </select>
                </label>
                <label>
                  Vocational basket
                  <select
                    aria-label="Vocational basket"
                    value={workshop}
                    onChange={(e) =>
                      setStudy((old) => ({
                        ...old,
                        marksConfig: {
                          semester,
                          workshop: e.target.value as any,
                        },
                      }))
                    }
                  >
                    <option value="workshop">
                      Manufacturing Practice Workshop
                    </option>
                    <option value="design">Design Thinking and Idea Lab</option>
                  </select>
                </label>
              </div>
              {config && !basket.valid && (
                <p role="alert">
                  Course selection does not match this semester. Showing
                  selected-course estimate only. Update your plan in Settings.
                </p>
              )}
              <p>
                {fullMode
                  ? "All 22 listed credits represented."
                  : "Not full-semester coverage."}{" "}
                {unsupported.length > 0 &&
                  `${unsupported.length} SE/TE courses excluded: complete assessment schemes are not yet mapped.`}
              </p>
            </details>
            {saveError && <p role="alert">{saveError}</p>}
            <div className="marks-row-heading">
              <h2>Your marks ledger.</h2>
              <button
                onClick={() => {
                  if (confirm("Clear all entered marks in this browser?"))
                    setMarks({});
                }}
              >
                Clear marks ↺
              </button>
            </div>
            {!filteredSubjects.length && (
              <p className="marks-empty">
                No FE courses selected. Add your FE course combination in
                Settings to begin. SE/TE assessment mapping is not ready.
              </p>
            )}
            {filteredSubjects.map((s, i) => (
              <article className="marks-row" key={s.id}>
                <div className="marks-row-title">
                  <span>{String(i + 1).padStart(2, "0")}.</span>
                  <div>
                    <p>
                      {s.code} · {s.credits} credits
                    </p>
                    <h3>{s.name}</h3>
                  </div>
                </div>
                <div className="marks-fields">
                  {s.theoryCredits !== 0 && (
                    <>
                      <label>
                        CCE / 30
                        <input
                          type="number"
                          aria-label={`CCE marks: ${s.name}`}
                          min="0"
                          max="30"
                          value={marks[s.id]?.inSem ?? ""}
                          onChange={(e) =>
                            updateMarks(s.id, "inSem", e.target.value)
                          }
                          placeholder="--"
                        />
                      </label>
                      <label>
                        END-SEM / 70
                        <input
                          type="number"
                          aria-label={`End-Sem marks: ${s.name}`}
                          min="0"
                          max="70"
                          value={marks[s.id]?.endSem ?? ""}
                          onChange={(e) =>
                            updateMarks(s.id, "endSem", e.target.value)
                          }
                          placeholder="--"
                        />
                      </label>
                    </>
                  )}
                  <label>
                    TERM WORK / 25
                    <input
                      type="number"
                      aria-label={`Term work marks: ${s.name}`}
                      min="0"
                      max="25"
                      value={marks[s.id]?.termWork ?? ""}
                      onChange={(e) =>
                        updateMarks(s.id, "termWork", e.target.value)
                      }
                      placeholder="--"
                    />
                  </label>
                </div>
              </article>
            ))}
          </section>
          <aside className="marks-receipt">
            <p className="marks-receipt-kicker">
              {summary.isComplete
                ? fullMode
                  ? "FULL FE COVERAGE ESTIMATE"
                  : "SELECTED-COURSE ESTIMATE"
                : "PARTIAL ESTIMATE"}
            </p>
            <h2>{summary.value ?? "--"}</h2>
            <p className="marks-estimate-label">
              {summary.isComplete
                ? fullMode
                  ? "FE semester estimate"
                  : "Selected-course SGPA estimate"
                : "Entered-head average"}
            </p>
            <div className="marks-band">
              <span>GUIDE BAND</span>
              <strong>
                {summary.value ? bandFor(sgpa) : "No complete heads"}
              </strong>
            </div>
            <p aria-live="polite">
              {summary.completedSubjects} of {filteredSubjects.length} selected
              subjects complete. {summary.completeHeads}/{summary.totalHeads}{" "}
              graded heads; {summary.gradedCredits}/{summary.possibleCredits}{" "}
              credits entered. Incomplete theory needs both CCE and End-Sem.
            </p>
            <div className="marks-scale">
              <span style={{ width: `${Math.min(100, sgpa * 10)}%` }} />
            </div>
            <p className="marks-rules">
              Theory (CCE 30 + End-Sem 70) and term work are graded separately
              and weighted by credits. Only complete assessment heads count.
              Blank marks are not zero. Full-semester mode includes three
              additional vocational/general heads only when the theory basket
              matches. This is an estimate, not an official semester result or
              pass eligibility check.
            </p>
            <p className="marks-boundary">
              The handbook overlaps at exactly 40: D 40-44 and F≤40. This
              planner uses D at 40. Confirm that boundary and separate-head pass
              requirements with your college.
            </p>
            <div className="marks-sources">
              <a
                href="http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/FE%202024%20Pattern%20Syllabus%20-%2016%20July%202024%20(1).pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Official FE scheme, pp2-3 ↗
              </a>
              <a
                href="http://collegecirculars.unipune.ac.in/sites/documents/Syllabus2024/Rev.HANDBOOK-revised%20Rules%20and%20Regulations_27052025.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Grade rules handbook ↗
              </a>
            </div>
            {summary.isComplete && sgpa < 5 && (
              <p role="status">Review your entered marks.</p>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};
export default CalculatorPage;
