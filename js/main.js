// Section Management
let currentSection = 0;
const sections = [
    'loading-screen',
    'heart-screen',
    'quiz-screen',
    'letter-screen',
    'fireworks-screen',
    'final-screen'
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check for URL parameter to start at a specific section
    const urlParams = new URLSearchParams(window.location.search);
    const startSection = urlParams.get('section');

    if (startSection === 'letter') {
        // Skip loading and go to letter
        document.getElementById('loading-screen').classList.remove('active');
        showSection(3); // 'letter-screen' is index 3 now (0: loading, 1: heart, 2: quiz, 3: letter)
    } else {
        initLoadingScreen();
    }

    initHeartScreen();
    initQuizScreen();
    initLetterScreen();
    initFireworksScreen();
});

// Section Navigation
function showSection(index) {
    if (index < 0 || index >= sections.length) return;

    const current = document.getElementById(sections[currentSection]);
    const next = document.getElementById(sections[index]);

    if (current) {
        current.classList.remove('active');
    }

    setTimeout(() => {
        if (next) {
            next.classList.add('active');
            currentSection = index;
        }
    }, 400);
}

// ==================== SECTION 1: LOADING SCREEN ====================
function initLoadingScreen() {
    const loadingTexts = [
        'Loading memories...',
        'Preparing surprises...',
        'Collecting moments...',
        'Wrapping up love...',
        'Almost ready...'
    ];

    const loadingText = document.getElementById('loading-text');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const startButton = document.getElementById('start-button');

    let progress = 0;
    let textIndex = 0;

    const updateLoadingText = () => {
        if (loadingText) {
            loadingText.style.opacity = '0';
            setTimeout(() => {
                loadingText.textContent = loadingTexts[textIndex % loadingTexts.length];
                loadingText.style.opacity = '1';
                textIndex++;
            }, 300);
        }
    };

    const updateProgress = () => {
        if (progress < 100) {
            progress += Math.random() * 3 + 1;
            if (progress > 100) progress = 100;

            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            if (progressPercentage) {
                progressPercentage.textContent = Math.floor(progress) + '%';
            }

            // Change text every 20%
            if (Math.floor(progress) % 20 === 0 && Math.floor(progress) > 0) {
                updateLoadingText();
            }

            if (progress >= 100) {
                setTimeout(() => {
                    if (startButton) {
                        startButton.style.display = 'block';
                        startButton.style.animation = 'fadeIn 0.5s ease';
                    }
                }, 500);
            } else {
                setTimeout(updateProgress, 100);
            }
        }
    };

    updateProgress();
    updateLoadingText();

    if (startButton) {
        startButton.addEventListener('click', () => {
            showSection(1);
        });
    }
}

// ==================== SECTION 2: HEART INTERACTION ====================
function initHeartScreen() {
    const heart = document.getElementById('interactive-heart');
    const nextButton = document.getElementById('next-heart');
    let clickCount = 0;

    if (heart) {
        heart.addEventListener('click', () => {
            clickCount++;
            heart.classList.add('clicked');
            heart.classList.add('glow');

            setTimeout(() => {
                heart.classList.remove('clicked');
            }, 600);

            if (clickCount >= 3 && nextButton) {
                nextButton.style.display = 'block';
                nextButton.style.animation = 'fadeIn 0.5s ease';
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            showSection(2);
        });
    }
}

// ==================== SECTION 3: QUIZ SCREEN ====================
function initQuizScreen() {
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quiz-feedback');
    const nextButton = document.getElementById('next-quiz');
    let answered = false;

    const feedbackMessages = {
        correct: [
            'Exactly right! You are the most beautiful! ❤️',
            'Perfect answer! You know it! 💕',
            'Absolutely correct! You\'re amazing! 🌹'
        ],
        wrong: [
            'Hmm, try again! 💭',
            'Not quite right, think again! 🤔',
            'Close, but not the answer I\'m looking for! 😊'
        ]
    };

    options.forEach(option => {
        option.addEventListener('click', () => {
            if (answered) return;

            const isCorrect = option.dataset.answer === 'correct';
            answered = true;

            // Disable all options
            options.forEach(opt => {
                opt.style.pointerEvents = 'none';
                if (opt.dataset.answer === 'correct') {
                    opt.classList.add('correct');
                } else if (!isCorrect && opt === option) {
                    opt.classList.add('wrong');
                }
            });

            // Show feedback
            if (feedback) {
                const messages = isCorrect ? feedbackMessages.correct : feedbackMessages.wrong;
                const message = messages[Math.floor(Math.random() * messages.length)];
                feedback.textContent = message;
                feedback.style.opacity = '0';
                setTimeout(() => {
                    feedback.style.opacity = '1';
                }, 100);
            }

            // Show next button only if correct
            if (isCorrect && nextButton) {
                setTimeout(() => {
                    nextButton.style.display = 'block';
                    nextButton.style.animation = 'fadeIn 0.5s ease';
                }, 1000);
            } else if (!isCorrect) {
                // Allow retry after wrong answer
                setTimeout(() => {
                    answered = false;
                    options.forEach(opt => {
                        opt.style.pointerEvents = 'auto';
                        opt.classList.remove('wrong', 'correct');
                    });
                    if (feedback) {
                        feedback.textContent = '';
                    }
                }, 2000);
            }
        });
    });

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            window.location.href = 'timeline/index.html';
        });
    }
}

