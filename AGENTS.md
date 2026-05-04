# AGENTS

## Permanent methodology

### 1. Minimal patch
- Always apply the smallest possible change to satisfy the task.
- Do not perform opportunistic refactors.

### 2. Scope discipline
- Work only on the explicitly requested scope.
- Keep existing approved UX/flow intact unless directly requested.

### 3. Forbidden unless explicitly requested
- Animation engine internals.
- `getStateAtT`.
- `drawAtT`.
- WebCodecs/export pipeline.
- Curve editing logic.
- Easing/interpolation/timing internals.
- Frame pause/loop internals.
- Scale/rotation internals.
- Layout/UI cleanup.
- Visual changes (colors, icons, text).

> Exception: `getStateAtT`, `drawAtT`, WebCodecs/export, curve and easing areas can be changed only in an explicit **Engine Sprint** task.

### 4. Required reporting after changes
The implementation summary must include:
- files changed;
- functions changed;
- reason for change;
- risks;
- test steps.

### 5. Engine Sprint
Use Engine Sprint only when the task is explicitly about animation engine topics such as:
- animation engine;
- interpolation;
- curve;
- easing;
- preview;
- export;
- WebCodecs;
- `drawAtT`;
- `getStateAtT`;
- timing;
- loop;
- pause;
- scale;
- rotation.

Rules for Engine Sprint:
- One engine area per sprint.
- Do not mix Engine Sprint with UI cleanup, visual changes, text, color, icon updates, or broad refactoring.
- Before changing anything, identify:
  1. exact problem;
  2. likely functions involved;
  3. expected current behavior;
  4. expected new behavior;
  5. risks;
  6. regression tests.
- Keep the patch as small as possible.
- Update visible app version when there is a functional change.
- Update `CHANGELOG.md` and `QA.md` at the end of a functional implementation when requested by the task.
