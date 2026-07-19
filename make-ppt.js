const pptxgen = require('pptxgenjs');
let pptx = new pptxgen();

// Global Presentation Layout Configuration
pptx.layout = 'LAYOUT_16x9';

// Define Master Styling Palette
const colors = {
    bgDark: '0F111A',       // Deep Space Charcoal
    textWhite: 'FFFFFF',    // Pristine White
    textMuted: '9CA3AF',    // Slate Gray
    purpleLine: 'BB86FC',   // Glowing Purple Line
    aquaLine: '03DAC6',     // Electric Aqua Line
    accentRed: 'CF6679'     // Warning Red
};

// ==========================================
// SLIDE 1: THE CINEMATIC INTRO
// ==========================================
let slide1 = pptx.addSlide();
slide1.background = { fill: colors.bgDark };

// Decorative Minimalist Metro Graphic Accent
slide1.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0, w: 0.15, h: '100%', fill: { color: colors.purpleLine } });
slide1.addShape(pptx.ShapeType.rect, { x: 0.7, y: 0, w: 0.15, h: '100%', fill: { color: colors.aquaLine } });

slide1.addText("TRANSITPULSE", {
    x: 1.5, y: 2.2, w: 10, h: 1.0,
    fontName: 'Montserrat', fontSize: 54, bold: true, color: colors.textWhite, breakLine: true
});
slide1.addText("Next-Gen Metro Routing & Commuter Flow Simulation Engine", {
    x: 1.5, y: 3.2, w: 10, h: 0.5,
    fontName: 'Segoe UI', fontSize: 18, color: colors.aquaLine
});
slide1.addText("Presented By: Vedant Patil | B.Sc. Computer Science\nTech Stack: Node.js • Express • SQLite3 • Glassmorphism UI", {
    x: 1.5, y: 5.5, w: 10, h: 0.8,
    fontName: 'Segoe UI', fontSize: 14, color: colors.textMuted
});

// ==========================================
// SLIDE 2: THE CORE PROBLEM STATEMENT
// ==========================================
let slide2 = pptx.addSlide();
slide2.background = { fill: colors.bgDark };

slide2.addText("Breaking Through Static Infrastructure", { x: 0.8, y: 0.5, w: 11, h: 0.6, fontName: 'Segoe UI', fontSize: 28, bold: true, color: colors.textWhite });

// Left Column: The Problem Card
slide2.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 1.5, w: 5.2, h: 4.8, fill: { color: 'FFFFFF', alpha: 95 }, line: { color: colors.accentRed, width: 1 } });
slide2.addText("🚨 THE LEGACY PROBLEM", { x: 1.1, y: 1.8, w: 4.6, h: 0.4, fontName: 'Segoe UI', fontSize: 18, bold: true, color: colors.accentRed });
slide2.addText("Modern municipal transit setups rely on rigid, static timetables. When an emergency breakdown, crowd spike, or maintenance gridlock hits a sector, the tracking frameworks fail to adapt dynamically. This leads to broken scheduling systems and high passenger congestion at platforms.", {
    x: 1.1, y: 2.4, w: 4.6, h: 3.5, fontName: 'Segoe UI', fontSize: 15, color: colors.textMuted, lineSpacing: 24
});

// Right Column: The Solution Card
slide2.addShape(pptx.ShapeType.roundRect, { x: 6.8, y: 1.5, w: 5.2, h: 4.8, fill: { color: 'FFFFFF', alpha: 95 }, line: { color: colors.aquaLine, width: 1 } });
slide2.addText("💡 THE TRANSITPULSE SOLUTION", { x: 7.1, y: 1.8, w: 4.6, h: 0.4, fontName: 'Segoe UI', fontSize: 18, bold: true, color: colors.aquaLine });
slide2.addText("TransitPulse models the entire layout as an in-memory mathematical graph G=(V,E). Stations act as vector nodes while tracks act as directional weighted edges. The routing core runs dynamic calculations, recalculating alternative pathways instantly when modifications occur.", {
    x: 7.1, y: 2.4, w: 4.6, h: 3.5, fontName: 'Segoe UI', fontSize: 15, color: colors.textWhite, lineSpacing: 24
});

// ==========================================
// SLIDE 3: DIGITAL TWIN ARCHITECTURE (PUNE METRO)
// ==========================================
let slide3 = pptx.addSlide();
slide3.background = { fill: colors.bgDark };

slide3.addText("Mapping Real-World Infrastructure (Pune Metro Model)", { x: 0.8, y: 0.5, w: 11, h: 0.6, fontName: 'Segoe UI', fontSize: 28, bold: true, color: colors.textWhite });

