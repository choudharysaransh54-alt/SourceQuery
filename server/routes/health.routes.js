const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API Working",
        embeddingUrl: process.env.EMBEDDING_SERVICE_URL || process.env.EMBEDDING_SERVICE || "not-set",
        hasGroqKey: !!process.env.GROQ_API_KEY,
        hasQdrantUrl: !!process.env.QDRANT_URL,
        hasQdrantKey: !!process.env.QDRANT_API_KEY
    });
});

module.exports = router;