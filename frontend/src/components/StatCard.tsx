import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  meta?: string;
  accent?: 'green' | 'yellow' | 'blue' | 'orange' | 'red';
  onClick?: () => void;
  clickable?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, meta, accent = 'green', onClick, clickable }) => (
  <div 
    className={`stat-card accent-${accent} ${clickable ? 'clickable' : ''}`}
    onClick={clickable ? onClick : undefined}
    style={clickable ? { cursor: 'pointer' } : undefined}
  >
    <p className="stat-title">{title}</p>
    <p className="stat-value">{value}</p>
    {meta && <p className="stat-meta">{meta}</p>}
  </div>
);

export default StatCard;

