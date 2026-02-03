import gsap from 'gsap';

export function useAnimations() {
  // 数值跳动动画
  function animateNumber(
    element: HTMLElement,
    from: number,
    to: number,
    duration = 0.5,
    onUpdate?: (value: number) => void,
  ) {
    const obj = { value: from };
    gsap.to(obj, {
      value: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (onUpdate) {
          onUpdate(Math.round(obj.value));
        } else {
          element.textContent = Math.round(obj.value).toString();
        }
      },
    });
  }

  // 按钮点击弹性动画
  function buttonBounce(element: HTMLElement) {
    gsap
      .timeline()
      .to(element, {
        scale: 0.9,
        duration: 0.1,
        ease: 'power2.in',
      })
      .to(element, {
        scale: 1.05,
        duration: 0.15,
        ease: 'back.out(3)',
      })
      .to(element, {
        scale: 1,
        duration: 0.1,
        ease: 'power2.out',
      });
  }

  // 脉冲发光效果
  function pulseGlow(element: HTMLElement, color = 'rgba(231, 76, 60, 0.5)') {
    gsap.fromTo(
      element,
      { boxShadow: `0 0 0 0 ${color}` },
      {
        boxShadow: `0 0 20px 10px transparent`,
        duration: 0.6,
        ease: 'power2.out',
      },
    );
  }

  // 摇晃效果
  function shake(element: HTMLElement, intensity = 5) {
    gsap
      .timeline()
      .to(element, { x: -intensity, duration: 0.05 })
      .to(element, { x: intensity, duration: 0.05 })
      .to(element, { x: -intensity, duration: 0.05 })
      .to(element, { x: intensity, duration: 0.05 })
      .to(element, { x: 0, duration: 0.05 });
  }

  // 面板滑入动画
  function slideIn(element: HTMLElement, direction: 'left' | 'right' | 'up' | 'down' = 'right') {
    const from: gsap.TweenVars = { opacity: 0 };

    switch (direction) {
      case 'left':
        from.x = -50;
        break;
      case 'right':
        from.x = 50;
        break;
      case 'up':
        from.y = -50;
        break;
      case 'down':
        from.y = 50;
        break;
    }

    gsap.from(element, {
      ...from,
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  // 增强版彩带烟花效果
  function celebrationBurst(container: HTMLElement, centerX?: number, centerY?: number) {
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e91e63', '#00bcd4'];
    const particleCount = 50;

    const rect = container.getBoundingClientRect();
    const cx = centerX ?? rect.width / 2;
    const cy = centerY ?? rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: ${cx}px;
        top: ${cy}px;
        pointer-events: none;
        z-index: 1000;
      `;
      container.appendChild(particle);

      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5);
      const velocity = 100 + Math.random() * 200;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity;

      gsap.to(particle, {
        x: destX,
        y: destY,
        rotation: Math.random() * 720 - 360,
        opacity: 0,
        scale: Math.random() * 0.5 + 0.5,
        duration: 1 + Math.random() * 1,
        ease: 'power2.out',
        onComplete: () => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        },
      });
    }
  }

  // 星星爆发效果
  function starBurst(container: HTMLElement) {
    const stars = ['⭐', '✨', '💫', '🌟'];

    for (let i = 0; i < 8; i++) {
      const star = document.createElement('div');
      star.textContent = stars[Math.floor(Math.random() * stars.length)];
      star.style.cssText = `
        position: absolute;
        font-size: 24px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1000;
      `;
      container.appendChild(star);

      const angle = (Math.PI * 2 * i) / 8;
      const distance = 80 + Math.random() * 40;

      gsap.to(star, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          if (star.parentNode) {
            star.parentNode.removeChild(star);
          }
        },
      });
    }
  }

  // 进度条填充动画
  function animateProgress(element: HTMLElement, from: number, to: number, duration = 0.5) {
    gsap.fromTo(element, { width: `${from}%` }, { width: `${to}%`, duration, ease: 'power2.out' });
  }

  // 心跳效果
  function heartbeat(element: HTMLElement, count = 2) {
    const tl = gsap.timeline();

    for (let i = 0; i < count; i++) {
      tl.to(element, { scale: 1.2, duration: 0.15, ease: 'power2.in' })
        .to(element, { scale: 1, duration: 0.15, ease: 'power2.out' })
        .to(element, { scale: 1.15, duration: 0.1, ease: 'power2.in' })
        .to(element, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.5)' });
    }

    return tl;
  }

  return {
    animateNumber,
    buttonBounce,
    pulseGlow,
    shake,
    slideIn,
    celebrationBurst,
    starBurst,
    animateProgress,
    heartbeat,
  };
}
