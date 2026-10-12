import test from "node:test";
import assert from "node:assert/strict";
import { deskModel, dayDistance, visitDelta } from "../lib/desk.mjs";
const courses = [
  {
    id: "a",
    name: "A",
    units: [{ id: "u", unit_number: 1, title: "Unit", topics: ["One", "Two"] }],
  },
];
const study = {
  topics: { "u:topic:1": { status: "done", nextReview: "2026-10-09" } },
  events: [],
};
test("desk derives topic coverage without mutating source records", () => {
  const before = JSON.stringify(study);
  const m = deskModel(courses, study, [], "2026-10-10");
  assert.equal(m.covered, 1);
  assert.equal(m.left, 1);
  assert.equal(m.percent, 50);
  assert.equal(m.returns.length, 1);
  assert.equal(JSON.stringify(study), before);
});
test("paper dates are linked, pending, valid and not past; same-day papers stay separate", () => {
  const task = (id, dueDate, extra = {}) => ({
    id,
    text: id,
    courseId: "a",
    category: "EXAM",
    completed: false,
    dueDate,
    ...extra,
  });
  const m = deskModel(
    courses,
    study,
    [
      task("past", "2026-10-09"),
      task("x", "2026-10-10"),
      task("y", "2026-10-10"),
      task("done", "2026-10-11", { completed: true }),
      task("no-link", "2026-10-11", { courseId: "" }),
      task("bad", "2026-02-31"),
    ],
    "2026-10-10",
  );
  assert.deepEqual(
    m.papers.map((x) => x.id),
    ["x", "y"],
  );
  assert.equal(m.papers[0].days, 0);
});
test("calendar day distance ignores DST transitions", () => {
  assert.equal(dayDistance("2026-03-07", "2026-03-09"), 2);
  assert.equal(dayDistance("2026-10-10", "2026-10-28"), 18);
  assert.equal(dayDistance("x", "2026-10-28"), null);
});
test("empty courses and stale selections do not leak work into desk", () => {
  const m = deskModel(
    [],
    study,
    [{ category: "EXAM", courseId: "a", dueDate: "2026-10-28" }],
    "2026-10-10",
  );
  assert.equal(m.total, 0);
  assert.equal(m.percent, 0);
  assert.equal(m.next, null);
  assert.equal(m.returns.length, 0);
  assert.equal(m.papers.length, 0);
});
test("changed since visit counts new topic marks only for the same course set", () => {
  const m = deskModel(courses, study, [], "2026-10-10");
  assert.equal(visitDelta(null, m.nodes, study), null);
  assert.equal(
    visitDelta({ courses: ["b"], covered: [] }, m.nodes, study),
    null,
  );
  assert.equal(visitDelta({ courses: ["a"], covered: [] }, m.nodes, study), 1);
  assert.equal(
    visitDelta({ courses: ["a"], covered: ["u:topic:1"] }, m.nodes, study),
    0,
  );
});
test("explicitly cleared return date does not revive an earlier revision due date", () => {
  const m = deskModel(
    courses,
    {
      topics: {
        "u:topic:1": {
          nextReview: null,
          lastRevised: "2026-09-01",
          confidence: "low",
        },
      },
      events: [],
    },
    [],
    "2026-10-10",
  );
  assert.equal(m.returns.length, 0);
});
