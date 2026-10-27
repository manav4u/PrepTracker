import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TOURS, TOUR_VERSION, type TourId } from "../lib/tours";
export default function TourSettings() {
  const navigate = useNavigate();
  const [off, setOff] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(TOUR_VERSION) || "{}").prompts === "off"
      );
    } catch {
      return false;
    }
  });
  const paths: Record<TourId, string> = {
    home: "/app",
    library: "/app/resources",
    tasks: "/app/tasks",
    review: "/app/revise",
    plan: "/app/revise?tab=plan",
    settings: "/app/settings",
    course: "/app",
  };
  return (
    <section data-tour="tour-controls" className="pt-tour-settings">
      <h2>App walkthroughs</h2>
      <p>
        Short popups over real controls. Replay a screen whenever you need a
        reminder.
      </p>
      <label>
        <input
          type="checkbox"
          checked={!off}
          onChange={(e) => {
            const next = !e.target.checked;
            setOff(next);
            try {
              const old = JSON.parse(
                localStorage.getItem(TOUR_VERSION) || "{}",
              );
              localStorage.setItem(
                TOUR_VERSION,
                JSON.stringify({ ...old, prompts: next ? "off" : "on" }),
              );
            } catch {
              /* blocked storage */
            }
          }}
        />{" "}
        Offer a tour on my first visit to each screen
      </label>
      <div>
        {(Object.keys(TOURS) as TourId[])
          .filter((id) => id !== "course")
          .map((id) => (
            <button
              key={id}
              onClick={() => {
                if (id === "settings")
                  window.dispatchEvent(
                    new CustomEvent("pt-replay-tour", { detail: id }),
                  );
                else
                  navigate(
                    paths[id] +
                      (paths[id].includes("?") ? "&" : "?") +
                      "tour=sample",
                  );
              }}
            >
              {TOURS[id].name}
            </button>
          ))}
      </div>
      <small>
        Course walkthroughs are available after opening a course. Turning
        prompts off does not disable replay.
      </small>
    </section>
  );
}
