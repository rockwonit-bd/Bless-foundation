// Slider
let slideIndex = 0;
let slides = [];
let slideshowInterval;

function fetchSliderImages() {
    fetch('get_slider_images.php')
        .then(response => response.json())
        .then(data => {
            slides = data;
            generateSlides();
            initializeSlideshow();
        })
        .catch(error => console.error('Error:', error));
}

function generateSlides() {
    const imageSlider = document.getElementById('imageSlider');
    imageSlider.innerHTML = ''; // Clear existing slides

    slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';

        const img = document.createElement('img');
        img.src = slide.image_path;
        img.alt = `Slide ${index + 1}`;

        slideDiv.appendChild(img);
        imageSlider.appendChild(slideDiv);
    });
}

function showSlides() {
    let slideElements = document.querySelectorAll(".slide");
    if (slideElements.length === 0) return; // Exit if no slides

    for (let i = 0; i < slideElements.length; i++) {
        slideElements[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slideElements.length) {slideIndex = 1}
    slideElements[slideIndex - 1].style.display = "block";
}

function initializeSlideshow() {
    showSlides(); // Show the first slide immediately
    slideshowInterval = setInterval(showSlides, 8000); // Change slide every 8 seconds
}

document.querySelector(".prev").addEventListener("click", function() {
    clearInterval(slideshowInterval); // Clear the existing interval
    slideIndex -= 2;
    if (slideIndex < 0) {slideIndex = slides.length - 1}
    showSlides();
    slideshowInterval = setInterval(showSlides, 8000); // Restart the interval
});

document.querySelector(".next").addEventListener("click", function() {
    clearInterval(slideshowInterval); // Clear the existing interval
    showSlides();
    slideshowInterval = setInterval(showSlides, 8000); // Restart the interval
});

// Initialize slider
fetchSliderImages();

// News Bulletin
function fetchLatestDevelopments() {
    fetch('get_latest_developments.php')
        .then(response => response.json())
        .then(data => {
            generateNewsItems(data);
            initializeNewsScroll();
        })
        .catch(error => console.error('Error:', error));
}

function generateNewsItems(newsItems) {
    const newsContainer = document.querySelector('.news-bulletin');
    newsContainer.innerHTML = ''; // Clear existing news items

    newsItems.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = item.headline;

        newsItem.appendChild(link);
        newsContainer.appendChild(newsItem);
    });
}

function initializeNewsScroll() {
    const newsContainer = document.querySelector('.news-bulletin');
    const newsItems = document.querySelectorAll('.news-item');

    let containerHeight = newsContainer.offsetHeight;
    let itemHeight = newsItems[0].offsetHeight;
    let totalItems = newsItems.length;

    function initializePositions() {
        newsItems.forEach((item, index) => {
            item.style.top = `${index * itemHeight}px`;
        });
    }

    function scrollNews() {
        newsItems.forEach((item) => {
            let currentTop = parseInt(item.style.top, 10);
            let newTop = currentTop - 1;

            if (newTop < -itemHeight) {
                newTop = (totalItems - 1) * itemHeight;
            }

            item.style.top = `${newTop}px`;
        });
    }

    initializePositions();
    setInterval(scrollNews, 48);
}

// Initialize news bulletin
fetchLatestDevelopments();

//Motivating Tales
function fetchAndDisplayMotivatingTales() {
    fetch('fetch_motivating_tales.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('testimonials-grid');
            container.innerHTML = ''; // Clear existing content

            data.forEach(tale => {
                const taleElement = document.createElement('div');
                taleElement.className = 'testimonial';

                const img = document.createElement('img');
                img.src = tale.image_path;
                img.alt = 'Motivating Tale';

                const description = document.createElement('div');
                description.className = 'description';
                description.innerHTML = tale.description_en; // Default to English

                // Store both language versions
                description.dataset.en = tale.description_en;
                description.dataset.bn = tale.description_bn;

                taleElement.appendChild(img);
                taleElement.appendChild(description);
                container.appendChild(taleElement);
            });

            // Apply current language
            applyLanguage(getCurrentLanguage());
        })
        .catch(error => console.error('Error:', error));
}

function applyLanguage(language) {
    const descriptions = document.querySelectorAll('.testimonial .description');
    descriptions.forEach(desc => {
        desc.innerHTML = desc.dataset[language];
    });
    // Apply language to vision and mission
    const visionContent = document.getElementById('vision-content');
    const missionContent = document.getElementById('mission-content');
    visionContent.innerHTML = visionContent.dataset[language];
    missionContent.innerHTML = missionContent.dataset[language];
}

function getCurrentLanguage() {
    return localStorage.getItem('selectedLanguage') || 'en';
}

//Vision Mission
// Function to fetch and display vision and mission
function fetchVisionMission() {
    fetch('get_vision_mission.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const visionContent = document.getElementById('vision-content');
                const missionContent = document.getElementById('mission-content');

                // Store both language versions
                visionContent.dataset.en = data.data.visionEn;
                visionContent.dataset.bn = data.data.visionBn;
                missionContent.dataset.en = data.data.missionEn;
                missionContent.dataset.bn = data.data.missionBn;

                // Apply current language
                applyLanguage(getCurrentLanguage());
            } else {
                console.error('Failed to fetch vision and mission data');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Call fetchVisionMission when the page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayMotivatingTales();
    fetchVisionMission();
});
