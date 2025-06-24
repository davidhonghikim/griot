# ---------- Build stage ----------
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# ---------- Runtime stage ----------
FROM base AS runtime

WORKDIR /app

COPY . .

EXPOSE 30437

CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "30437"] 