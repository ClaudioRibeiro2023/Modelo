# ============================================
# TechDados BFF - FastAPI (Multi-stage build)
# ============================================

# -----------------------------
# Stage 1: Dependencies
# -----------------------------
FROM python:3.11-slim AS dependencies

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# -----------------------------
# Stage 2: Development
# -----------------------------
FROM dependencies AS development

WORKDIR /app

RUN pip install --no-cache-dir pytest pytest-cov pytest-asyncio httpx

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# -----------------------------
# Stage 3: Production
# -----------------------------
FROM python:3.11-slim AS production

WORKDIR /app

RUN groupadd -r appuser && useradd -r -g appuser appuser

COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=dependencies /usr/local/bin/uvicorn /usr/local/bin/uvicorn

COPY app/ ./app/

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
