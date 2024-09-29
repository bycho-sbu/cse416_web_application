import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  return (
    <div className="container">
      {/* Header */}
      <header className="mt-4 text-left">
        <h1>Welcome to Sol's Dashboard</h1>
      </header>

      {/* Profile Section */}
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              {/* Profile Avatar */}
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: "150px" }}
              />
              <h3>Profile</h3>
              <div className="card mt-4">
                <div className="card-body">
                  <h5>About you</h5>
                  <p>
                    I am a senior studying computer science.
                  </p>
                  <ul className="list-unstyled">
                    <li><strong>Full Name:</strong> Sol Choi</li>
                    <li><strong>Major:</strong> Computer Science</li>
                    <li><strong>Desired Industry:</strong> Software Engineering</li>
                  </ul>
                  <button className="btn btn-primary mt-3">Edit Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Preview Section */}
        <div className="col-md-8">
          <div className="text-center mb-4">
            <h2>Sol's Resume</h2>
          </div>
          <div className="row">
            <div className="col-md-6">
              {/* Resume Version 1 */}
              <div className="card">
                <div className="card-body">
                  <img
                    src="https://via.placeholder.com/300x400"
                    alt="Resume Preview 1"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              {/* Resume Version 2 */}
              <div className="card">
                <div className="card-body d-flex flex-column align-items-center">
                  <img
                    src="https://via.placeholder.com/300x400"
                    alt="Resume Preview 2"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;