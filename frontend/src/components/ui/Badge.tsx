import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'primary';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
    const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: 'var(--space-4) var(--space-8)',
        borderRadius: 'var(--radius-8)',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    const variants = {
        neutral: { backgroundColor: 'var(--color-bg)', color: 'var(--color-muted)' },
        primary: { backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' },
        success: { backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' },
        warning: { backgroundColor: '#fef3c7', color: 'var(--color-warning)' },
        danger: { backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }
    };

    return (
        <span style={{ ...baseStyles, ...variants[variant] }}>
            {children}
        </span>
    );
};
