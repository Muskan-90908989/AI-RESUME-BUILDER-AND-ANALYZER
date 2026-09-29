from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from api.schemas.analysis import ResumeAnalysisResponse
import traceback

from api.services.pdf_service import extract_text_from_pdf
from api.services.text_service import clean_text
from api.services.section_service import detect_sections
from api.services.skill_service import detect_skills
from api.services.scoring_service import calculate_resume_score
from api.services.ats_service import calculate_ats_score
from api.services.role_service import suggest_job_roles
from api.services.recommendation_service import generate_improvement_suggestions
from api.services.bullet_service import analyze_quantified_impact
from api.services.jd_match_service import match_jd_to_resume
from api.schemas.analysis import JobMatchRequest, JobMatchResponse

router = APIRouter()

@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    # Phase 10: Strict MIME or Magic Number validation can go here. For now, rely on extension.
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid MIME type. Document must be PDF.")
        
    try:
        raw_text = extract_text_from_pdf(file.file)
        if not raw_text or len(raw_text) < 50:
            return JSONResponse(status_code=400, content={
                "error": {
                    "code": "PDF_TEXT_EXTRACTION_FAILED",
                    "message": "Unable to extract readable text from this PDF.",
                    "details": "The PDF may be scanned or image-only."
                }
            })
            
        cleaned_text = clean_text(raw_text)
        sections_found = detect_sections(cleaned_text)
        detected_skills = detect_skills(cleaned_text)
        resume_score = calculate_resume_score(cleaned_text, sections_found, detected_skills)
        ats_score = calculate_ats_score(cleaned_text, sections_found, detected_skills)
        role_suggestions = suggest_job_roles(detected_skills)
        suggestions = generate_improvement_suggestions(sections_found, detected_skills, resume_score["score"], ats_score["score"])
        unquantified_bullets = analyze_quantified_impact(raw_text)

        return ResumeAnalysisResponse(
            raw_text=cleaned_text,
            sections_found=sections_found,
            detected_skills=detected_skills,
            resume_score=resume_score,
            ats_score=ats_score,
            role_suggestions=role_suggestions,
            improvement_suggestions=suggestions,
            quantifying_impact_issues=unquantified_bullets
        )
        
    except Exception as e:
        # Proper structured backend exception handling as requested in phase 3/10
        print(f"Server Error during parsing: {e}")
        return JSONResponse(status_code=500, content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred during resume analysis.",
                "details": str(e)
            }
        })

@router.post("/match", response_model=JobMatchResponse)
async def match_job_description(match_req: JobMatchRequest):
    try:
        return match_jd_to_resume(match_req.resume_text, match_req.job_description)
    except Exception as e:
        print(f"Error during JD Match: {e}")
        return JSONResponse(status_code=500, content={"error": "Failed to analyze Job Matching overlap matrix."})
