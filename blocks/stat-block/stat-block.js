
export default function decorate(block) {
 console.log("Begin rendering Stat Block");
   const items = [...block.children];
  const container = document.createElement('div');
  container.className = 'stat-block-container';

  const animatedElements = [];

  items.forEach((item) => {
    const stat = document.createElement('div');
    stat.className = 'stat-block-item';

    const valueDiv = item.children[0];
    const labelDiv = item.children[1];

      // Parse value - look for numbers with optional prefix/suffix (e.g., "$51mn", "800+", "60 NPS")
    const valueText = valueDiv?.textContent?.trim() || 'H';

    // Match patterns like: $51mn, 800+, 60 NPS, 83k+
    const match = valueText.match(/^([^\d]*)(\d+(?:,\d+)*)(.*)$/);

    const prefix = match?.[1] || '';
    const numberStr = match?.[2]?.replace(/,/g, '') || '0';
    const suffix = match?.[3] || '';
    const targetValue = parseInt(numberStr, 10);

    // Value wrapper
    const valueWrapper = document.createElement('div');
    valueWrapper.className = 'stat-block-value';

      if (prefix) {
      const prefixSpan = document.createElement('span');
      prefixSpan.className = 'stat-block-prefix';
      prefixSpan.textContent = prefix;
      valueWrapper.append(prefixSpan);
    }

    const number = document.createElement('span');
    number.className = 'stat-block-number';
    number.textContent = '0';
    valueWrapper.append(number);

    if (suffix) {
      const suffixSpan = document.createElement('span');
      suffixSpan.className = 'stat-block-suffix';
      suffixSpan.textContent = suffix;
      valueWrapper.append(suffixSpan);
    }

    stat.append(valueWrapper);

    // Label
    if (labelDiv) {
      const label = document.createElement('div');
      label.className = 'stat-block-label';
      label.innerHTML = labelDiv.innerHTML;
      stat.append(label);
    }

    container.append(stat);
    animatedElements.push({ element: number, target: targetValue });
  
    
  })
  console.log("After render stat block 2")
}
