/**
 * Falling Rose Petals Canvas Engine
 * Ultra-smooth 3D fluttering petals with wind physics
 */

class PetalEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.petals = [];
        this.maxPetals = 45;
        this.wind = 0;
        this.targetWind = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isRunning = false;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Wind reaction on cursor or touch movement
        window.addEventListener('mousemove', (e) => {
            this.targetWind = (e.clientX / window.innerWidth - 0.5) * 2.5;
        });
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.targetWind = (e.touches[0].clientX / window.innerWidth - 0.5) * 2.5;
            }
        });

        // Initialize petals
        for (let i = 0; i < this.maxPetals; i++) {
            this.petals.push(this.createPetal(true));
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createPetal(randomY = false) {
        const colors = [
            { r: 255, g: 75, b: 110, light: '#ff85a1', dark: '#d90429' },   // Crimson / Rose
            { r: 255, g: 105, b: 145, light: '#ffb3c1', dark: '#ef233c' },  // Deep Blush
            { r: 255, g: 154, b: 162, light: '#ffccd5', dark: '#e63946' },  // Soft Petal Pink
            { r: 247, g: 37, b: 133, light: '#f72585', dark: '#7209b7' },   // Romantic Magenta
            { r: 255, g: 182, b: 193, light: '#fff0f3', dark: '#fb6f92' }   // Sakura Pink
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        return {
            x: Math.random() * this.canvas.width,
            y: randomY ? Math.random() * this.canvas.height : -30 - Math.random() * 50,
            size: 14 + Math.random() * 16,
            speedY: 1.0 + Math.random() * 1.6,
            speedX: (Math.random() - 0.5) * 0.8,
            rotationX: Math.random() * 360,
            rotationY: Math.random() * 360,
            rotationZ: Math.random() * 360,
            rotSpeedX: (Math.random() - 0.5) * 1.5,
            rotSpeedY: (Math.random() - 0.5) * 2.0,
            rotSpeedZ: (Math.random() - 0.5) * 1.2,
            flutterPhase: Math.random() * Math.PI * 2,
            flutterSpeed: 0.02 + Math.random() * 0.03,
            opacity: 0.65 + Math.random() * 0.35,
            color: color
        };
    }

    drawPetal(petal) {
        this.ctx.save();
        this.ctx.translate(petal.x, petal.y);

        // 3D rotation projection simulation
        const radX = (petal.rotationX * Math.PI) / 180;
        const radY = (petal.rotationY * Math.PI) / 180;
        const radZ = (petal.rotationZ * Math.PI) / 180;

        this.ctx.rotate(radZ);
        this.ctx.scale(Math.cos(radY), Math.sin(radX) * 0.8 + 0.2);

        this.ctx.globalAlpha = petal.opacity;

        // Draw organic curved rose petal path
        const w = petal.size;
        const h = petal.size * 1.25;

        const grad = this.ctx.createLinearGradient(0, -h / 2, 0, h / 2);
        grad.addColorStop(0, petal.color.light);
        grad.addColorStop(0.6, `rgb(${petal.color.r}, ${petal.color.g}, ${petal.color.b})`);
        grad.addColorStop(1, petal.color.dark);

        this.ctx.fillStyle = grad;
        this.ctx.shadowColor = 'rgba(255, 105, 135, 0.3)';
        this.ctx.shadowBlur = 6;

        this.ctx.beginPath();
        this.ctx.moveTo(0, -h / 2);
        this.ctx.bezierCurveTo(w / 1.5, -h / 2, w, -h / 6, w * 0.8, h / 4);
        this.ctx.bezierCurveTo(w * 0.6, h / 2, 0, h / 1.7, 0, h / 2);
        this.ctx.bezierCurveTo(0, h / 1.7, -w * 0.6, h / 2, -w * 0.8, h / 4);
        this.ctx.bezierCurveTo(-w, -h / 6, -w / 1.5, -h / 2, 0, -h / 2);
        this.ctx.closePath();
        this.ctx.fill();

        // Subtle center petal vein
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -h / 3);
        this.ctx.quadraticCurveTo(w * 0.1, 0, 0, h * 0.35);
        this.ctx.stroke();

        this.ctx.restore();
    }

    update() {
        // Smooth wind interpolation
        this.wind += (this.targetWind - this.wind) * 0.05;

        for (let i = 0; i < this.petals.length; i++) {
            const p = this.petals[i];

            p.flutterPhase += p.flutterSpeed;
            const sway = Math.sin(p.flutterPhase) * 1.2;

            p.x += p.speedX + sway + this.wind;
            p.y += p.speedY;

            p.rotationX += p.rotSpeedX;
            p.rotationY += p.rotSpeedY;
            p.rotationZ += p.rotSpeedZ;

            // Boundary wrap
            if (p.y > this.canvas.height + 40) {
                this.petals[i] = this.createPetal(false);
            }
            if (p.x < -40) p.x = this.canvas.width + 30;
            if (p.x > this.canvas.width + 40) p.x = -30;
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const petal of this.petals) {
            this.drawPetal(petal);
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        const loop = () => {
            if (!this.isRunning) return;
            this.update();
            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    stop() {
        this.isRunning = false;
    }

    // Burst extra petals on celebration
    burst(count = 30) {
        for (let i = 0; i < count; i++) {
            const p = this.createPetal(false);
            p.x = window.innerWidth / 2 + (Math.random() - 0.5) * 300;
            p.y = window.innerHeight * 0.4 + (Math.random() - 0.5) * 200;
            p.speedY = (Math.random() - 0.5) * 6;
            p.speedX = (Math.random() - 0.5) * 8;
            p.size *= 1.2;
            this.petals.push(p);
        }
        // Trim back down smoothly
        setTimeout(() => {
            if (this.petals.length > this.maxPetals) {
                this.petals.splice(this.maxPetals);
            }
        }, 4000);
    }
}

window.PetalEngine = PetalEngine;
