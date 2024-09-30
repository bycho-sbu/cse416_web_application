import React from 'react';
import '../stylesheets/homepage.css';

function Homepage() {
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
          <button className="cta create-button">Create New Resume</button>
          <button className="cta upload-button">Upload Existing Resume</button>
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
          <button className="cta feature-button">Get Started</button>
        </ul>
      </section> {/*feature end*/}
    </div>
  );
}

export default Homepage;
