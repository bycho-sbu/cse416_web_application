import React, { useState,useEffect  } from 'react';
import Section from './Section';
import { getResumeByResumeId } from '../api';


interface ResumeViewProps {
  resumeId: string | undefined;
}
interface FormData {
  personalInformation: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
  };
  experience: {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  summary: string;
  education: {
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
  }[];
  skills: string[];
  feedbacks: {
    reviewer: string;
    comment: string;
    date: string;
  }[]; 
}


const ResumeView: React.FC<ResumeViewProps> = ({ resumeId }) => {
  const [formData, setFormData] = useState<FormData | null>(null);

   
  // Fetch resume data on load
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getResumeByResumeId(resumeId); 
        if (data == null || !data) {
          alert('No resume found for this user.\nPlease enter the fields to create new resume.');
          setFormData(null); 
          return;
        }   
        const transformedData: FormData = {
          personalInformation: {
            firstname: data.personalInformation?.firstname || '',
            lastname: data.personalInformation?.lastname || '',
            email: data.personalInformation?.email || '',
            phone: data.personalInformation?.phone || '',
            address: data.personalInformation?.address || '',
          },
          experience: data.experience?.map((exp: any) => ({
            jobTitle: exp.jobTitle || '',
            company: exp.company || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            description: exp.description || '',
          })) || [],
          summary: data.summary || '',
          education: data.education?.map((edu: any) => ({
            degree: edu.degree || '',
            institution: edu.institution || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
          })) || [],
          skills: data.skills || [],
          feedbacks: data.feedbacks?.map((feedback: any) => ({
            reviewer: feedback.reviewer || '',
            comment: feedback.comment || '',
            date: feedback.date || '',
          })) || [],
        };

        setFormData(transformedData); 
      } catch (error) {
        console.error('Error fetching resume:', error);
      }
    };

    fetchResume();
  }, [resumeId]);
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      {/* Display the user's name if available */}
      <h1>
        {formData
          ? `${formData.personalInformation.firstname} ${formData.personalInformation.lastname}’s Resume`
          : 'Your Name’s Resume'}
      </h1>

      {/* Personal Section */}
      <Section title="Contact Information">
        {formData ? (
          <p>
            {formData.personalInformation.phone} | {formData.personalInformation.email} | {formData.personalInformation.address}
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
              <h3>{exp.jobTitle} at {exp.company}</h3>
                <p>
                  {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} 
                  {exp.startDate && exp.endDate ? ' ~ ' : ''} 
                  {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ''}
                </p>
              <p>{exp.description}</p>
            </div>
          ))
        ) : (
          <p>List your experiences here, like company names, roles, and descriptions...</p>
        )}
      </Section>

      {/* Skills Section */}
      <Section title="Skills">
        {formData ? (
          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
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
                    {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : ''} 
                    {edu.startDate && edu.endDate ? ' ~ ' : ''} 
                    {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : ''}
                  </p>
            </div>
          ))
        ) : (
          <p>List your educational background, schools, degrees, and graduation dates...</p>
        )}
      </Section>
    </div>
  );
};

export default ResumeView;