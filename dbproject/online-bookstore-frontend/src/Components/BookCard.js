// import {React , useState,} from 'react';
// import { Card, Button, Col, Row } from 'react-bootstrap';
// import axios from 'axios';
// const BookCard = ({ book, fetchCart  }) => {

//     const [quantity, setQuantity] = useState(1); // State for quantity
  
//     const [isAdded, setIsAdded] = useState(false); 

//     const handleAddToCart = async () => {
//       try {
//           await axios.post('http://localhost:3000/cart/items', {
//               bookId: book.id, // Assuming your book schema aligns with cart schema
//               quantity: quantity,
//               price : book.price,
//               title : book.title,

//               userId : localStorage.getItem('userId')
//           }, {
//               headers: {
//                   'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//               } 
              
//           });
          
//           // Success! You might want to provide feedback to the user
//           // Or optionally refetch the cart data
//           fetchCart()
//       } catch (error) {
//           console.error('Error adding to cart:', error);
//           // Handle the error 
//       }
//   };

//     // const handleQuantityChange = (event) => {
//     //   setQuantity(parseInt(event.target.value, 10)); // Ensure it's an integer
//     // };



//   return (
//     <Card style={{ width: '400px',padding : '10px' }}>
//       <Row noGutters> {/* Ensures no gutters between columns */}
//         <Col sm={4}>
//           <Card.Img 
//             variant="left"
//             src={book.cover ? book.cover : '/placeholder-book-cover.jpg'} 
//             alt={book.title} 
//             style={{ maxWidth : '140px' , height: '200px', objectFit: 'contain' }} 
//           />
//         </Col>
//         <Col sm={8}>
//           <Card.Body>
//             <Card.Title>{book.title}</Card.Title>
//             <Card.Text>By {book.authors}</Card.Text>
//             {/* <Card.Text>Stock : {book.quantity}</Card.Text> */}

//             <Card.Text style={{ marginBottom: 'auto' }}>
//               Price: ${book.price}
//             </Card.Text>
//             {/* <div>
//               <label htmlFor="quantity">Quantity: </label>
//               <select id="quantity" value={quantity} onChange={handleQuantityChange}>
              
//                   <option value="1">1</option> 
//                   <option value="2">2</option>
                
//               </select>
//             </div> */}
//             <Button variant="primary" onClick={handleAddToCart}>
//                 {/* Conditional Button Text */}
//                 {isAdded ? 'Added' : 'Add to Cart'} 
//             </Button>
//           </Card.Body>
//         </Col>
//       </Row>
//     </Card>
//   );
// };

// export default BookCard;
import React, { useState } from 'react';
import { Card, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import '../styles/BookCard.css'; // Import CSS file for custom styling

const BookCard = ({ book, fetchCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = async () => {
        try {
            await axios.post('http://localhost:3000/cart/items', {
                bookId: book.id,
                quantity: quantity,
                price: book.price,
                title: book.title,
                userId: localStorage.getItem('userId')
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            fetchCart();
            setIsAdded(true); // Set state to indicate item is added to cart
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Handle the error 
        }
    };

    return (
        <Card className="book-card">
            <Row noGutters>
                <Col sm={4}>
                    <Card.Img
                        variant="left"
                        src={book.cover ? book.cover : '/placeholder-book-cover.jpg'}
                        alt={book.title}
                        className="book-image"
                    />
                </Col>
                <Col sm={8}>
                    <Card.Body className="d-flex flex-column">
                        <Card.Title className="book-title">{book.title}</Card.Title>
                        <Card.Text className="book-author">By {book.authors}</Card.Text>
                        <Card.Text className="book-price">Price: ${book.price}</Card.Text>
                        <Button
                            variant="primary"
                            onClick={handleAddToCart}
                            disabled={isAdded} // Disable button if item is already added
                        >
                            {isAdded ? 'Added' : 'Add to Cart'}
                        </Button>
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
};

export default BookCard;

