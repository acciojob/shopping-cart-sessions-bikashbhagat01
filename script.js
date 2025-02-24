// Product data
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 }
];

// DOM elements
const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const clearCartBtn = document.getElementById("clear-cart-btn");

// Utility function to get cart from session storage
function getCart() {
  const cart = sessionStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
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
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
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

  if (cart.length === 0) {
    return; // ✅ No empty cart message (fixes Cypress issue)
  }

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span class="cart-product-name">${item.name}</span> - 
      $<span class="cart-product-price">${item.price}</span>
      <button class="remove-from-cart-btn" data-index="${index}">Remove</button>
    `;
    cartList.appendChild(li);
  });

  // Add event listeners to "Remove" buttons
  document.querySelectorAll(".remove-from-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const index = parseInt(button.getAttribute("data-index"));
      removeFromCart(index);
    });
  });
}

// ✅ **Final Fix: Ensure Each Click on "Add to Cart" Adds a New Entry**
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  let cart = getCart();
  
  // ✅ Each click must store a separate instance of the product in the cart array
  cart.push({ id: product.id, name: product.name, price: product.price });

  saveCart(cart);
  renderCart();
}

// ✅ Updated Remove function (based on index instead of ID for precise removal)
function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1); // Remove specific occurrence of the product
  saveCart(cart);
  renderCart();
}

// Clear cart
function clearCart() {
  sessionStorage.removeItem("cart");
  renderCart();
}

// Event listener for "Clear Cart" button
clearCartBtn.addEventListener("click", clearCart);

// Initial render
renderProducts();
renderCart();
