import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  HardDrive,
  Laptop,
  FileDown,
  CalendarDays,
  Wifi,
  Smartphone,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Search,
  X,
  ZoomIn,
} from "lucide-react";
import LogoMark from "../components/LogoMark";
import { GUIDE_CHAPTERS } from "../lib/guide";
import "../guide.css";

export default function Guide() {
  const { chapter: slug } = useParams();
  const chapter = GUIDE_CHAPTERS.find((c) => c.id === slug);
  const [query, setQuery] = useState("");
  const [step, setStep] = useState(0);
  const [zoom, setZoom] = useState(false);
  const close = useRef<HTMLButtonElement>(null);
  const imageButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setStep(0);
    setZoom(false);
    window.scrollTo(0, 0);
  }, [slug]);
  useEffect(() => {
    document.title = `${chapter ? chapter.title + " | " : ""}PrepTracker Guide`;
  }, [chapter]);
  useEffect(() => {
    if (!zoom) return;
    close.current?.focus();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "Tab") {
        e.preventDefault();
        close.current?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      imageButton.current?.focus();
    };
  }, [zoom]);
  const active = chapter?.steps[step];
  const nextChapter = chapter
    ? GUIDE_CHAPTERS[GUIDE_CHAPTERS.indexOf(chapter) + 1]
    : undefined;
  const filtered = GUIDE_CHAPTERS.filter((c) =>
    (c.title + " " + c.summary + " " + c.keywords)
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="pt-guide">
      <a className="guide-skip" href="#guide-content">
        Skip to guide
      </a>
      <header className="guide-header">
        <Link
          to="/guide"
          className="guide-brand"
          aria-label="PrepTracker Guide home"
        >
          <LogoMark size={28} />
          <span>
            PrepTracker <b>Guide</b>
          </span>
        </Link>
        <Link to="/app" className="guide-return">
          Open the app <ArrowUpRight size={16} />
        </Link>
      </header>
      {chapter ? (
        <main id="guide-content" className="guide-reader">
          <aside className="guide-index">
            <Link to="/guide" className="guide-back">
              <ArrowLeft size={15} /> All chapters
            </Link>
            <p className="guide-eyebrow">THE FIELD GUIDE</p>
            <nav aria-label="Guide chapters">
              {GUIDE_CHAPTERS.map((c) => (
                <Link
                  key={c.id}
                  aria-current={c.id === chapter.id ? "page" : undefined}
                  to={"/guide/" + c.id}
                >
                  <span>{c.number}</span>
                  {c.title}
                </Link>
              ))}
            </nav>
            <div className="guide-local-note">
              <BookOpen size={18} />
              <p>
                Learn here.
                <br />
                Your study data stays yours.
              </p>
            </div>
          </aside>
          <article className="guide-article">
            <Link to="/guide" className="guide-back guide-phone-back">
              <ArrowLeft size={15} /> All chapters
            </Link>
            <div className="guide-article-heading">
              <p className="guide-eyebrow">
                <span>CHAPTER {chapter.number}</span>
                <span>{chapter.minutes} MIN READ</span>
              </p>
              <h1>{chapter.title}</h1>
              <p>{chapter.summary}</p>
            </div>
            <nav className="guide-step-nav" aria-label="Walkthrough steps">
              {chapter.steps.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  aria-current={i === step ? "step" : undefined}
                  aria-controls="guide-active-step"
                  onClick={() => setStep(i)}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong>{s.title}</strong>
                </button>
              ))}
            </nav>
            <div className="guide-lesson" id="guide-active-step">
              <div className="guide-instructions" aria-live="polite">
                <p className="guide-eyebrow">
                  STEP {step + 1} OF {chapter.steps.length}
                </p>
                <h2>{active?.title}</h2>
                <p className="guide-active-body">{active?.body}</p>
                {active?.focus && (
                  <div className="guide-focus-note">
                    <span className="guide-focus-number">•</span>
                    <p>{active.focus}</p>
                  </div>
                )}
                {active?.tip && (
                  <div className="guide-tip">
                    <span>WORTH KNOWING</span>
                    <p>{active.tip}</p>
                  </div>
                )}
              </div>
              <figure
                id="guide-visual"
                className="guide-visual"
                aria-live="polite"
              >
                <div className="guide-visual-heading">
                  <span>
                    <span className="guide-red-dot" />{" "}
                    {active?.diagram ? "HOW IT WORKS" : "EXAMPLE SCREEN"}
                  </span>
                  <span>
                    {step + 1} / {chapter.steps.length}
                  </span>
                </div>
                {active?.image ? (
                  <button
                    ref={imageButton}
                    className="guide-image-button"
                    type="button"
                    onClick={() => setZoom(true)}
                    aria-label="Enlarge example screenshot"
                  >
                    <img src={"/guide/" + active.image} alt={active.alt} />
                    <span className="guide-zoom">
                      <ZoomIn size={14} /> Enlarge
                    </span>
                  </button>
                ) : (
                  <GuideDiagram kind={active?.diagram} />
                )}
                {active?.focus && (
                  <p className="guide-visual-focus">
                    <span>•</span>
                    {active.focus}
                  </p>
                )}
                <figcaption>
                  {active?.caption || "A simple model of the current app"}
                  <span>
                    {active?.image
                      ? "Synthetic example. Not your saved data."
                      : "Explanatory diagram, not an app screenshot."}
                  </span>
                </figcaption>
                <div className="guide-step-controls">
                  <button
                    type="button"
                    disabled={step === 0}
                    onClick={() => {
                      setStep((s) => s - 1);
                      document
                        .querySelector(".guide-step-nav")
                        ?.scrollIntoView({ block: "start" });
                    }}
                  >
                    <ArrowLeft size={17} />
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={step === chapter.steps.length - 1}
                    onClick={() => {
                      setStep((s) => s + 1);
                      document
                        .querySelector(".guide-step-nav")
                        ?.scrollIntoView({ block: "start" });
                    }}
                  >
                    Next step
                    <ArrowRight size={17} />
                  </button>
                </div>
              </figure>
            </div>
            <div className="guide-takeaway">
              <span>
                <Check size={20} />
              </span>
              <div>
                <p className="guide-eyebrow">THE SHORT VERSION</p>
                <p>{chapter.takeaway}</p>
              </div>
            </div>
            <div className="guide-bottom">
              <Link to="/guide">
                Back to all chapters <ArrowLeft size={16} />
              </Link>
              <Link to={chapter.destination} className="guide-primary">
                {chapter.destinationLabel}
                <ArrowUpRight size={16} />
              </Link>
            </div>
            {nextChapter && (
              <Link
                to={"/guide/" + nextChapter.id}
                className="guide-next-chapter"
              >
                <span>
                  <small>NEXT CHAPTER</small>
                  <strong>{nextChapter.title}</strong>
                </span>
                <ArrowRight size={20} />
              </Link>
            )}
          </article>
        </main>
      ) : (
        <main id="guide-content" className="guide-home">
          {slug && !chapter && (
            <p role="status" className="guide-missing">
              That chapter does not exist. Choose one below.
            </p>
          )}
          <section className="guide-hero">
            <div>
              <p className="guide-eyebrow">
                <span className="guide-red-dot" /> YOUR PREPTRACKER FIELD GUIDE
              </p>
              <h1>
                Less figuring out.
                <br />
                <em>More getting done.</em>
              </h1>
              <p>
                Real screens. Short walkthroughs. Find the answer, then get back
                to your prep.
              </p>
              <Link to="/guide/get-started" className="guide-primary">
                Start with your shelf
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="guide-hero-art" aria-hidden="true">
              <div className="guide-art-top">
                <LogoMark size={24} />
                <span>THE STUDY LOOP</span>
              </div>
              <div className="guide-art-line">
                <span>01</span>Pick your subjects
              </div>
              <div className="guide-art-line">
                <span>02</span>Cover a little today
              </div>
              <div className="guide-art-line">
                <span>03</span>Recall it later
              </div>
              <div className="guide-art-footer">
                <span>YOUR SYLLABUS. YOUR PACE.</span>
                <ArrowUpRight size={24} />
              </div>
            </div>
          </section>
          <section className="guide-library" aria-label="Browse chapters">
            <div className="guide-library-top">
              <div>
                <p className="guide-eyebrow">NO GUESSWORK</p>
                <h2>Find your next move.</h2>
              </div>
              <label className="guide-search">
                <Search size={18} />
                <input
                  aria-label="Search the guide"
                  placeholder="Search a topic or question"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Clear guide search"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>
            </div>
            <div className="guide-quick-links">
              <Link to="/guide/syllabus">
                Tick a topic <ArrowRight size={14} />
              </Link>
              <Link to="/guide/daily-plan">
                Understand my daily plan <ArrowRight size={14} />
              </Link>
              <Link to="/guide/backup-restore">
                Save or restore a backup <ArrowRight size={14} />
              </Link>
            </div>
            <p className="guide-result-count" role="status">
              {filtered.length} {filtered.length === 1 ? "chapter" : "chapters"}
              {query ? " found" : ""}
            </p>
            <div className="guide-cards">
              {filtered.map((c) => (
                <Link to={"/guide/" + c.id} key={c.id} className="guide-card">
                  <div className="guide-card-top">
                    <span>{c.number}</span>
                    <ArrowUpRight size={21} />
                  </div>
                  <p className="guide-eyebrow">{c.category}</p>
                  <h3>{c.title}</h3>
                  <p>{c.summary}</p>
                  <span className="guide-card-meta">
                    {c.steps.length} steps <span>·</span> {c.minutes} min
                  </span>
                </Link>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="guide-no-results">
                <h3>No chapter by that name.</h3>
                <p>Try “backup”, “exam dates” or “topics”.</p>
                <button onClick={() => setQuery("")}>Show all chapters</button>
              </div>
            )}
          </section>
          <section className="guide-safety">
            <BookOpen size={24} />
            <div>
              <h2>Your progress lives in this browser.</h2>
              <p>
                No account. No automatic sync. Save a backup before switching
                devices or clearing browser data.
              </p>
            </div>
            <Link to="/app/settings">
              Open Settings <ArrowUpRight size={16} />
            </Link>
          </section>
        </main>
      )}
      <footer className="guide-footer">
        <span>PrepTracker / Built for SPPU students.</span>
        <span>Real screens. Clear next steps.</span>
      </footer>
      {zoom && active?.image && (
        <div
          className="guide-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Example screenshot"
          onClick={() => setZoom(false)}
        >
          <button
            ref={close}
            aria-label="Close enlarged screenshot"
            onClick={() => setZoom(false)}
          >
            <X size={20} /> Close
          </button>
          <img
            src={"/guide/" + active.image}
            alt={active.alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function GuideDiagram({ kind }: { kind?: "review" | "local" | "offline" }) {
  return (
    <div
      className="guide-diagram"
      role="img"
      aria-label={
        kind === "review"
          ? "Study a topic, wait 3 days, recall, wait 7 days, recall, wait 21 days, then complete the review cycle. Forgot returns tomorrow."
          : kind === "local"
            ? "Study data lives in one browser. Save a backup JSON file, then restore it in another browser. There is no automatic sync."
            : "Open and load screens online before relying on cached screens offline. External resources still need the internet."
      }
    >
      {kind === "review" ? (
        <>
          <p className="guide-diagram-label">
            SPACED RECALL, NOT A CRAM SESSION
          </p>
          {[
            ["Study", "Tick a topic"],
            ["3 days later", "First recall"],
            ["7 days after Got it", "Second recall"],
            ["21 days after Got it", "Final recall"],
          ].map(([n, t], i) => (
            <div className="guide-diagram-node" key={n}>
              <span className="guide-diagram-icon">
                {i === 0 ? <BookOpen size={20} /> : <CalendarDays size={20} />}
              </span>
              <div>
                <strong>{n}</strong>
                <span>{t}</span>
              </div>
              {i === 3 && <Check size={19} />}
            </div>
          ))}
          <p className="guide-diagram-foot">
            Forgot at any step? Back tomorrow.
          </p>
        </>
      ) : kind === "local" ? (
        <>
          <p className="guide-diagram-label">A FILE IS THE BRIDGE</p>
          <div className="guide-diagram-node">
            <Laptop />
            <div>
              <strong>This browser</strong>
              <span>Profile + progress + tasks + links</span>
            </div>
          </div>
          <div className="guide-diagram-arrow">↓ Save Backup</div>
          <div className="guide-diagram-node guide-diagram-accent">
            <FileDown />
            <div>
              <strong>Your backup.json</strong>
              <span>A copy you keep outside the site</span>
            </div>
          </div>
          <div className="guide-diagram-arrow">↓ Restore Backup</div>
          <div className="guide-diagram-node">
            <Smartphone />
            <div>
              <strong>Another browser or device</strong>
              <span>Replaces its local saved data</span>
            </div>
          </div>
          <p className="guide-diagram-foot">
            No automatic sync between devices.
          </p>
        </>
      ) : (
        <>
          <p className="guide-diagram-label">
            ONLINE FIRST. OFFLINE WITH LIMITS.
          </p>
          <div className="guide-diagram-node">
            <Wifi />
            <div>
              <strong>While connected</strong>
              <span>Visit and load the screens you need</span>
            </div>
          </div>
          <div className="guide-diagram-arrow">
            ↓ Browser may cache fetched app files
          </div>
          <div className="guide-diagram-node">
            <HardDrive />
            <div>
              <strong>Previously loaded screens</strong>
              <span>Can work from the browser cache</span>
            </div>
          </div>
          <div className="guide-diagram-arrow">
            ≠ Not an offline resource library
          </div>
          <div className="guide-diagram-node">
            <ArrowUpRight />
            <div>
              <strong>Videos, PDFs and new content</strong>
              <span>May still need the internet</span>
            </div>
          </div>
          <p className="guide-diagram-foot">
            An installed icon does not back up your data.
          </p>
        </>
      )}
    </div>
  );
}
