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

export interface SectionData {
    source_heading: string;
    confidence: string;
    line_num: number;
}

export interface SkillEvidence {
    skill: string;
    category: string;
    evidence: string;
}

export interface ResumeAnalysisResponse {
    raw_text: string;
    sections_found: Record<string, SectionData | null>;
    detected_skills: SkillEvidence[];
    resume_score: {
        score: number;
        rules_version: string;
        details: string[];
    };
    ats_score: {
        score: number;
        rules_version: string;
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
