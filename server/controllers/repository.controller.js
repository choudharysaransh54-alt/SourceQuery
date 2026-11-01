const { cloneRepository } = require("../services/github.service");
const { scanRepository } = require("../services/fileScanner.service");
const { chunkRepository } = require("../services/chunker.service");
const { generateEmbeddings } = require("../services/embedding.service");
const { storeEmbeddings } = require("../services/qdrant.service");
const {
    listCollections,
    deleteCollection
} = require("../config/qdrant");
const path = require("path");
const {
    saveRepository,
    getRepositories: getSavedRepositories,
    getRepository,
    deleteRepository: deleteSavedRepository
} = require("../services/repository.service");
const { getCollectionName } = require("../utils/collection.util");

function selectBalancedChunks(chunks, maxChunks = 80) {
    if (chunks.length <= maxChunks) return chunks;

    const fileMap = new Map();
    for (const chunk of chunks) {
        if (!fileMap.has(chunk.relativePath)) {
            fileMap.set(chunk.relativePath, []);
        }
        fileMap.get(chunk.relativePath).push(chunk);
    }

    const selected = [];
    const files = Array.from(fileMap.values());
    let round = 0;

    while (selected.length < maxChunks) {
        let addedInRound = false;
        for (const fileChunks of files) {
            if (round < fileChunks.length) {
                selected.push(fileChunks[round]);
                addedInRound = true;
                if (selected.length >= maxChunks) break;
            }
        }
        if (!addedInRound) break;
        round++;
    }

    return selected;
}

exports.uploadRepository = async (req, res) => {

    try {

        const { repoUrl } = req.body;

        if (!repoUrl) {
            return res.status(400).json({
                success: false,
                message: "Repository URL is required"
            });
        }

        const repoPath = await cloneRepository(repoUrl);

        const files = await scanRepository(repoPath);

        const chunks = await chunkRepository(files);

        if (!files.length || !chunks.length) {
            return res.status(400).json({
                success: false,
                message: "No supported code files (.js, .ts, .py, etc.) found in this repository."
            });
        }

        // Balance chunks evenly across files so every file (frontend and backend) is indexed
        const indexChunks = selectBalancedChunks(chunks, 80);

        const embeddings = await generateEmbeddings(indexChunks);

        const stored = await storeEmbeddings(
            indexChunks,
            embeddings,
            repoUrl
        );

        const repoName = repoUrl
            .split("/")
            .pop()
            .replace(".git", "");

        await saveRepository({
            name: repoName,
            repoUrl
        });

        res.json({
            success: true,
            totalFiles: files.length,
            totalChunks: chunks.length,
            totalEmbeddings: embeddings.length,
            storedVectors: stored
        });

    } catch (error) {

        console.error("Upload error:", error.response?.data || error.message || error);

        res.status(500).json({
            success: false,
            message: error.response?.data?.message || error.message
        });

    }

};

exports.getRepositories = async (req, res) => {

    try {

        const repositories = await getSavedRepositories();

        res.json({
            success: true,
            repositories
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.deleteRepository = async (req, res) => {

    try {

        const { repoName } = req.params;

        const repository = await getRepository(repoName);

        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found"
            });
        }

        const collectionName = getCollectionName(repository.repoUrl);

        console.log("Deleting collection:", collectionName);

        try {
            await deleteCollection(collectionName);
        } catch (err) {
            console.warn("Could not delete from Qdrant:", err.message);
        }

        const { deleteLocalPoints } = require("../services/qdrant.service");
        await deleteLocalPoints(collectionName);

        await deleteSavedRepository(repoName);

        const repoPath = path.join(
            __dirname,
            "..",
            "temp",
            repoName
        );

        await require("fs-extra").remove(repoPath);

        res.json({
            success: true,
            message: "Repository deleted"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.reindexRepository = async (req, res) => {

    console.log("Repo Param:", req.params.repoName);

    try {

        const { repoName } = req.params;

        const repository = await getRepository(repoName);

        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found"
            });
        }

        const repoUrl = repository.repoUrl;

        const repoPath = await cloneRepository(repoUrl);

        const files = await scanRepository(repoPath);

        const chunks = await chunkRepository(files);

        if (!files.length || !chunks.length) {
            return res.status(400).json({
                success: false,
                message: "No supported code files found in this repository."
            });
        }

        const indexChunks = selectBalancedChunks(chunks, 80);

        const embeddings = await generateEmbeddings(indexChunks);

        const stored = await storeEmbeddings(
            indexChunks,
            embeddings,
            repoUrl
        );

        res.json({
            success: true,
            message: "Repository re-indexed successfully",
            totalFiles: files.length,
            totalChunks: chunks.length,
            totalEmbeddings: embeddings.length,
            storedVectors: stored
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};