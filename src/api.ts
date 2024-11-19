import axios from 'axios';

const API_URL = 'http://localhost:2525'; 

export const getResumes = async () => {
  try {
    const response = await axios.get(`${API_URL}/resumes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }
};

export const getFeedback = async (resumeId: string) => {
  try {
    const response = await axios.get(`${API_URL}/feedbacks/${resumeId}`);
    console.log("Fetched feedback:", response.data); 
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
};

export const submitFeedback = async (resumeId: string, userId: string, comment: string) => {
    console.log("resumeId",resumeId);
    console.log("reviewer",userId);
    console.log("comment",comment);

    try {
      const response = await axios.post(`${API_URL}/feedbacks`, {
        resumeId,
        reviewer: userId,
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
      const response = await axios.post(`${API_URL}/resumes`, resumeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data; // Assuming backend returns data after successfully storing the resume
    } catch (error) {
      console.error('Error submitting resume:', error);
      throw new Error('Failed to submit resume');
    }
  };
