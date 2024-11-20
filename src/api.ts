import axios from 'axios';

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

//fetching one by userid
export const getResume = async (userId: string) => {
  const response = await axios.get(`${API_URL}/resume/${userId}`);
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
  
  export const submitResume = async (resumeData: any) => {
    console.log("resumedata",resumeData);
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
