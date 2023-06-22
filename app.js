const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const { Double } = require('mongodb');

// Connect to MongoDB
mongoose.connect('mongodb+srv://alon12c20:1111@alonvizniuk.ecefh5m.mongodb.net/Users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create a model for the users collection
const User = mongoose.model('User', {
  FirstName: String,
  LastName: String, 
  UserName: String,
  Password: String,
  Ballance: Number
}, 'data');

// Parse incoming request bodies as JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "USERS" directory
app.use(express.static('USERS'));

// Create a route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + 'register/signup.html');
});

// Create a route to add a new user
app.post('/add', async (req, res) => {
    const user = new User({
      FirstName: req.body['First name'],
      LastName: req.body['Last name'],
      UserName: req.body.Username,
      Password: req.body.password,
      Ballance: req.body.Balance
    });

  try {
    // Save the user to the database
    await user.save();
    console.log('User added successfully');
    res.redirect('/');
  } catch (error) {
    console.error('Error adding user:', error);
    res.send(error);
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
