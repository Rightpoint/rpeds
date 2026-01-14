export default function decorate(block) {
  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  const tabContent = document.createElement('div');
  tabContent.className = 'tabs-content';

  [...block.children].forEach((item, index) => {
    const tabNameDiv = item.children[0];
    const contentDiv = item.children[1];

    const tabName = tabNameDiv?.textContent?.trim() || `Tab ${index + 1}`;
    const tabId = `tab-${index}`;
    const panelId = `panel-${index}`;

    // Create tab button
    const tab = document.createElement('button');
    tab.className = 'tabs-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('id', tabId);
    tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
    tab.textContent = tabName;
    if (index === 0) tab.classList.add('tabs-tab-active');
    tabList.append(tab);

    // Create tab panel
    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.setAttribute('id', panelId);
    panel.hidden = index !== 0;
    if (contentDiv) {
      panel.innerHTML = contentDiv.innerHTML;
    }
    tabContent.append(panel);
  });

  // Tab click handler
  tabList.addEventListener('click', (e) => {
    const clickedTab = e.target.closest('.tabs-tab');
    if (!clickedTab) return;

    const tabs = tabList.querySelectorAll('.tabs-tab');
    const panels = tabContent.querySelectorAll('.tabs-panel');

    tabs.forEach((tab, index) => {
      const isSelected = tab === clickedTab;
      tab.setAttribute('aria-selected', isSelected);
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      tab.classList.toggle('tabs-tab-active', isSelected);
      panels[index].hidden = !isSelected;
    });
  });

  // Keyboard navigation
  tabList.addEventListener('keydown', (e) => {
    const tabs = [...tabList.querySelectorAll('.tabs-tab')];
    const currentIndex = tabs.indexOf(document.activeElement);

    let newIndex;
    if (e.key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1;
    }

    if (newIndex !== undefined) {
      tabs[newIndex].focus();
      tabs[newIndex].click();
      e.preventDefault();
    }
  });

  block.textContent = '';
  block.append(tabList);
  block.append(tabContent);
}
