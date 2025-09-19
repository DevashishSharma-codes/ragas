📦 Modules – RAGaaS

The modules/ folder contains all independent, reusable components of the RAGaaS project.
Each module provides a specific functionality (e.g., RAG over PDFs, RAG over websites, memory layer) and can be used:

Individually (standalone service)

Combined (integrated into the main RAGaaS system)

This modular architecture ensures scalability, flexibility, and maintainability.

modules/
├── rag-website/ # RAG pipeline for websites (scraping + Q&A)
│ ├── indexing.js # Core code for scraping + RAG
│ ├── chat.js # Unit tests
│ └── README.md # Usage guide for this module
├── rag-pdf/ # RAG pipeline for PDFs (upload + Q&A)
│ ├── src/ # Core code for PDF ingestion + RAG
│ ├── tests/ # Unit tests
│ └── README.md # Usage guide for this module
├── memory/ # (Planned) Memory layer for storing chat history
│ ├── src/ # Core memory logic
│ ├── adapters/ # Connectors (e.g., Qdrant, Pinecone, Redis)
│ └── README.md # Usage + integration details
└── ... # Future modules go here

🚀 Available Modules
1. 🌐 rag-website

Purpose: Scrapes content from websites and provides a Q&A interface.

Use Cases: Company knowledge extraction, FAQ answering, competitive analysis.

Tech Used:

Scraping: Cheerio 

Embeddings: OpenAI

Vector DB: Qdrant 

Run:

cd rag-website
npm install      
npm start         

2. 🧠 memory (Future Module)

Purpose: Stores conversation history to make the chatbot context-aware across sessions.

Use Cases:

Personalized assistants

Continuous knowledge recall

Contextual Q&A across multiple documents/websites

Tech Used (planned):

Storage: Qdrant 

Session tracking: Express middleware 

Memory retrieval integrated into RAG pipeline

