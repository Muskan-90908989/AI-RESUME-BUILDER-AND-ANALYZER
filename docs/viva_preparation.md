# AI Resume Analyzer - B.Tech Viva Preparation Guide

This guide contains strategic, rapid-fire questions covering the entire full-stack architectural design to ensure you are 100% prepared to technically defend your final year project.

## Section 1: Architecture & Project Decisions
**Q1: What is the primary architecture of your system?**
**A:** It is a Modular Monolithic Service-Oriented Architecture (SOA). We have a static React frontend bundle handling purely the UI and state, which communicates strictly via a REST API to a Python FastAPI backend that holds all algorithmic business logic.

**Q2: Why did you not use a database for this project?**
**A:** To enforce our strict "Privacy First" requirement. Resumes contain highly sensitive Personal Identifiable Information (PII). By building a completely stateless system entirely in RAM, we guarantee the user's data is permanently destroyed the second the analysis completes. It proves we are building an ethical, compliant ATS.

**Q3: How does your system score resumes? Is it machine learning?**
**A:** No, it is explicitly *not* machine learning. It is a **deterministic heuristic mathematical model**. The system searches for structural invariants (like Education headers) and quantified strings using Regex. This allows the score to be 100% explainable, traceable, and repeatable every single time.

**Q4: How did you implement Job Description (JD) matching?**
**A:** We use Rule-Based Taxonomy Overlap. The system normalizes the job description into standardized lowercase strings, runs it against our hardcoded `skills.py` dictionary, does the same for the resume, and calculates the exact set intersection to identify Missing and Matched technical requirements.

## Section 2: Frontend (React, TypeScript)
**Q5: What is Vite and why did you use it instead of Create React App?**
**A:** Vite is a radically faster, modern build tool. It uses native ES modules during development so the server starts almost instantly, and heavily optimizes the production build into standard static assets using Rollup. C.R.A. is officially deprecated and extremely slow.

**Q6: What is the benefit of TypeScript over JavaScript in your project?**
**A:** TypeScript prevents entire classes of runtime errors. Specifically, since our Python backend returns complex JSON structures matching our Pydantic schemas, we enforce those identical structures using TypeScript `interfaces` in the UI. If the backend sends missing data, the frontend compiler catches the mismatch during development instead of crashing in production.

**Q7: Explain the concept of CSS Variables (Custom Properties) you used for styling.**
**A:** CSS Variables (like `var(--color-primary)`) allow us to define our entire design system's palette and spacing exclusively at the `:root` level. If we want to change a color or implement Dark Mode later, we only change the variable value once, and the entire platform updates instantly.

## Section 3: Backend (Python & FastAPI)
**Q8: Why did you choose FastAPI over Django or Flask?**
**A:** FastAPI is asynchronously built (ASGI) and heavily leverages Python type hinting for execution speed and automatic validation. It intrinsically uses Pydantic, which validates exactly what data enters the endpoints, whereas Flask requires manual data-type checking logic which is prone to errors.

**Q9: What is Pydantic and how is it used in your project?**
**A:** Pydantic is a data validation library for Python. We created `/schemas/analysis.py` which dictates exactly what variables the API must return (e.g., `score` must be an integer between 0 and 100). If our logic outputs a string instead of an int, Pydantic halts the system and throws an explicit error before the corrupted data ever reaches the user.

**Q10: What is CORS and how did you configure it?**
**A:** Cross-Origin Resource Sharing. Because our Frontend is hosted on an entirely different server domain (Vercel) than our Backend (Render), browsers natively block requests between them for security. We implemented a `CORSMiddleware` in FastAPI to explicitly permit fetch requests originating from our frontend URL.

## Section 4: Deep Tech (PDFs & Serverless Deployment)
**Q11: How is the PDF text extraction performed?**
**A:** Via `PyMuPDF` (Fitz). It is a highly optimized C++ library with Python bindings. We deliberately avoid OCR (Optical Character Recognition) as OCR is extremely heavy and slow. If a PDF is entirely image-based, our system catches the empty string array and immediately returns a clean error to the user stating the file is unreadable for standard ATS systems.

**Q12: Where are the two applications deployed?**
**A:** The frontend is statically hosted on **Vercel**, which provides global edge-CDN caching for the React Javascript bundles. The backend API is hosted dynamically on **Render**, which provisions a Linux container specifically to run our Python Uvicorn server in real time.

**Q13: How does the application prevent XSS or RCE attacks during file upload?**
**A:** We strictly validate that the file's MIME type is `application/pdf`. Furthermore, because we do not save the file to a hard drive or execute it, the only thing the backend does is safely read raw memory bytes into text strings.

## Section 5: Project Defensibility (In case challenged by reviewer)
**Q14: Reviewer Challenge: "Why didn't you use OpenAI or an LLM to rate the resume? It would be easier/better."**
**A:** Because using an LLM destroys the fundamental goal of this project: Privacy and Determinism. Sending a user's sensitive resume to a 3rd-party API violates our privacy-first rule. Furthermore, LLMs hallucinate wildly—they will give a completely different resume score every time they run. Our deterministic math engine guarantees the same un-biased score every single run and runs instantly with zero API costs.
