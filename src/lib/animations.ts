import { Variants } from 'framer-motion';

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: "easeInOut" }
};

// Stagger animations for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Scroll-triggered animations
export const scrollFadeIn: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const scrollSlideIn: Variants = {
  hidden: { 
    opacity: 0, 
    x: -50 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const scrollScaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const hoverLift = {
  y: -5,
  transition: { duration: 0.2 }
};

export const hoverGlow = {
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: { duration: 0.3 }
};

// Cultural theme transition animations
export const culturalThemeTransition: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.95,
    filter: "blur(10px)"
  },
  animate: { 
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0,
    scale: 1.05,
    filter: "blur(10px)",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Loading animations
export const loadingSpinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const loadingDots: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const loadingPulse: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Modal animations
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Tooltip animations
export const tooltipVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 10
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: 10,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

// Card animations
export const cardHover: Variants = {
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export const cardTap = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

// Button animations
export const buttonHover = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

// Navigation animations
export const navSlideIn: Variants = {
  hidden: { x: "-100%" },
  visible: { 
    x: "0%",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    x: "-100%",
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Form animations
export const formSlideUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export const inputFocus = {
  scale: 1.02,
  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
  transition: { duration: 0.2 }
};

// Gallery animations
export const galleryItemHover = {
  scale: 1.05,
  y: -5,
  transition: { duration: 0.2 }
};

export const galleryFadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Cultural badge animations
export const culturalBadgeHover = {
  scale: 1.1,
  rotate: 2,
  transition: { duration: 0.2 }
};

export const culturalBadgeTap = {
  scale: 0.9,
  rotate: -1,
  transition: { duration: 0.1 }
};

// Floating elements
export const floatingElement: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const floatingElementSlow: Variants = {
  animate: {
    y: [0, -15, 0],
    x: [0, 5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Progress animations
export const progressBar: Variants = {
  initial: { scaleX: 0 },
  animate: { 
    scaleX: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Notification animations
export const notificationSlideIn: Variants = {
  hidden: { 
    opacity: 0, 
    x: 300,
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    x: 300,
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Utility function to create custom spring animations
export const springTransition = (stiffness: number = 300, damping: number = 30) => ({
  type: "spring",
  stiffness,
  damping
});

// Utility function to create custom easing animations
export const easingTransition = (duration: number = 0.3, ease: string = "easeOut") => ({
  duration,
  ease
});