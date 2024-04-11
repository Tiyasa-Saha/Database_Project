import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BookCard from './Components/BookCard';
import './styles/homepage.css';
import SearchComponent from './Components/SearchComponent';
import NavBar from './Components/NavBar';
const HomePage = ({ setCartLength , userName}) => {
    const [books, setBooks] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [cSize , setCSize] = useState(0);
    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            const result = await axios.get('http://localhost:3000/books');
            setBooks(result.data);
            setSearchResults(result.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCart = useCallback(async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found in local storage');
            }
            const response = await axios.get(`http://localhost:3000/cart?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setCart(response.data.items || []);
            if (response.data.items.length > 0) {
                setCartLength(response.data.items.length);
                setCSize(response.data.items.length);
            }else{
                setCartLength(0);
                setCSize(0);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }, [setCartLength]);

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleSearch = (searchTerm, searchType) => {
        if (!searchTerm) {
            setSearchResults(books);
            return;
        }
        const filteredBooks = books.filter(book => {
            switch (searchType) {
                case 'title':
                    return book.title.toLowerCase().includes(searchTerm.toLowerCase());
                case 'author':
                    return book.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
                case 'genre':
                    return book.genre.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()));
                default:
                    return true;
            }
        });
        setSearchResults(filteredBooks);
    };

    return (
        <div>
            <NavBar storeName={"My Online Book Store"} userName={userName} cartItemCount={cSize} />
            <SearchComponent onSearch={handleSearch} />
            {isLoading ? (
                <div className="loader">Loading books...</div>
            ) : (
                <div className='bookcontainer'>
                    {searchResults.map(book => (
                        <div key={book._id}>
                            <BookCard book={book} fetchCart={fetchCart} setCart={setCart} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
