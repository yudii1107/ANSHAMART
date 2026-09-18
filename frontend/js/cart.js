function loadCart() {
    const cartItems = document.getElementById("cart-items");
    const cartSummary = document.getElementById("cart-summary");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        cartSummary.innerHTML = "";
        updateCartCount();
        return;
    }

    cartItems.innerHTML = "";

    cart.forEach(product => {
        const item = document.createElement("div");
        item.className = "cart-item";

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="cart-item-info">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>

                <div class="cart-quantity">
                    <button onclick="changeCartQuantity(${product.id}, -1)">−</button>
                    <span>${product.quantity}</span>
                    <button onclick="changeCartQuantity(${product.id}, 1)">+</button>
                </div>

                <button class="remove-button" onclick="removeFromCart(${product.id})">
                    Remove
                </button>
            </div>
        `;

        cartItems.appendChild(item);
    });

    const total = cart.reduce((sum, product) => {
        return sum + Number(product.price) * product.quantity;
    }, 0);

    cartSummary.innerHTML = `
        <h2>Cart Total: ₹${total.toFixed(2)}</h2>
        <button class="checkout-button" onclick="goToCheckout()">Proceed to Checkout</button>
    `;

    updateCartCount();
}

function changeCartQuantity(id, amount) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = cart.find(item => item.id === id);

    if (!product) {
        return;
    }

    product.quantity += amount;

    if (product.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(product => product.id !== id);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const count = cart.reduce((total, product) => {
        return total + product.quantity;
    }, 0);

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }
}

loadCart();

function goToCheckout() {
    window.location.href = "/checkout.html";
}