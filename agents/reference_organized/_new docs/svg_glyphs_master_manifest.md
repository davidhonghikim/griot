svg_glyphs_master_manifest:
  overview: |
    This is the unified master manifest for all kOS and KLF ecosystem SVG glyphs and icons from Batch 1 (June 2025). It consolidates all categories, output directories, file formats, and version details for project-wide export coordination, build scripts, and deployment pipelines.

  included_categories:
    - "kOS Ecosystem Glyphs"
    - "KLF Cultural Glyphs"
    - "AI-Q Knowledge Glyphs"
    - "Recipes / Workflows Glyphs"
    - "Skills Glyphs"
    - "System UI / App Icons"
    - "Badge / Rank / Role Glyphs"
    - "Status / Mode / State Indicators"
    - "HIEROS Ethical State Glyphs"
    - "Network / Protocol Glyphs"
    - "Agent Personality Layer Icons"
    - "Time / Event / Logging Icons"
    - "Deployment / Installation Flow Glyphs"
    - "Agent Lifecycle / Behavior Mode Glyphs"
    - "User Interaction / Feedback UI Glyphs"

  common_export_formats:
    - "SVG (vector master)"
    - "PNG (raster)"
    - "WebP (web optimized)"
    - "Lottie JSON (for animated icons)"

  directory_root: "/assets/glyphs/"

  build_pipeline_order:
    1. "Design source in Figma / Illustrator / Inkscape"
    2. "Export SVG batch"
    3. "Run SVG optimization (SVGO or similar)"
    4. "Batch export PNG and WebP"
    5. "Generate Lottie JSON for flagged animated icons"
    6. "Run CI/CD deployment scripts for each glyph category"
    7. "Push to /assets/glyphs/ directory with version tagging"

  versioning:
    current_release: "v1.0.0 (June 2025 Full Ecosystem Glyph Launch)"
    changelog:
      - "Initial release for all 15 ecosystem glyph categories"
      - "Next planned update: v1.1.0 (August 2025 for AR/VR layers and dark mode themes)"

  deployment_recommendations:
    - "Integrate icon registry service for app-wide glyph loading"
    - "Allow runtime theme adaptation (light/dark mode)"
    - "Bundle critical UI icons into web and mobile build pipelines"
    - "Consider CDN hosting for web clients with fallback to local cache"

  authors: ["kOS Dev Team", "Skald Visual Systems"]

