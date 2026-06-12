// Premium Interactivity and Animations for Valentine's Day Letter

// Elements
const envelope = document.getElementById('letter-envelope');
const seal = document.getElementById('envelope-seal');
const cardWrapper = document.querySelector('.card-wrapper');
const card = document.getElementById('letter-card');
const typedTextContainer = document.getElementById('typed-text');
const replyContainer = document.getElementById('reply-container');
const instructionTip = document.getElementById('instruction-tip');

const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');

const modalYes = document.getElementById('modal-yes');
const modalNo = document.getElementById('modal-no');

// States
let isLidOpened = false;
let isCardExtracted = false;
let isLetterExpanded = false;
let isTextRevealed = false;
let isMusicPlaying = false;

// ----------------------------------------------------
// Web Audio API Procedural Romantic Melody Synth
// ----------------------------------------------------
let audioCtx = null;
let synthIntervalId = null;

const chords = [
    // Cmaj7: C3, G3, C4, E4, G4, B4
    [130.81, 196.00, 261.63, 329.63, 392.00, 493.88],
    // Am7: A2, E3, A3, C4, E4, G4
    [110.00, 164.81, 220.00, 261.63, 329.63, 392.00],
    // Fmaj7: F2, C3, F3, A3, C4, E4
    [87.31, 130.81, 174.61, 220.00, 261.63, 329.63],
    // G6: G2, D3, G3, B3, D4, G4
    [98.00, 146.83, 196.00, 246.94, 293.66, 392.00]
];

function playNote(freq, time, duration) {
    if (!audioCtx) return;
    
    // Create nodes
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    
    osc.type = 'triangle'; // Soft warm sound
    osc.frequency.setValueAtTime(freq, time);
    
    // Lowpass filter to make it sound like a soft piano/musicbox
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, time);
    filter.Q.setValueAtTime(1, time);
    
    // Envelope
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.12, time + 0.05); // quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.05); // long release
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(time);
    osc.stop(time + duration);
}

function startSynthMusic() {
    if (synthIntervalId) return;
    
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    let chordIndex = 0;
    let noteIndex = 0;
    
    // Play a note every 450ms
    const noteTempo = 450; 
    
    synthIntervalId = setInterval(() => {
        const chord = chords[chordIndex];
        // Standard arpeggio pattern: 0 -> 2 -> 4 -> 5 -> 3 -> 1
        const arpeggioPattern = [0, 2, 4, 5, 3, 1];
        const currentNoteFreq = chord[arpeggioPattern[noteIndex]];
        
        const now = audioCtx.currentTime;
        playNote(currentNoteFreq, now, 1.8);
        
        noteIndex++;
        if (noteIndex >= arpeggioPattern.length) {
            noteIndex = 0;
            chordIndex = (chordIndex + 1) % chords.length;
        }
    }, noteTempo);
    
    isMusicPlaying = true;
}

function stopSynthMusic() {
    if (synthIntervalId) {
        clearInterval(synthIntervalId);
        synthIntervalId = null;
    }
    isMusicPlaying = false;
}

// ----------------------------------------------------
// Floating Canvas Particles (Hearts & Petals)
// ----------------------------------------------------
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(isBurst = false, x, y) {
        this.isBurst = isBurst;
        this.x = x !== undefined ? x : Math.random() * canvas.width;
        this.y = y !== undefined ? y : (isBurst ? y : canvas.height + 20);
        this.size = Math.random() * 12 + 6;
        
        // Bursts fly outward, normal particles float upward
        if (isBurst) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 4;
            this.speedX = Math.cos(angle) * speed;
            this.speedY = Math.sin(angle) * speed;
        } else {
            this.speedX = Math.random() * 1.5 - 0.75;
            this.speedY = -(Math.random() * 1.5 + 0.8);
        }
        
        this.type = Math.random() > 0.4 ? 'heart' : 'petal';
        this.color = this.getRandomColor();
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.opacity = isBurst ? 1 : Math.random() * 0.5 + 0.4;
        this.decay = Math.random() * 0.015 + 0.005;
        this.wiggleFreq = Math.random() * 0.02;
        this.wiggleAmp = Math.random() * 0.8;
    }

    getRandomColor() {
        const colors = [
            'rgba(214, 48, 49, 1)',   // red
            'rgba(255, 118, 117, 1)', // blush pink
            'rgba(253, 121, 168, 1)', // soft pink
            'rgba(224, 86, 109, 1)',  // cherry
            'rgba(255, 187, 196, 1)'  // rose pastel
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    drawHeart(x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y + size / 4);
        ctx.quadraticCurveTo(x, y, x + size / 2, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
        ctx.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
        ctx.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
        ctx.quadraticCurveTo(x, y, x + size / 2, y);
        ctx.closePath();
        ctx.fill();
    }

    drawPetal(x, y, size) {
        ctx.beginPath();
        ctx.ellipse(x, y, size / 2, size, this.rotation, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        if (this.isBurst) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedX *= 0.98; // friction
            this.speedY *= 0.98;
            this.opacity -= this.decay;
        } else {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * this.wiggleFreq) * this.wiggleAmp;
            
            // Re-spawn regular particles when they float off-screen
            if (this.y < -30) {
                this.y = canvas.height + 20;
                this.x = Math.random() * canvas.width;
                this.opacity = Math.random() * 0.5 + 0.4;
            }
        }
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        if (this.type === 'heart') {
            this.drawHeart(this.x - this.size/2, this.y - this.size/2, this.size);
        } else {
            this.drawPetal(this.x, this.y, this.size);
        }
        ctx.restore();
    }
}

