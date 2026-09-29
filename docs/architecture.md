# AI Resume Analyzer - System Architecture

## Architecture Overview
The system employs a strict modular Monolith Service-Oriented Architecture (SOA), adhering to Separation of Concerns to isolate infrastructure logic from business rules.

### Design Paradigm: Modular Monolith
The repository consists of two highly separated monoliths:
1.  **Frontend Monolith (React):** A single static client-side bundle managed by Vite.
2.  **Backend Monolith (FastAPI):** A unified Python API holding loosely coupled domain logic routines (PDF Parsing, ATS Math Encoding, Keyword Matchers).

## File Directory Topology

### 1. Frontend (`/frontend/src`)
*   **`/api/`**: The strictly-typed data-fetching layer, keeping network calls isolated from React UI components.
*   **`/components/ui/`**: Pure UI atomic design (Buttons, Badges) decoupled from any business logic, reusable across all views.
*   **`/features/`**: Heavy composition layers combining Business State with UI Atoms (e.g. `job-match` handles only Job Description comparisons).
*   **`/types/`**: The TypeScript equivalent of the backend Pydantic models.

### 2. Backend (`/backend/app`)
*   **`/api/`**: Thin REST routers. Their absolute single duty is receiving network requests, invoking `/services`, and responding. They contain zero logic.
*   **`/schemas/`**: Pydantic models. Defines the exact structural contracts required for any data successfully entering or leaving the backend.
*   **`/services/`**: Thick stateless Python classes. They handle the algorithmic heavy lifting (PyMuPDF execution, Score calculations, String heuristics) without touching the network.
*   **`/rules/`**: Strictly isolated static arrays and dictionaries holding heuristic identifiers (e.g. valid tech stacks, ATS keyword identifiers) preventing hard-coding them into services.

## Data Flow Diagram
1. User drops PDF into `Analyzer` slice in Browser.
2. React parses binary stream and posts via `FormData` to Vercel/Render network layer.
3. FastAPI Router `analyze.py` intercepts.
4. `pdf_service.py` breaks bytes into normalized text strings.
5. Text cascades sequentially through `section_service` -> `skill_service` -> `scoring_service`.
6. Calculated schema resolves instantly back to React dashboard.
