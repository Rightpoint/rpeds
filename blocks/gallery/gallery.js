import { createOptimizedPicture } from '../../scripts/aem.js';

function createLightbox() {
  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.innerHTML = `
    <button class="gallery-lightbox-close" aria-label="Close lightbox">&times;</button>
    <button class="gallery-lightbox-prev" aria-label="Previous image">&#10094;</button>
    <button class="gallery-lightbox-next" aria-label="Next image">&#10095;</button>
    <div class="gallery-lightbox-content">
      <img src="" alt="" />
    </div>
    <div class="gallery-lightbox-caption"></div>
  `;
  return lightbox;
}

export default function decorate(block) {
  const items = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'gallery-grid';

  const images = [];

  items.forEach((item, index) => {
    const img = item.querySelector('img');
    if (!img) return;

    const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.dataset.index = index;

    const caption = item.querySelector('p:not(:has(picture))');
    const captionText = caption?.textContent || img.alt || '';

    galleryItem.append(picture);
    grid.append(galleryItem);

    images.push({
      src: img.src,
      alt: img.alt,
      caption: captionText,
    });
  });

  // Create lightbox
  const lightbox = createLightbox();
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.gallery-lightbox-caption');
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = index;
    const image = images[index];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    lightboxCaption.textContent = image.caption;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add('gallery-lightbox-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('gallery-lightbox-open');
    document.body.style.overflow = '';
  }

  // Event listeners
  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) {
      openLightbox(parseInt(item.dataset.index, 10));
    }
  });

  lightbox.querySelector('.gallery-lightbox-close').addEventListener('click', closeLightbox);

  lightbox.querySelector('.gallery-lightbox-prev').addEventListener('click', () => {
    showImage((currentIndex - 1 + images.length) % images.length);
  });

  lightbox.querySelector('.gallery-lightbox-next').addEventListener('click', () => {
    showImage((currentIndex + 1) % images.length);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('gallery-lightbox-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage((currentIndex - 1 + images.length) % images.length);
    if (e.key === 'ArrowRight') showImage((currentIndex + 1) % images.length);
  });

  block.textContent = '';
  block.append(grid);
  block.append(lightbox);
}
