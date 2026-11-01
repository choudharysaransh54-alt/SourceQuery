const { search } = require("../services/search.service");
const { askGemini } = require("../services/gemini.service");

exports.searchRepository = async (req, res) => {

    try {

        const { query, repoUrl } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Query required"
            });
        }

        const result = await search(query, repoUrl);

        const answer = await askGemini(query, result);

        res.json({
            success: true,
            answer,
            references: result.map(item => ({
                fileName: item.payload.fileName,
                relativePath: item.payload.relativePath,
                score: item.score
            }))
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};