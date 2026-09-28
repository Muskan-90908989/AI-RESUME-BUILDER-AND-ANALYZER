import streamlit as st
import os

# Import utility functions
from utils import (
    extract_text_from_pdf, clean_text, detect_sections,
    detect_skills, calculate_resume_score, calculate_ats_score,
    suggest_job_roles, analyze_skill_gaps, generate_improvement_suggestions
)

# Page configuration
st.set_page_config(
    page_title="AI Resume Analyzer",
    page_icon="📄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load CSS
def local_css(file_name):
    if os.path.exists(file_name):
        with open(file_name) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)

local_css("style.css")

# --- Header ---
st.markdown('<h1 class="main-heading">AI Resume Analyzer</h1>', unsafe_allow_html=True)
st.markdown('<p class="subtitle">Upload → Analyze → Improve → Get Hired</p>', unsafe_allow_html=True)

st.markdown("""
<div class="feature-chips">
    <span class="chip">✓ Private Analysis</span>
    <span class="chip">✓ Instant Analysis</span>
    <span class="chip">✓ PDF Support</span>
</div>
""", unsafe_allow_html=True)

# --- Sidebar ---
with st.sidebar:
    st.markdown('<h2 class="sidebar-title">Resume Glow-Up<br>Smart, Private & Secure</h2>', unsafe_allow_html=True)
    
    st.markdown("### What you get:")
    st.markdown("✓ Resume Score")
    st.markdown("✓ ATS-Style Score")
    st.markdown("✓ Skill Detection")
    st.markdown("✓ Skill Gap Analysis")
    st.markdown("✓ Job Role Suggestions")
    st.markdown("✓ Actionable Improvements")
    
    st.markdown("""
    <div class="privacy-notice">
        <b>Privacy First:</b> Your resume is analyzed locally inside the application. No external AI API or third-party resume service is required.
    </div>
    """, unsafe_allow_html=True)


# --- Main File Uploader ---
st.write("### Upload your resume PDF")
uploaded_file = st.file_uploader("Choose a PDF file", type=["pdf"])

if uploaded_file is not None:
    with st.spinner("Analyzing your resume locally..."):
        raw_text = extract_text_from_pdf(uploaded_file)
        
        if not raw_text:
            st.error("Unable to extract readable text from this PDF. Please upload a text-based PDF resume (scanned or image-only PDFs are not supported).")
        else:
            text = clean_text(raw_text)
            
            if len(text.split()) < 20:
                st.warning("The extracted text is very short. Analysis might be inaccurate.")
                
            # Perform Analysis
            sections = detect_sections(text)
            skills = detect_skills(text)
            resume_assessment = calculate_resume_score(text, sections, skills)
            ats_assessment = calculate_ats_score(text, sections, skills)
            roles = suggest_job_roles(skills)
            improvements = generate_improvement_suggestions(sections, skills, resume_assessment["score"], ats_assessment["score"])
            
            st.success("Analysis Complete!")
            
            # --- Results Presentation ---
            
            # Scores
            col1, col2 = st.columns(2)
            
            with col1:
                score_val = resume_assessment["score"]
                color_class = "good" if score_val >= 75 else ("average" if score_val >= 50 else "poor")
                st.markdown(f"""
                <div class="score-card">
                    <h3>Resume Score</h3>
                    <div class="score-value {color_class}">{score_val}/100</div>
                    <p>General heuristic based on sections and length.</p>
                </div>
                """, unsafe_allow_html=True)

            with col2:
                ats_val = ats_assessment["score"]
                color_class = "good" if ats_val >= 75 else ("average" if ats_val >= 50 else "poor")
                st.markdown(f"""
                <div class="score-card">
                    <h3>ATS-Style Score</h3>
                    <div class="score-value {color_class}">{ats_val}/100</div>
                    <p>Estimate for readability and keyword coverage.</p>
                </div>
                """, unsafe_allow_html=True)
                
            st.info("Note: ATS-style score is a heuristic estimate for readability and keyword coverage. It does not represent the behaviour of any specific commercial ATS.")

            # Detected Skills
            st.markdown('<div class="section-head">Detected Skills</div>', unsafe_allow_html=True)
            if skills:
                badges_html = "".join([f'<span class="skill-badge">{skill}</span>' for skill in skills])
                st.markdown(f"<div>{badges_html}</div>", unsafe_allow_html=True)
            else:
                st.write("No standard skills detected based on the internal dictionary.")

            # Suggested Job Roles & Skill Gaps
            st.markdown('<div class="section-head">Suggested Job Roles</div>', unsafe_allow_html=True)
            
            if roles:
                # Top 3 suggested roles
                for role_data in roles[:3]:
                    role_name = role_data["role"]
                    match_pct = role_data["match_percentage"]
                    
                    st.markdown(f"""
                    <div class="role-card">
                        <div class="role-title">{role_name}</div>
                        <div class="role-match">Match: {match_pct}%</div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    missing = role_data["missing_skills"]
                    if missing:
                        gap_html = "".join([f'<span class="gap-badge">{m}</span>' for m in missing])
                        st.markdown(f"**Skill Gaps for {role_name}:** {gap_html}", unsafe_allow_html=True)
                    else:
                        st.markdown(f"**Skill Gaps for {role_name}:** None! Perfect match on keywords.", unsafe_allow_html=True)
            else:
                st.write("Not enough skills detected to confidently suggest a job role.")
                
            # Improvements
            st.markdown('<div class="section-head">Actionable Improvements</div>', unsafe_allow_html=True)
            for imp in improvements:
                st.markdown(f'<div class="improvement-item">💡 {imp}</div>', unsafe_allow_html=True)
