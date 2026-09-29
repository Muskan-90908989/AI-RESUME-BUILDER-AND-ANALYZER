# AI Resume Analyzer - B.Tech Final Year Product Requirements Document (PRD)

**Student:** Muskan Kumari  
**Roll Number:** 23EJICS097  
**Academic Context:** B.Tech Final Year Project  

---

## 1. Reference Research Matrix

| Reference | What it does well | Relevant Technical Pattern | What we adapted | What we strictly avoided | Why it fits our B.Tech project |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Career-ops** | Emphasizes evidence over vague keywords. | Human-in-the-loop workflow; deterministic skill gaps. | The "Issue & Recommendation" system (pointing out missing numeric metrics). | Avoided the automated job-submission agent feature. | Fits our goal of "Evidence over Claims" and actionable feedback. |
| **Reactive Resume** | Feature-oriented frontend organization. | Reusable UI components; strict styling configurations. | Modular React architecture (components/ui vs features). | Avoided heavy PostgreSQL / authentication lock-in. | Models our requirement for a premium SaaS feel without database bloat. |
| **Resume Matcher** | Compares Resume vs target Job Description. | Keyword highlighting; match scoring. | Concept of the "Keyword Matrix" (Matched vs Missing). | Avoided LLM dependencies (OpenAI API). | Demonstrates deterministic, rule-based JD matching effectively. |
| **RenderCV** | Strict schema-driven validation. | Pydantic usage for resume structures. | Back-end Pydantic schemas validating all API inputs/outputs. | Avoided building a complex PDF generator. | Guarantees error-free frontend data and forces clean REST contracts. |

---

## 2. Current Architecture Audit (Pre-Refactor State)
*Before the modular rebuild, the prototype was evaluated against professional engineering standards:*
*   **Architecture:** Monolithic Python script (`utils.py`); tightly coupled React components (`App.tsx`).
*   **Code Quality:** Business logic was mixed directly with HTTP handlers and UI rendering.
*   **Security Risks:** Missing strict PDF MIME-type validation; CORS was fully open (`*`).
*   **Missing Tests:** No objective automated tests to prove the score was deterministic.
*   **Incorrect Claims:** The prototype risked being labeled "AI" without having an explainable statistical model.

---

## 3. Target Architecture
A **Modular Monolithic Service-Oriented Architecture (SOA)**, strictly separating concerns:
*   **Frontend (Vercel):** React + TypeScript + Vite. Arranged in Feature Slices (`/features/analyzer`, `/features/job-match`) using minimal CSS variables.
*   **Backend (Render):** Python + FastAPI.
    *   `/api`: Dumb REST routers (No business logic).
    *   `/schemas`: Pydantic validation models.
    *   `/services`: Thick heuristic engines (`scoring_service`, `pdf_service`).
    *   `/rules`: Hardcoded configuration taxonomies.

---

## 4. Feature Map
1.  **Privacy-First Intake:** Drag-and-drop secure PDF upload relying entirely on RAM extraction.
2.  **PyMuPDF Extractor:** High-speed binary-to-string conversion separating structural headers.
3.  **Heuristic Score Engine:** Deterministic 0-100 gauge based on Structure, Math/Metrics, and Skills.
4.  **Job Desc (JD) Matrix:** Rule-based set theory computing exact Missing/Matched skill arrays.
5.  **Evidence-Based Issue Tracker:** Highlights exactly which bullets need measurable quantification.

---

## 5. Risk Register
| Risk | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Image-Only Resumes** | High | Medium | Check PyMuPDF string length; gracefully abort and explicitly tell user to use a text-based PDF. |
| **False-Positive Skills (C, R)** | Medium | High | Implement boundary-regex matching (e.g., `\bC\b`) instead of blind substring `.includes()` matching. |
| **Memory Leaks** | High | Low | Enforce stateless API operations. PDF bytes must be garbage-collected immediately after API return. |

---

## 6. Security Checklist
- [x] Enforce standard HTTP status codes (200, 400, 500) without exposing Python stack traces.
- [x] Validate `.pdf` extension and deep MIME-type before processing.
- [x] Restrict FastAPI CORS exclusively to the production Vercel frontend domain.
- [x] Environment variable enforcement (No hardcoded URLs in `App.tsx`).
- [x] Volatile extraction (absolutely no `open(file, 'wb')` persistence workflows).

---

## 7. Testing Strategy
*   **Backend (Pytest):** Verify deterministic mathematical outcomes. (`test_identical_resumes_yield_identical_scores()`)
*   **False-Positives:** Inject text like "I went to the store" and ensure the skill "React" or "C" is NOT triggered.
*   **Frontend (TypeScript Compiler):** Enforce strict `interface` matching so UI components instantly fail compilation if a backend JSON key is renamed.

---

## 8. Implementation Phases (Roadmap)
*   **Phase 1-3:** Repository & Architecture Setup (Modular folders).
*   **Phase 4-5:** Backend Parsing & Service injection (Extraction & Skills).
*   **Phase 6-7:** Deterministic Scoring & Bullet Impact algorithms.
*   **Phase 8-9:** JD match engine & Rules optimization.
*   **Phase 10-14:** React Frontend Slicing (Premium UX, CSS Variables).
*   **Phase 15-18:** Security Hardening, Pytest, and Cloud Deployment.

---

## 9. Definition of Done
The project is officially complete when:
- [x] The system is deterministic (Score is math-based, not randomized).
- [x] Vercel Frontend and Render Backend are securely communicating natively.
- [x] Missing keywords are presented honestly ("Not detected in resume").
- [x] PDF text extraction bypasses temporary disk storage.
- [x] The final repository contains zero passwords, `.env` files, or personal resumes, heavily modularized and ready for B.Tech Viva demonstration.
