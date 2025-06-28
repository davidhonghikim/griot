README.md
archive.sh
kos-log.js
migrate_personas.py
performance
temp
validate_frontmatter.py

# Project Scripts Index

- archive.sh:
    #!/bin/bash
    # This script creates a compressed archive of the project and maintains an index.
    # It excludes common development directories and accepts notes as an argument.

- kos-log.js:
    #!/usr/bin/env node
    /**
     * kos-log.js
     * CLI helper for writing a new entry to the kOS changelog.
     *

- migrate_personas.py:
    #!/usr/bin/env python3
    """
    Migration script to convert existing persona files to new sharded structure.
    Converts: packages/data/personas/{class}/persona.yml
    To: packages/data/personas/{class}/{class}-core-dangermouse-{uuid7}.yml

- validate_frontmatter.py:
    #!/usr/bin/env python3
    """Validate required YAML front-matter for agent docs.
    Rules:
    1. All *.md in agents/ must have YAML front-matter with required keys.


## Temp Scripts

README.md
