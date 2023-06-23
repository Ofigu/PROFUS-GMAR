const express = require('express');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://alon12c20:1111@alonvizniuk.ecefh5m.mongodb.net/Users', {
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
const User = mongoose.model(
  'User',
  {
    FirstName: String,
    LastName: String,
    UserName: String,
    Password: String,
    Ballance: Number
  },
  'data'
);

// Parse incoming request bodies as JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "PROFUS-GMAR" directory
app.use('/PROFUS-GMAR', express.static(path.join(__dirname, 'PROFUS-GMAR')));

// Proxy requests for static files to the frontend server
app.use(
  '/welcome',
  createProxyMiddleware({ target: 'http://127.0.0.1:3001', changeOrigin: true })
);

// Create a route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'register/signup.html'));
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

    // Redirect the user to another page
    res.redirect('/welcome/welcome.html');
  } catch (error) {
    console.error('Error adding user:', error);
    res.send(error);
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
