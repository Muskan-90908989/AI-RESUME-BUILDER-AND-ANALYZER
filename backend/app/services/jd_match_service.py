from app.services.text_service import clean_text
from app.services.skill_service import detect_skills

def match_jd_to_resume(resume_text: str, jd_text: str) -> dict:
    """Computes a deterministic overlap matrix between user resume text and a Job Description text."""
    
    # 1. Clean both text bodies
    clean_resume = clean_text(resume_text)
    clean_jd = clean_text(jd_text)
    
    # 2. Extract standard taxonomy skills from BOTH using the existing heuristic engine
    resume_skills = set(detect_skills(clean_resume))
    jd_skills = set(detect_skills(clean_jd))
    
    # 3. Simple token extraction fallback for JD
    # If the JD specifies things that aren't in our exact SKILL_CATEGORIES map, 
    # we can try to find overlapping long words
    resume_tokens = set([w.lower() for w in clean_resume.split() if len(w) > 4])
    jd_tokens = set([w.lower() for w in clean_jd.split() if len(w) > 4])
    
    # But for a clear UI, let's prioritize standard taxonomy overlaps:
    matched = list(jd_skills.intersection(resume_skills))
    missing = list(jd_skills - resume_skills)
    
    # Partial Matches: Non-taxonomy words found in both that look like domain jargon
    # e.g., 'optimization', 'containerization'
    domain_jargon = {"optimization", "containerization", "microservices", "agile", "leadership", "mentoring", "visualization"}
    partial = list(domain_jargon.intersection(jd_tokens).intersection(resume_tokens))
    
    # Calculate a simple transparent Match % based primarily on identified Core Skills
    if len(jd_skills) > 0:
        match_perc = int((len(matched) / len(jd_skills)) * 100)
    else:
        # If JD has no recognized tech skills, fallback to word overlap
        overlap = jd_tokens.intersection(resume_tokens)
        if len(jd_tokens) > 0:
            match_perc = min(100, int((len(overlap) / len(jd_tokens)) * 200)) # Bonus modifier for raw heuristic
        else:
            match_perc = 0
            
    return {
        "overall_match": min(100, max(0, match_perc)),
        "matched_skills": sorted(matched),
        "missing_skills": sorted(missing),
        "partial_matches": sorted(partial)
    }
