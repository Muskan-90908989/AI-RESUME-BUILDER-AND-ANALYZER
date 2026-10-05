import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, style = {} }) => {
    const defaultStyles: React.CSSProperties = {
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-12)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)',
        padding: noPadding ? '0' : 'var(--space-24)',
        overflow: 'hidden'
    };

    return (
        <div style={{ ...defaultStyles, ...style }} className={`glass-panel hover-lift ${className}`}>
            {children}
        </div>
    );
};
