def analyze_formatting(text: str) -> dict:
    """
    Estimates layout density. A standard 1-page resume contains roughly 2000-3500 characters.
    Extremely short or incredibly massive text chunks trigger red flags for ATS limits.
    """
    char_count = len(text)
    
    # Very rough estimate assuming ~2500 characters per standard dense page.
    estimated_pages = char_count / 2500.0
    
    # Flags
    # Less than 600 chars is practically empty.
    is_suspiciously_short = char_count < 600
    
    # Over 10,000 chars is roughly 4 pages, dangerously long.
    is_suspiciously_long = char_count > 10000
    
    return {
        "estimated_pages": round(estimated_pages, 1),
        "is_suspiciously_short": is_suspiciously_short,
        "is_suspiciously_long": is_suspiciously_long
    }
