import fitz  # PyMuPDF
import re
import string

# Curated definitions
SKILL_CATEGORIES = {
    "Programming": ["Python", "Java", "C", "C++", "JavaScript", "SQL", "Go", "Ruby", "PHP", "Swift", "Kotlin"],
    "Web": ["HTML", "CSS", "React", "Node.js", "Django", "Flask", "Vue", "Angular", "Express"],
    "Data/AI": ["Machine Learning", "Deep Learning", "NLP", "Pandas", "NumPy", "TensorFlow", "PyTorch", "OpenCV", "Scikit-Learn"],
    "Tools": ["Git", "GitHub", "VS Code", "Docker", "Excel", "Power BI", "Tableau", "Jira", "Kubernetes"],
    "Cloud": ["AWS", "Azure", "Google Cloud", "GCP"],
    "Databases": ["MySQL", "PostgreSQL", "MongoDB", "SQLite", "Redis", "Oracle"],
    "Professional": ["Communication", "Leadership", "Teamwork", "Problem Solving", "Time Management", "Recruitment", "HR", "Project Management", "Agile", "Scrum"]
}

ROLE_SKILL_MAPPINGS = {
    "Software Developer": ["Python", "Java", "SQL", "Git", "Data Structures", "Algorithms", "C++"],
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git", "Vue", "Angular"],
    "Backend Developer": ["Python", "Java", "SQL", "APIs", "Git", "Node.js", "Django", "Flask", "PostgreSQL", "MongoDB"],
    "Data Analyst": ["Python", "SQL", "Excel", "Pandas", "Power BI", "Tableau", "Data Visualization"],
    "Data Scientist": ["Python", "SQL", "Pandas", "NumPy", "Machine Learning", "Statistics"],
    "ML Engineer": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL", "Git", "Deep Learning"],
    "HR Recruiter": ["Recruitment", "Communication", "Excel", "Interview Coordination", "Sourcing"],
    "Business Analyst": ["Excel", "SQL", "Power BI", "Communication", "Problem Solving", "Agile"]
}

COMMON_SECTIONS = [
    "Contact", "Summary", "Objective", "Education", "Skills", "Technical Skills",
    "Experience", "Work Experience", "Internship", "Projects", "Certifications",
    "Achievements", "Courses", "Hobbies", "Languages"
]

def extract_text_from_pdf(uploaded_file) -> str:
    """Extracts text from an uploaded PDF file."""
    text = ""
    try:
        # Read the uploaded file into a PyMuPDF document
        doc = fitz.open(stream=uploaded_file.read(), filetype="pdf")
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        return ""
    
    return text.strip()

def clean_text(text: str) -> str:
    """Cleans the extracted text by removing excessive whitespace and unprintable characters."""
    # Replace newlines and tabs with spaces
    text = re.sub(r'\s+', ' ', text)
    # Remove non-ascii for easier processing (optional based on exact needs, keeping it broad here)
    text = ''.join(filter(lambda x: x in string.printable, text))
    return text.strip()

def detect_sections(text: str) -> dict:
    """Detects standard sections in the resume by looking for exact word matches often used as headers."""
    sections_found = {section: False for section in COMMON_SECTIONS}
    text_lower = text.lower()
    
    for section in COMMON_SECTIONS:
        # Check if the section name appears standalone or at start of line
        pattern = r'\b' + re.escape(section.lower()) + r'\b'
        if re.search(pattern, text_lower):
            sections_found[section] = True
            
    # Some heuristics for 'Contact' which might not be explicitly named
    if not sections_found["Contact"]:
        if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text_lower) or re.search(r'\b\d{10}\b', text_lower):
            sections_found["Contact"] = True

    return sections_found

def detect_skills(text: str) -> list:
    """Detects skills across multiple categories using safe word boundary matching."""
    detected = set()
    text_lower = text.lower()
    
    for category, skills in SKILL_CATEGORIES.items():
        for skill in skills:
            # Special case for C and C++ to avoid matching words containing c
            if skill.lower() == 'c':
                pattern = r'\bc\b(?![-+])'
            elif skill.lower() == 'c++':
                pattern = r'\bc\+\+\b'
            else:
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                
            if re.search(pattern, text_lower):
                detected.add(skill)
                
    return sorted(list(detected))

