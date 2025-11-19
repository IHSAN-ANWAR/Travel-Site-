// Global variables
let destinations = [];

// Load destinations on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDestinations();
    setupEventListeners();
    setupSmoothScrolling();
});

// Load destinations from JSON
async function loadDestinations() {
    try {
        const response = await fetch('destinations.json');
        destinations = await response.json();
        displayDestinations(destinations);
    } catch (error) {
        console.error('Error loading destinations:', error);
        document.getElementById('destinationCards').innerHTML = 
            '<p style="text-align: center; color: #e74c3c;">Failed to load destinations. Please try again later.</p>';
    }
}

// Display destinations as cards
function displayDestinations(data) {
    const container = document.getElementById('destinationCards');
    container.innerHTML = '';
    
    if (data.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No destinations found. Try a different search.</p>';
        return;
    }
    
    data.forEach(dest => {
        const card = createDestinationCard(dest);
        container.appendChild(card);
    });
}

// Create destination card element
function createDestinationCard(dest) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    
    const localTime = getLocalTime(dest.timezone);
    
    card.innerHTML = `
        <img src="${dest.image}" alt="${dest.name}" class="card-image" onerror="this.src='https://via.placeholder.com/400x200?text=Image+Not+Available'">
        <div class="card-content">
            <h3 class="card-title">${dest.name}</h3>
            <p class="card-location">📍 ${dest.location}</p>
            <p class="card-description">${dest.description}</p>
            <p class="card-time">🕐 Local Time: ${localTime}</p>
        </div>
    `;
    
    return card;
}

// Get local time for timezone
function getLocalTime(timezone) {
    try {
        const options = {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return new Intl.DateTimeFormat('en-US', options).format(new Date());
    } catch (error) {
        return 'N/A';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Perform search
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayDestinations(destinations);
        document.getElementById('resultsTitle').textContent = 'Popular Destinations';
        return;
    }
    
    const filtered = destinations.filter(dest => 
        dest.type.toLowerCase().includes(searchTerm) ||
        dest.name.toLowerCase().includes(searchTerm) ||
        dest.location.toLowerCase().includes(searchTerm) ||
        dest.description.toLowerCase().includes(searchTerm)
    );
    
    displayDestinations(filtered);
    document.getElementById('resultsTitle').textContent = 
        `Search Results for "${searchTerm}" (${filtered.length} found)`;
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// Smooth scrolling for navigation
function setupSmoothScrolling() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Update active nav link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Handle contact form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const formMessage = document.getElementById('formMessage');
    
    // Validation
    if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission (in real app, use fetch to send to backend)
    console.log('Form submitted:', { name, email, message });
    
    // Show success message
    showFormMessage('Thank you for contacting us! We will get back to you soon.', 'success');
    
    // Reset form
    document.getElementById('contactForm').reset();
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show form message
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}
