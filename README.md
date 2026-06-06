# CLAUDE.md
Claude Code UX Simulator

An interactive React simulator designed to test micro-friction, state capsuling, and log integrity within AI agent terminal environments. 

Clickable Prototype
https://irenecancode.github.io/Claude-Code-Re-design/

---

## Architecture & Constraints

### AI Agent UI & Action Constraints
* **Intent Tags:** Prepends the active action state (`Analyze`, `Plan`, `Read`, `Retrieve`) as a terminal tag before executing any bash command to maintain high visual visibility.
* **Safe Mode:** Displays a standard, low-friction monochrome UI for read-only actions or local sandbox builds to minimize cognitive load.
* **Destructive Actions:** Triggers explicit security warning strings before requesting human approval if a command risks a git checkout, branch switch, or local file overwrite.

### Reversible Fail-Safes
* **Window-Level Tracking:** Logs every code-modifying bash command with a precise local timestamp.
* **Interactive Reset:** Populates the intercepted command back into the live input field upon reset, letting developers tweak flags or parameters instantly instead of rewriting code.
* **Log Integrity:** Appends explicit restoration entries and neutralizes active links upon triggering an undo, ensuring the entire historical trail remains fully auditable.

---

## Build and Development Commands

### Local Development Server
```bash
npm run dev
# or
node_modules/.bin/vite
