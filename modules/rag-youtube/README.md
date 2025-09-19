# YouTube Video RAG Pipeline

This application lets you "chat" with YouTube videos by ingesting their transcripts, storing them in a vector database, and using a Large Language Model (LLM) to answer questions based on the video content. It offers a powerful way to query, summarize, and extract insights without re-watching videos.

---

## 📊 How It Works: The RAG Pipeline

The project has two main scripts following the Retrieval-Augmented Generation (RAG) pattern:

- **Indexing (`indexing.js`)**:  
  Takes a YouTube URL, scrapes the transcript via browser automation, splits it into overlapping text chunks, converts chunks into embeddings, and stores them in the Qdrant vector database.

- **Retrieval (`retrieval.js`)**:  
  Takes a user question, converts it to an embedding, retrieves the most relevant transcript chunks from Qdrant, and feeds them as context to an LLM (e.g., GPT-4o) to generate a well-informed answer.

---

## ⚙️ Code Overview  

### indexing.js — Ingestion & Processing  
- Extracts the 11-character YouTube video ID from any URL format.  
- Uses Playwright to open the video page, expand the transcript, and scrape all transcript segments.  
- Handles missing transcripts and errors gracefully.  
- Splits the transcript into 1000-character chunks with 200-character overlap using LangChain’s `RecursiveCharacterTextSplitter` for optimal LLM context handling.  
- Generates embeddings using OpenAI’s `text-embedding-3-large` model and stores them in Qdrant.

### retrieval.js — Retrieval & Answer Generation  
- Initializes OpenAI embeddings and client for question answering.  
- Connects to Qdrant’s vector store and creates a retriever to fetch the top 4 most relevant transcript chunks based on query similarity.  
- Builds a system prompt instructing the LLM to *only* answer based on retrieved context to avoid hallucinations.  
- Sends the user query plus context to GPT-4o for a concise, context-aware response.

---

This pipeline enables efficient and accurate conversational access to YouTube video content using state-of-the-art vector search and LLM technologies.


1. Prerequisites
Node.js (v18.0 or later)

Docker

An OpenAI API Key

# Create the .env file and add your API key
echo "OPENAI_API_KEY=sk-..." > .env

3. Start the Vector Database
# This will start a Qdrant container in the background
docker run -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant

4. Install Dependencies
This is a two-step process for Playwright.

# Install Node modules
npm install dotenv playwright openai@latest @langchain/openai@latest @langchain/qdrant@latest langchain@latest

# Download browser binaries for Playwright
npx playwright install

5. Run the Application
Step A: Index your videos

Edit indexing.js and add your YouTube URLs to the SOURCES_TO_INDEX array.

Run the script:

node index.js

Step B: Ask a question

Run the script:

node chat.js
