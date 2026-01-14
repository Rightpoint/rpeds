export default function decorate(block) {
  const items = [...block.children];

  items.forEach((item) => {
    const details = document.createElement('details');
    const summary = document.createElement('summary');

    const summaryDiv = item.children[0];
    const contentDiv = item.children[1];

    summary.textContent = summaryDiv?.textContent || 'Accordion Item';

    const content = document.createElement('div');
    content.className = 'accordion-content';
    if (contentDiv) {
      content.innerHTML = contentDiv.innerHTML;
    }

    details.append(summary);
    details.append(content);
    item.replaceWith(details);
  });

  // Optional: single-open behavior
  block.addEventListener('toggle', (e) => {
    if (e.target.open && block.dataset.singleOpen !== undefined) {
      block.querySelectorAll('details[open]').forEach((openDetails) => {
        if (openDetails !== e.target) {
          openDetails.open = false;
        }
      });
    }
  }, true);
}
