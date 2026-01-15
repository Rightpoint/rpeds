import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero Carousel Block
 * A full-featured hero carousel with autoplay, touch/swipe support,
 * and animated progress indicators inspired by Genpact design.
 */

const CAROUSEL_DELAY = 5000; // 5 seconds per slide
const TRANSITION_DURATION = 500; // 500ms slide transition

/**
 * Creates a carousel slide from block row content
 * @param {Element} row - The block row element
 * @param {number} index - Slide index
 * @returns {Element} The decorated slide element
 */
function createSlide(row, index) {
  const slide = document.createElement('div');
  slide.className = 'hero-carousel-slide';
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'slide');
  slide.setAttribute('aria-label', `Slide ${index + 1}`);

  // Get image/media from first cell
  const mediaCell = row.children[0];
  // Get content from second cell
  const contentCell = row.children[1];

  // Process media
  if (mediaCell) {
    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'hero-carousel-slide-media';

    // Check for video
    const video = mediaCell.querySelector('video');
    if (video) {
      mediaWrapper.appendChild(video.cloneNode(true));
    } else {
      // Handle image
      const img = mediaCell.querySelector('img');
      if (img) {
        const optimizedPicture = createOptimizedPicture(
          img.src,
          img.alt || '',
          false,
          [{ width: '1600' }],
        );
        mediaWrapper.appendChild(optimizedPicture);
      } else {
        mediaWrapper.innerHTML = mediaCell.innerHTML;
      }
    }
    slide.appendChild(mediaWrapper);
  }

  // Process content overlay
  if (contentCell) {
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'hero-carousel-slide-content';
    contentWrapper.innerHTML = contentCell.innerHTML;

    // Add button container class if buttons exist
    const buttons = contentWrapper.querySelectorAll('a');
    if (buttons.length > 0) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'hero-carousel-buttons';
      buttons.forEach((btn) => {
        btn.classList.add('button');
        buttonContainer.appendChild(btn.cloneNode(true));
        btn.remove();
      });
      contentWrapper.appendChild(buttonContainer);
    }

    slide.appendChild(contentWrapper);
  }

  return slide;
}

/**
 * Creates navigation button with icon
 * @param {string} type - 'prev' or 'next'
 * @returns {Element} Button element
 */
function createNavButton(type) {
  const button = document.createElement('button');
  button.className = `hero-carousel-action hero-carousel-action-${type}`;
  button.setAttribute('aria-label', type === 'prev' ? 'Previous slide' : 'Next slide');

  const icon = document.createElement('span');
  icon.className = 'hero-carousel-action-icon';
  button.appendChild(icon);

  return button;
}

/**
 * Creates play/pause button
 * @param {boolean} isPlaying - Initial play state
 * @returns {Element} Button element
 */
function createPlayPauseButton(isPlaying) {
  const button = document.createElement('button');
  button.className = `hero-carousel-action hero-carousel-action-${isPlaying ? 'pause' : 'play'}`;
  button.setAttribute('aria-label', isPlaying ? 'Pause autoplay' : 'Play autoplay');

  const icon = document.createElement('span');
  icon.className = 'hero-carousel-action-icon';
  button.appendChild(icon);

  return button;
}

/**
 * Creates indicator for a slide
 * @param {number} index - Slide index
 * @param {Element} slide - The slide element (for thumbnail)
 * @returns {Element} Indicator button
 */
function createIndicator(index, slide) {
  const indicator = document.createElement('button');
  indicator.className = 'hero-carousel-indicator';
  indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);

  // Add thumbnail image for desktop view
  const thumbnailWrapper = document.createElement('div');
  thumbnailWrapper.className = 'hero-carousel-indicator-image';

  const slideMedia = slide.querySelector('.hero-carousel-slide-media img');
  if (slideMedia) {
    const thumbnail = createOptimizedPicture(
      slideMedia.src,
      slideMedia.alt || '',
      false,
      [{ width: '200' }],
    );
    thumbnailWrapper.appendChild(thumbnail);
  }
  indicator.appendChild(thumbnailWrapper);

  // Add title text
  const titleWrapper = document.createElement('span');
  titleWrapper.className = 'hero-carousel-indicator-title';

  const slideTitle = slide.querySelector('.hero-carousel-slide-content h1, .hero-carousel-slide-content h2');
  if (slideTitle) {
    titleWrapper.textContent = slideTitle.textContent;
  } else {
    titleWrapper.textContent = `Slide ${index + 1}`;
  }
  indicator.appendChild(titleWrapper);

  return indicator;
}

