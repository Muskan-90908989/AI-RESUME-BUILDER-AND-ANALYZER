# AI Resume Analyzer - API Specification

## Protocol Principles
The system operates exclusively on Stateless REST over HTTPS. The application forces explicit structured responses utilizing strongly-typed models to enforce contract compliance between Python and React.

---

### Endpoints

#### 1. `GET /api/health`
**Purpose:** Service uptime verification and Render edge-node wake ping.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

#### 2. `POST /api/analyze`
**Purpose:** Consumes a raw PDF file and initiates the ATS evaluation pipeline.

**Request Form Data:**
* `file`: (Type: `file`) The raw binary of the uploaded PDF resume.

**Success Response (200 OK):**
```json
{
  "score": 85,
  "summary": "Full Stack Engineer...",
  "sections_found": ["Education", "Experience"],
  "skills": ["React", "Python"],
  "ats_metrics": {
    "has_contact": true,
    "has_education": true,
    "quantified_bullets": 3,
    "missing_metrics_bullets": ["Developed app features without metrics"]
  },
  "roles": ["Full-Stack Developer"],
  "recommendations": ["Quantify bullet point 1 with exact percentage metrics."]
}
```

**Error Constraints (400 / 500):**
* `400 Bad Request`: "Only PDF files are supported" if MIME type fails.
* `400 Bad Request`: "Could not extract text" if PDF is corrupted.

#### 3. `POST /api/match`
**Purpose:** Matrix overlap analysis between a resume string and a provided Job Description.

**Request Body (JSON):**
```json
{
  "resume_text": "Experienced in React and Node.js...",
  "job_description": "Looking for a React developer who knows Python..."
}
```

**Success Response (200 OK):**
```json
{
  "overall_match": 66,
  "matched_skills": ["React"],
  "missing_skills": ["Python"]
}
```
