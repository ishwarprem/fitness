document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('hero-overlay');
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    const enterBtn = document.getElementById('enter-arena-btn');

    let width, height;
    let particles = [];
    const particleSpacing = 30; // Distance between dots
    const mouseRadius = 300; // Radius of the "flashlight"
    const mouse = { x: -1000, y: -1000 }; // Start off-screen

    // --- Resize Handling ---
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    // --- Particle System ---
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseSize = 2;
            this.opacity = 0;
            this.targetOpacity = 0;
        }

        update() {
            // Calculate distance to mouse
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // "Flashlight" logic
            if (distance < mouseRadius) {
                // Calculate opacity based on distance (closer = brighter)
                // 1 at center, 0 at edge of radius
                this.targetOpacity = 1 - (distance / mouseRadius);
            } else {
                this.targetOpacity = 0;
            }

            // Smooth transition for opacity
            this.opacity += (this.targetOpacity - this.opacity) * 0.1;

            // Clamp opacity
            if (this.opacity < 0) this.opacity = 0;
            if (this.opacity > 1) this.opacity = 1;
        }

        draw() {
            if (this.opacity > 0.01) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 82, 0, ${this.opacity})`; // Neon Orange
                ctx.fill();
            }
        }
    }

    function initParticles() {
        particles = [];
        // Create a grid of particles
        for (let y = 0; y < height; y += particleSpacing) {
            for (let x = 0; x < width; x += particleSpacing) {
                particles.push(new Particle(x, y));
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    // --- Event Listeners ---
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Touch support for mobile
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    });

    enterBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        // Optional: Stop animation after transition to save resources
        setTimeout(() => {
            // We could stop the loop here if we wanted, but keeping it running 
            // in background is fine for now unless performance is an issue.
            // For a "High-End" feel, maybe we want to re-enable it if they come back?
            // For now, just hiding it is enough.
        }, 800);
    });

    // --- Initialization ---
    resize();
    animate();
});
