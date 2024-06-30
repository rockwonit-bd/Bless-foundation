// News Bulletin

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