import 'dotenv/config';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

async function init() {
  const pdfFilePath = "./sample-local-pdf.pdf";

  // Load PDF
  const loader = new PDFLoader(pdfFilePath);
  const docs = await loader.load();

  // Create embeddings
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });

  // Store embeddings in Qdrant
  const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: "http://localhost:6333", // Qdrant instance
    collectionName: "pdf-collection",
  });

  console.log("PDF successfully embedded into Qdrant!");
}

init();
