import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, XCircle, Sparkles, Target, Briefcase, Lightbulb } from 'lucide-react';

export default function App() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

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
                setError("Network error: Is the FastAPI backend running on http://127.0.0.1:8000?");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const getScoreClass = (score: number) => {
        if (score >= 75) return 'score-good';
        if (score >= 50) return 'score-avg';
        return 'score-poor';
    };

    return (
        <div className="container">
            {/* Header */}
            <header className="header-layout">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <Sparkles color="var(--primary)" size={48} />
                    <h1 className="hero-title gradient-text">AI Resume Analyzer</h1>
                </div>
                <p className="hero-subtitle">
                    Upload your resume and get an instant, privacy-first analysis entirely inside your local machine. Discover skill gaps, job matches, and actionable improvements.
                </p>
            </header>

            {/* Upload Section */}
            {!results && !loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                        className={`glass-panel upload-container ${dragActive ? 'drag-active' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                        onClick={(e) => {
                            // Only trigger file click if they didn't click inside a button
                            if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                                fileInputRef.current?.click();
                            }
                        }}
                        style={{ width: '100%' }}
                    >
                        <UploadCloud className="upload-icon" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                            {file ? file.name : "Drag & Drop your PDF Resume here"}
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>or click to browse files</p>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                            style={{ display: 'none' }}
                            accept=".pdf"
                        />
                    </div>

                    {/* Render buttons outside the sensitive click zone */}
                    {file && (
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <button
                                className="btn-primary"
                                onClick={() => processResume()}
                            >
                                Analyze Now
                            </button>
                            <button
                                className="btn-primary"
                                style={{ background: 'transparent', border: '1px solid var(--text-muted)' }}
                                onClick={() => setFile(null)}
                            >
                                Clear File
                            </button>
                        </div>
                    )}

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-red)', marginTop: '20px' }}>
                            <AlertTriangle size={20} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                    <div className="spinner"></div>
                    <h3 style={{ marginTop: '30px', color: 'var(--text-main)', fontSize: '1.2rem' }}>Extracting & Analyzing...</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Running local heuristics and matching roles.</p>
                </div>
            )}

            {/* Results Dashboard */}
            {results && !loading && (
                <div style={{ animation: 'fadeInUp 0.6s ease-out forwards' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h2 className="gradient-text" style={{ fontSize: '2rem' }}>Analysis Results</h2>
                        <button className="btn-primary" onClick={() => { setResults(null); setFile(null); }}>
                            Upload Another
                        </button>
                    </div>

                    <div className="results-grid">
                        {/* Resume Score */}
                        <div className="glass-panel score-card">
                            <FileText size={32} color="var(--primary)" style={{ marginBottom: '15px' }} />
                            <div className="score-title">Resume Score</div>
                            <div className={`score-value ${getScoreClass(results.resume_score.score)}`}>
                                {results.resume_score.score}<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/100</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Heuristic structure evaluation</p>
                        </div>

                        {/* ATS Score */}
                        <div className="glass-panel score-card">
                            <Target size={32} color="var(--primary-alt)" style={{ marginBottom: '15px' }} />
                            <div className="score-title">ATS-Style Score</div>
                            <div className={`score-value ${getScoreClass(results.ats_score.score)}`}>
                                {results.ats_score.score}<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/100</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Keyword & formatting estimate</p>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="results-grid" style={{ marginTop: '24px' }}>

                        {/* Skills & Categories */}
                        <div className="glass-panel card-section">
                            <div className="section-title">
                                <CheckCircle color="var(--accent-green)" />
                                Detected Skills
                            </div>
                            {results.detected_skills.length > 0 ? (
                                <div className="badge-container">
                                    {results.detected_skills.map((skill: string, idx: number) => (
                                        <span key={idx} className="badge badge-skill">{skill}</span>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>No skills strongly matched our dictionaries.</p>
                            )}
                        </div>

                        {/* Improvements */}
                        <div className="glass-panel card-section">
                            <div className="section-title">
                                <Lightbulb color="var(--accent-amber)" />
                                Actionable Improvements
                            </div>
                            <div>
                                {results.improvements.map((imp: string, idx: number) => (
                                    <div key={idx} className="improvement-item">
                                        <AlertTriangle className="improvement-icon" size={18} />
                                        <span>{imp}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Job Roles */}
                    <div className="glass-panel card-section" style={{ marginTop: '24px' }}>
                        <div className="section-title">
                            <Briefcase color="var(--primary)" />
                            Top Role Matches & Missing Skills
                        </div>
                        {results.roles.length > 0 ? (
                            <div>
                                {results.roles.slice(0, 3).map((role: any, idx: number) => (
                                    <div key={idx} className="role-item">
                                        <div className="role-header">
                                            <div className="role-name">{role.role}</div>
                                            <div className="role-match">{role.match_percentage}% Match</div>
                                        </div>
                                        {role.missing_skills.length > 0 ? (
                                            <div className="badge-container">
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '8px' }}>Gaps:</span>
                                                {role.missing_skills.map((skill: string, idx: number) => (
                                                    <span key={idx} className="badge badge-gap">{skill}</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.85rem', color: 'var(--accent-green)' }}>No keyword gaps!</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>Not enough skills detected for strong role matches.</p>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
