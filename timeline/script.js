const milestones = [
    {
        id: 1,
        x: 300,
        y: 400,
        title: "The First Spark",
        date: "Month 1",
        description: "The moment our worlds collided. A single look that changed everything forever.",
        image: "../image/month1.jpg"
    },
    {
        id: 2,
        x: 800,
        y: 300,
        title: "Whispers in the Wind",
        date: "Month 2",
        description: "Late night conversations and the sweet discovery of everything we share.",
        image: "../image/month2.jpg"
    },
    {
        id: 3,
        x: 1300,
        y: 600,
        title: "Colors of Us",
        date: "Month 3",
        description: "Life started feeling more vibrant, painted with the beautiful colors of your love.",
        image: "../image/month3.jpg"
    },
    {
        id: 4,
        x: 1800,
        y: 400,
        title: "Midnight Magic",
        date: "Month 4",
        description: "Under the silver moon, every moment felt like a scene from a beautiful movie.",
        image: "../image/month4.jpg"
    },
    {
        id: 5,
        x: 2300,
        y: 700,
        title: "Eternal Bond",
        date: "Month 5",
        description: "Finding a home in your heart. A connection that keeps growing stronger every day.",
        image: "../image/month5.jpg"
    },
    {
        id: 6,
        x: 2800,
        y: 450,
        title: "Heartbeat Symphony",
        date: "Month 6",
        description: "Our hearts beating in perfect rhythm. The sweetest melody I've ever known.",
        image: "../image/month6.jpg"
    },
    {
        id: 7,
        x: 2900,
        y: 1000,
        title: "Summer Glow",
        date: "Month 7",
        description: "Sunshine and laughter. Every day with you feels like a warm summer afternoon.",
        image: "../image/month7.jpg"
    },
    {
        id: 8,
        x: 2400,
        y: 1300,
        title: "Golden Memories",
        date: "Month 8",
        description: "Cherishing every second. These are the moments I'll keep in my heart forever.",
        image: "../image/month8.jpg"
    },
    {
        id: 9,
        x: 1900,
        y: 1000,
        title: "Starlight Dreams",
        date: "Month 9",
        description: "Dreaming of a future together, guided by the light of our love.",
        image: "../image/month9.jpg"
    },
    {
        id: 10,
        x: 1400,
        y: 1300,
        title: "Autumn Leaves",
        date: "Month 10",
        description: "As the world changes colors, my love for you only deepens and grows.",
        image: "../image/month10.jpg"
    },
    {
        id: 11,
        x: 900,
        y: 1100,
        title: "Cozy Nights",
        date: "Month 11",
        description: "Finding warmth in your embrace on the coldest of nights.",
        image: "../image/month11.jpg"
    },
    {
        id: 12,
        x: 400,
        y: 1400,
        title: "Winter Wonderland",
        date: "Month 12",
        description: "Magic in the air and love in our hearts. The perfect end to a beautiful year.",
        image: "../image/month12.jpg"
    },
    {
        id: 13,
        x: 800,
        y: 1800,
        title: "A New Year, Same Love",
        date: "Month 13",
        description: "Stepping into a new chapter, hand in hand with my favorite person.",
        image: "../image/month13.jpg"
    },
    {
        id: 14,
        x: 1400,
        y: 1600,
        title: "Eternal Promise",
        date: "Month 14",
        description: "A promise to love you more with every passing second.",
        image: "../image/month14.jpg"
    },
    {
        id: 15,
        x: 2000,
        y: 1900,
        title: "Beyond the Horizon",
        date: "Month 15",
        description: "Exploring the unknown, knowing that as long as I'm with you, I'm home.",
        image: "../image/month15.jpg"
    },
    {
        id: 16,
        x: 2700,
        y: 1700,
        title: "Our Infinite Journey",
        date: "Month 16",
        description: "Every end is just a new beginning. I love you to the moon and back.",
        image: "../image/month16.jpg"
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
        date.innerText = milestone.date;
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
