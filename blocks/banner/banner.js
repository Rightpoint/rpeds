export default function decorate(block) {
  const contentDiv = block.children[0];
  const actionsDiv = block.children[1];

  const wrapper = document.createElement('div');
  wrapper.className = 'banner-wrapper';

  // Icon (if dismissible)
  if (block.classList.contains('dismissible')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'banner-close';
    closeBtn.setAttribute('aria-label', 'Dismiss banner');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      block.style.display = 'none';
      // Optionally save to sessionStorage
      const bannerId = block.dataset.id || 'default-banner';
      sessionStorage.setItem(`banner-dismissed-${bannerId}`, 'true');
    });
    wrapper.append(closeBtn);
  }

  // Check if already dismissed
  const bannerId = block.dataset.id || 'default-banner';
  if (sessionStorage.getItem(`banner-dismissed-${bannerId}`)) {
    block.style.display = 'none';
  }

  // Content
  if (contentDiv) {
    const content = document.createElement('div');
    content.className = 'banner-content';
    content.innerHTML = contentDiv.innerHTML;
    wrapper.append(content);
  }

  // Action buttons
  if (actionsDiv) {
    const actions = document.createElement('div');
    actions.className = 'banner-actions';
    actions.innerHTML = actionsDiv.innerHTML;
    actions.querySelectorAll('a').forEach((link) => {
      link.classList.add('banner-button');
    });
    wrapper.append(actions);
  }

  block.textContent = '';
  block.append(wrapper);
}
