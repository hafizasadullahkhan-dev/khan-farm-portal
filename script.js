
const form = document.querySelector("#feedback form");
const feedbackList = document.querySelector("#feedback-list");
const feedbackCount = document.querySelector("#feedback-count");

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

    // Update the feedback count
    feedbackCount.textContent =
        feedback.length === 1
            ? "1 feedback"
            : feedback.length + " feedbacks";

    // Show a message when there are no feedback cards
    if (feedback.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No feedback yet. Be the first to share!";
        feedbackList.append(emptyMessage);
        return;
    }

    feedback.forEach(function (item, index) {
        const card = document.createElement("article");
        const heading = document.createElement("h3");
        const ratingText = document.createElement("p");
        const messageText = document.createElement("p");
        const deleteButton = document.createElement("button");

        heading.textContent = item.name;
        ratingText.textContent = "Rating: " + item.rating + "/5";
        messageText.textContent = item.message;

        deleteButton.textContent = "Delete Feedback";
        deleteButton.type = "button";
        deleteButton.dataset.index = index;
        deleteButton.className = "delete-feedback";

        card.append(
            heading,
            ratingText,
            messageText,
            deleteButton
        );

        feedbackList.append(card);
    });
}


feedbackList.addEventListener("click", function (event) {
    const button = event.target.closest("button.delete-feedback");

    if (!button) {
        return;
    }

    const index = Number(button.dataset.index);

    if (!Number.isInteger(index) || index < 0) {
        return;
    }

    const feedback = getFeedback();

    if (index >= feedback.length) {
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete this feedback?"
    );

    if (!confirmed) {
        return;
    }

    feedback.splice(index, 1);

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(feedback)
        );

        displayFeedback(feedback);
    } catch (error) {
        console.error("Could not update saved feedback:", error);
        alert("Feedback could not be deleted. Please try again.");
    }
});

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
