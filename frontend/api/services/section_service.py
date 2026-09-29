import re
from api.rules.keywords import COMMON_SECTIONS

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
