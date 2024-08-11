document.addEventListener("DOMContentLoaded", function () {
    const photoContainer = document.getElementById("photo-container");
    const popup = document.querySelector(".img-popup");
    const popupImage = popup.querySelector("img");
    const closeButton = popup.querySelector(".close-btn");
    const navLeft = popup.querySelector(".nav-left");
    const navRight = popup.querySelector(".nav-right");
    let currentIndex;
    let photos = [];

    // Fetch photos from the server
    fetch('photo_operations.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                photos = data.photos;
                renderPhotos();
            } else {
                console.error('Error fetching photos:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));

    function renderPhotos() {
        photoContainer.innerHTML = '';
        photos.forEach((photo, index) => {
            const imgHolder = document.createElement('div');
            imgHolder.className = 'container__img-holder';
            imgHolder.innerHTML = `<img src="${photo.file_path}" alt="${photo.caption || 'Image'}" data-index="${index}">`;
            photoContainer.appendChild(imgHolder);
        });

        // Add click event listeners to the newly created images
        const images = document.querySelectorAll(".container__img-holder img");
        images.forEach(img => {
            img.addEventListener("click", () => openPopup(parseInt(img.dataset.index)));
        });
    }

    function openPopup(index) {
        currentIndex = index;
        const photo = photos[currentIndex];
        popupImage.src = photo.file_path;
        popupImage.alt = photo.caption || 'Image';
        popup.classList.add("opened");
    }

    function closePopup() {
        popup.classList.remove("opened");
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % photos.length;
        openPopup(currentIndex);
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        openPopup(currentIndex);
    }

    closeButton.addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
        if (e.target === popup || e.target === closeButton) {
            closePopup();
        }
    });

    navRight.addEventListener("click", showNextImage);
    navLeft.addEventListener("click", showPrevImage);

    document.addEventListener("keydown", (e) => {
        if (popup.classList.contains("opened")) {
            if (e.key === "ArrowRight") {
                showNextImage();
            } else if (e.key === "ArrowLeft") {
                showPrevImage();
            } else if (e.key === "Escape") {
                closePopup();
            }
        }
    });

    // Prevent default scrolling behavior for arrow keys
    window.addEventListener("keydown", (e) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
        }
    });
});