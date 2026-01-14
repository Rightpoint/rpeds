export default function decorate(block) {
  const items = [...block.children];
  const container = document.createElement('div');
  container.className = 'pricing-container';

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'pricing-card';

    const titleDiv = item.children[0];
    const priceDiv = item.children[1];
    const featuresDiv = item.children[2];
    const buttonDiv = item.children[3];

    // Check for "featured" or "popular" in title
    const titleText = titleDiv?.textContent?.toLowerCase() || '';
    if (titleText.includes('popular') || titleText.includes('featured') || titleText.includes('recommended')) {
      card.classList.add('pricing-card-featured');
    }

    // Title / Plan name
    if (titleDiv) {
      const header = document.createElement('div');
      header.className = 'pricing-header';

      // Check for badge text
      const badgeMatch = titleDiv.textContent.match(/\[(.*?)\]/);
      if (badgeMatch) {
        const badge = document.createElement('span');
        badge.className = 'pricing-badge';
        badge.textContent = badgeMatch[1];
        header.append(badge);
      }

      const title = document.createElement('h3');
      title.className = 'pricing-title';
      title.textContent = titleDiv.textContent.replace(/\[.*?\]/, '').trim();
      header.append(title);

      card.append(header);
    }

    // Price
    if (priceDiv) {
      const priceWrapper = document.createElement('div');
      priceWrapper.className = 'pricing-price-wrapper';

      const priceText = priceDiv.textContent.trim();
      const priceMatch = priceText.match(/^([^\d]*)(\d+(?:\.\d{2})?)([^\d]*)?(?:\/(.+))?$/);

      if (priceMatch) {
        const currency = document.createElement('span');
        currency.className = 'pricing-currency';
        currency.textContent = priceMatch[1] || '$';

        const amount = document.createElement('span');
        amount.className = 'pricing-amount';
        amount.textContent = priceMatch[2];

        const period = document.createElement('span');
        period.className = 'pricing-period';
        period.textContent = priceMatch[4] ? `/${priceMatch[4]}` : '/mo';

        priceWrapper.append(currency);
        priceWrapper.append(amount);
        priceWrapper.append(period);
      } else {
        priceWrapper.textContent = priceText;
      }

      card.append(priceWrapper);
    }

    // Features list
    if (featuresDiv) {
      const features = document.createElement('ul');
      features.className = 'pricing-features';

      const listItems = featuresDiv.querySelectorAll('li');
      if (listItems.length > 0) {
        listItems.forEach((li) => {
          const feature = document.createElement('li');
          feature.className = 'pricing-feature';
          feature.innerHTML = li.innerHTML;
          features.append(feature);
        });
      } else {
        // Parse from text if no ul/li
        const lines = featuresDiv.textContent.split('\n').filter((line) => line.trim());
        lines.forEach((line) => {
          const feature = document.createElement('li');
          feature.className = 'pricing-feature';
          feature.textContent = line.trim();
          features.append(feature);
        });
      }

      card.append(features);
    }

    // CTA Button
    if (buttonDiv) {
      const cta = document.createElement('div');
      cta.className = 'pricing-cta';
      const link = buttonDiv.querySelector('a');
      if (link) {
        link.classList.add('pricing-button');
        cta.append(link.cloneNode(true));
      } else {
        const btn = document.createElement('button');
        btn.className = 'pricing-button';
        btn.textContent = buttonDiv.textContent.trim() || 'Get Started';
        cta.append(btn);
      }
      card.append(cta);
    }

    container.append(card);
  });

  block.textContent = '';
  block.append(container);
}
