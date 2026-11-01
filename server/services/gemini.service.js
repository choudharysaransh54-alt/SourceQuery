const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function askGemini(question, chunks) {

    const context = chunks
        .map((chunk, index) => `
File: ${chunk.payload.relativePath}

${chunk.payload.content}
        `)
        .join("\n\n========================\n\n");

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        messages: [
            {
                role: "system",
                content: `
You are RepoLens AI, an expert software engineer.

Rules:
- Answer ONLY from the repository context.
- Never invent functions, files or APIs.
- If information is missing, clearly say you couldn't find it.
- Mention file names whenever relevant.
- Explain step-by-step when describing code flow.
- Keep answers concise but complete.
- Use markdown.
- Use code blocks whenever helpful.
                `
            },
            {
                role: "user",
                content: `
Repository Context

The following code snippets are ordered by semantic relevance.
The first snippet is the most relevant to the user's question.

${context}

Question

${question}

Instructions:
- Prefer the highest-ranked snippets.
- If the answer spans multiple files, combine them.
- Mention the file names used.
- If the answer is not present, explicitly say so.
                `
            }
        ]
    });

    return completion.choices[0].message.content.trim();

}

module.exports = {
    askGemini
};