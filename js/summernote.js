document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('homePage').style.display !== 'none') {
        initializeSummernote();
        loadVisionMission();
    }
    document.getElementById('socialLinksForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSocialLinks();
    });
});

function initializeSummernote() {
    $('#visionEn, #visionBn, #missionEn, #missionBn').summernote({
        height: 200,
        toolbar: [
            ['view', ['fullscreen', 'help']],
            ['font', ['bold', 'italic','underline', 'clear', 'strikethrough']],
            ['fontsize', ['fontsize']],
            ['height', ['height']],
            ['color', ['color']],
            ['para', ['paragraph']],
            ['insert', ['link']]
        ]
    });
}

function saveVisionMission() {
    const visionEn = document.getElementById('visionEn').value;
    const visionBn = document.getElementById('visionBn').value;
    const missionEn = document.getElementById('missionEn').value;
    const missionBn = document.getElementById('missionBn').value;

    const formData = new FormData();
    formData.append('visionEn', visionEn);
    formData.append('visionBn', visionBn);
    formData.append('missionEn', missionEn);
    formData.append('missionBn', missionBn);

    fetch('save_vision_mission.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Vision and Mission saved successfully!');
            } else {
                alert('Error: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while saving. Please try again.');
        });
}

function loadVisionMission() {
    fetch('get_vision_mission.php')
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                $('#visionEn').summernote('code', result.data.visionEn);
                $('#visionBn').summernote('code', result.data.visionBn);
                $('#missionEn').summernote('code', result.data.missionEn);
                $('#missionBn').summernote('code', result.data.missionBn);
            } else {
                console.log('No vision and mission data found');
            }
        })
        .catch(error => {
            console.error('An error occurred while loading vision and mission data:', error);
        });
}

// Make sure to call loadVisionMission() when the document is ready
$(document).ready(function() {
    initializeSummernote();
    loadVisionMission();
});

function showHomeSection(sectionId) {
    document.querySelectorAll('.home-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId + 'Section').style.display = 'block';
    document.querySelectorAll('.button-group button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`button[onclick="showHomeSection('${sectionId}')"]`).classList.add('active');

    // Initialize Summernote when showing the Vision & Mission section
    if (sectionId === 'visionMission') {
        initializeSummernote();
        loadVisionMission();
    }
    // Initialize Summernote and load tales when showing the Highlighting Motivating Tales section
     else if (sectionId === 'highlightingMotivatingTales') {
        initializeTaleSummernote();
        loadTales();
        showTaleSection('manageTales');
    } else if (sectionId === 'contactInfo') {
        initializeContactInfoSection();
    }
}

/*Motivating Tales*/
let tales = [];
let currentEditId = null;
let currentImagePath = null;

function showTaleSection(sectionId) {
    document.querySelectorAll('.tale-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId + 'Section').style.display = 'block';
}

function previewTaleImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('taleImagePreview').src = e.target.result;
            document.getElementById('taleImagePreview').style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function initializeTaleSummernote() {
    $('#taleDescriptionEn, #taleDescriptionBn').summernote({
        height: 200,
        toolbar: [
            ['view', ['fullscreen', 'help']],
            ['font', ['bold', 'italic', 'underline', 'clear', 'strikethrough']],
            ['fontsize', ['fontsize']],
            ['height', ['height']],
            ['color', ['color']],
            ['para', ['paragraph']],
            ['table', ['table']],
            ['insert', ['link']]
        ]
    });
}

function loadTales() {
    fetch('motivating_tales_crud.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            tales = data;
            displayTales();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load tales: ' + error.message);
        });
}

function displayTales() {
    const gallery = document.getElementById('talesGallery');
    gallery.innerHTML = '';
    tales.forEach(tale => {
        const taleDiv = document.createElement('div');
        taleDiv.className = 'tale-item';
        taleDiv.innerHTML = `
            <img src="${tale.image_path}" alt="Tale Image" style="max-width: 200px;">
            <h4>Tale added at:</h4>
            <h4>${tale.formatted_created_at}</h4>
            <button onclick="editTale(${tale.id})">Edit</button>
            <button onclick="deleteTale(${tale.id})">Delete</button>
        `;
        gallery.appendChild(taleDiv);
    });
}

function editTale(id) {
    fetch(`motivating_tales_crud.php?id=${id}`)
        .then(response => response.json())
        .then(tale => {
            if (tale.error) {
                throw new Error(tale.error);
            }
            currentEditId = id;
            currentImagePath = tale.image_path;
            document.getElementById('taleImagePreview').src = tale.image_path;
            document.getElementById('taleImagePreview').style.display = 'block';
            $('#taleDescriptionEn').summernote('code', tale.description_en);
            $('#taleDescriptionBn').summernote('code', tale.description_bn);
            showTaleSection('addTale');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load tale for editing: ' + error.message);
        });
}

function deleteTale(id) {
    if (confirm('Are you sure you want to delete this tale?')) {
        fetch('motivating_tales_crud.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                if (data.success) {
                    loadTales();
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Failed to delete tale: ' + error.message);
            });
    }
}

function cancelTaleEdit() {
    currentEditId = null;
    currentImagePath = null;
    document.getElementById('taleForm').reset();
    document.getElementById('taleImagePreview').style.display = 'none';
    $('#taleDescriptionEn').summernote('code', '');
    $('#taleDescriptionBn').summernote('code', '');
    showTaleSection('manageTales');
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('taleForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData();
        const imageFile = document.getElementById('taleImage').files[0];

        if (imageFile) {
            formData.append('image', imageFile);
        }

        const taleData = {
            description_en: $('#taleDescriptionEn').summernote('code'),
            description_bn: $('#taleDescriptionBn').summernote('code'),
            image_path: currentImagePath // Include the current image path
        };

        if (currentEditId) {
            taleData.id = currentEditId;
        }

        formData.append('data', JSON.stringify(taleData));

        fetch('motivating_tales_crud.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    throw new Error(result.error);
                }
                if (result.success) {
                    loadTales();
                    cancelTaleEdit();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to save tale: ' + error.message);
            });
    });

    initializeTaleSummernote();
    loadTales();
});

