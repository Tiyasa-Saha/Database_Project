const https = require('https');
const fs = require('fs');

const apiKey = 'AIzaSyD7YL8TabCxdeKobRaB8yopLQBYWtCVs7g'; 
const maxResults = 20; 

const subjects = [
    "fiction", 
    "science", 
    "history", 
    "biography", 
    "technology",
    "art" 
];

const booksData = [];

function fetchBooks() {
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${randomSubject}&maxResults=${maxResults}&key=${apiKey}`;

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                const parsedData = JSON.parse(data);
                if ('items' in parsedData) {
                    parsedData.items.forEach(item => {
                        const title = item.volumeInfo.title || 'Not Available';
                        const authors = item.volumeInfo.authors || ['Not Available'];
                        const description = item.volumeInfo.description || 'Not Available';
                        const cover = item.volumeInfo.imageLinks?.thumbnail || 'Not Available';
                        const format = item.volumeInfo.printType || 'Not Available';
                        const genre = item.volumeInfo.categories || ['Not Available'];
                        const id = item.id;
                        const quantity = generateRandomQuantity(); 
                        const book = { 
                            title, authors, description, cover, format, genre,
                            price: generateRandomPrice() ,  quantity , id
                        };
                        booksData.push(book); 
                    });                    
                } else {
                    console.log('No books found.');
                }
            } else {
                console.error(`API request failed. Status code: ${res.statusCode}`);
            }
            saveBooksData(); // Save the fetched data 
        });
    }).on('error', (err) => {
        console.error('Request error:', err);
    });
}
function generateRandomQuantity() { 
    const minQuantity = 10;
    const maxQuantity = 150;
    return Math.floor(Math.random() * (maxQuantity - minQuantity + 1)) + minQuantity; 
}


function generateRandomPrice() {
    const minPrice = 20;
    const maxPrice = 70;
    const price = Math.random() * (maxPrice - minPrice) + minPrice;
    return price.toFixed(2); 
}

function saveBooksData() {
    fs.readFile('books.json', 'utf8', (err, existingData) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('books.json not found. Creating a new file.');
            } else {
                console.error('Error reading books.json:', err);
                return; 
            }
        } 

        let books = [];
        if (existingData) {
            try {
               books = JSON.parse(existingData);
            } catch (error) {
               console.error('Error parsing books.json:', error);
               return;
            }
        }

        // Append new books
        books.push(...booksData);  

        const jsonData = JSON.stringify(books, null, 2);
        fs.writeFile('books.json', jsonData, (err) => {
            if (err) {
                console.error('Error saving books data:', err);
            } else {
                console.log(`Collected ${books.length} books and saved to 'books.json'`);
            }
        });
    });
}


fetchBooks(); 
