import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import random
import string
import uuid

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')

# Access the online_bookstore database
db = client['online_bookstore']

# Create collections
book_collection = db['Books']
cart_item_collection = db['Cart_items']
genre_collection = db['Genres']
inventory_collection = db['Inventory']
order_detail_collection = db['Order_details']
order_table_collection = db['Order_table']
payment_collection = db['Payments']
review_collection = db['Reviews']
shopping_cart_collection = db['Shopping_carts']
user_account_collection = db['User_accounts']

# Function to find genre by name
def find_genre(genre_name):
    # Perform a case-insensitive search for the genre name
    return genre_collection.find_one({"GenreName": {"$regex": f"^{genre_name}$", "$options": "i"}})

# Function to generate a unique ID
def generate_id():
    return ObjectId()

import random

# Function to get a random inventory ID without replacement
def get_random_inventory_id():
    inventory_ids = [inventory['_id'] for inventory in inventory_collection.find({}, {'_id': 1})]
    selected_id = random.choice(inventory_ids)
    inventory_ids.remove(selected_id)  # Remove the selected ID to prevent replacement
    return selected_id

# Function to generate a unique ISBN using uuid
def generate_isbn():
    return str(uuid.uuid4())


# Define your genres
initial_genres = [
    {"GenreName": "Fiction"},
    {"GenreName": "Non-fiction"},
    {"GenreName": "Mystery"},
    {"GenreName": "Romance"},
    {"GenreName": "Science Fiction"}]
# Insert sample genre data into the genre collection
genre_collection.insert_many(initial_genres)

# 2. Insert Records into the Inventory Collection
# Function to generate random inventories
def generate_random_inventories(num_inventories):
    inventories = []
    for _ in range(num_inventories):
        inventory = {
            "Stock": random.randint(1, 100)  # Assuming stock is a random integer between 1 and 100
        }
        inventories.append(inventory)
    return inventories

# Generate 50 random inventories
random_inventories = generate_random_inventories(50)

# Insert the random inventories into the collection
inventory_collection.insert_many(random_inventories)