/*About Us*/
function initializeAboutUsSummernote() {
    if ($('#aboutUsEnglish').summernote) {
        $('#aboutUsEnglish').summernote('destroy');
    }
    if ($('#aboutUsBangla').summernote) {
        $('#aboutUsBangla').summernote('destroy');
    }

    $('#aboutUsEnglish, #aboutUsBangla').summernote({
        height: 300,
        toolbar: [
            ['view', ['fullscreen', 'help']],
            ['font', ['bold', 'italic', 'underline', 'clear', 'strikethrough']],
            ['fontsize', ['fontsize']],
            ['height', ['height']],
            ['color', ['color']],
            ['para', ['paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']]
        ]
    });

    loadAboutUsContent();
}

function loadAboutUsContent() {
    fetch('about_us_operations.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                $('#aboutUsEnglish').summernote('code', data.data.content_en);
                $('#aboutUsBangla').summernote('code', data.data.content_bn);
            } else {
                console.error('Failed to load About Us content');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function saveAboutUs() {
    const aboutUsEnglish = $('#aboutUsEnglish').summernote('code');
    const aboutUsBangla = $('#aboutUsBangla').summernote('code');

    fetch('about_us_operations.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content_en: aboutUsEnglish,
            content_bn: aboutUsBangla
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('About Us content saved successfully!');
            } else {
                alert('Failed to save About Us content');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while saving');
        });
}

/*Projects*/
let projects = [];
let currentProjectId = null;

function showProjectSection(sectionId) {
    document.querySelectorAll('.project-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId + 'Section').style.display = 'block';
}

function initializeProjectsSection() {
    loadProjects();
    initializeProjectSummernote();
    showProjectSection('manageProjects');
}

function initializeProjectSummernote() {
    ['shortDescEn', 'detailedDescEn', 'shortDescBn', 'detailedDescBn'].forEach(id => {
        $(`#${id}`).summernote({
            height: id.includes('detailed') ? 300 : 150,
            toolbar: [
                ['view', ['fullscreen', 'help']],
                ['font', ['bold', 'italic', 'underline', 'clear', 'strikethrough']],
                ['fontsize', ['fontsize']],
                ['height', ['height']],
                ['color', ['color']],
                ['para', ['paragraph']],
                ['table', ['table']],
                ['insert', ['link']]
            ]
        });
    });
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').attr('src', e.target.result).show();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function loadProjects() {
    fetch('project_operations.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                projects = data.data;
                displayProjects();
            } else {
                console.error('Failed to load projects:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayProjects() {
    const tbody = document.querySelector('#projectsTable tbody');
    tbody.innerHTML = '';
    projects.forEach(project => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td><img src="${project.image_path}" alt="${project.title_en}" style="max-width: 100px;"></td>
            <td>${project.title_en}</td>
            <td>${project.title_bn}</td>
            <td>
                <button onclick="editProject(${project.id})">Edit</button>
                <button onclick="deleteProject(${project.id})">Delete</button>
            </td>
        `;
    });
}

function editProject(id) {
    currentProjectId = id;
    const project = projects.find(p => p.id == id);
    if (project) {
        $('#imagePreview').attr('src', project.image_path).show();
        $('#titleEn').val(project.title_en);
        $('#shortDescEn').summernote('code', project.short_desc_en);
        $('#detailedDescEn').summernote('code', project.detailed_desc_en);
        $('#titleBn').val(project.title_bn);
        $('#shortDescBn').summernote('code', project.short_desc_bn);
        $('#detailedDescBn').summernote('code', project.detailed_desc_bn);
        $('#existingImage').val(project.image_path);
        showProjectSection('addProject');
    }
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        fetch('project_operations.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadProjects();
                } else {
                    console.error('Failed to delete project:', data.error);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

function cancelProjectEdit() {
    currentProjectId = null;
    $('#projectForm')[0].reset();
    $('#imagePreview').hide();
    $('#existingImage').val('');
    ['shortDescEn', 'detailedDescEn', 'shortDescBn', 'detailedDescBn'].forEach(id => {
        $(`#${id}`).summernote('code', '');
    });
    showProjectSection('manageProjects');
}

$(document).ready(function() {
    initializeProjectSummernote();
    loadProjects();

    $('#projectForm').on('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('id', currentProjectId);

        ['shortDescEn', 'detailedDescEn', 'shortDescBn', 'detailedDescBn'].forEach(id => {
            formData.append(id, $(`#${id}`).summernote('code'));
        });

        fetch('project_operations.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadProjects();
                    cancelProjectEdit();
                } else {
                    console.error('Failed to save project:', data.error);
                }
            })
            .catch(error => console.error('Error:', error));
    });
});

