//Language Change

const translations = {
    en: {
        "nav.home": "Home",
        "nav.about": "About Us",
        "nav.support": "Support Our Effort",
        "nav.partner": "Become a Partner",
        "nav.volunteer": "Volunteer",
        "nav.sponsor": "Sponsor Us",
        "nav.materialSupport": "Material & Financial Support",
        "nav.atrium": "Atrium",
        "nav.photoSalon": "Photo Salon",
        "nav.videoShowcase": "Video Showcase",
        "nav.programs": "Programs/Projects",
        "nav.contact": "Contact Us",
        "vision.title": "Vision",
        "vision.text": "To eradicate growing number of HIV+ children who are abandoned, discriminated, neglected, & to help them dream like any other normal child.",
        "mission.title": "Mission Statement",
        "mission.text": "Firstly, providing Basic Necessities & Educating the unattended kids for their Social Wellbeing.",
        "testimonials.title": "Success Example",
        "testimonial1.text": "\"Little boy Mayur Patil’s life was full of tragedies, first his mother died and after father too. Mayur fell ill very often.\"",
        "testimonial1.author": "- STORY OF MAYUR PATIL",
        "testimonial2.text": "\"The story of Sunil 9 and Vaishali, 7 both are HIV interacted is the finest example of how HIV destroys families and stigmatises small children. The Children lost their mother four years ago.\"",
        "testimonial2.author": "- STORY OF SUNIL AND VAISHALI",
        "footer.home": "Home",
        "footer.about": "About Us",
        "footer.support": "Support Our Effort",
        "footer.programs": "Programs/Projects",
        "footer.contact": "Contact Us"
    },
    bn: {
        "nav.home": "নীড় পাতা",
        "nav.about": "আমাদের সম্পর্কে জানুন",
        "nav.support": "আমাদের কার্যক্রমে সহযোগিতা করুন",
        "nav.partner": "অংশীদার হন",
        "nav.volunteer": "স্বেচ্ছাসেবক",
        "nav.sponsor": "আমাদের স্পনসর করুন",
        "nav.materialSupport": "বস্তুগত এবং আর্থিক সহায়তা",
        "nav.atrium": "অলিন্দ",
        "nav.photoSalon": "ছবির সেলুন",
        "nav.videoShowcase": "ভিডিও শোকেস",
        "nav.programs": "প্রকল্পসমূহ",
        "nav.contact": "যোগাযোগ",
        "vision.title": "দৃষ্টি",
        "vision.text": "HIV+ শিশুদের সংখ্যা কমিয়ে আনা যারা পরিত্যক্ত, বৈষম্যমূলক, উপেক্ষিত, এবং তাদের অন্য কোনও সাধারণ শিশুর মতো স্বপ্ন দেখতে সহায়তা করার জন্য।",
        "mission.title": "মিশন বিবৃতি",
        "mission.text": "প্রথমত, বাচ্চাদের সামাজিক কল্যাণের জন্য মৌলিক প্রয়োজনীয়তা এবং শিক্ষার মাধ্যমে অযত্নে থাকা বাচ্চাদের সহায়তা করা।",
        "testimonials.title": "সফল উদাহরণ",
        "testimonial1.text": "\"ছোট্ট ছেলে ময়ূর পাটিলের জীবন ছিল দুর্ঘটনায় পূর্ণ, প্রথমে তার মা মারা যান এবং তারপর বাবাও। ময়ূর প্রায়ই অসুস্থ হতো।\"",
        "testimonial1.author": "- ময়ূর পাতিলের গল্প",
        "testimonial2.text": "\"সুনীল (৯) এবং বৈশালী (৭), উভয়েই এইচআইভি আক্রান্ত, এই গল্পটি হল কীভাবে এইচআইভি পরিবারগুলিকে ধ্বংস করে এবং ছোট শিশুদের কলঙ্কিত করে তার সর্বোত্তম উদাহরণ। শিশুদের মা চার বছর আগে মারা যান।\"",
        "testimonial2.author": "- সুনীল এবং বৈশালীর গল্প",
        "footer.home": "নীড় পাতা",
        "footer.about": "আমাদের সম্পর্কে জানুন",
        "footer.support": "আমাদের কার্যক্রমে সহযোগিতা করুন",
        "footer.programs": "প্রকল্পসমূহ",
        "footer.contact": "যোগাযোগ"
    }
};

// Function to change the language
function changeLanguage(language) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const translationKey = element.getAttribute('data-i18n');
        if (translations[language] && translations[language][translationKey]) {
            element.textContent = translations[language][translationKey];
        }
    });
}

// Event listener for language selection
document.getElementById('languageSelect').addEventListener('change', function () {
    const selectedLanguage = this.value;
    changeLanguage(selectedLanguage);
});


// Slider

let slideIndex = 0;
showSlides();

function showSlides() {
    let slides = document.querySelectorAll(".slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 8000); // Change slide every 8 seconds
}

document.querySelector(".prev").addEventListener("click", function() {
    slideIndex -= 2;
    if (slideIndex < 0) {slideIndex = 0}
    showSlides();
});

document.querySelector(".next").addEventListener("click", function() {
    showSlides();
});


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
