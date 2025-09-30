// ========================================================= 
// 1. TESTIMONIAL CAROUSEL FUNCTIONALITY (REVISED FOR ENDPOINTS) 
// ========================================================= 
let slideIndex = 1; // Start at the first slide (index 1) 

function showSlides(n) { 
    const slides = document.getElementsByClassName("testimonial-card"); 
    const prevBtn = document.querySelector('.carousel-prev'); 
    const nextBtn = document.querySelector('.carousel-next'); 

    if (slides.length === 0 || !prevBtn || !nextBtn) return; 

    for (let i = 0; i < slides.length; i++) { 
        slides[i].classList.remove('active'); 
    } 
    
    slides[n - 1].classList.add('active'); 

    prevBtn.style.visibility = 'visible'; 
    nextBtn.style.visibility = 'visible'; 

    if (n === 1) prevBtn.style.visibility = 'hidden'; 
    if (n === slides.length) nextBtn.style.visibility = 'hidden'; 
} 

function plusSlides(n) { 
    let slides = document.getElementsByClassName("testimonial-card"); 
    let newIndex = slideIndex + n; 
    
    if (newIndex >= 1 && newIndex <= slides.length) { 
        slideIndex = newIndex; 
        showSlides(slideIndex); 
    } 
} 

function setupCarousel() { 
    const prevBtn = document.querySelector('.carousel-prev'); 
    const nextBtn = document.querySelector('.carousel-next'); 

    if (prevBtn && nextBtn) { 
        prevBtn.addEventListener('click', () => plusSlides(-1));  
        nextBtn.addEventListener('click', () => plusSlides(1)); 
        showSlides(slideIndex);  
    }
}


// =========================================================
// 2. DROPDOWN MENUS (View Trips Button)
// =========================================================
function setupDropdowns() {
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');

    dropdownButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); 
            const dropdown = this.closest('.dropdown');
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            dropdownContent.classList.toggle('show');
            closeAllOtherDropdowns(dropdown);
        });
    });

    function closeAllOtherDropdowns(currentDropdown = null) {
        document.querySelectorAll('.dropdown-content').forEach(content => {
            const parentDropdown = content.closest('.dropdown');
            if (parentDropdown !== currentDropdown) {
                content.classList.remove('show');
            }
        });
    }

    window.onclick = function(event) {
        if (!event.target.matches('.dropdown-btn')) {
            closeAllOtherDropdowns();
        }
    }
}


// =========================================================
// 3. UTILITIES (Back to Top, Live Chat)
// =========================================================
function setupBackToTop() {
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (!backToTopBtn) return;

    window.onscroll = function() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    };

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    });
}

function setupLiveChat() {
    const chatIcon = document.getElementById("liveChatIcon");
    if (!chatIcon) return;

    chatIcon.addEventListener('click', function() {
        alert("Live Chat is currently offline. Please use the Contact Form!");
    });
}


// =========================================================
// 4. CONTACT FORM (AJAX → Node.js)
// =========================================================
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    const API_ENDPOINT = 'http://localhost:5000/contact'; 

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const form = event.target;
            const submitButton = form.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text || response.statusText); });
                }
                return response.text(); 
            })
            .then(messageText => {
                alert(messageText);
                contactForm.reset(); 
            })
            .catch(error => {
                console.error('Submission error:', error);
                alert(`Error: ${error.message}. Please check console.`);
            })
            .finally(() => {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
}

function setupBookNowModal() {
    const bookNowButton = document.getElementById('globalBookNow');
    const bookingModal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    const closeModal = document.querySelector('.close-modal'); 
    
    const destinationSelect = document.getElementById('modal-destination');
    const consultationDetails = document.getElementById('consultationDetails');
    const modalDateLabel = document.getElementById('modal-date-label');
    const submitButton = document.querySelector('#bookingForm .submit-button');

    const styleField = document.getElementById('modal-style');
    const budgetField = document.getElementById('modal-budget');
    const monthField = document.getElementById('modal-month');

    if (!bookNowButton || !bookingModal || !bookingForm || !destinationSelect) {
        console.warn("❌ Booking Modal or Button not found");
        return;
    }

    destinationSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            consultationDetails.style.display = 'block';
            modalDateLabel.textContent = 'Preferred Start Date (Optional):';
            submitButton.textContent = 'Request Consultation';
            
            // Make fields required
            styleField.required = true;
            budgetField.required = true;
            monthField.required = true;
            console.log("Consultation fields required");
        } else {
            consultationDetails.style.display = 'none';
            modalDateLabel.textContent = 'Preferred Start Date:';
            submitButton.textContent = 'Request Booking';
            
            // Remove required from hidden fields
            styleField.required = false;
            budgetField.required = false;
            monthField.required = false;
            console.log("Consultation fields not required");
        }
    });

    bookNowButton.addEventListener('click', () => {
        bookingModal.style.display = 'block';
        document.body.classList.add('modal-open'); 
        console.log("Modal opened");
    });

    closeModal.addEventListener('click', () => {
        bookingModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        console.log("Modal closed");
    });

    window.addEventListener('click', (event) => {
        if (event.target === bookingModal) {
            bookingModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            console.log("Modal closed by outside click");
        }
    });

    bookingForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log("Form submission started");

        const formData = {
            name: document.getElementById('modal-name').value,
            email: document.getElementById('modal-email').value,
            destination: destinationSelect.value,
            style: styleField.value || null,
            budget: budgetField.value || null,
            month: monthField.value || null,
            notes: document.getElementById('modal-notes').value || null,
            date: document.getElementById('modal-date').value
        };

        console.log("Form Data:", formData);

        try {
            const res = await fetch("http://localhost:5000/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            console.log("Server Response:", data);

            if (res.ok) {
                alert(`✅ ${data.message}`);
            } else {
                alert(`❌ Error: ${data.error}`);
            }

        } catch (err) {
            console.error("Booking submission failed:", err);
            alert("⚠️ Something went wrong. Please try again later.");
        }

        bookingForm.reset();
        consultationDetails.style.display = 'none';
        styleField.required = false;
        budgetField.required = false;
        monthField.required = false;
        bookingModal.style.display = 'none'; 
        document.body.classList.remove('modal-open');
        console.log("Form reset and modal closed");
    });
}


