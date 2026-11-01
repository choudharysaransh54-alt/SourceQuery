<div align="center">

# RepoLens AI

### AI-Powered Semantic Code Search Engine using RAG

Ask questions about any GitHub repository in natural language and receive context-aware answers powered by semantic search, vector embeddings, Qdrant, and Groq LLM.

<br>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![NodeJS](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Qdrant](https://img.shields.io/badge/Qdrant-VectorDB-DC244C?style=for-the-badge)](https://qdrant.tech/)
[![Groq](https://img.shields.io/badge/Groq-LLM-black?style=for-the-badge)](https://groq.com/)
[![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=for-the-badge&logo=railway)](https://railway.app/)
[![Vercel](https://img.shields.io/badge/Vercel-Live-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

</div>

---

# Live Demo

### Frontend

**https://repo-lens-ai-phi.vercel.app**

---

### Backend API

**https://repolens-ai-production-c998.up.railway.app**

---

## Features

- Semantic code search using vector embeddings
- Ask questions in natural language
- Repository indexing from GitHub
- AI-powered answers using Retrieval-Augmented Generation (RAG)
- Smart retrieval score boosting
- Fast similarity search using Qdrant
- Repository Re-indexing
- Repository Deletion
- Automatic filtering of unnecessary files
- Production deployment

---

# Tech Stack

| Frontend | Backend | AI | Database | Deployment |
|-----------|----------|---------|-------------|---------------|
| React | Node.js | Groq Llama 3.3 70B | Qdrant | Vercel |
| Tailwind CSS | Express.js | Sentence Transformers | Railway |
| Axios | REST API | BAAI/bge-small-en-v1.5 | | |

---

# Architecture

```text
                 GitHub Repository
                         │
                         ▼
                  Clone Repository
                         │
                         ▼
                  Scan Source Files
                         │
                         ▼
                    Code Chunking
                         │
                         ▼
              Sentence Transformer
                  (Embeddings)
                         │
                         ▼
                Qdrant Vector Store
                         │
                         ▼
              Semantic Similarity Search
                         │
                         ▼
             Retrieved Relevant Chunks
                         │
                         ▼
                  Groq Llama 3.3 70B
                         │
                         ▼
                Context-Aware Response
```

---

# Project Structure

```text
RepoLens-AI

client/
    src/
    components/
    pages/

server/
    controllers/
    routes/
    services/
    models/
    config/
    utils/

embedding-service/

```

---

# RAG Pipeline

### Repository Upload

```
GitHub Repository

↓

Clone

↓

Scan Files

↓

Chunk Files

↓

Generate Embeddings

↓

Store Embeddings inside Qdrant
```

---

### User Query

```
User Question

↓

Embedding Generation

↓

Vector Search

↓

Top Relevant Chunks

↓

Groq LLM

↓

AI Generated Answer
```

---

# Optimizations

- Smart Retrieval Score Boosting
- Duplicate File Removal
- README Prioritization
- Documentation Prioritization
- Config File Filtering
- Lock File Filtering
- Node Embedding Batching
- Optimized SentenceTransformer Batch Processing
- Faster Retrieval
- Repository Cleanup from Qdrant

---

# Installation

Clone Repository

```bash
git clone https://github.com/gandhigarvit01/RepoLens-AI.git
```

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd server
npm install
```

Embedding Service

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Backend

```env
PORT=

QDRANT_URL=
QDRANT_API_KEY=

EMBEDDING_SERVICE=

GROQ_API_KEY=
```

Embedding Service

---

# Future Improvements

- Authentication
- Background Indexing
- Private Repository Support
- Streaming Responses
- Multi Repository Search
- GitHub OAuth

---

# Author

## Garvit Gandhi

GitHub

https://github.com/gandhigarvit01

LinkedIn

(Add LinkedIn URL)

---

# License

MIT