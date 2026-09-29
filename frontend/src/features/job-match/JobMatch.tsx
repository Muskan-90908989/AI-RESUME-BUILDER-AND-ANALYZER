import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ScoreGauge } from '../../components/ui/ScoreGauge';
import { JobMatchResponse } from '../../types/analysis';

const API_BASE_URL = 'https://ai-resume-builder-and-analyzer-d4lm.onrender.com';

interface JobMatchProps {
    resumeText: string;
}

export const JobMatch: React.FC<JobMatchProps> = ({ resumeText }) => {
    const [jdText, setJdText] = useState('');
    const [isMatching, setIsMatching] = useState(false);
    const [matchData, setMatchData] = useState<JobMatchResponse | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleMatch = async () => {
        if (!jdText.trim()) return;
        setIsMatching(true);
        setErrorMsg('');

        try {
            const resp = await fetch(`${API_BASE_URL}/api/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resume_text: resumeText,
                    job_description: jdText
                })
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || 'Failed to match JD');
            setMatchData(data);
        } catch (e: any) {
            setErrorMsg(e.message);
        } finally {
            setIsMatching(false);
        }
    };

    return (
        <Card>
            <h3 style={{ marginBottom: 'var(--space-16)' }}>Compare with a Job Description</h3>
            {!matchData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                    <p style={{ fontSize: '14px' }}>Paste a job description below to identify missing keywords.</p>
                    <textarea
                        rows={6}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: 'var(--radius-8)',
                            border: '1px solid var(--color-border)',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                        placeholder="Paste Job Description here..."
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                    />
                    <Button onClick={handleMatch} disabled={isMatching || !jdText.trim()}>
                        {isMatching ? 'Analyzing Matrix...' : 'Run JD Overlap Analysis'}
                    </Button>
                    {errorMsg && <p style={{ color: 'var(--color-danger)' }}>{errorMsg}</p>}
                </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', gap: 'var(--space-32)', alignItems: 'center', marginBottom: 'var(--space-24)' }}>
                        <ScoreGauge score={matchData.overall_match} label="Match Score" />
                        <div style={{ flex: 1 }}>
                            <Button size="sm" variant="outline" onClick={() => setMatchData(null)} style={{ float: 'right' }}>New Comparison</Button>
                            <h4 style={{ marginBottom: '8px' }}>Keyword Matrix</h4>
                            <p style={{ fontSize: '14px', marginBottom: '16px' }}>Identified {matchData.matched_skills.length} matching core skills.</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-24)' }}>
                        <div>
                            <h5 style={{ marginBottom: '12px', color: 'var(--color-success)' }}>Matches Resume</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {matchData.matched_skills.map((s: string) => <Badge key={s} variant="success">{s}</Badge>)}
                                {matchData.matched_skills.length === 0 && <span style={{ fontSize: '14px', color: 'var(--color-muted)' }}>None found.</span>}
                            </div>
                        </div>
                        <div>
                            <h5 style={{ marginBottom: '12px', color: 'var(--color-danger)' }}>Missing from Resume</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {matchData.missing_skills.map((s: string) => <Badge key={s} variant="danger">{s}</Badge>)}
                                {matchData.missing_skills.length === 0 && <span style={{ fontSize: '14px', color: 'var(--color-muted)' }}>None missing!</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};
