import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  meta?: string;
  accent?: 'green' | 'yellow' | 'blue' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, meta, accent = 'green' }) => (
  <div className={`stat-card accent-${accent}`}>
    <p className="stat-title">{title}</p>
    <p className="stat-value">{value}</p>
    {meta && <p className="stat-meta">{meta}</p>}
  </div>
);

export default StatCard;

