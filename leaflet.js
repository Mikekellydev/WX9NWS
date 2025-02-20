// Initialize the map inside the map container
var map = L.map('map', {
    maxBounds: [
        [85, -180],  // Top-left corner of the world
        [-85, 180]   // Bottom-right corner of the world
    ],
    maxBoundsViscosity: 1.0 // Prevent dragging outside the world bounds
}).setView([40.7128, -74.0060], 6);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add a scale control
L.control.scale({ position: "bottomleft", metric: true, imperial: true }).addTo(map);

// Resize map when window size changes
window.addEventListener("resize", function () {
    setTimeout(() => {
        map.invalidateSize(); // Forces the map to re-render properly
    }, 200);
});

// Sample Skywarn Reports
const reports = [
    { lat: 40.7128, lon: -74.0060, type: "Tornado", description: "Funnel cloud spotted!" },
    { lat: 39.0997, lon: -94.5786, type: "Hail", description: "Quarter-sized hail reported." }
];

// Function to add reports to the map
function addReportMarker(lat, lon, type, description) {
    L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<b>${type}</b><br>${description}`);
}

// Load initial reports
reports.forEach(report => {
    addReportMarker(report.lat, report.lon, report.type, report.description);
});

// Handle new Skywarn report submissions
document.getElementById("report-form").addEventListener("submit", function (event) {
    event.preventDefault();
    
    const locationInput = document.getElementById("report-location").value.split(",");
    const type = document.getElementById("report-type").value;
    const description = document.getElementById("report-description").value;

    if (locationInput.length !== 2) {
        alert("Please enter a valid location (latitude, longitude).");
        return;
    }

    const lat = parseFloat(locationInput[0].trim());
    const lon = parseFloat(locationInput[1].trim());

    if (isNaN(lat) || isNaN(lon)) {
        alert("Invalid latitude or longitude.");
        return;
    }

    addReportMarker(lat, lon, type, description);
});
