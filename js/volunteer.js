document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    document.getElementById('languageSelect').value = savedLanguage;
});

//Volunteer Bangladesh
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('volunteerFormBn');
    const formMessage = document.getElementById('formMessage');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');

    const validEmailDomains = [
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com',
        'aol.com',
        'icloud.com',
        'protonmail.com',
        'mail.com',
        'zoho.com',
        'yandex.com'
    ];

    function validateEmail(email) {
        if (!email) return false;
        const domain = email.split('@')[1];
        return validEmailDomains.includes(domain);
    }

    function validatePhone(phone) {
        // Regex for Bangladeshi phone numbers
        const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
        return phoneRegex.test(phone);
    }

    if (emailInput && emailError) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                emailError.textContent = 'Please use a valid email from a common provider (e.g., Gmail, Yahoo, Outlook).';
            } else {
                emailError.textContent = '';
            }
        });
    } else {
        console.error('Email input or error element not found');
    }

    if (phoneInput && phoneError) {
        phoneInput.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                phoneError.textContent = 'Please enter a valid Bangladeshi phone number (e.g., +8801712345678 or 01712345678).';
            } else {
                phoneError.textContent = '';
            }
        });
    } else {
        console.error('Phone input or error element not found');
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!emailInput || !phoneInput) {
                console.error('Email or phone input not found');
                return;
            }

            if (!validateEmail(emailInput.value)) {
                if (emailError) {
                    emailError.textContent = 'Please use a valid email from a common provider (e.g., Gmail, Yahoo, Outlook).';
                }
                return;
            }

            if (!validatePhone(phoneInput.value)) {
                if (phoneError) {
                    phoneError.textContent = 'Please enter a valid Bangladeshi phone number (e.g., +8801712345678 or 01712345678).';
                }
                return;
            }

            const formData = new FormData(this);

            fetch('submit-volunteer-bn.php', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return response.json();
                    } else {
                        throw new Error("Oops, we haven't got JSON!");
                    }
                })
                .then(data => {
                    if (formMessage) {
                        if (data.success) {
                            formMessage.innerHTML = '<p class="success">' + data.message + '</p>';
                            form.reset();
                            if (typeof hcaptcha !== 'undefined' && hcaptcha.reset) {
                                hcaptcha.reset();
                            } else {
                                console.warn('hCaptcha not found or reset method not available');
                            }
                        } else {
                            formMessage.innerHTML = '<p class="error">' + data.message + '</p>';
                        }
                    } else {
                        console.error('formMessage element not found');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (formMessage) {
                        formMessage.innerHTML = '<p class="error">An error occurred. Please try again later.</p>';
                    } else {
                        console.error('formMessage element not found');
                    }
                });
        });
    } else {
        console.error('volunteerFormBn element not found');
    }
});

// International Volunteer Form
document.addEventListener('DOMContentLoaded', function() {
    const formIn = document.getElementById('volunteerFormIn');
    const formMessageIn = document.getElementById('formMessageIn');
    const emailInputIn = document.getElementById('emailIn');
    const emailErrorIn = document.getElementById('emailErrorIn');
    const phoneInputIn = document.getElementById('phoneIn');
    const phoneErrorIn = document.getElementById('phoneErrorIn');

    const validEmailDomains = [
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com',
        'aol.com',
        'icloud.com',
        'protonmail.com',
        'mail.com',
        'zoho.com',
        'yandex.com'
    ];

    function validateEmail(email) {
        if (!email) return false;
        const domain = email.split('@')[1];
        return validEmailDomains.includes(domain);
    }

    function validatePhone(phone) {
        // Simple regex for international phone numbers
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    }

    if (emailInputIn && emailErrorIn) {
        emailInputIn.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                emailErrorIn.textContent = 'Please use a valid email from a common provider (e.g., Gmail, Yahoo, Outlook).';
            } else {
                emailErrorIn.textContent = '';
            }
        });
    }

    if (phoneInputIn && phoneErrorIn) {
        phoneInputIn.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                phoneErrorIn.textContent = 'Please enter a valid international phone number (e.g., +1234567890).';
            } else {
                phoneErrorIn.textContent = '';
            }
        });
    }

    if (formIn) {
        formIn.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!emailInputIn || !phoneInputIn) {
                console.error('Email or phone input not found');
                return;
            }

            if (!validateEmail(emailInputIn.value)) {
                if (emailErrorIn) {
                    emailErrorIn.textContent = 'Please use a valid email from a common provider (e.g., Gmail, Yahoo, Outlook).';
                }
                return;
            }

            if (!validatePhone(phoneInputIn.value)) {
                if (phoneErrorIn) {
                    phoneErrorIn.textContent = 'Please enter a valid international phone number (e.g., +1234567890).';
                }
                return;
            }

            const formData = new FormData(this);

            fetch('submit-volunteer-in.php', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return response.json();
                    } else {
                        throw new Error("Oops, we haven't got JSON!");
                    }
                })
                .then(data => {
                    if (formMessageIn) {
                        if (data.success) {
                            formMessageIn.innerHTML = '<p class="success">' + data.message + '</p>';
                            formIn.reset();
                            if (typeof hcaptcha !== 'undefined' && hcaptcha.reset) {
                                hcaptcha.reset();
                            } else {
                                console.warn('hCaptcha not found or reset method not available');
                            }
                        } else {
                            formMessageIn.innerHTML = '<p class="error">' + data.message + '</p>';
                        }
                    } else {
                        console.error('formMessageIn element not found');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (formMessageIn) {
                        formMessageIn.innerHTML = '<p class="error">An error occurred. Please try again later.</p>';
                    } else {
                        console.error('formMessageIn element not found');
                    }
                });
        });
    } else {
        console.error('volunteerFormIn element not found');
    }
});


