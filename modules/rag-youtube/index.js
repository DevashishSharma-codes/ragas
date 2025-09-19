import 'dotenv/config';
import { chromium } from 'playwright';
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const SOURCES_TO_INDEX = [
    'https://www.youtube.com/watch?v=8KkKuTCFvzI',
];

function getYoutubeVideoId(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            const videoId = urlObj.searchParams.get('v');
            if (videoId) return videoId.substring(0, 11);
        }
        if (urlObj.hostname === 'youtu.be') {
            const videoId = urlObj.pathname.slice(1);
            if (videoId) return videoId.substring(0, 11);
        }
    } catch (e) {
        console.error("URL parsing failed, falling back to regex. Error:", e.message);
    }

    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function splitTextIntoChunks(text, metadata) {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    return await textSplitter.createDocuments([text], [metadata]);
}

async function getAndChunkYoutubeTranscript(url) {
    const videoId = getYoutubeVideoId(url);
    if (!videoId) {
        console.error(`Could not extract video ID from URL: ${url}`);
        return [];
    }

    console.log(`Fetching transcript for video ID: ${videoId}...`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Handle cookie consent if present
        const consentButton = page.getByRole('button', { name: 'Reject all' });
        if (await consentButton.isVisible({ timeout: 5000 })) {
            console.log("Rejecting cookie consent...");
            await consentButton.click();
        }

        await page.waitForSelector('#description-inline-expander', { timeout: 10000 });
        await page.locator('#description-inline-expander #expand').click();

        const showTranscriptButton = page.getByRole('button', { name: 'Show transcript' });
        await showTranscriptButton.waitFor({ state: 'visible', timeout: 10000 });
        await showTranscriptButton.click();

        await page.waitForSelector('ytd-transcript-segment-renderer', { timeout: 10000 });

        const segments = await page.locator('ytd-transcript-segment-renderer').all();
        const textParts = await Promise.all(segments.map(segment =>
            segment.locator('.segment-text').innerText()
        ));
        const fullText = textParts.join(' ').trim();

        if (!fullText) {
            console.log(`No transcript text found for video ID: ${videoId}.`);
            return [];
        }

        console.log(`Transcript fetched for video ID: ${videoId}`);
        return await splitTextIntoChunks(fullText, { source: url, type: 'youtube' });

    } catch (err) {
        console.error(`Error fetching transcript for ${url}: ${err.message}`);
        return [];
    } finally {
        await browser.close();
    }
}

async function runIndexing() {
    console.log("Starting YouTube video indexing...");
    const allDocs = [];

    for (const source of SOURCES_TO_INDEX) {
        const docs = await getAndChunkYoutubeTranscript(source);
        allDocs.push(...docs);
    }

    if (allDocs.length === 0) {
        console.log("No documents created from videos. Exiting.");
        return;
    }

    console.log(`[1/2] Created ${allDocs.length} text chunks. Generating embeddings...`);

    const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-large" });

    console.log("[2/2] Storing embeddings in Qdrant...");
    await QdrantVectorStore.fromDocuments(
        allDocs,
        embeddings,
        {
            url: process.env.QDRANT_URL || 'http://localhost:6333/',
            collectionName: 'Atynatik-collection',
        }
    );

    console.log("Indexing complete. Qdrant database is ready.");
}

runIndexing();