def calculate_resume_score(text: str, sections_found: dict, detected_skills: list) -> dict:
    """Heuristic scoring based on presence of key sections, text volume, and skill counts."""
    score = 0
    details = []
    
    # 1. Contact Info (15 points)
    if sections_found["Contact"]:
        score += 15
        details.append("Contact Information: Found (+15)")
    else:
        details.append("Contact Information: Missing (0/15)")

    # 2. Objective/Summary (10 points)
    if sections_found["Summary"] or sections_found["Objective"]:
        score += 10
        details.append("Summary/Objective: Found (+10)")
    else:
        details.append("Summary/Objective: Missing (0/10)")
        
    # 3. Education (15 points)
    if sections_found["Education"]:
        score += 15
        details.append("Education: Found (+15)")
    else:
        details.append("Education: Missing (0/15)")
        
    # 4. Experience/Internship (15 points)
    if sections_found["Experience"] or sections_found["Work Experience"] or sections_found["Internship"]:
        score += 15
        details.append("Experience/Internship: Found (+15)")
    else:
        details.append("Experience/Internship: Missing (0/15)")

    # 5. Projects (10 points)
    if sections_found["Projects"]:
        score += 10
        details.append("Projects: Found (+10)")
    else:
        details.append("Projects: Missing (0/10)")
        
    # 6. Skills Section Existence (10 points)
    if sections_found["Skills"] or sections_found["Technical Skills"]:
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

def calculate_ats_score(text: str, sections_found: dict, detected_skills: list) -> dict:
    """Heuristic for ATS-style readability (standard headers, text extractability)."""
    score = 100
    
    # If standard headers are missing, penalty
    standard_headers = ["Contact", "Education", "Skills", "Experience"]
    missing_headers = [h for h in standard_headers if not sections_found[h] and not sections_found.get(h.replace("Experience", "Work Experience")) and not sections_found.get(h.replace("Skills", "Technical Skills"))]
    
    penalty_per_header = 10
    score -= len(missing_headers) * penalty_per_header
    
    # Keyword density heuristics (simple approach: does it have some skills?)
    if len(detected_skills) < 3:
        score -= 15
        
    # Formatting heuristics: too many weird characters or very short
    word_count = len(text.split())
    if word_count < 100:
        score -= 20
        
    return {"score": max(min(score, 100), 0)}

def suggest_job_roles(detected_skills: list) -> list:
    """Suggests roles based on matching detected skills with predefined mappings."""
    detected_skills_lower = [s.lower() for s in detected_skills]
    
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
        
    detected_lower = [s.lower() for s in detected_skills]
    missing = [req for req in ROLE_SKILL_MAPPINGS[role] if req.lower() not in detected_lower]
    return missing

def generate_improvement_suggestions(sections_found: dict, detected_skills: list, score: int, ats_score: int) -> list:
    """Generates actionable suggestions."""
    suggestions = []
    
    if not (sections_found["Summary"] or sections_found["Objective"]):
        suggestions.append("Add a 2–3 line professional summary highlighting your key skills and career goal.")
        
    if not sections_found["Projects"]:
        suggestions.append("Add 2–3 relevant academic or personal projects with technologies and measurable outcomes.")
        
    if not (sections_found["Experience"] or sections_found["Work Experience"] or sections_found["Internship"]):
        suggestions.append("Include internships, freelance work, training, or relevant practical experience.")
        
    if len(detected_skills) < 5:
        suggestions.append("Expand the skills section with technologies that you genuinely know and have used.")
        
    if not sections_found["Certifications"] and not sections_found["Courses"]:
        suggestions.append("Consider adding relevant certifications or completed courses.")
        
    if not sections_found["Achievements"]:
        suggestions.append("Add academic, technical, competition, certification, or extracurricular achievements where relevant.")
        
    if ats_score < 70:
        suggestions.append("Use standard section headings (like 'Experience', 'Education', 'Skills') and include relevant keywords naturally to improve ATS readability.")
        
    if len(suggestions) == 0:
        suggestions.append("Your resume structure looks solid! Continue to tailor your descriptions to match specific job descriptions strictly on quantifiable impact.")
        
    return suggestions

def analyze_quantified_impact(text: str) -> list:
    """Finds bullet points in the resume that lack numbers/percentages."""
    unquantified = []
    bullet_patterns = ['•', '-', '*', '·', '▪', '»']
    
    # Split text into lines, handling possible wrapping loosely
    lines = text.split('\n')
    for line in lines:
        line_clean = line.strip()
        is_bullet = any(line_clean.startswith(c) for c in bullet_patterns)
        
        if is_bullet:
            words = line_clean.split()
            # Must be a reasonable length sentence to evaluate
            if len(words) > 5 and len(words) < 50:
                # Check for digits
                if not re.search(r'\d', line_clean):
                    # Strip the bullet character for cleaner UI
                    content = line_clean
                    for c in bullet_patterns:
                        if content.startswith(c):
                            content = content[1:].strip()
                            break
                    unquantified.append(content)
                    
    # Return at most 4 examples to avoid UI clutter
    return unquantified[:4]

