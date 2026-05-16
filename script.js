/* Preloader Logic */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('fade-out');
    // Optional: Remove from DOM after transition
    setTimeout(() => {
      loader.style.display = 'none';
    }, 600);
  }
});

/* Theme Management */
const themeToggle = document.getElementById('themeToggle');
let isTransitioning = false;

const updateTheme = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

const toggleTheme = (event) => {
  if (isTransitioning) return;
  
  const isDark = !document.documentElement.classList.contains('dark');

  // Fallback for browsers not supporting View Transitions API
  if (!document.startViewTransition) {
    updateTheme(isDark);
    return;
  }

  isTransitioning = true;
  document.documentElement.classList.add('no-transitions');

  // Get the click position, or default to the center of the button
  const rect = themeToggle.getBoundingClientRect();
  const x = event.clientX ?? (rect.left + rect.width / 2);
  const y = event.clientY ?? (rect.top + rect.height / 2);

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = document.startViewTransition(() => {
    updateTheme(isDark);
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    
    const animation = document.documentElement.animate(
      {
        clipPath: isDark ? clipPath : [...clipPath].reverse(),
      },
      {
        duration: 400, // Faster for better feel
        easing: 'ease-out',
        pseudoElement: isDark
          ? '::view-transition-new(root)'
          : '::view-transition-old(root)',
      }
    );

    animation.onfinish = () => {
      document.documentElement.classList.remove('no-transitions');
    };
  });

  transition.finished.finally(() => {
    isTransitioning = false;
    document.documentElement.classList.remove('no-transitions');
  });
};

themeToggle.addEventListener('click', toggleTheme);

/* Intersection Observer for Scroll Animations */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

document.querySelectorAll('.link-button, .social-icon').forEach(el => {
  observer.observe(el);
});

/* Easter Egg: Avatar Party Mode */
let clickCount = 0;
const avatar = document.querySelector('.avatar');

avatar.addEventListener('click', () => {
  clickCount++;

  if (clickCount >= 5) {
    document.querySelectorAll('.bubble').forEach((bubble) => {
      bubble.style.animationDuration = '2s';
      bubble.style.opacity = '0.9';
    });

    setTimeout(() => {
      document.querySelectorAll('.bubble').forEach((bubble) => {
        bubble.style.animationDuration = '';
        bubble.style.opacity = '';
      });
      clickCount = 0;
    }, 3000);
  }
});
