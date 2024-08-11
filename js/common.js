//Logos
fetch('get_logos.php')
    .then(response => response.json())
    .then(data => {
        document.getElementById('top-logo').src = data.top;
        document.getElementById('bottom-logo').src = data.bottom;
    })
    .catch(error => console.error(error));

//Contact Info
fetch('get_contact_info.php')
    .then(response => response.json())
    .then(data => {
        document.getElementById('phonetop').textContent = data.data.phone;
        document.getElementById('emailtop').textContent = data.data.email;
        document.getElementById('phonefooter').textContent = data.data.phone;
        document.getElementById('emailfooter').textContent = data.data.email;
    })
    .catch(error => console.error(error));

//Social Links
function updateSocialLinks() {
    fetch('update_social_links.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const platforms = ['facebook', 'youtube', 'instagram'];
                platforms.forEach(platform => {
                    const topLink = document.getElementById(`${platform}-link-top`);
                    const bottomLink = document.getElementById(`${platform}-link-bottom`);
                    if (topLink && bottomLink && data.data[platform]) {
                        topLink.href = data.data[platform];
                        bottomLink.href = data.data[platform];
                    }
                });
            } else {
                console.error('Error fetching social links:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Call the function to update social links when the page loads
document.addEventListener('DOMContentLoaded', updateSocialLinks);