/**
 * Fireworks, Firecrackers & Confetti Canvas Engine
 * Features: Rocket trails, Cracker bursts, Heart-shaped explosions,
 * Shimmering Willows, and fluttering 3D Confetti.
 */

class FireworksEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.particles = [];
        this.confetti = [];
        this.isRunning = false;
        this.autoLaunchInterval = null;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Launch a rocket towards (targetX, targetY)
    launchRocket(startX, startY, targetX, targetY, type = 'random') {
        if (window.birthdayAudio) {
            window.birthdayAudio.playFireworkSound();
        }

        const colors = [
            '#ff3366', '#ff6b6b', '#ffd166', '#06d6a0', '#118ab2',
            '#a29bfe', '#ff758c', '#ff85a1', '#f72585', '#ffd700'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.fireworks.push({
            x: startX,
            y: startY,
            startX: startX,
            startY: startY,
            targetX: targetX,
            targetY: targetY,
            distanceToTarget: Math.hypot(targetX - startX, targetY - startY),
            distanceTraveled: 0,
            coordinates: [],
            coordinateCount: 4,
            angle: Math.atan2(targetY - startY, targetX - startX),
            speed: 3.5,
            acceleration: 1.05,
            brightness: Math.random() * 30 + 60,
            targetRadius: 1,
            color: color,
            type: type === 'random' ? this.getRandomType() : type
        });
    }

    getRandomType() {
        const types = ['heart', 'chrysanthemum', 'willow', 'ring', 'cracker'];
        // Heart has high weight for romantic touch
        return Math.random() < 0.35 ? 'heart' : types[Math.floor(Math.random() * types.length)];
    }

    // Explode rocket into particles
    createExplosion(x, y, color, type) {
        if (type === 'heart') {
            this.createHeartExplosion(x, y, color);
        } else if (type === 'willow') {
            this.createWillowExplosion(x, y, '#ffd700');
        } else if (type === 'ring') {
            this.createRingExplosion(x, y, color);
        } else if (type === 'cracker') {
            this.createCrackerBurst(x, y);
        } else {
            this.createChrysanthemumExplosion(x, y, color);
        }

        // Add small confetti burst
        this.addConfettiBurst(x, y, 20);
    }

    createHeartExplosion(x, y, color) {
        const total = 70;
        const scale = 2.2;
        for (let i = 0; i < total; i++) {
            const t = (Math.PI * 2 * i) / total;
            // Parametric heart formula
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            const speed = (0.09 + Math.random() * 0.02) * scale;
            const vx = hx * speed;
            const vy = hy * speed;

            this.particles.push({
                x: x,
                y: y,
                vx: vx,
                vy: vy,
                friction: 0.96,
                gravity: 0.04,
                alpha: 1,
                decay: 0.012 + Math.random() * 0.008,
                color: Math.random() < 0.5 ? '#ff2a70' : '#ff85a1',
                size: 2.5 + Math.random() * 1.5,
                twinkle: Math.random() < 0.5,
                sparkleTimer: 0
            });
        }
    }

    createChrysanthemumExplosion(x, y, color) {
        const count = 90;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6.5 + 1.5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                friction: 0.94,
                gravity: 0.06,
                alpha: 1,
                decay: 0.015 + Math.random() * 0.01,
                color: color,
                trail: [],
                size: 2.2 + Math.random() * 1.2,
                twinkle: Math.random() < 0.4
            });
        }
    }

    createWillowExplosion(x, y, color) {
        const count = 80;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 0.8;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                friction: 0.93,
                gravity: 0.035, // Floats longer
                alpha: 1,
                decay: 0.007 + Math.random() * 0.005, // Long lingering
                color: '#fff0a5',
                secondaryColor: '#ffd700',
                trail: [],
                size: 2.0,
                twinkle: true
            });
        }
    }

    createRingExplosion(x, y, color) {
        const count = 60;
        const ringSpeed = 4.8;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * ringSpeed,
                vy: Math.sin(angle) * ringSpeed,
                friction: 0.95,
                gravity: 0.05,
                alpha: 1,
                decay: 0.016,
                color: color,
                size: 2.6,
                twinkle: true
            });
        }
    }

    // Cracker sparkle flash burst
    createCrackerBurst(x, y) {
        if (window.birthdayAudio) {
            window.birthdayAudio.playCrackerBurstSound();
        }
        const count = 60;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                friction: 0.90,
                gravity: 0.08,
                alpha: 1,
                decay: 0.025 + Math.random() * 0.02,
                color: Math.random() < 0.6 ? '#ffffff' : '#ffd700',
                flash: true,
                size: 3.2
            });
        }
    }

    // Confetti pieces
    addConfettiBurst(x, y, count = 35) {
        const colors = ['#f72585', '#b5179e', '#7209b7', '#4cc9f0', '#ffb703', '#fb8500', '#ffffff'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 1.5;
            this.confetti.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2.5,
                width: 6 + Math.random() * 6,
                height: 10 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 8,
                tilt: Math.random() * 360,
                tiltSpeed: 0.05 + Math.random() * 0.05,
                gravity: 0.09,
                friction: 0.97,
                alpha: 1,
                decay: 0.005 + Math.random() * 0.005
            });
        }
    }

    triggerCelebrationShow(durationMs = 9000) {
        const startTime = Date.now();
        const launch = () => {
            if (Date.now() - startTime > durationMs) return;

            const startX = window.innerWidth * (0.2 + Math.random() * 0.6);
            const startY = window.innerHeight;
            const targetX = window.innerWidth * (0.15 + Math.random() * 0.7);
            const targetY = window.innerHeight * (0.12 + Math.random() * 0.45);

            this.launchRocket(startX, startY, targetX, targetY);

            // Stagger next launches
            setTimeout(launch, 350 + Math.random() * 600);
        };

        // Fire 2 immediately
        launch();
        setTimeout(launch, 200);
    }

    update() {
        // Update Fireworks Rockets
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const fw = this.fireworks[i];

            fw.coordinates.push([fw.x, fw.y]);
            if (fw.coordinates.length > fw.coordinateCount) {
                fw.coordinates.shift();
            }

            fw.speed *= fw.acceleration;
            const vx = Math.cos(fw.angle) * fw.speed;
            const vy = Math.sin(fw.angle) * fw.speed;

            fw.distanceTraveled = Math.hypot(fw.x - fw.startX, fw.y - fw.startY);

            if (fw.distanceTraveled >= fw.distanceToTarget || fw.y <= fw.targetY) {
                this.createExplosion(fw.targetX, fw.targetY, fw.color, fw.type);
                this.fireworks.splice(i, 1);
            } else {
                fw.x += vx;
                fw.y += vy;
            }
        }

        // Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;

            p.x += p.vx;
            p.y += p.vy;

            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update Confetti
        for (let i = this.confetti.length - 1; i >= 0; i--) {
            const c = this.confetti[i];
            c.vx *= c.friction;
            c.vy *= c.friction;
            c.vy += c.gravity;

            c.x += c.vx;
            c.y += c.vy;

            c.rotation += c.rotSpeed;
            c.tilt += c.tiltSpeed;
            c.alpha -= c.decay;

            if (c.alpha <= 0 || c.y > this.canvas.height + 20) {
                this.confetti.splice(i, 1);
            }
        }
    }

    render() {
        // Semi-transparent clear for smooth motion trails
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.globalCompositeOperation = 'lighter';

        // Draw Rockets
        for (const fw of this.fireworks) {
            this.ctx.beginPath();
            const last = fw.coordinates[0] || [fw.x, fw.y];
            this.ctx.moveTo(last[0], last[1]);
            this.ctx.lineTo(fw.x, fw.y);
            this.ctx.strokeStyle = fw.color;
            this.ctx.lineWidth = 3;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = fw.color;
            this.ctx.stroke();

            // Rocket spark sparks
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Draw Particles
        for (const p of this.particles) {
            this.ctx.save();
            this.ctx.globalAlpha = p.twinkle ? (Math.random() > 0.3 ? p.alpha : p.alpha * 0.4) : p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = p.flash ? 12 : 6;
            this.ctx.shadowColor = p.color;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        // Draw Confetti
        this.ctx.globalCompositeOperation = 'source-over';
        for (const c of this.confetti) {
            this.ctx.save();
            this.ctx.translate(c.x, c.y);
            this.ctx.rotate((c.rotation * Math.PI) / 180);
            this.ctx.scale(1, Math.cos(c.tilt));
            this.ctx.globalAlpha = Math.max(0, c.alpha);
            this.ctx.fillStyle = c.color;
            this.ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
            this.ctx.restore();
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
}

window.FireworksEngine = FireworksEngine;
