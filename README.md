# 🚀 RAGaaS – Modular Retrieval-Augmented Generation as a Service

## 📂 Project Structure
modules/
├─ rag-website/        # RAG pipeline for websites
│  ├─ indexing.js      # Core logic for website scraping + RAG
│  ├─ chat.js          # Unit tests
│  └─ README.md        # Module usage guide
├─ rag-pdf/            # RAG pipeline for PDFs
│  ├─ src/             # Core PDF ingestion + RAG logic
│  ├─ tests/           # Unit tests
│  └─ README.md        # Module usage guide
├─ memory/             # Memory layer for storing chat history
│  ├─ src/             # Core memory logic
│  ├─ adapters/        # Connectors (Qdrant, Pinecone, Redis, etc.)
│  └─ README.md        # Usage + integration details
└─ ...                 # Future modules go here




---

## 🧩 Modules Overview

### 1. **rag-website**
- Handles **website scraping** and **RAG over web content**.
- Includes logic to extract content, process it, and answer questions using retrieval-based methods.
- Files:
  - `indexing.js` – Scraping + RAG logic
  - `chat.js` – Unit tests
  - `README.md` – Module-specific usage guide

### 2. **rag-pdf**
- Handles **PDF ingestion** and **RAG over PDF documents**.
- Supports uploading PDFs, processing text, embedding it for retrieval, and answering queries.
- Files:
  - `src/` – Core logic for PDF processing and RAG
  - `tests/` – Unit tests
  - `README.md` – Module-specific usage guide

### 3. **memory**
- Provides a **memory layer** to store chat history and enhance context-aware responses.
- Supports multiple **adapters** for storing embeddings in databases like Qdrant, Pinecone, or Redis.
- Files:
  - `src/` – Core memory logic
  - `adapters/` – Connectors for different memory backends
  - `README.md` – Usage guide and integration instructions

---
