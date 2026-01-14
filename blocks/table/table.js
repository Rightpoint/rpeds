export default function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const hasHeader = !block.classList.contains('no-header');
  const rows = [...block.children];

  rows.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    const cells = [...row.children];

    cells.forEach((cell) => {
      const isHeaderRow = hasHeader && rowIndex === 0;
      const cellElement = document.createElement(isHeaderRow ? 'th' : 'td');
      cellElement.innerHTML = cell.innerHTML;

      // Check for colspan/rowspan data attributes
      if (cell.dataset.colspan) {
        cellElement.setAttribute('colspan', cell.dataset.colspan);
      }
      if (cell.dataset.rowspan) {
        cellElement.setAttribute('rowspan', cell.dataset.rowspan);
      }

      tr.append(cellElement);
    });

    if (hasHeader && rowIndex === 0) {
      thead.append(tr);
    } else {
      tbody.append(tr);
    }
  });

  if (thead.children.length > 0) {
    table.append(thead);
  }
  table.append(tbody);

  // Wrap table for horizontal scrolling
  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrapper';
  wrapper.append(table);

  block.textContent = '';
  block.append(wrapper);
}
