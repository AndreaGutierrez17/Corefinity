document.addEventListener('DOMContentLoaded', () => {
  initMegaMenuPreview();
  initTrustedStrip();
  initGenericCarousels();
  initCaseStudiesCarousel();
  initVideoThumbs();
  initMobileNavClose();
  initLegacyThumbPlayerFallback();
});

function initMegaMenuPreview() {
  const resourceItems = document.querySelectorAll('.resource-item');
  const preview = document.getElementById('resourcePreview');
  if (!preview || !resourceItems.length) return;

  const previewTitle = preview.querySelector('.cf-preview-title');
  const previewText = preview.querySelector('.cf-preview-text');
  const previewLink = document.getElementById('previewLink');
  const defaultImage = preview.dataset.defaultImage || '';

  if (defaultImage) {
    preview.style.backgroundImage = `url('${defaultImage}')`;
  }

  const updatePreview = (item) => {
    if (!item) return;
    const title = item.dataset.title || '';
    const desc = item.dataset.desc || '';
    const img = item.dataset.image || '';
    const href = item.getAttribute('href') || '#';

    if (title) previewTitle.textContent = title;
    if (desc) previewText.textContent = desc;
    if (img) preview.style.backgroundImage = `url('${img}')`;
    if (previewLink) previewLink.setAttribute('href', href);
  };

  const enableHover = window.matchMedia('(min-width: 992px)').matches;
  resourceItems.forEach((item) => {
    const handler = () => updatePreview(item);
    if (enableHover) {
      item.addEventListener('mouseenter', handler);
      item.addEventListener('focus', handler);
    } else {
      item.addEventListener('click', handler);
    }
  });
}

function initTrustedStrip() {
  const track = document.getElementById('trustedTrack');
  if (!track) return;

  const btnLeft = document.querySelector('.cf-trusted-arrow.left');
  const btnRight = document.querySelector('.cf-trusted-arrow.right');
  let direction = 1;

  const getStep = () => Math.max(160, track.clientWidth * 0.6);

  const clampScroll = () => {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    if (track.scrollLeft > maxScroll) {
      track.scrollLeft = maxScroll;
      direction = -1;
    }
  };

  const slide = (dir) => {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const next = Math.min(Math.max(track.scrollLeft + dir * getStep(), 0), maxScroll);
    if (next === 0) direction = 1;
    if (next === maxScroll) direction = -1;
    track.scrollTo({ left: next, behavior: 'smooth' });
  };

  btnLeft && btnLeft.addEventListener('click', () => slide(-1));
  btnRight && btnRight.addEventListener('click', () => slide(1));

  window.addEventListener('resize', clampScroll);
  setInterval(() => slide(direction), 3500);
}

function initGenericCarousels() {
  document.querySelectorAll('.cf-carousel, .cf-testimonial-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.cf-carousel-track');
    const slides = track ? Array.from(track.children) : [];
    if (!track || !slides.length) return;

    const btnPrev = carousel.querySelector('.cf-carousel-arrow.left');
    const btnNext = carousel.querySelector('.cf-carousel-arrow.right');
    let index = 0;

    const setSlideSizes = () => {
      const width = carousel.clientWidth;
      slides.forEach((slide) => {
        slide.style.minWidth = `${width}px`;
        slide.style.flexBasis = `${width}px`;
      });
    };

    const syncThumbs = (activeIndex) => {
      const thumbsWrapper = carousel.parentElement.querySelector('.cf-video-thumbs');
      if (!thumbsWrapper) return;
      thumbsWrapper.querySelectorAll('.cf-video-thumb').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === activeIndex);
      });
    };

    const pauseInactiveVideos = () => {
      slides.forEach((slide, idx) => {
        const vid = slide.querySelector('video');
        if (vid && idx !== index) vid.pause();
      });
    };

    const goTo = (i) => {
      if (!slides.length) return;
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      pauseInactiveVideos();
      syncThumbs(index);
    };

    btnPrev && btnPrev.addEventListener('click', () => goTo(index - 1));
    btnNext && btnNext.addEventListener('click', () => goTo(index + 1));

    window.addEventListener('resize', () => {
      setSlideSizes();
      track.style.transform = `translateX(-${index * 100}%)`;
    });

    setSlideSizes();
    goTo(0);

    carousel.cfGoTo = goTo;
  });
}