/**
 * Main carousel decoration function
 * @param {Element} block - The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const totalSlides = rows.length;

  if (totalSlides === 0) return;

  // Check for autoplay class
  const hasAutoplay = block.classList.contains('autoplay');

  // Set CSS custom property for animation duration
  block.style.setProperty('--carousel-delay', `${CAROUSEL_DELAY}ms`);

  // Create slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'hero-carousel-slides';
  slidesContainer.setAttribute('aria-live', 'polite');

  // Create slides
  const slides = rows.map((row, index) => createSlide(row, index));
  slides.forEach((slide) => slidesContainer.appendChild(slide));

  // Create indicators container
  const indicatorsContainer = document.createElement('div');
  indicatorsContainer.className = 'hero-carousel-indicators-container';

  const indicators = document.createElement('div');
  indicators.className = 'hero-carousel-indicators';

  slides.forEach((slide, index) => {
    const indicator = createIndicator(index, slide);
    if (index === 0) {
      indicator.classList.add('hero-carousel-indicator-active');
    }
    indicators.appendChild(indicator);
  });

  // Create actions container (play/pause for desktop indicators)
  const indicatorActions = document.createElement('div');
  indicatorActions.className = 'hero-carousel-indicator-actions';

  if (hasAutoplay) {
    const playPauseBtn = createPlayPauseButton(true);
    indicatorActions.appendChild(playPauseBtn);
  }

  indicatorsContainer.appendChild(indicators);
  indicatorsContainer.appendChild(indicatorActions);

  // Create navigation actions (prev/next arrows)
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'hero-carousel-actions';

  const prevBtn = createNavButton('prev');
  const nextBtn = createNavButton('next');

  actionsContainer.appendChild(prevBtn);
  actionsContainer.appendChild(nextBtn);

  // Carousel state
  let currentIndex = 0;
  let isPlaying = hasAutoplay;
  let autoplayInterval = null;
  let touchStartX = 0;
  let touchEndX = 0;

  /**
   * Updates the carousel to show the current slide
   */
  function updateCarousel() {
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update indicators
    const indicatorButtons = indicators.querySelectorAll('.hero-carousel-indicator');
    indicatorButtons.forEach((btn, index) => {
      btn.classList.remove('hero-carousel-indicator-active', 'hero-carousel-indicator-previous');

      if (index === currentIndex) {
        btn.classList.add('hero-carousel-indicator-active');
      } else if (index < currentIndex) {
        btn.classList.add('hero-carousel-indicator-previous');
      }
    });

    // Update active indicator position for desktop pause button
    if (hasAutoplay) {
      const activeIndicator = indicatorButtons[currentIndex];
      if (activeIndicator) {
        const indicatorRect = activeIndicator.getBoundingClientRect();
        const containerRect = indicators.getBoundingClientRect();
        const offset = indicatorRect.left - containerRect.left + indicatorRect.width / 2;
        indicatorsContainer.style.setProperty('--active-indicator-x-offset', `${offset}px`);
      }
    }

    // Reset animation for active indicator
    if (isPlaying) {
      indicatorButtons.forEach((btn) => {
        const afterStyle = btn.querySelector('::after');
        // eslint-disable-next-line no-self-assign
        btn.style.animation = btn.style.animation; // Force reflow
      });
    }
  }

  /**
   * Go to a specific slide
   * @param {number} index - Target slide index
   */
  function goToSlide(index) {
    currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;
    updateCarousel();

    // Restart autoplay timer
    if (isPlaying) {
      stopAutoplay();
      startAutoplay();
    }
  }

  /**
   * Go to the next slide
   */
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  /**
   * Go to the previous slide
   */
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  /**
   * Start autoplay
   */
  function startAutoplay() {
    if (!hasAutoplay) return;
    isPlaying = true;
    block.classList.add('autoplay');
    block.classList.remove('paused');

    autoplayInterval = setInterval(nextSlide, CAROUSEL_DELAY);

    // Update play/pause button
    const playPauseBtn = indicatorActions.querySelector('.hero-carousel-action-play');
    if (playPauseBtn) {
      playPauseBtn.classList.remove('hero-carousel-action-play');
      playPauseBtn.classList.add('hero-carousel-action-pause');
      playPauseBtn.setAttribute('aria-label', 'Pause autoplay');
    }
  }

  /**
   * Stop autoplay
   */
  function stopAutoplay() {
    isPlaying = false;
    block.classList.remove('autoplay');
    block.classList.add('paused');

    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }

    // Update play/pause button
    const playPauseBtn = indicatorActions.querySelector('.hero-carousel-action-pause');
    if (playPauseBtn) {
      playPauseBtn.classList.remove('hero-carousel-action-pause');
      playPauseBtn.classList.add('hero-carousel-action-play');
      playPauseBtn.setAttribute('aria-label', 'Play autoplay');
    }
  }

  /**
   * Toggle autoplay
   */
  function toggleAutoplay() {
    if (isPlaying) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  }

  // Event listeners for navigation
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Event listener for play/pause
  indicatorActions.addEventListener('click', (e) => {
    const btn = e.target.closest('.hero-carousel-action-pause, .hero-carousel-action-play');
    if (btn) {
      toggleAutoplay();
    }
  });

  // Event listeners for indicators
  indicators.addEventListener('click', (e) => {
    const indicator = e.target.closest('.hero-carousel-indicator');
    if (indicator) {
      const index = [...indicators.children].indexOf(indicator);
      goToSlide(index);
    }
  });

  // Touch/swipe support
  slidesContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    if (isPlaying) {
      stopAutoplay();
    }
  }, { passive: true });

  slidesContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, { passive: true });

  // Keyboard navigation
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      toggleAutoplay();
    }
  });

  // Pause on hover (optional behavior)
  block.addEventListener('mouseenter', () => {
    if (isPlaying && hasAutoplay) {
      stopAutoplay();
    }
  });

  block.addEventListener('mouseleave', () => {
    if (!isPlaying && hasAutoplay && !block.classList.contains('user-paused')) {
      startAutoplay();
    }
  });

  // Track user-initiated pause
  indicatorActions.addEventListener('click', () => {
    if (!isPlaying) {
      block.classList.add('user-paused');
    } else {
      block.classList.remove('user-paused');
    }
  });

  // Clear block and rebuild
  block.textContent = '';
  block.appendChild(slidesContainer);
  block.appendChild(actionsContainer);
  block.appendChild(indicatorsContainer);

  // Set initial state
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  block.setAttribute('aria-label', 'Hero Carousel');
  block.tabIndex = 0;

  // Initialize
  updateCarousel();

  // Start autoplay if enabled
  if (hasAutoplay) {
    startAutoplay();
  }
}
