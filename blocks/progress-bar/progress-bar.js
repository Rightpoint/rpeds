export default function decorate(block) {
  const items = [...block.children];
  const container = document.createElement('div');
  container.className = 'progress-container';

  items.forEach((item) => {
    const progressItem = document.createElement('div');
    progressItem.className = 'progress-item';

    const labelDiv = item.children[0];
    const valueDiv = item.children[1];

    const labelText = labelDiv?.textContent?.trim() || '';
    const valueText = valueDiv?.textContent?.trim() || '0';

    // Parse value (handle "75%", "75", "3/4", etc.)
    let percentage = 0;
    if (valueText.includes('%')) {
      percentage = parseFloat(valueText);
    } else if (valueText.includes('/')) {
      const [num, denom] = valueText.split('/').map((n) => parseFloat(n.trim()));
      percentage = (num / denom) * 100;
    } else {
      percentage = parseFloat(valueText);
      if (percentage > 100) percentage = 100;
    }

    // Label row
    const labelRow = document.createElement('div');
    labelRow.className = 'progress-label-row';

    if (labelText) {
      const label = document.createElement('span');
      label.className = 'progress-label';
      label.textContent = labelText;
      labelRow.append(label);
    }

    const value = document.createElement('span');
    value.className = 'progress-value';
    value.textContent = `${Math.round(percentage)}%`;
    labelRow.append(value);

    progressItem.append(labelRow);

    // Progress bar
    const track = document.createElement('div');
    track.className = 'progress-track';
    track.setAttribute('role', 'progressbar');
    track.setAttribute('aria-valuenow', percentage);
    track.setAttribute('aria-valuemin', 0);
    track.setAttribute('aria-valuemax', 100);

    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = '0%';
    fill.dataset.value = percentage;

    track.append(fill);
    progressItem.append(track);

    container.append(progressItem);
  });

  // Animate on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.progress-fill');
        fills.forEach((fill) => {
          fill.style.width = `${fill.dataset.value}%`;
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  block.textContent = '';
  block.append(container);

  observer.observe(block);
}
