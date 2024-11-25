import React from 'react';
import '../stylesheets/homepage.css';
import { useNavigate } from 'react-router-dom';



function Homepage() {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      <section className="hero">
        <h1 className="hero-title">
            <p>
                Build Resume<br/>
                with AI powered assistant<br/>
                and get a JOB today!<br/>
            </p>
        </h1>
        <p className="hero-description">
          Your journey to building professional resumes starts here. <br/>Create or upload your resume and get closer to your dream job today!
        </p>
        <div className="cta-buttons">
          <button className="cta create-button" onClick={() => navigate('/resume-editor')}>Create New Resume</button>
          <button className="cta upload-button" onClick={() => navigate('/resume-editor')}>Edit Existing Resume</button>
        </div>
      </section>{/*hero end*/}
      <section className="features">
        <h2>Features</h2>
        <ul>
          <li>AI-Powered Resume Builder
            <p>
                Built for student to create or edit<br/>
                their resume using constructive feedback<br/>
                AI powered assistant
            </p>
          </li>
          <li>Sample Resume Templates
            <p>
            There are resumes templates available<br/>
            that are fit to industry standards.<br/>
            The user can look up sample resumes to<br/>
            reinforce their resumes   
            </p>
          </li>
          <li>Resume Feedback from the Community
            <p>
            The feedboard is provided so that the user<br/> 
            has a space to receive resume feedback<br/>
            by other users. 
            </p>
          </li>
        </ul>
      </section> {/*feature end*/}
    </div>
  );
}

export default Homepage;