/*Photos*/
let photos = [];

function showPhotoSection(sectionId) {
    document.querySelectorAll('.photo-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId + 'Section').style.display = 'block';
}

function previewPhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#photoPreview').attr('src', e.target.result).show();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function loadPhotos() {
    fetch('photo_operations.php')
        .then(response => response.json().catch(error => {
            console.error('Error parsing JSON:', error);
            return { error: 'Failed to parse server response' };
        }))
        .then(data => {
            if (data.error) {
                console.error('Error loading photos:', data.error);
                alert('Failed to load photos. Please try again.');
            } else if (data.success) {
                photos = data.photos;
                displayPhotos();
            } else {
                console.error('Unexpected response format:', data);
                alert('An unexpected error occurred. Please try again.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Failed to connect to the server. Please check your connection and try again.');
        });
}

function displayPhotos() {
    const gallery = document.getElementById('photoGallery');
    gallery.innerHTML = '';
    photos.forEach(photo => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item';
        photoDiv.innerHTML = `
            <img src="${photo.file_path}" alt="${photo.caption}" style="max-width: 200px;">
            <p>${photo.caption}</p>
            <button onclick="deletePhoto(${photo.id})">Delete</button>
        `;
        gallery.appendChild(photoDiv);
    });
}

function deletePhoto(id) {
    if (confirm('Are you sure you want to delete this photo?')) {
        fetch('photo_operations.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => response.json().catch(error => {
                console.error('Error parsing JSON:', error);
                return { error: 'Failed to parse server response' };
            }))
            .then(data => {
                if (data.error) {
                    console.error('Error deleting photo:', data.error);
                    alert('Failed to delete photo. Please try again.');
                } else if (data.success) {
                    loadPhotos(); // Reload the photos after successful deletion
                } else {
                    console.error('Unexpected response format:', data);
                    alert('An unexpected error occurred. Please try again.');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('Failed to connect to the server. Please check your connection and try again.');
            });
    }
}

function initializePhotosSection() {
    loadPhotos();
    showPhotoSection('managePhotos'); // Show 'Manage Photos' by default
}

