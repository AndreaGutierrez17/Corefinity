// Mega menu preview logic (dynamic image + text + link)
const resourceItems = document.querySelectorAll('.resource-item');
const preview = document.getElementById('resourcePreview');

if (preview && resourceItems.length) {
  const previewTitle = preview.querySelector('.cf-preview-title');
  const previewText  = preview.querySelector('.cf-preview-text');
  const previewLink  = document.getElementById('previewLink');

  const defaultImage = preview.dataset.defaultImage || '';

  // Imagen por defecto al cargar
  if (defaultImage) {
    preview.style.backgroundImage = `url('${defaultImage}')`;
  }

  const handleHover = (item) => {
    const title = item.dataset.title || '';
    const desc  = item.dataset.desc || '';
    const img   = item.dataset.image || '';
    const href  = item.getAttribute('href') || '#';

    if (title) previewTitle.textContent = title;
    if (desc)  previewText.textContent  = desc;
    if (img)   preview.style.backgroundImage = `url('${img}')`;
    if (previewLink) previewLink.setAttribute('href', href);
  };

  resourceItems.forEach((item) => {
    item.addEventListener('mouseenter', () => handleHover(item));
    item.addEventListener('focus', () => handleHover(item));
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const track   = document.getElementById('trustedTrack');
  const btnLeft  = document.querySelector('.cf-trusted-arrow.left');
  const btnRight = document.querySelector('.cf-trusted-arrow.right');

  if (!track) return;

  const STEP = 220;      // cuánto se mueve por “click”
  const INTERVAL = 3500; // ms entre auto-slides
  let direction = 1;     // 1 hacia la derecha, -1 hacia la izquierda

  function slide(dir) {
    const maxScroll = track.scrollWidth - track.clientWidth;
    let next = track.scrollLeft + dir * STEP;

    if (next <= 0) {
      next = 0;
      direction = 1;
    }
    if (next >= maxScroll) {
      next = maxScroll;
      direction = -1;
    }

    track.scrollTo({
      left: next,
      behavior: 'smooth'
    });
  }

  // Flechas manuales
  btnLeft && btnLeft.addEventListener('click', () => slide(-1));
  btnRight && btnRight.addEventListener('click', () => slide(1));

  // Auto-scroll
  setInterval(() => {
    slide(direction);
  }, INTERVAL);
});

  document.addEventListener('DOMContentLoaded', function () {
    const carousels = document.querySelectorAll('.cf-carousel');

    carousels.forEach(carousel => {
      const track  = carousel.querySelector('.cf-carousel-track');
      const slides = Array.from(track.children);
      const btnPrev = carousel.querySelector('.cf-carousel-arrow.left');
      const btnNext = carousel.querySelector('.cf-carousel-arrow.right');

      let index = 0;

      function updateSlide() {
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
      }

      btnPrev.addEventListener('click', () => {
        index = (index - 1 + slides.length) % slides.length;
        updateSlide();
      });

      btnNext.addEventListener('click', () => {
        index = (index + 1) % slides.length;
        updateSlide();
      });
    });
  });

document.addEventListener('DOMContentLoaded', function () {
  const viewport = document.querySelector('.cf-cases-viewport');
  const track    = document.querySelector('.cf-cases-track');
  const cards    = document.querySelectorAll('.cf-case-card');
  const btnPrev  = document.querySelector('.cf-cases-arrow.left');
  const btnNext  = document.querySelector('.cf-cases-arrow.right');

  if (!viewport || !track || cards.length === 0) return;

  let currentIndex = 0;
  let cardsPerView = window.innerWidth < 992 ? 1 : 2;

  function updateCardsPerView() {
    cardsPerView = window.innerWidth < 992 ? 1 : 2;
  }

  function maxIndex() {
    return Math.max(0, Math.ceil(cards.length / cardsPerView) - 1);
  }

  function updateSlider() {
    const viewportWidth = viewport.clientWidth;
    track.style.transform = `translateX(-${currentIndex * viewportWidth}px)`;
  }

  function goTo(dir) {
    currentIndex += dir;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex()) currentIndex = maxIndex();
    updateSlider();
  }

  btnPrev && btnPrev.addEventListener('click', () => goTo(-1));
  btnNext && btnNext.addEventListener('click', () => goTo(1));

  window.addEventListener('resize', () => {
    const prevCardsPerView = cardsPerView;
    updateCardsPerView();
    if (prevCardsPerView !== cardsPerView) {
      if (currentIndex > maxIndex()) currentIndex = maxIndex();
      updateSlider();
    } else {
      updateSlider();
    }
  });

  // init
  updateCardsPerView();
  updateSlider();
});

