const express = require('express');
const router = express.Router();
const path = require('path'); // Add this line to include the path module
const User = require('../models/user');
const Coin = require('../models/coin');
const Trade = require('../models/trades');
require("dotenv").config({ path: __dirname + "../../.env" });
const { twitterClient } = require("../../twitterClient");

// Adding user to the DB
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


// Adds trade to DB or updates
router.post('/addTrade', async (req, res) => {
  try {
    // Extract the trade data from the request body
    const { CoinName, Amount, Value, UserName } = req.body;

    // Check if a trade with the same coin and username exists
    const existingTrade = await Trade.findOne({ CoinName, UserName });
    const theUser = await User.findOne({ UserName })
    const theCoin = await Coin.findOne({ CoinName })

    if (existingTrade && theUser) {
      // If a trade exists, update its properties
      existingTrade.Amount += Amount;
      existingTrade.Value = (existingTrade.Amount * theCoin.Price);
      existingTrade.LastDate = new Date();
      theUser.Balance -= Value;

      // Save the updated trade and Balance of User
      const updatedTrade = await existingTrade.save();
      await theUser.save()


      res.status(200).json(updatedTrade);
    } else {
      // If no trade exists, create a new trade object with the current date
      const newTrade = new Trade({
        CoinName,
        Amount,
        Value,
        UserName,
        LastDate: new Date() // Set the Date field to the current date and time
      });
      const theSameUser = await User.findOne({ UserName })
      theSameUser.Balance -= Value;
      // Save the new trade to the database
      const savedTrade = await newTrade.save();
      await theSameUser.save()

      res.status(200).json(savedTrade);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding/updating the trade.' });
  }
});

// Deletes trade from DB or updates
router.post('/reduceTrade', async (req, res) => {
  try {
    // Extract the trade data from the request body
    const { CoinName, Amount, Value, UserName } = req.body;

    // Find the trade with the given coin and username
    const existingTrade = await Trade.findOne({ CoinName, UserName });
    const theUser = await User.findOne({ UserName })
    const theCoin = await Coin.findOne({ CoinName })

    if (existingTrade) {
      if (Amount < existingTrade.Amount) {
        // If the new amount is less than the current amount, update the trade
        existingTrade.Amount -= Amount;
        existingTrade.Value = (existingTrade.Amount * theCoin.Price);
        existingTrade.LastDate = new Date();
        theUser.Balance += Value;

        // Save the updated trade
        const updatedTrade = await existingTrade.save();
        await theUser.save();

        res.status(200).json(updatedTrade);
      }
      else if (Amount === existingTrade.Amount) {

        theUser.Balance += Value;
        await theUser.save();
        existingTrade.deleteOne();
        res.status(200).json({ message: 'Trade deleted successfully.' });
      } else {
        // If the new amount is greater than the current amount, it is not a possible action
        res.status(400).json({ error: 'Invalid action. The requested amount is greater than the current amount.' });
      }
    } else {
      res.status(404).json({ error: 'Trade not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while reducing/deleting the trade.' });
  }
});

// Gets candidate keys of user and coin and returns the amaount field of the relevante trade
router.post('/getOwnedAmount', async (req, res) => {
  try {
    const { CoinName, UserName } = req.body;

    // Find the trade with the specified coin name and user name
    const trade = await Trade.findOne({ CoinName, UserName });

    if (trade) {
      // Return the owned amount for the coin
      res.status(200).json({ amount: trade.Amount });
    } else {
      // If no trade exists for the coin and user, return 0 as the owned amount
      res.status(200).json({ amount: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the owned amount.' });
  }
});

// Adds coin to the DB and also tweets about it
router.post('/addCoin', async (req, res) => {
  const coin = new Coin({
    CoinName: req.body.CoinName,
    Price: req.body.Price,
    Recommended: req.body.Recommended || false,
    AltCoin: req.body.AltCoin || false,
    ProofOfWork: req.body.ProofOfWork || false,
    ImageOfCoin: req.body.ImageOfCoin
  });
  const tweetContent = `We are exited to announe\n that we Just added a new coin by the name ${coin.CoinName} to our trading platform!\n for the price of just ${coin.Price}$!.\n\nGood Luck Trading!`;

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

      const tweet = async () => {
        try {
          await twitterClient.v2.tweet(tweetContent);
          console.log("activated the tweet function-tweeted the tweet");
        } catch (e) {
          console.log(e)
        }
      }
      tweet();
      // Send a response back to the client-side to handle the confirmation
      res.send({ coinAdded: true });
    }
  } catch (error) {
    console.error('Error adding coin:', error);
    res.status(500).send('Error adding coin.');
  }
});


// Connects users to the site by classification 
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

// Sends to customer home page
router.get('/customer', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'indexCustomer.html'));
});

