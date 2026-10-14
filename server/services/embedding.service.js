const axios = require("axios");

const BATCH_SIZE = 40;

function getEmbeddingServiceUrl() {
    let url = process.env.EMBEDDING_SERVICE_URL || process.env.EMBEDDING_SERVICE || "http://localhost:8000";
    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
    }
    return url.replace(/\/$/, "");
}

async function generateEmbeddings(chunks) {

    const embeddings = [];
    const baseUrl = getEmbeddingServiceUrl();

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {

        const batch = chunks.slice(i, i + BATCH_SIZE);

        console.log(
            `Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}`
        );

        const response = await axios.post(
            `${baseUrl}/embed`,
            {
                chunks: batch
            }
        );

        embeddings.push(...response.data.embeddings);
    }

    return embeddings;
}

module.exports = {
    generateEmbeddings
};