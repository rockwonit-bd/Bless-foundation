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

//About Us Content
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    document.getElementById('languageSelect').value = savedLanguage;
    loadAboutUsContent();
});

// Add event listener for language change
document.getElementById('languageSelect').addEventListener('change', function() {
    loadAboutUsContent();
});

function loadAboutUsContent() {
    const language = localStorage.getItem('selectedLanguage') || 'en';
    fetch('get_about_us_content.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateAboutUsContent(data.data, language);
            } else {
                console.error('Failed to load About Us content');
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateAboutUsContent(content, language) {
    const aboutUsContent = document.getElementById('aboutUsContent');
    aboutUsContent.innerHTML = content[`content_${language}`];
}