const express = require('express');
const router = express.Router();
const path = require('path'); // Add this line to include the path module
const User = require('../models/user');
const Coin = require('../models/coin');


router.post('/addUser', async (req, res) => {
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

  router.post('/addCoin', async (req, res) => {
    const coin = new Coin({
      CoinName: req.body.CoinName,
      Price: req.body.Price,
      Recommended: req.body.Recommended || false,
      AltCoin: req.body.AltCoin || false,
      ProofOfWork: req.body.ProofOfWork || false,
      ImageOfCoin: req.body.ImageOfCoin
    });
  
    try {
      // Save the user to the database
      await coin.save();
      console.log('Coin added successfully');
  
      // Redirect the user to another page
      res.redirect('/welcome');
    } catch (error) {
      console.error('Error adding coin:', error);
      res.send(error);
    }
  });


  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Authenticate user credentials
    const loguser = await db.collection('users').findOne({ username, password });
  
    if (loguser) {
      // Retrieve user's role based on username and ID
      if (loguser.id === '6495dc17e83ddba6c27287f6') {
        res.redirect('/admin'); // Redirect to admin index page
      } else {
        res.redirect('/customer'); // Redirect to customer index page
      }
    } else {
      console.log('No such user'); // Handle invalid credentials or other error
    }
  });

  router.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'indexAdmin.html'));
});

router.get('/customer', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'indexCustomer.html'));
});
  
  


router.get('/loginPage', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'login.html'));
});

router.get('/Coin', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'addCoin.html'));
});

router.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'signup.html'));
});

router.get('/welcome', function (req, res) {
    res.sendFile(path.join(__dirname, '../../views', 'welcome.html'));
});

router.get('/portfolio', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'portfolio.html'));
});

router.get('/coin', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'coin.html'));
});

router.get('/converter', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'converter.html'));
});

router.get('/watchlist', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'watchlist.html'));
});

module.exports = router;