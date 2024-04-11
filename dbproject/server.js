const express = require('express');
const db = require('./db'); // Assuming your db.js file is in the same directory
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000
const authRoutes = require('./routes/auth.js');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cartFunctions = require('./cart.js');
const {createUser, findUserByEmail} = require('./user_functions.js');

const router = express.Router();

// app.use(bodyParser.json());  //
app.use(cors()); // Add this to your server.js 
app.use(express.json());


const booksRouter = require('./routes/books'); // Import your book routes
app.get('/books', booksRouter);

// app.use('/auth', authRoutes);

app.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
    
        const creationResult = await createUser(email, password, name); 
    
        if (creationResult.success) {
          res.status(201).json({ message: 'User created successfully', userId: creationResult.userId });
        } else {
          res.status(500).json({ error: creationResult.error });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user' }); // General error handling
      }
    });



  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const dbConn = await db();  
      const userCollection = dbConn.collection('Users'); 
      const adminsCollection = dbConn.collection('admins');

      //Admin Login Check
      const admin = await adminsCollection.findOne({ email});
      if (admin) {
          const isPasswordValid = await bcrypt.compare(password, admin.password);
          if (isPasswordValid) {
              const token = "admin";
              return res.json({ message: 'Login successful', token });
          }
      }
      // Find the user
      const user = await userCollection.findOne({ email });
      if (!user) {
          return res.status(400).json({ error: 'Invalid email or password' }); 
      }
  
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(400).json({ error: 'Invalid email or password' }); 
      }
  
      // Successful Login 
      const userId = user._id.toString(); // Convert to string if needed
      const token = `user-${userId}`; 
      const userName = user.name;
      res.json({ message: 'Login successful', token , userId , userName}); 
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Login failed' });
  }
  
  });

  router.get('/all', async (req, res) => {
    try {
        const carts = await cartFunctions.getAllCarts();
        console.log(carts)
        res.json(carts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch carts' });
    }
});



// 1. Get Cart
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId; // Get userId from request body
  
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const cart = await cartFunctions.getCart(userId);
console.log(cart)
        res.json(cart || { items: [] }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// 2. Add Item to Cart
router.post('/items',  async (req, res) => {
  try {
      const { bookId, quantity , userId , title, price} = req.body;
      const success = await cartFunctions.addItemToCart(userId, bookId, quantity , title, price);
      if (success) {
          res.status(200).json({ message: 'Item added to cart' });
      } else {
          res.status(500).json({ error: 'Failed to add item' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add item' });
  }
});


// 3. Update Item Quantity
router.put('/items/:itemId',  async (req, res) => {
  try {
      const itemId = req.params.itemId;
      const { quantity } = req.body;

      const success = await cartFunctions.updateItemQuantity(req.userId, itemId, quantity);
      if (success) {
          res.status(200).json({ message: 'Item quantity updated' });
      } else {
          res.status(404).json({ error: 'Item not found in cart' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update item' });
  }
});

// 4. Remove Item from Cart
router.delete('/items/:itemId', async (req, res) => {
  try {
      const itemId = req.params.itemId;
      const userId = req.headers['x-user-id']; 
      const success = await cartFunctions.removeItemFromCart(userId, itemId);
console.log(userId, itemId, success)
      if (success) {
          res.status(200).json({ message: 'Item removed from cart' });
      } else {
          res.status(404).json({ error: 'Item not found in cart' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to remove item' });
  }
});

router.post('/clear', async (req, res) => {
  try {
      const userId = req.body.userId; 
      console.log(userId)
      // Assuming you pass the userId in the request body
      if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
      }
      const cleared = await cartFunctions.clearCart(userId);
      if (cleared) {
          res.status(200).json({ message: 'Cart cleared successfully' });
      } else {
          res.status(404).json({ error: 'Cart not found or already empty' });
      }
  } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Failed to clear cart' });
  }
});

router.post('/orders', async (req, res) => {
  try {
      const { userId, cart } = req.body;
    console.log(userId, cart)
      // Assuming you have a function to save orders to the database
      const orderSaved = await cartFunctions.saveOrder(userId, cart);

      if (orderSaved) {
          res.status(201).json({ message: 'Order placed successfully' });
      } else {
          res.status(500).json({ error: 'Failed to place order' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to place order' });
  }
});



router.get('/orders', async (req, res) => {
  try {
      // Assuming you have a function to fetch order history from the database
      const orderHistory = await cartFunctions.getOrderHistory();
      res.status(200).json(orderHistory);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch order history' });
  }
});



app.use('/cart', router);




(async () => {
  try {
    await db(); // Connect to MongoDB
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

