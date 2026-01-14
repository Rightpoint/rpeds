import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Structure the footer content
  const wrapper = footer.querySelector('.default-content-wrapper');
  if (wrapper) {
    // Find and style logo
    const logoImg = wrapper.querySelector('picture img, img');
    if (logoImg) {
      logoImg.closest('p')?.classList.add('footer-logo-row');
    }

    // Find and style social links (links with icons)
    const socialLinks = wrapper.querySelectorAll('a .icon, a > span.icon');
    if (socialLinks.length > 0) {
      socialLinks.forEach((icon) => {
        const link = icon.closest('a');
        if (link) {
          link.classList.add('footer-social-link');
        }
      });
    }

    // Find copyright text (usually the last paragraph)
    const paragraphs = wrapper.querySelectorAll('p');
    if (paragraphs.length > 0) {
      const lastP = paragraphs[paragraphs.length - 1];
      if (lastP.textContent.toLowerCase().includes('copyright') || lastP.textContent.includes('©')) {
        lastP.classList.add('footer-copyright');
      }
    }
  }

  block.append(footer);
}
