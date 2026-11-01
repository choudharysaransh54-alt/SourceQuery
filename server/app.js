const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const repositoryRoutes = require("./routes/repository.routes");
const searchRoutes = require("./routes/search.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/repositories", repositoryRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "RepoLens AI Backend Running"
    });
});

module.exports = app;