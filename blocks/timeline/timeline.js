export default function decorate(block) {
  const items = [...block.children];
  const timeline = document.createElement('div');
  timeline.className = 'timeline-container';

  items.forEach((item, index) => {
    const entry = document.createElement('div');
    entry.className = 'timeline-entry';
    entry.dataset.index = index;

    const dateDiv = item.children[0];
    const titleDiv = item.children[1];
    const contentDiv = item.children[2];

    // Marker
    const marker = document.createElement('div');
    marker.className = 'timeline-marker';
    entry.append(marker);

    // Content wrapper
    const content = document.createElement('div');
    content.className = 'timeline-content';

    // Date/time
    if (dateDiv) {
      const date = document.createElement('div');
      date.className = 'timeline-date';
      date.innerHTML = dateDiv.innerHTML;
      content.append(date);
    }

    // Title
    if (titleDiv) {
      const title = document.createElement('h3');
      title.className = 'timeline-title';
      title.innerHTML = titleDiv.innerHTML;
      content.append(title);
    }

    // Description
    if (contentDiv) {
      const desc = document.createElement('div');
      desc.className = 'timeline-description';
      desc.innerHTML = contentDiv.innerHTML;
      content.append(desc);
    }

    entry.append(content);
    timeline.append(entry);
  });

  // Animate entries on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('timeline-entry-visible');
      }
    });
  }, { threshold: 0.2 });

  block.textContent = '';
  block.append(timeline);

  timeline.querySelectorAll('.timeline-entry').forEach((entry) => {
    observer.observe(entry);
  });
}
