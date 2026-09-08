// ============================================================
// LUBAAAN PRODUCTS - JAVASCRIPT
// ============================================================

// ============================================================
// DATA: 20 goobood
// ============================================================
let locations = [
    { name: "Paris Dental Clinic", address: "Waddada Gargar, kasoo horjeedka ex Nasiiba", type: "Kilinik" },
    { name: "Geesh Supermarket", address: "Xaafada Masalaha", type: "Supermarket" },
    { name: "Ciir Supermarket", address: "Xaafada Masalaha", type: "Supermarket" },
    { name: "Libax Pharmacy", address: "Suuqa Hoose, agagaarka istaanka baska Cabaye", type: "Pharmacy" },
    { name: "Boqljire Supermarket", address: "Galbeedka magaalada, xaafada Boqljire", type: "Supermarket" },
    { name: "Najax Dental Clinic", address: "Togdheer, kasoo horjeedka Fooqa Aadan Nayntiin", type: "Kilinik" },
    { name: "Gargar Dental Clinic", address: "Ku dheggan Dhakhtarka Gargar", type: "Kilinik" },
    { name: "Circle Supermarket", address: "Xaafada Pepsi, Bilowga waddada Jaamacadda", type: "Supermarket" },
    { name: "Gafane Supermarket", address: "Waddada galbeedka dhinaca buurta Kala Jexan", type: "Supermarket" },
    { name: "Smile Zone Dental Clinic", address: "Saldhig Dhexe", type: "Kilinik" },
    { name: "Family Mart", address: "Goolada sare ee Jigjiga Yar", type: "Supermarket" },
    { name: "Zirconi Dental Clinic", address: "Ka soo horjeedka Gym-ka Bilkhayr", type: "Kilinik" },
    { name: "Liiban Supermarket", address: "New Hargeisa", type: "Supermarket" },
    { name: "Salama Supermarket", address: "New Hargeisa, agagaarka xeero Traffic-ka", type: "Supermarket" },
    { name: "Faraska Supermarket", address: "New Hargeisa", type: "Supermarket" },
    { name: "Jabamila Herbal", address: "Suuqa Wahen, Asla Miles, City Center", type: "Herbal" },
    { name: "Dahabshiil Herbal Center", address: "Waddada weyn ee City Center, Keysa Bausharo", type: "Herbal" },
    { name: "Hargeisa Herbal Pharmacy", address: "Ka timaada Saldhiga Dhexe, Mustjamaca Wayn", type: "Herbal" },
    { name: "Wahen Herbal Clinic", address: "Suuqa Wahen, dhinaca waddada weyn", type: "Herbal" },
    { name: "City Herbal Store", address: "City Center, Keysa Bausharo", type: "Herbal" }
];

// ============================================================
// SAVE & LOAD (localStorage)
// ============================================================
function saveLocations() {
    localStorage.setItem('lubaanLocations', JSON.stringify(locations));
}

function loadLocations() {
    const saved = localStorage.getItem('lubaanLocations');
    if (saved) {
        try { locations = JSON.parse(saved); }
        catch(e) { console.log('Error loading locations'); }
    }
}
loadLocations();

// ============================================================
// RENDER
// ============================================================
function render() {
    const searchLower = document.getElementById('searchInput').value.toLowerCase().trim();
    const filterBtns = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';
    filterBtns.forEach(btn => {
        if (btn.classList.contains('active')) currentFilter = btn.dataset.filter;
    });

    const filtered = locations.filter(loc => {
        if (currentFilter !== 'all' && loc.type !== currentFilter) return false;
        if (searchLower) {
            const match = loc.name.toLowerCase().includes(searchLower) ||
                          loc.address.toLowerCase().includes(searchLower) ||
                          loc.type.toLowerCase().includes(searchLower);
            if (!match) return false;
        }
        return true;
    });

    const countEl = document.getElementById('resultsCount');
    if (countEl) countEl.textContent = `${filtered.length} goobood oo la helay`;
    
    const grid = document.getElementById('locationGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:40px 0; color:#64748b;">Ma jirto goob ku habboona.</p>';
        return;
    }

    filtered.forEach((loc, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.03}s`;

        const tagClass = loc.type.toLowerCase() === 'supermarket' ? 'market' :
                         loc.type.toLowerCase() === 'killinik' ? 'clinic' :
                         loc.type.toLowerCase() === 'pharmacy' ? 'pharmacy' : 'herbal';

        const originalIndex = locations.indexOf(loc);

        card.innerHTML = `
            <h3>${loc.name}</h3>
            <p class="address"><i class="fas fa-map-pin"></i> ${loc.address}</p>
            <span class="tag ${tagClass}">${loc.type}</span>
            <div class="card-actions">
                <button class="delete-btn" onclick="deleteLocation(${originalIndex})">
                    <i class="fas fa-trash-alt"></i> Tirtir
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ============================================================
// SEARCH & FILTER
// ============================================================
function searchLocations() {
    const val = document.getElementById('searchInput').value;
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.classList.toggle('visible', val.length > 0);
    render();
}

function clearSearch() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    if (input) input.value = '';
    if (clearBtn) clearBtn.classList.remove('visible');
    render();
    if (input) input.focus();
}

function filterLocations(type) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === type) btn.classList.add('active');
    });
    render();
}

