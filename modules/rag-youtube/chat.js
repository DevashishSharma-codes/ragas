import 'dotenv/config';
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function runQuery(userQuery) {
    console.log(`\n🤔 User Query: "${userQuery}"`);

    // Initialize embeddings
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-large",
    });

    // Connect to Qdrant vector store
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: process.env.QDRANT_URL || 'http://localhost:6333/',
            collectionName: 'Atynatik-collection'
        }
    );

    // Retrieve relevant chunks
    const retriever = vectorStore.asRetriever({ k: 4 });
    const relevantChunks = await retriever.invoke(userQuery);

    // Build context string
    const contextText = relevantChunks
        .map((chunk, index) => `--- Chunk ${index + 1} (Source: ${chunk.metadata.source}) ---\n${chunk.pageContent}`)
        .join('\n\n');

    const SYSTEM_PROMPT = `
You are the official Atyantik Technologies chatbot.
You must answer user queries in first-person, as if you are a representative of Atyantik.
Base your answers entirely on the context provided below. The context is sourced from our official website and our YouTube channel.
If the context does not contain the answer, say "I'm sorry, I don't have information on that topic based on our available resources."

=== Context ===
${contextText}
`;

    // Generate response
    const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userQuery }
        ],
        temperature: 0.5,
    });

    console.log('\n✅🤖 AI Response:\n');
    console.log(response.choices[0].message.content);
}

// Main execution
const USER_QUERY = 'what is this video about ?';
runQuery(USER_QUERY);
