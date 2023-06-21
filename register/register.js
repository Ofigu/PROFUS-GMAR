document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('form');
    registerForm.addEventListener('submit', handleFormSubmit);
  
    function handleFormSubmit(event) {
      event.preventDefault();
  
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const day = document.getElementById('day').value;
      const month = document.getElementById('month').value;
      const year = document.getElementById('year').value;
  
      if (validateForm()) {
        const userData = {
          firstName,
          lastName,
          email,
          password,
          day,
          month,
          year,
        };
  
        // Perform additional processing or AJAX request to send userData to the server
        // You can use the fetch API or other libraries like Axios to make the AJAX request
        // Example using fetch:
        fetch('register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // Handle the response from the server
            // You can display a success message or redirect the user to another page
          })
          .catch((error) => {
            console.error('Error:', error);
            // Handle the error, display an error message, or perform any necessary action
          });
      }
    }
  
    function validateForm() {
      // Perform client-side validation
      // Validate the form fields and display appropriate error messages if necessary
  
      // Example: Check if the passwords match
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
  
      if (password !== confirmPassword) {
        // Display an error message for password mismatch
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.textContent = 'Passwords do not match';
        return false;
      }
  
      // Add more validation rules as per your requirements
      // Return true if all validations pass
      return true;
    }
  });
  