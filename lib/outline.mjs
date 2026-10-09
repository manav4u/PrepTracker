// Display transformation only. Words and order remain unchanged. Do not split commas.
export function deriveOutline(text){
 return text.split(/;\s*|\n+|(?<!\bvs\.)(?<!\be\.g\.)(?<!\bi\.e\.)(?<=\.)\s+(?=[A-Z])/).map(s=>s.trim()).filter(Boolean);
}
