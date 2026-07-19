let adminToken = sessionStorage.getItem('adminToken') || null;

// Initialize system components dynamically based on which elements exist on the current page
async function initSystem() {
    const res = await fetch('/api/stations');
    const stations = await res.json();

    const originSelect = document.getElementById('origin');
    const destSelect = document.getElementById('destination');
    const adminTable = document.getElementById('admin-table-body');

    // 1. If user is on the Public Commuter Portal Page
    if (originSelect && destSelect) {
        originSelect.innerHTML = '';
        destSelect.innerHTML = '';
        stations.forEach(s => {
            const lineBadge = s.line_color === 'Purple' ? '💜' : s.line_color === 'Aqua' ? '🩵' : '🔄';
            const label = `${s.station_name} ${lineBadge}`;
            originSelect.options.add(new Option(label, s.station_id));
            destSelect.options.add(new Option(label, s.station_id));
        });
    }

    // 2. If user is on the Secure Admin Control Panel Page
    if (adminTable && adminToken) {
        adminTable.innerHTML = '';
        stations.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><b>#${s.station_id}</b></td>
                <td><span style="font-size: 1.05rem; font-weight: 500;">${s.station_name}</span></td>
                <td><span class="badge ${s.line_color.toLowerCase()}">${s.line_color} Line</span></td>
                <td>
                    <span style="color: ${s.is_blocked ? '#cf6679' : '#03dac6'}; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
                        ${s.is_blocked ? '🛑 BLOCKED' : '🟢 ACTIVE'}
                    </span>
                </td>
                <td>
                    <button class="nav-btn" style="padding: 8px 16px; background: ${s.is_blocked ? 'rgba(3, 218, 198, 0.1)' : 'rgba(207, 102, 121, 0.1)'}; color: ${s.is_blocked ? 'var(--blue-line)' : 'var(--accent-red)'}; border: 1px solid rgba(255,255,255,0.05);" 
                        onclick="toggleStation(${s.station_id}, ${s.is_blocked ? 0 : 1})">
                        ${s.is_blocked ? 'Unblock Track' : 'Block Track'}
                    </button>
                </td>
            `;
            adminTable.appendChild(tr);
        });
    }
}

// Check session memory state when rendering the admin page
function checkAdminSession() {
    const loginCard = document.getElementById('admin-login-card');
    const dashboard = document.getElementById('admin-control-dashboard');
    
    if (loginCard && dashboard) {
        if (adminToken) {
            document.body.style.display = "block";
            document.body.style.alignItems = "unset";
            document.body.style.justifyContent = "unset";
            document.body.style.background = "var(--bg-dark)";
            loginCard.style.display = 'none';
            dashboard.style.display = 'block';
            initSystem();
        } else {
            document.body.style.display = "flex";
            loginCard.style.display = 'block';
            dashboard.style.display = 'none';
        }
    }
}

// Process Dijkstra routing request across the public portal
async function findRoute() {
    const startId = document.getElementById('origin').value;
    const endId = document.getElementById('destination').value;
    const outputCard = document.getElementById('route-output');

    outputCard.innerHTML = `<span style="color: var(--blue-line);">Running Dijkstra Graph Traversal...</span>`;

    const res = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startId, endId })
    });

    const data = await res.json();
    if (data.error) {
        outputCard.innerHTML = `<div style="color: var(--accent-red); font-weight: 600; margin-top: 1rem;">⚠️ ${data.error}</div>`;
        return;
    }

    const pathStr = data.path.map(s => `<b>${s.station_name}</b>`).join(' ➔ ');
    outputCard.innerHTML = `
        <div style="display: flex; gap: 2rem; margin-bottom: 1.5rem; margin-top: 1rem;">
            <div><label>Total Track Distance</label><h2 style="color: var(--blue-line); font-size: 2rem; margin-top: 0.25rem;">${data.totalDistance} KM</h2></div>
            <div><label>Estimated Duration</label><h2 style="color: var(--purple-line); font-size: 2rem; margin-top: 0.25rem;">${data.totalTime} Mins</h2></div>
        </div>
        <label>Calculated Commuter Path Sequence</label>
        <div style="background: rgba(0,0,0,0.3); padding: 1.25rem; border-radius: 8px; line-height: 1.6; border-left: 4px solid var(--blue-line); margin-top: 0.5rem; color: #fff; font-size: 1.1rem;">
            ${pathStr}
        </div>
    `;
}

// Authentication handler
async function loginAdmin() {
    const username = document.getElementById('admin-user').value;
    const password = document.getElementById('admin-pass').value;
    const errorDiv = document.getElementById('login-error');

    const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if(data.success) {
        adminToken = data.token;
        sessionStorage.setItem('adminToken', adminToken);
        checkAdminSession();
    } else {
        errorDiv.innerText = "❌ " + data.message;
    }
}

// Securely drop authorized session state variables
function logoutAdmin() {
    adminToken = null;
    sessionStorage.removeItem('adminToken');
    window.location.reload();
}

// Admin toggle handler
async function toggleStation(stationId, targetState) {
    const res = await fetch('/api/admin/toggle', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': adminToken
        },
        body: JSON.stringify({ stationId, isBlocked: targetState })
    });
    
    if(res.status === 403) {
        alert("Session expired or unauthorized attempt.");
        logoutAdmin();
        return;
    }
    initSystem();
}

// Launch appropriate configurations automatically on load
window.onload = () => {
    initSystem();
    checkAdminSession();
};
// Establish live connection to the backend update stream
const eventSource = new EventSource('/api/commuter/updates');

eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    showBlockPopup(data.stationName);
};

// Function to generate and display the popup modal
function showBlockPopup(stationName) {
    // Create the background overlay elements dynamically
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    overlay.style.backdropFilter = 'blur(5px)'; // Matches your glassmorphism design
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zindex = '9999';

    // Create the popup alert box
    const modal = document.createElement('div');
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '30px';
    modal.style.borderRadius = '12px';
    modal.style.textAlign = 'center';
    modal.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    modal.style.maxWidth = '400px';
    modal.style.width = '90%';

    // Structure the message
    modal.innerHTML = `
        <div style="font-size: 40px; margin-bottom: 15px;">⚠️</div>
        <h3 style="margin: 0 0 10px 0; color: #e53e3e; font-family: sans-serif;">Station Blocked Alert</h3>
        <p style="margin: 0 0 20px 0; color: #4a5568; font-family: sans-serif; line-height: 1.5;">
            <strong>${stationName}</strong> station has been temporarily blocked by administration. Kindly avoid going to that station.
        </p>
        <button id="closePopupBtn" style="background-color: #553c9a; color: white; border: none; padding: 10px 25px; font-size: 16px; border-radius: 6px; cursor: pointer; font-weight: bold;">
            Understood
        </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Event handler to dismiss the popup alert safely
    modal.querySelector('#closePopupBtn').addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}