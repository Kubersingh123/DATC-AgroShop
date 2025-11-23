import React from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, description, actions, children }) => (
  <section className="section-card">
    <header className="section-header">
      <div>
        <p className="section-title">{title}</p>
        {description && <p className="section-description">{description}</p>}
      </div>
      {actions && <div className="section-actions">{actions}</div>}
    </header>
    <div className="section-body">{children}</div>
  </section>
);

export default SectionCard;

