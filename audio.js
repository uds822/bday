/**
 * Sound & Music Engine using Web Audio API
 * 100% self-contained, no external audio files required!
 */

class BirthdayAudio {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isMusicPlaying = false;
        this.musicTimeout = null;
        this.currentNoteIndex = 0;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
    }

    ensureContext() {
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime, 0.05);
        }
        return this.isMuted;
    }

    // Play a single music box bell note
    playMusicBoxNote(freq, time, duration = 1.2, velocity = 0.5) {
        if (!this.ctx || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Music box / Celesta timbre (sine + faint overtone)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, time);

        // Gentle envelope: instantaneous chime attack and natural exponential decay
        noteGain.gain.setValueAtTime(0.0001, time);
        noteGain.gain.exponentialRampToValueAtTime(velocity * 0.4, time + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(velocity * 0.15, time + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.00001, time + duration);

        osc.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(this.musicGain);

        osc.start(time);
        osc2.start(time);
        osc.stop(time + duration);
        osc2.stop(time + duration);
    }

    // Romantic Birthday & Canon Melody
    startBackgroundMusic() {
        this.ensureContext();
        if (this.isMusicPlaying) return;
        this.isMusicPlaying = true;

        // Note frequencies (Hz)
        const notes = {
            C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
            C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
            C6: 1046.50
        };

        // Romantic Music Box Melody score: [note, duration in beats]
        const score = [
            // Happy birthday intro
            ['G4', 0.75], ['G4', 0.25], ['A4', 1.0], ['G4', 1.0], ['C5', 1.0], ['B4', 2.0],
            ['G4', 0.75], ['G4', 0.25], ['A4', 1.0], ['G4', 1.0], ['D5', 1.0], ['C5', 2.0],
            ['G4', 0.75], ['G4', 0.25], ['G5', 1.0], ['E5', 1.0], ['C5', 1.0], ['B4', 1.0], ['A4', 1.5],
            ['F5', 0.75], ['F5', 0.25], ['E5', 1.0], ['C5', 1.0], ['D5', 1.0], ['C5', 2.5],

            // Romantic dream interlude (arpeggiated lullaby feel)
            ['E5', 0.75], ['G5', 0.75], ['C6', 1.5], ['B5', 0.75], ['A5', 0.75], ['G5', 1.5],
            ['A5', 0.5], ['B5', 0.5], ['C6', 1.0], ['G5', 1.5], ['E5', 1.0], ['D5', 1.5],
            ['C5', 0.75], ['E5', 0.75], ['G5', 1.5], ['F5', 0.75], ['E5', 0.75], ['D5', 1.5],
            ['C5', 1.0], ['D5', 1.0], ['E5', 1.0], ['D5', 1.0], ['C5', 3.0]
        ];

        // Soft bass accompaniment notes
        const bassScore = [
            ['C4', 4.0], ['G4', 4.0],
            ['C4', 4.0], ['G4', 4.0],
            ['C4', 4.0], ['F4', 4.0],
            ['F4', 2.0], ['G4', 2.0], ['C4', 4.0],

            ['C4', 3.0], ['G4', 3.0],
            ['F4', 3.0], ['C4', 3.0],
            ['A4', 3.0], ['G4', 3.0],
            ['F4', 3.0], ['C4', 4.0]
        ];

        const beatTime = 0.52; // Tempo ~115 bpm
        let step = 0;

        const scheduleLoop = () => {
            if (!this.isMusicPlaying) return;

            let now = this.ctx.currentTime;
            let currentOffset = 0.1;

            // Schedule melody
            score.forEach(([noteName, beats]) => {
                const freq = notes[noteName];
                const noteTime = now + currentOffset;
                const dur = beats * beatTime * 1.3;
                this.playMusicBoxNote(freq, noteTime, dur, 0.45);
                currentOffset += beats * beatTime;
            });

            // Schedule gentle arpeggiated bass harmony
            let bassOffset = 0.1;
            bassScore.forEach(([noteName, beats]) => {
                const freq = notes[noteName] / 2; // one octave down
                const noteTime = now + bassOffset;
                const dur = beats * beatTime * 1.5;
                this.playMusicBoxNote(freq, noteTime, dur, 0.25);
                bassOffset += beats * beatTime;
            });

            // Re-schedule when sequence finishes
            const totalDuration = Math.max(currentOffset, bassOffset);
            this.musicTimeout = setTimeout(scheduleLoop, (totalDuration - 0.5) * 1000);
        };

        scheduleLoop();
    }

    stopBackgroundMusic() {
        this.isMusicPlaying = false;
        if (this.musicTimeout) {
            clearTimeout(this.musicTimeout);
            this.musicTimeout = null;
        }
    }

    toggleMusic() {
        if (this.isMusicPlaying) {
            this.stopBackgroundMusic();
            return false;
        } else {
            this.startBackgroundMusic();
            return true;
        }
    }

    // Sound FX: Firework Launch Whistle & Boom
    playFireworkSound() {
        this.ensureContext();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;

        // Launch whistle
        const whistleOsc = this.ctx.createOscillator();
        const whistleGain = this.ctx.createGain();
        whistleOsc.type = 'sine';
        whistleOsc.frequency.setValueAtTime(300, now);
        whistleOsc.frequency.exponentialRampToValueAtTime(1100, now + 0.35);

        whistleGain.gain.setValueAtTime(0.001, now);
        whistleGain.gain.exponentialRampToValueAtTime(0.12, now + 0.1);
        whistleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        whistleOsc.connect(whistleGain);
        whistleGain.connect(this.sfxGain);

        whistleOsc.start(now);
        whistleOsc.stop(now + 0.35);

        // Explosion Boom & Cracker Crackle
        setTimeout(() => {
            if (this.isMuted || !this.ctx) return;
            const boomTime = this.ctx.currentTime;

            // Low frequency explosion thud
            const boomOsc = this.ctx.createOscillator();
            const boomGain = this.ctx.createGain();
            boomOsc.type = 'triangle';
            boomOsc.frequency.setValueAtTime(140, boomTime);
            boomOsc.frequency.exponentialRampToValueAtTime(30, boomTime + 0.5);

            boomGain.gain.setValueAtTime(0.5, boomTime);
            boomGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.6);

            boomOsc.connect(boomGain);
            boomGain.connect(this.sfxGain);
            boomOsc.start(boomTime);
            boomOsc.stop(boomTime + 0.6);

            // Crackling noise bursts
            const bufferSize = this.ctx.sampleRate * 0.45;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.1));
            }

            const noiseNode = this.ctx.createBufferSource();
            noiseNode.buffer = buffer;

            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.setValueAtTime(1200, boomTime);
            noiseFilter.Q.setValueAtTime(2.0, boomTime);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.3, boomTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.45);

            noiseNode.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.sfxGain);

            noiseNode.start(boomTime);
            noiseNode.stop(boomTime + 0.45);
        }, 320);
    }

    // Firecracker rapid bursts sound
    playCrackerBurstSound() {
        this.ensureContext();
        if (this.isMuted) return;

        const count = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (this.isMuted || !this.ctx) return;
                const now = this.ctx.currentTime;
                const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let j = 0; j < bufferSize; j++) {
                    data[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / bufferSize, 3);
                }

                const noise = this.ctx.createBufferSource();
                noise.buffer = buffer;

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.value = 800 + Math.random() * 700;

                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.35 + Math.random() * 0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.sfxGain);

                noise.start(now);
                noise.stop(now + 0.08);
            }, i * (50 + Math.random() * 40));
        }
    }

    // Candle blow whoosh sound
    playBlowSound() {
        this.ensureContext();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const dur = 0.8;
        const bufferSize = this.ctx.sampleRate * dur;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.linearRampToValueAtTime(650, now + dur * 0.4);
        filter.frequency.exponentialRampToValueAtTime(150, now + dur);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.4, now + dur * 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
        noise.stop(now + dur);
    }

    // Balloon Pop Sound
    playPopSound() {
        this.ensureContext();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;

        // Snappy impulse
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    // Magic Chime / Sparkle Sound
    playSparkleSound() {
        this.ensureContext();
        if (this.isMuted) return;
        const freqs = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02];
        const now = this.ctx.currentTime;

        freqs.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const noteTime = now + idx * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, noteTime);

            gain.gain.setValueAtTime(0.0001, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.2, noteTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.35);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(noteTime);
            osc.stop(noteTime + 0.35);
        });
    }
}

window.birthdayAudio = new BirthdayAudio();
