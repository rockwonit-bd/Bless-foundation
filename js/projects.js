document.addEventListener("DOMContentLoaded", function() {
    // Get all modal links and modals
    var links = document.querySelectorAll(".project-link");
    var modals = document.querySelectorAll(".modal");
    var closes = document.querySelectorAll(".close");

    // When the user clicks the button, open the modal 
    links.forEach(function(link) {
        link.onclick = function(event) {
            event.preventDefault();
            var targetModal = document.getElementById(link.getAttribute("data-target"));
            targetModal.style.display = "block";
        }
    });

    // When the user clicks on <span> (x), close the modal
    closes.forEach(function(close) {
        close.onclick = function() {
            var targetModal = document.getElementById(close.getAttribute("data-target"));
            targetModal.style.display = "none";
        }
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        modals.forEach(function(modal) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }
});