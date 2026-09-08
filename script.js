
// ============================================================
// ADMIN PANEL TOGGLE (Sax ah)
// ============================================================

// Admin credentials
const ADMIN_EMAIL = "akiidonly@gmail.com";
const ADMIN_PASSWORD = "Akiid12345";

// Toggle admin panel
function toggleAdminPanel() {
    console.log("Toggle admin panel clicked");
    const adminSection = document.getElementById('adminSection');
    const toggleBtn = document.getElementById('adminToggleBtn');
    
    if (!adminSection) {
        console.log("Admin section not found!");
        return;
    }
    
    if (adminSection.style.display === 'none' || adminSection.style.display === '') {
        // Show admin section
        adminSection.style.display = 'block';
        adminSection.classList.add('active');
        toggleBtn.innerHTML = '<i class="fas fa-times"></i> Xir Maamul';
        
        // Check if already logged in
        if (sessionStorage.getItem('adminLoggedIn') === 'true') {
            showAdminContent();
        } else {
            // Show login form
            document.getElementById('adminLock').style.display = 'block';
            document.getElementById('adminContent').style.display = 'none';
        }
    } else {
        // Hide admin section
        adminSection.style.display = 'none';
        adminSection.classList.remove('active');
        toggleBtn.innerHTML = '<i class="fas fa-cog"></i> Maamul';
        lockAdmin();
    }
}

// Show admin content after login
function showAdminContent() {
    document.getElementById('adminLock').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
    document.getElementById('adminContent').classList.add('active');
    renderAdminList();
}

// Lock admin
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
}

// Check admin login
function checkAdminLogin() {
    const email = document.getElementById('adminEmail');
    const password = document.getElementById('adminPassword');
    const error = document.getElementById('adminError');
    
    if (!email || !password) {
        console.log("Email or password field not found!");
        return;
    }
    
    if (email.value === ADMIN_EMAIL && password.value === ADMIN_PASSWORD) {
        if (error) error.style.display = 'none';
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminContent();
        const toggleBtn = document.getElementById('adminToggleBtn');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-cog"></i> Maamul (Furan)';
    } else {
        if (error) {
            error.style.display = 'block';
            error.textContent = '⚠️ Email ama Password waa khalad! Fadlan isku day mar kale.';
        }
        if (password) {
            password.value = '';
            password.focus();
            password.style.animation = 'shake 0.4s ease';
            setTimeout(() => { if (password) password.style.animation = ''; }, 500);
        }
    }
}

// Render admin location list
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

// Override addLocation and deleteLocation
const originalAddLocation = addLocation;
addLocation = function() {
    originalAddLocation();
    if (document.getElementById('adminLocationList')) {
        renderAdminList();
    }
};

const originalDeleteLocation = deleteLocation;
deleteLocation = function(index) {
    originalDeleteLocation(index);
    if (document.getElementById('adminLocationList')) {
        renderAdminList();
    }
};

// Show admin toggle button after page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - setting up admin");
    const toggleBtn = document.getElementById('adminToggleBtn');
    if (toggleBtn) {
        toggleBtn.style.display = 'inline-flex';
        console.log("Admin toggle button found and displayed");
    } else {
        console.log("Admin toggle button not found!");
    }
    
    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        console.log("Already logged in as admin");
        const adminSection = document.getElementById('adminSection');
        if (adminSection) {
            adminSection.style.display = 'block';
            adminSection.classList.add('active');
            if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-cog"></i> Maamul (Furan)';
            showAdminContent();
        }
    }
});

// Shake animation
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-6px); }
        80% { transform: translateX(6px); }
    }
`;
document.head.appendChild(shakeStyle);
console.log("Admin script loaded successfully!");
