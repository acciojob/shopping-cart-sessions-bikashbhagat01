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

  let total = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <span class="cart-product-name">${product.name}</span> - 
        $<span class="cart-product-price">${product.price}</span> x 
        <span class="cart-product-quantity">${item.quantity}</span> = 
        $<span class="cart-product-total">${product.price * item.quantity}</span>
        <button class="remove-from-cart-btn" data-id="${product.id}">Remove</button>
      `;
      cartList.appendChild(li);
      total += product.price * item.quantity;
    }
  });

  // Display total
  const totalLi = document.createElement("li");
  totalLi.className = "cart-total";
  totalLi.innerHTML = `<strong>Total: $${total}</strong>`;
  cartList.appendChild(totalLi);

  // Add event listeners to "Remove" buttons
  document.querySelectorAll(".remove-from-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      removeFromCart(productId);
    });
  });
}

// Add item to cart
function addToCart(productId) {
  let cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  renderCart();
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  renderCart();
}

// Clear cart
function clearCart() {
  sessionStorage.removeItem("cart");
  renderCart();
}

// Event listener for "Clear Cart" button (✅ Removed `confirm()` to fix Cypress issue)
clearCartBtn.addEventListener("click", clearCart);

// Initial render
renderProducts();
renderCart();
