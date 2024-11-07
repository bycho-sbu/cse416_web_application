import React, { useState } from 'react';
import '../stylesheets/Feedback.css';

interface Feedback {
  id: string;
  reviewer: string;
  comment: string;
}

{/*   To be implemented later:
      I am thinking maybe feedback page can be navigated via 
      profile page and the feedboard page by pressing feedback button. 
      The feedback page displays user's resume along with the feedback received. 
      Also, depending on the user session == curr user.id,
      if its their own resume -> display reply text box only
      else(other user) -> display feedback textbox only*/}

// placeholder for existing feedback data
const dummyFeedback: Feedback[] = [
  {
    id: '1',
    reviewer: 'Legend27',
    comment: 'blahblahblah balh',
  },
  {
    id: '2',
    reviewer: 'Davidkimchi',
    comment: 'blahblahblah balh',
  },
];

export default function FeedbackPage() {
  // 
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(dummyFeedback);
  
  // simulating session user data (will be replaced with actual session check)
  const currentUserId: string = 'user123'; // placeholder for current user ID
  const resumeOwnerId: string = 'user456'; // placeholder for resume owner's ID

  const handleReply = (feedbackId: string) => {
    // logic for replying to a specific feedback (placeholder for now)
  };

  return (
    <div className="feedback-page">
      <h2 className="feedback-title">Feedback</h2>

      <div className="feedback-list">
        {feedbackList.map((feedback) => (
          <div key={feedback.id} className="feedback-card">
            <p className="feedback-comment">{feedback.comment}</p>
            <p className="feedback-reviewer">- {feedback.reviewer}</p>
            {currentUserId === resumeOwnerId && (
              <button
                onClick={() => handleReply(feedback.id)}
                className="feedback-reply-button"
              >
                Reply
              </button>
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
}
