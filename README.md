# CLAUDE.md

## Build and Development Commands
- Local Dev Server: `npm run dev` or `node_modules/.bin/vite`
- Production Build: `node_modules/.bin/vite build`

## AI Agent UI & Action Constraints
- **Intent Tags**: Before executing ANY bash command, you MUST prepend the specific action state (`Analyze`, `Plan`, `Read`, `Retrieve`) as a terminal tag to maintain visibility.
- **Safe Mode**: For read-only actions or local sandbox builds, display standard low-friction monochrome UI.
- **Destructive Actions**: If a command triggers a git checkout, branch switch, or local file overwrite, you MUST explicitly print these exact security warning strings before requesting approval:
  - `*This command will switch your active branch from [current] to [target].*`
  - `*Code will be rewritten.*`
