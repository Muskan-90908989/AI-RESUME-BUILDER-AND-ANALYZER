import math
from collections import Counter
from app.services.text_service import clean_text
from app.services.skill_service import detect_skills

def compute_tf_idf(text1: str, text2: str) -> float:
    """Computes a baseline Term Frequency - Inverse Document Frequency style cosine similarity."""
    tokens1 = text1.split()
    tokens2 = text2.split()
    
    tf1 = Counter(tokens1)
    tf2 = Counter(tokens2)
    
    common_terms = set(tokens1).intersection(set(tokens2))
    dot = sum(tf1[term] * tf2[term] for term in common_terms)
    
    mag1 = math.sqrt(sum(v**2 for v in tf1.values()))
    mag2 = math.sqrt(sum(v**2 for v in tf2.values()))
    
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return min(1.0, dot / (mag1 * mag2))

def match_jd_to_resume(resume_text: str, jd_text: str) -> dict:
    """
    Hybrid multi-level matching engine.
    Level 1 & 2: Exact canonical + alias skills (via taxonomy extraction)
    Level 4 & 5: TF-IDF similarity for broader vocabulary coverage.
    """
    clean_resume = clean_text(resume_text)
    clean_jd = clean_text(jd_text)
    
    # 1. Structured Taxonomy Evidence
    resume_skill_dicts = detect_skills(clean_resume)
    jd_skill_dicts = detect_skills(clean_jd)
    
    resume_skill_names = {x["skill"] for x in resume_skill_dicts}
    jd_skill_names = {x["skill"] for x in jd_skill_dicts}
    
    matched = sorted(list(jd_skill_names.intersection(resume_skill_names)))
    missing = sorted(list(jd_skill_names - resume_skill_names))
    
    # 2. Text Similarity (TF-IDF / Cosine approximation)
    text_similarity = compute_tf_idf(clean_resume, clean_jd)
    
    # 3. Blended Scoring Logic
    match_perc = 0.0
    if len(jd_skill_names) > 0:
        skill_score = (len(matched) / len(jd_skill_names)) * 100
        # Hybrid formula: 70% taxonomy, 30% un-structured NLP vector
        match_perc = (skill_score * 0.7) + ((text_similarity * 100) * 0.3)
    else:
        # Fallback to pure NLP
        match_perc = text_similarity * 100
        
    return {
        "overall_match": int(min(100, max(0, match_perc))),
        "matched_skills": matched,
        "missing_skills": missing,
        "partial_matches": [] # Future expansion for Level 3 ontology
    }
