const axios = require("axios");
const { client } = require("../config/qdrant");
const { getCollectionName } = require("../utils/collection.util");

const SCORE_THRESHOLD = 0.65;
const MAX_RESULTS = 8;
const SEARCH_LIMIT = 20;

const ignoredFiles = [
    "package-lock.json",
    "package.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".gitignore",
    "license"
];

if (ignoredFiles.includes(file)) {
    return -999;
}

if (
    path.includes("node_modules") ||
    path.includes("/dist/") ||
    path.includes("/build/")
) {
    return -999;
}

function boostScore(item) {

    let score = item.score;

    const path = item.payload.relativePath.toLowerCase();
    const file = item.payload.fileName.toLowerCase();

    if (file === "readme.md")
        score += 0.08;

    if (path.includes("/docs/"))
        score += 0.05;

    if (path.includes("/src/"))
        score += 0.02;

    return score;

}

async function search(query, repoUrl) {

    const collectionName = getCollectionName(repoUrl);

    const { data } = await axios.post(
        `${process.env.EMBEDDING_SERVICE}/embed`,
        {
            chunks: [
                {
                    content: query
                }
            ]
        }
    );

    const embedding = data.embeddings[0];

    let results = await client.search(collectionName, {
        vector: embedding,
        limit: SEARCH_LIMIT,
        with_payload: true
    });

    results = results
        .map(item => ({
            ...item,
            boostedScore: boostScore(item)
        }))
        .sort((a, b) => b.boostedScore - a.boostedScore);

    const seen = new Set();
    const filtered = [];

    for (const item of results) {

        if (item.boostedScore < SCORE_THRESHOLD)
            continue;

        const key = item.payload.relativePath;

        if (seen.has(key))
            continue;

        seen.add(key);
        filtered.push(item);

        if (filtered.length >= MAX_RESULTS)
            break;
    }

    return filtered;
}

module.exports = {
    search
};