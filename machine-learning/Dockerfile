# Use official Python image as base
FROM python:3.10

# Set working directory inside the container
WORKDIR /app

# Copy requirements file
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8000 for FastAPI
EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "chatbot:app", "--host", "0.0.0.0", "--port", "8000"]