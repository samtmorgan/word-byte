# word-byte

## Mandatory Workflow

When completing any code task (feature, bug fix, refactor), you MUST complete **all** of the following steps before stopping:

### 1. Run CI checks
```bash
yarn ci-checks
```
This runs lint + type-check + tests. Fix any failures before proceeding.

### 2. Run a production build
```bash
next build
```
Catch any build-time errors that tests won't catch. Fix before proceeding.

### 3. Push the branch
```bash
git push -u origin <branch-name>
```

### 4. Open a PR
```bash
gh pr create --title "<title>" --body "<summary>"
```

**Do not stop until all four steps are complete and green.** If any step fails, fix the issue and re-run that step.
