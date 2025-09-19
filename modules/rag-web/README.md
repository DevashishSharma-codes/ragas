# Website rag module

This repository contains two primary modules designed to build an AI-powered chatbot that answers queries based on textual content scraped and indexed from a website. The system utilizes OpenAI embeddings, Qdrant vector storage, and LangChain integrations to enable contextual question answering grounded in the website’s content.

---

## Overview

### Indexing Module
- Scrapes selected pages and internal links from a target website.
- Extracts and normalizes textual content from HTML pages.
- Converts text into vector embeddings using OpenAI's `text-embedding-3-large` model.
- Stores embeddings in a Qdrant vector database collection for efficient similarity search.

### Chat Module
- Accepts user queries.
- Retrieves the top relevant content chunks from the Qdrant vector store using vector similarity search.
- Constructs a system prompt embedding the retrieved contextual information.
- Sends the prompt and query to OpenAI GPT-4.1 chat completion model.
- Produces informative AI responses grounded in the indexed website content.

---

## Prerequisites

- Node.js runtime environment (v16+ recommended)
- Qdrant vector database instance running and accessible (e.g., at `http://localhost:6333/`)
- OpenAI API key with access to GPT-4.1 and embeddings models
- Environment variables configured via `.env` file containing:
OPENAI_API_KEY=your_openai_api_key_here

text

---

## Installation

1. Clone the repository:
git clone <repository-url>
cd <repository-folder>

text

2. Install dependencies:
npm install dotenv axios cheerio @langchain/openai @langchain/qdrant langchain openai

text

3. Ensure Qdrant is set up and running.

4. Create a `.env` file with your OpenAI API key:
OPENAI_API_KEY=your_openai_api_key_here

text

---

## Usage

### Indexing Module

This module scrapes specified pages on a website, collects textual content, generates embeddings, and indexes them into a Qdrant collection.

Run the indexing script:

node index.js

text

- Crawls defined important pages recursively (including internal links).
- Extracts all textual content from the HTML body.
- Creates embeddings and uploads them to a named collection in Qdrant.
- Logs the number of documents indexed upon completion.

### Chat Module

This module accepts user queries and returns contextually relevant responses using the indexed content.

Run the chat script:

node chat.js

text

- The `userQuery` variable holds the question to send.
- Retrieves the top relevant documents from Qdrant by similarity.
- Builds a system prompt with the contextual data.
- Sends the prompt and user query to OpenAI GPT-4.1 for completion.
- Prints the AI-generated response reflecting the website’s content.

---

## Code Structure

### Indexing Highlights

- HTTP requests and HTML parsing done with `axios` and `cheerio`.
- Avoids duplicate URL processing with a visited URLs set.
- Creates `Document` instances for each scraped page with text and metadata.
- Uses `OpenAIEmbeddings` to generate vector representations of text.
- Indexes embeddings into Qdrant using `QdrantVectorStore`’s `fromDocuments()` method.

### Chat Highlights

- Initializes OpenAI client using environment API key.
- Loads an existing Qdrant vector collection for retrieval.
- Retrieves the top-k relevant text chunks for the user query.
- Creates a system prompt embedding the retrieved chunks.
- Uses GPT-4.1 chat completion model for a conversational response.
- Outputs chatbot response to the console.



