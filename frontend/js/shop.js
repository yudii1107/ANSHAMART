const API_URL = "http://localhost:5000/api/products";

const productsContainer = document.getElementById("products-container");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortProducts = document.getElementById("sort-products");
const productCount = document.getElementById("product-count");
const shopStatusText = document.getElementById("shop-status-text");
const clearFilters = document.getElementById("clear-filters");

async function loadProducts() {
    try {
        productsContainer.innerHTML = `
            <div class="shop-loading">
                <div class="loading-spinner"></div>
                <p>Loading products...</p>
            </div>
        `;

        const search = searchInput.value.trim();
        const category = categoryFilter.value;
        const sort = sortProducts.value;

        let url = API_URL;

        const params = new URLSearchParams();

        if (search) {
            params.append("search", search);
        }

        if (category) {
            params.append("category", category);
        }

        if (sort) {
            params.append("sort", sort);
        }

        if (params.toString()) {
            url += "?" + params.toString();
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const products = await response.json();

        displayProducts(products);
        updateShopStatus(products.length);

    } catch (error) {
        console.error(error);

        productsContainer.innerHTML = `
            <div class="shop-empty">
                <div class="empty-icon">⚠️</div>
                <h2>Unable to load products</h2>
                <p>Please make sure the AnshaMart server is running.</p>
                <button class="primary-btn" onclick="loadProducts()">
                    Try Again
                </button>
            </div>
        `;

        if (productCount) {
            productCount.textContent = "";
        }
    }
}

function displayProducts(products) {
    productsContainer.innerHTML = "";

    if (!products || products.length === 0) {
        productsContainer.innerHTML = `
            <div class="shop-empty">
                <div class="empty-icon">🔍</div>
                <h2>No products found</h2>
                <p>Try another search or category.</p>
                <button class="secondary-btn" onclick="resetFilters()">
                    Clear Filters
                </button>
            </div>
        `;

        return;
    }

    products.forEach(product => {
        const card = document.createElement("article");

        card.className = "shop-product-card";

        const image = product.image_url || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80";

        const price = Number(product.price).toLocaleString("en-IN");

        const safeName = String(product.name)
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
            .replace(/"/g, "&quot;");

        const safeImage = String(image)
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'");

        card.innerHTML = `
            <div class="shop-product-image">
                <a href="product.html?id=${product.id}">
                    <img
                        src="${image}"
                        alt="${product.name}"
                        onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80';"
                    >
                </a>

                <span class="shop-product-category">
                    ${product.category_name || "Product"}
                </span>
            </div>

            <div class="shop-product-info">

                <p class="shop-product-brand">
                    ${product.brand || "AnshaMart"}
                </p>

                <a href="product.html?id=${product.id}">
                    <h3>${product.name}</h3>
                </a>

                <div class="shop-product-bottom">
                    <strong>₹${price}</strong>

                    <button
                        class="shop-add-cart"
                        onclick="addToCart(
                            ${product.id},
                            '${safeName}',
                            ${Number(product.price)},
                            '${safeImage}'
                        )"
                    >
                        Add to Cart
                    </button>
                </div>

            </div>
        `;

        productsContainer.appendChild(card);
    });
}

function updateShopStatus(count) {
    if (productCount) {
        productCount.textContent =
            `${count} ${count === 1 ? "product" : "products"}`;
    }

    if (!shopStatusText) {
        return;
    }

    const search = searchInput.value.trim();
    const category = categoryFilter.value;

    if (search && category) {
        shopStatusText.textContent =
            `Results for "${search}" in ${category}`;
    } else if (search) {
        shopStatusText.textContent =
            `Search results for "${search}"`;
    } else if (category) {
        shopStatusText.textContent =
            `${category} Products`;
    } else {
        shopStatusText.textContent = "All Products";
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

    const count = cart.reduce(
        (total, product) => total + product.quantity,
        0
    );

    const cartCount = document.getElementById("cart-count");
    const footerCount = document.getElementById("cart-count-footer");

    if (cartCount) {
        cartCount.textContent = count;
    }

    if (footerCount) {
        footerCount.textContent = count;
    }
}

function resetFilters() {
    searchInput.value = "";
    categoryFilter.value = "";
    sortProducts.value = "";

    loadProducts();
}

let searchTimer;

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
        loadProducts();
    }, 300);
});

categoryFilter.addEventListener("change", loadProducts);

sortProducts.addEventListener("change", loadProducts);

if (clearFilters) {
    clearFilters.addEventListener("click", resetFilters);
}

loadProducts();
updateCartCount();