# AI Resume Analyzer - Privacy & Security Model

## Core Philosophy
This application operates on a strict **Local Inference & Stateless Evaluation** philosophy. Resumes contain highly sensitive Personal Identifiable Information (PII) including physical addresses, unique phone numbers, and full names. Traditional commercial ATS scanners often ingest this data into massive persistent databases for LLM training or marketing. 
Our B.Tech AI Resume Analyzer explicitly forbids this behavior at the architectural level.

## The Data Lifecycle
1.  **Browser Transmission:** The PDF is transformed into binary streaming data and dispatched via standard `https://` secure socket to the backend. No information is stored on the local storage/cookies of the React Vercel application.
2.  **Stateless Render Memory:** The Render backend environment receives the raw byte string.
3.  **Extraction Volatility:** `PyMuPDF` instantiates a volatile Python object from the bytes entirely inside RAM. 
4.  **Instant Purge:** Upon extracting the pure text strings to construct the JSON `Pydantic` schema, the Python garbage collector reallocates the memory. The original PDF bytes and the textual representation are fundamentally destroyed the moment the HTTP Response is returned to the client.

## Security Validations
*   **MIME Validation:** The system rejects `.zip`, `.exe`, or macro-embedded `.docx` files prior to byte parsing, preventing remote code execution (RCE) on the server.
*   **No Arbitrary Generation:** Output scores and strings are strictly limited by predefined dictionaries (`skills.py`) rather than prompt-injectable Large Language Model interfaces.
*   **CORS Compliance:** Front-end access operates securely.
