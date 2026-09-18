const API_URL = "http://localhost:5000/api/orders";

function loadCheckout() {
    const itemsContainer = document.getElementById("checkout-items");
    const totalElement = document.getElementById("checkout-total");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        itemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalElement.textContent = "";
        return;
    }

    itemsContainer.innerHTML = "";

    cart.forEach(product => {
        const item = document.createElement("div");

        item.innerHTML = `
            <p>
                ${product.name} × ${product.quantity}
                <strong>₹${(Number(product.price) * product.quantity).toFixed(2)}</strong>
            </p>
        `;

        itemsContainer.appendChild(item);
    });

    const total = cart.reduce((sum, product) => {
        return sum + Number(product.price) * product.quantity;
    }, 0);

    totalElement.textContent = `Total: ₹${total.toFixed(2)}`;
}

document.getElementById("place-order-button").addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login before placing an order");
        window.location.href = "login.html";
        return;
    }

    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !address || !city || !pincode || !phone) {
        alert("Please fill all delivery details");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }

    const total = cart.reduce((sum, product) => {
        return sum + Number(product.price) * product.quantity;
    }, 0);

    const items = cart.map(product => {
        return {
            product_id: product.id,
            quantity: product.quantity,
            price: Number(product.price)
        };
    });

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                address,
                city,
                pincode,
                phone,
                total_amount: total,
                payment_method: "COD",
                items
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert("Order placed successfully");

        localStorage.removeItem("cart");

        window.location.href = "orders.html";

    } catch (error) {
        alert(error.message || "Failed to place order");
        console.log(error);
    }
});

loadCheckout();