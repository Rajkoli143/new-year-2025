const milestones = [
    {
        id: 1,
        x: 400,
        y: 300,
        title: "The Beginning",
        date: "JAN 1, 2024",
        day: "Monday",
        description: "Where it all started. The first step into the unknown. A day full of hope and excitement for the journey ahead.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 2,
        x: 800,
        y: 600,
        title: "Coastal Escape",
        date: "MAR 12, 2024",
        day: "Tuesday",
        description: "Finding peace by the ocean. The sound of waves and the salty breeze helped clear my mind.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 3,
        x: 1200,
        y: 400,
        title: "Mountain Heights",
        date: "MAY 20, 2024",
        day: "Monday",
        description: "Reaching the summit after a long climb. The view from the top made every drop of sweat worth it.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 4,
        x: 1600,
        y: 800,
        title: "Urban Rhythms",
        date: "JUL 05, 2024",
        day: "Friday",
        description: "Lost in the neon lights of the city. A night of music, laughter, and unexpected friendships.",
        image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 5,
        x: 2100,
        y: 500,
        title: "Golden Hour",
        date: "SEP 18, 2024",
        day: "Wednesday",
        description: "Sitting in a quiet park as the sun set. Everything was painted in gold for a few magical moments.",
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 6,
        x: 2600,
        y: 900,
        title: "Winter's Embrace",
        date: "DEC 15, 2024",
        day: "Sunday",
        description: "The first snow of the year. The world turned silent and white, signaling the end of one chapter and the start of another.",
        image: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?auto=format&fit=crop&q=80&w=1000"
    }
];

class MemoryMap {
    constructor() {
        this.viewport = document.getElementById('viewport');
        this.mapContainer = document.getElementById('map-container');
        this.map = document.getElementById('map');
        this.linesSvg = document.getElementById('lines-svg');
        this.pinsLayer = document.getElementById('pins-layer');

        this.pos = { x: 0, y: 0 };
        this.startPos = { x: 0, y: 0 };
        this.isDragging = false;
        this.clickedPins = new Set();
        this.nextButton = document.getElementById('next-page');

        this.init();
    }

