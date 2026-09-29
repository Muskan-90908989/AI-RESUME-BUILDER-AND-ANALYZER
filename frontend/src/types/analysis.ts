export interface RoleMatch {
    role: string;
    match_percentage: number;
    matched_skills: number;
    missing_skills: string[];
}

export interface ResumeAnalysisResponse {
    raw_text: string;
    sections_found: Record<string, boolean>;
    detected_skills: string[];
    resume_score: {
        score: number;
        details: string[];
    };
    ats_score: {
        score: number;
    };
    role_suggestions: RoleMatch[];
    improvement_suggestions: string[];
    quantifying_impact_issues: string[];
}

export interface JobMatchResponse {
    overall_match: number;
    matched_skills: string[];
    missing_skills: string[];
    partial_matches: string[];
}
