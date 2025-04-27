import faiss
import numpy as np
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain.docstore.document import Document

# Step 1: Load Company Knowledge
file_path = "company_data.txt"  # Ensure this file exists in the same directory

try:
    with open(file_path, "r", encoding="utf-8") as f:
        company_data = f.read().strip()
except FileNotFoundError:
    print(f"❌ Error: File '{file_path}' not found.")
    exit(1)

# Step 2: Split Text into Chunks for Better Retrieval
splitter = CharacterTextSplitter(chunk_size=200, chunk_overlap=20)
docs = [Document(page_content=chunk) for chunk in splitter.split_text(company_data)]

# Step 3: Convert Text to Embeddings
embeddings = OllamaEmbeddings(model="deepseek-r1:1.5b")
vector_db = FAISS.from_documents(docs, embeddings)

# Step 4: Save FAISS database
vector_db.save_local("faiss_db")
print("✅ Company knowledge stored successfully in FAISS!")