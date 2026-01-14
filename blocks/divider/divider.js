export default function decorate(block) {
  const content = block.textContent.trim();
  const hr = document.createElement('hr');
  hr.className = 'divider-line';

  // If there's content, create a divider with text
  if (content) {
    const wrapper = document.createElement('div');
    wrapper.className = 'divider-wrapper';

    const text = document.createElement('span');
    text.className = 'divider-text';
    text.textContent = content;

    wrapper.append(hr.cloneNode());
    wrapper.append(text);
    wrapper.append(hr.cloneNode());

    block.textContent = '';
    block.append(wrapper);
  } else {
    block.textContent = '';
    block.append(hr);
  }
}