// ==================== SECTION 4: TIMELINE SCREEN - Interactive Map ====================
// Timeline data moved to timeline/script.js

class RomanticTimelineMap {
    constructor() {
        this.viewport = document.getElementById('timeline-viewport');
        this.mapContainer = document.getElementById('timeline-map-container');
        this.map = document.getElementById('timeline-map');
        this.linesSvg = document.getElementById('timeline-lines-svg');
        this.pinsLayer = document.getElementById('timeline-pins-layer');
        this.nextButton = document.getElementById('next-timeline');

        // Check if all required elements exist
        if (!this.viewport || !this.mapContainer || !this.map || !this.linesSvg || !this.pinsLayer) {
            console.error('Timeline elements not found');
            return;
        }

        this.pos = { x: 0, y: 0 };
        this.startPos = { x: 0, y: 0 };
        this.isDragging = false;
        this.clickedPins = new Set();

        // Hide next button initially
        if (this.nextButton) {
            this.nextButton.style.display = 'none';
        }

        this.init();
    }

    init() {
        this.setupPanning();
        this.renderMilestones();
        this.drawConnections();
        this.setupModal();
        this.centerOnFirst();
        this.setupNoise();
        this.setupNextButton();
    }

    setupPanning() {
        const handleDown = (e) => {
            this.isDragging = true;
            this.startPos = {
                x: (e.clientX || e.touches[0].clientX) - this.pos.x,
                y: (e.clientY || e.touches[0].clientY) - this.pos.y
            };
            if (this.viewport) {
                this.viewport.style.cursor = 'grabbing';
            }
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
            if (this.viewport) {
                this.viewport.style.cursor = 'grab';
            }
        };

        if (this.viewport) {
            this.viewport.addEventListener('mousedown', handleDown);
            this.viewport.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);

            this.viewport.addEventListener('touchstart', handleDown);
            this.viewport.addEventListener('touchmove', handleMove);
            window.addEventListener('touchend', handleUp);
        }
    }

    updateTransform() {
        if (this.mapContainer) {
            this.mapContainer.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
        }
    }

    renderMilestones() {
        if (!this.pinsLayer) return;

        romanticMilestones.forEach(m => {
            const pin = document.createElement('div');
            pin.className = 'timeline-pin';
            pin.style.left = `${m.x}px`;
            pin.style.top = `${m.y}px`;

            pin.innerHTML = `
                <div class="timeline-pin-circle"></div>
                <div class="timeline-pin-label">
                    <span class="timeline-pin-date">${m.date}</span>
                    <span class="timeline-pin-tag">${m.title}</span>
                </div>
            `;

            pin.onclick = (e) => {
                if (this.isDragging) return;
                this.openModal(m);
                this.clickedPins.add(m.id);
                this.checkAllPinsClicked();
            };

            this.pinsLayer.appendChild(pin);
        });
    }

    drawConnections() {
        if (!this.linesSvg) return;

        for (let i = 0; i < romanticMilestones.length - 1; i++) {
            const start = romanticMilestones[i];
            const end = romanticMilestones[i + 1];

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

            // Create curved path
            const dx = end.x - start.x;
            const cp1x = start.x + dx * 0.5;
            const cp1y = start.y;
            const cp2x = start.x + dx * 0.5;
            const cp2y = end.y;

            const d = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;

            path.setAttribute("d", d);
            path.setAttribute("class", "timeline-path-line");

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
        const overlay = document.getElementById('timeline-modal-overlay');
        const icon = document.getElementById('timeline-modal-icon');
        const title = document.getElementById('timeline-modal-title');
        const date = document.getElementById('timeline-modal-date');
        const desc = document.getElementById('timeline-modal-description');

        if (icon) icon.textContent = milestone.icon;
        if (title) title.innerText = milestone.title;
        if (date) date.innerText = milestone.date;
        if (desc) desc.innerText = milestone.description;

        if (overlay) {
            overlay.classList.remove('timeline-modal-hidden');
        }
    }

    setupModal() {
        const overlay = document.getElementById('timeline-modal-overlay');
        const closeBtn = document.getElementById('timeline-close-modal');

        if (closeBtn) {
            closeBtn.onclick = () => {
                if (overlay) overlay.classList.add('timeline-modal-hidden');
            };
        }

        if (overlay) {
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.classList.add('timeline-modal-hidden');
            };
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay) {
                overlay.classList.add('timeline-modal-hidden');
            }
        });
    }

    centerOnFirst() {
        const first = romanticMilestones[0];
        if (first) {
            this.pos.x = -first.x + window.innerWidth / 2;
            this.pos.y = -first.y + window.innerHeight / 2;
            this.updateTransform();
        }
    }

    setupNoise() {
        const canvas = document.getElementById('timeline-noise-overlay');
        if (!canvas) return;

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

        noise();
    }

    checkAllPinsClicked() {
        if (this.clickedPins.size >= romanticMilestones.length && this.nextButton) {
            this.nextButton.style.display = 'block';
            this.nextButton.style.animation = 'fadeIn 0.5s ease';
        }
    }

    setupNextButton() {
        if (this.nextButton && !this.nextButton.hasAttribute('data-initialized')) {
            this.nextButton.setAttribute('data-initialized', 'true');
            this.nextButton.addEventListener('click', () => {
                showSection(4);
            });
        }
    }
}

