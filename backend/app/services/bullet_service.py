import re

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
