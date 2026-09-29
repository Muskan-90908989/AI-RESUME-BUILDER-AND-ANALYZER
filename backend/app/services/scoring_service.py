def calculate_resume_score(text: str, sections_found: dict, detected_skills: list) -> dict:
    """Heuristic scoring based on presence of key sections, text volume, and skill counts."""
    score = 0
    details = []
    
    # 1. Contact Info (15 points)
    if sections_found.get("Contact"):
        score += 15
        details.append("Contact Information: Found (+15)")
    else:
        details.append("Contact Information: Missing (0/15)")

    # 2. Objective/Summary (10 points)
    if sections_found.get("Summary") or sections_found.get("Objective"):
        score += 10
        details.append("Summary/Objective: Found (+10)")
    else:
        details.append("Summary/Objective: Missing (0/10)")
        
    # 3. Education (15 points)
    if sections_found.get("Education"):
        score += 15
        details.append("Education: Found (+15)")
    else:
        details.append("Education: Missing (0/15)")
        
    # 4. Experience/Internship (15 points)
    if sections_found.get("Experience") or sections_found.get("Work Experience") or sections_found.get("Internship"):
        score += 15
        details.append("Experience/Internship: Found (+15)")
    else:
        details.append("Experience/Internship: Missing (0/15)")

    # 5. Projects (10 points)
    if sections_found.get("Projects"):
        score += 10
        details.append("Projects: Found (+10)")
    else:
        details.append("Projects: Missing (0/10)")
        
    # 6. Skills Section Existence (10 points)
    if sections_found.get("Skills") or sections_found.get("Technical Skills"):
        score += 10
        details.append("Skills Section: Found (+10)")
    else:
        details.append("Skills Section: Missing (0/10)")
        
    # 7. Actual Skills Count (15 points max)
    skill_score = min(len(detected_skills) * 2, 15)
    score += skill_score
    details.append(f"Skills Count: {len(detected_skills)} skills found (+{skill_score})")
    
    # 8. Resume Length (10 points max)
    word_count = len(text.split())
    if word_count > 200:
        score += 10
        details.append("Resume Length: Good (+10)")
    elif word_count > 100:
        score += 5
        details.append("Resume Length: A bit short (+5)")
    else:
        details.append("Resume Length: Too short (0/10)")
        
    return {"score": min(score, 100), "details": details}
