# 📚 Local Documentation Viewer

A headless `docs-viewer` app already exists at project root.  To open only the
Kitchen docs subset:

```bash
pnpm --filter docs-viewer dev -- --scope kitchen
# or
npm --workspace docs-viewer run dev -- --scope kitchen
```

The viewer searches `.md` files under `agents/reference/kitchen` and renders
Mermaid diagrams, code blocks with syntax highlighting, and live link previews.

For convenience a Python fallback is provided:

```bash
python -m http.server --directory agents/reference/kitchen 8080
open http://localhost:8080
```
