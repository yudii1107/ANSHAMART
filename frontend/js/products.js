const API_URL = "http://localhost:5000/api/products";

async function loadFeaturedProducts() {
    const container = document.getElementById("featured-products");

    if (!container) {
        return;
    }

    try {
        const response = await fetch(API_URL);
        const products = await response.json();

        const featuredProducts = products.slice(0, 8);

        container.innerHTML = "";

        featuredProducts.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
                <a href="product?id=${product.id}">
                    <div class="product-image">
                        <img src="${product.image_url}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <p class="product-category">${product.category_name}</p>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">₹${product.price}</p>
                    </div>
                </a>
                <div class="product-info">
                    <button class="product-button" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image_url}')">
                        Add to Cart
                    </button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = "<p>Unable to load products.</p>";
        console.log(error);
    }
}

function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(product => product.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("Product added to cart");
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

loadFeaturedProducts();
updateCartCount();