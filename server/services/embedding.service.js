const axios = require("axios");

const BATCH_SIZE = 8;

async function postWithRetry(url, data, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await axios.post(url, data, { timeout: 120000 });
        } catch (err) {
            console.warn(`Embedding attempt ${attempt}/${retries} failed: ${err.message}`);
            if (attempt === retries) throw err;
            await new Promise(r => setTimeout(r, attempt * 1500));
        }
    }
}

function getEmbeddingServiceUrl() {
    let url = process.env.EMBEDDING_SERVICE_URL || process.env.EMBEDDING_SERVICE || "https://sourcequery-embedding.onrender.com";
    url = url.trim();

    if (url === "http://localhost:8000" || url === "localhost:8000" || !url) {
        if (process.env.NODE_ENV === "production" || process.env.RENDER) {
            return "https://sourcequery-embedding.onrender.com";
        }
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        const host = url.split(":")[0];
        if (!host.includes(".") || host === "localhost") {
            url = url.includes(":") ? `http://${url}` : `http://${url}:8000`;
        } else {
            url = `https://${url}`;
        }
    }
    return url.replace(/\/$/, "");
}

async function generateEmbeddings(chunks) {

    const embeddings = [];
    const baseUrl = getEmbeddingServiceUrl();
    console.log(`Generating embeddings for ${chunks.length} chunks using: ${baseUrl}`);

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {

        const batch = chunks.slice(i, i + BATCH_SIZE);

        console.log(
            `Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}`
        );

        const response = await postWithRetry(
            `${baseUrl}/embed`,
            {
                chunks: batch
            }
        );

        embeddings.push(...response.data.embeddings);
        // Small delay between batches to avoid cloud burst rate limiting
        await new Promise(r => setTimeout(r, 400));
    }

    return embeddings;
}

module.exports = {
    generateEmbeddings
};