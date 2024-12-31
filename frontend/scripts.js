document.addEventListener('DOMContentLoaded', () => {
  // Function to show the appropriate section based on the hash in the URL
  function showPage(page) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');

    // Show the selected page
    const activePage = document.getElementById(page);
    if (activePage) {
      activePage.style.display = 'block';
    }
  }

  // Listen for changes in the hash part of the URL
  window.addEventListener('hashchange', () => {
    const page = window.location.hash.slice(1) || 'home'; // Default to home page if no hash
    showPage(page);
  });

  // Initial page load
  const page = window.location.hash.slice(1) || 'home';
  showPage(page);

  // Fetch products from the backend when the products page is displayed
  async function fetchProducts() {
    try {
      console.log("Fetching products..."); // Log to check if the function is triggered
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const products = await response.json();
      const productList = document.getElementById('product-list');
      productList.innerHTML = ''; // Clear the previous product list

      if (products.length === 0) {
        productList.innerHTML = 'No products available.';
      } else {
        products.forEach(product => {
          const productCard = document.createElement('div');
          productCard.classList.add('cart-item'); // Use cart-item class for product display
          productCard.innerHTML = `
            <div class="cart-item-image">
              <img src="/${product.image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
              <h4>${product.name}</h4>
              <p>Price: $${product.price}</p>
              <p>${product.description}</p>
            </div>
            <div class="cart-item-actions">
              <button class="add-to-cart" data-product-id="${product._id}">Add to Cart</button>
            </div>
          `;
          productList.appendChild(productCard);
        });

        // Add event listeners to the "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-product-id');
            const product = products.find(p => p._id === productId);
            addToCart(product);
          });
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // Add product to the cart in localStorage
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(item => item._id === product._id);
    if (existingProductIndex > -1) {
      // If the product exists, increase the quantity
      cart[existingProductIndex].quantity += 1;
    } else {
      // If the product doesn't exist, add it to the cart
      product.quantity = 1;
      cart.push(product);
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart display (for example, show the number of items in the cart)
    updateCartView();
  }

  // Update the cart view
  function updateCartView() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartLink = document.getElementById('cart-link');
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    if (cartCount > 0) {
      cartLink.textContent = `Cart (${cartCount})`;
    } else {
      cartLink.textContent = 'Cart';
    }
  }

  // Function to display cart items on the Cart page
  function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
          <div class="cart-item-image">
            <img src="/${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>Price: $${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
          </div>
          <div class="cart-item-actions">
            <button class="remove-from-cart" data-product-id="${item._id}">Remove</button>
          </div>
        `;
        cartItemsContainer.appendChild(cartItem);
      });

      // Add event listeners for removing items
      const removeButtons = document.querySelectorAll('.remove-from-cart');
      removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const productId = e.target.getAttribute('data-product-id');
          removeFromCart(productId);
        });
      });
    }
  }

  // Function to remove a product from the cart
  function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();  // Re-render the cart items
    updateCartView();  // Update the cart count
  }

  // Handle Checkout Button
  function handleCheckout() {
    alert('Proceeding to checkout...');
    // You can redirect to a checkout page or integrate payment here
  }

  // Show the cart items when navigating to the cart page
  if (window.location.hash === '#cart') {
    displayCartItems();
  }

  // Attach checkout button handler
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }

  // Show products when navigating to the products page
  if (window.location.hash === '#products') {
    fetchProducts();
  }

  // Update the cart view on page load
  updateCartView();
});

// Login Form submission
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem('authToken', result.token);
          alert('Login successful!');
          window.location.href = '/products'; // Redirect after login
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error logging in:', error);
      }
    });
  }

  // Signup Form submission
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          alert('Signup successful!');
          window.location.href = '/login'; // Redirect to login page
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error signing up:', error);
      }
    });
  }
});
