var btc = document.getElementById("bitcoin");
var ltc = document.getElementById("litecoin");
var eth = document.getElementById("ethereum");
var doge = document.getElementById("dogecoin");

var liveprice = {
    "async": true,
    "scroosDomain": true,
    "url": "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Clitecoin%2Cethereum%2Cdogecoin&vs_currencies=usd",

    "method": "GET",
    "headers": {}
}

$.ajax(liveprice).done(function (response){
    btc.innerHTML = response.bitcoin.usd;
    ltc.innerHTML = response.litecoin.usd;
    eth.innerHTML = response.ethereum.usd;
    doge.innerHTML = response.dogecoin.usd;

});


<!-- trading test -->
function updateBalance(action, coin, amount) {
    var balanceElement = document.getElementById('balance');
    var currentBalance = parseFloat(balanceElement.innerText);
    var coinPrice = parseFloat(document.getElementById(coin + 'Price').innerText);
    
    var tradeValue = coinPrice * amount;
    
    if (action === 'buy') {
      if (tradeValue <= currentBalance) {
        currentBalance -= tradeValue;
      } else {
        alert('Insufficient balance for buying ' + coin);
      }
    } else if (action === 'sell') {
      currentBalance += tradeValue;
    }
    
    balanceElement.innerText = currentBalance.toFixed(2);
  }
  
  function fetchCoinData() {
    var coins = ['bitcoin', 'ethereum']; // Add more coins as needed
    
    coins.forEach(function(coin) {
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + coin + '&vs_currencies=usd')
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          var priceElement = document.getElementById(coin + 'Price');
          priceElement.innerText = data[coin].usd.toFixed(2);
        })
        .catch(function(error) {
          console.log('Error fetching ' + coin + ' price:', error);
        });
    });
  }
  
  // Fetch coin data on page load
  fetchCoinData();