import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import '../styles/CartPage.css'; // Import CSS file for custom styling

const CartPage = ({ userName, cartlength }) => {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            setIsLoading(true);
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
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, []);

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        try {
            await axios.put(`http://localhost:3000/cart/items/${itemId}`, {
                quantity: newQuantity 
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            setCart(cart.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item)); 

        } catch (error) {
            console.error('Error updating quantity:', error); 
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await axios.delete(`http://localhost:3000/cart/items/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'X-User-Id': localStorage.getItem('userId')
                }
            });
    
            setCart(cart.filter(item => item._id !== itemId));
    
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const clearCartAndRedirect = () => {
        const userId = localStorage.getItem('userId');
        axios.post('http://localhost:3000/cart/clear' , {userId})
            .then(response => {
                if (response.status === 200) {
                    console.log('Cart cleared successfully');
                } else {
                    throw new Error('Failed to clear cart');
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleOrder = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.post('http://localhost:3000/cart/orders', { userId, cart });
            console.log(response.data.message); // Log success message
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <div className="cart-page">
            <NavBar storeName={"My Online Book Store"} userName={userName} cartItemCount={cartlength} />
            <h1>Your Shopping Cart</h1>
            {isLoading ? (
                <p>Loading Cart...</p>
            ) : cart.length === 0 ? (
                <p>Your cart is empty. Add some books!</p>
            ) : ( 
                <> 
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Quantity</th>
                                <th>SubTotal</th>
                                <th></th> {/* Column for 'remove' button */}
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.title}</td>
                                    <td> 
                                        <input 
                                            type="number" 
                                            value={item.quantity} 
                                            onChange={(e) => handleQuantityChange(item.id, e.target.value)} 
                                        /> 
                                    </td>
                                    <td>${(item.price * item.quantity).toFixed(2)}</td> 
                                    <td>
                                        <button onClick={() => handleRemove(item._id)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="cart-total">Total: ${calculateTotalPrice()}</div>
                    <Link to="/payment">
                        <button onClick={() => {
                            handleOrder();
                            clearCartAndRedirect();
                        }}>Proceed to Checkout</button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default CartPage;
