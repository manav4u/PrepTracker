import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import EditionNav from "../components/EditionNav";
import { CATALOG } from "../lib/catalog";
import { useData } from "../context/DataContext";
import useLocalDay from "../hooks/useLocalDay";
import { deskModel, visitDelta } from "../lib/desk.mjs";
import { dueLabel, validDay } from "../lib/dates.mjs";
import "../paper-desk.css";
const courseLink = (n: any) =>
  `/subject/${encodeURIComponent(n.courseId || n.course.id)}${n.unitId ? "?unit=" + encodeURIComponent(n.unitId) : ""}`;
const fmt = (
  day: string,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" },
) => new Date(day + "T12:00:00").toLocaleDateString("en", opts);
function Tally({ value }: { value: number }) {
  return <span>{value}</span>;
}
export default function Dashboard() {
  const { profile, study, tasks, resources } = useData(),
    today = useLocalDay();
  const courses = CATALOG.filter((c) =>
    profile?.selectedSubjects?.includes(c.id),
  );
  const model = deskModel(courses, study, tasks, today);
  const [picked, setPicked] = useState<any>(null),
    [paperId, setPaperId] = useState(""),
    [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null),
    [previous] = useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem("preptracker-desk-visit-v1") || "null",
        );
      } catch {
        return null;
      }
    });
  const delta = visitDelta(previous, model.nodes, study),
    pending = tasks.filter((t) => !t.completed),
    paper = model.papers.find((p: any) => p.id === paperId) || model.papers[0];
  useEffect(() => {
    if (picked && !dialog.current?.open) dialog.current?.showModal();
  }, [picked]);
  useEffect(() => {
    const snapshot = {
      courses: courses.map((c) => c.id),
      covered: model.nodes
        .filter((n: any) => study.topics[n.id]?.status === "done")
        .map((n: any) => n.id),
      at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(
        "preptracker-desk-visit-v1",
        JSON.stringify(snapshot),
      );
    } catch {}
  }, [
    JSON.stringify(courses.map((c) => c.id)),
    JSON.stringify(
      model.nodes
        .filter((n: any) => study.topics[n.id]?.status === "done")
        .map((n: any) => n.id),
    ),
  ]);
  if (!profile) return null;
  const found = query.trim()
    ? model.nodes
        .filter((n: any) =>
          (n.text + " " + n.course.name + " " + n.course.code)
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
        )
        .slice(0, 12)
    : [];
  const close = () => {
    dialog.current?.close();
    setPicked(null);
  };
  return (
    <div className="paper-desk">
      <EditionNav />
      <main className="pd-wrap">
        <header className="pd-greeting">
          <div>
            <p>
              {profile.name}'s desk /{" "}
              {fmt(today, { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1>Before the paper.</h1>
          </div>
          <div className="pd-search">
            <label htmlFor="desk-search">Find a course or topic</label>
            <input
              id="desk-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, code, syllabus topic"
            />
            {query.trim() && (
              <div className="pd-results" aria-label="Search results">
                <p>
                  {found.length
                    ? "Matching source topics"
                    : "No match in your selected courses."}
                </p>
                {found.map((n: any) => (
                  <Link key={n.id} to={courseLink(n)}>
                    {n.text}
                    <small>
                      {n.course.name} · Unit {n.unit.unit_number}
                    </small>
                  </Link>
                ))}
                <Link to="/directory">Search the full course library ↗</Link>
              </div>
            )}
          </div>
        </header>
        <section className="pd-sheet">
          <header className="pd-sheethead">
            <span className="pd-kicker">Your syllabus / at a glance</span>
            <span className="pd-badge">READ-ONLY OVERVIEW</span>
          </header>
          <h2>
            Your syllabus,
            <br />
            coming together.
          </h2>
          <div className="pd-summary">
            <div className="pd-ledger">
              <span className="pd-kicker">Topics covered</span>
              <strong>
                <Tally value={model.covered} />
                <small> / {model.total}</small>
              </strong>
              <p>
                {model.percent}% covered · {model.left} left
              </p>
              <div
                className="pd-progress"
                role="progressbar"
                aria-label="Syllabus coverage"
                aria-valuenow={model.percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <i style={{ width: model.percent + "%" }} />
              </div>
              {delta !== null && delta > 0 && (
                <span className="pd-change">
                  +{delta} covered since your last desk visit
                </span>
              )}
            </div>
            <div className="pd-stat">
              <span className="pd-kicker">Still to cover</span>
              <strong>
                <Tally value={model.left} />
              </strong>
              <p>
                Across {courses.length}{" "}
                {courses.length === 1 ? "course" : "courses"}
              </p>
            </div>
            <div className="pd-stat">
              <span className="pd-kicker">Revision returns</span>
              <strong>
                <Tally value={model.returns.length} />
              </strong>
              <p>Chosen return dates due</p>
            </div>
            <div className="pd-stat">
              <span className="pd-kicker">Next paper</span>
              <strong>
                {model.papers[0] ? (
                  <>
                    {model.papers[0].days}
                    <small>
                      {" "}
                      {model.papers[0].days === 0 ? "today" : "days"}
                    </small>
                  </>
                ) : (
                  "—"
                )}
              </strong>
              <p>{model.papers[0]?.course.name || "No upcoming paper set"}</p>
              <small>
                {model.papers[0]
                  ? fmt(model.papers[0].dueDate) + " · your date"
                  : "Add a linked exam task"}
              </small>
            </div>
          </div>
          {courses.length ? (
            <>
              <div className="pd-mapgrid">
                {model.shelves.map((s: any, i: number) => (
                  <article className="pd-map" key={s.course.id}>
                    <header>
                      <h3>{s.course.name}</h3>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                    </header>
                    <div className="pd-tiles">
                      {s.nodes.map((n: any, j: number) => (
                        <button
                          key={n.id}
                          className={
                            study.topics[n.id]?.status === "done"
                              ? "covered"
                              : ""
                          }
                          aria-label={`${s.course.name}: ${n.text}. ${study.topics[n.id]?.status === "done" ? "Covered" : "Still to cover"}. Show detail`}
                          title={`${n.text} · ${study.topics[n.id]?.status === "done" ? "Covered" : "Still to cover"}`}
                          onClick={() => setPicked({ kind: "topic", node: n })}
                        >
                          {j + 1}
                        </button>
                      ))}
                    </div>
                    <footer>
                      <span>
                        {s.covered}/{s.total} covered
                      </span>
                      <span>{s.total - s.covered} left</span>
                    </footer>
                  </article>
                ))}
              </div>
              <p className="pd-legend">
                <i />
                Covered <i className="empty" />
                Still to cover{" "}
                <span>
                  One tile = one source topic. Tap for detail, not to edit.
                </span>
              </p>
              <section className="pd-next">
                <span className="pd-kicker">Continue in Courses</span>
                <div>
                  <h3>{model.next?.text || "Everything marked covered."}</h3>
                  <p>
                    {model.next
                      ? `${model.next.course.name} / Unit ${model.next.unit.unit_number}`
                      : "Coverage is your own record, not a promise of exam readiness."}
                  </p>
                </div>
                <Link
                  className="pd-primary"
                  to={model.next ? courseLink(model.next) : "/directory"}
                >
                  {model.next ? "Open this unit" : "Open your courses"} ↗
                </Link>
              </section>
            </>
          ) : (
            <div className="pd-empty">
              <h3>Make this desk yours.</h3>
              <p>
                Select the theory courses you are preparing for. Their syllabus
                will appear here without sample progress.
              </p>
              <Link className="pd-primary" to="/directory">
                Choose courses ↗
              </Link>
            </div>
          )}
        </section>
        <header className="pd-sectiontitle">
          <h2>Your courses.</h2>
          <Link to="/directory">Manage courses ↗</Link>
        </header>
        <div className="pd-cards">
          {model.shelves.map((s: any, i: number) => {
            const focus =
              s.nodes.find(
                (n: any) => study.topics[n.id]?.status === "studying",
              ) ||
              s.nodes.find((n: any) => study.topics[n.id]?.status !== "done");
            return (
              <article className="pd-card" key={s.course.id}>
                <header>
                  <span>{s.course.code}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </header>
                <h3>{s.course.name}</h3>
                <p>
                  {s.course.credits} credits · {s.total} topics ·{" "}
                  {s.units.length} units
                </p>
                <div className="pd-focus">
                  <span className="pd-kicker">
                    {focus ? "Next uncovered topic" : "Coverage complete"}
                  </span>
                  <h4>{focus?.unit.title || "Return to your course notes"}</h4>
                  <p>{focus?.text || "All topics marked covered by you."}</p>
                </div>
                <div className="pd-ribbon" aria-label="Unit coverage">
                  {s.units.map((u: any) => (
                    <button
                      key={u.id}
                      className={
                        u.covered === u.total && u.total
                          ? "full"
                          : u.covered
                            ? "partial"
                            : ""
                      }
                      aria-label={`Unit ${u.unit_number}: ${u.title}. ${u.covered}/${u.total} covered. Show detail`}
                      title={`${u.title}: ${u.covered}/${u.total}`}
                      onClick={() =>
                        setPicked({ kind: "unit", unit: u, course: s.course })
                      }
                    >
                      <b>{String(u.unit_number).padStart(2, "0")}</b>
                      <i
                        style={{
                          height:
                            (u.total ? (u.covered / u.total) * 100 : 0) + "%",
                        }}
                      />
                    </button>
                  ))}
                </div>
                <footer>
                  <span>
                    {s.covered}/{s.total} covered
                  </span>
                  <Link to={`/subject/${encodeURIComponent(s.course.id)}`}>
                    Open course ↗
                  </Link>
                </footer>
              </article>
            );
          })}
        </div>
        <div className="pd-row">
          <section className="pd-panel pd-folio">
            <header>
              <span className="pd-kicker">Paper calendar / your dates</span>
              <Link to="/tasks">Set dates ↗</Link>
            </header>
            <h3>The papers ahead.</h3>
            {model.papers.length ? (
              <>
                <div className="pd-paperdates">
                  {model.papers.map((p: any) => (
                    <button
                      key={p.id}
                      aria-pressed={paper?.id === p.id}
                      onClick={() => setPaperId(p.id)}
                    >
                      <span>{fmt(p.dueDate, { month: "short" })}</span>
                      <b>{fmt(p.dueDate, { day: "numeric" })}</b>
                      <small>{p.course.code}</small>
                    </button>
                  ))}
                </div>
                <div className="pd-paperdetail">
                  <span className="pd-kicker">
                    {paper.days === 0
                      ? "TODAY"
                      : paper.days + " CALENDAR DAYS LEFT"}
                  </span>
                  <h4>{paper.text}</h4>
                  <p>
                    {paper.course.name} ·{" "}
                    {fmt(paper.dueDate, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <Link to={`/subject/${encodeURIComponent(paper.courseId)}`}>
                    Open paper's course ↗
                  </Link>
                </div>
                <p className="pd-note">
                  User-entered exam tasks, not an official timetable. Paper
                  times are not stored. Calendar days update at midnight.
                  Multiple papers on one date remain separate.
                </p>
              </>
            ) : (
              <div className="pd-empty">
                <p>
                  No upcoming linked exam dates. Add an Exam task, select its
                  course, and enter the paper date.
                </p>
                <Link to="/tasks">Add a paper date ↗</Link>
                <p className="pd-note">
                  Past dates and unlinked exams remain in Tasks.
                </p>
              </div>
            )}
          </section>
          <section className="pd-panel">
            <header>
              <span className="pd-kicker">Today's plan</span>
              <Link to="/planner">Open plan ↗</Link>
            </header>
            <h3>A place to begin.</h3>
            {model.planned.length ? (
              model.planned.slice(0, 4).map((p: any) => (
                <Link className="pd-planrow" key={p.id} to={courseLink(p.node)}>
                  <div>
                    <h4>{p.label}</h4>
                    <small>
                      {p.node.course.name} · Unit {p.node.unit.unit_number}
                    </small>
                  </div>
                  <span>{p.minutes} min</span>
                </Link>
              ))
            ) : (
              <>
                <p className="pd-note">
                  No planned sessions today. Your plan stays separate from the
                  coverage record.
                </p>
                <Link className="pd-link" to="/planner">
                  Make room in your plan ↗
                </Link>
              </>
            )}
            {model.planned.length > 4 && (
              <Link className="pd-link" to="/planner">
                {model.planned.length - 4} more sessions ↗
              </Link>
            )}
            <div className="pd-taskbox">
              <header>
                <h4>Pending tasks / {pending.length}</h4>
                <Link to="/tasks">All tasks ↗</Link>
              </header>
              {pending.slice(0, 3).map((t) => (
                <Link className="pd-task" key={t.id} to="/tasks">
                  {t.text}
                  <small>
                    {validDay(t.dueDate)
                      ? dueLabel(t.dueDate, today) + " · " + fmt(t.dueDate)
                      : "No date"}{" "}
                    · {t.priority.toLowerCase()}
                  </small>
                </Link>
              ))}
              {!pending.length && (
                <p className="pd-note">Nothing pending in Tasks.</p>
              )}
            </div>
          </section>
        </div>
        <div className="pd-row">
          <section className="pd-panel">
            <header>
              <span className="pd-kicker">Revision return slips</span>
              <Link to="/study">Revision page ↗</Link>
            </header>
            <h3>Come back to these.</h3>
            <div className="pd-slips">
              {model.returns.slice(0, 5).map((n: any) => (
                <button
                  className="pd-slip"
                  key={n.id}
                  onClick={() => setPicked({ kind: "topic", node: n })}
                >
                  <span>RETURN / {fmt(n.date)}</span>
                  <h4>{n.text}</h4>
                  <small>
                    {n.course.name} · Unit {n.unit.unit_number}
                  </small>
                  <b>Read detail ↗</b>
                </button>
              ))}
            </div>
            {!model.returns.length && (
              <p className="pd-note">
                No chosen returns are due. Revision dates come from your saved
                topic records, not an automatic readiness score.
              </p>
            )}
            {model.returns.length > 5 && (
              <Link className="pd-link" to="/study">
                {model.returns.length - 5} more returns ↗
              </Link>
            )}
            <p className="pd-note">
              These are your recorded return dates. The desk does not mark
              anything revised.
            </p>
          </section>
          <section className="pd-panel">
            <span className="pd-kicker">Course coverage / not activity</span>
            <h3>Same syllabus, another view.</h3>
            <div className="pd-chart">
              {model.shelves.map((s: any) => (
                <Link
                  to={`/subject/${encodeURIComponent(s.course.id)}`}
                  key={s.course.id}
                  title={`${s.course.name}: ${s.covered}/${s.total} covered`}
                >
                  <div className="pd-chart-rail">
                    <i
                      style={{
                        height:
                          (s.total ? (s.covered / s.total) * 100 : 0) + "%",
                      }}
                    />
                    <b>
                      {s.total ? Math.round((s.covered / s.total) * 100) : 0}%
                    </b>
                  </div>
                  <small>{s.course.name}</small>
                </Link>
              ))}
            </div>
            <p className="pd-note">
              Topic coverage only. No streak, daily activity claim, mastery
              estimate or marks prediction.
            </p>
          </section>
        </div>
        <section className="pd-panel pd-materials">
          <header>
            <span className="pd-kicker">On your shelf</span>
            <Link to="/resources">All resources ↗</Link>
          </header>
          <h3>Keep the useful things close.</h3>
          <div className="pd-resources">
            <Link to="/directory">Official syllabus library ↗</Link>
            <Link to="/resources">
              Saved course materials / {resources.length} ↗
            </Link>
            <Link to="/calculator">Marks calculator ↗</Link>
            <Link to="/settings">Backup & restore ↗</Link>
          </div>
          <div className="pd-assistant">
            <div>
              <h4>Your notes and references first.</h4>
              <p>
                Use the course page for topic coverage. The existing revision
                page keeps your earlier work and attempts.
              </p>
            </div>
            <span>AI tutor unavailable</span>
          </div>
        </section>
        <footer className="pd-footer">
          <span>Saved in this browser · no account sync</span>
          <Link to="/settings">Keep a backup ↗</Link>
        </footer>
      </main>
      <dialog
        ref={dialog}
        className="pd-dialog"
        onClose={() => setPicked(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div>
          {picked && (
            <>
              <header>
                <span className="pd-kicker">
                  {picked.kind === "unit" ? "UNIT DETAIL" : "SOURCE TOPIC"}
                </span>
                <button aria-label="Close detail" onClick={close}>
                  ✕
                </button>
              </header>
              <h2>
                {picked.kind === "unit" ? picked.unit.title : picked.node.text}
              </h2>
              <p>
                {(picked.course || picked.node.course).name} · Unit{" "}
                {picked.unit?.unit_number || picked.node.unit.unit_number}
              </p>
              {picked.kind === "unit" ? (
                <>
                  <strong>
                    {picked.unit.covered}/{picked.unit.total} topics covered
                  </strong>
                  <ul>
                    {picked.unit.nodes.map((n: any) => (
                      <li key={n.id}>
                        <span>
                          {study.topics[n.id]?.status === "done" ? "✓" : "○"}
                        </span>
                        {n.text}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <strong>
                    {study.topics[picked.node.id]?.status === "done"
                      ? "Covered by you"
                      : "Still to cover"}
                  </strong>
                  <p>
                    {study.topics[picked.node.id]?.nextReview
                      ? "Your next return: " +
                        study.topics[picked.node.id].nextReview
                      : "No next return date saved for this topic."}
                  </p>
                </>
              )}
              <p className="pd-note">
                This desk is an overview. Coverage and revision changes belong
                on their own pages.
              </p>
              <Link
                className="pd-primary"
                onClick={close}
                to={
                  picked.kind === "unit"
                    ? `/subject/${encodeURIComponent(picked.course.id)}?unit=${encodeURIComponent(picked.unit.id)}`
                    : courseLink(picked.node)
                }
              >
                Open course unit ↗
              </Link>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
