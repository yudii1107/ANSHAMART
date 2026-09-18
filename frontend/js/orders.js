const ordersContainer = document.getElementById("orders-container");

async function loadOrders() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    const orders = data;

    if (orders.length === 0) {
      ordersContainer.innerHTML = "<p>No orders found.</p>";
      return;
    }

    ordersContainer.innerHTML = "";

    orders.forEach((order) => {
      const orderDiv = document.createElement("div");
      orderDiv.className = "order-card";

      let itemsHTML = "";

      order.items.forEach((item) => {
        itemsHTML += `
          <div class="order-item">
            <img src="${item.image_url}" alt="${item.name}">

            <div class="order-item-info">
              <h3>${item.name}</h3>
              <p>Quantity: ${item.quantity}</p>
            </div>

            <div class="order-item-price">
              ₹${item.price}
            </div>
          </div>
        `;
      });

      orderDiv.innerHTML = `
        <div class="order-header">
          <div>
            <h2>Order #${order.id}</h2>
            <p class="order-date">
              Placed on ${new Date(order.created_at).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              )}
            </p>
          </div>

          <span class="order-status ${order.status.toLowerCase()}">
              ${order.status}
          </span>
        </div>

        <div class="order-info">
          <div>
            <small>DELIVERY TO</small>
            <p>${order.name}</p>
            <p>${order.city}</p>
          </div>

          <div>
            <small>PAYMENT</small>
            <p>${order.payment_method}</p>
          </div>
        </div>

        <div class="order-items">
          ${itemsHTML}
        </div>

        <div class="order-footer">
          <span>Total Amount</span>
          <strong>₹${order.total_amount}</strong>
        </div>
      `;

      ordersContainer.appendChild(orderDiv);
    });
  } catch (error) {
    console.log(error);
    ordersContainer.innerHTML = "<p>Unable to load orders.</p>";
  }
}

loadOrders();
