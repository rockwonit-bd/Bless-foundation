document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    document.getElementById('languageSelect').value = savedLanguage;
    fetch('video_operations.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const videosGrid = document.getElementById('videosGrid');
                data.videos.forEach(video => {
                    const videoContainer = document.createElement('div');
                    videoContainer.className = 'video-container';
                    videoContainer.innerHTML = `
                        <iframe width="420" height="260" 
                                src="${video.youtube_url}" 
                                title="${video.title}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                        </iframe>
                    `;
                    videosGrid.appendChild(videoContainer);
                });
            } else {
                console.error('Failed to fetch videos');
            }
        })
        .catch(error => console.error('Error:', error));
});