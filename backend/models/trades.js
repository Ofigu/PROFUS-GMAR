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
  Date: {
    type: Date, // Use the Date data type for the Date field
    required: true
  }
});

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;