// Conceptual Network Graph Layout Group Data
slide3.addText("🟣 LINE 1 (PURPLE LINE)\nPCMC Hub ➔ Bhosari ➔ Khadki ➔ Shivajinagar ➔ Swargate", { x: 0.8, y: 1.6, w: 11, h: 0.8, fontName: 'Segoe UI', fontSize: 16, color: colors.purpleLine, bold: true });
slide3.addText("🩵 LINE 2 (AQUA LINE)\nVanaz Depot ➔ Nal Stop ➔ Garware College ➔ Pune Station ➔ Kalyani Nagar ➔ Ramwadi Terminal", { x: 0.8, y: 2.8, w: 11, h: 0.8, fontName: 'Segoe UI', fontSize: 16, color: colors.aquaLine, bold: true });

slide3.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 4.2, w: 11.2, h: 2.2, fill: { color: 'FFFFFF', alpha: 96 }, line: { color: colors.textMuted, width: 1 } });
slide3.addText("🔄 THE HEART: DISTRICT COURT INTERCHANGE", { x: 1.1, y: 4.5, w: 10.5, h: 0.4, fontName: 'Segoe UI', fontSize: 18, bold: true, color: colors.textWhite });
slide3.addText("Both lines intersect at a centralized graph hub matrix. This structure forces Dijkstra's path calculation algorithm to automatically route commuters across line changes, dynamically computing complex physical cross-platform journeys throughout the city map.", {
    x: 1.1, y: 5.0, w: 10.5, h: 1.2, fontName: 'Segoe UI', fontSize: 15, color: colors.textMuted, lineSpacing: 22
});

// ==========================================
// SLIDE 4: PUBLIC COMMUTER PORTAL
// ==========================================
let slide4 = pptx.addSlide();
slide4.background = { fill: colors.bgDark };

slide4.addText("Intelligent Passenger UI Portal", { x: 0.8, y: 0.5, w: 11, h: 0.6, fontName: 'Segoe UI', fontSize: 28, bold: true, color: colors.textWhite });

slide4.addText("• Interactive Dropdown Selections matching live database station rows.\n\n• Automated Vector Processing running Dijkstra's engine in under 2ms.\n\n• Delivers crystal clear output feedback highlighting track distance (KM) and precise duration weights (Mins).", {
    x: 0.8, y: 1.8, w: 5.5, h: 4.0, fontName: 'Segoe UI', fontSize: 16, color: colors.textWhite, lineSpacing: 28
});

// Image Box Wrapper
slide4.addShape(pptx.ShapeType.rect, { x: 6.8, y: 1.8, w: 5.4, h: 4.2, fill: { color: '1A1D29' }, line: { color: colors.blueLine, width: 2 } });
slide4.addText("[ PLACEHOLDER:\nInsert Commuter Route Screenshot Here ]", { x: 6.8, y: 3.5, w: 5.4, h: 1.0, align: 'center', fontName: 'Segoe UI', fontSize: 14, color: colors.textMuted });

// ==========================================
// SLIDE 5: SECURE CENTRAL COMMAND CENTER
// ==========================================
let slide5 = pptx.addSlide();
slide5.background = { fill: colors.bgDark };

slide5.addText("Enterprise Administrative Controls", { x: 0.8, y: 0.5, w: 11, h: 0.6, fontName: 'Segoe UI', fontSize: 28, bold: true, color: colors.textWhite });

slide5.addText("• Isolated Architecture: Control systems reside on a distinct independent web viewport.\n\n• Token Authentication Gate protects backend API systems from unauthorized public data requests.\n\n• Network Kill-Switch Simulator allows control operators to flag tracks as active or blocked with a click.", {
    x: 6.5, y: 1.8, w: 5.8, h: 4.0, fontName: 'Segoe UI', fontSize: 16, color: colors.textWhite, lineSpacing: 28
});

// Image Box Wrapper
slide5.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.8, w: 5.2, h: 4.2, fill: { color: '1A1D29' }, line: { color: colors.purpleLine, width: 2 } });
slide5.addText("[ PLACEHOLDER:\nInsert Admin Control Center Screenshot Here ]", { x: 0.8, y: 3.5, w: 5.2, h: 1.0, align: 'center', fontName: 'Segoe UI', fontSize: 14, color: colors.textMuted });

// ==========================================
// SLIDE 6: LIVE EMERGENCY REROUTING SIMULATION
// ==========================================
let slide6 = pptx.addSlide();
slide6.background = { fill: colors.bgDark };

slide6.addText("Real-Time Emergency Rerouting Flow", { x: 0.8, y: 0.5, w: 11, h: 0.6, fontName: 'Segoe UI', fontSize: 28, bold: true, color: colors.textWhite });

