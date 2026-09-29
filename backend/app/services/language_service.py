import re

STRONG_ACTION_VERBS = {
    "architected", "developed", "engineered", "implemented", "optimized", "spearheaded",
    "accelerated", "deployed", "designed", "directed", "executed", "forecasted",
    "generated", "maximized", "pioneered", "restructured", "streamlined", "transformed"
}

WEAK_FILLER_WORDS = {
    "hardworking", "passionate", "team player", "responsible for", "duties included",
    "results-driven", "self-motivated", "go-getter", "detail-oriented", "synergy",
    "think outside the box", "helped", "assisted", "worked on"
}

def analyze_language(text: str) -> dict:
    """
    Scans the corpus for strong verbs indicating leadership and engineering mastery,
    while identifying generic filler words that bloat resume quality.
    """
    text_lower = text.lower()
    
    # Tokenize loosely to avoid substrings, but keep complex phrases intact for filler checking.
    # However, since filler words have spaces ("responsible for"), simple `in` checking is safer for phrases.
    
    found_action_verbs = set()
    for verb in STRONG_ACTION_VERBS:
        if re.search(rf"\b{verb}\b", text_lower):
            found_action_verbs.add(verb.capitalize())
            
    found_filler_words = set()
    for filler in WEAK_FILLER_WORDS:
        if re.search(rf"\b{filler}\b", text_lower):
            found_filler_words.add(filler.capitalize())
            
    return {
        "action_verbs": sorted(list(found_action_verbs)),
        "filler_words": sorted(list(found_filler_words))
    }
