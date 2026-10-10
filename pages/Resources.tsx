import DeskSketch from "../components/DeskSketch";
import { CATALOG } from "../lib/catalog";
import "../link-cabinet.css";
import EditionNav from "../components/EditionNav";
import React, { useState, useRef, useEffect } from "react";
import { getYouTubeID } from "../constants";
import { ResourceItem } from "../types";
import ResourceViewerModal from "../components/ResourceViewerModal";
import { useData } from "../context/DataContext";
export default function Resources() {
  const { profile, resources, addResource, deleteResources } = useData();
  const [tab, setTab] = useState("all"),
    [query, setQuery] = useState(""),
    [select, setSelect] = useState(false),
    [ids, setIds] = useState<Set<string>>(new Set()),
    [view, setView] = useState<ResourceItem | null>(null),
    [add, setAdd] = useState(false),
    [del, setDel] = useState(false),
    [form, setForm] = useState({
      title: "",
      url: "",
      category: "notes",
      subject: "GENERAL",
    }),
    [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!add && !del) return;
    const previous = document.activeElement as HTMLElement;
    dialogRef.current?.querySelector<HTMLElement>("input,button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAdd(false);
        setDel(false);
      }
      if (e.key === "Tab") {
        const els = Array.from(
            dialogRef.current?.querySelectorAll<HTMLElement>(
              "input,select,button",
            ) || [],
          ),
          first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [add, del]);
  const list = resources.filter(
    (r) =>
      (tab === "all" ||
        r.category.includes(tab) ||
        (tab === "textbooks" && r.type === "book")) &&
      `${r.title} ${r.subject}`.toLowerCase().includes(query.toLowerCase()),
  );
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = new URL(form.url);
      if (!["http:", "https:"].includes(url.protocol)) throw Error();
      if (!form.title.trim() || !form.subject) throw Error();
      addResource({
        id: crypto.randomUUID(),
        type: getYouTubeID(form.url) ? "video" : "link",
        title: form.title.trim(),
        author: "YOU",
        downloads: "0",
        subject: form.subject,
        category: form.category,
        url: form.url,
        isSystem: false,
      });
      setAdd(false);
      setForm({ title: "", url: "", category: "notes", subject: "GENERAL" });
      setError("");
    } catch (e) {
      setError(
        e instanceof Error && e.message.includes("save")
          ? e.message
          : "Enter a title and a full http or https link.",
      );
    }
  };
  return (
    <div className="link-cabinet">
      <EditionNav />
      <main>
        <header className="cabinet-heading">
          <p>THE EXAM EDITION / YOUR SAVED LINKS</p>
          <h1>
            Your reference
            <br />
            <i>cabinet.</i>
          </h1>
          <span>
            {resources.length}
            <small>LINKS IN THIS BROWSER</small>
          </span>
        <DeskSketch kind="links"/></header><section className="cabinet-drawers" aria-label="Resource drawers">{['notes','lecture streams','textbooks','solved pyqs'].map((category,i)=><button key={category} aria-pressed={tab===category} onClick={()=>setTab(tab===category?'all':category)}><span className="drawer-number">0{i+1}</span><strong>{resources.filter(r=>r.category.includes(category)||(category==='textbooks'&&r.type==='book')).length}</strong><span>{category}</span><i aria-hidden="true"/></button>)}</section>
        <p className="cabinet-disclosure">
          A cabinet for notes, videos and references. Saved locally, not
          cloud-synced. A saved link is not a verified endorsement. System
          resources can be hidden; custom resources can be removed.
        </p>
        <section className="cabinet-controls">
          <label>
            Find a resource
            <input
              aria-label="Find a resource"
              placeholder="Title or course code"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="cabinet-toolbar">
            {select ? (
              <>
                <span>{ids.size} selected</span>
                <button disabled={!ids.size} onClick={() => setDel(true)}>
                  Remove selected
                </button>
                <button
                  onClick={() => {
                    setSelect(false);
                    setIds(new Set());
                  }}
                >
                  Cancel selection
                </button>
              </>
            ) : (
              <button onClick={() => setSelect(true)}>Select resources</button>
            )}
            <button
              className="cabinet-primary"
              onClick={() => {
                setError("");
                setAdd(true);
              }}
            >
              Keep a new link +
            </button>
          </div>
        </section>
        <nav className="cabinet-tabs" aria-label="Resource categories">
          {["all", "notes", "lecture streams", "textbooks", "solved pyqs"].map(
            (t) => (
              <button
                aria-pressed={tab === t}
                key={t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ),
          )}
        </nav>
        {!list.length && (
          <section className="cabinet-empty">
            <span>∅</span>
            <h2>An empty drawer.</h2>
            <p>No matching resources. Change your search or keep a new link.</p>
          </section>
        )}
        <div className="cabinet-grid">
          {list.map((r, i) => (
            <button
              key={r.id}
              className={`cabinet-card tone-${i % 3} ${ids.has(r.id) ? "selected" : ""}`}
              style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              aria-label={`${select ? "Select" : "Open"} ${r.title}`}
              aria-pressed={select ? ids.has(r.id) : undefined}
              onClick={() => {
                if (!select) {
                  setView(r);
                  return;
                }
                setIds((old) => {
                  const next = new Set(old);
                  next.has(r.id) ? next.delete(r.id) : next.add(r.id);
                  return next;
                });
              }}
            >
              <div>
                <span>
                  {getYouTubeID(r.url) || r.type === "video" ? "▶" : "↗"}
                </span>
                <small>
                  {r.category} / {r.subject}
                </small>
                {select && <b>{ids.has(r.id) ? "✓" : "□"}</b>}
              </div>
              <h2>{r.title}</h2>
              <p>
                {r.isSystem ? "SYSTEM REFERENCE" : "YOUR SAVED LINK"} ·{" "}
                {r.author}
              </p>
              <footer>{select ? "SELECT / REMOVE" : "OPEN RESOURCE ↗"}</footer>
            </button>
          ))}
        </div>
        <ResourceViewerModal
          isOpen={!!view}
          resource={view}
          onClose={() => setView(null)}
        />
        {(add || del) && (
          <div className="cabinet-scrim">
            <div
              className="cabinet-dialog"
              role="dialog"
              aria-modal="true"
              aria-label={add ? "Keep a new link" : "Remove selected resources"}
              ref={dialogRef}
            >
              {add ? (
                <form onSubmit={save}>
                  <header>
                    <h2>Keep a new link.</h2>
                    <button
                      type="button"
                      aria-label="Close add resource"
                      onClick={() => setAdd(false)}
                    >
                      ×
                    </button>
                  </header>
                  <label>
                    Resource title
                    <input
                      required
                      maxLength={300}
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Link
                    <input
                      required
                      type="url"
                      value={form.url}
                      onChange={(e) =>
                        setForm({ ...form, url: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </label>
                  <label>
                    Category
                    <select
                      aria-label="Category"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      {[
                        "notes",
                        "lecture streams",
                        "textbooks",
                        "solved pyqs",
                        "cheatsheets",
                        "other",
                      ].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Related course
                    <select
                      aria-label="Related course"
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                    >
                      <option value="GENERAL">General / Other</option>
                      {CATALOG.filter((s) =>
                        profile?.selectedSubjects.includes(s.id),
                      ).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {error && <p role="alert">{error}</p>}
                  <button className="cabinet-primary">Save resource</button>
                </form>
              ) : (
                <>
                  <h2>Remove these links?</h2>
                  {error && <p role="alert">{error}</p>}
                  <p>
                    {ids.size} selected. Custom links are deleted; system
                    references are hidden in this browser. This does not delete
                    the source website.
                  </p>
                  <div className="cabinet-confirm">
                    <button onClick={() => setDel(false)}>Cancel</button>
                    <button
                      className="cabinet-primary"
                      onClick={() => {
                        try {
                          deleteResources(Array.from(ids));
                          setIds(new Set());
                          setSelect(false);
                          setDel(false);
                        } catch (e) {
                          setError((e as Error).message);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
