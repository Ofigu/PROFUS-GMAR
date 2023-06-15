// Assuming you have an array of crypto portfolio data
const portfolioData = [
    { name: "Bitcoin", quantity: 2.5, value: 50000 },
    { name: "Ethereum", quantity: 10, value: 3000 },
    // Add more crypto portfolio data as needed
  ];
  
  // Get the portfolio container element
  const portfolioContainer = document.querySelector(".portfolio-container");
  
  // Loop through the portfolio data and generate portfolio items dynamically
  portfolioData.forEach((crypto) => {
    const portfolioItem = document.createElement("div");
    portfolioItem.classList.add("portfolio-item");
    
    const heading = document.createElement("h3");
    heading.textContent = crypto.name;
    
    const quantity = document.createElement("p");
    quantity.textContent = `Quantity: ${crypto.quantity}`;
    
    const value = document.createElement("p");
    value.textContent = `Value: $${crypto.value}`;
    
    // Append the elements to the portfolio item
    portfolioItem.appendChild(heading);
    portfolioItem.appendChild(quantity);
    portfolioItem.appendChild(value);
    
    // Append the portfolio item to the container
    portfolioContainer.appendChild(portfolioItem);
  });
  