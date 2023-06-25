const express = require('express');
const router = express.Router();
const path = require('path'); // Add this line to include the path module
const User = require('../models/user');


router.post('/add', async (req, res) => {
    const user = new User({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Username: req.body.Username,
      Password: req.body.Password,
      Balance: req.body.Balance
    });
  
    try {
      // Save the user to the database
      await user.save();
      console.log('User added successfully');
  
      // Redirect the user to another page
      res.redirect('/welcome');
    } catch (error) {
      console.error('Error adding user:', error);
      res.send(error);
    }
  });

router.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'login.html'));
});

router.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'signup.html'));
});

router.get('/welcome', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'welcome.html'));
});


module.exports = router;