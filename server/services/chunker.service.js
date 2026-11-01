const fs = require("fs-extra");
const path = require("path");

const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;

const BREAK_POINTS = [
    "\nclass ",
    "\nfunction ",
    "\nexport ",
    "\nconst ",
    "\nlet ",
    "\nvar ",
    "\nasync ",
    "\ninterface ",
    "\ntype ",
    "\nenum ",
    "\nstruct ",
    "\nimpl ",
    "\nfn ",
    "\n\n"
];

function findBestBreak(content, start, end) {

    let best = end;

    for (const point of BREAK_POINTS) {

        const index = content.lastIndexOf(point, end);

        if (
            index !== -1 &&
            index > start + CHUNK_SIZE / 2 &&
            index < end
        ) {
            best = index;
        }

    }

    return best;

}

function getLineNumber(text, index) {
    return text.slice(0, index).split("\n").length;
}

async function chunkRepository(files) {

    const chunks = [];

    for (const file of files) {

        const content = await fs.readFile(file.fullPath, "utf8");

        let start = 0;

        while (start < content.length) {

            let end = Math.min(
                start + CHUNK_SIZE,
                content.length
            );

            end = findBestBreak(
                content,
                start,
                end
            );

            if (end <= start) {
                end = Math.min(
                    start + CHUNK_SIZE,
                    content.length
                );
            }

            const text = content.slice(start, end);

            if (text.trim().length > 0) {

                chunks.push({
                    fileName: file.fileName,
                    relativePath: file.relativePath,
                    extension: path.extname(file.fileName),
                    startLine: getLineNumber(content, start),
                    endLine: getLineNumber(content, end),
                    content: text
                });

            }

            const nextStart = end - CHUNK_OVERLAP;

            if (nextStart <= start) {
                start = end;
            } else {
                start = nextStart;
            }

        }

    }

    return chunks;

}

module.exports = {
    chunkRepository
};