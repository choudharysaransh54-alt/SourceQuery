const { QdrantClient } = require("@qdrant/js-client-rest");

const client = new QdrantClient({
    url: process.env.QDRANT_URL || "http://localhost:6333",
    apiKey: process.env.QDRANT_API_KEY || undefined,
    checkCompatibility: false
});

async function createCollection(collectionName) {

    const collections = await client.getCollections();

    const exists = collections.collections.find(
        c => c.name === collectionName
    );

    if (exists) {
        try {
            await client.delete(collectionName, {
                filter: {
                    must_not: []
                }
            });
        } catch (err) {
            console.warn("Could not clear points in existing collection:", err.message);
        }
        return;
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

    console.log("Deleting points/collection from Qdrant:", collectionName);
    
    try {
        await client.delete(collectionName, {
            filter: {
                must_not: []
            }
        });
    } catch (err) {
        console.warn("Could not delete points from Qdrant:", err.message);
    }

}

module.exports = {
    client,
    createCollection,
    listCollections,
    deleteCollection
};