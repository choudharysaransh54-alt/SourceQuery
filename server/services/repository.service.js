const fs = require("fs-extra");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "repositories.json");

async function ensureFile() {

    await fs.ensureDir(DATA_DIR);

    if (!(await fs.pathExists(DATA_FILE))) {
        await fs.writeJson(DATA_FILE, [], {
            spaces: 2
        });
    }

}

async function getRepositories() {

    await ensureFile();

    return await fs.readJson(DATA_FILE);

}

async function saveRepositories(repositories) {

    await ensureFile();

    await fs.writeJson(
        DATA_FILE,
        repositories,
        {
            spaces: 2
        }
    );

}

async function saveRepository(repository) {

    const repositories = await getRepositories();

    const index = repositories.findIndex(
        r => r.name === repository.name
    );

    if (index >= 0) {
        repositories[index] = repository;
    } else {
        repositories.push(repository);
    }

    await saveRepositories(repositories);

}

async function getRepository(repoName) {

    const repositories = await getRepositories();

    return repositories.find(
        r => r.name === repoName
    );

}

async function deleteRepository(repoName) {

    const repositories = await getRepositories();

    const updated = repositories.filter(
        r => r.name !== repoName
    );

    await saveRepositories(updated);

}

module.exports = {
    getRepositories,
    saveRepository,
    getRepository,
    deleteRepository
};