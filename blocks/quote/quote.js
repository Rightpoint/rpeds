import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Quote block - styled like genpact.com quoteteaser
 *
 * Expected content structure from document:
 * Row 1: Quote text
 * Row 2: Author name (first line) and title/role (second line)
 * Row 3 (optional): Company logo image
 * Row 4 (optional): CTA link
 */
export default function decorate(block) {
  const blockquote = document.createElement('blockquote');

  const rows = [...block.children];
  const quoteDiv = rows[0];
  const authorDiv = rows[1];
  const logoDiv = rows[2];
  const ctaDiv = rows[3];

  // Double quotes icon
  const quoteIcon = document.createElement('span');
  quoteIcon.className = 'quote-icon icon icon-double-quotes';
  const iconImg = document.createElement('img');
  iconImg.src = `${window.hlx.codeBasePath}/icons/double-quotes.svg`;
  iconImg.alt = '';
  iconImg.loading = 'lazy';
  quoteIcon.append(iconImg);
  blockquote.append(quoteIcon);

  // Quote text
  if (quoteDiv) {
    const quote = document.createElement('p');
    quote.className = 'quote-text';
    // Get just the text content, stripping any inner divs
    const textContent = quoteDiv.querySelector('p, div');
    if (textContent) {
      quote.innerHTML = textContent.innerHTML;
    } else {
      quote.innerHTML = quoteDiv.innerHTML;
    }
    blockquote.append(quote);
  }

  // Author info section
  if (authorDiv) {
    const authorInfo = document.createElement('div');
    authorInfo.className = 'quote-author-info';

    // Parse author content - look for name and title
    const authorContent = authorDiv.querySelector('p, div');
    if (authorContent) {
      // Check for structured content (name in strong, title separate)
      const strongEl = authorContent.querySelector('strong');
      if (strongEl) {
        // Name in strong tag
        const authorText = document.createElement('p');
        authorText.className = 'quote-author-text';
        authorText.textContent = strongEl.textContent;
        authorInfo.append(authorText);

        // Get remaining text as title
        const clone = authorContent.cloneNode(true);
        const strongInClone = clone.querySelector('strong');
        if (strongInClone) strongInClone.remove();
        const titleText = clone.textContent.trim();
        if (titleText) {
          const attributeText = document.createElement('p');
          attributeText.className = 'quote-attribute-text';
          attributeText.textContent = titleText;
          authorInfo.append(attributeText);
        }
      } else {
        // Check for line breaks or multiple paragraphs
        const lines = authorContent.innerHTML.split(/<br\s*\/?>/i);
        if (lines.length >= 2) {
          const authorText = document.createElement('p');
          authorText.className = 'quote-author-text';
          authorText.textContent = lines[0].replace(/<[^>]*>/g, '').trim();
          authorInfo.append(authorText);

          const attributeText = document.createElement('p');
          attributeText.className = 'quote-attribute-text';
          attributeText.textContent = lines.slice(1).join(' ').replace(/<[^>]*>/g, '').trim();
          authorInfo.append(attributeText);
        } else {
          // Single line - treat as author name
          const authorText = document.createElement('p');
          authorText.className = 'quote-author-text';
          authorText.textContent = authorContent.textContent.trim();
          authorInfo.append(authorText);
        }
      }
    } else {
      // Direct text content
      const authorText = document.createElement('p');
      authorText.className = 'quote-author-text';
      authorText.textContent = authorDiv.textContent.trim();
      authorInfo.append(authorText);
    }

    blockquote.append(authorInfo);
  }

  // Company logo (optional)
  if (logoDiv) {
    const img = logoDiv.querySelector('img');
    if (img) {
      const logoContainer = document.createElement('div');
      logoContainer.className = 'quote-logo';
      const picture = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '200' }]);
      logoContainer.append(picture);
      blockquote.append(logoContainer);
    }
  }

  // CTA button (optional)
  if (ctaDiv) {
    const link = ctaDiv.querySelector('a');
    if (link) {
      const actionContainer = document.createElement('div');
      actionContainer.className = 'quote-action-container';
      link.className = 'button';
      actionContainer.append(link);
      blockquote.append(actionContainer);
    }
  }

  block.textContent = '';
  block.append(blockquote);
}
