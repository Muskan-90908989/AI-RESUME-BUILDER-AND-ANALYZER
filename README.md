# AI Resume Analyzer

**Tagline:** Upload → Analyze → Improve → Get Hired

## Overview
AI Resume Analyzer is a privacy-first local web application designed to help job seekers evaluate and improve their resumes. It accepts a PDF resume and provides comprehensive feedback including a resume score, an ATS-style compatibility score, detected skills, skill gaps, suggested job roles, and actionable improvement suggestions. All resume analysis occurs locally without sending data to external APIs, ensuring complete user privacy.

This project is developed as part of Project-I, an individual academic project by:
- **Student Name:** Muskan Kumari
- **Roll Number:** 23EJICS097

## Features
- **Private Analysis:** Complete analysis occurs locally on your machine.
- **Resume Score:** Evaluate the overall strength of your resume based on section completeness and text heuristics.
- **ATS-Style Score:** Estimate readability and keyword compatibility for typical Applicant Tracking Systems (ATS).
- **Skill Detection:** Automatically extract programming, web, data, cloud, database, and professional skills.
- **Skill Gap Analysis:** Discover what skills you might be missing for specific tech roles like Frontend Developer, Software Developer, or Data Analyst.
- **Job Role Suggestions:** Get job role recommendations based on your detected skills.
- **Actionable Improvements:** Rule-based, actionable suggestions tailored to your resume's current state.

## Technology Stack
- **Python 3:** Core programming language.
- **Streamlit:** Framework for building the interactive web application UI.
- **PyMuPDF (fitz):** High-performance local library for extracting text from PDF files.
- **HTML/CSS:** Custom UI styling implemented via Streamlit's Markdown and custom CSS injection. 

*No external AI API (OpenAI, Gemini), database, or authentication system is required to run this application.*

## Project Architecture
The project follows a clean, modular structure:
```text
AI-Resume-Analyzer/
├── app.py              # Main Streamlit application and UI logic.
├── utils.py            # Core analytics, text extraction, scoring, and skill detection logic.
├── style.css           # Custom CSS for the user interface.
├── requirements.txt    # Python dependencies.
├── packages.txt        # System-level dependencies.
├── README.md           # Project documentation.
└── .streamlit/
    └── config.toml     # Streamlit theme and UI configurations.
```

## Installation

Follow these steps to set up the project locally:

1. **Clone or Download the Repository**
2. **Create a Virtual Environment:**
   Run the following command in your terminal/command prompt:
   ```bash
   python -m venv venv
   ```
3. **Activate the Virtual Environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
4. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Usage
1. Make sure your virtual environment is activated.
2. Run the application:
   ```bash
   streamlit run app.py
   ```
3. The application will start locally in your web browser (usually at `http://localhost:8501`).
4. Upload your PDF resume, and view the instant analysis.

## Privacy
A major feature of this project is privacy. The application strictly operates locally inside the active Streamlit session. It **does not upload your resume to any external server**, call any external Generative AI API (like OpenAI or Gemini), store your resume in a database, or require user login. Once you close the application, all processed data is completely erased.

## Limitations
- **PDF Format Only:** Currently, the application only supports text-based PDF files. Word documents (DOCX) are not supported.
- **Scanned PDFs:** Image-only or scanned PDFs cannot be read successfully as Optical Character Recognition (OCR) is not implemented.
- **Dictionary-Based Detection:** Skill detection relies on predefined dictionary matching, which may occasionally miss very uncommon skills or variations.
- **Heuristic Scoring:** The Resume and ATS scores are heuristic-based guidelines, not predictions of any actual commercial Applicant Tracking System.

## Future Scope
- **Job Description Matching:** Allowing users to paste a job description and directly compare their resume dynamically.
- **DOCX Support:** Native support for Microsoft Word documents.
- **OCR Integration:** Extracting text from imaged/scanned PDFs using tools like Tesseract.
- **NLP/Embeddings:** Advancing the skill extraction from exact match to semantic extraction using local NLP models (e.g. spaCy).
- **Downloadable Reports:** Generating comprehensive, downloadable PDF analysis reports.
- **Larger Skill Taxonomy:** Expanding the skill dictionaries dynamically or storing them in a local lightweight structured formats (e.g., SQLite/JSON).
