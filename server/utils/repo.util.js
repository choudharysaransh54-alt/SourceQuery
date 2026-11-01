function getRepoId(repoUrl) {

    return repoUrl
        .replace("https://github.com/", "")
        .replace(/\/$/, "")
        .toLowerCase();

}

module.exports = {
    getRepoId
};