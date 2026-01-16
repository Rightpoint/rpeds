/**
 * Builds and decorates the footer with Genpact-style layout
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';

  // Create main footer container
  const footer = document.createElement('div');
  footer.className = 'footer-wrapper';

  // Left column - logo, social, copyright
  const leftColumn = document.createElement('div');
  leftColumn.className = 'footer-left';

  // Logo section
  const logoSection = document.createElement('div');
  logoSection.className = 'footer-logo';

  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.setAttribute('aria-label', 'Genpact Home');

  // Genpact logo SVG
  const logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  logoSvg.setAttribute('viewBox', '0 0 200 50');
  logoSvg.setAttribute('width', '160');
  logoSvg.setAttribute('height', '40');
  logoSvg.innerHTML = `
    <style>
      .logo-text { fill: #fff; font-family: Arial, sans-serif; font-weight: bold; font-size: 24px; }
      .logo-icon { fill: #c9a227; }
    </style>
    <g class="logo-icon">
      <polygon points="20,5 35,15 35,35 20,45 5,35 5,15"/>
      <polygon points="20,12 28,18 28,32 20,38 12,32 12,18" fill="#3c3c3c"/>
      <line x1="20" y1="5" x2="20" y2="12" stroke="#c9a227" stroke-width="2"/>
      <line x1="35" y1="15" x2="28" y2="18" stroke="#c9a227" stroke-width="2"/>
      <line x1="35" y1="35" x2="28" y2="32" stroke="#c9a227" stroke-width="2"/>
      <line x1="20" y1="45" x2="20" y2="38" stroke="#c9a227" stroke-width="2"/>
      <line x1="5" y1="35" x2="12" y2="32" stroke="#c9a227" stroke-width="2"/>
      <line x1="5" y1="15" x2="12" y2="18" stroke="#c9a227" stroke-width="2"/>
    </g>
    <text x="45" y="32" class="logo-text">genpact</text>
  `;
  logoLink.appendChild(logoSvg);
  logoSection.appendChild(logoLink);

  // Tagline
  const tagline = document.createElement('span');
  tagline.className = 'tagline';
  tagline.textContent = 'on it';
  logoSection.appendChild(tagline);

  leftColumn.appendChild(logoSection);

  // Social media section
  const socialSection = document.createElement('div');
  socialSection.className = 'footer-social';

  const socialLinks = [
    { name: 'X', url: 'https://x.com/rightpoint', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
    { name: 'Facebook', url: 'http://www.facebook.com/pages/Rightpoint/152725551865', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/rightpoint', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { name: 'Instagram', url: 'https://www.instagram.com/therightpoint/', icon: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z' },
  ];

  socialLinks.forEach((social) => {
    const link = document.createElement('a');
    link.href = social.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Visit Genpact on ${social.name}`);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('fill', 'currentColor');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', social.icon);
    svg.appendChild(path);
    link.appendChild(svg);
    socialSection.appendChild(link);
  });

  leftColumn.appendChild(socialSection);

  // Copyright
  const copyright = document.createElement('p');
  copyright.className = 'footer-copyright';
  copyright.textContent = `Copyright \u00A9 Genpact ${new Date().getFullYear()}. All rights reserved.`;
  leftColumn.appendChild(copyright);

  footer.appendChild(leftColumn);

  // Right column - navigation links
  const rightColumn = document.createElement('div');
  rightColumn.className = 'footer-right';

  const navSection = document.createElement('nav');
  navSection.className = 'footer-nav';

  const navLinks = [
    { text: 'Contact us', url: '/contact-us' },
    { text: 'Locations', url: '/about-us/locations' },
    { text: 'Our Purpose', url: '/about-us/purpose' },
    { text: 'Privacy', url: '/privacy' },
    { text: 'Terms and conditions', url: '/terms-and-conditions' },
  ];

  navLinks.forEach((navItem) => {
    const link = document.createElement('a');
    link.href = navItem.url;
    link.textContent = navItem.text;
    navSection.appendChild(link);
  });

  rightColumn.appendChild(navSection);
  footer.appendChild(rightColumn);

  block.appendChild(footer);
}
