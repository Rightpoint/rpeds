import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const blockquote = document.createElement('blockquote');

  const quoteDiv = block.children[0];
  const authorDiv = block.children[1];
  const imageDiv = block.children[2];

  // Quote text
  if (quoteDiv) {
    const quote = document.createElement('p');
    quote.className = 'quote-text';
    quote.innerHTML = quoteDiv.innerHTML;
    blockquote.append(quote);
  }

  // Author info
  if (authorDiv || imageDiv) {
    const footer = document.createElement('footer');
    footer.className = 'quote-footer';

    // Author image
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) {
        const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
        picture.className = 'quote-image';
        footer.append(picture);
      }
    }

    // Author details
    if (authorDiv) {
      const cite = document.createElement('cite');
      cite.className = 'quote-author';
      cite.innerHTML = authorDiv.innerHTML;
      footer.append(cite);
    }

    blockquote.append(footer);
  }

  block.textContent = '';
  block.append(blockquote);
}
