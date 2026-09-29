def generate_improvement_suggestions(sections_found: dict, detected_skills: list, score: int, ats_score: int) -> list:
    """Generates actionable improvement suggestions based securely on hard deterministic flags."""
    suggestions = []
    
    if not (sections_found.get("Summary") or sections_found.get("Objective")):
        suggestions.append("Add a 2–3 line professional summary highlighting your key skills and career goal.")
        
    if not sections_found.get("Projects"):
        suggestions.append("Add 2–3 relevant academic or personal projects with technologies and measurable outcomes.")
        
    if not (sections_found.get("Experience") or sections_found.get("Work Experience") or sections_found.get("Internship")):
        suggestions.append("Include internships, freelance work, training, or relevant practical experience.")
        
    if len(detected_skills) < 5:
        suggestions.append("Expand the skills section with technologies that you genuinely know and have used.")
        
    if not sections_found.get("Certifications") and not sections_found.get("Courses"):
        suggestions.append("Consider adding relevant certifications or completed courses.")
        
    if not sections_found.get("Achievements"):
        suggestions.append("Add academic, technical, competition, certification, or extracurricular achievements where relevant.")
        
    if ats_score < 70:
        suggestions.append("Use standard section headings (like 'Experience', 'Education', 'Skills') and include relevant keywords naturally to improve ATS readability.")
        
    if len(suggestions) == 0:
        suggestions.append("Your resume structure looks solid! Continue to tailor your descriptions to match specific job descriptions strictly on quantifiable impact.")
        
    return suggestions
