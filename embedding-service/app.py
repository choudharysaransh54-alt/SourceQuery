from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

import torch
torch.set_num_threads(4)

app = FastAPI()

model = SentenceTransformer("BAAI/bge-small-en-v1.5", device="cpu")


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

    embeddings = model.encode(
        texts,
        batch_size=16,
        normalize_embeddings=True,
        show_progress_bar=False
    ).tolist()

    return {
        "embeddings": embeddings
    }

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )