import { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertTriangle, Sparkles, Target, Settings, ChevronRight, XOctagon } from 'lucide-react';

const ScoreGauge = ({ score }: { score: number }) => {
    // Math for SVG half circle (arc length)
    const radius = 40;
    const circumference = Math.PI * radius; // Half circle
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: '120px', height: '60px', margin: '0 auto 10px' }}>
            <svg viewBox="0 0 100 50" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    strokeLinecap="round"
                />
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="var(--orange)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
            </svg>
            <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', background: '#334155', borderRadius: '50%' }}></div>
        </div>
    );
};

export default function App() {
    const [loading, setLoading] = useState(false);
    const [scanMessage, setScanMessage] = useState('');
    const [scanProgress, setScanProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);

    // UI State
    const [activeTab, setActiveTab] = useState('ats');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const scanSteps = [
        "Initializing Secure AI Engine...",
        "Extracting PDF text structures...",
        "Scanning for missing industry keywords...",
        "Parsing impact action verbs...",
        "Generating final ATS score..."
    ];

    const processResume = async (curFile: File) => {
        setLoading(true);
        setError(null);
        setResults(null);

        for (let i = 0; i < scanSteps.length; i++) {
            setScanMessage(scanSteps[i]);
            setScanProgress(((i + 1) / scanSteps.length) * 100);
            await new Promise(r => setTimeout(r, 600));
        }

        const formData = new FormData();
        formData.append('file', curFile);

        try {
            const API_URL = import.meta.env.API_URL || 'http://127.0.0.1:8000';
            const response = await fetch(`${API_URL}/api/analyze`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Analysis failed.");
            }
            const data = await response.json();
            setResults(data);
        } catch (err: any) {
            setError(`Network error: Could not reach the backend API.`);
        } finally {
            setLoading(false);
        }
    };

    const handleFile = (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            setError("Please upload a valid PDF file.");
            return;
        }
        setError(null);
        processResume(selectedFile);
    };

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div className="upload-card" style={{ width: '100%' }}>
                    <Target size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
                    <h2 style={{ color: 'var(--text-dark)', marginBottom: '10px' }}>Analyzing your Resume</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{scanMessage}</p>
                    <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '9px', marginTop: '30px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--primary)', width: `${scanProgress}%`, transition: 'width 0.3s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="container">
                <nav className="navbar">
                    <div className="nav-logo">ResumeUp AI</div>
                </nav>
                <div className="hero">
                    <h1>Beat the ATS with Precision AI.</h1>
                    <p>Instantly check your resume score, discover missing keywords, and get hired faster. Privacy first—processed locally.</p>
                </div>
                <div className="upload-card">
                    <div
                        className={`dropzone ${dragActive ? 'active' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragActive(false);
                            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadCloud size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                            Drag & Drop your Resume
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>Only PDF files supported</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                            style={{ display: 'none' }}
                            accept=".pdf"
                        />
                    </div>
                    {error && <p style={{ color: 'var(--danger)', marginTop: '20px', fontWeight: 600 }}>{error}</p>}
                </div>
            </div>
        );
    }

    const unquantifiedCount = results.unquantified_bullets?.length || 0;

    return (
        <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '60px' }}>
            <div className="container" style={{ padding: '20px' }}>
                <nav className="navbar" style={{ marginBottom: '40px' }}>
                    <div className="nav-logo">ResumeUp AI</div>
                    <button className="btn btn-outline" onClick={() => setResults(null)}>Upload New</button>
                </nav>

                <div className="dashboard-grid">
                    {/* LEFT SIDEBAR */}
                    <div className="sidebar">
                        <div className="score-container">
                            <h3>Your Score</h3>
                            <ScoreGauge score={results.resume_score.score} />
                            <div className="score-number">{results.resume_score.score}/100</div>
                            <button className="btn btn-success" style={{ width: '100%', marginTop: '20px' }}>
                                <Sparkles size={16} /> Unlock Full Report
                            </button>
                        </div>

                        <div className="sidebar-group">
                            <div className="sidebar-group-title">CONTENT</div>
                            <div className={`sidebar-item ${activeTab === 'ats' ? 'active' : ''}`} onClick={() => setActiveTab('ats')}>
                                <span>ATS Parse Rate</span>
                                <span className={`pill-sm ${results.ats_score.score > 80 ? 'success' : 'grey'}`}>
                                    {results.ats_score.score > 80 ? 'No issues' : 'Issues'}
                                </span>
                            </div>
                            <div className={`sidebar-item ${activeTab === 'impact' ? 'active' : ''}`} onClick={() => setActiveTab('impact')}>
                                <span>Quantifying Impact</span>
                                <span className="pill-sm grey">{unquantifiedCount} issues</span>
                            </div>
                        </div>

                        <div className="sidebar-group">
                            <div className="sidebar-group-title">SECTIONS</div>
                            <div className={`sidebar-item ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
                                <span>Skills Match</span>
                                <ChevronRight size={16} color="var(--text-muted)" />
                            </div>
                        </div>
                    </div>

                    {/* MAIN PANE */}
                    <div className="main-pane">

                        {activeTab === 'ats' && (
                            <div>
                                <div className="main-header">
                                    <h2><Settings color="var(--primary)" /> ATS PARSE RATE</h2>
                                    <span className="pill-sm grey text-muted">Core check</span>
                                </div>
                                <p className="text-desc">
                                    Employers use Applicant Tracking Systems (ATS) to scan applications. A high parse rate means the system consistently extracts your data without garbling text.
                                </p>

                                <div className="large-progress-wrapper" style={{ marginTop: '40px' }}>
                                    <div className="lp-bar">
                                        <div className="lp-fill" style={{ width: `${results.ats_score.score}%` }}></div>
                                    </div>
                                    <div className="lp-labels">
                                        <span className="text-success">{results.ats_score.score}% read properly</span>
                                        <span className="text-danger">{100 - results.ats_score.score}% missed</span>
                                    </div>
                                    <h3 style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-dark)' }}>
                                        {results.ats_score.score < 80
                                            ? "Your structure is confusing the ATS. Fix headers immediately."
                                            : "Excellent structural markers! Your template parses smoothly."}
                                    </h3>
                                </div>
                            </div>
                        )}

                        {activeTab === 'impact' && (
                            <div>
                                <div className="main-header">
                                    <h2><Target color="var(--primary)" /> QUANTIFY IMPACT</h2>
                                </div>
                                <p className="text-desc">
                                    A good resume shows the impact you've made. Quantify that impact using numbers, percentages, or exact timeframes, and recruiters are far more likely to invite you in.
                                </p>

                                <div className="issue-container">
                                    <div className="issue-icon-wrapper">
                                        <div className="hexagon-icon">
                                            <AlertTriangle color="white" size={28} />
                                        </div>
                                        <div className="issue-badge">{unquantifiedCount}</div>
                                    </div>

                                    <h3 className="issue-title">
                                        {unquantifiedCount > 0
                                            ? "Oh, no! Your experience section lacks quantifiable achievements."
                                            : "Perfect! All your actions show measured impact."}
                                    </h3>

                                    {unquantifiedCount > 0 && results.unquantified_bullets.map((bullet: string, i: number) => (
                                        <div key={i} className="issue-snippet">
                                            <XOctagon size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <span>{bullet}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'skills' && (
                            <div>
                                <div className="main-header">
                                    <h2><FileText color="var(--primary)" /> SKILLS MATCHING</h2>
                                </div>
                                <p className="text-desc">
                                    Your hard skills define your technical capabilities. We scan your resume against thousands of job descriptions.
                                </p>

                                {results.roles.length > 0 ? (
                                    results.roles.slice(0, 3).map((r: any, idx: number) => (
                                        <div key={idx} style={{ background: '#fafafc', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>{r.role}</h3>
                                                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{r.match_percentage}%</span>
                                            </div>
                                            {r.missing_skills.length > 0 && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>MISSING HIGH-VALUE KEYWORDS:</p>
                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                        {r.missing_skills.map((s: string, i: number) => (
                                                            <span key={i} style={{ padding: '4px 10px', background: 'white', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-main)' }}>{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="issue-container">
                                        <h3 className="issue-title">Not enough data</h3>
                                        <p className="text-muted">We could not extract sufficient hard skills to match you to industry roles.</p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
