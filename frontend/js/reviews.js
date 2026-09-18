const reviewToken = localStorage.getItem("token");
const reviewProductId = new URLSearchParams(window.location.search).get("id");

const reviewsContainer = document.getElementById("reviews-container");
const submitReviewButton = document.getElementById("submit-review");
const reviewMessage = document.getElementById("review-message");
const stars = document.querySelectorAll(".star-rating span");

let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = Number(star.dataset.rating);

        stars.forEach(item => {
            const rating = Number(item.dataset.rating);

            item.textContent = rating <= selectedRating ? "★" : "☆";
        });
    });
});

async function loadReviews() {
    try {
        const response = await fetch(
            `http://localhost:5000/api/reviews/${reviewProductId}`
        );

        const reviews = await response.json();

        if (!response.ok) {
            throw new Error("Failed to load reviews");
        }

        if (reviews.length === 0) {
            reviewsContainer.innerHTML =
                "<p>No reviews yet. Be the first to review this product.</p>";
            return;
        }

        reviewsContainer.innerHTML = "";

        reviews.forEach(review => {
            const reviewCard = document.createElement("div");

            reviewCard.className = "review-card";

            reviewCard.innerHTML = `
                <div class="review-header">
                    <strong>${review.name}</strong>
                    <span>${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
                </div>

                <p>${review.review}</p>

                <small>
                    ${new Date(review.created_at).toLocaleDateString("en-IN")}
                </small>
            `;

            reviewsContainer.appendChild(reviewCard);
        });

    } catch (error) {
        console.log(error);
        reviewsContainer.innerHTML =
            "<p>Unable to load reviews.</p>";
    }
}

submitReviewButton.addEventListener("click", async () => {

    if (!reviewToken) {
        window.location.href = "login.html";
        return;
    }

    const review = document.getElementById("review-text").value.trim();

    if (!selectedRating || !review) {
        reviewMessage.textContent =
            "Please select a rating and write a review.";
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/reviews",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${reviewToken}`
                },
                body: JSON.stringify({
                    product_id: reviewProductId,
                    rating: selectedRating,
                    review
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            reviewMessage.textContent = data.message;
            return;
        }

        reviewMessage.textContent = "Review added successfully.";

        selectedRating = 0;

        stars.forEach(star => {
            star.textContent = "☆";
        });

        document.getElementById("review-text").value = "";

        loadReviews();

    } catch (error) {
        console.log(error);
        reviewMessage.textContent =
            "Unable to submit review.";
    }
});

loadReviews();