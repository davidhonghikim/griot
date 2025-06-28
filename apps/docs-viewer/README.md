# kOS Document Explorer

This application is a React-based viewer for the `griot-node/ai-q` markdown documentation. It provides a clean, navigable interface with a collapsible sidebar, markdown rendering, and syntax highlighting.

## Development & Architecture

The app is built with:
- **React** & **TypeScript**
- **Vite** for fast development and bundling
- **Tailwind CSS** for styling
- **React Router** (`HashRouter`) for client-side routing
- **React Markdown** & **React Syntax Highlighter** for content rendering

---

## Running the Application

1.  **Install Dependencies:** From the `docs-viewer` directory, run:
    ```bash
    npm install
    ```
    *Note: If you encounter peer dependency conflicts, you may need to use the `--legacy-peer-deps` flag.*

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    This will automatically copy the latest docs, generate the manifest, and start a hot-reloading server.

3.  **Build for Production:**
    ```bash
    npm run build
    ```
    This generates a static build in the `docs-viewer/dist` directory.

4.  **Serve the Production Build:**
    ```bash
    npx serve -s docs-viewer/dist
    ```
    This command should be run from the **project root (`griot-node`)**.

---

## ‼️ Troubleshooting & Gotchas for Future Agents ‼️

This application had a difficult birth. Several non-obvious issues were encountered during development. Review this section carefully before making changes.

### 1. Routing: `HashRouter` is Mandatory

- **Problem:** The application would return 404 errors on any page refresh or direct navigation to a document link (e.g., `/docs/some-file`).
- **Cause:** This is a **Single Page Application (SPA)** served statically. `BrowserRouter` attempts to make the server handle these routes, but the static server only knows about `index.html`.
- **Solution:** We **MUST** use `HashRouter` from `react-router-dom`. It uses the URL hash (`#`) to store the route, so the server only ever sees requests for the root path (`/`) and all routing is handled correctly on the client side.

### 2. Dependency Versioning is Critical

- **Problem:** The application would render a blank white screen without any console errors.
- **Cause:** A version mismatch between the `react` and `react-dom` packages (e.g., v18 vs. v19). These two packages **must** have identical versions. A similar issue occurred with `@types/react` and `@types/react-dom` being out of sync.
- **Solution:** Always ensure that `react`, `react-dom`, `@types/react`, and `@types/react-dom` are all aligned to the same major version in `package.json`. Run `npm install` after correcting the versions.

### 3. Build Process: Docs Must Be Copied

- **Problem:** Document links worked in development but were broken in the production build, resulting in 404s when fetching markdown files.
- **Cause:** The `ai-q` documentation directory is external to this application. The build process needs to explicitly include these files.
- **Solution:** The `copy-docs` script was added to `package.json`. It copies the entire `../ai-q` directory into the `public/` folder before any build or dev server start. This ensures the documents are available at the correct relative path for the client to fetch.

### 4. Environment: Aggressive Browser Caching

- **Problem:** After a code change and rebuild, the browser would still load an old, broken version of the application, often from a completely different project that previously ran on `localhost`.
- **Cause:** Aggressive browser caching on `localhost`.
- **Solution:** When testing, **always use a Private or Incognito browser window**. This guarantees you are loading a fresh version of the application. Alternatively, you must manually clear site data for `localhost` in your browser's developer tools.
