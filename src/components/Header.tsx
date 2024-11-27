// Header.tsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../stylesheets/header.css';
import { getUsername } from '../api';
import { useNavigate } from 'react-router-dom';


function Header() {
  const [currentUserName, setCurrentUserName] = useState<string>();
  const navigate = useNavigate();

  const handleLogout = async () => { 
    try {
      const response = await fetch('http://localhost:2424/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
  
      if (response.ok) {
        setCurrentUserName('Login'); 
        alert(data.message);
        navigate('/login');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out. Please try again.');
    }
  };
  useEffect(() => {
    const fetchUsername= async () => {
      try {
        const username = await getUsername();
        setCurrentUserName(username || 'Login');
        console.log("username: ",username);
      } catch (error) {
        console.error("Error fetching username:", error);
        setCurrentUserName('Login');
      }
    };
    fetchUsername();
  }, []);
  return (
    <header className="header">
      <div className="blue-line"></div>
      <div className="header-content">
        <h1 className="site-name">
            <Link to="/" style={{ textDecoration: 'None'}}>
                BuildResume
            </Link>
        </h1>
        <div className="nav-buttons">
          <Link to="/resume-editor">
            <button>Resume</button>
          </Link>
          <Link to="/feedboard">
            <button>Feedboard</button>
          </Link>
          <div className="login-container">
            <button
              className="login-button"
              onClick={() => {
                if (currentUserName === 'Login') {
                  navigate('/login');
                }
              }}
            >
              {currentUserName}
            </button>
            {currentUserName !== 'Login' && (
              <div className="logout-option" onClick={handleLogout}>
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;