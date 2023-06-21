const express = require('express');
const { connect, getDB } = require('./db');

const app = express();
const port = 3000;

// Connect to MongoDB
connect();

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

// Route for handling the form submission
app.post('/register', (req, res) => {
  const { firstName, lastName, email, password, day, month, year } = req.body;

  // Validate and process the form data as needed

  const user = {
    firstName,
    lastName,
    email,
    password,
    birthday: `${day}-${month}-${year}`,
  };

  // Store user data in MongoDB
  const db = getDB();
  const usersCollection = db.collection('users');

  usersCollection.insertOne(user, (err, result) => {
    if (err) {
      console.error('Error inserting user data:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('User data inserted successfully');
      res.status(200).send('Registration successful');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
    