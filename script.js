let clicsNo = 0;
const btnNo = document.getElementById('btnNo');
let audioContext = null;

// Inicializar AudioContext al interactuar por primera vez
function inicializarAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Remover el listener después de inicializar
    document.removeEventListener('click', inicializarAudio);
    document.removeEventListener('touchstart', inicializarAudio);
}

document.addEventListener('click', inicializarAudio);
document.addEventListener('touchstart', inicializarAudio);

// ===== FUNCIONALIDAD DEL BOTÓN "NO" =====
function moverBotonNo() {
    const btnRect = btnNo.getBoundingClientRect();
    
    // Calcular límites para que el botón no se salga de la pantalla
    const maxX = window.innerWidth - btnRect.width - 50;
    const maxY = window.innerHeight - btnRect.height - 50;
    const minX = 50;
    const minY = 50;
    
    // Generar posición aleatoria dentro de los límites
    const nuevaX = Math.random() * (maxX - minX) + minX;
    const nuevaY = Math.random() * (maxY - minY) + minY;
    
    // Aplicar la nueva posición con transform (como en versión original)
    btnNo.style.left = nuevaX + 'px';
    btnNo.style.top = nuevaY + 'px';
    
    clicsNo++;
    
    // Reproducir sonido de movimiento
    reproducirSonido('move');
    
    // Aumentar tamaño del botón "Sí"
    aumentarTamanoBotonSi();
    
    // Efecto de "escape" ocasional
    if (Math.random() > 0.7) {
        btnNo.style.transform = 'scale(1.1)';
        setTimeout(() => {
            btnNo.style.transform = 'scale(1)';
        }, 200);
    }
}

// ===== AUMENTAR TAMAÑO DEL BOTÓN "SÍ" =====
function aumentarTamanoBotonSi() {
    const btnSi = document.querySelector('.btn-yes');
    const question = document.querySelector('.main-question');
    const mainContainer = document.querySelector('.main-container');
    const buttonGroup = document.querySelector('.button-group');
    
    // Factor de crecimiento más agresivo
    const factor = Math.pow(1.25, clicsNo);
    
    // Calcular tamaños responsive
    const baseAncho = window.innerWidth * 0.4;
    const baseAlto = window.innerHeight * 0.15;
    
    const nuevoAncho = Math.min(baseAncho * factor, window.innerWidth * 0.98);
    const nuevoAlto = Math.min(baseAlto * factor, window.innerHeight * 0.95);
    const fontSize = Math.min(Math.sqrt(factor) * 20, 80);
    
    btnSi.style.width = nuevoAncho + 'px';
    btnSi.style.height = nuevoAlto + 'px';
    btnSi.style.fontSize = fontSize + 'px';
    btnSi.style.padding = (nuevoAlto * 0.2) + 'px ' + (nuevoAncho * 0.15) + 'px';
    
    // Ocultar elementos cuando el botón es muy grande
    if (clicsNo >= 6) {
        question.style.opacity = '0';
        question.style.visibility = 'hidden';
        mainContainer.style.padding = '0';
        buttonGroup.style.gap = '0';
    } else if (clicsNo >= 4) {
        question.style.opacity = '0.3';
        question.style.fontSize = 'clamp(24px, 6vw, 32px)';
        question.style.transform = 'scale(0.5)';
    } else if (clicsNo >= 2) {
        question.style.opacity = '0.6';
        question.style.fontSize = 'clamp(32px, 8vw, 44px)';
        question.style.transform = 'scale(0.85)';
    } else {
        question.style.opacity = '1';
        question.style.fontSize = 'clamp(32px, 10vw, 72px)';
        question.style.transform = 'scale(1)';
    }
    
    // Cambiar texto del botón
    if (clicsNo >= 10) {
        btnSi.textContent = '¡¡¡SÍ, QUIERO!!!';
    } else if (clicsNo >= 8) {
        btnSi.textContent = '¡¡SÍ, QUIERO!!';
    } else if (clicsNo >= 6) {
        btnSi.textContent = '¡SÍ, QUIERO!';
    } else if (clicsNo >= 4) {
        btnSi.textContent = 'SÍ, QUIERO';
    } else {
        btnSi.textContent = 'Sí, quiero';
    }
}

