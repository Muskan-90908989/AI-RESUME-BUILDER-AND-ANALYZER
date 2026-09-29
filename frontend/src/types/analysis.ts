export interface RoleMatch {
    role: string;
    match_percentage: number;
    matched_skills: number;
    missing_skills: string[];
}

export interface ContactInfo {
    has_email: boolean;
    has_phone: boolean;
    has_linkedin: boolean;
}

export interface LanguageAnalysis {
    action_verbs: string[];
    filler_words: string[];
}

export interface FormattingAnalysis {
    estimated_pages: number;
    is_suspiciously_short: boolean;
    is_suspiciously_long: boolean;
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
    contact_info: ContactInfo;
    language_analysis: LanguageAnalysis;
    formatting_analysis: FormattingAnalysis;
}

export interface JobMatchResponse {
    overall_match: number;
    matched_skills: string[];
    missing_skills: string[];
    partial_matches: string[];
}
