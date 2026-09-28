from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
from utils import (
    clean_text, detect_sections, detect_skills,
    calculate_resume_score, calculate_ats_score,
    suggest_job_roles, generate_improvement_suggestions,
    analyze_quantified_impact
)

app = FastAPI(title="AI Resume Analyzer API")

# Configure CORS for React frontend (default Vite port 5173 + generic wildcards for dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/", methods=["GET", "HEAD"])
async def root():
    return {"status": "ok", "message": "AI Resume Analyzer Backend is running."}

def extract_text_from_bytes(file_bytes: bytes) -> str:
    text = ""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        return ""
    return text.strip()

@app.post("/api/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        content = await file.read()
        raw_text = extract_text_from_bytes(content)
        
        if len(raw_text) == 0:
            raise HTTPException(status_code=400, detail="Cannot extract readable text. Image-only/scanned PDFs are not supported.")
            
        text = clean_text(raw_text)
        
        sections = detect_sections(text)
        skills = detect_skills(text)
        resume_assessment = calculate_resume_score(text, sections, skills)
        ats_assessment = calculate_ats_score(text, sections, skills)
        roles = suggest_job_roles(skills)
        improvements = generate_improvement_suggestions(sections, skills, resume_assessment["score"], ats_assessment["score"])
        
        unquantified_bullets = analyze_quantified_impact(raw_text)
        
        return {
            "success": True,
            "resume_score": resume_assessment,
            "ats_score": ats_assessment,
            "detected_skills": skills,
            "roles": roles,
            "improvements": improvements,
            "unquantified_bullets": unquantified_bullets,
            "word_count": len(text.split())
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during analysis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
