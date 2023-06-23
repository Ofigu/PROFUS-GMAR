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