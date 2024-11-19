import React, { useState } from 'react';
import InfoForm from './InfoForm';
import Section from './Section';

// Import or define the interfaces used in InfoForm
interface EducationEntry {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
}

const ResumeEditor: React.FC = () => {
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const upload = () => {
    console.log("123");
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      {/* Display the user's name if available */}
      <h1>
        {formData
          ? `${formData.firstName} ${formData.lastName}’s Resume`
          : 'Your Name’s Resume'}
      </h1>

      {/* Personal Section */}
      <Section title="Personal">
        {formData ? (
          <p>
            {formData.phone} | {formData.email} | {formData.location}
          </p>
        ) : (
          <p>Phone Number | Email | Location</p>
        )}
      </Section>

      {/* Professional Summary Section */}
      <Section title="Professional Summary">
        {formData ? (
          <p>{formData.summary}</p>
        ) : (
          <p>Briefly describe your professional background, skills, and goals...</p>
        )}
      </Section>

      {/* Experience Section */}
      <Section title="Experience">
        {formData ? (
          formData.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <h3>{exp.role} at {exp.company}</h3>
              <p>
                {exp.startDate} - {exp.endDate}
              </p>
              <p>{exp.responsibilities}</p>
            </div>
          ))
        ) : (
          <p>List your experiences here, like company names, roles, and descriptions...</p>
        )}
      </Section>

      {/* Skills Section */}
      <Section title="Skills">
        {formData ? (
          <ul>
            {formData.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p>List 3-4 special, work-related skills...</p>
        )}
      </Section>

      {/* Education Section */}
      <Section title="Education">
        {formData ? (
          formData.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <h3>{edu.degree} at {edu.institution}</h3>
              <p>
                {edu.startDate} - {edu.endDate}
              </p>
            </div>
          ))
        ) : (
          <p>List your educational background, schools, degrees, and graduation dates...</p>
        )}
      </Section>

      {/* InfoForm Modal */}
      {showInfoForm && (
        <InfoForm
          onClose={() => setShowInfoForm(false)}
          onSubmit={(data) => {
            setFormData(data);
            setShowInfoForm(false);
          }}
        />
      )}

      {/* Button to Open InfoForm */}
      <button
        onClick={() => setShowInfoForm(true)}
        style={{ cursor: 'pointer', marginTop: '20px' }}
      >
        Input Information
      </button>
      <button onClick={() => upload}>Upload</button>
    </div>
  );
};

export default ResumeEditor;