import re
from api.rules.skills import SKILL_CATEGORIES

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
