

import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import '../styles/Auth.css'; // Import custom CSS for styling

const Auth = ({ setIsLoggedIn , setUserName,setIsAdmin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:3000/login', { email, password });
        if(response.data.userName){
          setUserName(response.data.userName);
        }
        if (response.data.token === 'admin') {
          localStorage.setItem('authToken', response.data.token);
          setIsAdmin(true);

        } else if (response.status === 200) {
          localStorage.setItem('authToken', response.data.token);
          if (response.data.userId) {
            localStorage.setItem('userId', response.data.userId);
          } else {
            console.warn('userId not found in login response');
          }
          setIsLoggedIn(true);
        } else {
          window.alert('Login failed');
        }
      } else {
    try {
      const response = await axios.post('http://localhost:3000/signup', {
        email,
        password,
        name,
      });
      // Handle successful signup (redirect, display message, etc.)
      alert('Signup successful');
      setIsLogin(true);
    } catch (error) {
      setError(error.response.data.error || 'Signup failed');
    }
      }
    } catch (error) {
      setError(error.response?.data.error || 'Authentication failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>
          {!isLogin && (
            <div className="input-group">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            </div>
          )}
          <button type="submit" className="auth-button">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p className="toggle-message">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
