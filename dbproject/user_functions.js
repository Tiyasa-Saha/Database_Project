const { ObjectId } = require('mongodb'); // For working with MongoDB IDs
const db = require('./db');
const bcrypt = require('bcrypt'); // Assuming you'll implement hashing

async function createUser(email, password, name) {
  if (!password) {
    console.error("Error creating user: password is required");
    return { success: false, error: 'Password is required' };
  }

  try {
    const dbConn = await db();  
    const userCollection = dbConn.collection('Users'); 

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userCollection.insertOne({
      email,
      password: hashedPassword,
      name 
    });
    return { success: true, userId: result.insertedId };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: 'Error creating user' }; 
  }
}

async function findUserByEmail(email) {
  try {
    const dbConn = await db();  
    const userCollection = dbConn.collection('Users'); 
    return await userCollection.findOne({ email }); 
  } catch (error) {
    console.error("Error finding user:", error);
    return null; 
  }
}

// ... More functions for updating users, etc.

module.exports = {
    createUser,
    findUserByEmail,
    // ...other user-related functions
}