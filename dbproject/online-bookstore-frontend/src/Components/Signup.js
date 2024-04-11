import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/signup', {
        email,
        password,
        name,
      });
      // Handle successful signup (redirect, display message, etc.)
      console.log('Signup successful:', response);
    } catch (error) {
      setError(error.response.data.error || 'Signup failed');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /><br/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /><br/>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" /><br/>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
