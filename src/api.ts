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

  export const getUserName = async () => {
    try {
      const response = await axios.get(`${API_URL}/getUserName`);
      console.log(response);
      return response.data.userName;
    } catch (error) {
      console.error('Failed to fetch user name', error);
      throw new Error('Failed to fetch user name');
    }
  };
