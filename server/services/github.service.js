const simpleGit = require("simple-git");
const fs = require("fs-extra");
const path = require("path");

const git = simpleGit();

const cloneRepository = async (repoUrl) => {

    const repoName = repoUrl
        .split("/")
        .pop()
        .replace(".git", "");

    const repoPath = path.join(
        __dirname,
        "..",
        "temp",
        repoName
    );

    await fs.remove(repoPath);

    console.log("Cloning started...");
    await git.clone(repoUrl, repoPath, [
        "--depth",
        "1"
    ]);
    console.log("Cloning completed...");

    return repoPath;

};

module.exports = {
    cloneRepository
};