function convertCurrency() {
    var amount = parseFloat(document.getElementById("amount").value);
    var baseCurrency = document.getElementById("baseCurrency").value;
    var targetCurrency = document.getElementById("targetCurrency").value;

    // Make a request to the currency exchange rate API
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.exchangerate-api.com/v4/latest/" + baseCurrency, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            if (targetCurrency in data.rates) {
                var conversionRate = data.rates[targetCurrency];
                var convertedAmount = amount * conversionRate;

                document.getElementById("result").innerHTML = amount + " " + baseCurrency + " is equal to " + convertedAmount.toFixed(2) + " " + targetCurrency;
            } else {
                document.getElementById("result").innerHTML = "Conversion rate for " + targetCurrency + " not found.";
            }
        } else {
            document.getElementById("result").innerHTML = "Failed to retrieve currency data.";
        }
    };
    xhr.send();
}