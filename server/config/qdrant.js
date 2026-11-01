const { QdrantClient } = require("@qdrant/js-client-rest");

const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false
});

async function createCollection(collectionName) {

    const collections = await client.getCollections();

    const exists = collections.collections.find(
        c => c.name === collectionName
    );

    if (exists) {
        await client.deleteCollection(collectionName);
    }

    await client.createCollection(collectionName, {
        vectors: {
            size: 384,
            distance: "Cosine"
        }
    });

}

async function listCollections() {

    const collections = await client.getCollections();

    return collections.collections;

}

async function deleteCollection(collectionName) {

    console.log("Deleting from Qdrant:", collectionName);
    
    await client.deleteCollection(collectionName);

}

module.exports = {
    client,
    createCollection,
    listCollections,
    deleteCollection
};