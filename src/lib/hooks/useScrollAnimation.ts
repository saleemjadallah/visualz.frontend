'use client';

import { useEffect, useRef } from 'react';
import { useAnimation, useInView } from 'framer-motion';

export const useScrollAnimation = (threshold: number = 0.1) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, {
    amount: threshold,
    once: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return { ref, controls, inView };
};

export default useScrollAnimation;