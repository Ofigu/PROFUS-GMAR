const express = require('express');
const router = express.Router();
const path = require('path'); // Add this line to include the path module
const User = require('../models/user');
const Coin = require('../models/coin');

router.post('/addUser', async (req, res) => {
  const user = new User({
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    UserName: req.body.Username,
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
    if (error.code === 11000 && error.keyPattern && error.keyValue && error.keyValue.UserName) {
      // Duplicate username error
      const errorMessage = 'Username already exists. Please choose a different username.';
      console.error(errorMessage);
      // Display an alert with the error message
      res.send(`<script>alert('${errorMessage}'); window.location.href='/signup'</script>`);
    } else {
      console.error('Error adding user:', error);
      res.send(error);
    }
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
    // Check if a coin with the same name already exists
    const existingCoin = await Coin.findOne({ CoinName: req.body.CoinName });

    if (existingCoin) {
      // Display an alert for an existing coin
      const errorMessage = 'A coin with the same name already exists.';
      console.error(errorMessage);
      res.send(`<script>alert('${errorMessage}'); window.location.href='/Coin'</script>`);
    } else {
      // Save the coin to the database
      await coin.save();
      console.log('Coin added successfully');

      // Redirect the user to another page
      res.redirect('/welcome');
    }
  } catch (error) {
    console.error('Error adding coin:', error);
    res.send(error);
  }
});

router.post('/login', async (req, res) => {
  const username = req.body.Username;
  const password = req.body.Password;
  try {
    // Find the user in the database based on the provided username and password
    const loguser = await User.findOne({ UserName: username, Password: password });

    if (loguser) {
      // Retrieve user's role based on username and ID
      if (loguser.id === '6499aa757afcc808e265fd90' || loguser.id === '6499aace7afcc808e265fd92' || loguser.id === '6499aae87afcc808e265fd94') {
        res.redirect('/admin?firstName=' + loguser.UserName);
      } else {
        // Redirect to the customer index page and pass the first name as a query parameter in the URL
        res.redirect('/customer?firstName=' + loguser.UserName);
      }
    } else {
      // Display an alert for no such user
      const errorMessage = 'No user found with the provided username and password.';
      console.error(errorMessage);
      res.send(`<script>alert('${errorMessage}'); window.location.href='/loginPage'</script>`);
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.send(error);
  }
});


router.get('/customer', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'indexCustomer.html')); // Send the HTML file
});

router.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'indexAdmin.html'));
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

router.get('/trade', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'trade.html'));
});

router.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'about.html'));
});

router.get('/portfolio', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'portfolio.html'));
});

router.get('/ManageCoins', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'manageCoins.html'));
});

router.get('/coins', async (req, res) => {
  try {
    // Retrieve all coins from the database
    const coins = await Coin.find();
    console.log(coins)

    // Send the coins as a JSON response
    res.json(coins);
  } catch (error) {
    console.error('Error fetching coins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/coins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Coin.findByIdAndDelete(id);
    res.sendStatus(204); // No content
  } catch (error) {
    console.error('Error deleting coin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/coins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const coin = await Coin.findByIdAndUpdate(id, updates, { new: true });

    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    res.json(coin);
  } catch (error) {
    console.error('Error updating coin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;