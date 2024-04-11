const db = require('../db');  // Import your db.js module

(async () => {
    await db(); // Establish database connection
    await db.createAdmins(); 
   await db.close(); // Close the client after creating admins
})();
