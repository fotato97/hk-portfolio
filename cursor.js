(() => {
  const finePointer = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (!finePointer.matches) return;

  const cursor = document.createElement('span');
  cursor.className = 'heart-cursor is-hidden';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  document.documentElement.classList.add('heart-cursor-active');

  let lastSparkle = 0;
  let sparkleCount = 0;

  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.remove('is-hidden');
    cursor.classList.toggle('is-interactive', Boolean(event.target instanceof Element && event.target.closest('a, button, input, select, textarea, [role="button"]')));

    const now = performance.now();
    if (now - lastSparkle < 38 || sparkleCount >= 22) return;
    lastSparkle = now;
    sparkleCount++;
    const sparkle = document.createElement('span');
    sparkle.className = 'heart-sparkle';
    sparkle.setAttribute('aria-hidden', 'true');
    sparkle.style.left = `${event.clientX + (Math.random() - .5) * 20}px`;
    sparkle.style.top = `${event.clientY + (Math.random() - .5) * 20}px`;
    sparkle.style.setProperty('--dx', `${(Math.random() - .5) * 52}px`);
    sparkle.style.setProperty('--dy', `${18 + Math.random() * 34}px`);
    sparkle.style.setProperty('--angle', `${120 + Math.random() * 180}deg`);
    sparkle.style.setProperty('--size', `${8 + Math.random() * 9}px`);
    sparkle.addEventListener('animationend', () => { sparkle.remove(); sparkleCount--; }, { once: true });
    document.body.append(sparkle);
  }, { passive: true });

  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) cursor.classList.add('is-hidden');
  });
  document.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'));
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  window.addEventListener('blur', () => cursor.classList.add('is-hidden'));
})();
