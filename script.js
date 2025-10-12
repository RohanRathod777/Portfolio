let menuIcon = document.querySelector("#menu-icon");
let navBar = document.querySelector('.navbar');

menuIcon.onclick = () => {
      menuIcon.classList.toggle('bx-x');
      navBar.classList.toggle('active');
}

// Formspree Form Handling
window.addEventListener("DOMContentLoaded", function() {
    var form = document.querySelector("form");
    
    if (form) {
        form.addEventListener("submit", function(e) {
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