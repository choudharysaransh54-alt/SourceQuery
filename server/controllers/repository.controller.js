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

        const embeddings = await generateEmbeddings(chunks);

        const stored = await storeEmbeddings(
            chunks,
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

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
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

        await deleteCollection(`repolens-${repoName}`);

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

        const embeddings = await generateEmbeddings(chunks);

        const stored = await storeEmbeddings(
            chunks,
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