// ============================================================
// ADD & DELETE LOCATION
// ============================================================
function addLocation() {
    const nameInput = document.getElementById('newName');
    const addressInput = document.getElementById('newAddress');
    const typeSelect = document.getElementById('newType');
    const msg = document.getElementById('adminMessage');

    if (!nameInput || !addressInput || !typeSelect) {
        console.log("Admin form elements not found");
        return;
    }

    const name = nameInput.value.trim();
    const address = addressInput.value.trim();
    const type = typeSelect.value;

    if (!name || !address) {
        if (msg) {
            msg.textContent = '⚠️ Fadlan buuxi magaca iyo ciwaanka!';
            msg.className = 'admin-message error';
        }
        return;
    }

    if (locations.some(loc => loc.name.toLowerCase() === name.toLowerCase())) {
        if (msg) {
            msg.textContent = '⚠️ Goobtan magaceeda ayaa hore u jirtay!';
            msg.className = 'admin-message error';
        }
        return;
    }

    locations.push({ name, address, type });
    saveLocations();
    render();

    nameInput.value = '';
    addressInput.value = '';
    if (msg) {
        msg.textContent = `✅ "${name}" waa la ku daray!`;
        msg.className = 'admin-message success';
        setTimeout(() => { msg.textContent = ''; msg.className = 'admin-message'; }, 3000);
    }
    
    if (document.getElementById('adminLocationList')) {
        renderAdminList();
    }
}

function deleteLocation(index) {
    const name = locations[index].name;
    if (confirm(`Ma hubtaa inaad tirtirto "${name}"?`)) {
        locations.splice(index, 1);
        saveLocations();
        render();
        const msg = document.getElementById('adminMessage');
        if (msg) {
            msg.textContent = `✅ "${name}" waa la tirtiray!`;
            msg.className = 'admin-message success';
            setTimeout(() => { msg.textContent = ''; msg.className = 'admin-message'; }, 2000);
        }
        if (document.getElementById('adminLocationList')) {
            renderAdminList();
        }
    }
}

// ============================================================
// VISITOR COUNTER
// ============================================================
function updateVisitorCounter() {
    let count = localStorage.getItem('lubaanVisitors');
    if (count === null) count = 1;
    else count = parseInt(count) + 1;
    localStorage.setItem('lubaanVisitors', count);
    const counter = document.getElementById('visitorCounter');
    if (counter) counter.textContent = `👤 Booqdayaasha: ${count}`;
    return count;
}

const today = new Date().toDateString();
const lastVisit = localStorage.getItem('lubaanLastVisit');
if (lastVisit !== today) {
    let total = localStorage.getItem('lubaanTotalVisitors');
    if (total === null) total = 0;
    total = parseInt(total) + 1;
    localStorage.setItem('lubaanTotalVisitors', total);
    localStorage.setItem('lubaanLastVisit', today);
}

// ============================================================
// VISITOR IP & LOCATION
// ============================================================
function getVisitorLocation() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const info = {
                ip: data.ip || 'Unknown',
                city: data.city || 'Hargeisa',
                country: data.country_name || 'Somaliland'
            };
            localStorage.setItem('lubaanVisitorIP', info.ip);
            localStorage.setItem('lubaanVisitorCity', info.city);
            localStorage.setItem('lubaanVisitorCountry', info.country);
            const el = document.getElementById('visitorLocation');
            if (el) el.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${info.city}, ${info.country}`;
        })
        .catch(() => {
            fetch('https://ipinfo.io/json')
                .then(res => res.json())
                .then(data => {
                    const el = document.getElementById('visitorLocation');
                    if (el) el.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.city || 'Hargeisa'}, ${data.country || 'Somaliland'}`;
                })
                .catch(() => {});
        });
}

// ============================================================
// ADMIN PANEL - LOGIN
// ============================================================

