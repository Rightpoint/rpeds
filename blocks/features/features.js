import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const items = [...block.children];
  const container = document.createElement('div');
  container.className = 'features-container';

  items.forEach((item) => {
    const feature = document.createElement('div');
    feature.className = 'feature-item';

    const iconDiv = item.children[0];
    const titleDiv = item.children[1];
    const descDiv = item.children[2];
    const linkDiv = item.children[3];

    // Icon/Image
    if (iconDiv) {
      const icon = document.createElement('div');
      icon.className = 'feature-icon';

      const img = iconDiv.querySelector('img');
      if (img) {
        const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '64' }]);
        icon.append(picture);
      } else {
        // Use text/emoji as icon
        icon.innerHTML = iconDiv.innerHTML;
      }
      feature.append(icon);
    }

    // Content wrapper
    const content = document.createElement('div');
    content.className = 'feature-content';

    // Title
    if (titleDiv) {
      const title = document.createElement('h3');
      title.className = 'feature-title';
      title.innerHTML = titleDiv.innerHTML;
      content.append(title);
    }

    // Description
    if (descDiv) {
      const desc = document.createElement('div');
      desc.className = 'feature-description';
      desc.innerHTML = descDiv.innerHTML;
      content.append(desc);
    }

    // Link
    if (linkDiv) {
      const link = document.createElement('div');
      link.className = 'feature-link';
      const anchor = linkDiv.querySelector('a');
      if (anchor) {
        anchor.classList.add('feature-link-text');
        link.append(anchor.cloneNode(true));
      }
      content.append(link);
    }

    feature.append(content);
    container.append(feature);
  });

  block.textContent = '';
  block.append(container);
}
