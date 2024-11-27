import React, { useState, useEffect, useRef } from 'react';
import InfoForm from './InfoForm';
import Section from './Section';
import { getResume, generateSummary, generateAIFeedback, submitFeedback, fetchCurrentUserId, getUsername } from '../api';
import { useNavigate } from 'react-router-dom';

// Import the libraries
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface FormData {
  personalInformation: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    imageUrl?: string;
  };
  experience: {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    imageUrl?: string;
  }[];
  summary: string;
  education: {
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
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

  // Ref for the resume content
  const resumeContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserAndResume = async () => {
      try {
        const userId = await fetchCurrentUserId();
        setCurrentUserId(userId);

        const data = await getResume();
        if (data == null || !data) {
          setFormData(null);
          return; // Early return if no data
        }

        const transformedData: FormData = {
          personalInformation: {
            firstname: data.personalInformation?.firstname || '',
            lastname: data.personalInformation?.lastname || '',
            email: data.personalInformation?.email || '',
            phone: data.personalInformation?.phone || '',
            address: data.personalInformation?.address || '',
            imageUrl: data.personalInformation?.imageUrl || '',
          },
          experience:
            data.experience?.map((exp: any) => ({
              jobTitle: exp.jobTitle || '',
              company: exp.company || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              description: exp.description || '',
              imageUrl: exp.imageUrl || '',
            })) || [],
          summary: data.summary || '',
          education:
            data.education?.map((edu: any) => ({
              degree: edu.degree || '',
              institution: edu.institution || '',
              startDate: edu.startDate || '',
              endDate: edu.endDate || '',
              imageUrl: edu.imageUrl || '',
            })) || [],
          skills: data.skills || [],
          feedbacks:
            data.feedbacks?.map((feedback: any) => ({
              reviewer: feedback.reviewer || '',
              comment: feedback.comment || '',
              date: feedback.date || '',
            })) || [],
        };

        setFormData(transformedData);
      } catch (error) {
        console.error('Error fetching user and resume:', error);
      }
    };

    fetchUserAndResume();
  }, [navigate]);

  const generate = async (data: FormData | null) => {
    if (!data) {
      console.error('No data to generate summary from.');
      return;
    }

    try {
      const res = await generateSummary(data);
      setFormData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          summary: res,
        };
      });
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const generateFeedback = async (data: FormData | null) => {
    if (!data) {
        console.error("No data to generate feedback from.");
        return;
    }

    try {
        const res = await generateAIFeedback(data);
        var resume = await getResume();
        console.log(getUsername())
        submitFeedback(resume._id, "AI", res);
        navigate(`/feedback/${resume._id}`)
    } catch (error) {
        console.error("Error setting a feedback");
    }
  }

  // Function to download PDF with margins
  const downloadPDF = () => {
    if (!resumeContentRef.current) return;

    html2canvas(resumeContentRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');

      // Define margins
      const marginLeft = 40; // Left margin in points
      const marginTop = 40; // Top margin in points
      const marginRight = 40; // Right margin in points
      const marginBottom = 40; // Bottom margin in points

      // Calculate available width and height
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - marginLeft - marginRight;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = marginTop;

      pdf.addImage(imgData, 'PNG', marginLeft, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - marginTop - marginBottom;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + marginTop;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', marginLeft, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - marginTop - marginBottom;
      }

      pdf.save('resume.pdf');
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      {/* Resume Content */}
      <div ref={resumeContentRef}>
        <h1>
          {formData
            ? `${formData.personalInformation.firstname} ${formData.personalInformation.lastname}’s Resume`
            : 'Your Name’s Resume'}
        </h1>

        {/* Personal Image */}
        {formData?.personalInformation.imageUrl && (
          <img
            src={formData.personalInformation.imageUrl}
            alt="Profile"
            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
          />
        )}

        <Section title="Contact Information">
          {formData ? (
            <p>
              {formData.personalInformation.phone} | {formData.personalInformation.email} |{' '}
              {formData.personalInformation.address}
            </p>
          ) : (
            <p>Phone Number | Email | Location</p>
          )}
        </Section>

        <Section title="Professional Summary">
          {formData ? <p>{formData.summary}</p> : <p>Briefly describe your professional background...</p>}
        </Section>

        <Section title="Experience">
          {formData ? (
            formData.experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <h3>
                  {exp.jobTitle} at {exp.company}
                </h3>
                <p>
                {new Date(exp.startDate).toLocaleDateString()}~{new Date(exp.endDate).toLocaleDateString()}
                </p>
                {exp.imageUrl && (
                  <img
                    src={exp.imageUrl}
                    alt="Experience"
                    style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                  />
                )}
                <p>{exp.description}</p>
              </div>
            ))
          ) : (
            <p>List your experiences here...</p>
          )}
        </Section>

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

        <Section title="Education">
          {formData ? (
            formData.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <h3>
                  {edu.degree} at {edu.institution}
                </h3>
                <p>
                {new Date(edu.startDate).toLocaleDateString()}~{new Date(edu.endDate).toLocaleDateString()}
                </p>
                {edu.imageUrl && (
                  <img
                    src={edu.imageUrl}
                    alt="Education"
                    style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                  />
                )}
              </div>
            ))
          ) : (
            <p>List your educational background...</p>
          )}
        </Section>
      </div>
      
          {/* InfoForm Modal */}
          {showInfoForm && (
            <InfoForm
              onClose={() => setShowInfoForm(false)}
              onSubmit={(data: FormData) => {
                setFormData(data);
                setShowInfoForm(false);
              }}
              initialData={formData}
              currentUserId={currentUserId}
            />
          )}

      {/* Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => {
            if (!currentUserId) {
              alert('You must login to create or edit resume. Please login');
              navigate('/login');
            } else {
              setShowInfoForm(true);
            }
          }}
          style={{ cursor: 'pointer', marginRight: '10px' }}
        >
          Input Information
        </button>

        <button onClick={() => generate(formData)} style={{ cursor: 'pointer', marginRight: '10px' }}>
          Generate Summary with AI
        </button>

        <button onClick={downloadPDF} style={{ cursor: 'pointer' }}>
          Download PDF
        </button>
      </div>
      <div style={{ marginTop: '20px'}}>
          <button onClick={() => {
            if (!currentUserId) {
              alert('You must login to create or edit resume. Please login');
              navigate('/login');
            } else {
              generateFeedback(formData);
            }}} style={{cursor: "pointer", marginRight: "10px"}}>
            Generate Feedback from AI
          </button>
      </div>

    </div>
  );
};

export default ResumeEditor;