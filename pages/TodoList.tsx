import EditionStrip from "../components/EditionStrip";
import "../task-pins.css";
import EditionNav from "../components/EditionNav";
import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { CATALOG } from "../lib/catalog";
import { Task } from "../types";
import { dueLabel, validDay, calendarExport } from "../lib/dates.mjs";
export default function TodoList() {
  const { tasks, setTasks, profile } = useData();
  const [edit, setEdit] = useState<string | null>(null),
    [text, setText] = useState(""),
    [day, setDay] = useState(""),
    [category, setCategory] = useState<Task["category"]>("GENERAL"),
    [error, setError] = useState(""),
    [courseId, setCourseId] = useState("");
  const reset = () => {
    setEdit(null);
    setText("");
    setDay("");
    setCategory("GENERAL");
    setCourseId("");
    setError("");
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || (day && !validDay(day))) {
      setError("Enter a title and a valid date, or leave the date blank.");
      return;
    }
    try {
      if (edit)
        setTasks((old) =>
          old.map((t) =>
            t.id === edit
              ? {
                  ...t,
                  text: text.trim(),
                  dueDate: day || undefined,
                  courseId: courseId || undefined,
                  category,
                }
              : t,
          ),
        );
      else
        setTasks((old) => [
          ...old,
          {
            id: crypto.randomUUID(),
            text: text.trim(),
            dueDate: day || undefined,
            courseId: courseId || undefined,
            category,
            completed: false,
            priority: "NORMAL",
            createdAt: new Date().toISOString(),
          },
        ]);
      reset();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const changeTasks = (action: React.SetStateAction<Task[]>) => {
    try {
      setTasks(action);
      setError("");
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  };
  const exportCal = () => {
    const url = URL.createObjectURL(
      new Blob([calendarExport(tasks)], {
        type: "text/calendar;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "preptracker-deadlines.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="task-pins">
      <EditionNav />
      <main>
        <header className="pins-heading">
          <p>THE EXAM EDITION / YOUR OWN DATES</p>
          <h1>
            Pin it.
            <br />
            <i>Then do it.</i>
          </h1>
          <div>
            <span>
              {String(tasks.filter((t) => !t.completed).length).padStart(
                2,
                "0",
              )}
            </span>
            <p>
              OPEN LOOPS
              <br />
              ON YOUR BOARD
            </p>
          </div>
        </header><EditionStrip code="02 / BOARD" title="Dates with a place to land." facts={[{value:tasks.filter(t=>!t.completed).length,label:"open tasks"},{value:tasks.filter(t=>!t.completed&&t.category==='EXAM').length,label:"pending papers"},{value:tasks.filter(t=>t.completed).length,label:"marked complete"}]}/>
        <p className="pins-disclosure">
          Exam dates, lab work and assignments are entered by you, not an
          official timetable. Calendar export creates all-day events. It does
          not subscribe you to updates or send reminders from this closed page.
        </p>
        <div className="pins-layout">
          <form onSubmit={save} className="pins-form">
            <span className="pins-tape" />
            <p className="pins-eyebrow">A PLACE TO PUT IT DOWN</p>
            <h2>{edit ? "Edit your pin." : "A new pin."}</h2>
            <label>
              Title
              <input
                required
                maxLength={300}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
              />
            </label>
            <div className="pins-form-row">
              <label>
                Date (optional)
                <input
                  type="date"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                />
              </label>
              <label>
                Kind
                <select
                  aria-label="Kind"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Task["category"])
                  }
                >
                  <option value="GENERAL">Study task</option>
                  <option value="EXAM">Exam</option>
                  <option value="LAB">Lab work</option>
                  <option value="SUBMISSION">Assignment / submission</option>
                </select>
              </label>
            </div>
            <label>
              Related course (optional)
              <select
                aria-label="Related course (optional)"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">No course link</option>
                {CATALOG.filter((c) =>
                  profile?.selectedSubjects.includes(c.id),
                ).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            {error && <p role="alert">{error}</p>}
            <div className="pins-submit">
              <button>{edit ? "Save changes" : "Pin task + "}</button>
              {edit && (
                <button type="button" onClick={reset}>
                  Cancel
                </button>
              )}
            </div>
            <p className="pins-local">
              Saved in this browser. Give it a date when you have one.
            </p>
          </form>
          <section className="pins-board">
            <div className="pins-board-heading">
              <h2>Your pinboard.</h2>
              <button
                onClick={exportCal}
                disabled={
                  !tasks.some((t) => !t.completed && validDay(t.dueDate))
                }
              >
                Export dates (.ics) ↗
              </button>
            </div>
            {!tasks.length && (
              <div className="pins-empty">
                <span>＋</span>
                <h3>A little room to think.</h3>
                <p>
                  No tasks yet. Start with the one thing you don't want to
                  forget.
                </p>
              </div>
            )}
            <div className="pins-grid">
              {[...tasks]
                .sort(
                  (a, b) =>
                    Number(a.completed) - Number(b.completed) ||
                    (a.dueDate || "9999").localeCompare(b.dueDate || "9999"),
                )
                .map((t, i) => (
                  <article
                    key={t.id}
                    style={{ animationDelay: `${Math.min(i, 8) * 65}ms` }}
                    className={`pin-card tone-${i % 3} ${t.completed ? "pin-complete" : ""}`}
                  >
                    <span className="pin-dot" />
                    <p className="pin-meta">
                      {t.category} ·{" "}
                      {t.completed ? "Completed" : dueLabel(t.dueDate)}
                    </p>
                    <h3>{t.text}</h3>
                    {t.dueDate && (
                      <p className="pin-date">{t.dueDate} · entered by you</p>
                    )}
                    {t.courseId && (
                      <p className="pin-course">
                        {CATALOG.find((c) => c.id === t.courseId)?.name ||
                          "Linked course"}
                      </p>
                    )}
                    <div className="pin-actions">
                      <button
                        aria-pressed={t.completed}
                        onClick={() =>
                          changeTasks((old) =>
                            old.map((x) =>
                              x.id === t.id
                                ? { ...x, completed: !x.completed }
                                : x,
                            ),
                          )
                        }
                      >
                        {t.completed ? "Reopen ↺" : "Mark complete ✓"}
                      </button>
                      <button
                        onClick={() => {
                          setEdit(t.id);
                          setText(t.text);
                          setDay(t.dueDate || "");
                          setCategory(t.category);
                          setCourseId(t.courseId || "");
                          window.scrollTo(0, 0);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        aria-label={`Delete ${t.text}`}
                        onClick={() => {
                          if (confirm("Delete this task?")) {
                            const saved = changeTasks((old) => old.filter((x) => x.id !== t.id));
                            if (saved && edit === t.id) reset();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
