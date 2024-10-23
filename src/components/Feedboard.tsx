import React, { useState, useEffect } from 'react'
import '../stylesheets/Feedboard.css'

interface Resume {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  dateCreated: string;
}

export default function Feedboard() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  // TODO
  const itemsPerPage = 2

  useEffect(() => {
    // to be replaced with schema
    const dummyData: Resume[] = [
      { id: '1', name: 'john1223', jobTitle: 'software engineer', company: 'Google', email: 'john@gmail.com', dateCreated: '2024-10-25' },
      { id: '2', name: 'andrew3', jobTitle: 'software engineer', company: 'Amazon', email: 'andrew@gmail.com', dateCreated: '2024-10-24' },
      { id: '3', name: 'kenny', jobTitle: 'ceo', company: 'xyz', email: 'kenny@gmail.com', dateCreated: '2024-10-23' },
    ]
    setResumes(dummyData)
  }, [])

  // searching 
  // filtering by jobTitle
  // most people would look up by job
  const filteredResumes = resumes.filter(resume =>
    resume.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // button action 
  const sortedResumes = [...filteredResumes].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    } else {
      return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
    }
  })
  // pagination const
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedResumes.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedResumes.length / itemsPerPage)
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="feedboard">
      <h2 className="feedboard-title">All Resume</h2>
      <div className="feedboard-controls">
        {/*  searching */}
        <input
          type="search"
          placeholder="Search..."
          className="feedboard-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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
              <th>Job Title</th>
              <th>Company</th>
              <th>Email</th>
              <th>Date Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/*  to be replaced with schema */}
            {currentItems.map((resume) => (
              <tr key={resume.id}>
                <td>{resume.name}</td>
                <td>{resume.jobTitle}</td>
                <td>{resume.company}</td>
                <td>{resume.email}</td>
                <td>{new Date(resume.dateCreated).toLocaleDateString()}</td>
                <td>
                {/* to be implemented */}
                  <button className="feedboard-button">View Resume</button>
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
          disabled={currentPage === totalPages}
        >
          &gt;               
          {/* greater than */}
        </button>
      </div>
    </div>
  )
}