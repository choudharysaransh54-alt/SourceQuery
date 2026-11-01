const Groq = require("groq-sdk");

let groqClient = null;

function getGroqClient() {
    if (!groqClient) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("GROQ_API_KEY is not set. Please configure GROQ_API_KEY in your environment variables.");
        }
        groqClient = new Groq({ apiKey });
    }
    return groqClient;
}

async function askGemini(question, chunks) {

    const trimmedChunks = chunks.slice(0, 5);
    let context = trimmedChunks
        .map((chunk, index) => `
File: ${chunk.payload.relativePath}

${chunk.payload.content}
        `)
        .join("\n\n========================\n\n");

    if (context.length > 8000) {
        context = context.slice(0, 8000) + "\n\n...[Context truncated for brevity]...";
    }

    const groq = getGroqClient();
    const models = ["qwen/qwen3.8-27b", "openai/gpt-oss-20b"];
    let lastError = null;

    for (const model of models) {
        try {
            const completion = await groq.chat.completions.create({
                model,
                temperature: 0.1,
                messages: [
                    {
                        role: "system",
                        content: `
You are SourceQuery, an expert software engineer.

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
        } catch (err) {
            console.warn(`Model ${model} failed (${err.message}). Trying fallback model...`);
            lastError = err;
        }
    }

    throw lastError;

}

module.exports = {
    askGemini
};