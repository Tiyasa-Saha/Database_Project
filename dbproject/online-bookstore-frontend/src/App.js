import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./HomePage";
import CartPage from "./Components/CartPage";
import Admin from './Admin';
import PaymentSuccessPage from './Components/PaymentSuccessPage';
import Auth from './Components/Auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartlength, setCartLength] = useState(0);
  const [userName, setUserName] = useState('');

  // Check for existing authentication (e.g., from LocalStorage)
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken'); 
    if(storedToken === 'admin'){
      setIsAdmin(true);
      setLoading(false); // Set loading to false when admin is detected
    } else if (storedToken) {
      setIsLoggedIn(true);
      setLoading(false); // Set loading to false when user is logged in
    } else {
      setLoading(false); // Set loading to false when no authentication token is found
    }
  }, []); 

  return (
    <div className="App">
      <Router>
        {loading ? (
          // Display loader while checking authentication
          <div>Loading...</div>
        ) : (
          // Render routes once authentication is checked
          <Routes>
            <Route 
              path="/" 
              element={
                isAdmin ? (
                  <Admin />
                ) : (
                  isLoggedIn ? (
                    <HomePage setCartLength={setCartLength} userName={userName} />
                  ) : (
                    <Auth setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />
                  )
                )
              } 
            />
            <Route path="/cart" element={<CartPage userName={userName} cartlength={cartlength}/>} />
            <Route path="/Payment" element={<PaymentSuccessPage userName={userName} cartlength={cartlength}/>} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
