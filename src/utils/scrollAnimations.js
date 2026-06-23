// Scroll Animation Utility
// Implements Intersection Observer for scroll-reveal animations

export const initScrollAnimations = () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe all elements with .scroll-reveal class
  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach((el) => observer.observe(el));

  return observer;
};

// Staggered animation for child elements
export const initStaggerAnimation = (containerSelector, delay = 100) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const children = container.children;
  Array.from(children).forEach((child, index) => {
    child.style.opacity = '0';
    child.style.animation = `fadeInUp 0.6s ease-out ${index * delay}ms forwards`;
  });
};

// Add scroll-reveal to element dynamically
export const addScrollReveal = (element, callback) => {
  if (!element) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          if (callback) callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  element.classList.add('scroll-reveal');
  observer.observe(element);

  return observer;
};

// Cleanup function
export const cleanupScrollAnimations = (observer) => {
  if (observer) {
    observer.disconnect();
  }
};