$(document).ready(function() {
    $('#photoForm').on('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch('photo_operations.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json().catch(error => {
                console.error('Error parsing JSON:', error);
                return { error: 'Failed to parse server response' };
            }))
            .then(data => {
                if (data.error) {
                    console.error('Error uploading photo:', data.error);
                    alert('Failed to upload photo. Please try again.');
                } else if (data.success) {
                    loadPhotos(); // Reload the photos after successful upload
                    $('#photoForm')[0].reset();
                    $('#photoPreview').hide();
                    showPhotoSection('managePhotos');
                } else {
                    console.error('Unexpected response format:', data);
                    alert('An unexpected error occurred. Please try again.');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('Failed to connect to the server. Please check your connection and try again.');
            });
    });

    // Check if the photos section is visible (in case it's the default section)
    if (document.getElementById('photos').style.display !== 'none') {
        initializePhotosSection();
    }
});

/*Videos*/
let videos = [];

function showVideoSection(sectionId) {
    document.querySelectorAll('.video-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId + 'Section').style.display = 'block';

}

function loadVideos() {
    fetch('video_operations.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                videos = data.videos;
                displayVideos();
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Error loading videos:', error);
            alert('Failed to load videos. Please try again. Error: ' + error.message);
        });
}

function displayVideos() {
    const gallery = document.getElementById('videoGallery');
    gallery.innerHTML = '';
    videos.forEach(video => {
        const videoDiv = document.createElement('div');
        videoDiv.className = 'video-item';
        videoDiv.innerHTML = `
            <iframe width="320" height="180" src="${video.youtube_url}" frameborder="0" allowfullscreen></iframe>
            <h4>${video.title}</h4>
            <p>${video.description}</p>
            <button onclick="editVideo(${video.id})">Edit</button>
            <button onclick="deleteVideo(${video.id})">Delete</button>
        `;
        gallery.appendChild(videoDiv);
    });
}

function editVideo(id) {
    const video = videos.find(v => v.id == id);
    if (video) {
        $('#videoId').val(video.id);
        $('#videoUrl').val(video.youtube_url);
        $('#videoTitle').val(video.title);
        $('#videoDescription').val(video.description);
        showVideoSection('addVideo');
    }
}

function deleteVideo(id) {
    if (confirm('Are you sure you want to delete this video?')) {
        fetch('video_operations.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadVideos();
                } else {
                    throw new Error(data.error || 'Unknown error occurred');
                }
            })
            .catch(error => {
                console.error('Error deleting video:', error);
                alert('Failed to delete video. Please try again. Error: ' + error.message);
            });
    }
}

function cancelVideoEdit() {
    $('#videoForm')[0].reset();
    $('#videoId').val('');
    showVideoSection('manageVideos');
}

function initializeVideosSection() {
    loadVideos();
    showVideoSection('manageVideos'); // Show 'Manage Videos' by default
}

$(document).ready(function() {
    $('#videoForm').on('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch('video_operations.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadVideos();
                    $('#videoForm')[0].reset();
                    $('#videoId').val('');
                    showVideoSection('manageVideos');
                } else {
                    throw new Error(data.error || 'Unknown error occurred');
                }
            })
            .catch(error => {
                console.error('Error saving video:', error);
                alert('Failed to save video. Please try again. Error: ' + error.message);
            });
    });

    // Check if the videos section is visible (in case it's the default section)
    if (document.getElementById('videos').style.display !== 'none') {
        initializeVideosSection();
    }
});

