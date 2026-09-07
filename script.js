// ============================================================
// JavaScript - Search + Filter + Admin (Add/Delete Locations)
// ============================================================

// ===== DATA: Dhamaan Goobaha (15 goobood + 5 Herbal) =====
let locations = [
    // Goobaha Lubaan (15 goobood)
    { name: "Paris Dental Clinic", address: "Waddada Gargar, kasoo horjeedka ex Nasiiba", type: "Kilinik" },
    { name: "Geesh Supermarket", address: "Xaafada Masalaha", type: "Supermarket" },
    { name: "Ciir Supermarket", address: "Xaafada Masalaha", type: "Supermarket" },
    { name: "Libax Pharmacy", address: "Suuqa Hoose, agagaarka istaanka baska Cabaye", type: "Pharmacy" },
    { name: "Boqljire Supermarket", address: "Galbeedka magaalada, xaafada Boqljire (dhinaca buurta Kala Jexan)", type: "Supermarket" },
    { name: "Najax Dental Clinic", address: "Togdheer, kasoo horjeedka Fooqa Aadan Nayntiin", type: "Kilinik" },
    { name: "Gargar Dental Clinic", address: "Ku dheggan Dhakhtarka Gargar", type: "Kilinik" },
    { name: "Circle Supermarket", address: "Xaafada Pepsi, Bilowga waddada Jaamacadda Hargeisa", type: "Supermarket" },
    { name: "Gafane Supermarket", address: "Waddada galbeedka dhinaca buurta Kala Jexan", type: "Supermarket" },
    { name: "Smile Zone Dental Clinic", address: "Saldhig Dhexe", type: "Kilinik" },
    { name: "Family Mart", address: "Goolada sare ee Jigjiga Yar", type: "Supermarket" },
    { name: "Zirconi Dental Clinic", address: "Ka soo horjeedka Gym-ka Bilkhayr", type: "Kilinik" },
    { name: "Liiban Supermarket", address: "New Hargeisa", type: "Supermarket" },
    { name: "Salama Supermarket", address: "New Hargeisa, agagaarka xeero Traffic-ka", type: "Supermarket" },
    { name: "Faraska Supermarket", address: "New Hargeisa", type: "Supermarket" },

    // Goobaha Herbalka (5 goobood)
    { name: "Jabamila Herbal", address: "Suuqa Wahen, Asla Miles, City Center", type: "Herbal" },
    { name: "Dahabshiil Herbal Center", address: "Waddada weyn ee City Center, agagaarka Keysa Bausharo", type: "Herbal" },
    { name: "Hargeisa Herbal Pharmacy", address: "Ka timaada Saldhiga Dhexe, Mustjamaca Wayn", type: "Herbal" },
    { name: "Wahen Herbal Clinic", address: "Suuqa Wahen, dhinaca waddada weyn", type: "Herbal" },
    { name: "City Herbal Store", address: "City Center, Keysa Bausharo, agagaarka waddada weyn", type: "Herbal" }
];

// ===== DOM REFS =====
const grid = document.getElementById('locationGrid');
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const resultsCount = document.getElementById('resultsCount');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';
let currentSearch = '';

// ===== SAVE & LOAD from localStorage =====
function saveLocations() {
    localStorage.setItem('lubaanLocations', JSON.stringify(locations));
}

function loadLocations() {
    const saved = localStorage.getItem('lubaanLocations');
    if (saved) {
        locations = JSON.parse(saved);
    }
}

// Load data
loadLocations();

// ===== RENDER FUNCTION =====
function render() {
    const searchLower = currentSearch.toLowerCase().trim();
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

    resultsCount.textContent = `${filtered.length} goobood oo la helay`;
    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:40px 0; color:#64748b;">Ma jirto goob ku habboona. Boga wax ka bedel ama raadi wax kale.</p>`;
        return;
    }

    filtered.forEach((loc, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.03}s`;

        const tagClass = loc.type.toLowerCase() === 'supermarket' ? 'market' :
                         loc.type.toLowerCase() === 'killinik' ? 'clinic' :
                         loc.type.toLowerCase() === 'pharmacy' ? 'pharmacy' : 'herbal';

        // Find index in original array for delete
        const originalIndex = locations.indexOf(loc);

        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">${loc.name}</span>
                <span class="tag ${tagClass}">${loc.type}</span>
            </div>
            <div class="card-address">
                <i class="fas fa-map-pin"></i> ${loc.address}
            </div>
            <div class="card-actions">
                <button class="delete-btn" onclick="deleteLocation(${originalIndex})">
                    <i class="fas fa-trash-alt"></i> Tirtir
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ===== SEARCH & CLEAR =====
function searchLocations() {
    currentSearch = searchInput.value;
    clearBtn.classList.toggle('visible', currentSearch.length > 0);
    render();
}

function clearSearch() {
    searchInput.value = '';
    currentSearch = '';
    clearBtn.classList.remove('visible');
    render();
    searchInput.focus();
}

// ===== FILTER =====
function filterLocations(type) {
    currentFilter = type;
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === type) {
            btn.classList.add('active');
        }
    });
    render();
}

// ===== ADD LOCATION =====
function addLocation() {
    const nameInput = document.getElementById('newName');
    const addressInput = document.getElementById('newAddress');
    const typeSelect = document.getElementById('newType');
    const msg = document.getElementById('adminMessage');

    const name = nameInput.value.trim();
    const address = addressInput.value.trim();
    const type = typeSelect.value;

    if (!name || !address) {
        msg.textContent = '⚠️ Fadlan buuxi magaca iyo ciwaanka!';
        msg.className = 'admin-message error';
        return;
    }

    // Check duplicate
    const exists = locations.some(loc => loc.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        msg.textContent = '⚠️ Goobtan magaceeda ayaa hore u jirtay!';
        msg.className = 'admin-message error';
        return;
    }

    locations.push({ name, address, type });
    saveLocations();
    render();

    nameInput.value = '';
    addressInput.value = '';
    msg.textContent = `✅ "${name}" waa la ku daray!`;
    msg.className = 'admin-message success';

    setTimeout(() => {
        msg.textContent = '';
        msg.className = 'admin-message';
    }, 3000);
}

// ===== DELETE LOCATION =====
function deleteLocation(index) {
    const name = locations[index].name;
    if (confirm(`Ma hubtaa inaad tirtirto "${name}"?`)) {
        locations.splice(index, 1);
        saveLocations();
        render();
        const msg = document.getElementById('adminMessage');
        msg.textContent = `✅ "${name}" waa la tirtiray!`;
        msg.className = 'admin-message success';
        setTimeout(() => {
            msg.textContent = '';
            msg.className = 'admin-message';
        }, 2000);
    }
}

// ===== EVENT LISTENERS =====
searchInput.addEventListener('input', searchLocations);
clearBtn.addEventListener('click', clearSearch);

// ===== INITIAL RENDER =====
render();
