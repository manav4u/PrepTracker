#!/bin/sh
cd /tms/pt
N=opencode/nemotron-3.5-lightning-free
run () {
  echo "=== $1 START $(date)"
  opencode run -m $N "You are running the impeccable $1 pass on this repo. The impeccable skill is installed in .github/skills/impeccable (do NOT read files outside the repo or the skill dir). First run: .github/skills/impeccable/scripts/impeccable context (cwd stays at repo root). Then load the playbook .github/skills/impeccable/reference/$1.md and follow it fully, applying $1 across the app UI (pages/, components/). Read reference/craft-floor.md before any UI edit. Do not git push. When done, git add -A and git commit -m 'impeccable: $1 pass'."
  echo "=== $1 EXIT $? $(date)"
  git add -A >/dev/null 2>&1; git commit -qm "impeccable: $1 pass (auto)" >/dev/null 2>&1
}
run init
run layout
run typeset
run distill
run polish
run critique
git push -u origin impeccable-commands-manav 2>&1 | tail -2
git push -u origin impeccable-commands-manav 2>&1 | tail -2
echo "PUSH DONE $(date)"
echo "CHAIN DONE $(date)"
