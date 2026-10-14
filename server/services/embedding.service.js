const axios = require("axios");

const BATCH_SIZE = 40;

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

        const response = await axios.post(
            `${baseUrl}/embed`,
            {
                chunks: batch
            },
            {
                timeout: 120000
            }
        );

        embeddings.push(...response.data.embeddings);
    }

    return embeddings;
}

module.exports = {
    generateEmbeddings
};