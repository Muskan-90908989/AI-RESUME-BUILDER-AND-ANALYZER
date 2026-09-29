import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ShieldCheck, FileText, BarChart2 } from 'lucide-react';

interface LandingPageProps {
    onAnalyzeStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAnalyzeStart }) => {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-32) var(--space-16)' }}>
            {/* Navbar */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-64)' }}>
                <h1 style={{ fontSize: '20px', letterSpacing: '-0.5px' }}>AI Resume Analyzer</h1>
                <div style={{ display: 'flex', gap: 'var(--space-24)', alignItems: 'center' }}>
                    <span>Features</span>
                    <span>Privacy</span>
                    <Button onClick={onAnalyzeStart} size="sm">Analyze Resume</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', paddingBottom: 'var(--space-64)' }}>
                <p style={{ color: 'var(--color-primary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 'var(--space-16)' }}>
                    Local-First Resume Analysis
                </p>
                <h2 style={{ fontSize: '48px', marginBottom: 'var(--space-20)', letterSpacing: '-1px' }}>
                    Understand Your Resume.<br />Improve It With Evidence.
                </h2>
                <p style={{ fontSize: '18px', marginBottom: 'var(--space-32)' }}>
                    Analyze resume structure, ATS-style readability, skills, impact, and job alignment without sending your resume to an external AI service.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-16)', justifyContent: 'center' }}>
                    <Button onClick={onAnalyzeStart} size="lg">Analyze My Resume</Button>
                    <Button variant="outline" size="lg">See How It Works</Button>
                </div>
            </section>

            {/* Privacy Strip */}
            <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-24) 0', display: 'flex', justifyContent: 'space-around', color: 'var(--color-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} color="var(--color-success)" /> Private by design</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>No API key required</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Local memory processing</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Transparent deterministic scoring</span>
            </div>

            {/* Basic Feature Grid */}
            <section style={{ marginTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
                <h3 style={{ textAlign: 'center', fontSize: '32px', marginBottom: 'var(--space-48)' }}>Engineered for Results</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-32)' }}>
                    <Card>
                        <BarChart2 color="var(--color-primary)" size={24} style={{ marginBottom: '16px' }} />
                        <h4>Transparent Resume Score</h4>
                        <p style={{ marginTop: '8px' }}>A strict weighted scoring model measuring your structure and readability without arbitrary AI numbers.</p>
                    </Card>
                    <Card>
                        <FileText color="var(--color-primary)" size={24} style={{ marginBottom: '16px' }} />
                        <h4>Job Matching</h4>
                        <p style={{ marginTop: '8px' }}>Paste a job description to get a Keyword Matrix comparing what you have versus what they want.</p>
                    </Card>
                </div>
            </section>
        </div>
    );
};
