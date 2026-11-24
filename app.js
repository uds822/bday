/**
 * Main Birthday Application Controller
 * Handles interactions, personalizations, URL queries, audio integration, and effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Canvases and Engines
    const petalEngine = new PetalEngine('petalsCanvas');
    petalEngine.start();
    window.petalEngine = petalEngine;

    const fireworksEngine = new FireworksEngine('fireworksCanvas');
    fireworksEngine.start();
    window.fireworksEngine = fireworksEngine;

    const flowerGarden = new FlowerGarden();
    window.flowerGarden = flowerGarden;

    // 2. Parse URL Parameters for Instant Personalization
    // e.g. ?to=Sophia&from=Rajan&msg=...
    const urlParams = new URLSearchParams(window.location.search);
    const recipientParam = urlParams.get('to') || urlParams.get('name') || 'My Princess';
    const senderParam = urlParams.get('from') || 'Your Rajan';
    const msgParam = urlParams.get('msg');

    const recipientElements = document.querySelectorAll('.recipient-name');
    recipientElements.forEach(el => el.textContent = recipientParam);

    const senderElements = document.querySelectorAll('.sender-name');
    senderElements.forEach(el => el.textContent = senderParam);

    if (msgParam) {
        const letterBody = document.querySelector('.letter-custom-msg');
        if (letterBody) {
            letterBody.textContent = decodeURIComponent(msgParam);
        }
    }

    // 3. Entrance Screen Opening
    const entranceScreen = document.getElementById('entranceScreen');
    const openGiftBtn = document.getElementById('openGiftBtn');
    const giftBoxWrapper = document.getElementById('giftBoxWrapper');

    function openSurprise() {
        if (!entranceScreen.classList.contains('opened')) {
            entranceScreen.classList.add('opened');

            // Start romantic background music & sound effect
            if (window.birthdayAudio) {
                window.birthdayAudio.startBackgroundMusic();
                window.birthdayAudio.playSparkleSound();
            }

            // Burst petals
            petalEngine.burst(35);

            // Initial launch of celebratory fireworks
            setTimeout(() => {
                fireworksEngine.triggerCelebrationShow(4000);
            }, 600);

            // Start spawning floating balloons
            startBalloonSpawner();
        }
    }

    if (openGiftBtn) openGiftBtn.addEventListener('click', openSurprise);
    if (giftBoxWrapper) giftBoxWrapper.addEventListener('click', openSurprise);

    // 4. Interactive Cake & Candle Blowing
    const cakeContainer = document.getElementById('cakeContainer');
    const flames = document.querySelectorAll('.flame');
    const wishBanner = document.getElementById('wishBanner');
    let candlesBlown = false;

    function blowOutCandles() {
        if (candlesBlown) return;
        candlesBlown = true;

        if (window.birthdayAudio) {
            window.birthdayAudio.playBlowSound();
        }

        // Extinguish flames
        flames.forEach(flame => {
            flame.classList.add('extinguished');
        });

        // Show romantic wish banner
        if (wishBanner) {
            wishBanner.classList.add('active');
        }

        // Dramatic pause then GRAND CELEBRATION!
        setTimeout(() => {
            if (window.birthdayAudio) {
                window.birthdayAudio.playSparkleSound();
            }
            fireworksEngine.triggerCelebrationShow(8000);
            petalEngine.burst(50);
            showToast('✨ Wish granted! Happy Birthday, ' + recipientParam + '! 💖');
        }, 800);
    }

    if (cakeContainer) {
        cakeContainer.addEventListener('click', blowOutCandles);
    }

    // 5. Action Buttons (Toolbar)
    const crackersBtn = document.getElementById('crackersBtn');
    if (crackersBtn) {
        crackersBtn.addEventListener('click', () => {
            if (window.birthdayAudio) {
                window.birthdayAudio.playCrackerBurstSound();
            }
            fireworksEngine.triggerCelebrationShow(6000);
            showToast('🎆 Fireworks & Crackers in the sky for you!');
        });
    }

    const bouquetBtn = document.getElementById('bouquetBtn');
    if (bouquetBtn) {
        bouquetBtn.addEventListener('click', () => {
            flowerGarden.bloomBouquet();
            // Smooth scroll to bouquet
            const bContainer = document.getElementById('bouquet-container');
            if (bContainer) {
                bContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            showToast('💐 A bouquet of eternal roses just for you!');
        });
    }

    const musicToggleBtn = document.getElementById('musicToggleBtn');
    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', () => {
            if (window.birthdayAudio) {
                const playing = window.birthdayAudio.toggleMusic();
                musicToggleBtn.innerHTML = playing ? '🎵 Music: On' : '🔇 Music: Off';
            }
        });
    }

    const navMusicBtn = document.getElementById('navMusicBtn');
    if (navMusicBtn) {
        navMusicBtn.addEventListener('click', () => {
            if (window.birthdayAudio) {
                const playing = window.birthdayAudio.toggleMusic();
                navMusicBtn.textContent = playing ? '🔊' : '🔇';
            }
        });
    }

    // Interactive Firework Launch on canvas click/tap anywhere
    document.addEventListener('click', (e) => {
        // Do not trigger if clicking on interactive controls/modals/buttons
        if (e.target.closest('button, input, textarea, .modal-card, .cake-container, .gift-box-wrapper, .interactive-balloon')) {
            return;
        }

        const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
        const startY = window.innerHeight;
        fireworksEngine.launchRocket(startX, startY, e.clientX, e.clientY);
    });

    // 6. Floating Interactive Balloons
    const balloonsContainer = document.getElementById('floatingBalloonsContainer');
    const compliments = [
        "Your smile is my favorite thing in the universe ✨",
        "Every second with you is a gift from heaven 🎁",
        "You are more beautiful than a million roses 🌹",
        "Thank you for being the sweetest part of my life 💖",
        "Your laugh melts away all my worries 🎶",
        "You deserve all the love, happiness, and stars in the sky 🌟",
        "Forever grateful to have you by my side 💕",
        "Happy Birthday to the girl who stole my heart! 🎂"
    ];

    function createBalloon() {
        if (!balloonsContainer) return;

        const balloon = document.createElement('div');
        balloon.className = 'interactive-balloon';

        const balloonColors = ['#ff4b72', '#ff85a1', '#f72585', '#b5179e', '#ffd166', '#4cc9f0', '#ffb703'];
        const chosenColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];

        balloon.innerHTML = `
            <div class="balloon-body" style="background: ${chosenColor};"></div>
            <div class="balloon-string"></div>
        `;

        const startX = 20 + Math.random() * (window.innerWidth - 80);
        balloon.style.left = startX + 'px';
        balloon.style.bottom = '-80px';

        balloonsContainer.appendChild(balloon);

        let currentY = 0;
        const floatSpeed = 1.2 + Math.random() * 1.5;
        const swayFreq = 0.02 + Math.random() * 0.02;
        let phase = Math.random() * Math.PI * 2;

        const animInterval = setInterval(() => {
            currentY += floatSpeed;
            phase += swayFreq;
            const swayX = Math.sin(phase) * 22;

            balloon.style.transform = `translate(${swayX}px, -${currentY}px)`;

            if (currentY > window.innerHeight + 160) {
                clearInterval(animInterval);
                balloon.remove();
            }
        }, 16);

        // Tap balloon to pop
        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            clearInterval(animInterval);

            if (window.birthdayAudio) {
                window.birthdayAudio.playPopSound();
            }

            // Confetti burst at balloon position
            const rect = balloon.getBoundingClientRect();
            fireworksEngine.addConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);

            balloon.remove();

            // Display random compliment
            const randomMsg = compliments[Math.floor(Math.random() * compliments.length)];
            showToast(randomMsg);
        });
    }

    function startBalloonSpawner() {
        createBalloon();
        createBalloon();
        setInterval(() => {
            if (document.querySelectorAll('.interactive-balloon').length < 6) {
                createBalloon();
            }
        }, 4000);
    }

    // 7. Toast Notification Handler
    let toastTimeout = null;
    const toast = document.getElementById('complimentToast');

    function showToast(text) {
        if (!toast) return;
        toast.textContent = text;
        toast.classList.add('show');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3600);
    }
    window.showToast = showToast;

    // 8. Personalize & Share Modal
    const shareModal = document.getElementById('shareModal');
    const openShareBtns = [document.getElementById('navShareBtn'), document.getElementById('toolbarShareBtn')];
    const closeShareBtn = document.getElementById('closeShareBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const copyStatusMsg = document.getElementById('copyStatusMsg');

    const inputHerName = document.getElementById('inputHerName');
    const inputYourName = document.getElementById('inputYourName');
    const inputCustomMsg = document.getElementById('inputCustomMsg');

    if (inputHerName) inputHerName.value = recipientParam;
    if (inputYourName) inputYourName.value = senderParam;

    function openModal() {
        if (shareModal) shareModal.classList.add('open');
    }

    function closeModal() {
        if (shareModal) shareModal.classList.remove('open');
        if (copyStatusMsg) copyStatusMsg.textContent = '';
    }

    openShareBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', openModal);
    });

    if (closeShareBtn) closeShareBtn.addEventListener('click', closeModal);
    if (shareModal) {
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) closeModal();
        });
    }

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const herName = (inputHerName ? inputHerName.value.trim() : '') || 'My Princess';
            const yourName = (inputYourName ? inputYourName.value.trim() : '') || 'Your Rajan';
            const customMsg = (inputCustomMsg ? inputCustomMsg.value.trim() : '');

            // Update live on the page
            recipientElements.forEach(el => el.textContent = herName);
            senderElements.forEach(el => el.textContent = yourName);
            if (customMsg) {
                const letterBody = document.querySelector('.letter-custom-msg');
                if (letterBody) letterBody.textContent = customMsg;
            }

            // Construct customized share URL
            let shareUrl = '';
            try {
                const url = new URL(window.location.href);
                url.searchParams.set('to', herName);
                url.searchParams.set('from', yourName);
                if (customMsg) {
                    url.searchParams.set('msg', customMsg);
                }
                shareUrl = url.toString();
            } catch (e) {
                const base = window.location.href.split('?')[0];
                shareUrl = `${base}?to=${encodeURIComponent(herName)}&from=${encodeURIComponent(yourName)}${customMsg ? '&msg=' + encodeURIComponent(customMsg) : ''}`;
            }

            // Copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                if (copyStatusMsg) {
                    copyStatusMsg.textContent = '🎉 Link copied to clipboard! Share it with her!';
                }
                showToast('🔗 Personalized link copied to clipboard!');
            }).catch(() => {
                // Fallback for clipboard
                prompt('Copy this link to share with her:', shareUrl);
            });
        });
    }
});
