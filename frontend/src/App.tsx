import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Sparkles, Target, Briefcase, Lightbulb, BarChart } from 'lucide-react';

export default function App() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [scanMessage, setScanMessage] = useState('');
    const [scanProgress, setScanProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const scanSteps = [
        "Initializing Secure AI Engine...",
        "Extracting PDF text structures...",
        "Scanning for missing industry keywords...",
        "Parsing impact action verbs...",
        "Generating final ATS score..."
    ];

    const handleFile = (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            setError("Please upload a valid PDF file.");
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setError(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const processResume = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        setResults(null);

        // Simulated parsing experience (Trust building)
        for (let i = 0; i < scanSteps.length; i++) {
            setScanMessage(scanSteps[i]);
            setScanProgress(((i + 1) / scanSteps.length) * 100);
            await new Promise(r => setTimeout(r, 600));
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let errorMsg = "Analysis failed.";
                try {
                    const errData = await response.json();
                    errorMsg = errData.detail || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            setResults(data);
        } catch (err: any) {
            if (err.message.includes("Failed to fetch")) {
                setError("Network error: Please ensure your FastAPI backend is running on http://127.0.0.1:8000.");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            {/* Navbar Options */}
            <nav className="navbar">
                <div className="nav-logo">
                    <BarChart color="var(--primary)" size={28} />
                    ResumeUp AI
                </div>
                {!results && !loading && (
                    <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}>
                        Upload PDF
                    </button>
                )}
            </nav>

            {/* Hero Section */}
            {!results && !loading && (
                <div className="hero">
                    <h1>Beat the ATS with Precision AI.</h1>
                    <p>Instantly check your resume score, discover missing keywords, and get hired faster. Privacy first—processed locally.</p>
                    <div className="trust-badges">
                        <span><CheckCircle size={16} color="var(--success)" /> Local Engine</span>
                        <span><CheckCircle size={16} color="var(--success)" /> PDF Parsing</span>
                        <span><CheckCircle size={16} color="var(--success)" /> ATS Optimization</span>
                    </div>
                </div>
            )}

            {/* Upload Zone */}
            {!results && !loading && (
                <div className="upload-card">
                    <div
                        className={`dropzone ${dragActive ? 'active' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                        onClick={(e) => {
                            if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                                fileInputRef.current?.click();
                            }
                        }}
                    >
                        <UploadCloud size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                            {file ? file.name : "Drag & Drop your Resume"}
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

                    {file && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '30px' }}>
                            <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); processResume(); }}>
                                <Sparkles size={18} /> Run AI Scan
                            </button>
                            <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                                Cancel
                            </button>
                        </div>
                    )}

                    {error && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--danger)', marginTop: '24px' }}>
                            <AlertTriangle size={20} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Loading (ATS Scan Mode) */}
            {loading && (
                <div className="scan-container">
                    <Target size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
                    <h2>Analyzing your Resume</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>{scanMessage}</p>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                </div>
            )}

            {/* Results Dashboard */}
            {results && !loading && (
                <div className="dashboard">

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h2>Overview & Insights</h2>
                        <button className="btn btn-primary" onClick={() => { setResults(null); setFile(null); }}>
                            Upload New Resume
                        </button>
                    </div>

                    <div className="metrics-grid">
                        <div className="metric-card">
                            <FileText size={48} color={results.resume_score.score >= 75 ? 'var(--success)' : 'var(--warning)'} />
                            <div>
                                <div className={`m-value ${results.resume_score.score >= 75 ? 'text-success' : 'text-warning'}`}>
                                    {results.resume_score.score}
                                </div>
                                <div className="m-label">Structure Score (0-100)</div>
                            </div>
                        </div>

                        <div className="metric-card">
                            <Target size={48} color={results.ats_score.score >= 75 ? 'var(--success)' : 'var(--warning)'} />
                            <div>
                                <div className={`m-value ${results.ats_score.score >= 75 ? 'text-success' : 'text-warning'}`}>
                                    {results.ats_score.score}
                                </div>
                                <div className="m-label">ATS Optimization (0-100)</div>
                            </div>
                        </div>
                    </div>

                    <div className="details-grid">
                        <div className="panel">
                            <div className="panel-header">
                                <Briefcase color="var(--primary)" /> Top Industry Matches
                            </div>

                            {results.roles.length > 0 ? (
                                <div>
                                    {results.roles.slice(0, 3).map((role: any, idx: number) => (
                                        <div key={idx} style={{ marginBottom: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <h3 style={{ fontSize: '1.1rem' }}>{role.role}</h3>
                                                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{role.match_percentage}% Match</span>
                                            </div>

                                            {role.missing_skills.length > 0 ? (
                                                <div>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Missing Keywords to beat the ATS:</p>
                                                    <div className="pills">
                                                        {role.missing_skills.map((skill: string, idx: number) => (
                                                            <span key={idx} className="pill pill-danger">{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-success" style={{ fontWeight: 600 }}>Perfect match! No missing core keywords.</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">Not enough skills detected to determine a strong industry match.</p>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="panel" style={{ padding: '24px' }}>
                                <div className="panel-header" style={{ marginBottom: '16px' }}>
                                    <CheckCircle color="var(--success)" /> Detected Strengths
                                </div>
                                <div className="pills">
                                    {results.detected_skills.length > 0 ? (
                                        results.detected_skills.map((skill: string, idx: number) => (
                                            <span key={idx} className="pill pill-primary">{skill}</span>
                                        ))
                                    ) : (
                                        <span className="text-muted">No specific hard skills detected.</span>
                                    )}
                                </div>
                            </div>

                            <div className="panel" style={{ padding: '24px' }}>
                                <div className="panel-header" style={{ marginBottom: '16px' }}>
                                    <Lightbulb color="var(--warning)" /> Expert Suggestions
                                </div>
                                <ul className="checklist">
                                    {results.improvements.map((imp: string, idx: number) => (
                                        <li key={idx}>
                                            <AlertTriangle color="var(--warning)" size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <span>{imp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