let timelineMapInstance = null;

// Initialize timeline when section becomes active
function initTimelineScreen() {
    const timelineSection = document.getElementById('timeline-screen');
    if (timelineSection && timelineSection.classList.contains('active')) {
        // Clear existing instance if any
        if (timelineMapInstance) {
            timelineMapInstance = null;
        }

        // Clear the map elements
        const pinsLayer = document.getElementById('timeline-pins-layer');
        const linesSvg = document.getElementById('timeline-lines-svg');
        const nextButton = document.getElementById('next-timeline');

        if (pinsLayer) pinsLayer.innerHTML = '';
        if (linesSvg) linesSvg.innerHTML = '';
        if (nextButton) {
            nextButton.style.display = 'none';
            nextButton.removeAttribute('data-initialized');
        }

        // Create new instance after a short delay to ensure DOM is ready
        setTimeout(() => {
            try {
                timelineMapInstance = new RomanticTimelineMap();
            } catch (error) {
                console.error('Error initializing timeline:', error);
            }
        }, 300);
    }
}

// Set up observer to watch for section activation
const timelineObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const timelineSection = document.getElementById('timeline-screen');
            if (timelineSection && timelineSection.classList.contains('active')) {
                initTimelineScreen();
            } else {
                // Clean up when leaving the section
                const modal = document.getElementById('timeline-modal-overlay');
                if (modal) {
                    modal.classList.add('timeline-modal-hidden');
                }
            }
        }
    });
});

// Initialize observer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const timelineSection = document.getElementById('timeline-screen');
    if (timelineSection) {
        timelineObserver.observe(timelineSection, { attributes: true });
        // Also check if it's already active
        if (timelineSection.classList.contains('active')) {
            initTimelineScreen();
        }
    }
});

