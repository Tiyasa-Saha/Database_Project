const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb'); 
const db = require('../db'); // Assuming your database connection file

// Sign Up Endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const dbConn = await db();  
    const userCollection = dbConn.collection('Users'); 

    // Check for existing user
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await userCollection.insertOne({ email, password: hashedPassword, name });

    res.status(201).json({ message: 'User created successfully', userId: result.insertedId }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const dbConn = await db();  
    const userCollection = dbConn.collection('Users'); 

    // Find the user
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' }); 
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' }); 
    }

    // Successful login (For simplicity, just send a success message)
    res.json({ message: 'Login successful' }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router; 
