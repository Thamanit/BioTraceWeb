# ----------- Base Image -----------
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (if needed, e.g. for numpy, opencv, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency list
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire app code
COPY . .

# Copy .env if needed (optional)
# COPY .env .env

# Expose port (if using Flask or FastAPI)
EXPOSE 5000

# Default command
CMD ["python", "app.py"]
