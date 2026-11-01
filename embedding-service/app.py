import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastembed import TextEmbedding

app = FastAPI()

model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")


@app.get("/")
def health():
    return {"status": "ok", "service": "embedding-service"}


class Request(BaseModel):
    chunks: list


@app.post("/embed")
def embed(request: Request):

    texts = []
    for chunk in request.chunks:
        val = chunk.get("content") if isinstance(chunk, dict) else str(chunk)
        if val is None or not isinstance(val, str):
            val = str(val or " ")
        # Strip lone surrogates (caused by slicing UTF-16 strings across emojis)
        val = val.encode("utf-8", "ignore").decode("utf-8", "ignore")
        if not val.strip():
            val = " "
        texts.append(val)

    embeddings = [embedding.tolist() for embedding in model.embed(texts)]

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