// Product data
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

// DOM elements
const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const clearCartBtn = document.getElementById("clear-cart-btn");

// Utility function to get cart from session storage
function getCart() {
  const cart = sessionStorage.getItem("cart");
  return cart ? JSON.parse(cart) : {};
}

// Utility function to save cart to session storage
function saveCart(cart) {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

// Render product list
function renderProducts() {
  productList.innerHTML = ""; // Clear existing products
  products.forEach((product) => {
    const li = document.createElement("li");
    li.className = "product-item";
    li.innerHTML = `
      <span class="product-name">${product.name}</span> - 
      $<span class="product-price">${product.price}</span>
      <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    `;
    productList.appendChild(li);
  });

  // Add event listeners to "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      addToCart(productId);
    });
  });
}

// Render cart list
function renderCart() {
  const cart = getCart();
  cartList.innerHTML = ""; // Clear existing cart items
  let total = 0;
  const cartEntries = Object.entries(cart);

  if (cartEntries.length === 0) {
    cartList.innerHTML = "<li>Your cart is empty.</li>";
    return;
  }

  cartEntries.forEach(([productId, quantity]) => {
    const product = products.find((p) => p.id === parseInt(productId));
    if (product) {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <span class="cart-product-name">${product.name}</span> - 
        $<span class="cart-product-price">${product.price}</span> x 
        <span class="cart-product-quantity">${quantity}</span> = 
        $<span class="cart-product-total">${product.price * quantity}</span>
        <button class="remove-from-cart-btn" data-id="${product.id}">Remove</button>
      `;
      cartList.appendChild(li);
      total += product.price * quantity;
    }
  });

  // Display total
  const totalLi = document.createElement("li");
  totalLi.className = "cart-total";
  totalLi.innerHTML = `<strong>Total: $${total}</strong>`;
  cartList.appendChild(totalLi);

  // Add event listeners to "Remove" buttons
  const removeFromCartButtons = document.querySelectorAll(".remove-from-cart-btn");
  removeFromCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      removeFromCart(productId);
    });
  });
}

// Add item to cart
function addToCart(productId) {
  const cart = getCart();
  if (cart[productId]) {
    cart[productId] += 1;
  } else {
    cart[productId] = 1;
  }
  saveCart(cart);
  renderCart();
}

// Remove item from cart
function removeFromCart(productId) {
  const cart = getCart();
  if (cart[productId]) {
    cart[productId] -= 1;
    if (cart[productId] <= 0) {
      delete cart[productId];
    }
    saveCart(cart);
    renderCart();
  }
}

// Clear cart
function clearCart() {
  sessionStorage.removeItem("cart");
  renderCart();
}

// Event listener for "Clear Cart" button
clearCartBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the cart?")) {
    clearCart();
  }
});

// Initial render
renderProducts();
renderCart();
