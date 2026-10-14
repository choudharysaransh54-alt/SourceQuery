import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI
from pydantic import BaseModel
from fastembed import TextEmbedding

app = FastAPI()

model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5", threads=1)
executor = ThreadPoolExecutor(max_workers=1)


@app.on_event("startup")
def startup_event():
    # Pre-warm model in memory so first request is instant
    try:
        list(model.embed(["warmup"], batch_size=8))
    except Exception as e:
        print("Warmup error:", e)


@app.get("/")
def health():
    return {"status": "ok", "service": "embedding-service"}


class Request(BaseModel):
    chunks: list


def compute_embeddings(texts):
    return [embedding.tolist() for embedding in model.embed(texts, batch_size=8)]


@app.post("/embed")
async def embed(request: Request):

    texts = []
    for chunk in request.chunks:
        val = chunk.get("content") if isinstance(chunk, dict) else str(chunk)
        if val is None or not isinstance(val, str):
            val = str(val or " ")
        # Strip lone surrogates (caused by slicing UTF-16 strings across emojis)
        val = val.encode("utf-8", "ignore").decode("utf-8", "ignore")
        if not val.strip():
            val = " "
        # Cap to 500 characters for fast inference on CPU
        texts.append(val[:500])

    loop = asyncio.get_event_loop()
    embeddings = await loop.run_in_executor(executor, compute_embeddings, texts)

    return {
        "embeddings": embeddings
    }

import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port
    )