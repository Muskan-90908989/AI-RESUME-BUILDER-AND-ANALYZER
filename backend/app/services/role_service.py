from app.rules.roles import ROLE_SKILL_MAPPINGS

def suggest_job_roles(detected_skills: list) -> list:
    """Suggests roles based on matching detected skills with predefined mappings."""
    # Handle dict objects (SkillEvidence) instead of bare strings
    detected_skills_lower = [s["skill"].lower() if isinstance(s, dict) else (s.skill.lower() if hasattr(s, "skill") else str(s).lower()) for s in detected_skills]
    
    role_matches = []
    
    for role, required_skills in ROLE_SKILL_MAPPINGS.items():
        matched = 0
        total_required = len(required_skills)
        missing = []
        
        for req in required_skills:
            if req.lower() in detected_skills_lower:
                matched += 1
            else:
                missing.append(req)
                
        match_percentage = int((matched / total_required) * 100) if total_required > 0 else 0
        if match_percentage > 0:
            role_matches.append({
                "role": role,
                "match_percentage": match_percentage,
                "matched_skills": matched,
                "missing_skills": missing
            })
            
    # Sort by match percentage descending
    role_matches.sort(key=lambda x: x['match_percentage'], reverse=True)
    return role_matches

def analyze_skill_gaps(detected_skills: list, role: str) -> list:
    """Returns missing skills for a specific role."""
    if role not in ROLE_SKILL_MAPPINGS:
        return []
        
    # Handle dict objects (SkillEvidence) instead of bare strings
    detected_lower = [s["skill"].lower() if isinstance(s, dict) else (s.skill.lower() if hasattr(s, "skill") else str(s).lower()) for s in detected_skills]
    missing = [req for req in ROLE_SKILL_MAPPINGS[role] if req.lower() not in detected_lower]
    return missing