    init() {
        this.setupPanning();
        this.renderBackgroundElements();
        this.renderMilestones();
        this.drawConnections();
        this.setupModal();
        this.centerOnFirst();
        this.setupNoise();
        this.setupNextButton();

        // Hide loader after initial render
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
            }, 800);
        }, 1500);
    }

    setupPanning() {
        const handleDown = (e) => {
            this.isDragging = true;
            this.startPos = {
                x: (e.clientX || e.touches[0].clientX) - this.pos.x,
                y: (e.clientY || e.touches[0].clientY) - this.pos.y
            };
            this.viewport.style.cursor = 'grabbing';
        };

        const handleMove = (e) => {
            if (!this.isDragging) return;
            e.preventDefault();

            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            this.pos.x = clientX - this.startPos.x;
            this.pos.y = clientY - this.startPos.y;

            // Constraints
            const minX = window.innerWidth - 3000;
            const minY = window.innerHeight - 2000;
            this.pos.x = Math.max(minX, Math.min(0, this.pos.x));
            this.pos.y = Math.max(minY, Math.min(0, this.pos.y));

            this.updateTransform();
        };

        const handleUp = () => {
            this.isDragging = false;
            this.viewport.style.cursor = 'grab';
        };

        this.viewport.addEventListener('mousedown', handleDown);
        this.viewport.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);

        this.viewport.addEventListener('touchstart', handleDown);
        this.viewport.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleUp);
    }

    updateTransform() {
        this.mapContainer.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
    }

    renderBackgroundElements() {
        const decorLayer = document.createElement('div');
        decorLayer.id = 'decor-layer';
        decorLayer.style.position = 'absolute';
        decorLayer.style.top = '0';
        decorLayer.style.left = '0';
        decorLayer.style.width = '100%';
        decorLayer.style.height = '100%';
        decorLayer.style.pointerEvents = 'none';
        decorLayer.style.zIndex = '0';
        this.map.appendChild(decorLayer);

        const counts = { heart: 40, star: 80 };
        const emojis = { heart: ['❤️', '💖', '💕', '💗', '💓'], star: ['✨', '⭐', '🌟'] };

        for (const [type, count] of Object.entries(counts)) {
            for (let i = 0; i < count; i++) {
                const el = document.createElement('div');
                el.className = `decor-item ${type}`;
                const emojiList = emojis[type];
                el.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];

                const x = Math.random() * 3000;
                const y = Math.random() * 2000;
                const size = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                const duration = Math.random() * 3 + 2;

                el.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    font-size: ${size}px;
                    opacity: ${Math.random() * 0.3 + 0.1};
                    animation: float ${duration}s ease-in-out ${delay}s infinite;
                `;
                decorLayer.appendChild(el);
            }
        }
    }

    renderMilestones() {
        milestones.forEach(m => {
            const pin = document.createElement('div');
            pin.className = 'pin';
            pin.style.left = `${m.x}px`;
            pin.style.top = `${m.y}px`;

            pin.innerHTML = `
                <div class="pin-circle"></div>
                <div class="pin-label">
                    <span class="pin-date">${m.date}</span>
                    <span class="pin-tag">${m.title}</span>
                </div>
            `;

            pin.onclick = (e) => {
                if (this.isDragging) return;
                this.openModal(m);
                this.clickedPins.add(m.id);
                this.checkProgress();
            };

            this.pinsLayer.appendChild(pin);
        });
    }

    drawConnections() {
        for (let i = 0; i < milestones.length - 1; i++) {
            const start = milestones[i];
            const end = milestones[i + 1];

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

            // Create curved path
            const dx = end.x - start.x;
            const cp1x = start.x + dx * 0.5;
            const cp1y = start.y;
            const cp2x = start.x + dx * 0.5;
            const cp2y = end.y;

            const d = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;

            path.setAttribute("d", d);
            path.setAttribute("class", "path-line");

            this.linesSvg.appendChild(path);

            // Animate path drawing
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;

            setTimeout(() => {
                path.style.transition = `stroke-dashoffset 2s ease-in-out ${i * 0.5}s, opacity 0.5s`;
                path.style.strokeDashoffset = 0;
            }, 100);
        }
    }

    openModal(milestone) {
        const overlay = document.getElementById('modal-overlay');
        const img = document.getElementById('modal-image');
        const title = document.getElementById('modal-title');
        const date = document.getElementById('modal-date');
        const desc = document.getElementById('modal-description');

        img.src = milestone.image;
        title.innerText = milestone.title;
        date.innerText = `${milestone.date} • ${milestone.day}`;
        desc.innerText = milestone.description;

        overlay.classList.remove('hidden');
    }

    setupModal() {
        const overlay = document.getElementById('modal-overlay');
        const closeBtn = document.getElementById('close-modal');

        closeBtn.onclick = () => overlay.classList.add('hidden');
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.classList.add('hidden');
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') overlay.classList.add('hidden');
        });
    }

    centerOnFirst() {
        const first = milestones[0];
        this.pos.x = -first.x + window.innerWidth / 2;
        this.pos.y = -first.y + window.innerHeight / 2;
        this.updateTransform();
    }

    setupNoise() {
        const canvas = document.getElementById('noise-overlay');
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const noise = () => {
            const idata = ctx.createImageData(canvas.width, canvas.height);
            const buffer32 = new Uint32Array(idata.data.buffer);
            for (let i = 0; i < buffer32.length; i++) {
                if (Math.random() < 0.5) buffer32[i] = 0xff000000;
            }
            ctx.putImageData(idata, 0, 0);
        };

        // Static noise for better performance
        noise();
    }
    checkProgress() {
        if (this.clickedPins.size >= milestones.length && this.nextButton) {
            this.nextButton.style.display = 'block';
            this.nextButton.style.animation = 'fadeIn 0.5s ease';
        }
    }

    setupNextButton() {
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                window.location.href = '../index.html?section=letter';
            });
        }
    }
}

window.onload = () => {
    new MemoryMap();
};
