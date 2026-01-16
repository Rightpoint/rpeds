export default function decorate(block) {
  // Create the teaser-style container
  const wrapper = document.createElement('div');
  wrapper.className = 'phils-block-wrapper';

  // Create pretitle/tag
  const pretitle = document.createElement('span');
  pretitle.className = 'phils-block-pretitle';
  pretitle.textContent = 'Special Greeting';

  // Create title
  const title = document.createElement('h2');
  title.className = 'phils-block-title';
  title.textContent = 'Hello Phil';

  // Create description
  const description = document.createElement('p');
  description.className = 'phils-block-description';
  description.textContent = 'Welcome to this special block created just for you.';

  // Create read more link
  const readMore = document.createElement('span');
  readMore.className = 'phils-block-read-more';
  readMore.textContent = 'Learn more';

  // Assemble the block
  wrapper.append(pretitle, title, description, readMore);
  block.textContent = '';
  block.append(wrapper);
}
