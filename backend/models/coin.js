const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  CoinName: {
    type: String,
    required: true,
    unique: true
  },
  Price: {
    type: Number
  },
  Recommended: {
    type: Boolean,
    required: true
  },
  AltCoin: {
    type: Boolean,
    required: true
  },
  ProofOfWork: {
    type: Boolean,
    required: true
  },
  ImageOfCoin: {
    type: String, // Assuming the image will be stored as a URL or file path
    required: true
  }
});

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