slide6.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.5, w: 5.4, h: 3.0, fill: { color: '1A1D29' }, line: { color: colors.textMuted, width: 1 } });
slide6.addText("[ SCREENSHOT A: Normal Route Choice ]", { x: 0.8, y: 2.8, w: 5.4, h: 0.5, align: 'center', fontName: 'Segoe UI', fontSize: 13, color: colors.textMuted });

slide6.addShape(pptx.ShapeType.rect, { x: 6.8, y: 1.5, w: 5.4, h: 3.0, fill: { color: '1A1D29' }, line: { color: colors.accentRed, width: 1 } });
slide6.addText("[ SCREENSHOT B: Detour After Admin Track Block ]", { x: 6.8, y: 2.8, w: 5.4, h: 0.5, align: 'center', fontName: 'Segoe UI', fontSize: 13, color: colors.textMuted });

slide6.addText("1. Normal Flow: Engine computes shortest path straight down the main sector line.\n2. Incident Trigger: Admin blocks an active track node, assigning its graph weight value to Infinity (∞).\n3. Immediate Recovery: The very next path request shifts around the blocked track automatically.", {
    x: 0.8, y: 4.8, w: 11.4, h: 1.8, fontName: 'Segoe UI', fontSize: 15, color: colors.textWhite, lineSpacing: 22
});

// ==========================================
// SLIDE 7: WHY THIS MATTERS (REAL-WORLD VALUE)
// ==========================================
let slide7 = pptx.addSlide();
slide7.background = { fill: colors.bgDark };

slide7.addText("Strategic Smart City Impact", { x: 0.8, y: 0.5, w: 11, h: 0.6, fontName: 'Segoe UI', fontSize: 28, bold: true, color: colors.textWhite });

// 3 Horizontal Benefit Pillars
slide7.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 1.8, w: 3.6, h: 4.2, fill: { color: 'FFFFFF', alpha: 96 } });
slide7.addText("⚡ Peak Optimization", { x: 1.0, y: 2.1, w: 3.2, h: 0.4, fontName: 'Segoe UI', fontSize: 16, bold: true, color: colors.aquaLine });
slide7.addText("Prevents dangerous passenger pileups on physical transit platforms by actively recalculating ticket entry paths before tokens are issued.", { x: 1.0, y: 2.7, w: 3.2, h: 3.0, fontName: 'Segoe UI', fontSize: 14, color: colors.textMuted });

slide7.addShape(pptx.ShapeType.roundRect, { x: 4.7, y: 1.8, w: 3.6, h: 4.2, fill: { color: 'FFFFFF', alpha: 96 } });
slide7.addText("🔒 System Security", { x: 4.9, y: 2.1, w: 3.2, h: 0.4, fontName: 'Segoe UI', fontSize: 16, bold: true, color: colors.purpleLine });
slide7.addText("Complete architectural separation between passenger layouts and operational master databases protects critical civic management data channels.", { x: 4.9, y: 2.7, w: 3.2, h: 3.0, fontName: 'Segoe UI', fontSize: 14, color: colors.textMuted });

slide7.addShape(pptx.ShapeType.roundRect, { x: 8.6, y: 1.8, w: 3.6, h: 4.2, fill: { color: 'FFFFFF', alpha: 96 } });
slide7.addText("🚀 True Scalability", { x: 8.8, y: 2.1, w: 3.2, h: 0.4, fontName: 'Segoe UI', fontSize: 16, bold: true, color: colors.textWhite });
slide7.addText("The modular Express API and normalized SQLite database structure allow developers to scale up to hundreds of additional stations smoothly.", { x: 8.8, y: 2.7, w: 3.2, h: 3.0, fontName: 'Segoe UI', fontSize: 14, color: colors.textMuted });

// ==========================================
// SLIDE 8: CONCLUSION
// ==========================================
let slide8 = pptx.addSlide();
slide8.background = { fill: colors.bgDark };

slide8.addText("System Fully Operational.", { x: 1.0, y: 2.5, w: 10, h: 0.8, fontName: 'Montserrat', fontSize: 44, bold: true, color: colors.textWhite });
slide8.addText("TransitPulse Engine is compiled, connected, and running live.", { x: 1.0, y: 3.4, w: 10, h: 0.4, fontName: 'Segoe UI', fontSize: 18, color: colors.aquaLine });
slide8.addText("Thank You! Open for Technical Evaluation & Questions.", { x: 1.0, y: 5.5, w: 10, h: 0.4, fontName: 'Segoe UI', fontSize: 15, color: colors.textMuted });

// Compile and output presentation to disk
pptx.writeFile({ fileName: 'TransitPulse_Presentation.pptx' })
    .then(file => console.log(`\n🎉 SUCCESS! Presentation generated beautifully as: ${file}\n`))
    .catch(err => console.error(err));