
// ============================================================
// ADMIN PANEL - Sax Login
// ============================================================

// Admin credentials (Waxaad bedeli kartaa haddii aad rabto)
const ADMIN_EMAIL = "akiidonly@gmail.com";
const ADMIN_PASSWORD = "Akiid12345";

// Check admin login - function sax ah
function checkAdminLogin() {
    console.log("Checking admin login...");
    
    const emailInput = document.getElementById('adminEmail');
    const passwordInput = document.getElementById('adminPassword');
    const errorMsg = document.getElementById('adminError');
    
    // Hubi haddii qaybaha ay jiraan
    if (!emailInput || !passwordInput) {
        console.log("Error: Email or password field not found!");
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log("Email entered:", email);
    console.log("Admin email:", ADMIN_EMAIL);
    
    // Hubi credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        console.log("Login successful!");
        if (errorMsg) errorMsg.style.display = 'none';
        
        // Kaydi session
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminEmail', email);
        
        // Muuji admin content
        const lock = document.getElementById('adminLock');
        const content = document.getElementById('adminContent');
        if (lock) lock.style.display = 'none';
        if (content) {
            content.style.display = 'block';
            content.classList.add('active');
        }
        
        // Bedel badhanka toggle
        const toggleBtn = document.getElementById('adminToggleBtn');
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="fas fa-cog"></i> Maamul (Furan)';
        }
        
        // Render admin list
        renderAdminList();
        
    } else {
        console.log("Login failed - wrong credentials");
        if (errorMsg) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = '⚠️ Email ama Password waa khalad! Fadlan isku day mar kale.';
        }
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
            passwordInput.style.animation = 'shake 0.4s ease';
            setTimeout(() => { passwordInput.style.animation = ''; }, 500);
        }
    }
}

// Toggle admin panel
function toggleAdminPanel() {
    console.log("Toggle admin panel clicked");
    const adminSection = document.getElementById('adminSection');
    const toggleBtn = document.getElementById('adminToggleBtn');
    
    if (!adminSection) {
        console.log("Admin section not found!");
        return;
    }
    
    const isVisible = adminSection.style.display !== 'none' && adminSection.style.display !== '';
    
    if (isVisible) {
        // Hide admin
        adminSection.style.display = 'none';
        adminSection.classList.remove('active');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-cog"></i> Maamul';
        // Lock admin
        const lock = document.getElementById('adminLock');
        const content = document.getElementById('adminContent');
        if (lock) lock.style.display = 'block';
        if (content) {
            content.style.display = 'none';
            content.classList.remove('active');
        }
        sessionStorage.removeItem('adminLoggedIn');
    } else {
        // Show admin
        adminSection.style.display = 'block';
        adminSection.classList.add('active');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-times"></i> Xir Maamul';
        
        // Check if already logged in
        if (sessionStorage.getItem('adminLoggedIn') === 'true') {
            // Already logged in - show content
            const lock = document.getElementById('adminLock');
            const content = document.getElementById('adminContent');
            if (lock) lock.style.display = 'none';
            if (content) {
                content.style.display = 'block';
                content.classList.add('active');
            }
            renderAdminList();
        } else {
            // Show login form
            const lock = document.getElementById('adminLock');
            const content = document.getElementById('adminContent');
            if (lock) lock.style.display = 'block';
            if (content) {
                content.style.display = 'none';
                content.classList.remove('active');
            }
            // Clear error
            const error = document.getElementById('adminError');
            if (error) error.style.display = 'none';
        }
    }
}

// Lock admin (ka bax)
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

// Show admin content (kadib login)
function showAdminContent() {
    const lock = document.getElementById('adminLock');
    const content = document.getElementById('adminContent');
    if (lock) lock.style.display = 'none';
    if (content) {
        content.style.display = 'block';
        content.classList.add('active');
    }
    renderAdminList();
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

// Check session on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - checking admin session");
    
    // Show admin toggle button
    const toggleBtn = document.getElementById('adminToggleBtn');
    if (toggleBtn) {
        toggleBtn.style.display = 'inline-flex';
    }
    
    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        console.log("Admin already logged in");
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

console.log("Admin script loaded! Credentials: " + ADMIN_EMAIL);
