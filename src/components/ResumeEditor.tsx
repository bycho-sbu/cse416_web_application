import React, { useState,useEffect  } from 'react';
import InfoForm from './InfoForm';
import Section from './Section';
import { getResume, generateSummary } from '../api';
import { fetchCurrentUserId } from '../api';
import { useNavigate } from 'react-router-dom';

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

const ResumeEditor: React.FC = () => {
const [showInfoForm, setShowInfoForm] = useState(false);
const [formData, setFormData] = useState<FormData | null>(null);
const [currentUserId, setCurrentUserId] = useState<string | null>(null);
const navigate = useNavigate();

useEffect(() => {
  const fetchUserAndResume = async () => {
    try {
      // Fetch current user ID
      const userId = await fetchCurrentUserId();
      setCurrentUserId(userId);
    
      // fetch resume data for the logged-in user
      const data = await getResume();
      if (data == null || !data) {
        setFormData(null);
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

      setFormData(transformedData); // Update the state with the resume data
    } catch (error) {
      console.error('Error fetching user and resume:', error);
    }
  };

  fetchUserAndResume(); // Run the combined function
}, [navigate]);

  const generate = async (data: FormData | null) => {
    if (!data) {
      console.error("No data to generate summary from.");
      return;
    }
  
    try {
      const res = await generateSummary(data); // Assuming this is an API call to generate the summary
      setFormData((prev) => {
        if (!prev) return null; // Handle case where formData is null
        return {
          ...prev,
          summary: res, // Update only the summary field
        };
      });
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };
  
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
                {exp.startDate} - {exp.endDate}
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
          onSubmit={(data:FormData) => {
            setFormData(data);
            setShowInfoForm(false);
          }}
          initialData={formData}
          currentUserId={currentUserId}
        />
      )}

      {/* Button to Open InfoForm */}
      <button
        onClick={() => {
          if (!currentUserId) {
            alert("You must login to create or edit resume. Please login");
            navigate("/login");
          } else {
            setShowInfoForm(true);
          }
        }}
        style={{ cursor: 'pointer', marginTop: '20px' }}
      >
        Input Information
      </button>

      <button
        onClick={() => generate(formData)}
        style={{cursor: 'pointer', marginTop: '20px'}}
        >
        Generate Summary with AI
      </button>
    </div>
  );
};

export default ResumeEditor;