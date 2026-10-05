import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface UploaderProps {
    onFileSelect: (file: File) => void;
    isLoading?: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onFileSelect, isLoading = false }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateAndSelect = (file: File) => {
        setErrorMsg('');
        if (file.type !== 'application/pdf') {
            setErrorMsg('Invalid file type. Only PDF files are supported.');
            return;
        }
        // 5MB limit check (Phase 7 requirement)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg('File is too large. Maximum size is 5MB.');
            return;
        }
        onFileSelect(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className="glass-panel hover-lift animate-fade-in"
            style={{
                border: `2px dashed ${isHovering ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-12)',
                backgroundColor: isHovering ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                padding: 'var(--space-48)',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    !isLoading && fileInputRef.current?.click();
                }
            }}
            aria-label="Upload PDF Resume"
        >
            <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleChange}
                style={{ display: 'none' }}
                disabled={isLoading}
            />

            <UploadCloud
                size={48}
                color={isHovering ? 'var(--color-primary)' : 'var(--color-muted)'}
                style={{ marginBottom: 'var(--space-16)' }}
            />

            {isHovering ? (
                <h3 style={{ color: 'var(--color-primary)' }}>Drop to analyze!</h3>
            ) : (
                <>
                    <h3 style={{ marginBottom: 'var(--space-8)' }}>Drag & Drop your resume here</h3>
                    <p style={{ marginBottom: 'var(--space-24)', fontSize: '14px' }}>PDF up to 5 MB</p>
                    <Button type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} disabled={isLoading}>
                        Choose PDF
                    </Button>
                </>
            )}

            {errorMsg && (
                <p style={{ color: 'var(--color-danger)', marginTop: 'var(--space-16)', fontWeight: 500 }}>
                    {errorMsg}
                </p>
            )}
        </div>
    );
};
