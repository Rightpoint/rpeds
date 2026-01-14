export default function decorate(block) {
  const items = [...block.children];
  const faqContainer = document.createElement('div');
  faqContainer.className = 'faq-container';

  // Add schema.org markup for SEO
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [],
  };

  items.forEach((item) => {
    const questionDiv = item.children[0];
    const answerDiv = item.children[1];

    const details = document.createElement('details');
    details.className = 'faq-item';

    const summary = document.createElement('summary');
    summary.className = 'faq-question';

    const questionText = questionDiv?.textContent?.trim() || 'Question';
    summary.innerHTML = `<span class="faq-question-text">${questionText}</span><span class="faq-icon"></span>`;

    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    if (answerDiv) {
      answer.innerHTML = answerDiv.innerHTML;
    }

    details.append(summary);
    details.append(answer);
    faqContainer.append(details);

    // Add to schema
    schema.mainEntity.push({
      '@type': 'Question',
      name: questionText,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answerDiv?.textContent?.trim() || '',
      },
    });
  });

  // Add schema script
  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.textContent = JSON.stringify(schema);

  // Single-open behavior (optional)
  if (block.classList.contains('single-open')) {
    faqContainer.addEventListener('toggle', (e) => {
      if (e.target.open) {
        faqContainer.querySelectorAll('details[open]').forEach((openDetails) => {
          if (openDetails !== e.target) {
            openDetails.open = false;
          }
        });
      }
    }, true);
  }

  block.textContent = '';
  block.append(faqContainer);
  block.append(schemaScript);
}
