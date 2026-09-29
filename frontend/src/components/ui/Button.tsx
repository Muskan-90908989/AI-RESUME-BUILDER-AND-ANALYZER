import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    borderRadius: 'var(--radius-8)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    width: fullWidth ? '100%' : 'auto'
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      border: '1px solid var(--color-primary)',
    },
    secondary: {
      backgroundColor: 'var(--color-primary-soft)',
      color: 'var(--color-primary)',
      border: '1px solid transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-text)',
      border: '1px solid var(--color-border)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-muted)',
      border: '1px solid transparent',
    }
  };

  const sizes = {
    sm: { padding: 'var(--space-8) var(--space-12)', fontSize: '14px' },
    md: { padding: 'var(--space-12) var(--space-20)', fontSize: '15px' },
    lg: { padding: 'var(--space-16) var(--space-32)', fontSize: '16px' }
  };

  const combinedStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size]
  };

  return (
    <button style={combinedStyles} className={`btn ${className}`} {...props}>
      {children}
    </button>
  );
};
