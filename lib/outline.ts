// A unit in an official syllabus is one paragraph. To tick it off in pieces, the paragraph is split into
// lines at semicolons, line breaks, and sentence ends. No word is added, dropped or reordered, and commas
// are never split. Saved ticks store these exact lines, so do not change this function without a migration.

export function deriveOutline(text: string): string[] {
  return text
    .split(/;\s*|\n+|(?<!\bvs\.)(?<!\be\.g\.)(?<!\bi\.e\.)(?<!\bet al\.)(?<=\.)\s+(?=[A-Z])/)
    .map(s => s.trim())
    .filter(Boolean);
}
