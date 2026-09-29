import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ScoreGauge } from '../../components/ui/ScoreGauge';
import { ResumeAnalysisResponse } from '../../types/analysis';
import { JobMatch } from '../../features/job-match/JobMatch';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface DashboardProps {
    data: ResumeAnalysisResponse;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    return (
        <div style={{ padding: 'var(--space-32) var(--space-16)', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', marginBottom: 'var(--space-32)', letterSpacing: '-0.5px' }}>Analysis Results</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-24)', marginBottom: 'var(--space-32)' }}>
                <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ marginBottom: 'var(--space-16)' }}>Overall Resume Score</h3>
                    <ScoreGauge score={data.resume_score.score} />
                </Card>

                <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ marginBottom: 'var(--space-16)' }}>ATS Parsability</h3>
                    <ScoreGauge score={data.ats_score.score} />
                    <p style={{ fontSize: '13px', textAlign: 'center', marginTop: 'var(--space-8)' }}>Machine readability based on headings</p>
                </Card>

                <Card>
                    <h3 style={{ marginBottom: 'var(--space-16)' }}>Role Suggestions</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {data.role_suggestions.slice(0, 3).map(role => (
                            <li key={role.role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                                <span style={{ fontWeight: 500 }}>{role.role}</span>
                                <Badge variant={role.match_percentage > 70 ? 'success' : 'warning'}>{role.match_percentage}% Match</Badge>
                            </li>
                        ))}
                        {data.role_suggestions.length === 0 && <span style={{ color: 'var(--color-muted)' }}>Not enough skills detected to predict roles.</span>}
                    </ul>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-24)', marginBottom: 'var(--space-32)' }}>
                <Card>
                    <h3 style={{ marginBottom: 'var(--space-16)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle color="var(--color-warning)" size={20} />
                        Areas for Improvement
                    </h3>
                    <ul style={{ paddingLeft: 'var(--space-20)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                        {data.improvement_suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </Card>

                {data.quantifying_impact_issues.length > 0 && (
                    <Card>
                        <h3 style={{ marginBottom: 'var(--space-16)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)' }}>
                            Missing Quantifiable Impact
                        </h3>
                        <p style={{ marginBottom: 'var(--space-16)', fontSize: '14px' }}>
                            These bullets from your resume do not contain numbers or percentages. Recruiters strongly prefer measurable evidence of success.
                        </p>
                        <ul style={{ paddingLeft: 'var(--space-20)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                            {data.quantifying_impact_issues.map((bull, i) => (
                                <li key={i} style={{ color: 'var(--color-danger)' }}>"{bull}"</li>
                            ))}
                        </ul>
                    </Card>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-24)' }}>
                <Card>
                    <h3 style={{ marginBottom: 'var(--space-16)' }}>Detected Sections</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {Object.entries(data.sections_found).map(([sec, found]) => (
                            <div key={sec} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {found ? <CheckCircle2 size={16} color="var(--color-success)" /> : <XCircle size={16} color="var(--color-danger)" />}
                                <span style={{ color: found ? 'var(--color-text)' : 'var(--color-muted)', textDecoration: found ? 'none' : 'line-through' }}>{sec}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h3 style={{ marginBottom: 'var(--space-16)' }}>Detected Core Skills ({data.detected_skills.length})</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {data.detected_skills.map(s => <Badge key={s} variant="primary">{s}</Badge>)}
                        {data.detected_skills.length === 0 && <span style={{ color: 'var(--color-muted)' }}>No standard skills detected.</span>}
                    </div>
                </Card>
            </div>

            <div style={{ marginTop: 'var(--space-32)' }}>
                <JobMatch resumeText={data.raw_text} />
            </div>

        </div>
    );
};
