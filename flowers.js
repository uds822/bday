/**
 * Blooming Flowers & Interactive Bouquet Experience
 * Generates blooming roses, glowing lilies, floating butterflies, and sparkles.
 */

class FlowerGarden {
    constructor() {
        this.container = document.getElementById('bouquet-container');
        this.isBloomed = false;
    }

    bloomBouquet() {
        if (!this.container) return;
        this.container.innerHTML = '';
        this.isBloomed = true;

        if (window.birthdayAudio) {
            window.birthdayAudio.playSparkleSound();
        }

        // Generate SVG Blooming Roses & Flowers
        const bouquetSVG = document.createElement('div');
        bouquetSVG.className = 'blooming-bouquet-wrap';
        bouquetSVG.innerHTML = `
            <div class="bouquet-glow"></div>
            <svg class="bouquet-svg" viewBox="0 0 500 500">
                <defs>
                    <linearGradient id="roseGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ff758c" />
                        <stop offset="50%" stop-color="#ff3366" />
                        <stop offset="100%" stop-color="#b5179e" />
                    </linearGradient>
                    <linearGradient id="roseGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffb3c1" />
                        <stop offset="60%" stop-color="#ff4d6d" />
                        <stop offset="100%" stop-color="#c9184a" />
                    </linearGradient>
                    <linearGradient id="roseGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#ffd166" />
                        <stop offset="50%" stop-color="#f72585" />
                        <stop offset="100%" stop-color="#7209b7" />
                    </linearGradient>
                    <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#52b788" />
                        <stop offset="100%" stop-color="#2d6a4f" />
                    </linearGradient>
                    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#74c69d" />
                        <stop offset="100%" stop-color="#1b4332" />
                    </linearGradient>
                    <filter id="bloomGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                <!-- Bouquet Ribbon & Stems -->
                <g class="bouquet-stems">
                    <path class="stem stem-1" d="M250,470 Q240,320 180,220" stroke="url(#stemGrad)" stroke-width="7" fill="none" stroke-linecap="round"/>
                    <path class="stem stem-2" d="M250,470 Q250,300 250,180" stroke="url(#stemGrad)" stroke-width="8" fill="none" stroke-linecap="round"/>
                    <path class="stem stem-3" d="M250,470 Q260,320 320,220" stroke="url(#stemGrad)" stroke-width="7" fill="none" stroke-linecap="round"/>
                    <path class="stem stem-4" d="M250,470 Q220,340 140,260" stroke="url(#stemGrad)" stroke-width="6" fill="none" stroke-linecap="round"/>
                    <path class="stem stem-5" d="M250,470 Q280,340 360,260" stroke="url(#stemGrad)" stroke-width="6" fill="none" stroke-linecap="round"/>

                    <!-- Leaves -->
                    <path class="leaf" d="M220,300 Q170,290 180,330 Q210,320 220,300" fill="url(#leafGrad)"/>
                    <path class="leaf" d="M280,310 Q330,300 320,340 Q290,330 280,310" fill="url(#leafGrad)"/>
                    <path class="leaf" d="M200,370 Q150,370 165,400 Q195,390 200,370" fill="url(#leafGrad)"/>
                    <path class="leaf" d="M295,380 Q345,380 330,410 Q300,400 295,380" fill="url(#leafGrad)"/>

                    <!-- Ribbon Bow -->
                    <g class="ribbon" transform="translate(250, 420)">
                        <path d="M0,0 C-35,-25 -55,10 -20,25 C-5,5 0,0 0,0" fill="#ffd166"/>
                        <path d="M0,0 C35,-25 55,10 20,25 C5,5 0,0 0,0" fill="#ffb703"/>
                        <circle cx="0" cy="5" r="9" fill="#fb8500"/>
                        <path d="M-6,10 L-25,60 L-10,55 L-2,30" fill="#ffd166"/>
                        <path d="M6,10 L25,60 L10,55 L2,30" fill="#ffb703"/>
                    </g>
                </g>

                <!-- Flower 1: Left Rose -->
                <g class="flower flower-1" transform="translate(180, 220)">
                    <circle cx="0" cy="0" r="38" fill="url(#roseGrad1)" filter="url(#bloomGlow)"/>
                    <path d="M-25,-15 C-10,-35 20,-30 30,-10 C40,15 15,35 -10,30 C-30,25 -35,0 -25,-15" fill="#d90429" opacity="0.65"/>
                    <path d="M-15,-8 C-5,-22 15,-18 20,-5 C25,10 10,22 -5,18 C-18,15 -20,0 -15,-8" fill="#ef233c"/>
                    <circle cx="0" cy="0" r="10" fill="#ff758c"/>
                </g>

                <!-- Flower 2: Center Majestic Rose -->
                <g class="flower flower-2" transform="translate(250, 170)">
                    <circle cx="0" cy="0" r="48" fill="url(#roseGrad2)" filter="url(#bloomGlow)"/>
                    <path d="M-35,-20 C-15,-48 30,-42 42,-15 C55,20 20,48 -15,42 C-42,35 -48,0 -35,-20" fill="#a4133c" opacity="0.7"/>
                    <path d="M-22,-12 C-8,-32 20,-28 28,-10 C35,12 12,32 -10,28 C-28,22 -30,0 -22,-12" fill="#c9184a"/>
                    <circle cx="0" cy="0" r="14" fill="#ff85a1"/>
                    <circle cx="0" cy="0" r="6" fill="#fff0f3"/>
                </g>

                <!-- Flower 3: Right Rose -->
                <g class="flower flower-3" transform="translate(320, 220)">
                    <circle cx="0" cy="0" r="38" fill="url(#roseGrad1)" filter="url(#bloomGlow)"/>
                    <path d="M-25,-15 C-10,-35 20,-30 30,-10 C40,15 15,35 -10,30 C-30,25 -35,0 -25,-15" fill="#d90429" opacity="0.65"/>
                    <path d="M-15,-8 C-5,-22 15,-18 20,-5 C25,10 10,22 -5,18 C-18,15 -20,0 -15,-8" fill="#ef233c"/>
                    <circle cx="0" cy="0" r="10" fill="#ff758c"/>
                </g>

                <!-- Flower 4: Left-outer Lilac / Orchid -->
                <g class="flower flower-4" transform="translate(135, 260)">
                    <circle cx="0" cy="0" r="30" fill="url(#roseGrad3)"/>
                    <circle cx="0" cy="0" r="18" fill="#f72585"/>
                    <circle cx="0" cy="0" r="8" fill="#ffeaa7"/>
                </g>

                <!-- Flower 5: Right-outer Lilac / Orchid -->
                <g class="flower flower-5" transform="translate(365, 260)">
                    <circle cx="0" cy="0" r="30" fill="url(#roseGrad3)"/>
                    <circle cx="0" cy="0" r="18" fill="#f72585"/>
                    <circle cx="0" cy="0" r="8" fill="#ffeaa7"/>
                </g>
            </svg>

            <!-- Floating Sparkle Particles around Flowers -->
            <div class="flower-butterflies">
                <div class="butterfly butterfly-1">🦋</div>
                <div class="butterfly butterfly-2">✨</div>
                <div class="butterfly butterfly-3">💖</div>
                <div class="butterfly butterfly-4">🦋</div>
            </div>

            <div class="bouquet-card">
                <span class="bouquet-badge">Handpicked For You With Love</span>
                <h3 class="bouquet-title">"To the Flower That Never Fades"</h3>
                <p class="bouquet-text">Like these roses, you bring timeless elegance, fragrance, and color to my whole world. May your year be as blossoming and sweet as you are!</p>
            </div>
        `;

        this.container.appendChild(bouquetSVG);

        // Burst extra romantic petals
        if (window.petalEngine) {
            window.petalEngine.burst(25);
        }
    }
}

window.FlowerGarden = FlowerGarden;
