import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const contentDiv = block.children[0];
  const imageDiv = block.children[1];

  const wrapper = document.createElement('div');
  wrapper.className = 'cta-wrapper';

  // Content section
  if (contentDiv) {
    const content = document.createElement('div');
    content.className = 'cta-content';
    content.innerHTML = contentDiv.innerHTML;

    // Style links as buttons
    content.querySelectorAll('a').forEach((link, index) => {
      link.classList.add('cta-button');
      if (index === 0) {
        link.classList.add('cta-button-primary');
      } else {
        link.classList.add('cta-button-secondary');
      }
    });

    wrapper.append(content);
  }

  // Image section
  if (imageDiv) {
    const image = document.createElement('div');
    image.className = 'cta-image';
    const img = imageDiv.querySelector('img');
    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]);
      image.append(picture);
    }
    wrapper.append(image);
  }

  block.textContent = '';
  block.append(wrapper);
}
