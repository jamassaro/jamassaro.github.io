import React, { useEffect, useRef, useState } from 'react';
import styles from './AnimatedSection.module.css';

/**
 * AnimatedSection Component - SRP: Handles scroll-reveal animations
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.animation - Animation type: 'fadeIn', 'fadeInUp', 'fadeInDown', 'slideInLeft', 'slideInRight', 'scaleIn'
 * @param {number} props.delay - Animation delay in ms: 100, 200, 300, 400, 500
 * @param {string} props.duration - Animation duration: 'fast', 'default', 'slow'
 * @param {boolean} props.stagger - Enable stagger animation for children
 * @param {number} props.threshold - Intersection observer threshold (0-1)
 * @param {boolean} props.once - Animate only once
 * @param {string} props.className - Additional CSS classes
 */
const AnimatedSection = ({
  children,
  animation = 'fadeInUp',
  delay,
  duration = 'default',
  stagger = false,
  threshold = 0.1,
  once = true,
  className = '',
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  const sectionClasses = [
    styles.animatedSection,
    styles[animation],
    isVisible && styles.active,
    delay && styles[`delay${delay}`],
    duration !== 'default' && styles[duration],
    stagger && styles.staggerContainer,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={sectionClasses} {...rest}>
      {children}
    </div>
  );
};

export default AnimatedSection;
