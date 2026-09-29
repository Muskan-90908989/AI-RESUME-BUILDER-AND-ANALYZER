import { useState } from 'react';
import { LandingPage } from './features/landing/LandingPage';
import { Uploader } from './features/analyzer/Uploader';
import { Dashboard } from './features/results/Dashboard';
import { ApplicationsTracker } from './features/applications/ApplicationsTracker';
import { ResumeAnalysisResponse } from './types/analysis';
import { Button } from './components/ui/Button';
import { ArrowLeft, LayoutDashboard, Briefcase } from 'lucide-react';

const API_BASE_URL = 'https://ai-resume-builder-and-analyzer-d4lm.onrender.com';

function App() {
    const [view, setView] = useState<'landing' | 'upload' | 'results' | 'tracker'>('landing');
    const [isUploading, setIsUploading] = useState(false);
    const [analysisData, setAnalysisData] = useState<ResumeAnalysisResponse | null>(null);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        setErrorDetails(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/analyze`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to analyze resume');
            }

            setAnalysisData(data);
            setView('results');
        } catch (err: any) {
            setErrorDetails(err.message || 'Network error occurred during API contact.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Dynamic View Configuration */}
            {view !== 'landing' && (
                <header style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                    <Button variant={view === 'tracker' ? 'outline' : 'primary'} onClick={() => setView('upload')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LayoutDashboard size={18} /> Analyzer
                    </Button>
                    <Button variant={view === 'tracker' ? 'primary' : 'outline'} onClick={() => setView('tracker')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Briefcase size={18} /> Job Tracker
                    </Button>
                </header>
            )}

            <main style={{ flex: 1 }}>
                {view === 'landing' && <LandingPage onAnalyzeStart={() => setView('upload')} />}

                {view === 'tracker' && <ApplicationsTracker />}

                {view === 'upload' && (
                    <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-64) var(--space-16)' }}>
                        <Button variant="ghost" onClick={() => setView('landing')} style={{ marginBottom: 'var(--space-24)' }}>
                            <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back home
                        </Button>
                        <h2 style={{ fontSize: '32px', marginBottom: 'var(--space-32)' }}>Upload your Resume</h2>
                        <Uploader onFileSelect={handleFileUpload} isLoading={isUploading} />
                        {isUploading && (
                            <p style={{ textAlign: 'center', marginTop: 'var(--space-24)', color: 'var(--color-primary)', fontWeight: 500, animation: 'pulse 2s infinite' }}>
                                Analyzing strictly on your local memory engine...
                            </p>
                        )}
                        {errorDetails && (
                            <p style={{ textAlign: 'center', marginTop: 'var(--space-24)', color: 'var(--color-danger)', fontWeight: 500 }}>
                                {errorDetails}
                            </p>
                        )}
                    </div>
                )}

                {view === 'results' && analysisData && (
                    <div style={{ padding: 'var(--space-16)' }}>
                        <Button variant="outline" onClick={() => setView('upload')} style={{ margin: 'var(--space-16) auto', display: 'flex' }}>
                            <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Analyze Another Resume
                        </Button>
                        <Dashboard data={analysisData} />
                    </div>
                )}
            </main>

            {/* Simple Footer */}
            <footer style={{ textAlign: 'center', padding: 'var(--space-24)', color: 'var(--color-muted)', borderTop: '1px solid var(--color-border)', fontSize: '14px' }}>
                <p>B.Tech Final Year Project • Engineered for Privacy</p>
            </footer>
        </div>
    );
}

export default App;
