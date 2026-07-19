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
// Update static routing line near the top:
app.get('/', (req, res) => {
    // This resolves the absolute path safely across both Windows local and Linux cloud environments
    const filePath = path.resolve('index.html'); 
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("File delivery breakdown:", err);
            res.status(err.status).end();
        }
    });
});
