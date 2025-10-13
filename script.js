let menuIcon = document.querySelector("#menu-icon");
let navBar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navBar.classList.toggle('active');
}

// Formspree Form Handling
window.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            var submitBtn = form.querySelector('input[type="submit"]');
            var originalText = submitBtn.value;

            // Show loading state
            submitBtn.value = "Sending...";
            submitBtn.disabled = true;

            var formData = new FormData(form);

            fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // Show success message
                    showMessage("Thank you! Your message has been sent successfully.", "success");
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            }).catch(error => {
                // Show error message
                showMessage("Sorry, there was an error sending your message. Please try again.", "error");
            }).finally(() => {
                // Reset button
                submitBtn.value = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    function showMessage(message, type) {
        // Remove existing messages
        var existingMsg = document.querySelector('.form-message');
        if (existingMsg) {
            existingMsg.remove();
        }

        // Create new message
        var messageDiv = document.createElement('div');
        messageDiv.className = 'form-message ' + type;
        messageDiv.textContent = message;

        // Style the message
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            font-size: 1.8rem;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 400px;
            word-wrap: break-word;
        `;

        document.body.appendChild(messageDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
});


// Review Modal functionality

const modal = document.getElementById('reviewModal');
const modalProjectName = document.getElementById('modalProjectName');
const reviewForm = document.getElementById('reviewForm');
const closeModalBtn = document.getElementById('closeModal');
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('reviewRating');
const alertBox = document.getElementById('alertBox');
const submitBtn = reviewForm.querySelector('button[type="submit"]');

let currentProjectCard = null;
let projectRatings = {};

// Show toast alert
function showSuccessAlert(message) {
    alertBox.textContent = message;
    alertBox.classList.add('show');
    setTimeout(() => alertBox.classList.remove('show'), 3000);
}

// Open modal on review button click
document.querySelectorAll('.review-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        currentProjectCard = e.target.closest('.project-card');
        const projectName = currentProjectCard.getAttribute('data-project');
        modalProjectName.innerText = projectName;
        modal.style.display = 'flex';

        reviewForm.reset();
        ratingInput.value = '';
        stars.forEach((s) => s.classList.remove('selected'));
    });
});

// Close modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    reviewForm.reset();
    stars.forEach((s) => s.classList.remove('selected'));
});

// Star rating logic
stars.forEach((star) => {
    star.addEventListener('click', () => {
        const selectedRating = parseInt(star.dataset.value);
        ratingInput.value = selectedRating;

        stars.forEach((s, i) => {
            s.classList.toggle('selected', i < selectedRating);
        });
    });
});

// Submit review with loading state
reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewerName').value.trim();
    const email = document.getElementById('reviewerEmail').value.trim();
    const rating = parseInt(ratingInput.value);
    const review = document.getElementById('reviewText').value.trim();
    const projectName = modalProjectName.textContent;

    if (!name || !email || !rating || !review) {
        showSuccessAlert('⚠️ Please complete all fields including your email and select a rating.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    if (!projectRatings[projectName]) {
        projectRatings[projectName] = { total: 0, count: 0 };
    }

    projectRatings[projectName].total += rating;
    projectRatings[projectName].count += 1;

    const avg = projectRatings[projectName].total / projectRatings[projectName].count;
    const starCount = Math.round(avg);
    const starDisplay = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

    const ratingDisplay = currentProjectCard.querySelector('.rating-stars');
    if (ratingDisplay) ratingDisplay.innerHTML = starDisplay;

    try {
        const response = await fetch("https://formspree.io/f/mwprwljn", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Name: name,
                Email: email,
                Project: projectName,
                Rating: rating,
                Review: review
            })
        });

        if (response.ok) {
            showSuccessAlert('✅ Thank you! Your review was submitted.');
        } else {
            showSuccessAlert('❌ Failed to submit review. Try again.');
        }
    } catch (error) {
        console.error(error);
        showSuccessAlert('❌ Error sending review. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
    }

    modal.style.display = 'none';
    reviewForm.reset();
    stars.forEach((s) => s.classList.remove('selected'));
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        reviewForm.reset();
        stars.forEach((s) => s.classList.remove('selected'));
    }
});
