import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
    name: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:2424/api/user', {
          credentials: 'include',
        });
        const data = await response.json();
  
        if (response.ok) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Error checking auth:', error);
        setUser(null);
      }
    };
  
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:2424/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
  
      if (response.ok) {
        setUser(null);
        alert(data.message);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out. Please try again.');
    }
  };
  
  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:2424/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials for session management
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
  
      if (response.ok) {
        setUser(data.user); // Set the user state upon successful login
        alert(data.message);
        window.location.href = data.redirectUrl;
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:2424/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error signing up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:2424/auth/google';
  };

  // User is logged in. homepage 
  if (user) {
    return (
      <div className="container">
        <h1>Welcome, {user.name}!</h1>
        <button onClick={handleLogout} className="btn btn-primary">
          Logout
        </button>
      </div>
    );
  } else return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4 text-primary">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="text-center text-muted mb-4">
            {isSignUp ? 'Sign up for a new account' : 'Sign in to your account'}
          </p>

          {/* Email and password fields */}
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Toggle between Login and Sign Up */}
          <button
            onClick={isSignUp ? handleSignUp : handleLogin}
            disabled={loading}
            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
            style={{ height: '48px' }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isSignUp ? 'Signing up...' : 'Signing in...'}
              </>
            ) : (
              isSignUp ? 'Sign up' : 'Sign in'
            )}
          </button>

          {/* Google OAuth Login */}
          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline-danger w-100 mt-3 d-flex align-items-center justify-content-center"
            style={{ height: '48px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google me-2" viewBox="0 0 16 16">
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
            </svg>
            Sign in with Google
          </button>

          <div className="mt-3 text-center">
            <small className="text-muted">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"} 
              <button className="btn btn-link p-0" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </small>
          </div>
        </div>
        {/* <div className="card-footer text-center text-muted">
          <small>By signing in or signing up, you agree to our Terms of Service and Privacy Policy.</small>
        </div> */}
      </div>
    </div>
  );
}