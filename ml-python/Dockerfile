FROM python:3.11-slim

WORKDIR /app

# Copy requirements first to leverage Docker's caching layer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of our python code (main.py)
COPY . .

EXPOSE 8000

# Fire up the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]