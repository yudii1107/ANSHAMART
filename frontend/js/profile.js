const profileToken = localStorage.getItem("token");

if (!profileToken) {
    window.location.href = "login.html";
}

const profileForm = document.getElementById("profile-form");
const profileMessage = document.getElementById("profile-message");

async function loadProfile() {
    try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
            headers: {
                "Authorization": `Bearer ${profileToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        document.getElementById("name").value = data.name || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("phone").value = data.phone || "";
        document.getElementById("address").value = data.address || "";
        document.getElementById("city").value = data.city || "";
        document.getElementById("pincode").value = data.pincode || "";

    } catch (error) {
        profileMessage.textContent = error.message || "Unable to load profile";
    }
}

profileForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const profileData = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        pincode: document.getElementById("pincode").value.trim()
    };

    try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${profileToken}`
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        localStorage.setItem("user", JSON.stringify({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email
        }));

        profileMessage.textContent = "Profile updated successfully";

    } catch (error) {
        profileMessage.textContent = error.message || "Unable to update profile";
    }
});

loadProfile();