from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.api import health, analyze

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Privacy-first local resume diagnostic engine",
    version="2.0.0"
)

# CORS Policy configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this to frontend environment vars in strict PROD
    allow_credentials=True,
    allow_methods=["GET", "POST", "HEAD", "OPTIONS"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(health.router)
app.include_router(analyze.router, prefix="/api")
