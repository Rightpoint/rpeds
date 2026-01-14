function getYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

function getVimeoId(url) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

function createYouTubeEmbed(id, autoplay) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${id}?rel=0${autoplay ? '&autoplay=1&mute=1' : ''}`;
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframe.setAttribute('loading', 'lazy');
  return iframe;
}

function createVimeoEmbed(id, autoplay) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://player.vimeo.com/video/${id}?${autoplay ? 'autoplay=1&muted=1' : ''}`;
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
  iframe.setAttribute('loading', 'lazy');
  return iframe;
}

function createLocalVideo(src, autoplay, placeholder) {
  const video = document.createElement('video');
  video.src = src;
  video.setAttribute('controls', '');
  if (autoplay) {
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
  }
  if (placeholder) {
    video.setAttribute('poster', placeholder);
  }
  return video;
}

export default function decorate(block) {
  const videoLink = block.querySelector('a');
  const url = videoLink?.href || '';
  const autoplay = block.classList.contains('autoplay');

  const placeholderImg = block.querySelector('picture img');
  const placeholderSrc = placeholderImg?.src;

  let videoElement;
  const youtubeId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);

  if (youtubeId) {
    videoElement = createYouTubeEmbed(youtubeId, autoplay);
  } else if (vimeoId) {
    videoElement = createVimeoEmbed(vimeoId, autoplay);
  } else if (url) {
    videoElement = createLocalVideo(url, autoplay, placeholderSrc);
  }

  if (videoElement) {
    const wrapper = document.createElement('div');
    wrapper.className = 'video-wrapper';

    // For iframes, show placeholder until clicked
    if (videoElement.tagName === 'IFRAME' && placeholderSrc && !autoplay) {
      const placeholder = document.createElement('div');
      placeholder.className = 'video-placeholder';
      placeholder.style.backgroundImage = `url(${placeholderSrc})`;

      const playBtn = document.createElement('button');
      playBtn.className = 'video-play-btn';
      playBtn.setAttribute('aria-label', 'Play video');
      playBtn.innerHTML = '<span>&#9658;</span>';

      placeholder.append(playBtn);
      wrapper.append(placeholder);

      placeholder.addEventListener('click', () => {
        videoElement.src += '&autoplay=1';
        placeholder.replaceWith(videoElement);
      });
    } else {
      wrapper.append(videoElement);
    }

    block.textContent = '';
    block.append(wrapper);
  }
}
