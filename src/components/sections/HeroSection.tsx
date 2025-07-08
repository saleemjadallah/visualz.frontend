'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Camera, 
  Eye, 
  Globe, 
  Palette, 
  ArrowRight,
  Play,
  Star,
  Zap,
  Heart,
  Users,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { Grid, Stack, HStack } from '@/components/layout/Grid';
import { CulturalBadge } from '@/components/ui/CulturalBadge';
import { IconBadge } from '@/components/ui/Icon';
import { useTheme } from '@/components/cultural/ThemeProvider';
import { cn } from '@/lib/utils';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const floatingVariants = {
  floating: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Cultural phrases for rotating text
const culturalPhrases = [
  { text: "Cultural Intelligence", culture: 'japanese' as const },
  { text: "Wabi-Sabi Beauty", culture: 'japanese' as const },
  { text: "Hygge Warmth", culture: 'scandinavian' as const },
  { text: "Bella Figura", culture: 'italian' as const },
  { text: "Savoir-Vivre", culture: 'french' as const },
  { text: "Bold Innovation", culture: 'american' as const }
];

const HeroSection: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  // Rotate cultural phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % culturalPhrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentPhrase = culturalPhrases[currentPhraseIndex];

  const stats = [
    { 
      icon: <Globe className="w-5 h-5" />, 
      value: "50+", 
      label: "Cultural Traditions",
      color: "text-blue-600"
    },
    { 
      icon: <Palette className="w-5 h-5" />, 
      value: "1000+", 
      label: "Design Templates",
      color: "text-purple-600"
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      value: "10K+", 
      label: "Happy Users",
      color: "text-green-600"
    },
    { 
      icon: <TrendingUp className="w-5 h-5" />, 
      value: "98%", 
      label: "Success Rate",
      color: "text-orange-600"
    }
  ];

  const features = [
    { icon: <Sparkles />, text: "AI-Powered" },
    { icon: <Globe />, text: "Cultural Intelligence" },
    { icon: <Zap />, text: "Real-time Generation" },
    { icon: <Heart />, text: "Culturally Sensitive" }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden isolate">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute inset-0 opacity-60"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colorPalette.primary}08, ${currentTheme.colorPalette.secondary}12, ${currentTheme.colorPalette.accent}08)`
          }}
          animate={{
            background: [
              `linear-gradient(135deg, ${currentTheme.colorPalette.primary}08, ${currentTheme.colorPalette.secondary}12, ${currentTheme.colorPalette.accent}08)`,
              `linear-gradient(135deg, ${currentTheme.colorPalette.secondary}12, ${currentTheme.colorPalette.accent}08, ${currentTheme.colorPalette.primary}08)`,
              `linear-gradient(135deg, ${currentTheme.colorPalette.primary}08, ${currentTheme.colorPalette.secondary}12, ${currentTheme.colorPalette.accent}08)`
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colorPalette.primary}, ${currentTheme.colorPalette.secondary})`,
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <Container maxWidth="2xl" padding="lg" className="relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]"
        >
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Badge */}
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="inline-block"
              >
                <IconBadge 
                  icon={<Sparkles />} 
                  variant="cultural"
                  className="text-sm font-semibold"
                >
                  AI-Powered Cultural Intelligence
                </IconBadge>
              </motion.div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="text-primary-900">Design Events with</span>
                  <br />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentPhraseIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="block text-cultural-primary"
                      style={{ color: currentTheme.colorPalette.primary }}
                    >
                      {currentPhrase.text}
                    </motion.span>
                  </AnimatePresence>
                </h1>

                <motion.p 
                  variants={itemVariants}
                  className="text-xl lg:text-2xl text-primary-600 leading-relaxed max-w-2xl"
                >
                  Create stunning, culturally-aware event designs using AI that understands 
                  traditions, aesthetics, and the art of beautiful celebrations.
                </motion.p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants}>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Button 
                  variant="cultural" 
                  size="lg" 
                  icon={<Camera />}
                  className="text-lg px-8 py-4 shadow-xl hover:shadow-2xl w-full sm:w-auto"
                >
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg"
                  icon={<Play />}
                  className="text-lg px-8 py-4 border-2 border-primary-200 hover:border-cultural-primary w-full sm:w-auto"
                >
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div variants={itemVariants} className="pt-4">
              <div className="flex flex-wrap gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-primary-200"
                  >
                    <span className="text-cultural-primary">{feature.icon}</span>
                    <span className="text-sm font-medium text-primary-700">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
                    className="text-center"
                  >
                    <div className={cn("flex items-center justify-center mb-2", stat.color)}>
                      {stat.icon}
                    </div>
                    <motion.div 
                      className="text-2xl font-bold text-primary-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2 + index * 0.1, duration: 0.3, type: "spring" }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-primary-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Content - 3D Visualization Area */}
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              {/* Animated Background */}
              <motion.div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colorPalette.primary}20, ${currentTheme.colorPalette.secondary}30, ${currentTheme.colorPalette.accent}20)`
                }}
                animate={{
                  background: [
                    `linear-gradient(135deg, ${currentTheme.colorPalette.primary}20, ${currentTheme.colorPalette.secondary}30, ${currentTheme.colorPalette.accent}20)`,
                    `linear-gradient(135deg, ${currentTheme.colorPalette.secondary}30, ${currentTheme.colorPalette.accent}20, ${currentTheme.colorPalette.primary}20)`,
                    `linear-gradient(135deg, ${currentTheme.colorPalette.primary}20, ${currentTheme.colorPalette.secondary}30, ${currentTheme.colorPalette.accent}20)`
                  ]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              
              {/* 3D Placeholder Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="text-center space-y-4"
                  variants={floatingVariants}
                  animate="floating"
                >
                  <motion.div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.colorPalette.primary}, ${currentTheme.colorPalette.secondary})`
                    }}
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Palette className="w-12 h-12 text-white" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-primary-900">
                      AI 3D Visualization
                    </h3>
                    <p className="text-primary-600">
                      Real-time event design preview
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Floating Cultural Badges */}
              <motion.div
                className="absolute top-4 right-4"
                variants={floatingVariants}
                animate="floating"
                transition={{ delay: 1 }}
              >
                <CulturalBadge culture={currentPhrase.culture} />
              </motion.div>

              <motion.div
                className="absolute bottom-6 left-6"
                variants={floatingVariants}
                animate="floating"
                transition={{ delay: 2 }}
              >
                <div className="flex items-center space-x-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-primary-800">Premium Quality</span>
                </div>
              </motion.div>

              {/* Interactive Elements */}
              <motion.div
                className="absolute top-1/2 left-4 transform -translate-y-1/2"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5 text-cultural-primary" />
                </button>
              </motion.div>
            </div>

            {/* Additional Floating Elements */}
            <motion.div
              className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colorPalette.accent}, ${currentTheme.colorPalette.primary})`
              }}
              variants={floatingVariants}
              animate="floating"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -right-4 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colorPalette.secondary}, ${currentTheme.colorPalette.accent})`
              }}
              variants={floatingVariants}
              animate="floating"
              transition={{ delay: 1.5 }}
            >
              <Globe className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default HeroSection;
export { HeroSection };