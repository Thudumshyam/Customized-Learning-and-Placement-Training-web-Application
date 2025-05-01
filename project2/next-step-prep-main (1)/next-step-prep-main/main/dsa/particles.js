class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update(mouse) {
        // Edge collision
        if (this.x <= 0 || this.x >= this.canvas.width) this.speedX *= -1;
        if (this.y <= 0 || this.y >= this.canvas.height) this.speedY *= -1;

        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                const angle = Math.atan2(dy, dx);
                this.speedX -= Math.cos(angle) * force * 0.1;
                this.speedY -= Math.sin(angle) * force * 0.1;
            }
        }

        // Update position
        this.x += this.speedX;
        this.y += this.speedY;

        // Friction
        this.speedX *= 0.99;
        this.speedY *= 0.99;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(74, 144, 226, ${this.opacity})`;
        this.ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.animationFrameId = null;

        this.init();
    }

    init() {
        // Set canvas size
        this.resizeCanvas();
        
        // Create particles
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.canvas));
        }

        // Event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Start animation
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        // Clear canvas with slight fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw();
        });

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem();
}); 