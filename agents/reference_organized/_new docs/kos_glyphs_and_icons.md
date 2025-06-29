---
name: kos_glyphs_and_icons
version: 1.0
description: |
  This YAML document defines the master glyph and icon generation plan for the full kOS ecosystem. It covers all system use cases including apps, websites, UI elements, and broader visual representation across the decentralized kOS network.

categories:
  - Node Classes
  - System Apps
  - Web and Mobile UI
  - Ecosystem Branding
  - Special Features and Roles

node_classes:
  - griot
  - tohunga
  - ronin
  - musa
  - hakim
  - skald
  - oracle
  - junzi
  - yachay
  - sachem
  - archon
  - amauta
  - mzee

glyph_generation:
  each_class:
    main_glyph: true
    role_variants: 13
    styling:
      - flat
      - 3d
      - monochrome
      - outline
      - filled
      - animated
      - print-ready
      - svg
      - png
      - vector
      - raster
      - dark_theme
      - light_theme
  
  additional_categories:
    - klf
    - ai_q
    - recipes
    - skills

  klf:
    total_glyphs: 25
    styles:
      - subtle_embeds
      - lore_based
      - symbol_only
      - wordmark_integration

  ai_q:
    total_glyphs: 25
    styles:
      - knowledge_orb
      - layered_data
      - fractal_node
      - info_flow

  recipes:
    total_glyphs: 50
    styles:
      - workflow
      - flowchart
      - decision_tree
      - process_map

  skills:
    total_glyphs: 50
    styles:
      - ability_badge
      - unlockable
      - progression_step
      - tool_icon

output_formats:
  - svg
  - png
  - webp
  - gif (for animations)
  - pdf (for print)
  - eps
  - json (for programmatic use)

intended_uses:
  - system UI themes
  - mobile app icons
  - desktop app icons
  - website elements
  - ecosystem documentation
  - in-app workflows
  - gamification elements
  - promotional media
  - printable materials
  - AR/VR integration markers
  - social media avatars and banners
  - decentralized node status indicators

export_plan:
  batch_size: 5
  delivery_format: yaml
  naming_convention: snake_case
  folder_structure:
    - /glyphs/node_classes
    - /glyphs/klf
    - /glyphs/ai_q
    - /glyphs/recipes
    - /glyphs/skills
    - /glyphs/system_icons
    - /glyphs/ui_elements

notes:
  - All future Canvas documents related to glyphs will follow this spec unless user requests a change.
  - User prefers batch delivery of 5 at a time for faster downloads and workflow.
  - YAML format is mandatory for all future Canvas docs in this topic.
  - This master spec will guide all downstream image generation tasks, exports, and design sprints.
---

