/**
 * Content Fragment Block
 * Displays a Content Fragment's Title and Body content from AEM.
 * This is a simple, debug-friendly implementation.
 */

/**
 * Fetches content fragment data from AEM
 * @param {string} fragmentPath - The path to the content fragment
 * @returns {Promise<Object|null>} The fragment data or null if fetch fails
 */
async function fetchContentFragment(fragmentPath) {
  if (!fragmentPath) {
    return null;
  }

  try {
    // Try to fetch the content fragment JSON
    // AEM Content Fragments are typically available at path.model.json or via GraphQL
    const response = await fetch(`${fragmentPath}.json`);
    if (response.ok) {
      return response.json();
    }

    // Fallback: try .model.json endpoint
    const modelResponse = await fetch(`${fragmentPath}.model.json`);
    if (modelResponse.ok) {
      return modelResponse.json();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching content fragment:', error);
  }

  return null;
}

/**
 * Extracts the fragment path from the block content
 * @param {HTMLElement} block - The block element
 * @returns {string|null} The fragment path or null
 */
function getFragmentPath(block) {
  // Check for a link element first (common pattern)
  const link = block.querySelector('a');
  if (link) {
    return link.getAttribute('href');
  }

  // Otherwise, try to get text content from the first cell
  const firstRow = block.querySelector(':scope > div');
  if (firstRow) {
    const firstCell = firstRow.querySelector(':scope > div');
    if (firstCell) {
      return firstCell.textContent.trim();
    }
  }

  // Fallback to block's text content
  const text = block.textContent.trim();
  return text || null;
}

/**
 * Creates the debug info section
 * @param {string} fragmentPath - The path to the content fragment
 * @param {string} variation - The selected variation name
 * @returns {HTMLElement} The debug info element
 */
function createDebugInfo(fragmentPath, variation) {
  const debugInfo = document.createElement('div');
  debugInfo.className = 'content-fragment-debug';
  debugInfo.innerHTML = `
    <span class="debug-label">DEBUG INFO</span>
    <div class="debug-details">
      <div class="debug-item">
        <strong>Fragment Path:</strong>
        <code>${fragmentPath || 'Not specified'}</code>
      </div>
      ${variation ? `
      <div class="debug-item">
        <strong>Variation:</strong>
        <code>${variation}</code>
      </div>
      ` : ''}
    </div>
  `;
  return debugInfo;
}

/**
 * Creates a placeholder when no content fragment is selected
 * @returns {HTMLElement} The placeholder element
 */
function createPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'content-fragment-placeholder';
  placeholder.innerHTML = `
    <div class="placeholder-icon">CF</div>
    <div class="placeholder-text">
      <strong>Content Fragment Block</strong>
      <p>No content fragment selected. Use the Universal Editor to select a content fragment.</p>
    </div>
  `;
  return placeholder;
}

/**
 * Renders the content fragment content
 * @param {Object} data - The fragment data
 * @returns {HTMLElement} The content element
 */
function renderContent(data) {
  const content = document.createElement('div');
  content.className = 'content-fragment-content';

  // Extract title - check various possible locations in the data structure
  let title = '';
  let body = '';

  if (data) {
    // Common patterns for title in CF data
    title = data.title
      || data.jcr?.title
      || data.elements?.title?.value
      || data.data?.title
      || data.properties?.title
      || '';

    // Common patterns for body/description in CF data
    body = data.body
      || data.description
      || data.text
      || data.elements?.body?.value
      || data.elements?.description?.value
      || data.elements?.text?.value
      || data.data?.body
      || data.data?.description
      || data.properties?.description
      || '';
  }

  // Create title section
  const titleSection = document.createElement('div');
  titleSection.className = 'content-fragment-title-section';
  titleSection.innerHTML = `
    <span class="field-label">Title</span>
    <h2 class="fragment-title">${title || '<em>No title available</em>'}</h2>
  `;

  // Create body section
  const bodySection = document.createElement('div');
  bodySection.className = 'content-fragment-body-section';
  bodySection.innerHTML = `
    <span class="field-label">Body</span>
    <div class="fragment-body">${body || '<em>No body content available</em>'}</div>
  `;

  content.appendChild(titleSection);
  content.appendChild(bodySection);

  // If we have the raw data, also show it for debugging
  if (data) {
    const rawSection = document.createElement('details');
    rawSection.className = 'content-fragment-raw';
    rawSection.innerHTML = `
      <summary>View Raw Data</summary>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    content.appendChild(rawSection);
  }

  return content;
}

/**
 * Main decorate function for the Content Fragment block
 * @param {HTMLElement} block - The block element to decorate
 */
export default async function decorate(block) {
  // Get the fragment path from the block content
  const fragmentPath = getFragmentPath(block);

  // Check for variation name (may be in second row or as data attribute)
  let variation = '';
  const rows = block.querySelectorAll(':scope > div');
  if (rows.length > 1) {
    const variationCell = rows[1].querySelector(':scope > div');
    if (variationCell) {
      variation = variationCell.textContent.trim();
    }
  }

  // Clear the block content
  block.textContent = '';

  // Create the wrapper structure
  const wrapper = document.createElement('div');
  wrapper.className = 'content-fragment-wrapper';

  // Add header
  const header = document.createElement('div');
  header.className = 'content-fragment-header';
  header.innerHTML = '<span class="block-type-label">Content Fragment</span>';
  wrapper.appendChild(header);

  // Add debug info
  wrapper.appendChild(createDebugInfo(fragmentPath, variation));

  if (!fragmentPath) {
    // Show placeholder when no fragment is selected
    wrapper.appendChild(createPlaceholder());
  } else {
    // Fetch and render the content fragment
    const fragmentData = await fetchContentFragment(fragmentPath);

    if (fragmentData) {
      wrapper.appendChild(renderContent(fragmentData));
    } else {
      // Show error/fallback when fetch fails
      const errorSection = document.createElement('div');
      errorSection.className = 'content-fragment-error';
      errorSection.innerHTML = `
        <strong>Could not load content fragment</strong>
        <p>The content fragment at "${fragmentPath}" could not be loaded.</p>
        <p>This may be expected if:</p>
        <ul>
          <li>The content fragment hasn't been published yet</li>
          <li>The JSON endpoint is not available in this environment</li>
          <li>CORS restrictions are preventing the fetch</li>
        </ul>
      `;
      wrapper.appendChild(errorSection);
      wrapper.appendChild(renderContent(null));
    }
  }

  block.appendChild(wrapper);
}
