import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ArrowLeft, X, Compass, Check } from "lucide-react";
import LogoMark from "./LogoMark";
import { useModalA11y } from "./useModalA11y";
import "./first-open-tour.css";

import { useLocation } from "react-router-dom";
import { TOURS, TOUR_VERSION, type TourId } from "../lib/tours";
const memorySeen: Record<string, string> = {};
function readSeen(): Record<string, string> {
  try {
    return {
      ...JSON.parse(localStorage.getItem(TOUR_VERSION) || "{}"),
      ...memorySeen,
    };
  } catch {
    return memorySeen;
  }
}
function writeSeen(id: string, value: string) {
  try {
    localStorage.setItem(
      TOUR_VERSION,
      JSON.stringify({ ...readSeen(), [id]: value }),
    );
  } catch {
    memorySeen[id] = value;
    /* replay still works when storage is unavailable */
  }
}
function tabFor(path: string, query: string): TourId {
  if (path.includes("/subject/")) return "course";
  if (path.includes("/resources")) return "library";
  if (path.includes("/tasks")) return "tasks";
  if (path.includes("/settings")) return "settings";
  if (path.includes("/revise"))
    return new URLSearchParams(query).get("tab") === "plan" ? "plan" : "review";
  return "home";
}
type Box = { x: number; y: number; width: number; height: number };
export default function FirstOpenTour() {
  const location = useLocation();
  const id = tabFor(location.pathname, location.search);
  const tour = TOURS[id];
  const STEPS = [
    {
      title: tour.intro,
      body: `Take a short tour of ${tour.name}. We will point to real controls and explain what they do. Nothing in your study records changes.`,
      label: tour.name.toUpperCase(),
      target: undefined,
      dock: false,
    },
    ...tour.steps.map((s) => ({ ...s, label: tour.name.toUpperCase() })),
  ];
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const [box, setBox] = useState<(Box & { step: number }) | null>(null);
  const [viewport, setViewport] = useState({
    width: innerWidth,
    height: innerHeight,
  });
  const close = (complete = false) => {
    writeSeen(id, complete ? "done" : "skipped");
    try {
      sessionStorage.removeItem("pt_tour_sample");
    } catch {}
    setOpen(false);
  };
  const start = () => {
    setStep(0);
    setOpen(true);
  };
  useEffect(() => {
    setOpen(false);
    setStep(0);
    const sample =
      new URLSearchParams(location.search).get("tour") === "sample" ||
      (() => {
        try {
          return sessionStorage.getItem("pt_tour_sample") === "yes";
        } catch {
          return false;
        }
      })();
    const show = () => {
      const other = document.querySelector(
        '[role="dialog"], [aria-label="Cookie consent"]',
      );
      if (other) return;
      if (sample || (!readSeen()[id] && readSeen().prompts !== "off")) {
        setOpen(true);
        observer.disconnect();
      }
    };
    let ready = false;
    let settle: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      if (!ready) return;
      clearTimeout(settle);
      settle = setTimeout(show, 120);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = setTimeout(() => {
      ready = true;
      show();
    }, 500);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      clearTimeout(settle);
    };
  }, [id, location.pathname]);
  useEffect(() => {
    const replay = (e: Event) => {
      const wanted = (e as CustomEvent).detail;
      if (!wanted || wanted === id) start();
    };
    window.addEventListener("pt-replay-tour", replay);
    return () => window.removeEventListener("pt-replay-tour", replay);
  }, [id]);
  useEffect(() => {
    const change = () =>
      setViewport({ width: innerWidth, height: innerHeight });
    window.addEventListener("resize", change);
    return () => window.removeEventListener("resize", change);
  }, []);
  const modal = useModalA11y(open, () => close());
  useEffect(() => {
    if (!open) return;
    const old = window.scrollY;
    const shell = document.querySelector('[data-tour="shell"]');
    const oldPadding =
      (document.querySelector("[data-tour=shell]") as HTMLElement)?.style
        .paddingBottom || "";
    if (shell) (shell as HTMLElement).style.paddingBottom = "100vh";
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    shell?.setAttribute("inert", "");
    document.documentElement.classList.add("pt-tour-open");
    return () => {
      shell?.removeAttribute("inert");
      document.documentElement.classList.remove("pt-tour-open");
      document.body.style.overflow = oldOverflow;
      if (shell) (shell as HTMLElement).style.paddingBottom = oldPadding;
      window.scrollTo(0, old);
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    setBox(null);
    const selector = STEPS[step].target;
    setUnavailable(false);
    let target: HTMLElement | undefined;
    let observer: MutationObserver | undefined;
    const update = () => {
      if (!target) return;
      const r = target.getBoundingClientRect();
      setBox({
        step,
        x: Math.max(8, r.x - 7),
        y: Math.max(8, r.y - 7),
        width: Math.min(
          innerWidth < 1024 ? innerWidth - 16 : 540,
          r.width + 14,
        ),
        height: Math.min(
          r.height + 14,
          innerWidth < 1024 ? Math.max(100, innerHeight - 475) : 370,
        ),
      });
    };
    const locate = () => {
      target = selector
        ? [...document.querySelectorAll<HTMLElement>(selector)].find(
            (e) =>
              e.getBoundingClientRect().width &&
              getComputedStyle(e).display !== "none",
          )
        : undefined;
      if (!target) return;
      observer?.disconnect();
      const r = target.getBoundingClientRect();
      if (!STEPS[step].dock)
        window.scrollTo({
          top: window.scrollY + r.top - (innerWidth < 1024 ? 100 : 120),
          behavior: "instant",
        });
      update();
    };
    const timer = window.setTimeout(locate, 100);
    const fallbackTimer = window.setTimeout(() => {
      if (!target) {
        const fallback = tour.steps[step - 1]?.fallback;
        target = fallback
          ? document.querySelector<HTMLElement>(fallback) || undefined
          : undefined;
        if (target) {
          const r = target.getBoundingClientRect();
          window.scrollTo({
            top: window.scrollY + r.top - 100,
            behavior: "instant",
          });
          update();
        } else if (selector) setUnavailable(true);
      }
    }, 1800);
    observer = new MutationObserver(locate);
    observer.observe(
      document.querySelector('[data-tour="shell"]') || document.body,
      { childList: true, subtree: true },
    );
    window.addEventListener("resize", locate);
    window.addEventListener("scroll", update);
    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      observer?.disconnect();
      window.removeEventListener("resize", locate);
      window.removeEventListener("scroll", update);
    };
  }, [open, step, id]);
  if (!open)
    return (
      <button
        className="pt-tour-replay"
        onClick={start}
        aria-label={`Replay ${tour.name} walkthrough`}
      >
        <Compass size={14} />
        <span>Walkthrough</span>
      </button>
    );
  const active = STEPS[step];
  const mobile = viewport.width < 1024;
  const isDock = !!STEPS[step].dock;
  return createPortal(
    <div className="pt-tour">
      <div className={"pt-tour-shade " + (!box ? "is-solid" : "")} />
      {box && (
        <div
          data-step={box.step}
          className="pt-tour-spotlight"
          style={{
            left: box.x,
            top: box.y,
            width: box.width,
            height: box.height,
          }}
          aria-hidden="true"
        />
      )}
      <div className="pt-tour-preview">
        {tour.name.toUpperCase()} WALKTHROUGH
      </div>
      <div
        ref={modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pt-tour-title"
        aria-describedby="pt-tour-body"
        className={"pt-tour-card " + (step === 0 ? "is-welcome" : "")}
        style={
          step > 0
            ? mobile
              ? {
                  bottom: isDock ? 118 : 16,
                  maxHeight: isDock
                    ? viewport.height - 170
                    : Math.max(
                        220,
                        viewport.height -
                          (box?.y || 100) -
                          (box?.height || 200) -
                          38,
                      ),
                }
              : {
                  left: isDock
                    ? 140
                    : (box?.x || 120) + (box?.width || 500) + 414 < innerWidth
                      ? (box?.x || 120) + (box?.width || 500) + 24
                      : Math.max(120, (box?.x || 120) - 414),
                  top: isDock ? "50%" : 120,
                  transform: isDock ? "translateY(-50%)" : undefined,
                }
            : undefined
        }
      >
        <div className="pt-tour-top">
          <span>
            {step === 0 ? <LogoMark size={23} /> : <Compass size={15} />}{" "}
            {active.label}
          </span>
          <button onClick={() => close()} aria-label="Close tour">
            <X size={18} />
          </button>
        </div>
        {step === 0 && (
          <div className="pt-tour-welcome-art" aria-hidden="true">
            <div>
              <Check size={18} />
              <span>Pick your courses</span>
            </div>
            <div>
              <span className="pt-tour-art-dot" />
              <span>Cover a little today</span>
            </div>
            <div>
              <Compass size={18} />
              <span>Recall it later</span>
            </div>
          </div>
        )}
        <h2 id="pt-tour-title">{active.title}</h2>
        <p id="pt-tour-body">{active.body}</p>
        {unavailable && (
          <p className="pt-tour-unavailable" role="status">
            This control is not shown in your current screen state. You can
            continue or replay after opening it.
          </p>
        )}
        <div
          role="group"
          className="pt-tour-progress"
          aria-label={`Step ${step + 1} of ${STEPS.length}`}
        >
          {STEPS.map((_, i) => (
            <span key={i} data-active={i <= step} />
          ))}
        </div>
        <div className="pt-tour-controls">
          <button
            className="pt-tour-secondary"
            onClick={step === 0 ? () => close() : () => setStep((s) => s - 1)}
          >
            {step === 0 ? (
              "Skip tour"
            ) : (
              <>
                <ArrowLeft size={15} /> Back
              </>
            )}
          </button>
          <button
            className="pt-tour-primary"
            onClick={() =>
              step === STEPS.length - 1 ? close(true) : setStep((s) => s + 1)
            }
          >
            {step === 0
              ? "Show me around"
              : step === STEPS.length - 1
                ? "Done"
                : "Next"}
            <ArrowRight size={16} />
          </button>
        </div>
        <small>
          {step + 1} of {STEPS.length} · Look around, no study data changed
        </small>
      </div>
    </div>,
    document.body,
  );
}
