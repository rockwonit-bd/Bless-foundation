document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    document.getElementById('languageSelect').value = savedLanguage;

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

    //function to load contact information
    function loadContactInfo() {
        fetch('contact_us_operations.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateContactInfo(data.data);
                } else {
                    console.error('Error loading contact information:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function updateContactInfo(data) {
        const language = localStorage.getItem('selectedLanguage') || 'en';
        const officeAddressElement = document.getElementById('OfficeAddress');
        const googleMapElement = document.querySelector('.google-map');
        const ngoMemberInfoElement = document.getElementById('ngo-member-info');

        if (officeAddressElement) {
            officeAddressElement.textContent = language === 'en' ? data.office_address_en : data.office_address_bn;
        }

        if (googleMapElement) {
            googleMapElement.innerHTML = `<iframe src="${data.google_map_embed_link}" width="600" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
        }

        if (ngoMemberInfoElement) {
            ngoMemberInfoElement.innerHTML = language === 'en' ? data.ngo_member_info_en : data.ngo_member_info_bn;
        }
    }

    // Load contact information on page load
    loadContactInfo();

    // Add event listener for language change
    document.getElementById('languageSelect').addEventListener('change', function() {
        loadContactInfo();
    });
});
