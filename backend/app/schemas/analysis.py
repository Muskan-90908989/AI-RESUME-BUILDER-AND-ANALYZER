from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional

class ParserMetadata(BaseModel):
    page_count: int
    character_count: int
    word_count: int
    extractability: int
    parser_warnings: List[str]

class SectionData(BaseModel):
    source_heading: str
    confidence: str
    line_num: int

class SkillEvidence(BaseModel):
    skill: str
    category: str
    evidence: str

class ScoreDetails(BaseModel):
    score: int
    rules_version: str
    details: List[str]

class ATSScoreDetails(BaseModel):
    score: int
    rules_version: str

class RoleMatch(BaseModel):
    role: str
    match_percentage: int
    matched_skills: int
    missing_skills: List[str]

class ContactInfo(BaseModel):
    has_email: bool
    has_phone: bool
    has_linkedin: bool

class LanguageAnalysis(BaseModel):
    action_verbs: List[str]
    filler_words: List[str]

class FormattingAnalysis(BaseModel):
    estimated_pages: float
    is_suspiciously_short: bool
    is_suspiciously_long: bool

class ResumeAnalysisResponse(BaseModel):
    raw_text: str
    parser_metadata: ParserMetadata
    sections_found: Dict[str, Optional[SectionData]]
    detected_skills: List[SkillEvidence]
    resume_score: ScoreDetails
    ats_score: ATSScoreDetails
    role_suggestions: List[RoleMatch]
    improvement_suggestions: List[str]
    quantifying_impact_issues: List[str]
    contact_info: ContactInfo
    language_analysis: LanguageAnalysis
    formatting_analysis: FormattingAnalysis

class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str

class JobMatchResponse(BaseModel):
    overall_match: int
    matched_skills: List[str]
    missing_skills: List[str]
    partial_matches: List[str]
