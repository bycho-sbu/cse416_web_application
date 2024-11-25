import React, { useState } from 'react';
import '../App.css';
import { submitResume } from '../api';

interface EducationEntry {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface ExperienceEntry {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface InfoFormProps {
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData: FormData | null; 
  currentUserId: string | null;
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

const InfoForm: React.FC<InfoFormProps> = ({ onClose, onSubmit, initialData, currentUserId }) => {
  const [firstName, setFirstName] = useState(initialData?.personalInformation.firstname || '');
  const [lastName, setLastName] = useState(initialData?.personalInformation.lastname || '');
  const [email, setEmail] = useState(initialData?.personalInformation.email || '');
  const [phone, setPhone] = useState(initialData?.personalInformation.phone || '');
  const [location, setLocation] = useState(initialData?.personalInformation.address || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [education, setEducation] = useState<EducationEntry[]>(initialData?.education || []);
  const [experience, setExperience] = useState<ExperienceEntry[]>(initialData?.experience || []);
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);

  // Methods to add entries
  const handleAddEducation = () => {
    setEducation([
      ...education,
      { institution: '', degree: '', startDate: '', endDate: '' },
    ]);
  };

  const handleAddExperience = () => {
    setExperience([
      ...experience,
      {
        company: '',
        jobTitle: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const handleAddSkill = () => {
    setSkills([...skills, '']);
  };

  // Methods to remove entries
  const handleRemoveEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperience = [...experience];
    newExperience.splice(index, 1);
    setExperience(newExperience);
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resumeData: FormData = {
      personalInformation: {
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
        address: location,
      },
      experience: experience.map((exp) => ({
        jobTitle: exp.jobTitle,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
      })),
      summary: summary,
      education: education.map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        startDate: edu.startDate,
        endDate: edu.endDate,
      })),
      skills: skills,
      feedbacks: [], 
    };
    

    try {
      await submitResume(resumeData); 
      alert('Resume submitted successfully!');
      onSubmit(resumeData); 
      onClose(); 
    } catch (error) {
      alert('There was an error submitting your resume. Please try again.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '5%',
        left: '50%',
        transform: 'translate(-50%, -5%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxHeight: '90%',
        overflowY: 'auto',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.3)',
        width: '80%',
      }}
    >
      <h2>Resume Information</h2>
      <form onSubmit={handleSubmit}>
        {/* Contact Information */}
        <h3>Contact Information</h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          {/* First Name */}
          <div style={{ flex: '1 1 calc(50% - 10px)' }}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          {/* Last Name */}
          <div style={{ flex: '1 1 calc(50% - 10px)' }}>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          {/* Email */}
          <div style={{ flex: '1 1 calc(50% - 10px)' }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          {/* Phone */}
          <div style={{ flex: '1 1 calc(50% - 10px)' }}>
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          {/* Location */}
          <div style={{ flex: '1 1 100%' }}>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Professional Summary */}
        <h3>Professional Summary</h3>
        <div style={{ marginBottom: '20px' }}>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Briefly describe your professional background, skills, and goals."
            style={{ width: '100%', height: '80px' }}
          />
        </div>

        {/* Education */}
        <h3>Education</h3>
        {education.map((edu, index) => (
          <div
            key={index}
            style={{
              marginBottom: '20px',
              borderBottom: '1px solid #ccc',
              paddingBottom: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {/* Institution */}
              <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                <label htmlFor={`institution-${index}`}>Institution</label>
                <input
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].institution = e.target.value;
                    setEducation(newEducation);
                  }}
                  style={{ width: '100%' }}
                />
              </div>
              {/* Degree */}
              <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                <label htmlFor={`degree-${index}`}>Degree</label>
                <input
                  id={`degree-${index}`}
                  value={edu.degree}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].degree = e.target.value;
                    setEducation(newEducation);
                  }}
                  style={{ width: '100%' }}
                />
              </div>
              {/* Start Date */}
              <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                <label htmlFor={`edu-startDate-${index}`}>Start Date</label>
                <input
                  id={`edu-startDate-${index}`}
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].startDate = e.target.value;
                    setEducation(newEducation);
                  }}
                  style={{ width: '100%' }}
                />
              </div>
              {/* End Date */}
              <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                <label htmlFor={`edu-endDate-${index}`}>End Date</label>
                <input
                  id={`edu-endDate-${index}`}
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].endDate = e.target.value;
                    setEducation(newEducation);
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            {/* Remove Education Button */}
            <button
              type="button"
              onClick={() => handleRemoveEducation(index)}
              style={{ marginTop: '10px' }}
            >
              Remove Education
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddEducation}
          style={{ marginBottom: '20px' }}
        >
          Add Education
        </button>

        {/* Experience */}
        <h3>Work Experience</h3>
        {experience.map((exp, index) => (
          <div
            key={index}
            style={{
              marginBottom: '20px',
              borderBottom: '1px solid #ccc',
              paddingBottom: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {/* Company */}
              <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                <label htmlFor={`company-${index}`}>Company</label>
                <input
                  id={`company-${index}`}
                  value={exp.company}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].company = e.target.value;
                    setExperience(newExperience);
                  }}
                  style={{ width: '100%' }}
                />
              </div>
              {/* Role */}
              <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                <label htmlFor={`role-${index}`}>Role</label>
                <input
                  id={`role-${index}`}
                  value={exp.jobTitle}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].jobTitle = e.target.value;
                    setExperience(newExperience);
                  }}
                  style={{ width: '100%' }}
                />
              </div>
              {/* Start Date */}
              <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                <label htmlFor={`exp-startDate-${index}`}>Start Date</label>
                <input
                  id={`exp-startDate-${index}`}
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].startDate = e.target.value;
                    setExperience(newExperience);
                  }}
                  style={{ width: '100%' }}
                />
              </div>
              {/* End Date */}
              <div style={{ flex: '1 1 calc(50% - 10px)' }}>
                <label htmlFor={`exp-endDate-${index}`}>End Date</label>
                <input
                  id={`exp-endDate-${index}`}
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[index].endDate = e.target.value;
                    setExperience(newExperience);
                  }}
                  style={{ width: '100%' }}
                />
              </div>
              {/* Responsibilities */}
              <div style={{ flex: '1 1 100%' }}>
                <label htmlFor={`responsibilities-${index}`}>
                  Responsibilities
                </label>
                <textarea
                  id={`responsibilities-${index}`}
                  value={exp.description}
                  onChange={(e) => {
                    const newExperience = [...experience];
                    newExperience[
                      index
                    ].description = e.target.value;
                    setExperience(newExperience);
                  }}
                  placeholder="Describe your responsibilities and achievements."
                  style={{ width: '100%', height: '60px' }}
                />
              </div>
            </div>
            {/* Remove Experience Button */}
            <button
              type="button"
              onClick={() => handleRemoveExperience(index)}
              style={{ marginTop: '10px' }}
            >
              Remove Experience
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddExperience}
          style={{ marginBottom: '20px' }}
        >
          Add Experience
        </button>

        {/* Skills */}
        <h3>Skills</h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              style={{
                flex: '1 1 calc(33% - 10px)',
                position: 'relative',
              }}
            >
              <input
                value={skill}
                onChange={(e) => {
                  const newSkills = [...skills];
                  newSkills[index] = e.target.value;
                  setSkills(newSkills);
                }}
                placeholder="Enter a skill"
                style={{ width: '100%' }}
              />
              {/* Remove Skill Button */}
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddSkill}
          style={{ marginBottom: '20px' }}
        >
          Add Skill
        </button>

        {/* Submit and Cancel Buttons */}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ marginRight: '10px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default InfoForm;