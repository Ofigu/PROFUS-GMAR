const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  CoinName: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
    required: true
  },
  Value: {
    type: Number,
    required: true
  },
  UserName: {
    type: String,
    required: true
  },
  LastDate: {
    type: Date, // Last date that this customer bought or sold this coin
    required: true
  }
});

// Define a unique compound index on CoinName and UserName
tradeSchema.index({ CoinName: 1, UserName: 1 }, { unique: true });

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