// ===== FUNCIONALIDAD DEL BOTÓN "SÍ" =====
function mostrarRespuesta() {
    const modal = document.getElementById('modalRespuesta');
    modal.classList.add('show');
    
    // Reproducir sonido de éxito
    reproducirSonido('yes');
    
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.style.animationPlayState = 'paused';
    });
    
    // Generar confeti
    generarConfeti();
}

function cerrarModal() {
    const modal = document.getElementById('modalRespuesta');
    modal.classList.remove('show');
    
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.style.animationPlayState = 'running';
    });
}

// ===== GENERACIÓN DE PARTÍCULAS =====
function crearParticulas() {
    const container = document.getElementById('particles');
    const tiposParticulas = ['❤️', '💕', '💖', '⭐', '✨', '🌹', '💗', '💝'];
    
    // Crear 20 partículas como en la versión original
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 70% emojis, 30% círculos
        if (Math.random() > 0.3) {
            particle.textContent = tiposParticulas[Math.floor(Math.random() * tiposParticulas.length)];
            particle.classList.add('particle-heart');
            particle.style.fontSize = (Math.random() * 20 + 16) + 'px';
            particle.style.lineHeight = '1';
        } else {
            particle.classList.add('particle-circle');
            const size = Math.random() * 8 + 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
        }
        
        // Posición inicial con píxeles absolutos (viewport)
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = -50 + 'px';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        
        container.appendChild(particle);
    }
}

// ===== GENERADOR DE CONFETI =====
function generarConfeti() {
    const container = document.getElementById('particles');
    const emojis = ['❤️', '💕', '💖', '🌹', '💗', '💝', '✨', '⭐'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'particle';
        confetti.classList.add('particle-heart');
        
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.fontSize = (Math.random() * 12 + 8) + 'px';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = (i * 0.1) + 's';
        
        container.appendChild(confetti);
    }
}

// ===== EVENTO DE TECLADO =====
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});

// ===== REPRODUCCIÓN DE SONIDOS =====
function reproducirSonido(tipo) {
    try {
        // Usar el contexto de audio compartido
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Si el contexto está suspended, reanudarlo
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (tipo === 'move') {
            // Sonido corto para movimiento
            oscillator.frequency.value = 600;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } else if (tipo === 'yes') {
            // Sonido para confirmación (más alegre)
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // Do5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // Mi5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // Sol5
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    } catch (e) {
        console.log('Sonidos no disponibles');
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    crearParticulas();
    
    // Esperar a que el DOM se renderice completamente
    setTimeout(() => {
        const btnSi = document.querySelector('.btn-yes');
        const btnSiRect = btnSi.getBoundingClientRect();
        
        // Posicionar botón "No" alineado verticalmente con "Sí, quiero"
        const centerX = btnSiRect.left + btnSiRect.width / 2;
        btnNo.style.left = (centerX - (btnNo.getBoundingClientRect().width / 2)) + 'px';
        btnNo.style.top = (btnSiRect.bottom + 20) + 'px';
    }, 100);
    
    // Agregar eventos del botón "No"
    btnNo.addEventListener('mouseenter', moverBotonNo);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moverBotonNo();
    });
    
    // Prevenir click
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

// ===== MANEJAR REDIMENSIONAMIENTO =====
window.addEventListener('resize', function() {
    const btnRect = btnNo.getBoundingClientRect();
    
    if (btnRect.left < 0 || btnRect.top < 0 || 
        btnRect.right > window.innerWidth || btnRect.bottom > window.innerHeight) {
        moverBotonNo();
    }
});
