---
name: ship
description: Run the test suites, and only if everything passes, commit all changes and push to the current feature branch. Use when the user says "ship", "ship it", or wants to test-gate a commit+push in one step.
---

# Ship — test-gated commit and push

Run the integrate-and-verify flow end to end. Never commit or push if any
test fails.

## Steps

1. **Run the tests.**
   - If `dnai-xrpl-kit/` has changes (or `$ARGUMENTS` mentions the kit):
     `cd dnai-xrpl-kit && npm test` — require 14/14 passing.
   - If site code changed (`app/`, root `*.js`, `globals.css`, config):
     `npm run build` from the repo root — require a clean build.
   - If only docs/markdown changed, tests may be skipped; say so explicitly.

2. **Gate.** If anything fails, STOP. Report the failing output verbatim
   and do not stage, commit, or push. Do not attempt fixes unless asked.

3. **Commit.** Stage the relevant changes (`git add` specific paths, not
   blanket `-A` if unrelated untracked files exist) and commit with a
   descriptive message summarizing what changed and the test result
   (e.g. "… (14/14 offline tests passing)").

4. **Push.** `git push -u origin <current-branch>`. Never push to `main`
   directly. Do not create a pull request unless the user asked for one.

5. **Report.** State the test results, the commit hash, and the branch
   pushed to.
