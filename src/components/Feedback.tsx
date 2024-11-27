import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Use useLocation instead of useParams
import '../stylesheets/Feedback.css';
import { getFeedback, submitFeedback, fetchCurrentUserId } from '../api'; 
import ResumeView from './ResumeView';
import { useNavigate } from 'react-router-dom';

interface Feedback {
  reviewer: { name: string } | null,
  comment: string;
  date: Date;
}

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState<string>('');
  const { resumeId } = useParams();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the current user ID
        const userId = await fetchCurrentUserId();
        setCurrentUserId(userId || '');

        // Fetch feedback only if resumeId is available
        if (resumeId) {
          const feedbackData = await getFeedback(resumeId);
          setFeedbackList(feedbackData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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
      <ResumeView resumeId={resumeId} />
      <h2 className="feedback-title">Feedback</h2>

      <div className="feedback-list">
      {feedbackList.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        feedbackList.map((feedback, index) => (
          <div key={index} className="feedback-card">
            <p className="feedback-comment">{feedback.comment}</p>
            <p className="feedback-reviewer">- {feedback.reviewer?.name}</p>
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
        <button onClick={() => {
          if (!currentUserId) {
            alert("You must login to create or edit resume. Please login");
            navigate("/login");
          } else {
            handleSubmitFeedback();
          }
        }} className="feedback-submit-button">
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
