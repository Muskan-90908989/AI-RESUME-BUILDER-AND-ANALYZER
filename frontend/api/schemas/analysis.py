from pydantic import BaseModel, Field
from typing import Dict, List, Any

class ScoreDetails(BaseModel):
    score: int
    details: List[str]

class ATSScoreDetails(BaseModel):
    score: int

class RoleMatch(BaseModel):
    role: str
    match_percentage: int
    matched_skills: int
    missing_skills: List[str]

class ResumeAnalysisResponse(BaseModel):
    raw_text: str
    sections_found: Dict[str, bool]
    detected_skills: List[str]
    resume_score: ScoreDetails
    ats_score: ATSScoreDetails
    role_suggestions: List[RoleMatch]
    improvement_suggestions: List[str]
    quantifying_impact_issues: List[str]

class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str

class JobMatchResponse(BaseModel):
    overall_match: int
    matched_skills: List[str]
    missing_skills: List[str]
    partial_matches: List[str]
