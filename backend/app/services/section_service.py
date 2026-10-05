import re
from typing import Dict, Any, Optional

SECTION_ALIASES = {
    "Summary": ["summary", "objective", "professional summary", "career objective", "profile"],
    "Experience": ["experience", "work experience", "professional experience", "employment history", "work history", "internship", "employment"],
    "Projects": ["projects", "personal projects", "academic projects", "open source"],
    "Education": ["education", "academic background", "scholastics", "qualifications"],
    "Skills": ["skills", "technical skills", "technologies", "core competencies", "expertise", "technical proficiency"],
    "Certifications": ["certifications", "licenses"],
    "Achievements": ["achievements", "awards", "honors"],
    "Publications": ["publications", "research", "papers"],
    "Languages": ["languages"],
    "Interests": ["interests", "hobbies", "extracurricular"],
    "Contact": ["contact"]
}

def detect_sections(text: str) -> Dict[str, Optional[Dict[str, Any]]]:
    """
    Advanced Section Detection.
    Maps extracted headings to Canonical Normalized Sections using Aliases.
    """
    lines = text.split('\n')
    sections_found = {}
    
    for i, line in enumerate(lines):
        clean_line = line.strip().lower()
        if len(clean_line) > 0 and len(clean_line.split()) <= 5:
            for canonical, aliases in SECTION_ALIASES.items():
                if canonical in sections_found:
                    continue
                for alias in aliases:
                    if clean_line == alias or clean_line.startswith(alias + " "):
                        sections_found[canonical] = {
                            "source_heading": line.strip(),
                            "confidence": "HIGH" if clean_line == alias else "MEDIUM",
                            "line_num": i
                        }
                        break
                        
    # Additional heuristic for contact info
    if "Contact" not in sections_found:
        text_lower = text.lower()
        if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text_lower):
            sections_found["Contact"] = {
                "source_heading": "Inferred from Email",
                "confidence": "MEDIUM",
                "line_num": 0
            }
            
    result = {}
    for canonical in SECTION_ALIASES.keys():
        result[canonical] = sections_found.get(canonical, None)
        
    return result
