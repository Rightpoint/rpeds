/**
 * Hero Block - Genpact-inspired implementation
 * Supports homepage variant with dynamic aspect ratio
 */
export default function decorate(block) {
  // Check for homepage variant
  const isHomepage = block.classList.contains('homepage');

  if (isHomepage) {
    // Get aspect ratio from data attribute if provided
    const aspectRatio = block.dataset.aspectRatio;
    if (aspectRatio) {
      block.style.setProperty('--aspect-ratio', aspectRatio);
    }
  }

  // Structure the content for proper flexbox layout
  const rows = [...block.children];

  if (rows.length >= 2) {
    // First row is content, second row is asset
    const contentRow = rows[0];
    const assetRow = rows[1];

    // Add semantic classes for styling hooks
    contentRow.classList.add('hero-content');
    assetRow.classList.add('hero-asset');

    // Find and style pretitle if it exists
    const firstP = contentRow.querySelector('p:first-child');
    if (firstP && firstP.nextElementSibling) {
      firstP.classList.add('pretitle');
    }

    // Wrap action links in a container if they exist
    const buttons = contentRow.querySelectorAll('a.button');
    if (buttons.length > 0) {
      const actionContainer = document.createElement('div');
      actionContainer.classList.add('action-container');
      buttons.forEach((btn) => {
        actionContainer.appendChild(btn.cloneNode(true));
      });

      // Find the button container and replace with styled version
      const existingContainer = contentRow.querySelector('.button-container');
      if (existingContainer) {
        existingContainer.replaceWith(actionContainer);
      }
    }
  }

  // Handle video content if present
  const video = block.querySelector('video');
  if (video) {
    const videoWrapper = document.createElement('div');
    videoWrapper.classList.add('video-wrapper');
    video.parentNode.insertBefore(videoWrapper, video);
    videoWrapper.appendChild(video);

    // Check for caption
    const caption = block.querySelector('.video-caption, figcaption');
    if (caption) {
      videoWrapper.appendChild(caption);
    }
  }
}
