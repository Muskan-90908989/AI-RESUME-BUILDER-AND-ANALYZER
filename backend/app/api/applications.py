from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.repositories import local_db

router = APIRouter()

class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: str
    url: str = ""
    match_score: int = 0

class ApplicationUpdate(BaseModel):
    status: str

@router.get("/", response_model=List[dict])
async def list_applications():
    return local_db.get_all_applications()

@router.post("/", response_model=dict)
async def create_application(app_data: ApplicationCreate):
    try:
        new_app = local_db.create_application(
            company=app_data.company,
            role=app_data.role,
            status=app_data.status,
            url=app_data.url,
            match_score=app_data.match_score
        )
        return new_app
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save application: {str(e)}")

@router.put("/{app_id}")
async def update_status(app_id: str, app_data: ApplicationUpdate):
    try:
        local_db.update_application_status(app_id, app_data.status)
        return {"success": True, "message": "Status updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{app_id}")
async def delete_application(app_id: str):
    try:
        local_db.delete_application(app_id)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
