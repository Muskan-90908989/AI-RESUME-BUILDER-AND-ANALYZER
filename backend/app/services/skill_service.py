import re
from typing import List, Dict, Any
from app.rules.skills import SKILL_CATEGORIES

def get_skill_evidence(skill: str, text: str) -> str:
    """Extracts the sentence containing the skill to serve as impact evidence."""
    sentences = re.split(r'(?<=[.!?\n])\s+', text)
    skill_lower = skill.lower()
    for sentence in sentences:
        if re.search(r'\b' + re.escape(skill_lower) + r'\b', sentence.lower()):
            clean = sentence.replace('\n', ' ').strip()
            # truncate excessively long sentences
            if len(clean) > 200:
                clean = clean[:197] + "..."
            return clean
    return "Mentioned."

def detect_skills(text: str) -> List[Dict[str, Any]]:
    """Detects skills across multiple categories and returns evidence."""
    detected = []
    seen = set()
    text_lower = text.lower()
    
    for category, skills in SKILL_CATEGORIES.items():
        for skill in skills:
            if skill in seen:
                continue
                
            # Special case for C and C++
            if skill.lower() == 'c':
                pattern = r'\bc\b(?![-+])'
            elif skill.lower() == 'c++':
                pattern = r'\bc\+\+\b'
            else:
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                
            if re.search(pattern, text_lower):
                evidence = get_skill_evidence(skill, text)
                detected.append({
                    "skill": skill,
                    "category": category,
                    "evidence": evidence
                })
                seen.add(skill)
                
    return sorted(detected, key=lambda x: x["skill"])
