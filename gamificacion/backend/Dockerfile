FROM python:3.11-slim

WORKDIR /app

ENV PYTHONPATH=/app

RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade pip

COPY . .

EXPOSE 5000

#CMD ["python", "manage.py", "runserver", "0.0.0.0:5000"]
RUN pip install google-genai

CMD ["daphne" , "-b" , "0.0.0.0" , "-p" , "5000" , "backend.asgi:application"]
