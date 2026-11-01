const { v4: uuid } = require("uuid");
const { client, createCollection } = require("../config/qdrant");
const { getCollectionName } = require("../utils/collection.util");

async function storeEmbeddings(chunks, embeddings, repoUrl) {

    const collectionName = getCollectionName(repoUrl);

    await createCollection(collectionName);

    const points = chunks.map((chunk, index) => ({
        id: uuid(),
        vector: embeddings[index],
        payload: {
            fileName: chunk.fileName,
            relativePath: chunk.relativePath,
            content: chunk.content
        }
    }));

    await client.upsert(collectionName, {
        wait: true,
        points
    });

    return {
        collectionName,
        totalVectors: points.length
    };
}

module.exports = {
    storeEmbeddings
};