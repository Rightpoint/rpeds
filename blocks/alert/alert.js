export default function decorate(block) {
  const contentDiv = block.children[0];

  const wrapper = document.createElement('div');
  wrapper.className = 'alert-wrapper';

  // Detect type from class or content
  let type = 'info';
  if (block.classList.contains('warning')) type = 'warning';
  else if (block.classList.contains('error') || block.classList.contains('danger')) type = 'error';
  else if (block.classList.contains('success')) type = 'success';
  else if (block.classList.contains('info')) type = 'info';

  wrapper.dataset.type = type;

  // Icon
  const icon = document.createElement('div');
  icon.className = 'alert-icon';
  switch (type) {
    case 'success':
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>';
      break;
    case 'warning':
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
      break;
    case 'error':
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
      break;
    default:
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  }
  wrapper.append(icon);

  // Content
  const content = document.createElement('div');
  content.className = 'alert-content';
  if (contentDiv) {
    content.innerHTML = contentDiv.innerHTML;
  }
  wrapper.append(content);

  // Dismissible
  if (block.classList.contains('dismissible')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'alert-close';
    closeBtn.setAttribute('aria-label', 'Dismiss alert');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      block.style.display = 'none';
    });
    wrapper.append(closeBtn);
  }

  block.textContent = '';
  block.append(wrapper);
}