function initCaseStudiesCarousel() {
  const viewport = document.querySelector('.cf-cases-viewport');
  const track = document.querySelector('.cf-cases-track');
  const cards = track ? Array.from(track.children) : [];
  if (!viewport || !track || !cards.length) return;

  const btnPrev = document.querySelector('.cf-cases-arrow.left');
  const btnNext = document.querySelector('.cf-cases-arrow.right');
  let currentIndex = 0;
  let cardsPerView = getCardsPerView();

  function getCardsPerView() {
    return window.innerWidth < 992 ? 1 : 2;
  }

  function getGap() {
    const style = window.getComputedStyle(track);
    const gapValue = parseFloat(style.columnGap || style.gap || '0');
    return Number.isNaN(gapValue) ? 0 : gapValue;
  }

  function getMaxIndex() {
    return Math.max(0, Math.ceil(cards.length / cardsPerView) - 1);
  }

  function applyCardWidths() {
    const viewportWidth = viewport.clientWidth;
    const gap = getGap();
    const totalGap = gap * (cardsPerView - 1);
    const cardWidth = Math.max(0, (viewportWidth - totalGap) / cardsPerView);

    cards.forEach((card) => {
      card.style.flex = `0 0 ${cardWidth}px`;
      card.style.maxWidth = `${cardWidth}px`;
    });

    return cardWidth * cardsPerView + totalGap;
  }

  function updateSlider() {
    const slideWidth = applyCardWidths();
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  function goTo(dir) {
    const maxIndex = getMaxIndex();
    currentIndex = Math.min(Math.max(currentIndex + dir, 0), maxIndex);
    updateSlider();
  }

  btnPrev && btnPrev.addEventListener('click', () => goTo(-1));
  btnNext && btnNext.addEventListener('click', () => goTo(1));

  window.addEventListener('resize', () => {
    const prevCardsPerView = cardsPerView;
    cardsPerView = getCardsPerView();
    if (prevCardsPerView !== cardsPerView && currentIndex > getMaxIndex()) {
      currentIndex = getMaxIndex();
    }
    updateSlider();
  });

  updateSlider();
}

function initVideoThumbs() {
  const videoSection = document.querySelector('#client-testimonials');
  if (!videoSection) return;

  const carousel = videoSection.querySelector('.cf-carousel');
  const thumbs = videoSection.querySelectorAll('.cf-video-thumb');
  thumbs.forEach((thumb) => {
    const idx = parseInt(thumb.getAttribute('data-video-index'), 10);
    thumb.addEventListener('click', () => {
      if (carousel && typeof carousel.cfGoTo === 'function') {
        carousel.cfGoTo(idx);
      }
    });
  });
}

function initMobileNavClose() {
  const nav = document.getElementById('mainNav');
  const toggler = document.querySelector('.navbar-toggler');
  if (!nav || !toggler || typeof bootstrap === 'undefined' || !bootstrap.Collapse) return;

  const collapse = bootstrap.Collapse.getOrCreateInstance(nav, { toggle: false });

  const syncTogglerState = () => {
    const isOpen = nav.classList.contains('show');
    toggler.classList.toggle('collapsed', !isOpen);
    toggler.setAttribute('aria-expanded', String(isOpen));
  };

  toggler.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation(); // Keep the toggle to a single controlled action
    if (nav.classList.contains('show')) {
      collapse.hide();
    } else {
      collapse.show();
    }
  });

  nav.addEventListener('shown.bs.collapse', syncTogglerState);
  nav.addEventListener('hidden.bs.collapse', syncTogglerState);

  const navLinks = nav.querySelectorAll('a');

  const maybeClose = (event) => {
    const link = event.currentTarget;
    const isDropdownToggle = link.getAttribute('data-bs-toggle') === 'dropdown';
    if (window.innerWidth < 992 && !isDropdownToggle) {
      collapse.hide();
    }
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', maybeClose);
  });

  syncTogglerState();
}

// Fallback logic for pages using the standalone video player + thumbs pattern
function initLegacyThumbPlayerFallback() {
  const videoPlayer = document.getElementById('cf-video-player');
  const videoThumbs = document.querySelectorAll('.cf-video-thumb[data-video-id]');
  if (!videoPlayer || !videoThumbs.length) return;

  let current = 0;

  function setVideo(i) {
    const id = videoThumbs[i].dataset.videoId;
    videoPlayer.src = `https://www.youtube.com/embed/${id}`;
    videoThumbs.forEach((t) => t.classList.remove('active'));
    videoThumbs[i].classList.add('active');
    current = i;
  }

  videoThumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => setVideo(i));
  });

  const videoArrows = document.querySelectorAll('.cf-video-arrow');
  videoArrows.forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = btn.classList.contains('left') ? -1 : 1;
      let next = current + dir;
      if (next < 0) next = videoThumbs.length - 1;
      if (next >= videoThumbs.length) next = 0;
      setVideo(next);
    });
  });
}