/*Contact Us*/
function showContactSection(sectionId) {
    document.querySelectorAll('.contact-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId + 'Section').style.display = 'block';
}

function initializeContactUsSummernote() {
    $('#ngoMemberInfoEn, #ngoMemberInfoBn').summernote({
        height: 200,
        toolbar: [
            ['view', ['fullscreen', 'help']],
            ['font', ['bold', 'italic', 'underline', 'clear', 'strikethrough']],
            ['fontsize', ['fontsize']],
            ['height', ['height']],
            ['color', ['color']],
            ['para', ['paragraph']],
            ['table', ['table']],
            ['insert', ['link']]
        ]
    });
}

function initializeContactSection() {
    showContactSection('messages');
    initializeContactUsSummernote();
    loadContactUsContent();
    loadMessages();
}

function loadContactUsContent() {
    fetch('contact_us_operations.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data) {
                document.getElementById('officeAddressEn').value = data.data.office_address_en;
                document.getElementById('officeAddressBn').value = data.data.office_address_bn;
                document.getElementById('googleMapEmbed').value = data.data.google_map_embed_link;
                $('#ngoMemberInfoEn').summernote('code', data.data.ngo_member_info_en);
                $('#ngoMemberInfoBn').summernote('code', data.data.ngo_member_info_bn);
            }
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('contactUsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    // Get the Google Map embed input value
    const googleMapInput = document.getElementById('googleMapEmbed').value;

    // If it's a full embed code, extract the URL
    if (googleMapInput.includes('<iframe')) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = googleMapInput;
        const iframeSrc = tempDiv.querySelector('iframe').src;
        formData.set('googleMapEmbed', iframeSrc);
    }
    // If it's just a URL, use it as is
    // The PHP script will validate it

    fetch('contact_us_operations.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Contact information updated successfully!');
            } else {
                alert('Error updating contact information: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating contact information.');
        });
});

//Messages
function loadMessages() {
    fetch('contact_messages_operations.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMessages(data.messages);
            } else {
                console.error('Error loading messages:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayMessages(messages) {
    const tbody = document.querySelector('#messagesTable tbody');
    tbody.innerHTML = '';
    messages.forEach(message => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${message.name}</td>
            <td>${message.email}</td>
            <td>${new Date(message.created_at).toLocaleString()}</td>
            <td>
                <button onclick="viewMessage(${message.id})" class="viewButton">View</button>
                <button onclick="deleteMessage(${message.id})" class="deleteButton">Delete</button>
            </td>
        `;
    });
}

function viewMessage(id) {
    fetch('contact_messages_operations.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessageModal(data.message);
            } else {
                console.error('Error viewing message:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
}

function showMessageModal(message) {
    const modal = document.getElementById('messageModal');
    const messageDetails = document.getElementById('messageDetails');

    if (!modal || !messageDetails) {
        console.error('Modal elements not found');
        return;
    }

    messageDetails.innerHTML = `
        <h2>Message Details</h2>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Organization:</strong> ${message.organization || 'N/A'}</p>
        <p><strong>Phone:</strong> ${message.phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.message}</p>
        <p><strong>Sent at:</strong> ${new Date(message.created_at).toLocaleString()}</p>
    `;
    modal.style.display = 'block';

    // Close the modal when clicking on <span> (x)
    const span = modal.querySelector('.close');
    if (span) {
        span.onclick = function() {
            modal.style.display = 'none';
        }
    }

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        fetch('contact_messages_operations.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadMessages();
                } else {
                    console.error('Error deleting message:', data.error);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// Check if the contact section is visible (in case it's the default section)
if (document.getElementById('contactUs').style.display !== 'none') {
    initializeContactSection();
}

 /*Volunteer*/
function showVolunteerSection(sectionId) {
    document.querySelectorAll('.volunteer-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId + 'Section').style.display = 'block';
}

function initializeVolunteerSection() {
    loadBangladeshiVolunteers();
    loadInternationalVolunteers();
    showVolunteerSection('bangladeshi'); // Show Bangladeshi section by default
}

//Bangladeshi Volunteers
function loadBangladeshiVolunteers() {
    fetch('volunteer_operations_bn.php?action=getAll')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayBangladeshiVolunteers(data.volunteers);
            } else {
                console.error('Error loading volunteers:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayBangladeshiVolunteers(volunteers) {
    const tbody = document.querySelector('#bangladeshiVolunteerTable tbody');
    tbody.innerHTML = '';
    volunteers.forEach(volunteer => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${volunteer.first_name} ${volunteer.last_name}</td>
            <td>${volunteer.email}</td>
            <td>${volunteer.phone}</td>
            <td>
                <button onclick="viewVolunteerDetailsBn(${volunteer.id})">View</button>
                <button class="delete" onclick="deleteVolunteerBn(${volunteer.id})">Delete</button>
            </td>
        `;
    });
}

function viewVolunteerDetailsBn(id) {
    fetch(`volunteer_operations_bn.php?action=getDetails&id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showVolunteerModalBn(data.volunteer);
            } else {
                console.error('Error viewing volunteer details:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function showVolunteerModalBn(volunteer) {
    const modal = document.getElementById('volunteerModal');
    const volunteerDetails = document.getElementById('volunteerDetails');

    volunteerDetails.innerHTML = `
        <h2>Volunteer Details</h2>
        <p><strong>Name:</strong> ${volunteer.first_name} ${volunteer.last_name}</p>
        <p><strong>Email:</strong> ${volunteer.email}</p>
        <p><strong>Phone:</strong> ${volunteer.phone}</p>
        <p><strong>Gender:</strong> ${volunteer.gender}</p>
        <p><strong>Religion:</strong> ${volunteer.religion || 'N/A'}</p>
        <p><strong>Area:</strong> ${volunteer.area}</p>
        <p><strong>Picture:</strong> <img src="${volunteer.image_path_bn}" alt="Volunteer Picture" style="max-width: 200px;"></p>
        <p><strong>Identity Document:</strong> <img src="${volunteer.identity_path_bn}" alt="Identity Document" style="max-width: 200px;"></p>
        <p><strong>Applied at:</strong> ${new Date(volunteer.created_at).toLocaleString()}</p>
    `;
    modal.style.display = 'block';

    // Close the modal when clicking on <span> (x)
    const span = modal.querySelector('.close');
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function deleteVolunteerBn(id) {
    if (confirm('Are you sure you want to delete this volunteer application?')) {
        fetch('volunteer_operations_bn.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'delete', id: id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    loadBangladeshiVolunteers();
                } else {
                    alert('Error: ' + data.message);
                    console.error('Error deleting volunteer:', data.message);
                }
            })
            .catch(error => {
                alert('An error occurred while deleting the volunteer.');
                console.error('Error:', error);
            });
    }
}

//International Volunteers
function loadInternationalVolunteers() {
    fetch('volunteer_operations_in.php?action=getAll')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayInternationalVolunteers(data.volunteers);
            } else {
                console.error('Error loading volunteers:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayInternationalVolunteers(volunteers) {
    const tbody = document.querySelector('#internationalVolunteerTable tbody');
    tbody.innerHTML = '';
    volunteers.forEach(volunteer => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${volunteer.first_name} ${volunteer.last_name}</td>
            <td>${volunteer.email}</td>
            <td>${volunteer.country}</td>
            <td>
                <button onclick="viewVolunteerDetailsIn(${volunteer.id})">View</button>
                <button class="delete" onclick="deleteVolunteerIn(${volunteer.id})">Delete</button>
            </td>
        `;
    });
}

