var btc = document.getElementById("bitcoin");
var ltc = document.getElementById("litecoin");
var eth = document.getElementById("ethereum");
var doge = document.getElementById("dogecoin");
var bnb = document.getElementById("bnb");
var ada = document.getElementById("cardano");
var sol = document.getElementById("solana");
var xrp = document.getElementById("xrp");
var shib = document.getElementById("shibainu");

var liveprice = {
    "async": true,
    "scroosDomain": true,
    "url": "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Clitecoin%2Cethereum%2Cdogecoin%2Cbinancecoin%2Cxrp%2Ccardano%2Cavalanche&vs_currencies=usd",

    "method": "GET",
    "headers": {}
}

$.ajax(liveprice).done(function (response){
    btc.innerHTML = response.bitcoin.usd;
    ltc.innerHTML = response.litecoin.usd;
    eth.innerHTML = response.ethereum.usd;
    doge.innerHTML = response.dogecoin.usd;
    bnb.innerHTML = response.binancecoin.usd;
    xrp.innerHTML = response.xrp.usd;
    ada.innerHTML = response.cardano.usd;
    sol.innerHTML = response.solana.usd;
    shib.innerHTML = response["shiba-inu"].usd;
});

/*background video-----------------*/

window.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('myVideo');
    video.addEventListener('loadeddata', function() {
      fadeInOnce(video); // Call the modified fade-in function
    }, false);
  });
  
  function fadeInOnce(element) {
    var op = 0.01; // Initial opacity
    var timer = setInterval(function() {
      if (op >= 1) {
        clearInterval(timer);
        element.removeEventListener('loadeddata', fadeInOnce); // Remove the event listener after fading in
      }
      element.style.opacity = op;
      op += op * 0.1; // Adjust the fade-in speed here
    }, 10); // Adjust the interval (in milliseconds) between opacity changes here
  }
/*top section opacity-------------*/