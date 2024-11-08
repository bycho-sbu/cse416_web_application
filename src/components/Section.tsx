import React, { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <h3>{title}</h3>
    <div>{children}</div>
  </div>
);

export default Section;