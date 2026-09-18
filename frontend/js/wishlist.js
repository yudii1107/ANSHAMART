const wishlistToken = localStorage.getItem("token");
const wishlistContainer = document.getElementById("wishlist-container");

if (!wishlistToken) {
    window.location.href = "login.html";
}

async function loadWishlist() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/wishlist",
            {
                headers: {
                    "Authorization": `Bearer ${wishlistToken}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        if (data.length === 0) {
            wishlistContainer.innerHTML = `
                <div class="empty-wishlist">
                    <h2>Your wishlist is empty</h2>
                    <p>Save products you like and find them here later.</p>
                    <a href="products.html">Continue Shopping</a>
                </div>
            `;
            return;
        }

        wishlistContainer.innerHTML = "";

        data.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "wishlist-card";

            productCard.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}">

                <div class="wishlist-info">
                    <h2>${product.name}</h2>
                    <p class="wishlist-price">₹${product.price}</p>

                    <div class="wishlist-actions">
                        <a href="product?id=${product.product_id}">
                            View Product
                        </a>

                        <button onclick="addToCart(${product.product_id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image_url}')">
                            Add to Cart
                        </button>

                        <button onclick="removeFromWishlist(${product.product_id})">
                            Remove
                        </button>
                    </div>
                </div>
            `;

            wishlistContainer.appendChild(productCard);
        });

    } catch (error) {
        console.log(error);
        wishlistContainer.innerHTML =
            "<p>Unable to load wishlist.</p>";
    }
}

async function removeFromWishlist(productId) {
    try {
        const response = await fetch(
            `http://localhost:5000/api/wishlist/${productId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${wishlistToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to remove product");
        }

        loadWishlist();

    } catch (error) {
        console.log(error);
        alert("Unable to remove product");
    }
}

function addToCart(id, name, price, image_url) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
        product => product.id === id
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            image_url,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart");
}

loadWishlist();