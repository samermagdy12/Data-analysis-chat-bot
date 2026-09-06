from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.routes.upload import router as upload_router
from app.routes.sessions import router as sessions_router


app = FastAPI(
    title="AI Data Analyst",
    description="AI-powered Data Analysis using OpenAI Responses API",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # غيّرها لاحقًا إلى دومين الـ Frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Routes
# --------------------------------------------------

app.include_router(
    upload_router,
    prefix="/api",
    tags=["Upload"]
)

app.include_router(
    chat_router,
    prefix="/api",
    tags=["Chat"]
)

app.include_router(
    sessions_router,
    prefix="/api",
    tags=["Sessions"]
)


# --------------------------------------------------
# Root Endpoint
# --------------------------------------------------

@app.get("/")
def root():

    return {
        "application": "AI Data Analyst",
        "version": "1.0.0",
        "status": "running",
        "documentation": "/docs"
    }


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }