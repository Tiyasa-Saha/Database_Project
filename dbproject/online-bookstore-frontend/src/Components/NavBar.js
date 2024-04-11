import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/Navbar.css'; // Import custom CSS for styling


const NavBar = ({ storeName, userName, cartItemCount }) => {
    

    const handleLogout = () => {
        // Clear local storage
        localStorage.clear();
        // Redirect to home page
        window.location.href = '/';
    };

    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand">
                    {storeName}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Add any left-aligned Nav items here */}
                    </Nav>
                    <Nav className="ms-auto">
                        {/* Add any right-aligned Nav items here */}
                        <Nav.Link as={Link} to="/cart" className="nav-link">
                            <FontAwesomeIcon icon={faShoppingCart} className="icon" />
                            Cart ({cartItemCount})
                        </Nav.Link>
                        <Nav.Link href="#" className="nav-link">
                            <FontAwesomeIcon icon={faUser} className="icon" />
                            Hi, {userName}
                        </Nav.Link>
                        <Nav.Link href="#" onClick={handleLogout} className="nav-link">
                            <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