// =========================================================
// 6. NAVBAR HIGHLIGHTING (Scrollspy)
// =========================================================
function setupScrollHighlighting() {
    const sections = document.querySelectorAll('#destinations, #gallery, #testimonials, #contact');
    const navLinks = document.querySelectorAll('nav ul li a');

    const options = {
        root: null, 
        rootMargin: '0px 0px -80% 0px', 
        threshold: 0.05 
    };

    const observer = new IntersectionObserver((entries) => {
        document.querySelectorAll('nav ul li').forEach(li => li.classList.remove('active'));
        let foundActive = false;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const correspondingLink = document.querySelector(`nav ul li a[href="#${id}"]`);
                if (correspondingLink) {
                    correspondingLink.closest('li').classList.add('active');
                    foundActive = true;
                }
            }
        });
        
        if (!foundActive && window.scrollY < 50) {
            const homeLink = document.querySelector('nav ul li a[href="/"]');
            if (homeLink) {
                homeLink.closest('li').classList.add('active');
            }
        }
    }, options);

    sections.forEach(section => observer.observe(section));

    window.addEventListener('load', () => {
        if (window.scrollY < 50) {
            const homeLink = document.querySelector('nav ul li a[href="/"]');
            if (homeLink) {
                homeLink.closest('li').classList.add('active');
            }
        }
    });
}

// =========================================================
// 6. DESTINATION FILTERING (Search/Filter Plugin)
// =========================================================
function setupDestinationFilter() {
    const searchInput = document.getElementById('destinationSearch');
    const destinationCards = document.querySelectorAll('.destination-card');

    if (!searchInput || destinationCards.length === 0) return;

    searchInput.addEventListener('keyup', function() {
        const filter = searchInput.value.toLowerCase();

        destinationCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const text = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(filter) || text.includes(filter)) {
                card.style.display = 'block'; 
            } else {
                card.style.display = 'none';
            }
        });
    });
    console.log('Destination filter initialized.');
}


// =========================================================
// 7. ANIMATED SCROLL REVEAL (Aesthetic Plugin)
// =========================================================
function setupScrollReveal() {
    // Select all elements that have the CSS class 'scroll-reveal'
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Option: Stop observing once visible
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });
    console.log('Scroll Reveal animations initialized.');
}

// =========================================================
// 8. DESTINATION EXPAND/COLLAPSE PLUGIN
// =========================================================
// =========================================================
// 8. DESTINATION EXPAND/COLLAPSE PLUGIN
// =========================================================
function setupDestinationToggle() {
    const toggleBtn = document.getElementById('toggleDestinationsBtn');
    const grid = document.querySelector('.destination-grid');

    if (!toggleBtn || !grid) return;

    toggleBtn.addEventListener('click', function() {
        // This is the core line that shrinks/expands the content via CSS
        grid.classList.toggle('expanded'); 

        const isExpanded = grid.classList.contains('expanded');
        if (isExpanded) {
            this.textContent = 'Collapse Destinations';
        } else {
            // Text changes back to 'View 7 More Destinations' when collapsing
            this.textContent = 'View 7 More Destinations'; 
        }
    });
    console.log('Destination toggle plugin initialized.');
}
// --- INITIALIZATION ---
// Add setupDestinationToggle(); to your document.addEventListener('DOMContentLoaded', ...) block.


// =========================================================
// INITIALIZATION
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    setupDropdowns();
    setupCarousel(); 
    setupContactForm();
    setupBackToTop();
    setupLiveChat();
    setupScrollHighlighting(); 
    setupBookNowModal();
    setupDestinationFilter(); // Enable search bar functionality
    setupScrollReveal();
    setupDestinationToggle()

    console.log('All website features initialized!');
});
