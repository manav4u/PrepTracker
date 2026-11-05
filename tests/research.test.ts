import test from 'node:test';
import assert from 'node:assert/strict';
import { branchStats, catalogTotals, buildFindings, researchFaq, unitDistribution, MIN_SAMPLE } from '../scripts/researchData.ts';
import computer from '../scripts/seData/computer.json' with { type: 'json' };
import { readFileSync } from 'node:fs';

const mkCourse = (units: number, credits = 3) => ({ credits, units: Array.from({ length: units }, () => ({ hours: 8 })) });
const mkBranch = (slug: string, courses: number[], opts: Record<string, unknown> = {}) => ({
  slug, branch: slug, courses: courses.map((u) => mkCourse(u)), ...opts,
});

test('branch and catalog totals add up', () => {
  const branches = [mkBranch('a', [5, 5, 6]), mkBranch('b', [4, 5], { year: 'TE' }), mkBranch('c', [6], { draft: true })];
  const stats = branchStats(branches);
  assert.equal(stats[0].courses, 3);
  assert.equal(stats[0].units, 16);
  assert.equal(stats[0].hours, 16 * 8);
  const t = catalogTotals(branches);
  assert.equal(t.branches, 2);
  assert.equal(t.drafts, 1);
  assert.equal(t.seBranches, 1);
  assert.equal(t.teBranches, 1);
  assert.equal(t.courses, 5);
  assert.equal(t.units, 25);
  assert.equal(t.credits, 15);
});

test('thin data produces no course findings', () => {
  const branches = [mkBranch('only', [5, 5])];
  const findings = buildFindings(branches);
  assert.ok(findings.length < MIN_SAMPLE, 'few courses overall');
  assert.ok(!findings.some((f) => f.id === 'f-courses'), 'course-count finding skipped on thin data');
  assert.ok(!findings.some((f) => f.id === 'f-units'), 'unit-distribution finding skipped on thin data');
});

test('finding ids are unique and texts are self-contained', () => {
  const branches = Array.from({ length: 9 }, (_, i) => mkBranch('b' + i, [5, 5, 5, 5, 6, 5, 5, 6]));
  const fe = [{ id: 'm1', credits: 4, units: [{ topics: [1, 2] }, { topics: [3] }] }];
  const findings = buildFindings(branches, fe, ['m1']);
  const ids = findings.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate anchor ids');
  for (const f of findings) {
    assert.match(f.text, /\d/, 'finding states a number');
    assert.ok(!/undefined|NaN/.test(f.text), 'finding leaked a bad value: ' + f.text);
  }
  const faq = researchFaq(branches, fe, ['m1']);
  assert.ok(faq.length >= 3);
});

test('comparison wording flips with the data', () => {
  const many = (u: number) => Array.from({ length: 9 }, (_, i) => mkBranch('x' + i, Array(8).fill(u)));
  const uniform = buildFindings(many(5)).find((f) => f.id === 'f-units');
  assert.match(uniform!.text, /most common course size is 5 units: 72 of 72/);
  const dist = unitDistribution(many(6));
  assert.equal(dist.get(6), 72);
});

test('integration: real SE Computer data aggregates without NaN', () => {
  const branches = [{ slug: 'se-computer-engineering', branch: 'Computer Engineering', courses: computer }];
  const t = catalogTotals(branches as never);
  assert.ok(t.courses >= 5, 'expected the real course list');
  assert.ok(t.units >= t.courses * 4, 'units per course in a sane band');
  assert.ok(Number.isFinite(t.credits) && t.credits > 0);
});


test("integration: real catalog hours are semester hours in a consistent band", () => {
  // Review flagged a possible weekly-vs-semester mix in the source hours
  // fields. Aggregate the real final catalogs (the same JSONs seBranches
  // wires; auto.json stays excluded as SPPU's draft) and require every
  // catalog's average hours per unit in the 6-12 band that SPPU semester
  // unit allocations occupy; a weekly-hours leak would land near 0.6.
  const files = ["aids","civil","computer","cse","cyber","elec","instr","it","mech","tecomp24","teel24","teit24","temech","terai"];
  let courses = 0, units = 0, hours = 0;
  for (const f of files) {
    const list = JSON.parse(readFileSync(new URL("../scripts/seData/" + f + ".json", import.meta.url), "utf8"));
    let cu = 0, ch = 0;
    for (const c of list) {
      cu += c.units.length;
      ch += c.units.reduce((a, u) => a + u.hours, 0);
      const courseHours = c.units.reduce((a, u) => a + u.hours, 0);
      assert.ok(courseHours >= 20 && courseHours <= 60, f + " " + c.code + " semester hours out of band: " + courseHours);
    }
    const perUnit = ch / cu;
    assert.ok(perUnit >= 6 && perUnit <= 12, f + " hours/unit out of band: " + perUnit);
    courses += list.length; units += cu; hours += ch;
  }
  assert.equal(courses, 133);
  assert.equal(units, 662);
  assert.equal(hours, 5231);
});
