const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const uri = 'mongodb+srv://alon12c20:7qWTYXSZGTIi7IBG@alonvizniuk.ecefh5m.mongodb.net/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let usersCollection;

client.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }

  const db = client.db('Users');
  usersCollection = db.collection('users');

  app.post('/signup', (req, res) => {
    const newUser = req.body;

    usersCollection.insertOne(newUser, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.status(201).json({ message: 'User created successfully' });
      }
    });
  });

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
