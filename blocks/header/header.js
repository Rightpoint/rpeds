import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

// SVG icons
const icons = {
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`,
};

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
      if (navSectionExpanded && isDesktop.matches) {
        toggleAllNavSections(navSections);
        navSectionExpanded.focus();
      } else if (!isDesktop.matches) {
        toggleMenu(nav, navSections);
        nav.querySelector('button').focus();
      }
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
      if (navSectionExpanded && isDesktop.matches) {
        toggleAllNavSections(navSections, false);
      } else if (!isDesktop.matches) {
        toggleMenu(nav, navSections, false);
      }
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.classList.contains('nav-drop');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll(':scope > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }

  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Creates the announcement banner
 * @returns {Element} The banner element
 */
function createAnnouncementBanner() {
  const banner = document.createElement('div');
  banner.className = 'announcement-banner';
  banner.innerHTML = `
    <a href="#" class="announcement-link">
      <span class="announcement-text">The Autonomous Enterprise Is Coming, And Genpact Research Finds 12% Are Leading The Way</span>
    </a>
    <button type="button" class="announcement-close" aria-label="Close the alert bar">
      ${icons.close}
    </button>
  `;

  // Close button functionality
  banner.querySelector('.announcement-close').addEventListener('click', () => {
    banner.classList.add('hidden');
    document.body.classList.remove('has-announcement');
  });

  return banner;
}

/**
 * Creates the search form
 * @returns {Element} The search element
 */
function createSearchElement() {
  const searchContainer = document.createElement('div');
  searchContainer.className = 'nav-search';
  searchContainer.innerHTML = `
    <button type="button" class="search-toggle" aria-label="Toggle Search">
      ${icons.search}
    </button>
    <div class="search-form hidden">
      <form>
        <input type="text" placeholder="What can we help you find?" aria-label="Search">
        <button type="submit" aria-label="Submit search">${icons.search}</button>
      </form>
    </div>
  `;

  const toggle = searchContainer.querySelector('.search-toggle');
  const form = searchContainer.querySelector('.search-form');
  toggle.addEventListener('click', () => {
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) {
      form.querySelector('input').focus();
    }
  });

  return searchContainer;
}

/**
 * Creates the region selector
 * @returns {Element} The region selector element
 */
function createRegionSelector() {
  const regionContainer = document.createElement('div');
  regionContainer.className = 'nav-region';
  regionContainer.innerHTML = `
    <button type="button" class="region-toggle" aria-label="Select region">
      ${icons.globe}
      <span class="region-current">US</span>
      ${icons.chevronDown}
    </button>
    <div class="region-dropdown hidden">
      <ul>
        <li><a href="/" class="active">US</a></li>
        <li><a href="/de">DE</a></li>
        <li><a href="/jp">JP</a></li>
        <li><a href="/au">AU</a></li>
      </ul>
    </div>
  `;

  const toggle = regionContainer.querySelector('.region-toggle');
  const dropdown = regionContainer.querySelector('.region-dropdown');
  toggle.addEventListener('click', () => {
    dropdown.classList.toggle('hidden');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!regionContainer.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  return regionContainer;
}

/**
 * Creates the contact button
 * @returns {Element} The contact button element
 */
function createContactButton() {
  const contactContainer = document.createElement('div');
  contactContainer.className = 'nav-contact';
  contactContainer.innerHTML = `
    <a href="/contact-us" class="contact-button">Contact Us</a>
  `;
  return contactContainer;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';

  // Create wrapper for the entire header
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'header-wrapper';

  // Create and add announcement banner
  const announcementBanner = createAnnouncementBanner();
  headerWrapper.appendChild(announcementBanner);
  document.body.classList.add('has-announcement');

  // Create main header container
  const mainHeader = document.createElement('div');
  mainHeader.className = 'main-header';

  // Create nav wrapper
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  const nav = document.createElement('nav');
  nav.id = 'nav';

  // Extract content from fragment
  const tempContainer = document.createElement('div');
  while (fragment.firstElementChild) tempContainer.append(fragment.firstElementChild);

  // Find the brand - look for the first link or strong text
  const navBrand = document.createElement('div');
  navBrand.className = 'nav-brand';
  const brandLink = tempContainer.querySelector('a');
  if (brandLink) {
    const brandWrapper = document.createElement('div');
    brandWrapper.className = 'brand-link-wrapper';
    brandWrapper.appendChild(brandLink.cloneNode(true));
    navBrand.appendChild(brandWrapper);
  }

  // Find the nav menu - look for the first ul in the fragment
  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';
  const menuList = tempContainer.querySelector('ul');
  if (menuList) {
    // Clone the menu list and process it
    const navMenu = menuList.cloneNode(true);
    navMenu.className = 'nav-menu';

    // Process each top-level item
    navMenu.querySelectorAll(':scope > li').forEach((li) => {
      // Check if this item has a submenu (child ul)
      const subMenu = li.querySelector('ul');
      if (subMenu) {
        li.classList.add('nav-drop');
        subMenu.classList.add('nav-submenu');
      }

      // Add click handler for dropdowns
      li.addEventListener('click', (e) => {
        if (isDesktop.matches && li.classList.contains('nav-drop')) {
          e.stopPropagation();
          const expanded = li.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });

    navSections.appendChild(navMenu);
  }

  // Create tools section with search, region, and contact
  const navTools = document.createElement('div');
  navTools.className = 'nav-tools';
  navTools.appendChild(createSearchElement());
  navTools.appendChild(createRegionSelector());
  navTools.appendChild(createContactButton());

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  // Assemble the nav
  nav.appendChild(hamburger);
  nav.appendChild(navBrand);
  nav.appendChild(navSections);
  nav.appendChild(navTools);

  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  navWrapper.append(nav);
  mainHeader.append(navWrapper);
  headerWrapper.append(mainHeader);
  block.append(headerWrapper);
}
