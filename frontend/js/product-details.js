const API_URL = "http://localhost:5000/api/products";

async function loadProduct() {
    const container = document.getElementById("product-details");

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
        container.innerHTML = "<p>Product not found.</p>";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Product not found");
        }

        const product = await response.json();

        container.innerHTML = `
            <div class="product-detail-image">
                <img src="${product.image_url}" alt="${product.name}">
            </div>

            <div class="product-detail-info">
                <p class="product-category">${product.category_name}</p>

                <h1>${product.name}</h1>

                <p class="product-detail-price">₹${product.price}</p>

                <p class="product-description">${product.description}</p>

                <p class="product-stock">
                    ${product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>

                <div class="quantity-box">
                    <button onclick="changeQuantity(-1)">−</button>
                    <span id="quantity">1</span>
                    <button onclick="changeQuantity(1)">+</button>
                </div>

                <button class="add-cart-button" onclick="addProductToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image_url}')">
                    Add to Cart
                </button>

                <a href="products.html" class="back-shop-button">
                    Back to Shop
                </a>
            </div>
        `;

    } catch (error) {
        container.innerHTML = "<p>Unable to load product.</p>";
    }
}

function changeQuantity(amount) {
    const quantityElement = document.getElementById("quantity");
    let quantity = parseInt(quantityElement.textContent);

    quantity += amount;

    if (quantity < 1) {
        quantity = 1;
    }

    quantityElement.textContent = quantity;
}

function addProductToCart(id, name, price, image) {
    const quantity = parseInt(document.getElementById("quantity").textContent);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(product => product.id === id);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: quantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart");
}

loadProduct();
const wishlistButton = document.getElementById("wishlist-button");
const wishlistMessage = document.getElementById("wishlist-message");

if (wishlistButton) {
    const wishlistToken = localStorage.getItem("token");
    const productId = new URLSearchParams(window.location.search).get("id");

    async function checkWishlist() {
        if (!wishlistToken || !productId) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/wishlist/check/${productId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${wishlistToken}`
                    }
                }
            );

            const data = await response.json();

            if (data.wishlisted) {
                wishlistButton.textContent = "♥ In Wishlist";
            }

        } catch (error) {
            console.log(error);
        }
    }

    wishlistButton.addEventListener("click", async () => {
        if (!wishlistToken) {
            window.location.href = "login.html";
            return;
        }

        try {
            if (wishlistButton.textContent.includes("In Wishlist")) {
                const response = await fetch(
                    `http://localhost:5000/api/wishlist/${productId}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${wishlistToken}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    wishlistButton.textContent = "♡ Add to Wishlist";
                    wishlistMessage.textContent = data.message;
                }

            } else {
                const response = await fetch(
                    "http://localhost:5000/api/wishlist",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${wishlistToken}`
                        },
                        body: JSON.stringify({
                            product_id: productId
                        })
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    wishlistButton.textContent = "♥ In Wishlist";
                    wishlistMessage.textContent = data.message;
                }
            }

        } catch (error) {
            wishlistMessage.textContent = "Unable to update wishlist";
        }
    });

    checkWishlist();
}