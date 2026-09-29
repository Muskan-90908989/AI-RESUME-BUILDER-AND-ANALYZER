import React from 'react';

interface ScoreGaugeProps {
    score: number;
    label?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label }) => {
    const radius = 50;
    const strokeWidth = 10;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let color = 'var(--color-success)';
    if (score < 50) color = 'var(--color-danger)';
    else if (score < 80) color = 'var(--color-warning)';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg height={radius * 2} width={radius * 2}>
                <circle
                    stroke="var(--color-border)"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    transform={`rotate(-90 ${radius} ${radius})`}
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="24px"
                    fontWeight="bold"
                    fill="var(--color-text)">
                    {score}
                </text>
            </svg>
            {label && <p style={{ marginTop: 'var(--space-8)', fontWeight: 500 }}>{label}</p>}
        </div>
    );
};
