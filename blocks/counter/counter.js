function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const easeProgress = 1 - (1 - progress) ** 3;
    const current = Math.floor(start + (target - start) * easeProgress);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

export default function decorate(block) {
  const items = [...block.children];
  const container = document.createElement('div');
  container.className = 'counter-container';

  const counters = [];

  items.forEach((item) => {
    const stat = document.createElement('div');
    stat.className = 'counter-stat';

    const valueDiv = item.children[0];
    const labelDiv = item.children[1];
    const iconDiv = item.children[2];

    // Parse value - look for numbers with optional prefix/suffix
    const valueText = valueDiv?.textContent?.trim() || '0';
    const match = valueText.match(/^([^\d]*)(\d+(?:,\d+)*)([^\d]*)$/);

    const prefix = match?.[1] || '';
    const numberStr = match?.[2]?.replace(/,/g, '') || '0';
    const suffix = match?.[3] || '';
    const targetValue = parseInt(numberStr, 10);

    // Icon
    if (iconDiv) {
      const icon = document.createElement('div');
      icon.className = 'counter-icon';
      icon.innerHTML = iconDiv.innerHTML;
      stat.append(icon);
    }

    // Value with prefix/suffix
    const valueWrapper = document.createElement('div');
    valueWrapper.className = 'counter-value';

    if (prefix) {
      const prefixSpan = document.createElement('span');
      prefixSpan.className = 'counter-prefix';
      prefixSpan.textContent = prefix;
      valueWrapper.append(prefixSpan);
    }

    const number = document.createElement('span');
    number.className = 'counter-number';
    number.textContent = '0';
    valueWrapper.append(number);

    if (suffix) {
      const suffixSpan = document.createElement('span');
      suffixSpan.className = 'counter-suffix';
      suffixSpan.textContent = suffix;
      valueWrapper.append(suffixSpan);
    }

    stat.append(valueWrapper);

    // Label
    if (labelDiv) {
      const label = document.createElement('div');
      label.className = 'counter-label';
      label.innerHTML = labelDiv.innerHTML;
      stat.append(label);
    }

    container.append(stat);
    counters.push({ element: number, target: targetValue });
  });

  // Intersection Observer for animation trigger
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        counters.forEach(({ element, target }) => {
          animateCounter(element, target);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  block.textContent = '';
  block.append(container);

  observer.observe(block);
}
