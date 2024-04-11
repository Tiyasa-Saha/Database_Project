import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/OrderHistoryPage.css'; // Import CSS file for styling

const OrderHistoryPage = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await axios.get('http://localhost:3000/cart/orders');
                const formattedOrders = response.data.map(order => {
                    const totalPrice = order.cart.reduce((total, item) => total + parseFloat(item.price), 0);
                    return { ...order, totalPrice };
                });
                setOrderHistory(formattedOrders);
                const sales = formattedOrders.reduce((total, order) => total + order.totalPrice, 0);
                setTotalSales(sales);
            } catch (error) {
                console.error('Error fetching order history:', error);
            }
        };
        fetchOrderHistory();
    }, []);

    return (
        <div className="order-history-container">
            <h1>Order History</h1>
            <table className="order-history-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orderHistory.map(order => (
                        <tr key={order._id}>
                            <td>{order.userId}</td>
                            <td>${order.totalPrice.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="total-sales">Total Sales: ${totalSales.toFixed(2)}</p>
        </div>
    );
};

export default OrderHistoryPage;
