def calculate_ats_score(text: str, sections_found: dict, detected_skills: list) -> dict:
    """Heuristic for ATS-style readability (standard headers, text extractability)."""
    score = 100
    
    # If standard headers are missing, penalty
    standard_headers = ["Contact", "Education", "Skills", "Experience"]
    missing_headers = [h for h in standard_headers if not sections_found.get(h) and not sections_found.get(h.replace("Experience", "Work Experience")) and not sections_found.get(h.replace("Skills", "Technical Skills"))]
    
    penalty_per_header = 10
    score -= len(missing_headers) * penalty_per_header
    
    # Keyword density heuristics
    if len(detected_skills) < 3:
        score -= 15
        
    # Formatting heuristics: too many weird characters or very short
    word_count = len(text.split())
    if word_count < 100:
        score -= 20
        
    return {"score": max(min(score, 100), 0)}
