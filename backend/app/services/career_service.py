def analyze_career_gap(target_role: str, current_skills: list) -> dict:
    # A heuristic lookup based on target_role against standard ontologies
    # Real-world scale would query ESCO or O*NET DB mapped locally
    role_map = {
        "frontend developer": ["React", "TypeScript", "HTML", "CSS", "Next.js", "State Management", "Testing (Jest/Vitest)"],
        "frontend engineer": ["React", "TypeScript", "HTML", "CSS", "Next.js", "State Management", "Testing (Jest/Vitest)"],
        "backend developer": ["Python", "FastAPI", "SQL", "Docker", "AWS", "System Design", "Redis", "REST APIs"],
        "backend engineer": ["Python", "FastAPI", "SQL", "Docker", "AWS", "System Design", "Redis", "REST APIs"],
        "data scientist": ["Python", "Pandas", "Machine Learning", "SQL", "Statistics", "Data Visualization", "Jupyter"],
        "software engineer": ["Data Structures", "Algorithms", "System Design", "Git", "Testing", "CI/CD", "Databases"]
    }
    
    target = target_role.lower().strip()
    required = role_map.get(target, ["Communication", "Problem Solving", "Domain Knowledge", "Technical Writing", "Git"])
    
    current_lower = {s.lower() for s in current_skills}
    
    # Priority gaps are skills in required that aren't in current
    missing = []
    for req in required:
        # Simple cross-check (exact substring match for robustness)
        found = False
        for c in current_lower:
            if req.lower() in c or c in req.lower():
                found = True
                break
        if not found:
            missing.append(req)
    
    steps = [f"Learn and build a verifiable project using {skill}" for skill in missing[:3]]
    if not steps:
        steps = ["You have strong evidence for all the core skills for this role! Focus on advanced system design and impact storytelling."]
        
    return {
        "target_role": target_role,
        "current_skills": current_skills,
        "required_skills": required,
        "priority_gaps": missing,
        "next_steps": steps
    }
