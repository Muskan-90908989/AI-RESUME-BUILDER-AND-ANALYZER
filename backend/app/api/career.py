from fastapi import APIRouter, HTTPException
from app.schemas.career import CareerGapRequest, CareerGapResponse
from app.services.career_service import analyze_career_gap

router = APIRouter()

@router.post("/gap", response_model=CareerGapResponse)
async def get_career_gap(req: CareerGapRequest):
    try:
        return analyze_career_gap(req.target_role, req.current_skills)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
