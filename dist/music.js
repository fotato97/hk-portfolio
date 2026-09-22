(() => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'music-toggle';
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', '음악 켜기');
  button.innerHTML = '<span class="music-toggle-icon" aria-hidden="true">♫</span><span class="music-toggle-label">음악 켜기</span>';
  document.body.append(button);

  const label = button.querySelector('.music-toggle-label');
  const music = new Audio('assets/blue-warmth-loop.wav');
  music.loop = true;
  music.preload = 'none';
  music.volume = 0.14;

  button.addEventListener('click', async () => {
    if (!music.paused) {
      music.pause();
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', '음악 켜기');
      label.textContent = '음악 켜기';
      return;
    }

    button.disabled = true;
    label.textContent = '음악 준비 중…';
    try {
      music.volume = 0.14;
      await music.play();
      button.setAttribute('aria-pressed', 'true');
      button.setAttribute('aria-label', '음악 끄기');
      label.textContent = '음악 끄기';
    } catch {
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', '음악 켜기');
      label.textContent = '음악 켜기';
    } finally {
      button.disabled = false;
    }
  });

  window.addEventListener('pagehide', () => music.pause());
})();
