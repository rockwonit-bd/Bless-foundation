/*const galleryImages = document.querySelectorAll('.gallery-img');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentImageIndex;

galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        openModal();
        modalImg.src = img.src;
        currentImageIndex = index;
    });
});

closeBtn.addEventListener('click', closeModal);
prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

function openModal() {
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : galleryImages.length - 1;
    modalImg.src = galleryImages[currentImageIndex].src;
}

function showNextImage() {
    currentImageIndex = (currentImageIndex < galleryImages.length - 1) ? currentImageIndex + 1 : 0;
    modalImg.src = galleryImages[currentImageIndex].src;
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});*/

document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".container__img-holder img");
    const popup = document.querySelector(".img-popup");
    const popupImage = popup.querySelector("img");
    const closeButton = popup.querySelector(".close-btn");
    const navLeft = popup.querySelector(".nav-left");
    const navRight = popup.querySelector(".nav-right");
    let currentIndex;

    function openPopup(index) {
        currentIndex = index;
        const imageSrc = images[currentIndex].getAttribute("src");
        popupImage.setAttribute("src", imageSrc);
        popup.classList.add("opened");
        popupImage.classList.add("opened");
    }

    function closePopup() {
        popup.classList.remove("opened");
        popupImage.classList.remove("opened");
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        openPopup(currentIndex);
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openPopup(currentIndex);
    }

    images.forEach((img, index) => {
        img.addEventListener("click", () => openPopup(index));
    });

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
