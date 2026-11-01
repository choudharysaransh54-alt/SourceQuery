const express = require("express");

const {
    uploadRepository,
    getRepositories,
    deleteRepository,
    reindexRepository
} = require("../controllers/repository.controller");

const router = express.Router();

router.post("/upload", uploadRepository);

router.get("/", getRepositories);

router.delete("/:repoName", deleteRepository);

router.post("/:repoName/reindex", reindexRepository);

module.exports = router;