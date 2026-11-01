const axios = require("axios");

async function generateEmbeddings(chunks) {

    const response = await axios.post(
        `${process.env.EMBEDDING_SERVICE}/embed`,
        {
            chunks
        }
    );

    return response.data.embeddings;

}

module.exports = {
    generateEmbeddings
};