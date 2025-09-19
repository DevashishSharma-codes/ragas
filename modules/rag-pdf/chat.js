import 'dotenv/config';
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chat() {
    const userQuery = 'what is this pdf about  ';  // Example user query

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: 'http://localhost:6333/',
            collectionName: 'pdf-collection'
        }
    );

    const vectorSearcher = vectorStore.asRetriever({
        k: 3
    });

    const relevantChunks = await vectorSearcher.invoke(userQuery);



    const SYSTEM_PROMPT = `
    You are a Retrieval-Augmented Generation (RAG) assistant specialized in answering questions from PDF documents.  
Your task is to carefully read the retrieved context from the PDF and provide accurate, concise, and well-structured answers.  

Guidelines:  
1. Use ONLY the information from the retrieved PDF context to answer.  
2. If the context does not contain enough information, clearly state:  
   "The provided document does not contain sufficient information to answer this question."  
3. Do not hallucinate, make assumptions, or use outside knowledge.  
4. Keep answers clear, factual, and to the point.  
5. If the retrieved text is technical or complex, explain it in simple language while keeping accuracy.  
6. When relevant, cite or reference the exact clause/section from the document for clarity.  

Your role is to act like a precise legal/technical assistant who only trusts the given PDF document(s).  
=== Retrieved PDF Context ===

${relevantChunks}
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
