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
                  <ul className="list-unstyled">
                    <li><strong>Full Name:</strong> Sol Choi</li>
                    <li><strong>Major:</strong> Computer Science</li>
                    <li><strong>jobTitle:</strong> Software Engineering</li>
                  </ul>
                  <button className="btn btn-primary mt-3">Edit Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume link Section */}


        {/* feedback link */}
        
      </div>
    </div>
  );
}

export default Dashboard;