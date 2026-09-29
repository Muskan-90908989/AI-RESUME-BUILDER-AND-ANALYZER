# AI Resume Analyzer - Scoring Methodology

## Core Tenet
The scoring architecture operates entirely on transparent, deterministic mathematical formulas. The score out of 100 is precisely traceable to structural markers and heuristics rather than randomized or non-interpretable AI/Machine Learning black boxes.

## Base Point Distribution (100 Points Total)

### 1. Section Density (40 Points)
The presence of standard ATS-compliant structural sections strictly bounds the overall quality of the resume. 
*   **Education:** +10 Points
*   **Experience / Work History:** +15 Points
*   **Projects:** +10 Points
*   **Skills:** +5 Points

### 2. Actionable Impact Metrics (40 Points)
Measures the density of numerical proof over qualitative boasting inside bullet points. If bullet points are detected but lack numbers relative to impact, they score a 0 in this category.
*   **Quantified Bullet Density:** Points scale linearly up to the cap based on total percentages (`%`), financial metrics (`$`), and timeline numbers identified within action-oriented bullets.

### 3. Contact & Identification (10 Points)
An immediate failure state for automated systems if omitted.
*   **Email Address:** +5 Points (Regex validated)
*   **Phone Number / LinkedIn URL:** +5 Points

### 4. Skill Density (10 Points)
*   **Taxonomy Overlap:** Grants points up to a limit if the resume intersects significantly with the known IT-industry domain roles defined in `rules/skills.py`.

## Explainability Design
The `scoring_service.py` is programmed to emit specific textual reasons for every negative mathematical modifier it applies. If the system scores an 85, the Recommendation Engine directly indexes the missing 15 points and emits actionable corrections (e.g., "Add quantified metrics to your Projects timeline") instead of arbitrary generation.
