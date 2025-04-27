from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  # Import CORS Middleware
import requests  # Use requests to talk to external Ollama API
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import OllamaEmbeddings

# External Ollama API URL (Replace with your actual Ollama instance URL)
OLLAMA_API_BASE_URL = "http://localhost:11434/api/generate"  # If Ollama runs in a Docker container
# OLLAMA_API_BASE_URL = "http://your-external-ollama-server:11434/api/generate"  # If hosted remotely
# OLLAMA_API_BASE_URL = "http://host.docker.internal:11434/api/generate"  # If Ollama runs in a Docker container

# Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8800"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Define Pydantic Model for input validation
class ChatRequest(BaseModel):
    query: str

# Load FAISS database with allow_dangerous_deserialization=True
vector_db = FAISS.load_local("faiss_db", OllamaEmbeddings(model="deepseek-r1:1.5b"),
                             allow_dangerous_deserialization=True)

# Function to retrieve relevant company data
def retrieve_context(query: str):
    results = vector_db.similarity_search(query, k=3)  # Get top 3 results
    return "\n".join([doc.page_content for doc in results])

# Function to generate chatbot response via External Ollama API
def generate_response(query: str):
    # Retrieve relevant company knowledge
    context = retrieve_context(query)

    # Format prompt
    prompt = f"Context:\n{context}\n\nUser: {query}\nDeepSeek AI:"

    # Call External Ollama API
    payload = {
        "model": "deepseek-r1:1.5b",
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_BASE_URL, json=payload)
        response.raise_for_status()
        return response.json().get("response", "Error: No response from Ollama")
    except requests.exceptions.RequestException as e:
        return f"Error connecting to Ollama: {e}"

# API Route
@app.post("/chat")
async def chat(request: ChatRequest):
    response = generate_response(request.query)
    return {"response": response}

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)