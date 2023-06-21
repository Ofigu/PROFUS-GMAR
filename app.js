const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Connection URI for MongoDB
const uri = 'mongodb+srv://alon12c20:7qWTYXSZGTIi7IBG@alonvizniuk.ecefh5m.mongodb.net/Users';

// Database and collection names
const dbName = 'Users';
const collectionName = 'users';

// Create a MongoDB client
const client = new MongoClient(uri);

// Connect to the MongoDB server
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB');

  // Set up the route for handling the form submission
  app.post('/register', (req, res) => {
    const { firstName, lastName, email, password, day, month, year } = req.body;

    // Create a user object
    const user = {
      firstName,
      lastName,
      email,
      password,
      birthday: `${day}-${month}-${year}`,
    };

    // Insert the user data into the database
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection.insertOne(user, (err, result) => {
      if (err) {
        console.error('Error inserting user data:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      console.log('User data inserted successfully');
      res.status(200).send('Registration successful');
    });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});
