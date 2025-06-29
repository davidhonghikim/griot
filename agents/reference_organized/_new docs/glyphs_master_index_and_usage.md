glyphs_master_index_and_usage:
  overview: |
    This document serves as the centralized master index for all glyph and icon packs within the kOS and KLF ecosystem. It provides naming conventions, organizational structure, and usage guidelines for UI teams, app developers, frontend designers, and agent orchestrators working with any visual component across the ecosystem.

  categories:
    - "kOS Ecosystem Glyphs"
    - "KLF Cultural Glyphs"
    - "AI-Q Knowledge Glyphs"
    - "Recipes / Workflows Glyphs"
    - "Skills Glyphs"
    - "System UI / App Icons"
    - "Badge / Rank / Role Glyphs"
    - "Status / Mode / State Indicators"
    - "HIEROS Ethical State Glyphs"
    - "Multi-Network / Protocol Glyphs"
    - "Agent Personality Layer Icons"
    - "Time / Event / Logging Icons"
    - "Deployment / Installation Flow Glyphs"
    - "Agent Lifecycle / Behavior Mode Glyphs"
    - "User Interaction / Feedback UI Glyphs"

  naming_conventions:
    - "All glyph filenames: lowercase, underscores, ending with .svg for source files"
    - "YAML doc filenames: [category]_glyphs.yaml"
    - "Export image sets for each pack: SVG (master), PNG (raster), WebP (web), Lottie-compatible JSON (animated when needed)"

  usage_contexts:
    - "Mobile App Interfaces"
    - "Web Dashboards"
    - "Agent Profile UI"
    - "System Health Monitors"
    - "Content Generation Tools"
    - "Knowledge Management UIs"
    - "Governance Panels"
    - "Network Topology Maps"
    - "Onboarding Flows"
    - "Status Overlays"

  design_guidelines:
    - "Maintain stylistic consistency within each category"
    - "Use outline vs filled styles consistently by function (e.g., outline for passive, filled for active)"
    - "Colors should follow category color palettes unless overridden by UI theme"
    - "Icons should scale cleanly from 16px to 1024px without detail loss"
    - "Monochrome variants for dark mode compatibility"
    - "Animated variants for loading, alerts, and critical state transitions"

  integration_guidelines:
    - "All UI apps should source glyphs from centralized icon registry API (planned feature)"
    - "Agent dashboards should reference glyph YAML IDs for consistency"
    - "Icon packs to be stored in the /assets/glyphs/ directory per deployment"
    - "Web apps should load SVGs via sprite map or inline for performance"
    - "Mobile apps should precompile raster variants for load time optimization"

  future_expansions:
    - "Add AR/VR/XR glyph layer for spatial interfaces"
    - "Develop AI-assisted dynamic glyph selection engines"
    - "Include glyph metadata (meaning, trigger conditions, recommended contexts) in next YAML revision"
    - "Internationalization: future support for culturally adaptive icon sets"

  version: "1.0.0 (June 2025 Glyph Master Index and Usage Spec)"
  authors: ["kOS Dev Team", "Skald Visual Systems"]

