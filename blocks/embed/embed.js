const EMBED_CONFIG = {
  youtube: {
    match: /youtube\.com|youtu\.be/,
    getEmbedUrl: (url) => {
      const id = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
    },
  },
  vimeo: {
    match: /vimeo\.com/,
    getEmbedUrl: (url) => {
      const id = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    },
  },
  twitter: {
    match: /twitter\.com|x\.com/,
    render: async (url, container) => {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'twitter-tweet';
      const a = document.createElement('a');
      a.href = url;
      blockquote.append(a);
      container.append(blockquote);
      container.append(script);
    },
  },
  instagram: {
    match: /instagram\.com/,
    render: async (url, container) => {
      const embedUrl = `${url.replace(/\/$/, '')}/embed`;
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('allowtransparency', 'true');
      container.append(iframe);
    },
  },
  spotify: {
    match: /spotify\.com/,
    getEmbedUrl: (url) => url.replace('/track/', '/embed/track/').replace('/playlist/', '/embed/playlist/'),
  },
  maps: {
    match: /google\.com\/maps/,
    getEmbedUrl: (url) => {
      if (url.includes('/embed')) return url;
      const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${match[2]}!3d${match[1]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1`;
      }
      return null;
    },
  },
};

function getEmbedConfig(url) {
  const entries = Object.entries(EMBED_CONFIG);
  for (let i = 0; i < entries.length; i += 1) {
    const [, config] = entries[i];
    if (config.match.test(url)) {
      return config;
    }
  }
  return null;
}

export default function decorate(block) {
  const placeholderDiv = block.children[0];
  const urlDiv = block.children[1];

  const link = urlDiv?.querySelector('a');
  const url = link?.href || urlDiv?.textContent?.trim() || '';

  const placeholderImg = placeholderDiv?.querySelector('picture');

  const wrapper = document.createElement('div');
  wrapper.className = 'embed-wrapper';

  const config = getEmbedConfig(url);

  if (config?.render) {
    config.render(url, wrapper);
  } else if (config?.getEmbedUrl) {
    const embedUrl = config.getEmbedUrl(url);
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('loading', 'lazy');

      if (placeholderImg) {
        const placeholder = document.createElement('div');
        placeholder.className = 'embed-placeholder';
        placeholder.append(placeholderImg);

        const playBtn = document.createElement('button');
        playBtn.className = 'embed-play-btn';
        playBtn.setAttribute('aria-label', 'Load embed');
        playBtn.innerHTML = '<span>&#9658;</span>';
        placeholder.append(playBtn);

        placeholder.addEventListener('click', () => {
          placeholder.replaceWith(iframe);
        });
        wrapper.append(placeholder);
      } else {
        wrapper.append(iframe);
      }
    }
  } else if (url) {
    // Generic iframe embed
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('loading', 'lazy');
    wrapper.append(iframe);
  }

  block.textContent = '';
  block.append(wrapper);
}