function viewVolunteerDetailsIn(id) {
    fetch(`volunteer_operations_in.php?action=getDetails&id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showVolunteerModalIn(data.volunteer);
            } else {
                console.error('Error viewing volunteer details:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function deleteVolunteerIn(id) {
    if (confirm('Are you sure you want to delete this volunteer application?')) {
        fetch('volunteer_operations_in.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'delete', id: id })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    loadInternationalVolunteers();
                } else {
                    alert('Error: ' + data.message);
                    console.error('Error deleting volunteer:', data.message);
                }
            })
            .catch(error => {
                alert('An error occurred while deleting the volunteer: ' + error.message);
                console.error('Error:', error);
            });
    }
}

function showVolunteerModalIn(volunteer) {
    const modal = document.getElementById('volunteerModal');
    const volunteerDetails = document.getElementById('volunteerDetails');

    volunteerDetails.innerHTML = `
        <h2>Volunteer Details</h2>
        <p><strong>Name:</strong> ${volunteer.first_name} ${volunteer.last_name}</p>
        <p><strong>Email:</strong> ${volunteer.email}</p>
        <p><strong>Country:</strong> ${volunteer.country}</p>
        <p><strong>Identity Document:</strong> <img src="${volunteer.identity}" alt="Identity Document" style="max-width: 200px;"></p>
        <p><strong>Picture:</strong> <img src="${volunteer.picture}" alt="Volunteer Picture" style="max-width: 200px;"></p>
        <p><strong>Biography:</strong> ${volunteer.biography}</p>
        <p><strong>Contribution:</strong> ${volunteer.contribution}</p>
        <p><strong>Hobbies:</strong> ${volunteer.hobbies}</p>
        <p><strong>Applied at:</strong> ${new Date(volunteer.created_at).toLocaleString()}</p>
    `;
    modal.style.display = 'block';

    // Close the modal when clicking on <span> (x)
    const span = modal.querySelector('.close');
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Make sure to call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeVolunteerSection();
});

