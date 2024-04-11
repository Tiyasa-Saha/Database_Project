const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const uri = "mongodb+srv://titlitiyasa:8JDcHHs7ZkOBY4Yh@dbproject.hyo95lu.mongodb.net/?retryWrites=true&w=majority&appName=DbProject";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};


let db;

module.exports = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    return client.db("online_bookstore");  // Still return your main database object

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports.createAdmins = async () => { 
  const db = await module.exports(); // Reuse the existing module.exports to get the database
  
  const adminsData = [ 
      { email: 'admin1@example.com', password: await hashPassword('password') },
       // ... more admins
  ];

  const adminsCollection = db.collection('admins');
  await adminsCollection.insertMany(adminsData);
  console.log('Admins created!');
};

