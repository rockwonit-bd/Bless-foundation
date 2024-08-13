document.addEventListener('DOMContentLoaded', function() {
    // Set the language dropdown to the saved language on page load
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    document.getElementById('languageSelect').value = savedLanguage;

    // Fetch projects and other initialization tasks
    fetchProjects();

    // Existing event listener for language change
    document.getElementById('languageSelect').addEventListener('change', function() {
        const selectedLanguage = this.value;
        localStorage.setItem('selectedLanguage', selectedLanguage);
        changeProjectLanguage(selectedLanguage);
    });

    // Apply the saved language on load
    changeProjectLanguage(savedLanguage);
});

// Change language for projects
function changeProjectLanguage(language) {
    currentLanguage = language;
    renderProjects();
    updateOpenModals();
    applyTranslationToNewElements();
}

let projects = [];

// Fetch projects from the server
function fetchProjects() {
    fetch('fetch_projects.php')
        .then(response => response.json())
        .then(data => {
            projects = data;
            renderProjects();
        })
        .catch(error => console.error('Error:', error));
}

// Render projects
function renderProjects() {
    const projectsSection = document.querySelector('.projects-section');
    const modalsContainer = document.getElementById('modals');
    projectsSection.innerHTML = '';
    modalsContainer.innerHTML = '';

    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('project', index + 1);

        projectCard.innerHTML = `
            <img src="${project.image_path}" class="project-image" alt="${project['title_' + currentLanguage]}">
            <div class="project-content">
                <h2 class="project-title">${project['title_' + currentLanguage]}</h2>
                <div class="project-description">${project['short_desc_' + currentLanguage]}</div>
                <a href="#" class="project-link" data-i18n="project.knowMore" data-target="modal-${index + 1}">Know More...</a>
            </div>
        `;

        projectsSection.appendChild(projectCard);

        // Create or update modal
        const modal = document.createElement('div');
        modal.id = `modal-${index + 1}`;
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" data-target="modal-${index + 1}">&times;</span>
                <h2 style="margin-bottom: 8px">${project['title_' + currentLanguage]}</h2>
                <div>${project['detailed_desc_' + currentLanguage]}</div>
            </div>
        `;

        modalsContainer.appendChild(modal);
    });
    // Apply translation to the new content
    applyTranslationToNewElements();
    setupModalListeners();
}
// Function to apply translations
function applyTranslationToNewElements() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const translationKey = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][translationKey]) {
            element.textContent = translations[currentLanguage][translationKey];
        }
    });
}

// Setup modal listeners
function setupModalListeners() {
    const links = document.querySelectorAll(".project-link");
    const modals = document.querySelectorAll(".modal");
    const closes = document.querySelectorAll(".close");

    links.forEach(link => {
        link.onclick = function(event) {
            event.preventDefault();
            const targetModal = document.getElementById(link.getAttribute("data-target"));
            targetModal.style.display = "block";
        }
    });

    closes.forEach(close => {
        close.onclick = function() {
            const targetModal = document.getElementById(close.getAttribute("data-target"));
            targetModal.style.display = "none";
        }
    });

    window.onclick = function(event) {
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }
}

// Update content of open modals
function updateOpenModals() {
    const openModals = document.querySelectorAll('.modal[style="display: block;"]');
    openModals.forEach(modal => {
        const modalId = modal.id;
        const projectIndex = parseInt(modalId.split('-')[1]) - 1;
        const project = projects[projectIndex];

        modal.querySelector('h2').textContent = project['title_' + currentLanguage];
        modal.querySelector('.modal-content > div').innerHTML = project['detailed_desc_' + currentLanguage];
    });
}
