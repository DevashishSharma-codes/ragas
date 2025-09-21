# PDF Document Chat Module

This module implements a chatbot that answers user queries by retrieving relevant information from PDFs indexed in a Qdrant vector store. It leverages OpenAI embeddings for retrieval and GPT-4.1 for generating precise, context-aware answers based strictly on the PDF content.

---

## Overview

- Loads an existing Qdrant vector collection containing PDF embeddings.
- Accepts user questions about the PDF documents.
- Retrieves the top relevant text chunks via semantic similarity search.
- Constructs a retrieval-augmented prompt emphasizing factual accuracy and context adherence.
- Uses OpenAI’s GPT-4.1 chat completions to generate clear, concise responses grounded only in the PDF content.

---

## Prerequisites

- Node.js environment (v16+ recommended)
- Active Qdrant vector store instance with PDF embeddings in a collection (e.g., `pdf-collection`)
- OpenAI API key with GPT-4.1 chat completion access
- `.env` file configured with:
OPENAI_API_KEY=your_openai_api_key_here

---

## Installation

1. Clone the repository:
git clone <repository-url>
cd <repository-folder>

text

2. Install dependencies:
npm install dotenv @langchain/openai @langchain/qdrant openai

text

3. Ensure Qdrant vector database is accessible and contains the indexed PDF vectors.

4. Create `.env` with your OpenAI API key:
OPENAI_API_KEY=your_openai_api_key_here

text

---

## Usage

### PDF Chat Script

Run the chat script to query the indexed PDF content interactively:

node pdfChat.js

text

- Modify the `userQuery` variable for the question you want to ask about the PDF content.
- The module fetches the most relevant text chunks from Qdrant.
- Builds a system prompt instructing GPT-4.1 to answer solely based on the PDF.
- Outputs precise and contextually accurate answers without hallucinations or assumptions.

---

## Code Structure Highlights

- Initializes OpenAI client with API key.
- Uses `QdrantVectorStore.fromExistingCollection()` to load the PDF embeddings collection.
- Retrieves top-k relevant chunks with a retriever and semantic search.
- Employs a retrieval-augmented generation (RAG) prompt emphasizing strict adherence to source content.
- Calls GPT-4.1 chat completions to produce natural language answers.
- Prints responses to the console.

---

## Notes

- Ensure the Qdrant collection name matches the one used for indexing PDFs.
- The chatbot will explicitly state if the document lacks sufficient context to answer.
- The system prompt guides the model to avoid assumptions and hallucinations.
- Adjust the number `k` of retrieved chunks as needed for performance vs. accuracy tradeoffs.