books_data = [ {'title': 'To Kill a Mockingbird', 'author': 'Harper Lee', 'genre': 'Fiction', 'price': 26.22},
    {'title': '1984', 'author': 'George Orwell', 'genre': 'Science Fiction', 'price': 24.39},
    {'title': 'Pride and Prejudice', 'author': 'Jane Austen', 'genre': 'Romance', 'price': 64.74},
    {'title': 'The Great Gatsby', 'author': 'F. Scott Fitzgerald', 'genre': 'Fiction', 'price': 29.3},
    {'title': 'The Catcher in the Rye', 'author': 'J.D. Salinger', 'genre': 'Fiction', 'price': 37.6},
    {'title': 'The Hobbit', 'author': 'J.R.R. Tolkien', 'genre': 'Fantasy', 'price': 39.21},
    {'title': 'Animal Farm', 'author': 'George Orwell', 'genre': 'Political Satire', 'price': 50.17},
    {'title': 'Lord of the Flies', 'author': 'William Golding', 'genre': 'Fiction', 'price': 62.68},
    {'title': 'The Odyssey', 'author': 'Homer', 'genre': 'Epic Poetry', 'price': 35.97},
    {'title': 'The Lord of the Rings', 'author': 'J.R.R. Tolkien', 'genre': 'Fantasy', 'price': 27.67},
    {'title': 'Brave New World', 'author': 'Aldous Huxley', 'genre': 'Science Fiction', 'price': 50.18},
    {'title': 'Moby-Dick', 'author': 'Herman Melville', 'genre': 'Adventure', 'price': 25.22},
    {'title': 'The Kite Runner', 'author': 'Khaled Hosseini', 'genre': 'Fiction', 'price': 35.01},
    {'title': 'Frankenstein', 'author': 'Mary Shelley', 'genre': 'Gothic Fiction', 'price': 44.23},
    {'title': 'Wuthering Heights', 'author': 'Emily Brontë', 'genre': 'Gothic Fiction', 'price': 64.85},
    {'title': 'The Picture of Dorian Gray', 'author': 'Oscar Wilde', 'genre': 'Gothic Fiction', 'price': 63.49},
    {'title': 'Great Expectations', 'author': 'Charles Dickens', 'genre': 'Fiction', 'price': 32.56},
    {'title': 'The Adventures of Sherlock Holmes', 'author': 'Arthur Conan Doyle', 'genre': 'Mystery', 'price': 38.25},
    {'title': 'Crime and Punishment', 'author': 'Fyodor Dostoevsky', 'genre': 'Psychological Fiction', 'price': 52.98},
    {'title': "Alice's Adventures in Wonderland", 'author': 'Lewis Carroll', 'genre': 'Fantasy', 'price': 69.12},
    {'title': 'Dracula', 'author': 'Bram Stoker', 'genre': 'Gothic Horror', 'price': 50.69},
    {'title': 'The Chronicles of Narnia', 'author': 'C.S. Lewis', 'genre': 'Fantasy', 'price': 22.99},
    {'title': 'Les Misérables', 'author': 'Victor Hugo', 'genre': 'Historical Fiction', 'price': 25.88},
    {'title': 'The Secret Garden', 'author': 'Frances Hodgson Burnett', 'genre': "Children's Literature", 'price': 63.77},
    {'title': 'Jane Eyre', 'author': 'Charlotte Brontë', 'genre': 'Gothic Fiction', 'price': 67.12},
    {'title': 'The Count of Monte Cristo', 'author': 'Alexandre Dumas', 'genre': 'Adventure', 'price': 66.71},
    {'title': 'Little Women', 'author': 'Louisa May Alcott', 'genre': 'Coming-of-Age Fiction', 'price': 57.96},
    {'title': 'Sense and Sensibility', 'author': 'Jane Austen', 'genre': 'Romance', 'price': 68.8},
    {'title': 'War and Peace', 'author': 'Leo Tolstoy', 'genre': 'Historical Fiction', 'price': 50.6},
    {'title': 'The Alchemist', 'author': 'Paulo Coelho', 'genre': 'Quest', 'price': 32.39},
    {'title': 'Anna Karenina', 'author': 'Leo Tolstoy', 'genre': 'Realist Fiction', 'price': 32.34},
    {'title': 'Gone with the Wind', 'author': 'Margaret Mitchell', 'genre': 'Historical Fiction', 'price': 59.83},
    {'title': 'The Grapes of Wrath', 'author': 'John Steinbeck', 'genre': 'Realist Fiction', 'price': 39.02},
    {'title': 'A Tale of Two Cities', 'author': 'Charles Dickens', 'genre': 'Historical Fiction', 'price': 51.85},
    {'title': 'One Hundred Years of Solitude', 'author': 'Gabriel García Márquez', 'genre': 'Magical Realism', 'price': 68.91},
    {'title': 'The Road', 'author': 'Cormac McCarthy', 'genre': 'Post-Apocalyptic Fiction', 'price': 23.5},
    {'title': 'The Bell Jar', 'author': 'Sylvia Plath', 'genre': 'Semi-Autobiographical', 'price': 23.95},
    {'title': 'The Shining', 'author': 'Stephen King', 'genre': 'Horror', 'price': 38.87},
    {'title': 'The Road Less Traveled', 'author': 'M. Scott Peck', 'genre': 'Self-Help', 'price': 23.58},
    {'title': 'The Hunger Games', 'author': 'Suzanne Collins', 'genre': 'Science Fiction', 'price': 63.99},
    {'title': 'The Da Vinci Code', 'author': 'Dan Brown', 'genre': 'Mystery', 'price': 30.5},
    {'title': 'Fahrenheit 451', 'author': 'Ray Bradbury', 'genre': 'Science Fiction', 'price': 61.8},
    {'title': 'The Girl with the Dragon Tattoo', 'author': 'Stieg Larsson', 'genre': 'Crime Fiction', 'price': 53.13},
    {'title': 'The Help', 'author': 'Kathryn Stockett', 'genre': 'Historical Fiction', 'price': 65.57},
    {'title': 'The Fault in Our Stars', 'author': 'John Green', 'genre': 'Young Adult Fiction', 'price': 67.83},
    {'title': 'The Lovely Bones', 'author': 'Alice Sebold', 'genre': 'Gothic Fiction', 'price': 28.35},
    {'title': 'The Perks of Being a Wallflower', 'author': 'Stephen Chbosky', 'genre': 'Coming-of-Age Fiction', 'price': 68.71},
    {'title': 'The Book Thief', 'author': 'Markus Zusak', 'genre': 'Historical Fiction', 'price': 27.4},
    {'title': 'The Giver', 'author': 'Lois Lowry', 'genre': 'Dystopian Fiction', 'price': 58.09},
    {'title': 'Life of Pi', 'author': 'Yann Martel', 'genre': 'Adventure Fiction', 'price': 52.03},
    {'title': 'The Martian', 'author': 'Andy Weir', 'genre': 'Science Fiction', 'price': 59.15},
    {'title': 'The Girl on the Train', 'author': 'Paula Hawkins', 'genre': 'Thriller', 'price': 24.47},
    {'title': 'Me Before You', 'author': 'Jojo Moyes', 'genre': 'Romance', 'price': 39.04},
    {'title': 'The Night Circus', 'author': 'Erin Morgenstern', 'genre': 'Fantasy', 'price': 44.42},
    {'title': 'The Goldfinch', 'author': 'Donna Tartt', 'genre': 'Fiction', 'price': 41.5}
]



