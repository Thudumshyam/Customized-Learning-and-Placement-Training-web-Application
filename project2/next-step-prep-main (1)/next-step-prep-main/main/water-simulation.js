class WaterSimulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        canvas.width = this.width;
        canvas.height = this.height;
        
        // Simulation parameters
        this.particles = [];
        this.waves = [];
        this.springStiffness = 100;
        this.springDamping = 12;
        this.maxParticles = 200;
        this.waveCount = 3;
        
        // Initialize
        this.init();
    }

    init() {
        // Create multiple waves
        for (let i = 0; i < this.waveCount; i++) {
            this.createWave(i);
        }
        
        // Set up animation loop
        this.animate();
    }

    createWave(index) {
        const wave = {
            points: [],
            velocity: 0,
            amplitude: 0,
            targetAmplitude: this.height * (0.3 + index * 0.1),
            frequency: 0.02 + index * 0.005,
            phase: index * Math.PI / 2,
            offset: index * 100
        };

        // Initialize wave points with higher density
        for (let x = 0; x <= this.width; x += 1) {
            wave.points.push({
                x,
                y: this.height,
                vy: 0
            });
        }

        this.waves.push(wave);
    }

    updateWave(wave) {
        // Spring physics with enhanced dynamics
        const force = (wave.targetAmplitude - wave.amplitude) * this.springStiffness;
        const damping = wave.velocity * this.springDamping;
        wave.velocity += (force - damping) * 0.016;
        wave.amplitude += wave.velocity * 0.016;
        wave.phase += 0.02;

        // Update points with enhanced wave motion
        wave.points.forEach((point, i) => {
            const angle = (point.x + wave.offset) * wave.frequency + wave.phase;
            const targetY = this.height - Math.sin(angle) * wave.amplitude;
            
            // Enhanced spring physics
            const pointForce = (targetY - point.y) * this.springStiffness;
            const pointDamping = point.vy * this.springDamping;
            point.vy += (pointForce - pointDamping) * 0.016;
            point.y += point.vy * 0.016;

            // Create foam particles with enhanced conditions
            if (Math.abs(point.y - targetY) < 3 && this.particles.length < this.maxParticles) {
                this.createFoamParticle(point.x, point.y);
            }
        });
    }

    createFoamParticle(x, y) {
        this.particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 3,
            size: Math.random() * 5 + 2,
            life: Math.random() * 400 + 300,
            opacity: 1
        });
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08; // Reduced gravity for more floaty effect
            p.life -= 16;
            p.opacity = p.life / 400;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw waves with enhanced rendering
        this.waves.forEach((wave, index) => {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.height);
            
            wave.points.forEach((point, i) => {
                if (i === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            
            this.ctx.lineTo(this.width, this.height);
            this.ctx.closePath();

            // Enhanced gradient with multiple color stops
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, `rgba(74, 144, 226, ${0.9 - index * 0.2})`);
            gradient.addColorStop(0.3, `rgba(74, 144, 226, ${0.7 - index * 0.15})`);
            gradient.addColorStop(0.6, `rgba(74, 144, 226, ${0.5 - index * 0.1})`);
            gradient.addColorStop(1, `rgba(0, 0, 0, ${0.8 - index * 0.1})`);

            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });

        // Draw particles with enhanced rendering
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            this.ctx.fill();
        });
    }

    animate() {
        this.waves.forEach(wave => this.updateWave(wave));
        this.updateParticles();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
} 