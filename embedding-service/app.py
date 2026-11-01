from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI()

model = SentenceTransformer("BAAI/bge-small-en-v1.5")


class Request(BaseModel):
    chunks: list


@app.post("/embed")
def embed(request: Request):

    texts = [chunk["content"] for chunk in request.chunks]

    embeddings = model.encode(
    texts,
    batch_size=8,
    normalize_embeddings=True,
    show_progress_bar=False
).tolist()

    return {
        "embeddings": embeddings
    }

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )