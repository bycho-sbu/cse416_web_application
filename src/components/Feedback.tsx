import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Use useLocation instead of useParams
import '../stylesheets/Feedback.css';
import { getFeedback, submitFeedback } from '../api'; 

interface Feedback {
  reviewer: string,
  comment: string;
  date: Date;
}


export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState<string>('');
  const { resumeId } = useParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.user._id || ''); 
        } else {
          console.error('Failed to fetch user info. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // fetching feedback with the resumeid
  useEffect(() => {
    const fetchFeedback = async () => {
      if (resumeId) {
        const feedbackData = await getFeedback(resumeId);
        setFeedbackList(feedbackData);
      }
    };

    if (resumeId) {
      fetchFeedback();
    }
  }, [resumeId]); 

  // submitting feedback to the resume
  const handleSubmitFeedback = async () => {
    if (newFeedback.trim() && resumeId && currentUserId) {
      try {
        await submitFeedback(resumeId, currentUserId, newFeedback);
        setNewFeedback('');
        const updatedFeedback = await getFeedback(resumeId);
        setFeedbackList(updatedFeedback);
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    }
  };
  
  return (
    <div className="feedback-page">
      <h2 className="feedback-title">Feedback</h2>

      <div className="feedback-list">
      {feedbackList.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        feedbackList.map((feedback, index) => (
          <div key={index} className="feedback-card">
            <p className="feedback-comment">{feedback.comment}</p>
            <p className="feedback-reviewer">- {feedback.reviewer}</p>
            <p className="feedback-date">{new Date(feedback.date).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>

      <div className="feedback-submit-box">
        <textarea
          value={newFeedback}
          onChange={(e) => setNewFeedback(e.target.value)}
          placeholder="Leave feedback..."
        />
        <button onClick={handleSubmitFeedback} className="feedback-submit-button">
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
