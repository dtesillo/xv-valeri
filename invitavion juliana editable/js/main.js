// Cuenta regresiva hasta el 20 diciembre 2025 19:00
const targetDate = new Date('2026-02-21T19:00:00-05:00').getTime(); //[web:22]

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    document.getElementById('countdown').innerHTML = '¡Hoy es el gran día!';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}
// ----- Modal vestimenta -----
const btnVestimenta = document.getElementById('btnVestimenta');
const modalVestimenta = document.getElementById('modalVestimenta');
const closeVestimenta = document.getElementById('closeVestimenta');

if (btnVestimenta && modalVestimenta && closeVestimenta) {
  btnVestimenta.addEventListener('click', () => {
    modalVestimenta.classList.remove('hidden');
  });

  closeVestimenta.addEventListener('click', () => {
    modalVestimenta.classList.add('hidden');
  });

  modalVestimenta.addEventListener('click', (e) => {
    if (e.target === modalVestimenta) {
      modalVestimenta.classList.add('hidden');
    }
  });
}

// ----- Stack de fotos draggable (simplificado) -----
const stack = document.querySelector('.draggable-stack');
const swipeHint = document.getElementById('swipeHint');

if (stack) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentCard = null;

  const getCards = () =>
    Array.from(stack.querySelectorAll('.card-photo'));

  const presets = [
    { x: -20, y: 15, r: -6, s: 0.95 },
    { x: 10,  y: 10, r: 4,  s: 0.97 },
    { x: -8,  y: 5,  r: -2, s: 0.99 },
    { x: 6,   y: 0,  r: 3,  s: 1.01 },
    { x: 0,   y: 0,  r: 0,  s: 1.03 }
  ];
  
  const resetStackTransforms = () => {
    const cards = getCards();
    cards.forEach((card, index) => {
      const p = presets[index] || presets[presets.length - 1];
      card.style.transition = 'transform 0.25s ease';
      card.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg) scale(${p.s})`;
      card.style.zIndex = String(index + 1);
    });
  };

  resetStackTransforms();

  const startDrag = (x, y) => {
    if (isDragging) return;
    currentCard = stack.lastElementChild;
    if (!currentCard || !currentCard.classList.contains('card-photo')) return;
    isDragging = true;
    startX = x;
    startY = y;
    currentCard.style.transition = 'none';
    currentCard.style.cursor = 'grabbing';
  };

  const moveDrag = (x, y) => {
    if (!isDragging || !currentCard) return;
    const dx = x - startX;
    const dy = y - startY;
    const rotate = dx / 15;
    currentCard.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`;
  };

  const endDrag = (x, y) => {
    if (!isDragging || !currentCard) return;
    const dx = x - startX;
    const dy = y - startY;
    const distance = Math.hypot(dx, dy);

    isDragging = false;
    currentCard.style.cursor = 'grab';

    if (distance > 40 && currentCard.parentNode === stack) {
      if (swipeHint) {
        swipeHint.style.display = 'none';
      }
      stack.insertBefore(currentCard, stack.firstElementChild);
    }
    resetStackTransforms();
    currentCard = null;
  };

  // Desktop
  stack.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
    const onMove = (ev) => moveDrag(ev.clientX, ev.clientY);
    const onUp = (ev) => {
      endDrag(ev.clientX, ev.clientY);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  // Mobile / touch
  stack.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  }, { passive: true });

  stack.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  }, { passive: true });

  stack.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    endDrag(t.clientX, t.clientY);
  }, { passive: true });
}

// ----- Música de fondo -----
document.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bgMusic');
  if (!bgMusic) return;

  bgMusic.volume = 0.6;

  // función que intenta reproducir y se auto‑desactiva
  const startMusic = () => {
    bgMusic.play()
      .then(() => {
        // una vez que sonó, quitamos los listeners
        document.removeEventListener('click', startMusic);
        document.removeEventListener('touchstart', startMusic);
      })
      .catch((err) => {
        console.log('No se pudo reproducir aún:', err);
      });
  };

  // primer tap o clic en cualquier parte de la página
  document.addEventListener('click', startMusic);
  document.addEventListener('touchstart', startMusic, { passive: true });
  document.addEventListener('scroll', startMusic, { passive: true });
});
// ----- Confirmar asistencia: WhatsApp fijo -----
document.addEventListener('DOMContentLoaded', () => {
  const btnConfirmar = document.getElementById('btnConfirmar');
  if (!btnConfirmar) return;

  btnConfirmar.addEventListener('click', () => {
    const telefono = '573123051384'; // +57 3123051384 sin signos
    const mensaje = 'Confirmo mi asistencia';
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  });
});

updateCountdown();
setInterval(updateCountdown, 1000);
