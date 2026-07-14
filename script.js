// Home-page image slider
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function changeSlide(direction) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

if (slides.length) setInterval(() => changeSlide(1), 5000);

// Starting route data
const defaultRoutes = [
    { id: 1, name: 'Everest Base Camp', location: 'Nepal', duration: 14, difficulty: 'hard', elevation: 5364 },
    { id: 2, name: 'Annapurna Circuit', location: 'Nepal', duration: 18, difficulty: 'hard', elevation: 5416 },
    { id: 3, name: 'Inca Trail', location: 'Peru', duration: 4, difficulty: 'moderate', elevation: 2720 },
    { id: 4, name: 'Langtang Valley', location: 'Nepal', duration: 8, difficulty: 'easy', elevation: 3870 }
];

let routes = [...defaultRoutes];
let selectedDifficulty = 'all';

function updateRouteDisplay() {
    const tableBody = document.getElementById('routeTableBody');
    if (!tableBody) return;
    const visibleRoutes = routes.filter(route => selectedDifficulty === 'all' || route.difficulty === selectedDifficulty);
    tableBody.innerHTML = visibleRoutes.map(route => `
        <tr>
            <td>${route.name}</td><td>${route.location}</td><td>${route.duration} days</td>
            <td>${route.difficulty[0].toUpperCase() + route.difficulty.slice(1)}</td>
            <td>${route.elevation.toLocaleString()} m</td>
            <td><button class="delete-btn" onclick="deleteRoute(${route.id})">Delete</button></td>
        </tr>`).join('');
    if (!visibleRoutes.length) tableBody.innerHTML = '<tr><td colspan="6">No routes found.</td></tr>';
}

function filterRoutes(difficulty, button) {
    selectedDifficulty = difficulty;
    document.querySelectorAll('.filters button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    updateRouteDisplay();
}

function addRoute(route) {
    routes.push({ id: Date.now(), ...route });
    updateRouteDisplay();
}

function quickAddRoute(name, location, duration, difficulty, elevation) {
    addRoute({ name, location, duration, difficulty, elevation });
}

function deleteRoute(id) {
    routes = routes.filter(route => route.id !== id);
    updateRouteDisplay();
}

function clearAllRoutes() {
    if (confirm('Remove all routes?')) {
        routes = [];
        updateRouteDisplay();
    }
}

const routeForm = document.getElementById('routeForm');
if (routeForm) {
    routeForm.addEventListener('submit', event => {
        event.preventDefault();
        addRoute({
            name: document.getElementById('routeName').value.trim(),
            location: document.getElementById('location').value.trim(),
            duration: Number(document.getElementById('duration').value),
            difficulty: document.getElementById('difficulty').value,
            elevation: Number(document.getElementById('elevation').value)
        });
        routeForm.reset();
        document.getElementById('routeSuccess').hidden = false;
    });
    updateRouteDisplay();
}

// Contact form validation
function validateForm() {
    document.querySelectorAll('.error').forEach(item => item.textContent = '');
    const checks = [
        ['name', value => value.length >= 2, 'Please enter at least 2 characters.'],
        ['email', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Please enter a valid email.'],
        ['subject', value => value.length >= 5, 'Please enter at least 5 characters.'],
        ['message', value => value.length >= 10, 'Please enter at least 10 characters.']
    ];
    let valid = true;
    checks.forEach(([id, test, message]) => {
        if (!test(document.getElementById(id).value.trim())) {
            document.getElementById(`${id}Error`).textContent = message;
            valid = false;
        }
    });
    if (valid) {
        document.getElementById('contactForm').reset();
        document.getElementById('formSuccess').hidden = false;
    }
    return false;
}
