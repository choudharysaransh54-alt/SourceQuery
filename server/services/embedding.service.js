const axios = require("axios");

const BATCH_SIZE = 40;

async function generateEmbeddings(chunks) {

    const embeddings = [];

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {

        const batch = chunks.slice(i, i + BATCH_SIZE);

        console.log(
            `Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}`
        );

        const response = await axios.post(
            `${process.env.EMBEDDING_SERVICE}/embed`,
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