import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const ActiveCart = () => {
    const [carts, setCarts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCarts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:3000/cart/all');
                const filteredCarts = response.data.filter(cart => cart.items.length > 0);
                setCarts(filteredCarts);
            } catch (error) {
                console.error('Error fetching carts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCarts();
    }, []);

    return (
        <div>
            <h1>Active Carts</h1>
            {isLoading ? (
                <p>Loading carts...</p>
            ) : carts.length === 0 ? (
                <p>No carts found.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Total Items</th>
                            <th>Total Price</th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        {carts.map(cart => (
                            <tr key={cart.userId}>
                                <td>{cart.userId}</td>
                                <td>{cart.items.length}</td>
                                <td>${calculateTotalPrice(cart.items)}</td>
                     
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

// Function to calculate the total price of items in a cart
const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0).toFixed(2);
};

export default ActiveCart;
