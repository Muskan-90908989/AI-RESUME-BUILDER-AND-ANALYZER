from pydantic import BaseModel
from typing import List

class CareerGapRequest(BaseModel):
    target_role: str
    current_skills: List[str]
    
class CareerGapResponse(BaseModel):
    target_role: str
    current_skills: List[str]
    required_skills: List[str]
    priority_gaps: List[str]
    next_steps: List[str]
