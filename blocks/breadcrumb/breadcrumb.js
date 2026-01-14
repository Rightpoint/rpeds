export default function decorate(block) {
  const items = [...block.children];
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  // If no items provided, auto-generate from URL path
  if (items.length === 0) {
    const path = window.location.pathname;
    const segments = path.split('/').filter((s) => s);

    // Add home
    const homeLi = document.createElement('li');
    homeLi.className = 'breadcrumb-item';
    const homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
    homeLi.append(homeLink);
    ol.append(homeLi);

    // Add path segments
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const li = document.createElement('li');
      li.className = 'breadcrumb-item';

      // Format segment name (remove extension, replace dashes)
      const name = segment
        .replace(/\.[^.]+$/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      if (index === segments.length - 1) {
        // Current page (no link)
        const span = document.createElement('span');
        span.setAttribute('aria-current', 'page');
        span.textContent = name;
        li.append(span);
      } else {
        const link = document.createElement('a');
        link.href = currentPath;
        link.textContent = name;
        li.append(link);
      }

      ol.append(li);
    });
  } else {
    // Use provided items
    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'breadcrumb-item';

      const link = item.querySelector('a');
      if (link && index < items.length - 1) {
        li.append(link.cloneNode(true));
      } else {
        const span = document.createElement('span');
        span.setAttribute('aria-current', 'page');
        span.textContent = item.textContent.trim();
        li.append(span);
      }

      ol.append(li);
    });
  }

  nav.append(ol);

  // Add schema.org markup
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [],
  };

  ol.querySelectorAll('.breadcrumb-item').forEach((li, index) => {
    const link = li.querySelector('a');
    const span = li.querySelector('span');
    schema.itemListElement.push({
      '@type': 'ListItem',
      position: index + 1,
      name: link?.textContent || span?.textContent,
      item: link?.href || undefined,
    });
  });

  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.textContent = JSON.stringify(schema);

  block.textContent = '';
  block.append(nav);
  block.append(schemaScript);
}