# Insert records into the Book Collection with genre checking and insertion
books = []

# Keep track of the inventory IDs that have been assigned to books
assigned_inventory_ids = set()

for book_data in books_data:
    genre_name = book_data.get("genre", "").capitalize()  # Extract and capitalize genre name
    genre = find_genre(genre_name)  # Check if genre exists

    # If genre not found, insert it and retrieve its ObjectId
    if not genre:
        genre_id = ObjectId()  # Generate ObjectId
        genre = {"_id": genre_id, "GenreName": genre_name}
        genre_collection.insert_one(genre)
    else:
        genre_id = genre["_id"]  # Get genre ObjectId if exists

    # Get a random inventory ID that has not been assigned to any book yet
    available_inventory_ids = set(inventory['_id'] for inventory in inventory_collection.find({})) - assigned_inventory_ids
    if not available_inventory_ids:
        # Generate a new inventory ID if all existing ones are assigned
        inventory_id = generate_id()
    else:
        inventory_id = random.choice(list(available_inventory_ids))
    assigned_inventory_ids.add(inventory_id)

    isbn = generate_isbn()  # Generate ISBN for the book using uuid

    # Create book record dictionary with ObjectId references
    book_record = {
        "ISBN": isbn,
        "Title": book_data.get("title", ""),
        "Author": book_data.get("author", ""),
        "Price": book_data.get("price", 0.0),
        "Genre": {"GenreName": genre_name, "_id": genre_id},  # Include genre name and its ID
        "Inventory": {"_id": inventory_id, "Stock": inventory["Stock"]}  # Include inventory ID and stock
    }

    books.append(book_record)

    # Update genre document with ISBN
    genre_collection.update_one({"_id": genre["_id"]}, {"$addToSet": {"Books": isbn}})

# Insert books into the Book Collection
book_collection.insert_many(books)


# Insert records into the Book Collection with genre checking and insertion
books = []

# Keep track of the inventory IDs that have been assigned to books
assigned_inventory_ids = set()