// Generate base floating background particles
function initParticles() {
    particles = [];
    const count = Math.min(60, Math.floor(canvas.width / 20));
    for (let i = 0; i < count; i++) {
        const p = new Particle(false);
        // Distribute them vertically initially
        p.y = Math.random() * canvas.height;
        particles.push(p);
    }
}
initParticles();

// Trigger a burst of hearts (e.g. when Yes is clicked)
function triggerBurst(x, y) {
    const burstCount = 80;
    for (let i = 0; i < burstCount; i++) {
        particles.push(new Particle(true, x, y));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        
        // Remove dead burst particles
        if (p.isBurst && p.opacity <= 0) {
            particles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animateParticles);
}
requestAnimationFrame(animateParticles);

// ----------------------------------------------------
// Letter Interactive Sequence
// ----------------------------------------------------

const letterParagraphs = [
    "Hey,",
    "Sabse pehle, agar meri baat se tumhe bura lage ya tum uncomfortable feel karo, toh uske liye sorry.",
    "Pata nahi kab aur kaise, lekin tumse baat karte karte mujhe tum pasand aane lagi ho. ❤️",
    "Sach kahun toh hum abhi ek dusre ko itna nahi jaante, lekin jitni bhi baat hui hai, usne mujhe tumhari taraf khinchna shuru kar diya hai. Tumse baat karna accha lagta hai, aur shayad isi wajah se main tumhe aur jaanne ka mann karta rehta hoon.",
    "Main yeh nahi keh raha ki abhi koi jaldi mein decision lo, bas itna poochna chahta hoon ki kya hum ek dusre ko thoda aur jaanne ki koshish kar sakte hain? Dheere dheere baatein karenge, ek dusre ko samjhenge, aur dekhte hain kahan tak jaata hai.",
    "Jo bhi tumhara answer ho, main uski respect kurunga. Bas ek request hai, meri is baat ki wajah se hamari friendship ya jo bond abhi hai, woh kabhi kharab nahi hona chahiye.",
    "Take your time. I'll wait for your reply. ❤️✨"
];

// Open the envelope (Clicking the seal or envelope body)
function openEnvelope() {
    if (isLidOpened) return;
    
    isLidOpened = true;
    envelope.classList.add('open-lid');
    instructionTip.style.opacity = '0';
    
    // Auto-start music synth when user interacts to open
    startSynthMusic();
    
    // Step 2: Slide the card out of the envelope
    setTimeout(() => {
        envelope.classList.add('slide-out');
        isCardExtracted = true;
        
        setTimeout(() => {
            instructionTip.innerHTML = "Click the card to read the letter ✉️";
            instructionTip.style.opacity = '0.9';
        }, 800);
    }, 900);
}

// Expand the card to fullscreen reading board
function expandCard() {
    if (!isCardExtracted || isLetterExpanded) return;
    
    isLetterExpanded = true;
    envelope.classList.add('expanded-letter');
    instructionTip.style.opacity = '0';
    
    // Start typing reveal
    setTimeout(() => {
        revealLetterText();
    }, 800);
}

// Reveal paragraphs with typing effect
async function revealLetterText() {
    typedTextContainer.innerHTML = '';
    
    for (let pIndex = 0; pIndex < letterParagraphs.length; pIndex++) {
        const pText = letterParagraphs[pIndex];
        const pElement = document.createElement('p');
        pElement.className = 'letter-p';
        typedTextContainer.appendChild(pElement);
        
        // Smoothly scroll down the card container as we type new lines
        const cardBody = document.querySelector('.card-body');
        
        // Check if paragraph is short (like salutation)
        if (pText.length < 10) {
            pElement.textContent = pText;
            pElement.classList.add('revealed');
            await new Promise(resolve => setTimeout(resolve, 500));
        } else {
            pElement.classList.add('revealed');
            // Fast character typing
            for (let charIndex = 0; charIndex < pText.length; charIndex++) {
                pElement.textContent += pText[charIndex];
                
                // Auto scroll
                cardBody.scrollTop = cardBody.scrollHeight;
                
                // Typing delay
                await new Promise(resolve => setTimeout(resolve, 25));
            }
            await new Promise(resolve => setTimeout(resolve, 600));
        }
    }
    
    // Finish typing, reveal buttons
    revealReplySection();
}

function revealReplySection() {
    isTextRevealed = true;
    replyContainer.classList.add('active');
    
    // Scroll completely to bottom
    const cardBody = document.querySelector('.card-body');
    setTimeout(() => {
        cardBody.scrollTop = cardBody.scrollHeight;
    }, 300);
}

// Event Listeners for Opening
seal.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
});

envelope.addEventListener('click', () => {
    if (!isLidOpened) {
        openEnvelope();
    }
});

cardWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isCardExtracted && !isLetterExpanded) {
        expandCard();
    }
});

// Reply Buttons Trigger
btnYes.addEventListener('click', (e) => {
    e.stopPropagation();
    modalYes.classList.add('active');
    // Trigger heart rain burst around the click position
    triggerBurst(e.clientX, e.clientY);
});

btnNo.addEventListener('click', (e) => {
    e.stopPropagation();
    modalNo.classList.add('active');
});