# RAGaaS – Modular Retrieval-Augmented Generation as a Service

## 📂 Project Structure
- ragas/
  - modules/
    - rag-website/           # RAG pipeline for websites
      - indexing.js          # Core logic for website scraping + RAG
      - chat.js              # Chat interface over indexed website content
      - README.md            # Usage guide for this module
    - rag-pdf/               # RAG pipeline for PDF documents
      - pdfIndex.js          # Core logic for PDF loading + indexing
      - pdfChat.js           # Chat interface over indexed PDF content
      - README.md            # Usage guide for this module
    - rag-youtube/           # RAG pipeline for YouTube videos
      - indexing.js          # Core logic for YouTube transcript extraction & indexing
      - chat.js              # Chat interface over indexed YouTube video content
      - README.md            # Usage guide for this module

## 🧩 Modules Overview

### 1. **rag-website**
- Handles **website scraping** and **retrieval-augmented generation (RAG)** over web content.
- Extracts and indexes textual content from specified website pages and internal links.
- Supports querying indexed website text using vector similarity and OpenAI GPT models.
- Files:
  - `indexing.js` – Scraping and indexing logic
  - `chat.js` – Querying and conversation logic
  - `README.md` – Module-specific usage guide

### 2. **rag-pdf**
- Handles **PDF document loading**, **embedding generation**, and **indexing** into a vector database.
- Supports querying PDF content contextually via semantic search and OpenAI GPT models.
- Designed for document-based question answering with RAG.
- Files:
  - `index.js` – PDF loading and indexing logic
  - `Chat.js` – Question answering over indexed PDF content
  - `README.md` – Module-specific usage guide

### 3. **rag-youtube**
- Handles **YouTube video transcript extraction**, **chunking**, **embedding**, and **indexing** in a vector database.
- Supports querying video content through semantic search and LLM-powered answers.
- Uses browser automation and/or ASR to reliably obtain transcript text regardless of YouTube transcript availability.
- Files:
  - `index.js` – Transcript extraction, chunking, and indexing logic
  - `chat.js` – Chat interface to query indexed YouTube video content
  - `README.md` – Module-specific usage guide

---

## 🔧 Getting Started
1. Clone the repo and navigate into the `ragas/modules` folder.
2. Each module operates independently; follow instructions in their respective README files.
3. Ensure a running Qdrant instance is available (default: `http://localhost:6333/`).
4. Set your OpenAI API key as an environment variable in a `.env` file.
