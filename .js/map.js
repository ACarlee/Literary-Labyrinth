document.addEventListener("DOMContentLoaded", () => {
    const svg = document.getElementById("game-map");

    // Path coordinates for the map
    const pathCoordinates = [
        { x: 200, y: 650, label: "Start", image: "images/x-marker.png", revealed: true }, 
        { x: 360, y: 550, label: "Lady of Bath", image: "images/handmirror.png", revealed: false }, 
        { x: 90, y: 530, label: "Queen Mariam", image: "images/crown.png", revealed: false }, 
        { x: 320, y: 400, label: "Green Knight", image: "images/green-knight.png", revealed: false },
        { x: 75, y: 350, label: "Houyhnhnmas", image: "images/horse.png", revealed: false }, 
        { x: 240, y: 260, label: "Eve", image: "images/apple.png", revealed: false }, 
        { x: 400, y: 150, label: "Fautus", image: "images/book-flame.png", revealed: false }, 
        { x: 50, y: 200, label: "A Utopia", image: "images/floating-island.png", revealed: false }, 
        { x: 300, y: 10, label: "Tempest", image: "images/storm.png", revealed: false }, 
        { x: 100, y: 50, label: "A Blazing World", image: "images/blazing-world.png", revealed: false }, 
    ];

    // Function to draw the map
    function drawMap() {
        // Clear the SVG before redrawing
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // Add revealed symbols and labels
        pathCoordinates.forEach(({ x, y, label, image, revealed }) => {
            if (revealed) {
                // Add the image for the location
                const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
                img.setAttribute("href", image);
                img.setAttribute("x", x);
                img.setAttribute("y", y);
                img.setAttribute("width", 75);
                img.setAttribute("height", 75);
                svg.appendChild(img);

                // Add the text label below the image
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", x + 35);
                text.setAttribute("y", y + 90);
                text.setAttribute("text-anchor", "middle");
                text.textContent = label;
                svg.appendChild(text);
            }
        });
    
    // Add a dotted line between revealed symbols
    let lastRevealed = null; // To track the last revealed coordinate

    pathCoordinates.forEach(({ x, y, revealed }) => {
        if (revealed) {
            if (lastRevealed) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", lastRevealed.x + 35);
                line.setAttribute("y1", lastRevealed.y + 40);
                line.setAttribute("x2", x + 35);
                line.setAttribute("y2", y + 40);
                line.setAttribute("stroke", "black");
                line.setAttribute("stroke-dasharray", "5,5"); // Dashed line style
                line.setAttribute("stroke-width", "2");
                svg.appendChild(line);
            }
            lastRevealed = { x, y }; // Update the last revealed coordinate
        }
    });

    }

    // Function to reveal a new location
    function revealLocation(index) {
        if (index >= 0 && index < pathCoordinates.length) {
            pathCoordinates[index].revealed = true;
            drawMap(); // Redraw the map after updating
        } else {
            console.error("Invalid location index:", index);
        }
    }

    // Initial draw
    drawMap();
});
