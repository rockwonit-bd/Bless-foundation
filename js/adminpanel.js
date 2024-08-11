function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Hide all home sections
    document.querySelectorAll('.home-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';

    // Update the section title
    document.getElementById('sectionTitle').textContent = document.querySelector(`a[onclick="showSection('${sectionId}')"]`).textContent;

    // If it's the manageUsers section, show the user table by default
    if (sectionId === 'manageUsers') {
        document.getElementById('userTable').style.display = 'block';
        document.getElementById('addUserForm').style.display = 'none';
        loadUsers();
    }

    // Initialize specific sections if needed
    if (sectionId === 'projects') {
        initializeProjectsSection();
    } else if (sectionId === 'aboutUs') {
        initializeAboutUsSummernote();
    } else if (sectionId === 'photos') {
        initializePhotosSection();
    } else if (sectionId === 'videos') {
        initializeVideosSection();
    } else if (sectionId === 'volunteer') {
        initializeVolunteerSection();
    } else if (sectionId === 'highlightingMotivatingTales') {
        initializeTaleSummernote();
        loadTales();
        showTaleSection('manageTales');
    } else if (sectionId === 'logo') {
        loadCurrentLogos();
    } else if (sectionId === 'latestDevelopments') {
        initializeLatestDevelopmentsSection();
    } else if (sectionId === 'imageSlider') {
        loadSliderImages();
    }
}

// Latest Developments Section

function initializeLatestDevelopmentsSection() {
    loadLatestDevelopments();
    showLatestDevelopmentsTable()
    document.getElementById('newDevelopmentForm').addEventListener('submit', addLatestDevelopment);
}

function showLatestDevelopmentsForm() {
    document.getElementById('addLatestDevelopmentForm').style.display = 'block';
    document.getElementById('manageLatestDevelopments').style.display = 'none';
}

function showLatestDevelopmentsTable() {
    document.getElementById('addLatestDevelopmentForm').style.display = 'none';
    document.getElementById('manageLatestDevelopments').style.display = 'block';
    loadLatestDevelopments();
}

