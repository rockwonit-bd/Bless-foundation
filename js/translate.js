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
        "mission.title": "Mission Statement",
        "MotivatingTale.title": "Highlighting Motivating Tales",
        "footer.home": "Home",
        "footer.about": "About Us",
        "footer.support": "Support Our Effort",
        "footer.programs": "Programs/Projects",
        "footer.contact": "Contact Us",
        "project.knowMore": "Know More..."
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
        "vision.title": "ভিশন",
        "mission.title": "মিশন স্টেটমেন্ট",
        "MotivatingTale.title": "যারা আমাদের অনুপ্রেরণা",
        "footer.home": "নীড় পাতা",
        "footer.about": "আমাদের সম্পর্কে জানুন",
        "footer.support": "আমাদের কার্যক্রমে সহযোগিতা করুন",
        "footer.programs": "প্রকল্পসমূহ",
        "footer.contact": "যোগাযোগ",
        "project.knowMore": "আরও জানুন..."
    }
};

// Function to change the language
function changeLanguage(language) {
    localStorage.setItem('selectedLanguage', language);
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const translationKey = element.getAttribute('data-i18n');
        if (translations[language] && translations[language][translationKey]) {
            element.textContent = translations[language][translationKey];
        }
    });
    applyLanguage(language);
}

// Function to load the selected language from local storage
function loadLanguage() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    changeLanguage(savedLanguage);
    document.getElementById('languageSelect').value = savedLanguage;
}

// Event listener for language selection
document.getElementById('languageSelect').addEventListener('change', function () {
    const selectedLanguage = this.value;
    changeLanguage(selectedLanguage);
});

// Load language on page load
document.addEventListener('DOMContentLoaded', loadLanguage);