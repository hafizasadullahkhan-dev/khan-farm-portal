
const form = document.querySelector("#feedback form");
const feedbackList = document.querySelector("#feedback-list");

const nameInput = document.querySelector("#visitor-name");
const ratingInput = document.querySelector("#rating");
const messageInput = document.querySelector("#message");

const STORAGE_KEY = "khanFarmFeedback";

function getFeedback() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const feedback = saved ? JSON.parse(saved) : [];

        return Array.isArray(feedback) ? feedback : [];
    } catch (error) {
        console.error("Could not read saved feedback:", error);
        return [];
    }
}

function displayFeedback(feedback) {
    feedbackList.replaceChildren();

    feedback.forEach(function (item) {
        const card = document.createElement("article");
        const heading = document.createElement("h3");
        const ratingText = document.createElement("p");
        const messageText = document.createElement("p");

        heading.textContent = item.name;
        ratingText.textContent = "Rating: " + item.rating + "/5";
        messageText.textContent = item.message;

        card.append(heading, ratingText, messageText);
        feedbackList.append(card);
    });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const rating = ratingInput.value;
    const message = messageInput.value.trim();

    if (!name || !rating || !message) {
        alert("Please complete all feedback fields.");
        return;
    }

    const feedback = getFeedback();

    feedback.unshift({
        name: name,
        rating: Number(rating),
        message: message
    });

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(feedback)
        );
    } catch (error) {
        console.error("Could not save feedback:", error);
        alert("Feedback could not be saved in this browser.");
        return;
    }

    displayFeedback(feedback);
    form.reset();
});

// Load saved feedback when the page opens
displayFeedback(getFeedback());
