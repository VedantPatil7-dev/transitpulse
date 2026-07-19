const express = require('express');
const path = require('path');
const http = require('http');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all static assets from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// SSE Clients array for real-time station blocks
let sseClients = [];

// Database Setup
const dbPath = path.join(__dirname, 'transitpulse.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Initialize tables if they don't exist
        db.run(`CREATE TABLE IF NOT EXISTS admin_settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`);
    }
});

// --- Server-Sent Events (SSE) Endpoint ---
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    sseClients.push(res);

    req.on('close', () => {
        sseClients = sseClients.filter(client => client !== res);
    });
});

// Function to broadcast alert to all connected public users
function broadcastAlert(message) {
    sseClients.forEach(client => {
        client.write(`data: ${JSON.stringify({ alert: message })}\n\n`);
    });
}

// --- Routes ---

// 1. Public Portal Route (index.html inside public folder)
app.get('/', (req, res) => {
    const homepagePath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(homepagePath, (err) => {
        if (err) {
            console.error("CRITICAL: Could not find index.html at:", homepagePath);
            res.status(404).send("<h3>TransitPulse Error: index.html is missing from the public folder!</h3>");
        }
    });
});

// 2. Admin Dashboard Route (admin.html inside public folder)
app.get('/admin', (req, res) => {
    const adminPath = path.join(__dirname, 'public', 'admin.html');
    res.sendFile(adminPath, (err) => {
        if (err) {
            console.error("CRITICAL: Could not find admin.html at:", adminPath);
            res.status(404).send("<h3>TransitPulse Error: admin.html is missing from the public folder!</h3>");
        }
    });
});

// 3. Admin Authentication Endpoint
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple authentication logic (Change these credentials for production)
    if (username === 'admin' && password === 'dypacs123') {
        res.json({ success: true, message: 'Authentication successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// 4. Action Endpoint to Block a Station (Triggered by Admin)
app.post('/api/admin/block-station', (req, res) => {
    const { stationName, reason } = req.body;
    
    if (!stationName) {
        return res.status(400).json({ success: false, message: 'Station name is required' });
    }

    const alertMessage = `ALERT: ${stationName} Station is currently blocked. Reason: ${reason || 'Maintenance'}. Dynamic rerouting applied.`;
    
    // Trigger real-time alert to all public portals via SSE
    broadcastAlert(alertMessage);

    res.json({ success: true, message: `Station ${stationName} blocked successfully and alert broadcasted.` });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`TransitPulse server is running on port ${PORT}`);
});
