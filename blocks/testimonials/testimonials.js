import { createOptimizedPicture } from '../../scripts/aem.js';

function createTestimonialCard(item) {
  const card = document.createElement('div');
  card.className = 'testimonial-card';

  const quoteDiv = item.children[0];
  const authorDiv = item.children[1];
  const imageDiv = item.children[2];

  // Stars rating (if included in quote text as number)
  const quoteText = quoteDiv?.textContent || '';
  const ratingMatch = quoteText.match(/^(\d)\/5\s*/);
  if (ratingMatch) {
    const rating = parseInt(ratingMatch[1], 10);
    const stars = document.createElement('div');
    stars.className = 'testimonial-stars';
    stars.innerHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    card.append(stars);
  }

  // Quote
  if (quoteDiv) {
    const quote = document.createElement('blockquote');
    quote.className = 'testimonial-quote';
    let html = quoteDiv.innerHTML;
    // Remove rating from beginning if present
    html = html.replace(/^(\d)\/5\s*/, '');
    quote.innerHTML = html;
    card.append(quote);
  }

  // Author info
  const author = document.createElement('div');
  author.className = 'testimonial-author';

  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
      picture.className = 'testimonial-avatar';
      author.append(picture);
    }
  }

  if (authorDiv) {
    const info = document.createElement('div');
    info.className = 'testimonial-info';
    info.innerHTML = authorDiv.innerHTML;
    author.append(info);
  }

  if (author.children.length > 0) {
    card.append(author);
  }

  return card;
}

export default function decorate(block) {
  const items = [...block.children];
  const container = document.createElement('div');
  container.className = 'testimonials-container';

  items.forEach((item) => {
    container.append(createTestimonialCard(item));
  });

  block.textContent = '';
  block.append(container);
}
