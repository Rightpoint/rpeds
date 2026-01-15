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
    { name: 'X', url: 'https://x.com/genpact', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
    { name: 'Facebook', url: 'https://www.facebook.com/ProudToBeGenpact/', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/210064', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { name: 'YouTube', url: 'https://www.youtube.com/genpactltd', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
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
