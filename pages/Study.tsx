import "../studio.css";
import "../quiet-study.css";
import EditionNav from "../components/EditionNav";
import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { CATALOG } from "../lib/catalog";
import {
  learningNodes,
  recordAttempt,
  undoAttempt,
  editReview,
  reviewDay,
} from "../lib/learning.mjs";
import { subjectMethod } from "../lib/subject-method.mjs";
import { localDay, validDay } from "../lib/dates.mjs";
import LegacyStudy from "../components/LegacyStudy";
import MaterialShelf from "../components/MaterialShelf";
export default function Study({
  embedded = false,
  initialCourse,
  initialTopic,
  onClose,
}: {
  embedded?: boolean;
  initialCourse?: string;
  initialTopic?: string;
  onClose?: () => void;
}) {
  const { profile, study, setStudy, commitStudy } = useData();
  const [params, setParams] = useSearchParams();
  const [legacy, setLegacy] = useState(false);
  const courses = CATALOG.filter((c) =>
    profile?.selectedSubjects.includes(c.id),
  );
  const course =
    courses.find(
      (c) => c.id === (embedded ? initialCourse : params.get("course")),
    ) || courses[0];
  const nodes = course ? learningNodes(course) : [];
  const node =
    nodes.find(
      (n: any) => n.id === (embedded ? initialTopic : params.get("topic")),
    ) || nodes[0];
  const commitLock = useRef(false);
  const [motionReady, setMotionReady] = useState(false);
  const draftKey = `preptracker-session:${node?.id || "none"}`;
  const stageFocus = useRef<HTMLElement>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [goal, setGoal] = useState(""),
    [answer, setAnswer] = useState(""),
    [paper, setPaper] = useState(false),
    [label, setLabel] = useState(""),
    [reference, setReference] = useState(""),
    [url, setUrl] = useState(""),
    [stage, setStage] = useState(1),
    [compared, setCompared] = useState(false),
    [outcome, setOutcome] = useState(""),
    [date, setDate] = useState(localDay()),
    [review, setReview] = useState(""),
    [noReview, setNoReview] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    if (stageFocus.current && (stage !== 1 || receipt))
      stageFocus.current.focus();
  }, [stage, receipt]);
  const dirty = !!(goal || answer || paper || reference || label || url);
  const [hydratedKey, setHydratedKey] = useState("");
  useEffect(() => {
    try {
      const saved =
        JSON.parse(sessionStorage.getItem(draftKey) || "null") || {};
      setReceipt(null);
      commitLock.current = false;
      setMotionReady(false);
      {
        setGoal(saved.goal || "");
        setAnswer(saved.answer || "");
        setPaper(!!saved.paper);
        setLabel(saved.label || "");
        setReference(saved.reference || "");
        setUrl(saved.url || "");
        setStage(saved.stage || 1);
        setCompared(!!saved.compared);
        setOutcome(saved.outcome || "");
        setDate(saved.date || localDay());
        setReview(saved.review || "");
        setNoReview(!!saved.noReview);
        setMessage(
          saved.goal || saved.answer
            ? "Unfinished session restored in this tab."
            : "",
        );
      }
    } catch {}
    setHydratedKey(draftKey);
  }, [draftKey]);
  useEffect(() => {
    if (hydratedKey !== draftKey) return;
    try {
      if (dirty)
        sessionStorage.setItem(
          draftKey,
          JSON.stringify({
            goal,
            answer,
            paper,
            label,
            reference,
            url,
            stage,
            compared,
            outcome,
            date,
            review,
            noReview,
          }),
        );
      else sessionStorage.removeItem(draftKey);
    } catch {}
  }, [
    hydratedKey,
    draftKey,
    dirty,
    goal,
    answer,
    paper,
    label,
    reference,
    url,
    stage,
    compared,
    outcome,
    date,
    review,
    noReview,
  ]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const leave = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest("a");
      if (dirty && a && a.getAttribute("href")?.startsWith("#/")) {
        if (
          !window.confirm(
            "Leave this sheet? Your unfinished session is kept in this tab.",
          )
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", leave, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", leave, true);
    };
  }, [dirty]);
  const close = () => {
    if (
      dirty &&
      !window.confirm(
        "Close this sheet? Your unfinished session is kept in this tab.",
      )
    )
      return;
    onClose?.();
  };
  const reset = () => {
    try {
      sessionStorage.removeItem(draftKey);
    } catch {}
    setGoal("");
    setAnswer("");
    setPaper(false);
    setLabel("");
    setReference("");
    setUrl("");
    setStage(1);
    setCompared(false);
    setOutcome("");
    setDate(localDay());
    setReview("");
    setNoReview(false);
  };
  const choose = (cid: string, tid?: string) => {
    if (
      dirty &&
      !window.confirm(
        "Discard the unfinished session? Recorded attempts are kept.",
      )
    )
      return;
    reset();
    setMessage("");
    setParams({ course: cid, ...(tid ? { topic: tid } : {}) });
  };
  const save = () => {
    if (commitLock.current) return;
    commitLock.current = true;
    try {
      if (!compared)
        throw Error("Compare your work before recording an outcome.");
      if (!validDay(date) || date > localDay())
        throw Error("Use a valid attempt date, not a future date.");
      let saved: any;
      commitStudy((old) => {
        const recorded = recordAttempt(old, {
          topicId: node.id,
          courseId: course.id,
          unitId: node.unitId,
          goal,
          answer,
          paper,
          outcome,
          reference: {
            kind: "user",
            label,
            text: reference,
            ...(url ? { url } : {}),
          },
          day: date,
          review: noReview ? null : review,
        });
        saved = recorded.attempts[recorded.attempts.length - 1];
        return recorded;
      });
      setMotionReady(true);
      setReceipt(saved);
      reset();
      setMessage("Attempt saved. Coverage stays unchanged.");
    } catch (e) {
      commitLock.current = false;
      setMessage(
        e instanceof Error ? e.message : "Could not save this attempt.",
      );
    }
  };
  const undo = (id: string) => {
    try {
      commitStudy((old) => undoAttempt(old, id));
      setReceipt(null);
      commitLock.current = false;
      setMessage("Attempt undone. Coverage kept.");
    } catch {
      setMessage(
        "Could not undo in this browser. The saved attempt is unchanged. Try again after freeing storage.",
      );
    }
  };
  if (legacy)
    return (
      <>
        <button
          className="studio-legacy-return"
          onClick={() => setLegacy(false)}
        >
          ← Return to study sheet
        </button>
        <LegacyStudy embedded={embedded} />
      </>
    );
  if (!course || !node)
    return (
      <div className="studio-page">
        <EditionNav />
        <main>
          <h1>Your revision space.</h1>
          <p>Add a course before starting a session.</p>
          <Link to="/directory">Choose courses ↗</Link>
        </main>
      </div>
    );
  const method = subjectMethod(course),
    state = study.topics[node.id] || {};
  const history = (study.attempts || [])
    .filter((a) => a.topicId === node.id)
    .slice()
    .reverse();
  return (
    <div
      className={`studio-page ${motionReady ? "studio-feedback" : ""} ${embedded ? "studio-embedded" : ""} method-${method.key}`}
    >
      {!embedded && <EditionNav />}
      <main>
        {embedded ? (
          <header className="studio-embedded-heading">
            <span>YOUR STUDY SHEET</span>
            <button onClick={close}>← Back to desk</button>
          </header>
        ) : (
          <header className="studio-heading">
            <p>THE EXAM EDITION / REVISION WORK</p>
            <h1>
              Do the work.
              <br />
              <i>Then check it.</i>
            </h1>
            <span>Local, self-reported practice. No automatic grading.</span>
          </header>
        )}
        {!embedded && (
          <details className="studio-select">
            <summary>Choose course & topic</summary>
            <div className="studio-selectors">
              <label>
                Course
                <select
                  aria-label="Course"
                  value={course.id}
                  onChange={(e) => choose(e.target.value)}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Topic
                <select
                  aria-label="Topic"
                  value={node.id}
                  onChange={(e) => choose(course.id, e.target.value)}
                >
                  {nodes.map((n: any) => (
                    <option key={n.id} value={n.id}>
                      Unit {n.unit.unit_number} · {n.text}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </details>
        )}
        <p className="studio-draft-note">
          Unfinished work stays in this tab. Closing the tab clears it. Only
          recorded attempts go in your backup.
        </p>
        <div className="studio-layout">
          <article className={`studio-paper stage-${stage}`}>
            <div className="studio-topic">
              <p>
                {course.code} / UNIT {node.unit.unit_number}
              </p>
              <h2>{node.text}</h2>
              <small>
                {state.status === "done"
                  ? "Covered by you"
                  : "Not marked covered"}{" "}
                ·{" "}
                {state.lastAttempt
                  ? `Last attempt: ${state.lastAttempt}`
                  : "No attempt recorded"}
              </small>
            </div>
            {!receipt && (
              <nav className="studio-steps" aria-label="Session stage">
                {["Set the task", "Make an attempt", "Compare & record"].map(
                  (x, i) => (
                    <span
                      key={x}
                      aria-current={stage === i + 1 ? "step" : undefined}
                    >
                      <b>0{i + 1}.</b>
                      {x}
                    </span>
                  ),
                )}
              </nav>
            )}
            {receipt ? (
              <section
                className="studio-receipt"
                key={receipt.id}
                ref={stageFocus}
                tabIndex={-1}
              >
                <svg viewBox="0 0 48 48" aria-hidden="true">
                  <circle cx="24" cy="24" r="22" />
                  <path d="m13 25 7 7 15-17" />
                </svg>
                <p className="studio-kicker">ONE REAL ATTEMPT</p>
                <h3>Attempt saved.</h3>
                <p>{receipt.goal}</p>
                <dl>
                  <div>
                    <dt>Outcome, judged by you</dt>
                    <dd>
                      {receipt.outcome === "solo"
                        ? "Without help"
                        : receipt.outcome === "hint"
                          ? "Needed a hint"
                          : "Try again"}
                    </dd>
                  </div>
                  <div>
                    <dt>Next return</dt>
                    <dd>{receipt.review || "Not scheduled"}</dd>
                  </div>
                </dl>
                <p className="studio-note">
                  Coverage stays unchanged. Your planned session stays as you
                  left it.
                </p>
                <div className="studio-actions">
                  <button
                    onClick={() => {
                      undo(receipt.id);
                    }}
                  >
                    Undo attempt
                  </button>
                  <button
                    className="studio-primary"
                    onClick={() => {
                      setReceipt(null);
                      commitLock.current = false;
                      setMessage("");
                      if (embedded) onClose?.();
                    }}
                  >
                    {" "}
                    {embedded ? "Back to desk" : "Another task"} →
                  </button>
                </div>
              </section>
            ) : stage === 1 ? (
              <section
                key="task"
                className="studio-stage"
                ref={stageFocus}
                tabIndex={-1}
              >
                <p className="studio-kicker">01 / A CONCRETE TASK</p>
                <h3>{method.verb}.</h3>
                <p>{method.prompt}</p>
                <label>
                  The question or task you chose
                  <textarea
                    maxLength={10000}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Paste the actual question, or describe the task from your notes."
                  />
                </label>
                <p className="studio-note">
                  This topic label is a syllabus heading, not a question or an
                  answer key. Use your course material to choose a task.
                </p>
                <button
                  className="studio-primary"
                  disabled={!goal.trim()}
                  onClick={() => {
                    setMotionReady(true);
                    setStage(2);
                  }}
                >
                  Start the attempt →
                </button>
              </section>
            ) : stage === 2 ? (
              <section
                key="attempt"
                className="studio-stage"
                ref={stageFocus}
                tabIndex={-1}
              >
                <p className="studio-kicker">02 / WITHOUT THE ANSWER</p>
                <h3>Your attempt.</h3>
                <details className="studio-task-reference"><summary>The task you chose</summary><blockquote>{goal}</blockquote></details>
                <p>{method.steps[1]}</p>
                <label>
                  Your work or explanation
                  <textarea
                    maxLength={10000}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={
                      method.key === "code"
                        ? "Trace, code, cases and reasoning…"
                        : "Steps, reasoning, assumptions and result…"
                    }
                  />
                </label>
                <label className="studio-check">
                  <input
                    type="checkbox"
                    checked={paper}
                    onChange={(e) => setPaper(e.target.checked)}
                  />{" "}
                  I made this attempt on paper or in my editor.
                </label>
                <p className="studio-note">
                  Paper/editor work is your declaration. It is not uploaded or
                  checked by the app.
                </p>
                <div className="studio-actions">
                  <button
                    onClick={() => {
                      setMotionReady(true);
                      setStage(1);
                    }}
                  >
                    ← Edit task
                  </button>
                  <button
                    className="studio-primary"
                    disabled={!answer.trim() && !paper}
                    onClick={() => {
                      setMotionReady(true);
                      setStage(3);
                    }}
                  >
                    Compare my work →
                  </button>
                </div>
              </section>
            ) : (
              <section
                key="compare"
                className="studio-stage"
                ref={stageFocus}
                tabIndex={-1}
              >
                <p className="studio-kicker">
                  03 / CHECK WITH A REAL REFERENCE
                </p>
                <h3>What needs another pass?</h3>
                <details className="studio-task-reference"><summary>The task you chose</summary><blockquote>{goal}</blockquote></details>
                <p>{method.check}</p>
                <details>
                  <summary>See my attempt</summary>
                  <pre>
                    {answer ||
                      "Attempt completed on paper / in editor, declared by you."}
                  </pre>
                </details>
                <label>
                  Comparison source name
                  <input
                    maxLength={10000}
                    value={label}
                    onChange={(e) => {
                      setLabel(e.target.value);
                      setCompared(false);
                    }}
                    placeholder="Your notes, textbook section, worked solution…"
                  />
                </label>
                <details className="studio-optional-url"><summary>Add a reference link (optional)</summary><label>
                  Reference URL (optional)
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://…"
                  />
                </label></details>
                <label>
                  Reference steps or explanation
                  <textarea
                    maxLength={10000}
                    value={reference}
                    onChange={(e) => {
                      setReference(e.target.value);
                      setCompared(false);
                    }}
                    placeholder="Paste or summarize the worked reasoning you compared against. A heading is not an answer."
                  />
                </label>
                <p className="studio-note">
                  User-supplied reference, not reviewed by PrepTracker. Keep
                  copyrighted/private material private. It stays in this browser
                  and your exported backup.
                </p>
                <label className="studio-check">
                  <input
                    type="checkbox"
                    checked={compared}
                    disabled={!label.trim() || !reference.trim()}
                    onChange={(e) => setCompared(e.target.checked)}
                  />{" "}
                  I compared my attempt with this reference.
                </label>
                <fieldset disabled={!compared}>
                  <legend>Outcome, judged by you</legend>
                  <div className="studio-outcomes">
                    {[
                      ["again", "Try again", "1 day"],
                      ["hint", "Needed a hint", "3 days"],
                      ["solo", "Without help", "7 days"],
                    ].map(([v, t, d]) => (
                      <button
                        key={v}
                        aria-pressed={outcome === v}
                        onClick={() => {
                          setOutcome(v);
                          setReview(reviewDay(date, v));
                        }}
                      >
                        {t}
                        <small>{d}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="studio-date-pair"><label>
                  Attempt date
                  <input
                    type="date"
                    value={date}
                    max={localDay()}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (validDay(e.target.value) && outcome)
                        setReview(reviewDay(e.target.value, outcome));
                    }}
                  />
                </label>
                <label>
                  Next return (editable)
                  <input
                    type="date"
                    value={review}
                    disabled={noReview}
                    onChange={(e) => setReview(e.target.value)}
                  />
                </label></div>
                <label className="studio-check">
                  <input
                    type="checkbox"
                    checked={noReview}
                    onChange={(e) => setNoReview(e.target.checked)}
                  />{" "}
                  No scheduled return for this attempt
                </label>
                <p className="studio-note">
                  1 / 3 / 7 days are simple defaults, not a prediction of
                  memory. Recording an attempt does not mark this topic covered
                  or change a planned session.
                </p>
                <div className="studio-actions">
                  <button
                    onClick={() => {
                      setStage(2);
                      setCompared(false);
                    }}
                  >
                    ← Edit attempt
                  </button>
                  <button
                    className="studio-primary"
                    disabled={
                      !compared || !outcome || !date || (!noReview && !review)
                    }
                    onClick={save}
                  >
                    Record this attempt ✓
                  </button>
                </div>
              </section>
            )}
            <p
              className={`studio-message ${receipt && message === "Attempt saved. Coverage stays unchanged." ? "receipt-status" : ""}`}
              role="status"
            >
              {message}
            </p>
          </article>
          <aside>
            <details className="studio-method">
              <summary>How to work on this topic</summary>
              <section style={{ background: method.color }}>
                <p>THE WAY TO WORK</p>
                <h2>{method.label}.</h2>
                <ol>
                  {method.steps.map((s: string) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <Link
                  to={`/subject/${encodeURIComponent(course.id)}?unit=${encodeURIComponent(node.unitId)}`}
                >
                  Open subject & materials ↗
                </Link>
              </section>
            </details>
            <details className="studio-materials">
              <summary>Materials for this topic</summary>
              <MaterialShelf course={course} text={node.text} />
            </details>
            <details className="studio-trail">
              <summary>This topic's trail ({history.length})</summary>
              <section>
                <h2>This topic's trail.</h2>
                {history.length ? (
                  history.map((a, i) => (
                    <details key={a.id}>
                      <summary>
                        {a.day} ·{" "}
                        {a.outcome === "solo"
                          ? "Without help"
                          : a.outcome === "hint"
                            ? "Needed a hint"
                            : "Try again"}
                      </summary>
                      <p>{a.goal}</p>
                      <pre>
                        {a.answer || "Paper/editor attempt, self-reported."}
                      </pre>
                      <p>Compared with {a.reference.label} (user-supplied)</p>
                      <pre>{a.reference.text}</pre>
                      <small>Recorded return: {a.review || "None"}</small>
                      {i === 0 && (
                        <button
                          onClick={() => {
                            undo(a.id);
                          }}
                        >
                          Undo this attempt
                        </button>
                      )}
                    </details>
                  ))
                ) : (
                  <p>
                    No attempts yet. Nothing appears here until you record
                    actual work.
                  </p>
                )}
                {state.lastAttempt && (
                  <label>
                    Current next return
                    <input
                      type="date"
                      value={state.nextReview || ""}
                      onChange={(e) =>
                        setStudy((old) =>
                          editReview(old, node.id, e.target.value || null),
                        )
                      }
                    />
                  </label>
                )}
              </section>
            </details>
            <details className="studio-earlier">
              <summary>Earlier records ({study.events.length})</summary>
              <button
                className="studio-legacy"
                onClick={() => {
                  if (
                    dirty &&
                    !window.confirm(
                      "Discard unfinished session and view earlier records?",
                    )
                  )
                    return;
                  reset();
                  setLegacy(true);
                }}
              >
                Earlier confidence records ({study.events.length}) ↗
              </button>
              <p className="studio-note">
                Old revision records remain unchanged. They are not upgraded
                into practice evidence.
              </p>
            </details>
          </aside>
        </div>
        {!embedded && (
          <footer>
            <Link to="/">← Back to desk</Link>
            <Link to="/settings">Back up your work ↗</Link>
          </footer>
        )}
      </main>
    </div>
  );
}
