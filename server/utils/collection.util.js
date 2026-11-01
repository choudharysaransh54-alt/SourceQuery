function getCollectionName(repoUrl) {

    const repoName = repoUrl
        .split("/")
        .pop()
        .replace(".git", "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");

    return `repolens-${repoName}`;

}

module.exports = {
    getCollectionName
};