document.addEventListener('DOMContentLoaded', function () {
 
  const carousels = document.querySelectorAll('.cf-carousel');

  carousels.forEach(carousel => {
    const track  = carousel.querySelector('.cf-carousel-track');
    const slides = Array.from(track.children);
    const btnPrev = carousel.querySelector('.cf-carousel-arrow.left');
    const btnNext = carousel.querySelector('.cf-carousel-arrow.right');

    let index = 0;

    function goTo(i) {
      if (!slides.length) return;
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';

      
      slides.forEach((slide, idx) => {
        const vid = slide.querySelector('video');
        if (vid && idx !== index) {
          vid.pause();
        }
      });

  
      const thumbsWrapper = carousel.parentElement.querySelector('.cf-video-thumbs');
      if (thumbsWrapper) {
        thumbsWrapper.querySelectorAll('.cf-video-thumb').forEach((thumb, idx) => {
          thumb.classList.toggle('active', idx === index);
        });
      }
    }

    btnPrev && btnPrev.addEventListener('click', () => goTo(index - 1));
    btnNext && btnNext.addEventListener('click', () => goTo(index + 1));

   
    carousel.cfGoTo = goTo;

   
    goTo(0);
  });

  const videoSection = document.querySelector('#client-testimonials');
  if (videoSection) {
    const carousel = videoSection.querySelector('.cf-carousel');
    const thumbs = videoSection.querySelectorAll('.cf-video-thumb');

    thumbs.forEach(thumb => {
      const idx = parseInt(thumb.getAttribute('data-video-index'), 10);
      thumb.addEventListener('click', () => {
        if (carousel && typeof carousel.cfGoTo === 'function') {
          carousel.cfGoTo(idx);
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const carousels = document.querySelectorAll('.cf-carousel');

  carousels.forEach(carousel => {
    const track   = carousel.querySelector('.cf-carousel-track');
    const slides  = Array.from(track.children);
    const btnPrev = carousel.querySelector('.cf-carousel-arrow.left');
    const btnNext = carousel.querySelector('.cf-carousel-arrow.right');

    if (!track || !slides.length) return;

    let index = 0;

    function update() {
      const width = carousel.clientWidth;           // ancho real del carrusel
      track.style.transform = `translateX(-${index * width}px)`;
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();

      // Si es carrusel de video, pausa los que no están activos
      slides.forEach((slide, idx) => {
        const vid = slide.querySelector('video');
        if (vid && idx !== index) vid.pause();
      });
    }

    btnPrev && btnPrev.addEventListener('click', () => goTo(index - 1));
    btnNext && btnNext.addEventListener('click', () => goTo(index + 1));

    window.addEventListener('resize', update);

    // inicio
    goTo(0);
  });
});


// ---------- Video testimonials (cambia el iframe según el thumb) ----------
const videoPlayer = document.getElementById('cf-video-player');
const videoThumbs = document.querySelectorAll('.cf-video-thumb');

if (videoPlayer && videoThumbs.length) {
  let current = 0;

  function setVideo(i) {
    const id = videoThumbs[i].dataset.videoId;
    videoPlayer.src = `https://www.youtube.com/embed/${id}`;
    videoThumbs.forEach(t => t.classList.remove('active'));
    videoThumbs[i].classList.add('active');
    current = i;
  }

  videoThumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => setVideo(i));
  });

  // flechas al lado del video
  const videoArrows = document.querySelectorAll('.cf-video-arrow');
  videoArrows.forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.classList.contains('left') ? -1 : 1;
      let next = current + dir;
      if (next < 0) next = videoThumbs.length - 1;
      if (next >= videoThumbs.length) next = 0;
      setVideo(next);
    });
  });
}
