class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.originalX = this.x;
        this.originalY = this.y;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = 0.01 + Math.random() * 0.02;
        this.oscillationRadius = Math.random() * 2 + 1;
    }

    update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
            const angle = Math.atan2(dy, dx);
            const force = (150 - distance) / 150;
            this.x -= Math.cos(angle) * force * 3;
            this.y -= Math.sin(angle) * force * 3;
        } else {
            // Return to original position with smooth easing
            this.x += (this.originalX - this.x) * 0.03;
            this.y += (this.originalY - this.y) * 0.03;
        }

        // Add subtle floating motion
        this.angle += this.velocity;
        this.x += Math.sin(this.angle) * this.oscillationRadius * 0.1;
        this.y += Math.cos(this.angle) * this.oscillationRadius * 0.1;

        // Keep particles within canvas with smooth bouncing
        if (this.x < 0 || this.x > this.canvas.width) {
            this.speedX *= -0.8;
            this.x = this.x < 0 ? 0 : this.canvas.width;
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.speedY *= -0.8;
            this.y = this.y < 0 ? 0 : this.canvas.height;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isActive = false;
        this.lastTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        this.frameDelta = 0;

        this.init();
        this.addEventListeners();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.animate(0);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        // Increase particle density for a more immersive effect
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    animate(currentTime) {
        if (this.lastTime === 0) {
            this.lastTime = currentTime;
        }
        
        this.frameDelta = currentTime - this.lastTime;
        
        if (this.frameDelta > this.frameInterval) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                particle.update(this.mouseX, this.mouseY);
                particle.draw(this.ctx);
            });
            
            this.lastTime = currentTime - (this.frameDelta % this.frameInterval);
        }
        
        requestAnimationFrame((time) => this.animate(time));
    }

    addEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Add parallax effect to title and subtitle
            this.updateTextParallax(e.clientX, e.clientY);
        });

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        // Add touch support
        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.mouseX = e.touches[0].clientX;
            this.mouseY = e.touches[0].clientY;
            
            // Add parallax effect to title and subtitle for touch
            this.updateTextParallax(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        
        // Add scroll-based parallax effect
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            this.particles.forEach(particle => {
                particle.originalY += scrollPosition * 0.05;
            });
        });
    }
    
    updateTextParallax(mouseX, mouseY) {
        const title = document.querySelector('.title');
        const subtitle = document.querySelector('.subtitle');
        
        if (title && subtitle) {
            // Calculate the center of the viewport
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Calculate the distance from the center (normalized to -1 to 1)
            const moveX = (mouseX - centerX) / centerX;
            const moveY = (mouseY - centerY) / centerY;
            
            // Apply subtle movement to title and subtitle
            title.style.transform = `translateY(0) translateX(${moveX * 10}px)`;
            subtitle.style.transform = `translateY(0) translateX(${moveX * 5}px)`;
            
            // Add subtle color shift based on mouse position
            const hue = (moveX + 1) * 30; // Range from 0 to 60
            title.style.textShadow = `0 0 10px hsla(${hue}, 70%, 70%, 0.3)`;
        }
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
    
    // Add hover effect to title
    const title = document.querySelector('.title');
    if (title) {
        title.addEventListener('mouseenter', () => {
            title.style.transform = 'scale(1.05)';
            title.style.transition = 'transform 0.3s ease';
        });
        
        title.addEventListener('mouseleave', () => {
            title.style.transform = 'scale(1)';
        });
    }
    
    // Add hover effect to subtitle
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        subtitle.addEventListener('mouseenter', () => {
            subtitle.style.color = 'var(--accent-color)';
            subtitle.style.transition = 'color 0.3s ease';
        });
        
        subtitle.addEventListener('mouseleave', () => {
            subtitle.style.color = 'var(--subtitle-color)';
        });
    }
}); 