const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const navActions = document.querySelector(".nav-actions");

if (token && user && navActions) {
    navActions.innerHTML = `
        <span>Hi, ${user.name}</span>
        <a href="profile.html" title="Profile">👤</a>
        <a href="wishlist.html" title="Wishlist">❤️</a>
        <a href="cart.html" class="cart-link" title="Cart">
            🛒 <span id="cart-count">0</span>
        </a>
        <a href="#" id="logout-link">Logout</a>
    `;

    const logoutLink = document.getElementById("logout-link");

    logoutLink.addEventListener("click", function (e) {
        e.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    });
}