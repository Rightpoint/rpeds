import { createOptimizedPicture } from '../../scripts/aem.js';

function createSlide(item, index) {
  const slide = document.createElement('div');
  slide.className = 'carousel-slide';
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');
  slide.setAttribute('aria-label', `Slide ${index + 1}`);

  const mediaDiv = item.children[0];
  const contentDiv = item.children[1];

  if (mediaDiv) {
    const media = document.createElement('div');
    media.className = 'carousel-slide-media';
    media.innerHTML = mediaDiv.innerHTML;
    media.querySelectorAll('picture > img').forEach((img) => {
      img.closest('picture').replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]),
      );
    });
    slide.append(media);
  }

  if (contentDiv) {
    const content = document.createElement('div');
    content.className = 'carousel-slide-content';
    content.innerHTML = contentDiv.innerHTML;
    slide.append(content);
  }

  return slide;
}

export default function decorate(block) {
  const slides = [...block.children];
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'carousel-slides';
  slidesContainer.setAttribute('aria-live', 'polite');

  slides.forEach((item, index) => {
    slidesContainer.append(createSlide(item, index));
  });

  // Navigation buttons
  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn carousel-btn-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '<span>&#10094;</span>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn carousel-btn-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '<span>&#10095;</span>';

  nav.append(prevBtn);
  nav.append(nextBtn);

  // Indicators
  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators';
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-indicator';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    if (index === 0) dot.classList.add('carousel-indicator-active');
    indicators.append(dot);
  });

  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateCarousel() {
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    indicators.querySelectorAll('.carousel-indicator').forEach((dot, index) => {
      dot.classList.toggle('carousel-indicator-active', index === currentIndex);
    });
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  });

  indicators.addEventListener('click', (e) => {
    const dot = e.target.closest('.carousel-indicator');
    if (!dot) return;
    currentIndex = [...indicators.children].indexOf(dot);
    updateCarousel();
  });

  // Auto-play if configured
  if (block.classList.contains('autoplay')) {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    }, 5000);
  }

  block.textContent = '';
  block.append(slidesContainer);
  block.append(nav);
  block.append(indicators);
}
