document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);

        fetch('submit_message.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formMessage.innerHTML = `<div class="success-message">${data.success}</div>`;
                    form.reset();
                } else if (data.error) {
                    formMessage.innerHTML = `<div class="error-message">${data.error}</div>`;
                }
                formMessage.style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
                formMessage.innerHTML = '<div class="error-message">An error occurred. Please try again.</div>';
                formMessage.style.display = 'block';
            });
    });
});