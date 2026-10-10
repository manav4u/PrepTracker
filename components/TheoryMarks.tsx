import React from "react";
import { CATALOG } from "../lib/catalog";
import { writeLocal } from "../lib/local-write.mjs";
import { theoryCourses, theoryTotal } from "../lib/theoryMarks.mjs";

const KEY = "sppu_theory_marks";
type Row = { cce?: number; ese?: number };

export default function TheoryMarks({ selectedIds }: { selectedIds: string[] }) {
  const courses = theoryCourses(CATALOG, selectedIds) as any[];
  const [marks, setMarks] = React.useState<Record<string, Row>>(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "{}");
      return v && typeof v === "object" && !Array.isArray(v) ? v : {};
    } catch {
      return {};
    }
  });
  const [problem, setProblem] = React.useState("");
  if (!courses.length) return null;
  const set = (id: string, field: "cce" | "ese", raw: string, max: number) => {
    const row = { ...(marks[id] || {}) } as Row;
    if (raw === "") delete row[field];
    else {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 0 || n > max) {
        setProblem(`Enter a whole number from 0 to ${max}. Your last saved mark was kept.`);
        return;
      }
      row[field] = n;
    }
    const next = { ...marks, [id]: row };
    try {
      writeLocal(localStorage, KEY, next);
      setMarks(next);
      setProblem("");
    } catch (e) {
      setProblem((e as Error).message);
    }
  };
  return (
    <section className="marks-theory" aria-label="SE and TE theory marks">
      <h2>Your SE / TE theory marks.</h2>
      <p>
        Each course uses its own official CCE and End-Sem maximum. This shows
        marks out of the total and a percentage only. It does not give grade
        points or an SGPA, because term work and practical credits for SE and
        TE are not mapped yet. Check your college for those.
      </p>
      {problem && <p role="alert">{problem}</p>}
      {courses.map((c) => {
        const t = theoryTotal(c, marks[c.id]);
        return (
          <article className="marks-row" key={c.id}>
            <div className="marks-row-title">
              <div>
                <p>
                  {c.code} · {c.year} · {c.credits} listed credits
                </p>
                <h3>{c.name}</h3>
              </div>
            </div>
            <div className="marks-fields">
              <label>
                CCE / {t.cceMax}
                <input
                  type="number"
                  min="0"
                  max={t.cceMax}
                  aria-label={`CCE marks: ${c.name}`}
                  value={marks[c.id]?.cce ?? ""}
                  placeholder="--"
                  onChange={(e) => set(c.id, "cce", e.target.value, t.cceMax)}
                />
              </label>
              <label>
                END-SEM / {t.eseMax}
                <input
                  type="number"
                  min="0"
                  max={t.eseMax}
                  aria-label={`End-Sem marks: ${c.name}`}
                  value={marks[c.id]?.ese ?? ""}
                  placeholder="--"
                  onChange={(e) => set(c.id, "ese", e.target.value, t.eseMax)}
                />
              </label>
              <p role="status">
                {t.done
                  ? `${t.total} / ${t.max} · ${t.percent}%`
                  : "Enter both marks to see the total."}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
