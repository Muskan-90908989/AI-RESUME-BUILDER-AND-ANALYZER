import React, { useEffect, useState } from 'react';
import { Application } from '../../types/applications';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Utility for formatting dates
function formDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const ApplicationsTracker: React.FC = () => {
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    // New app form state
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [url, setUrl] = useState('');

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/applications/`);
            if (res.ok) {
                const data = await res.json();
                setApps(data);
            }
        } catch (e) {
            console.error("Failed to fetch applications", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/api/applications/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company, role, status: 'Saved', url, match_score: 0 })
            });
            if (res.ok) {
                const newApp = await res.json();
                setApps([newApp, ...apps]);
                setCompany(''); setRole(''); setUrl('');
            }
        } catch (e) {
            console.error("Failed to create", e);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await fetch(`${API_BASE}/api/applications/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            setApps(apps.map(a => a.id === id ? { ...a, status: newStatus as any } : a));
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`${API_BASE}/api/applications/${id}`, { method: 'DELETE' });
            setApps(apps.filter(a => a.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div>Loading Application Tracker...</div>;

    const columns = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

    return (
        <div style={{ padding: 'var(--space-32) var(--space-16)', maxWidth: '1400px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', marginBottom: 'var(--space-32)', letterSpacing: '-0.5px' }}>Application Tracker</h2>

            <Card style={{ marginBottom: 'var(--space-32)' }}>
                <h3 style={{ marginBottom: 'var(--space-16)' }}>Add New Application</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '13px', marginBottom: '4px', fontWeight: 500 }}>Company</label>
                        <input required value={company} onChange={e => setCompany(e.target.value)} style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px' }} placeholder="e.g. Google" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '13px', marginBottom: '4px', fontWeight: 500 }}>Role</label>
                        <input required value={role} onChange={e => setRole(e.target.value)} style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px' }} placeholder="e.g. Backend Engineer" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '13px', marginBottom: '4px', fontWeight: 500 }}>JD URL (Optional)</label>
                        <input value={url} onChange={e => setUrl(e.target.value)} style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px' }} placeholder="https://..." />
                    </div>
                    <Button type="submit">Track Job</Button>
                </form>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
                {columns.map(statusCol => (
                    <div key={statusCol} style={{ background: 'var(--color-bg-secondary)', padding: '16px', borderRadius: '8px', minWidth: '260px' }}>
                        <h4 style={{ marginBottom: '16px', borderBottom: '2px solid var(--color-border)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            {statusCol}
                            <span style={{ color: 'var(--color-muted)' }}>{apps.filter(a => a.status === statusCol).length}</span>
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {apps.filter(a => a.status === statusCol).map(app => (
                                <Card key={app.id} style={{ padding: '12px' }}>
                                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{app.role}</div>
                                    <div style={{ color: 'var(--color-primary)', fontSize: '14px', marginBottom: '8px' }}>{app.company}</div>

                                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '12px' }}>
                                        Added: {formDate(app.date_added)}
                                        {app.url && <a href={app.url} target="_blank" rel="noreferrer" style={{ display: 'block', color: 'var(--color-primary)' }}>View JD</a>}
                                    </div>

                                    <select
                                        value={app.status}
                                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                        style={{ width: '100%', marginBottom: '8px', padding: '4px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                                    >
                                        {columns.map(c => <option key={c} value={c}>Move to {c}</option>)}
                                    </select>

                                    <button
                                        onClick={() => handleDelete(app.id)}
                                        style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '12px', textAlign: 'right' }}
                                    >
                                        Delete
                                    </button>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