const ADMIN_EMAIL = "akiidonly@gmail.com";
const ADMIN_PASSWORD = "Akiid12345";

function checkAdminLogin() {
    const emailInput = document.getElementById('adminEmail');
    const passwordInput = document.getElementById('adminPassword');
    const errorMsg = document.getElementById('adminError');
    
    if (!emailInput || !passwordInput) {
        console.log("Admin form elements not found");
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        if (errorMsg) errorMsg.style.display = 'none';
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminEmail', email);
        
        const lock = document.getElementById('adminLock');
        const content = document.getElementById('adminContent');
        if (lock) lock.style.display = 'none';
        if (content) {
            content.style.display = 'block';
            content.classList.add('active');
        }
        
        const toggleBtn = document.getElementById('adminToggleBtn');
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fas fa-cog"></i> Maamul (Furan)';
        }
        
        renderAdminList();
    } else {
        if (errorMsg) {
            errorMsg.style.display = 'block';
        }
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
}

function toggleAdminPanel() {
    const adminSection = document.getElementById('adminSection');
    const toggleBtn = document.getElementById('adminToggleBtn');
    
    if (!adminSection) return;
    
    const isVisible = adminSection.style.display !== 'none' && adminSection.style.display !== '';
    
    if (isVisible) {
        adminSection.style.display = 'none';
        adminSection.classList.remove('active');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-cog"></i> Maamul';
        sessionStorage.removeItem('adminLoggedIn');
    } else {
        adminSection.style.display = 'block';
        adminSection.classList.add('active');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-times"></i> Xir Maamul';
        
        if (sessionStorage.getItem('adminLoggedIn') === 'true') {
            const lock = document.getElementById('adminLock');
            const content = document.getElementById('adminContent');
            if (lock) lock.style.display = 'none';
            if (content) {
                content.style.display = 'block';
                content.classList.add('active');
            }
            renderAdminList();
        } else {
            const lock = document.getElementById('adminLock');
            const content = document.getElementById('adminContent');
            if (lock) lock.style.display = 'block';
            if (content) {
                content.style.display = 'none';
                content.classList.remove('active');
            }
            const error = document.getElementById('adminError');
            if (error) error.style.display = 'none';
        }
    }
}

function lockAdmin() {
    const lock = document.getElementById('adminLock');
    const content = document.getElementById('adminContent');
    if (lock) lock.style.display = 'block';
    if (content) {
        content.style.display = 'none';
        content.classList.remove('active');
    }
    const email = document.getElementById('adminEmail');
    const password = document.getElementById('adminPassword');
    if (email) email.value = '';
    if (password) password.value = '';
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminEmail');
    const toggleBtn = document.getElementById('adminToggleBtn');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-cog"></i> Maamul';
}

function renderAdminList() {
    const container = document.getElementById('adminLocationList');
    if (!container) return;
    
    container.innerHTML = '';
    locations.forEach((loc, index) => {
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        const tagClass = loc.type.toLowerCase() === 'supermarket' ? 'market' :
                         loc.type.toLowerCase() === 'killinik' ? 'clinic' :
                         loc.type.toLowerCase() === 'pharmacy' ? 'pharmacy' : 'herbal';
        item.innerHTML = `
            <div class="item-info">
                <strong>${loc.name}</strong>
                <small>${loc.address} · <span class="tag ${tagClass}" style="font-size:0.6rem;">${loc.type}</span></small>
            </div>
            <div class="item-actions">
                <button onclick="deleteLocation(${index})"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        container.appendChild(item);
    });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    updateVisitorCounter();
    getVisitorLocation();
    render();
    
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    if (searchInput) searchInput.addEventListener('input', searchLocations);
    if (clearBtn) clearBtn.addEventListener('click', clearSearch);
    
    const toggleBtn = document.getElementById('adminToggleBtn');
    if (toggleBtn) toggleBtn.style.display = 'inline-flex';
    
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        const adminSection = document.getElementById('adminSection');
        if (adminSection) {
            adminSection.style.display = 'block';
            adminSection.classList.add('active');
            if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-cog"></i> Maamul (Furan)';
            const lock = document.getElementById('adminLock');
            const content = document.getElementById('adminContent');
            if (lock) lock.style.display = 'none';
            if (content) {
                content.style.display = 'block';
                content.classList.add('active');
            }
            renderAdminList();
        }
    }
});

console.log("✅ Lubaan Products loaded successfully!");
console.log("📧 Admin Email: akiidonly@gmail.com");
console.log("🔑 Admin Password: Akiid12345");
