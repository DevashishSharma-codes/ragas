#  RAGaaS – Modular Retrieval-Augmented Generation as a Service

## 📂 Project Structure
- ragas/
  - modules/
    - rag-website/           # RAG pipeline for websites
      - indexing.js          # Core logic for website scraping + RAG
      - chat.js         
      - README.md            # Usage guide for this module

## 🧩 Modules Overview

### 1. **rag-website**
- Handles **website scraping** and **RAG over web content**.
- Includes logic to extract content, process it, and answer questions using retrieval-based methods.
- Files:
  - `indexing.js` – Scraping + RAG logic
  - `chat.js` – Unit tests
  - `README.md` – Module-specific usage guide

