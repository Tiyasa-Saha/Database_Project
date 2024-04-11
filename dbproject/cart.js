const db = require('./db'); // Import your MongoDB connection function from 'db.js'
const { ObjectId } = require('mongodb'); 

const collectionName = 'carts'; // Name of your MongoDB collection for carts

// Get Cart for the Current User

 
const getCart = async (userId) => {
  const dbConn = await db();
  const collection = dbConn.collection(collectionName);

  const cart = await collection.findOne({ userId });

  // If cart is empty or undefined, return an empty cart
  if (!cart || !cart.items) {
      return { items: [] };
  }

  // Create a map to store unique book IDs and their quantities
  const bookMap = new Map();

  // Iterate through each item in the cart
  cart.items.forEach(item => {
      // Check if the book ID already exists in the map
      if (bookMap.has(item.bookId)) {
          // If the book ID exists, update the quantity
          const existingItem = bookMap.get(item.bookId);
          existingItem.quantity += item.quantity;
          // Optionally, update other keys like price and title
          existingItem.price = item.price;
          existingItem.title = item.title;
      } else {
          // If the book ID does not exist, add it to the map
          bookMap.set(item.bookId, { ...item }); // Use spread operator to clone the item object
      }
  });

  // Convert the map back to an array of items
  const aggregatedItems = Array.from(bookMap.values());

  // Update the cart items with the aggregated items
  cart.items = aggregatedItems;

  return cart;
};


// Create a Cart (If it doesn't exist)
async function createCart(userId) {
  const dbConn = await db();
  const collection = dbConn.collection(collectionName);
  const result = await collection.insertOne({ userId, items: [] }); 
  return result.insertedId; // Return the ID of the newly created cart
}

// // Add item to cart
async function addItemToCart(userId, bookId, quantity, title, price) {
    const dbConn = await db();
    const collection = dbConn.collection(collectionName);

  try{
    let existingDocument = await collection.findOne({ userId });
      const updateResult = await collection.findOneAndUpdate( 
          { userId },
          {  
              
              $push: {  
                  items: {_id: new ObjectId(),  bookId, quantity, title, price } 
                } 
            }, 
            { upsert: true, returnDocument: "after" } );

            if (updateResult && updateResult.value) {
                return updateResult.value;
            } else if (existingDocument) {
                // If updateResult is null but the existing document is found, return the existing document
                return existingDocument;
            } else {
                throw new Error("Document not found or update failed.");
            }
        
        } catch(error){
            console.error("Error updating document:", error);
            throw error;
        }
}




// Update item quantity in cart
async function updateItemQuantity(userId, itemId, quantity) {
  const dbConn = await db();
  const collection = dbConn.collection(collectionName);
  const updateResult = await collection.updateOne(
    { userId, "items.bookId": itemId },
    { $set: { "items.$.quantity": quantity } }
  );

  return updateResult.modifiedCount === 1; // Return true if the update was successful
}

// Remove item from cart
async function removeItemFromCart(userId, itemId) {
  const dbConn = await db();
  const collection = dbConn.collection(collectionName);
  const NitemId = new ObjectId(itemId);
  const updateResult = await collection.updateOne(
    { userId },
    { $pull: { items: { _id: NitemId} } }
  );

  return updateResult.modifiedCount === 1; // Return true if the update was successful
}

async function getAllCarts() {
  const dbConn = await db();
  const collection = dbConn.collection(collectionName);
  return collection.find({}).toArray();
}

async function clearCart(userId) {
  try {
      const dbConn = await db(); // Connect to MongoDB
      const collection = dbConn.collection('carts'); // Access the carts collection
      const result = await collection.updateOne({ userId }, { $set: { items: [] } }); // Clear the items array
      return result.modifiedCount === 1; // Return true if the cart was successfully cleared
  } catch (error) {
      console.error('Error clearing cart:', error);
      throw error; // Propagate the error
  }
}

async function saveOrder(userId, cart) {
  try {
      // Connect to the database
      const dbConn = await db();
      const orderHistoryCollection = dbConn.collection('order_history');

      // Insert the order details into the collection
      const result = await orderHistoryCollection.insertOne({
          userId,
          cart,
          createdAt: new Date()
      });

      return result.insertedCount === 1;
  } catch (error) {
      console.error('Error saving order:', error);
      return false;
  }
}

const getOrderHistory = async () => {
  try {
      const dbConn = await db(); // Connect to the database
      const orderHistoryCollection = dbConn.collection('order_history'); // Assuming your collection name is 'order_history'

      // Fetch order history from the database
      const orderHistory = await orderHistoryCollection.find({}).toArray();
      return orderHistory;
  } catch (error) {
      console.error('Error fetching order history:', error);
      throw error; // Throw the error to handle it in the calling function
  }
};

module.exports = { 
  getCart,
  createCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  getAllCarts,
  clearCart,
  saveOrder,
  getOrderHistory
};