// ==================== SECTION 5: LETTER SCREEN ====================
function initLetterScreen() {
    const letterContent = document.getElementById('letter-content');
    const nextButton = document.getElementById('next-letter');

    const letterText = `Meri Priya Madam Ji,

Jaise hi hum is naye varsh mein pravesh kar rahe hain, main aapko yeh batana chahta hoon ki aapke mere jeevan mein hone ke liye main dil se kitna aabhari hoon. Aapke saath bitaaya har pal ek sundar swapn jaisa lagta hai, aur main kabhi bhi us swapn se jaagna nahi chahta. 

Aapki muskaan meri duniya ko ujale se bhar deti hai, aapki hansi meri sabse priya dhun hai, aur aapka prem mere jeevan ka sabse anmol uphaar hai. Pichhle do varsh mere jeevan ki sabse sundar yatra rahe hain, aur main utsukta se pratiksha kar raha hoon ki hum saath milkar anek aur yaadein banaayein. 

Sirf aap hone ke liye, mujhe prem dene ke liye, aur har din ko itna vishesh banaane ke liye main aapka hriday se dhanyavaad karta hoon. Aaiye, ek aur varsh ka swaagat karein — romaanch, hansi aur ek-doosre ke saath anant prem ke naam.

Sadaiv aapka,
For our endless love ❤️`;

    if (letterContent) {
        let index = 0;
        const typingSpeed = 30;

        const typeLetter = () => {
            if (index < letterText.length) {
                letterContent.textContent = letterText.substring(0, index + 1);
                letterContent.innerHTML += '<span class="typing-cursor"></span>';
                index++;
                setTimeout(typeLetter, typingSpeed);
            } else {
                letterContent.innerHTML = letterText;
                if (nextButton) {
                    setTimeout(() => {
                        nextButton.style.display = 'block';
                        nextButton.style.animation = 'fadeIn 0.5s ease';
                    }, 500);
                }
            }
        };

        // Start typing when section becomes active
        const letterObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const letterSection = document.getElementById('letter-screen');
                    if (letterSection && letterSection.classList.contains('active')) {
                        letterContent.textContent = '';
                        index = 0;
                        setTimeout(typeLetter, 500);
                    }
                }
            });
        });

        const letterSection = document.getElementById('letter-screen');
        if (letterSection) {
            letterObserver.observe(letterSection, { attributes: true });
        }
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            showSection(4);
        });
    }
}

// ==================== SECTION 6: FIREWORKS SCREEN ====================
function initFireworksScreen() {
    const canvas = document.getElementById('fireworks-canvas');
    const triggerButton = document.getElementById('fireworks-trigger');
    const fireworksText = document.getElementById('fireworks-text');
    const nextButton = document.getElementById('next-fireworks');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = [];
    let particles = [];
    let animationId = null;

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.015;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.2; // gravity
            this.life -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Firework {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.distance = Math.sqrt(
                Math.pow(targetX - x, 2) + Math.pow(targetY - y, 2)
            );
            this.speed = 5;
            this.angle = Math.atan2(targetY - y, targetX - x);
            this.traveled = 0;
            this.exploded = false;
            this.color = `hsl(${Math.random() * 60 + 330}, 100%, ${Math.random() * 30 + 60}%)`;
        }

        update() {
            if (!this.exploded) {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                this.traveled += this.speed;

                if (this.traveled >= this.distance) {
                    this.explode();
                }
            }
        }

        explode() {
            this.exploded = true;
            const particleCount = 50;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(this.x, this.y, this.color));
            }
        }

        draw() {
            if (!this.exploded) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function createFirework() {
        const startX = canvas.width / 2;
        const startY = canvas.height;
        const targetX = Math.random() * canvas.width;
        const targetY = Math.random() * (canvas.height / 2) + 50;

        fireworks.push(new Firework(startX, startY, targetX, targetY));
    }

    function animate() {
        ctx.fillStyle = 'rgba(26, 10, 26, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            if (fireworks[i].exploded) {
                fireworks.splice(i, 1);
            }
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }

        // Create new firework occasionally
        if (Math.random() < 0.05 && fireworks.length < 3) {
            createFirework();
        }

        animationId = requestAnimationFrame(animate);
    }

    function startFireworks() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        fireworks = [];
        particles = [];

        // Create initial burst
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createFirework();
            }, i * 200);
        }

        animate();

        // Show text after a moment
        setTimeout(() => {
            if (fireworksText) {
                fireworksText.style.display = 'block';
                fireworksText.style.animation = 'fadeIn 1s ease';
            }
            if (nextButton) {
                setTimeout(() => {
                    nextButton.style.display = 'block';
                    nextButton.style.animation = 'fadeIn 0.5s ease';
                }, 2000);
            }
        }, 1000);
    }

    if (triggerButton) {
        triggerButton.addEventListener('click', () => {
            triggerButton.style.display = 'none';
            startFireworks();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            showSection(5);
        });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

