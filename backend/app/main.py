from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, analyze, applications, career

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
app.include_router(applications.router, prefix="/api/applications")
app.include_router(career.router, prefix="/api/career")
