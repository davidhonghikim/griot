# 👩‍🍳 User Guide – AI Kitchen

## 1. Installation

```bash
# Clone repo (or download binary installer)
./ai_kitchen/install.sh         # auto-detects OS / GPU
```

Alternatively, run via Docker:

```bash
docker run -p 8000:8000 ghcr.io/your-org/ai-kitchen:latest
```

---

## 2. Quick start

```bash
# Start server (reload off for prod)
python -m ai_kitchen.core.api_gateway

# Call hardware endpoint
curl http://localhost:8000/v1/hardware | jq

# Execute a skill (e.g. dummy/echo)
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"params": {"text": "hello"}}' \
  http://localhost:8000/v1/skills/dummy.echo/execute
```

---

## 3. Recipes

1. Copy a sample from `recipes/samples/`
2. Edit workflow steps.
3. Run via REST:

```bash
curl -X POST -d 'recipe_file=recipes/samples/noir_image.yaml' \
  http://localhost:8000/v1/recipes/run
```

---

## 4. Updating skills / models

```bash
# Add a new skill module
mkdir -p ai_kitchen/skills/my_skill
# … implement execute()

# Hot-reload by restarting API gateway or calling /v1/reload (planned)
```

Model assets live under `models/`. Use:

```bash
python scripts/models_sync.py --all
```

---

## 5. Troubleshooting

* Logs are printed to stdout; use `LOG_LEVEL=debug` for verbose output.
* Check `~/.cache/ai_kitchen/installer.log` for bootstrap errors.
* For GPU issues on Linux ensure `nvidia-smi` works and drivers ≥ 525.
