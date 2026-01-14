export default function decorate(block) {
  const triggerDiv = block.children[0];
  const link = triggerDiv?.querySelector('a');
  const triggerText = triggerDiv?.textContent?.trim() || link?.textContent || 'Open Modal';
  const modalUrl = link?.href;

  // Create trigger button
  const trigger = document.createElement('button');
  trigger.className = 'modal-trigger';
  trigger.textContent = triggerText;

  // Create modal dialog
  const dialog = document.createElement('dialog');
  dialog.className = 'modal-dialog';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.setAttribute('aria-label', 'Close modal');
  closeBtn.innerHTML = '&times;';

  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';

  modalContent.append(closeBtn);
  modalContent.append(modalBody);
  dialog.append(modalContent);

  // Load content on open
  async function loadModalContent() {
    if (modalUrl && !modalBody.dataset.loaded) {
      try {
        const resp = await fetch(`${modalUrl}.plain.html`);
        if (resp.ok) {
          const html = await resp.text();
          modalBody.innerHTML = html;
          modalBody.dataset.loaded = 'true';
        }
      } catch (e) {
        modalBody.innerHTML = '<p>Failed to load content.</p>';
      }
    }
  }

  // Event handlers
  trigger.addEventListener('click', async () => {
    await loadModalContent();
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    dialog.close();
  });

  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  // Close on backdrop click
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
    }
  });

  // Close on Escape key
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dialog.close();
    }
  });

  block.textContent = '';
  block.append(trigger);
  block.append(dialog);
}
