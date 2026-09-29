import pytest
from app.services.jd_match_service import match_jd_to_resume

def test_jd_match_identical():
    resume = "I am a Data Scientist. I know Python, Machine Learning, and SQL."
    jd = "Looking for a Data Scientist expert in Python, SQL, and Machine Learning."
    result = match_jd_to_resume(resume, jd)
    
    # We expect 3 distinct skills to match cleanly
    assert "Python" in result["matched_skills"]
    assert "SQL" in result["matched_skills"]
    assert "Machine Learning" in result["matched_skills"]
    assert len(result["missing_skills"]) == 0
    assert result["overall_match"] == 100

def test_jd_match_missing():
    resume = "I am a Frontend Developer. I write HTML and CSS."
    jd = "Need a Frontend Developer with HTML, CSS, React, and Node.js."
    result = match_jd_to_resume(resume, jd)
    
    assert "React" in result["missing_skills"]
    assert "Node.js" in result["missing_skills"]
    assert "HTML" in result["matched_skills"]
    
    # 2 matched out of 4 expected = 50%
    assert result["overall_match"] == 50
