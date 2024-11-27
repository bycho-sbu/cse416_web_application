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

  // **Added handleSubmit function**
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (isSignUp) {
      handleSignUp();
    } else {
      handleLogin();
    }
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
  } else
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4 text-primary">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-center text-muted mb-4">
              {isSignUp ? 'Sign up for a new account' : 'Sign in to your account'}
            </p>

            {/* **Wrapped inputs and button in a form with onSubmit handler** */}
            <form onSubmit={handleSubmit}>
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
                type="submit" // **Set button type to submit**
                disabled={loading}
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                style={{ height: '48px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isSignUp ? 'Signing up...' : 'Signing in...'}
                  </>
                ) : isSignUp ? (
                  'Sign up'
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Google OAuth Login */}
            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline-danger w-100 mt-3 d-flex align-items-center justify-content-center"
              style={{ height: '48px' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-google me-2"
                viewBox="0 0 16 16"
              >
                <path d="..." />
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