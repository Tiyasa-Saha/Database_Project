// Admin.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar, Nav, Dropdown , Table} from 'react-bootstrap';
import ActiveCart from './AdminComponents/ActiveCart';
import './styles/Admin.css';
import OrderHistoryPage from './AdminComponents/OrderHistoryPage';
const Admin = () => {
    const [books, setBooks] = useState([]);
    const [selectedTab, setSelectedTab] = useState('inventory');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/books');
                setBooks(response.data);
            
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);


    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand>Admin Panel</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Dropdown onSelect={(eventKey) => setSelectedTab(eventKey)}>
                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                Select Page
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="inventory">Inventory</Dropdown.Item>
                                <Dropdown.Item eventKey="active-cart">Active Cart</Dropdown.Item>
                                <Dropdown.Item eventKey="order-history">Order History</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {selectedTab === 'inventory' && (
                <div className="admin-container">
                <h1 className="admin-heading">Admin Page - All Books and Inventories</h1>
                <Table striped bordered hover className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Genre</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book._id}>
                                <td>{book.title}</td>
                                <td>{book.authors}</td>
                                <td>{book.genre}</td>
                                <td>{book.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            )}
            {selectedTab === 'active-cart' && (
                <ActiveCart />
            )}
            {selectedTab === 'order-history' && (
               < OrderHistoryPage/>
            )}
            
        </div>
    );
};

export default Admin;
