const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming your database connection file

// GET /books: Fetch all books
router.get('/books', async (req, res) => {
  try {
    const dbConn = await db();
    const books = await dbConn.collection('books').find().toArray(); 
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error); 
    res.status(500).json({ error: 'Error fetching books' }); 
  }
});

// Add more routes for books as needed:
// GET /books/:id  - Fetch a single book
// POST /books     - Create a new book
// PUT /books/:id  - Update book details
// DELETE /books/:id - Delete a book

module.exports = router;
