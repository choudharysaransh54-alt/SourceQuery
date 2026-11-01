const { v4: uuid } = require("uuid");
const { client, createCollection } = require("../config/qdrant");
const { getCollectionName } = require("../utils/collection.util");
const fs = require("fs-extra");
const path = require("path");

const VECTOR_DIR = path.join(__dirname, "..", "data", "vectors");

async function saveLocalPoints(collectionName, points) {
    await fs.ensureDir(VECTOR_DIR);
    const filePath = path.join(VECTOR_DIR, `${collectionName}.json`);
    await fs.writeJson(filePath, points, { spaces: 2 });
}

async function getLocalPoints(collectionName) {
    const filePath = path.join(VECTOR_DIR, `${collectionName}.json`);
    if (await fs.pathExists(filePath)) {
        return await fs.readJson(filePath);
    }
    return [];
}

async function deleteLocalPoints(collectionName) {
    const filePath = path.join(VECTOR_DIR, `${collectionName}.json`);
    await fs.remove(filePath);
}

async function storeEmbeddings(chunks, embeddings, repoUrl) {

    const collectionName = getCollectionName(repoUrl);

    const points = chunks.map((chunk, index) => ({
        id: uuid(),
        vector: embeddings[index],
        payload: {
            fileName: chunk.fileName,
            relativePath: chunk.relativePath,
            content: chunk.content
        }
    }));

    // Always persist to local vector store for zero-downtime resilience
    await saveLocalPoints(collectionName, points);

    // Also attempt storing in Qdrant if available
    try {
        await createCollection(collectionName);
        await client.upsert(collectionName, {
            wait: true,
            points
        });
    } catch (err) {
        console.warn(`Qdrant storage notice: ${err.message}. Using built-in vector store.`);
    }

    return {
        collectionName,
        totalVectors: points.length
    };
}

module.exports = {
    storeEmbeddings,
    getLocalPoints,
    deleteLocalPoints
};