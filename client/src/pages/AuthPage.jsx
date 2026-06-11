import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

/**
 * AuthPage component — handles registration and login tabs with inline field validations.
 */
const AuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Inline Errors
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Reset errors when switching tabs.
   */
  const switchTab = (toLogin) => {
    setIsLoginTab(toLogin);
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  /**
   * Validate fields on the client side before sending.
   */
  const validateForm = () => {
    let isValid = true;

    // Email validation (both login and register)
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation (both login and register)
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Username validation (register only)
    if (!isLoginTab) {
      if (!username) {
        setUsernameError('Username is required');
        isValid = false;
      } else if (username.trim().length < 3) {
        setUsernameError('Username must be at least 3 characters');
        isValid = false;
      } else if (/\s/.test(username)) {
        setUsernameError('Username must not contain spaces');
        isValid = false;
      } else {
        setUsernameError('');
      }
    }

    return isValid;
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLoginTab) {
        // --- LOGIN ---
        const res = await API.post('/auth/login', { email, password });
        login(res.data.user, res.data.token);
        navigate('/');
      } else {
        // --- REGISTER ---
        await API.post('/auth/register', { username, email, password });
        setSuccessMessage('Registration successful! Redirecting to login...');
        
        // Auto-redirect to login tab after 2 seconds
        setTimeout(() => {
          switchTab(true);
          // Auto-fill register details for convenience
          setPassword('');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 || err.response?.status === 401) {
        const msg = err.response.data.message;
        // Map specific error messages to fields if possible
        if (msg.toLowerCase().includes('username')) {
          setUsernameError(msg);
        } else if (msg.toLowerCase().includes('email')) {
          setEmailError(msg);
        } else if (msg.toLowerCase().includes('password')) {
          setPasswordError(msg);
        } else {
          setGeneralError(msg);
        }
      } else {
        setGeneralError('Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yt-dark text-yt-text flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-yt-gray p-8 rounded-2xl border border-yt-light-gray shadow-2xl">
        {/* Youtube-like logo logo header */}
        <div className="flex items-center justify-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-yt-red rounded-sm px-2 py-0.5 flex items-center justify-center">
            <svg className="w-6 h-4 text-white" fill="currentColor" viewBox="0 0 24 17">
              <polygon points="9.5,4.5 9.5,12.5 16.5,8.5" fill="white"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">YouTube Clone</span>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-yt-light-gray mb-6">
          <button
            onClick={() => switchTab(true)}
            className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors ${
              isLoginTab ? 'border-b-2 border-white text-white' : 'text-yt-text-secondary hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab(false)}
            className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors ${
              !isLoginTab ? 'border-b-2 border-white text-white' : 'text-yt-text-secondary hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Message indicators */}
        {generalError && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-lg text-center">
            {generalError}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 bg-green-500/10 border border-green-500 text-green-500 text-sm p-3 rounded-lg text-center">
            {successMessage}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div>
              <label className="block text-sm font-medium mb-1.5 text-yt-text-secondary" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setUsernameError(''); }}
                placeholder="Choose a username"
                className={`input-field ${usernameError ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5 text-yt-text-secondary" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              placeholder="name@example.com"
              className={`input-field ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-yt-text-secondary" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
              placeholder="••••••••"
              className={`input-field ${passwordError ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-yt-text text-yt-dark py-3 rounded-full font-semibold transition-colors duration-200 mt-6 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLoginTab ? 'Sign In' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
