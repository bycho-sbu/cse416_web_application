import axios from 'axios';
import { FormData } from './components/ResumeEditor';

// @@@@@@@@@@@@@@@@@ line 56 uncomment @@@@@@@@@@@@@@@@@@@

const API_URL = 'http://localhost:2424'; 

//fetching all resumes
export const getResumes = async () => {
  try {
    const response = await axios.get(`${API_URL}/resumes`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }
};

//fetching resume by userId
export const getResume = async () => {
  const response = await axios.get(`${API_URL}/resume`);
  return response.data;
};

// fetching resume by resumeId
export const getResumeByResumeId = async (resumeId: any) => {
  const response = await axios.get(`${API_URL}/resume/${resumeId}`);
  return response.data;
};

export const getFeedback = async (resumeId: string) => {
  try {
    const response = await axios.get(`${API_URL}/feedbacks/${resumeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
};

export const submitFeedback = async (resumeId: string, userId: string, comment: string) => {
 
    // check for mandatory input
    if (!resumeId || !userId || !comment) {
      throw new Error('All fields are required');
    }
    try {
      const response = await axios.post(`${API_URL}/feedbacks`, {
        resumeId,
        userId,
        comment,
      });
      return response.data; 
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;  
    }
  };

  export const generateSummary = async (resumeInfo: FormData | any): Promise<string> => {
    try {
      console.log("RESUME:", resumeInfo);
      const response = await axios.post(`${API_URL}/generateSummary`, resumeInfo);
      console.log("Response:", response.data);
      return response.data; // Return the data from the API response
    } catch (error) {
      console.error("Error:", error);
      return ""; // Return an empty string or handle the error as needed
    }
  };
  
  export const submitResume = async (resumeData: any) => {
    try {
      const response = await axios.post(`${API_URL}/saveResume`, resumeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data; 
    } catch (error) {
      console.error('Error submitting resume:', error);
      throw new Error('Failed to submit resume');
    }
  };

  export const fetchCurrentUserId = async () => {
    try {
      const response = await axios.get(`${API_URL}/fetchCurrentUser`);
      return response.data.userId;
    } catch (error) {
      console.error('Failed to fetch current user', error);
      throw new Error('Failed to fetch current user');
    }
  };

