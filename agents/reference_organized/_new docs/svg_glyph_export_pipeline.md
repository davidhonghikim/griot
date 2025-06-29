svg_glyph_export_pipeline:
  overview: |
    This document defines the standardized pipeline and workflow for generating, exporting, and distributing all kOS and KLF ecosystem glyphs and icons. It covers source design tools, export automation, directory structures, version control, and deployment readiness checks for all SVG-based assets.

  source_design_tools:
    - "Figma"
    - "Adobe Illustrator"
    - "Inkscape (Open Source)"
    - "AI-Assisted Vector Generator (e.g., Vectorizer AI or custom Skald agent pipeline)"

  export_automation_steps:
    - "Batch export SVGs from source tools"
    - "Auto-generate PNG, WebP, and Lottie JSON where flagged"
    - "Run SVG optimizer (SVGO or similar)"
    - "Generate sprite maps for web app use"
    - "Generate icon font (optional future step)"
    - "Checksum validation for file integrity"

  directory_structure:
    root:/assets/glyphs/
      ├── kos_ecosystem/
      ├── klf_cultural/
      ├── aiq_knowledge/
      ├── recipes_workflows/
      ├── skills/
      ├── system_ui/
      ├── badges_roles/
      ├── status_modes/
      ├── hieros_ethics/
      ├── network_protocols/
      ├── agent_personality/
      ├── time_event_log/
      ├── deployment_flows/
      ├── agent_lifecycle/
      └── user_feedback/

  version_control:
    - "All SVG source files stored in Git under /assets/glyphs-src/"
    - "Exported production files under /assets/glyphs/"
    - "Version tagging per batch release (e.g., v1.0.0, v1.1.0, etc.)"

  lottie_json_pipeline:
    - "Design animated variants in After Effects or Figma + Lottie plugin"
    - "Export as .json with same naming as static SVG version"
    - "Store in /assets/glyphs/[category]/animated/"

  deployment_readiness_checks:
    - "SVG pass-through W3C SVG Validator"
    - "Test render at all export sizes"
    - "Color palette confirmation against spec"
    - "Ensure no embedded raster data in SVG source"
    - "Confirm Lottie compatibility for any animated icons"

  future_expansions:
    - "Automated CI/CD pipeline for glyph publishing"
    - "Public CDN for glyph delivery (optional)"
    - "In-app icon picker module for end-users"
    - "Support for theme-based color variants"

  version: "1.0.0 (June 2025 SVG Export Pipeline Spec)"
  authors: ["kOS Dev Team", "Skald Visual Systems"]

