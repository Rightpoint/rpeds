export default function decorate(block) {
  const indexPath = block.textContent.trim() || '/query-index.json';

  const wrapper = document.createElement('div');
  wrapper.className = 'search-wrapper';

  // Search input
  const form = document.createElement('form');
  form.className = 'search-form';
  form.setAttribute('role', 'search');

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'search-input-wrapper';

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'search-input';
  input.placeholder = 'Search...';
  input.setAttribute('aria-label', 'Search');

  const searchBtn = document.createElement('button');
  searchBtn.type = 'submit';
  searchBtn.className = 'search-button';
  searchBtn.setAttribute('aria-label', 'Submit search');
  searchBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';

  inputWrapper.append(input);
  inputWrapper.append(searchBtn);
  form.append(inputWrapper);

  // Results container
  const results = document.createElement('div');
  results.className = 'search-results';
  results.setAttribute('aria-live', 'polite');

  let searchData = null;

  async function loadSearchData() {
    if (searchData) return searchData;
    try {
      const resp = await fetch(indexPath);
      if (resp.ok) {
        const json = await resp.json();
        searchData = json.data || json;
        return searchData;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load search data:', e);
    }
    return [];
  }

  function performSearch(query) {
    if (!searchData || !query) return [];

    const terms = query.toLowerCase().split(/\s+/);
    return searchData.filter((item) => {
      const searchableText = `${item.title || ''} ${item.description || ''} ${item.path || ''}`.toLowerCase();
      return terms.every((term) => searchableText.includes(term));
    }).slice(0, 10);
  }

  function renderResults(items, query) {
    if (!query) {
      results.innerHTML = '';
      return;
    }

    if (items.length === 0) {
      results.innerHTML = '<p class="search-no-results">No results found</p>';
      return;
    }

    const ul = document.createElement('ul');
    ul.className = 'search-results-list';

    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'search-result-item';

      const link = document.createElement('a');
      link.href = item.path;
      link.className = 'search-result-link';

      const title = document.createElement('span');
      title.className = 'search-result-title';
      title.textContent = item.title || item.path;

      link.append(title);

      if (item.description) {
        const desc = document.createElement('span');
        desc.className = 'search-result-description';
        desc.textContent = item.description;
        link.append(desc);
      }

      li.append(link);
      ul.append(li);
    });

    results.innerHTML = '';
    results.append(ul);
  }

  // Event handlers
  let debounceTimer;
  input.addEventListener('input', async () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();

    if (query.length < 2) {
      results.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(async () => {
      await loadSearchData();
      const items = performSearch(query);
      renderResults(items, query);
    }, 300);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await loadSearchData();
    const query = input.value.trim();
    const items = performSearch(query);
    renderResults(items, query);
  });

  wrapper.append(form);
  wrapper.append(results);

  block.textContent = '';
  block.append(wrapper);
}