for book_data in books_data:
    genre_name = book_data.get("genre", "").capitalize()  # Extract and capitalize genre name
    genre = find_genre(genre_name)  # Check if genre exists

    # If genre not found, insert it and retrieve its ObjectId
    if not genre:
        genre_id = ObjectId()  # Generate ObjectId
        genre = {"_id": genre_id, "GenreName": genre_name}
        genre_collection.insert_one(genre)
    else:
        genre_id = genre["_id"]  # Get genre ObjectId if exists

    # Get a random inventory ID that has not been assigned to any book yet
    available_inventory_ids = set(inventory['_id'] for inventory in inventory_collection.find({})) - assigned_inventory_ids
    if not available_inventory_ids:
        # Generate a new inventory ID if all existing ones are assigned
        inventory_id = generate_id()
    else:
        inventory_id = random.choice(list(available_inventory_ids))
    assigned_inventory_ids.add(inventory_id)

    isbn = generate_isbn()  # Generate ISBN for the book using uuid

    # Create book record dictionary with ObjectId references
    book_record = {
        "ISBN": isbn,
        "Title": book_data.get("title", ""),
        "Author": book_data.get("author", ""),
        "Price": book_data.get("price", 0.0),
        "Genre": {"GenreName": genre_name, "_id": genre_id},  # Include genre name and its ID
        "Inventory": {"_id": inventory_id, "Stock": inventory["Stock"]}  # Include inventory ID and stock
    }

    books.append(book_record)

    # Update genre document with ISBN
    genre_collection.update_one({"_id": genre["_id"]}, {"$addToSet": {"Books": isbn}})

# Insert books into the Book Collection
book_collection.insert_many(books)


# Update Inventory with book information and Reflect Inventory ID and Stock in Book Collection
for inventory in inventory_collection.find({}):
    print("Processing inventory with ID:", inventory["_id"])  # Debugging line

    # Get all books associated with this inventory
    inventory_books = book_collection.find({"Inventory._id": inventory["_id"]})

    # List to store book information
    inventory_books_info = []

    # Iterate over books and extract ISBN, Title, and Object ID
    for book in inventory_books:
        book_info = {"ISBN": book["ISBN"], "Title": book["Title"], "_id": book["_id"]}
        inventory_books_info.append(book_info)

    print("Inventory Books Info:", inventory_books_info)  # Debugging line

    # Update Inventory document with book information
    inventory_collection.update_one({"_id": inventory["_id"]}, {"$set": {"Books": inventory_books_info}})






# Admin Authentication
import bcrypt

# Define role constants
ADMIN_ROLE = "admin"
BUYER_ROLE = "buyer"

# Predefined admin credentials
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin123"  # You can change this to a more secure password

# Function to create the admin user
def create_admin():
    # Check if admin already exists
    existing_admin = user_account_collection.find_one({"_id": ADMIN_EMAIL})
    if existing_admin:
        return {"error": "Admin already exists"}
    
    # Hash the admin password before storing it
    hashed_password = bcrypt.hashpw(ADMIN_PASSWORD.encode('utf-8'), bcrypt.gensalt())
    
    # Insert the admin user into the database
    admin_data = {
        "_id": ADMIN_EMAIL,
        "Password": hashed_password,
        "Name": "Admin",
        "Address": "Admin Address",
        "Phone": "Admin Phone",
        "Role": ADMIN_ROLE
    }
    user_account_collection.insert_one(admin_data)
    return {"success": "Admin user created successfully"}

# Call the function to create the admin user
create_admin()


# Function to register a new user
def register_user(email, password, name, address, phone, role):
    # Check if user already exists
    existing_user = user_account_collection.find_one({"_id": email})
    if existing_user:
        return {"error": "User already exists"}
    
    # Hash the password before storing it
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Insert the new user into the database
    user_data = {
        "_id": email,
        "Password": hashed_password,
        "Name": name,
        "Address": address,
        "Phone": phone,
        "Role": role
    }
    user_account_collection.insert_one(user_data)
    return {"success": "User registered successfully"}

# Function to authenticate a user
def authenticate_user(email, password):
    # Find the user by email
    user_data = user_account_collection.find_one({"_id": email})
    if not user_data:
        return {"error": "User not found"}
    
    # Check if the password matches
    if bcrypt.checkpw(password.encode('utf-8'), user_data["Password"]):
        return {"success": "Authentication successful", "user_data": user_data}
    else:
        return {"error": "Incorrect password"}

# Function to check if a user is an admin
def is_admin(email):
    user_data = user_account_collection.find_one({"_id": email})
    if user_data and user_data["Role"] == ADMIN_ROLE:
        return True
    return False

# Example function to perform admin-specific actions
def admin_action(email):
    if not is_admin(email):
        return {"error": "You do not have permission to perform this action"}
    
    # Perform admin-specific action here
    return {"success": "Admin action performed successfully"}

