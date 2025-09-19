import 'dotenv/config';
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chat() {
    const userQuery = 'what is my name  ';  // Example user query

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: 'http://localhost:6333/',
            collectionName: 'Atynatik-collection'
        }
    );

    const vectorSearcher = vectorStore.asRetriever({
        k: 3  // Top 3 most relevant content chunks
    });

    const relevantChunks = await vectorSearcher.invoke(userQuery);

    // Build clean context string from retrieved chunks
    const contextText = relevantChunks
        .map(chunk => chunk.pageContent)
        .join('\n\n---\n\n')
        .trim();

    const SYSTEM_PROMPT = `
You are the official Atyantik Technologies chatbot.

Answer all user queries in first-person, as if you are the representative of Atyantik.  
Use the context below, based entirely on the website content we have scraped and indexed.

If the user asks about company-specific information (e.g., careers, about us, services), respond informatively in first-person.

=== Website Content Context ===
${contextText}
`;

    const response = await client.chat.completions.create({
        model: 'gpt-4.1',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userQuery }
        ]
    });

    console.log('🤖 Informative AI Response:\n');
    console.log(response.choices[0].message.content);
}

chat();
