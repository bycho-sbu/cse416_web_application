import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../stylesheets/Feedboard.css'
import { getResumes } from '../api';

interface Resume {
  _id: string;
  userId: string;
  personalInformation: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
  };
  experience: Array<{
    jobTitle: string;
    company: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }>;
  summary: string;
  education: Array<{
    degree: string;
    institution: string;
    startDate: Date;
    endDate: Date;
  }>;
  skills: string[];
  feedbacks: Array<{
    reviewer: string;
    comment: string;
    date: Date;
  }>;
  createdAt: string;  
  updatedAt: string;
}

export default function Feedboard() {

  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [resumes, setResumes] = useState<Resume[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      const resumeData = await getResumes();
      setResumes(resumeData);
    };
    
    fetchResumes();
  }, []);

  // button action 
  const sortedResumes = resumes.sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
  })
  // pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedResumes.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedResumes.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  //navigate to feedback
  const handleViewFeedback = (resumeId: string) => {
    navigate(`/feedback/${resumeId}`); 
  };
  

  return (
    <div className="feedboard">
      <h2 className="feedboard-title">Feedboard</h2>
      <div className="feedboard-controls">

        {/* filtering old/new buttons */}
        <select
          className="feedboard-sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className="feedboard-table-container">
        <table className="feedboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/*  to be replaced with schema */}
            {currentItems.map((resume) => (
              <tr key={resume._id}>
                <td>{resume.personalInformation.firstname} {resume.personalInformation.lastname}</td>
                <td>{resume.personalInformation.email}</td>
                <td>{new Date(resume.createdAt).toLocaleDateString()}</td>
                <td>
                {/* navigate to feedback */}
                  <button className="feedboard-button"
                  onClick={() => handleViewFeedback(resume._id)}>View Feedback</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* pagination */}
      <div className="feedboard-pagination">
        {/* prev button */}
        <button 
          className="feedboard-page-button" 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
        {/* less than */}
          &lt;
        </button>
        {/* for each index i in total pages craete new button */}
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`feedboard-page-button ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        {/* next button */}
        <button 
          className="feedboard-page-button" 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages || totalPages < 1}
        >
          &gt;               
          {/* greater than */}
        </button>
      </div>
    </div>
  )
}