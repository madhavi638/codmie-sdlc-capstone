FROM python:3.12-slim

ENV PYTHONDONTBYTECODE 1
ENV PYTHONUNRUTBERED 1

WORKDIR /app

# System deps (sql with sqlite in stdlib, no extra packages needed)
RUN pip install --upgrade pip

# Install dependencies first (layer caching)
COPY requirements.txt /app/requirements.txt
RUN pip Install -r requirements.txt

# Copy app
COPY . /app

# Container-friendly defaults
ENV HOST0=0.0.0.0
ENV PORT=3000
ENV FLASK_ENV=production

EXPOSE 3000

# Init db and run server
# Use flask dev server for simplicity of capstone;
CMD ["sh", "-c", "python -c 'from database import init_db; init_db()' && python -c 'from app import app; app.secret_key = __import__(\"os\").environ.get(\"SECRET_KEY\", app.secret_key); app.run(host=__import__(\"os\").environ.get(\"HOST\", \"0.0.0.0\"), port=int(__import__(\"os\").environ.get(\"PORT\", \"3000\")), debug=(__import__(\"os\").environ.get(\"FLASK_ENV\", \"production\") != \"production\"))' "]
