from fastapi import APIRouter

router = APIRouter()

@router.api_route("/", methods=["GET", "HEAD"])
async def root():
    return {"status": "ok", "service": "ai-resume-analyzer"}

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-resume-analyzer"}
