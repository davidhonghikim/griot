# Base Personas Directory

This directory contains the canonical, base personas for the kOS system. Each persona is a YAML file with full metadata, following the class-based and UUIDv7 naming convention.

- **index.json**: Machine-readable index of all personas in this directory.
- **README.md**: This file. Explains the structure and contribution guidelines.

## How to Use
- Load personas by referencing their `id` or filename.
- See `index.json` for a summary of all available personas and their metadata.

## How to Contribute
- Add new base personas as YAML files, following the naming and metadata conventions.
- Update `index.json` after adding or modifying personas (use the provided script or loader).
- For user or custom personas, use the `user_library/` directory instead.

## Structure Example
- `griot-core-dangermouse-<uuid>.yml`: Canonical Griot persona
- `musa-core-dangermouse-<uuid>.yml`: Canonical Musa persona

## See Also
- `../user_library/` for user-contributed personas
- `../skills/` and `../recipes/` for related asset types 