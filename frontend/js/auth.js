const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            registerMessage.textContent = "Passwords do not match";
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                registerMessage.textContent = data.message;
                return;
            }

            registerMessage.textContent = "Registration successful! Redirecting...";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } catch (error) {
            registerMessage.textContent = "Unable to connect to server";
        }
    });
}


const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                loginMessage.textContent = data.message;
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            loginMessage.textContent = "Login successful! Redirecting...";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {
            loginMessage.textContent = "Unable to connect to server";
        }
    });
}