import '../styles/PaymentSuccessPage.css';
import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import '../styles/PaymentSuccessPage.css';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';


const PaymentSuccessPage = ({userName, cartlength}) => {
 
        const navigate = useNavigate();

        useEffect(() => {
            const redirectTimeout = setTimeout(() => {
                navigate('/');
            }, 5000);
            return () => {
                clearTimeout(redirectTimeout);
            };
        }, [navigate]);

        // rest of the code...
   

    return (
        <div className="payment-success">
            <NavBar storeName={"My Online Book Store"} userName={userName} cartItemCount={cartlength} />

            <FaCheckCircle className="success-icon" />
            <h1 className="success-heading">Payment Successful!</h1>
            <p className="success-message">Your payment has been successfully processed.</p>
            <p className="thank-you-message">Thank you for your purchase!</p>
        </div>
    );
};


export default PaymentSuccessPage;