// Sends to admin home page
router.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'indexAdmin.html'));
});

// Sends to login page
router.get('/loginPage', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'login.html'));
});

// Sends to add coin page
router.get('/Coin', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'addCoin.html'));
});

// Sends to signup page
router.get('/signup', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'signup.html'));
});

// Sends to welcome page
router.get('/welcome', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'welcome.html'));
});

// Sends to trade page
router.get('/trade', async (req, res) => {
  res.sendFile(path.join(__dirname, '../../views', 'trade.html'));
});

// Sends all the trades from DB to allTrades page
router.get('/alltrades', async (req, res) => {
  try {
    // Retrieve all trades from the database
    const trades = await Trade.find({}, { _id: 0, __v: 0 }).sort({ Value: -1 });
    res.json(trades);
  } catch (error) {
    console.error('Error retrieving trades:', error);
    res.status(500).json({ error: 'Failed to retrieve trades' });
  }
});

// Sends to editBalance page
router.get('/editBalance', async (req, res) => {
  res.sendFile(path.join(__dirname, '../../views', 'editbalance.html'));
});

// Gets a user name and returns the balance
router.get('/user/balance', async (req, res) => {
  const username = req.query.username;
  try {
    // Retrieve the user's balance from the database or any other data source
    const user = await User.findOne({ UserName: username });
    if (user) {
      const balance = user.Balance;
      res.json(balance);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sends all the amaounts of coins the a user has to the trade page
router.get('/user/coin-amounts', async (req, res) => {
  const username = req.query.username;
  try {
    // Find all trades for the specified user
    const trades = await Trade.find({ UserName: username });

    // Create an object to store the coin amounts
    const coinAmounts = {};

    // Iterate over the trades and calculate the total amount for each coin
    for (const trade of trades) {
      const coinName = trade.CoinName;
      const amount = trade.Amount;

      // Update the coin amount in the object
      coinAmounts[coinName] = (coinAmounts[coinName] || 0) + amount;
    }
    res.json(coinAmounts);
  } catch (error) {
    console.error('Error fetching coin amounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sends to trades page
router.get('/trades', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'allTrades.html'));
});

// Sends all the trades of one user to the portfolio page
router.get('/trades/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const trades = await Trade.find({ UserName: username }, '-_id CoinName Amount Value LastDate');
    const tradesWithImages = [];

    for (const trade of trades) {
      const coin = await Coin.findOne({ CoinName: trade.CoinName });
      const tradeWithImage = {
        trade,
        image: coin ? coin.ImageOfCoin : '' // Assuming the 'ImageOfCoin' field contains the image string
      };
      tradesWithImages.push(tradeWithImage);
    }

    res.json(tradesWithImages);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'Internal server error'});
  }
});

// Sends to about page
router.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'about.html'));
});

// Sends to portfolio page
router.get('/portfolio', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'portfolio.html'));
});

// Sends to ManageCoins page
router.get('/ManageCoins', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'manageCoins.html'));
});


// Sends all the coins to the manage coin page
router.get('/coins', async (req, res) => {
  try {
    // Retrieve all coins from the database
    const coins = await Coin.find();

    // Send the coins as a JSON response
    res.json(coins);
  } catch (error) {
    console.error('Error fetching coins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deletes coins from DB
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

// Updates coin in the DB
router.patch('/coins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const coin = await Coin.findByIdAndUpdate(id, updates, { new: true });
    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    const trades = await Trade.find({ CoinName: coin.CoinName });
    for (let i = 0; i < trades.length; i++) {
      const trade = trades[i];
      trade.Value = trade.Amount * coin.Price;
      await trade.save();
    }

    res.json(coin);
  } catch (error) {
    console.error('Error updating coin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Updates user balance
router.patch('/user/balance', async (req, res) => {
  const { username, balance } = req.body;
  try {
    // Retrieve the user from the database
    const user = await User.findOne({ UserName: username });

    if (user) {
      // Update the user's balance
      user.Balance = balance;
      await user.save();

      res.json({ message: 'User balance updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;