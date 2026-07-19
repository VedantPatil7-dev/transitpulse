const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware for parsing JSON arrays and static file routing
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Global registry tracking live commuter stream connection instances
let commuterClients = [];

// ==========================================
// 1. REAL-TIME EVENT STREAM (SSE) FOR PASSENGERS
// ==========================================
app.get('/api/commuter/updates', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Add this tab connection to the active broadcast array
    commuterClients.push(res);

    // Remove client connection structure if passenger closes the browser tab
    req.on('close', () => {
        commuterClients = commuterClients.filter(client => client !== res);
    });
});

// ==========================================
// 2. ADMIN BLOCK ACTION API DISPATCHER
// ==========================================
app.post('/api/admin/block-station', (req, res) => {
    const { stationName, isBlocked } = req.body;
    
    console.log(`[Command Center] Status update: ${stationName} -> Blocked: ${isBlocked}`);

    // --- YOUR SQLITE3 DATABASE WEIGHT ACCENT PIPELINES GO HERE ---
    // Example: db.run("UPDATE routes SET weight = 99999 WHERE station = ...")

    // Broadcast the hazard alert payload to all public commuter viewports instantly
    if (isBlocked) {
        commuterClients.forEach(client => {
            client.write(`data: ${JSON.stringify({ stationName })}\n\n`);
        });
    }

    res.json({ 
        success: true, 
        message: `Network matrix recalculation complete for ${stationName}.` 
    });
});

// Serve frontend main access indices
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n===================================================`);
    console.log(`🚀 TRANSITPULSE ALGORITHM ENGINE ACTIVE ON PORT ${PORT}`);
    console.log(`👉 Commuter Portal: http://localhost:${PORT}`);
    console.log(`👉 Admin Panel:     http://localhost:${PORT}/admin.html`);
    console.log(`===================================================\n`);
});
const path = require('path');
const express = require('express');
const app = express();

// 1. Tell Express to serve ALL static files (CSS, JS, images) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ... (your other middleware, routes, and SQLite setup) ...

// 2. Update the root route to point inside the public folder
app.get('/', (req, res) => {
    const homepagePath = path.join(__dirname, 'public', 'index.html'); 
    
    res.sendFile(homepagePath, (err) => {
        if (err) {
            console.error("CRITICAL: Could not find index.html at location:", homepagePath);
            res.status(404).send("<h3>TransitPulse Error: index.html is missing from the public folder!</h3>");
        }
    });
});

// ... (your admin.html route and app.listen code) ...
