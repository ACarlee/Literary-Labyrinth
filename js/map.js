document.addEventListener("DOMContentLoaded", () => {
    MapManager.drawMap(); // Draw the initial map when the game loads
});

const MapManager = {
    pathCoordinates: [
        { x: 200, y: 650, ch: "chapter1", label: "Start", image: "images/x-marker.png", revealed: true },
        { x: 360, y: 550, ch: "chapter2", label: "Lady of Bath", image: "images/handmirror.png", revealed: false },
        { x: 90, y: 530, ch: "chapter3", label: "Queen Mariam", image: "images/crown.png", revealed: false },
        { x: 320, y: 400, ch: "chapter4", label: "Green Knight", image: "images/green-knight.png", revealed: false },
        { x: 75, y: 350, ch: "chapter5", label: "Houyhnhnmas", image: "images/horse.png", revealed: false },
        { x: 240, y: 260, ch: "chapter6", label: "Eve", image: "images/apple.png", revealed: false },
        { x: 400, y: 150, ch: "chapter7", label: "Fautus", image: "images/book-flame.png", revealed: false },
        { x: 50, y: 200, ch: "chapter8", label: "A Utopia", image: "images/floating-island.png", revealed: false },
        { x: 300, y: 10, ch: "chapter9", label: "Tempest", image: "images/storm.png", revealed: false },
        { x: 100, y: 50, ch: "chapter10", label: "A Blazing World", image: "images/blazing-world.png", revealed: false },
    ],

    getCoordinates() {
        return this.pathCoordinates;
    },

    revealChapter(chapter) {
        const chapterIndex = this.pathCoordinates.findIndex(coord => coord.ch === chapter);
        if (chapterIndex !== -1) {
            this.pathCoordinates[chapterIndex].revealed = true;
            this.drawMap();
        } else {
            console.error("Chapter not found in pathCoordinates.");
        }
    },

    drawMap() {
        const svg = document.getElementById("game-map");
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        this.pathCoordinates.forEach(({ x, y, label, image, revealed }) => {
            if (revealed) {
                const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
                img.setAttribute("href", image);
                img.setAttribute("x", x);
                img.setAttribute("y", y);
                img.setAttribute("width", 75);
                img.setAttribute("height", 75);
                svg.appendChild(img);

                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", x + 35);
                text.setAttribute("y", y + 90);
                text.setAttribute("text-anchor", "middle");
                text.textContent = label;
                svg.appendChild(text);
            }
        });

        let lastRevealed = null; // To track the last revealed coordinate
        this.pathCoordinates.forEach(({ x, y, revealed }) => {
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
    },
};