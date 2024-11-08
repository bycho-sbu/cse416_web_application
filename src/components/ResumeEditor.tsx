import React, { useState } from 'react';
import InfoForm from './InfoForm';
import Section from './Section';

const ResumeEditor: React.FC = () => {
  const [showInfoForm, setShowInfoForm] = useState(false);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Byungho’s Resume</h1>
      
      <Section title="Personal">
        <p>Phone Number | jamesbh.cho@gmail.com | City, State</p>
      </Section>


      <Section title="Experience">
        <p>List your experiences here, like company names, roles, and descriptions...</p>
      </Section>

      <Section title="Skills">
        <p>List 3-4 special, work-related skills...</p>
      </Section>

      <Section title="Education">
        <p>List your educational background, schools, degrees, and graduation dates...</p>
      </Section>

      {showInfoForm && (
        <InfoForm onClose={() => setShowInfoForm(false)} />
      )}

      <button onClick={() => setShowInfoForm(true)} style={{ cursor: 'pointer'}}> Input Information </button>
    </div>
  );
};

export default ResumeEditor;