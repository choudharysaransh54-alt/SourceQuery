const fs = require("fs-extra");
const path = require("path");
const ignore = require("ignore");

const SUPPORTED_EXTENSIONS = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".cpp",
    ".c",
    ".h",
    ".hpp",
    ".java",
    ".py",
    ".go",
    ".rs",
    ".cs",
    ".php",
    ".rb",
    ".swift",
    ".kt",
    ".md"
];

const DEFAULT_IGNORES = [
    "node_modules",
    ".git",
    ".github",      // ADD THIS
    "dist",
    "build",
    ".next",
    "coverage",
    ".idea",
    ".vscode"
];

async function scanRepository(repoPath) {

    const ig = ignore().add(DEFAULT_IGNORES);

    const files = [];

    async function walk(currentPath) {

        const entries = await fs.readdir(currentPath);

        for (const entry of entries) {

            const fullPath = path.join(currentPath, entry);

            const relativePath = path.relative(repoPath, fullPath);

            if (ig.ignores(relativePath)) continue;

            const stats = await fs.stat(fullPath);

            if (stats.isDirectory()) {
                await walk(fullPath);
            } else {

                const extension = path.extname(entry);

                if (SUPPORTED_EXTENSIONS.includes(extension)) {

                    const ignoredFiles = [
                        "CONTRIBUTING.md",
                        "CODE_OF_CONDUCT.md",
                        "REVIEWING.md",
                        "SECURITY.md",
                        "LICENSE",
                        "CHANGELOG.md",
                        "package.json",
                        "package-lock.json",
                        "yarn.lock",
                        "pnpm-lock.yaml",
                        "tsconfig.json",
                        "jsconfig.json"
                    ];

                    if (ignoredFiles.includes(entry))
                        continue;

                    files.push({
                        fileName: entry,
                        relativePath,
                        fullPath
                    });

                }

            }

        }

    }

    await walk(repoPath);

    return files;

}

module.exports = {
    scanRepository
};