class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
        this.radius = Math.random() * 50 + 20;
        this.originalX = this.x;
        this.originalY = this.y;
    }

    update(mouseX, mouseY) {
        // Edge collision with bounce
        if (this.x <= 0 || this.x >= this.canvas.width) {
            this.speedX *= -1;
            this.x = this.x <= 0 ? 0 : this.canvas.width;
        }
        if (this.y <= 0 || this.y >= this.canvas.height) {
            this.speedY *= -1;
            this.y = this.y <= 0 ? 0 : this.canvas.height;
        }

        // Mouse interaction with smoother repulsion
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);
            this.speedX -= Math.cos(angle) * force * 0.3;
            this.speedY -= Math.sin(angle) * force * 0.3;
        }

        // Add circular motion
        this.angle += this.angleSpeed;
        this.x = this.originalX + Math.cos(this.angle) * this.radius;
        this.y = this.originalY + Math.sin(this.angle) * this.radius;

        // Update original position with drift
        this.originalX += this.speedX;
        this.originalY += this.speedY;

        // Smooth acceleration/deceleration
        this.speedX *= 0.99;
        this.speedY *= 0.99;

        // Random direction changes
        if (Math.random() < 0.01) {
            this.speedX += (Math.random() - 0.5) * 0.2;
            this.speedY += (Math.random() - 0.5) * 0.2;
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(74, 144, 226, ${this.opacity})`;
        this.ctx.fill();
    }
}

class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Create more particles
        for (let i = 0; i < 150; i++) {
            this.particles.push(new Particle(this.canvas));
        }

        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        // Clear canvas with slight fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouseX, this.mouseY);
            particle.draw();
        });

        // Request next frame
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the particle background
new ParticleBackground(); 