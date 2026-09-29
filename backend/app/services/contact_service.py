import re

def detect_contact_info(text: str) -> dict:
    """
    Detects if common contact elements exist in the resume text using strict regexes.
    """
    # Exclude image/scanned by default
    if not text.strip():
        return {"has_email": False, "has_phone": False, "has_linkedin": False}

    # Email pattern
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text))
    
    # Phone number pattern - flexible for international or local formats e.g. +91 999 999 9999 or (555) 555-5555
    has_phone = bool(re.search(r'(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}', text))
    
    # LinkedIn URL or handle pattern
    has_linkedin = bool(re.search(r'(linkedin\.com/in/|linkedin:\s)', text, re.IGNORECASE))
    
    return {
        "has_email": has_email,
        "has_phone": has_phone,
        "has_linkedin": has_linkedin
    }
