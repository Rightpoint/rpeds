export default function decorate(block) {
  const titleDiv = block.children[0];
  const descDiv = block.children[1];
  const actionDiv = block.children[2];

  const wrapper = document.createElement('div');
  wrapper.className = 'newsletter-wrapper';

  // Content section
  const content = document.createElement('div');
  content.className = 'newsletter-content';

  if (titleDiv) {
    const title = document.createElement('h3');
    title.className = 'newsletter-title';
    title.innerHTML = titleDiv.innerHTML;
    content.append(title);
  }

  if (descDiv) {
    const desc = document.createElement('p');
    desc.className = 'newsletter-description';
    desc.innerHTML = descDiv.innerHTML;
    content.append(desc);
  }

  wrapper.append(content);

  // Form section
  const formWrapper = document.createElement('div');
  formWrapper.className = 'newsletter-form-wrapper';

  const form = document.createElement('form');
  form.className = 'newsletter-form';

  // Get action URL from content if provided
  const actionUrl = actionDiv?.querySelector('a')?.href || actionDiv?.textContent?.trim() || '#';

  form.setAttribute('action', actionUrl);
  form.setAttribute('method', 'POST');

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'newsletter-input-wrapper';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.className = 'newsletter-input';
  emailInput.placeholder = 'Enter your email';
  emailInput.required = true;
  emailInput.setAttribute('aria-label', 'Email address');

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'newsletter-submit';
  submitBtn.textContent = 'Subscribe';

  inputWrapper.append(emailInput);
  inputWrapper.append(submitBtn);
  form.append(inputWrapper);

  // Success/Error messages
  const message = document.createElement('div');
  message.className = 'newsletter-message';
  message.setAttribute('aria-live', 'polite');

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';

    try {
      if (actionUrl !== '#') {
        const resp = await fetch(actionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!resp.ok) throw new Error('Subscription failed');
      }

      message.className = 'newsletter-message newsletter-success';
      message.textContent = 'Thank you for subscribing!';
      emailInput.value = '';
    } catch (err) {
      message.className = 'newsletter-message newsletter-error';
      message.textContent = 'Something went wrong. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Subscribe';
    }
  });

  formWrapper.append(form);
  formWrapper.append(message);
  wrapper.append(formWrapper);

  // Privacy note
  const privacy = document.createElement('p');
  privacy.className = 'newsletter-privacy';
  privacy.innerHTML = 'We respect your privacy. Unsubscribe at any time.';
  wrapper.append(privacy);

  block.textContent = '';
  block.append(wrapper);
}
