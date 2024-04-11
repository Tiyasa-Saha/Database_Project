import React, { useState } from 'react';
import '../styles/SearchComponent.css'; // Import CSS file for custom styling

const SearchComponent = ({ onSearch }) => {
    const [searchType, setSearchType] = useState('title'); // Default to title
    const [searchTerm, setSearchTerm] = useState(''); 
    
    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm, searchType);
    };

    
    return (<div className='container'>

        <form className="search-form" onSubmit={handleSubmit}> 
            <select className="search-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="genre">Genre</option>
            </select>
            <input className="search-input" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..."/>
            <button className="search-button" type="submit">Search</button>
       </form>
       </div>
    );
};

export default SearchComponent;