function loadLatestDevelopments() {
    fetch('latest_developments_handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tableBody = document.querySelector('#manageLatestDevelopments table tbody');
                tableBody.innerHTML = '';
                data.developments.forEach(dev => {
                    const row = `
                    <tr>
                        <td>${dev.headline}</td>
                        <td><a href="${dev.link}" target="_blank">${dev.link}</a></td>
                        <td>
                            <button onclick="editDevelopment(${dev.id}, '${dev.headline}', '${dev.link}')">Edit</button>
                            <button onclick="deleteDevelopment(${dev.id})">Delete</button>
                        </td>
                    </tr>
                `;
                    tableBody.insertAdjacentHTML('beforeend', row);
                });
            } else {
                alert('Failed to load developments: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function addLatestDevelopment(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    formData.append('action', 'add');

    fetch('latest_developments_handler.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Development added successfully');
                form.reset();
                showLatestDevelopmentsTable();
            } else {
                alert('Failed to add development: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function editDevelopment(id, headline, link) {
    const newHeadline = prompt('Enter new headline:', headline);
    const newLink = prompt('Enter new link:', link);

    if (newHeadline && newLink) {
        const formData = new FormData();
        formData.append('action', 'edit');
        formData.append('id', id);
        formData.append('headline', newHeadline);
        formData.append('link', newLink);

        fetch('latest_developments_handler.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Development updated successfully');
                    loadLatestDevelopments();
                } else {
                    alert('Failed to update development: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

function deleteDevelopment(id) {
    if (confirm('Are you sure you want to delete this development?')) {
        fetch('latest_developments_handler.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=delete&id=${id}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Development deleted successfully');
                    loadLatestDevelopments();
                } else {
                    alert('Failed to delete development: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// Make sure to call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeLatestDevelopmentsSection();
});

/*Image Slider*/
function loadSliderImages() {
    fetch('image_slider_handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const container = document.getElementById('sliderImages');
                container.innerHTML = '';
                data.images.forEach(image => {
                    const imageDiv = document.createElement('div');
                    imageDiv.className = 'slider-image';
                    imageDiv.innerHTML = `
                    <img src="${image.image_path}" alt="${image.caption}" style="max-width: 200px;">
                    <p>${image.caption}</p>
                    <button onclick="deleteSliderImage(${image.id})">Delete</button>
                `;
                    container.appendChild(imageDiv);
                });
            } else {
                alert('Failed to load images: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}
function addSliderImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        const caption = prompt('Enter a caption for the image:');
        if (file && caption !== null) {
            uploadSliderImage(file, caption);
        }
    };
    fileInput.click();
}

function uploadSliderImage(file, caption) {
    const formData = new FormData();
    formData.append('action', 'add');
    formData.append('image', file);
    formData.append('caption', caption);

    fetch('image_slider_handler.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Image uploaded successfully');
                loadSliderImages();
            } else {
                alert('Failed to upload image: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function deleteSliderImage(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        fetch('image_slider_handler.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=delete&id=${id}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Image deleted successfully');
                    loadSliderImages();
                } else {
                    alert('Failed to delete image: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadSliderImages();
});

/!*Manage Users*/
function toggleAddUserForm() {
    const form = document.getElementById('addUserForm');
    const table = document.getElementById('userTable');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    table.style.display = form.style.display === 'none' ? 'none' : 'none';
}

function toggleUserTable() {
    const form = document.getElementById('addUserForm');
    const table = document.getElementById('userTable');
    table.style.display = table.style.display === 'none' ? 'block' : 'none';
    form.style.display = table.style.display === 'none' ? 'none' : 'none';
}

function loadUsers() {
    fetch('user_management.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=getUsers'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tableBody = document.querySelector('#userTable tbody');
                tableBody.innerHTML = '';
                data.users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>
                    <div class="form-section">
                        <button onclick="editUser(${user.id}, '${user.username}', '${user.email}')">Edit</button>
                        ${user.id !== '1' ? `<button onclick="deleteUser(${user.id})">Delete</button>` : ''}
                        </div>
                    </td>
                `;
                    tableBody.appendChild(row);
                });
            } else {
                alert('Failed to load users: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function addUser() {
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;

    fetch('user_management.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=addUser&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('User added successfully');
                loadUsers();
                clearAddUserForm();
                toggleUserTable()
            } else {
                alert('Failed to add user: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function clearAddUserForm() {
    document.getElementById('newUsername').value = '';
    document.getElementById('newEmail').value = '';
    document.getElementById('newPassword').value = '';
}

function editUser(id, username, email) {
    const newUsername = prompt('Enter new username:', username);
    const newEmail = prompt('Enter new email:', email);
    const newPassword = prompt('Enter new password (leave blank to keep current password):');

    if (newUsername && newEmail) {
        const formData = new FormData();
        formData.append('action', 'updateUser');
        formData.append('id', id);
        formData.append('username', newUsername);
        formData.append('email', newEmail);
        if (newPassword) {
            formData.append('password', newPassword);
        }

        fetch('user_management.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('User updated successfully');
                    loadUsers();
                } else {
                    alert('Failed to update user: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch('user_management.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=deleteUser&id=${id}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('User deleted successfully');
                    loadUsers();
                } else {
                    alert('Failed to delete user: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
});

//Logos
function loadCurrentLogos() {
    fetch('get_logos.php')
        .then(response => response.json())
        .then(data => {
            const topLogoPreview = document.getElementById('topLogoPreview');
            const bottomLogoPreview = document.getElementById('bottomLogoPreview');

            topLogoPreview.innerHTML = data.top ? `<img src="${data.top}" alt="Top Logo" style="max-width: 200px;">` : 'No top logo uploaded';
            bottomLogoPreview.innerHTML = data.bottom ? `<img src="${data.bottom}" alt="Bottom Logo" style="max-width: 200px;">` : 'No bottom logo uploaded';
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('homePage').style.display !== 'none') {
        showHomeSection('logo');
        loadCurrentLogos();
    }
});

//event listeners for form submissions
document.querySelectorAll('#logoSection form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch('update_logo.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(result => {
                alert(result);
                loadCurrentLogos();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while uploading the logo.');
            });
    });
});

//Social Links
document.addEventListener('DOMContentLoaded', function() {
    const socialLinksForm = document.getElementById('socialLinksForm');

    if (socialLinksForm) {
        socialLinksForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the form from submitting normally

            const formData = new FormData(this);

            fetch('update_social_links.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(result => {
                    alert(result); // Display the success message as an alert
                    // Optionally, you can clear the form fields here:
                    // this.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while updating social links.');
                });
        });
    } else {
        console.error('Social links form not found');
    }
});

function loadSocialLinks() {
    fetch('update_social_links.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('facebook').value = data.data.facebook || '';
                document.getElementById('youtube').value = data.data.youtube || '';
                document.getElementById('instagram').value = data.data.instagram || '';
            } else {
                console.error('Error loading social links:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadSocialLinks();
});

//saveSocialLinks
function saveSocialLinks() {
    const form = document.getElementById('socialLinksForm');
    if (form) {
        const formData = new FormData(form);

        fetch('update_social_links.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.messages.join('\n')); // Display success messages
                    loadSocialLinks(); // Reload the links after saving
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while updating social links.');
            });
    } else {
        console.error('Social links form not found');
    }
}

// Add event listener to the save button
document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.querySelector('#socialLinksForm button[type="submit"]');
    if (saveButton) {
        saveButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent form submission
            saveSocialLinks();
        });
    } else {
        console.error('Save button not found');
    }
});

//Contact Info
function initializeContactInfoSection() {
    loadContactInfo();
    document.getElementById('contactInfoForm').addEventListener('submit', saveContactInfo);
}

function loadContactInfo() {
    fetch('get_contact_info.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('phoneNumber').value = data.data.phone;
                document.getElementById('emailAddress').value = data.data.email;
            } else {
                console.error('Error loading contact info:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function saveContactInfo(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch('save_contact_info.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Contact info updated successfully');
            } else {
                alert('Error updating contact info: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}
