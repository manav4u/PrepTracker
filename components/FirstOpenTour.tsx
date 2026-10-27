import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ArrowLeft, X, Compass, Check } from "lucide-react";
import LogoMark from "./LogoMark";
import { useModalA11y } from "./useModalA11y";
import "./first-open-tour.css";

const STEPS = [
  {
    title: "A little direction. Then you are off.",
    body: "Let us show you around your study space. This quick tour points to the real app. It will not change your progress.",
    label: "WELCOME",
    target: null,
  },
  {
    title: "Your progress, at a glance.",
    body: "This is your Home overview. Overall Progress reflects unit states across your courses. Your topic checklist lives inside each course.",
    label: "YOUR HOME",
    target: '[data-tour="overview"]',
  },
  {
    title: "Start with one course.",
    body: "Open a course here, then tick topics as you study. Your shelf contains only the courses you selected during setup.",
    label: "YOUR SYLLABUS",
    target: '[data-tour="courses"] .grid > :first-child',
  },
  {
    title: "Your next move is always here.",
    body: "Home for your overview. Library for links. Tasks for small jobs. Revise for recall and your daily Plan. Settings for exam dates and backups.",
    label: "GET AROUND",
    target: '[data-tour="navigation"]',
  },
];
type Box = { x: number; y: number; width: number; height: number };
export default function FirstOpenTour() {
  const [open, setOpen] = useState(
    () =>
      new URLSearchParams(location.search).get("tour") === "sample" ||
      sessionStorage.getItem("pt_tour_sample") === "yes",
  );
  const [step, setStep] = useState(0);
  const [box, setBox] = useState<(Box & { step: number }) | null>(null);
  const close = () => {
    sessionStorage.removeItem("pt_tour_sample");
    setOpen(false);
  };
  const modal = useModalA11y(open, close);
  useEffect(() => {
    if (!open) return;
    const old = window.scrollY;
    const shell = document.querySelector('[data-tour="shell"]');
    shell?.setAttribute("inert", "");
    return () => {
      shell?.removeAttribute("inert");
      window.scrollTo(0, old);
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    setBox(null);
    const selector = STEPS[step].target;
    let target: HTMLElement | undefined;
    let observer: MutationObserver | undefined;
    const update = () => {
      if (!target) return;
      const r = target.getBoundingClientRect();
      setBox({
        step,
        x: Math.max(8, r.x - 7),
        y: Math.max(8, r.y - 7),
        width: Math.min(innerWidth - 16, r.width + 14),
        height: Math.min(r.height + 14, innerWidth < 760 ? 330 : 450),
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
      if (step !== 3)
        window.scrollTo({
          top: window.scrollY + r.top - (innerWidth < 760 ? 100 : 120),
          behavior: "instant",
        });
      update();
    };
    const timer = window.setTimeout(locate, 100);
    observer = new MutationObserver(locate);
    observer.observe(
      document.querySelector('[data-tour="shell"]') || document.body,
      { childList: true, subtree: true },
    );
    window.addEventListener("resize", locate);
    window.addEventListener("scroll", update);
    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener("resize", locate);
      window.removeEventListener("scroll", update);
    };
  }, [open, step]);
  if (!open) return null;
  const active = STEPS[step];
  const mobile = innerWidth < 760;
  const isDock = step === 3;
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
      <div className="pt-tour-preview">DESIGN SAMPLE · HOME TOUR</div>
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
              ? { bottom: isDock ? 118 : 24 }
              : {
                  left:
                    step === 3
                      ? 140
                      : Math.min(
                          innerWidth - 450,
                          (box?.x || 120) + (box?.width || 500) + 24,
                        ),
                  top: step === 3 ? "50%" : 160,
                  transform: step === 3 ? "translateY(-50%)" : undefined,
                }
            : undefined
        }
      >
        <div className="pt-tour-top">
          <span>
            {step === 0 ? <LogoMark size={23} /> : <Compass size={15} />}{" "}
            {active.label}
          </span>
          <button onClick={close} aria-label="Close tour">
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
            onClick={step === 0 ? close : () => setStep((s) => s - 1)}
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
              step === STEPS.length - 1 ? close() : setStep((s) => s + 1)
            }
          >
            {step === 0
              ? "Show me around"
              : step === STEPS.length - 1
                ? "Start studying"
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
