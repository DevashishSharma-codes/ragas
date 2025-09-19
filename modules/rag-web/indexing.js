import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from 'langchain/document';

const visitedUrls = new Set();

async function scrapePage(url, baseUrl) {
    if (visitedUrls.has(url)) return [];
    visitedUrls.add(url);

    try {
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);

      
        let textContent = $('body')
            .text()  // Get all text inside the body
            .replace(/\s+/g, ' ')  // Normalize whitespace
            .trim();

        const docs = [
            new Document({
                pageContent: textContent,
                metadata: { source: url }
            })
        ];

        // Extract internal links (optional, but keep recursion reasonable)
        const links = [];
        $('a[href]').each((i, elem) => {
            const link = $(elem).attr('href');
            if (link && link.startsWith('/') && !link.startsWith('//')) {
                const fullUrl = new URL(link, baseUrl).href;
                links.push(fullUrl);
            }
        });

        for (const link of links) {
            const childDocs = await scrapePage(link, baseUrl);
            docs.push(...childDocs);
        }

        return docs;

    } catch (err) {
        console.error(`Failed to scrape ${url}:`, err.message);
        return [];
    }
}


async function init() {
    const importantPages = [
        'https://atyantik.com',
        'https://atyantik.com/about-us/',
        'https://atyantik.com/ui-ux-design/',
        'https://atyantik.com/portfolio/',
        'https://atyantik.com/blogs/',
        'https://atyantik.com/careers/',
        'https://atyantik.com/corporate-partnership/'
    ];

    const allDocs = [];

    for (const url of importantPages) {
        const docs = await scrapePage(url, 'https://atyantik.com');
        allDocs.push(...docs);
    }

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-large",
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(
        
        allDocs,
        embeddings,
        {
            url: 'http://localhost:6333/',
            collectionName: 'Atynatik-collection'
        }
    );

    console.log(`Indexed ${allDocs.length} documents from Atyantik website.`);
}


init();
