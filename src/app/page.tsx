'use client';

import React from 'react';
import { 
  Palette, 
  Sparkles, 
  Globe, 
  Eye, 
  ArrowRight,
  Star,
  Users,
  Zap,
  Heart,
  TrendingUp
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Container } from '@/components/layout/Container';
import { Grid, Stack, HStack } from '@/components/layout/Grid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconBadge } from '@/components/ui/Icon';
import { useTheme } from '@/components/cultural/ThemeProvider';
import { HeroSection } from '@/components/sections/HeroSection';

export default function HomePage() {
  const { currentTheme } = useTheme();

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Cultural Intelligence',
      description: 'AI that understands and respects cultural design traditions',
      color: 'text-blue-600'
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Smart Design System',
      description: 'Adaptive components that change with cultural context',
      color: 'text-purple-600'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Creation',
      description: 'Generate beautiful event designs in minutes',
      color: 'text-yellow-600'
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Instant Visualization',
      description: '3D previews and real-time design adjustments',
      color: 'text-green-600'
    }
  ];


  return (
    <AppLayout currentTab="studio" showSearch={false}>
      {/* Advanced Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <Container maxWidth="2xl" padding="lg">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
              Powered by Cultural Intelligence
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Experience the future of event design with AI that respects and celebrates 
              cultural traditions from around the world.
            </p>
          </div>
          
          <Grid cols={1} gap="lg" responsive={{ md: 2 }} className="grid-cols-1 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow duration-300">
                <div className={`inline-flex p-3 rounded-xl bg-primary-50 mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-primary-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Cultural Showcase Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-cultural-primary/5 to-cultural-secondary/5">
        <Container maxWidth="2xl" padding="lg">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-4">
              Celebrate Every Culture
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              From Japanese minimalism to Italian elegance, our AI understands the 
              nuances that make each cultural tradition beautiful and unique.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center p-8 rounded-2xl bg-white shadow-xl">
              <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-6"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colorPalette.primary}, ${currentTheme.colorPalette.secondary})`
                }}
              >
                {currentTheme.culture.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-primary-900 mb-2">
                  Current Theme: {currentTheme.name}
                </h3>
                <p className="text-primary-600 max-w-md">
                  {currentTheme.principles[0]?.description || 'Explore cultural design principles'}
                </p>
                <Button 
                  variant="cultural" 
                  size="sm" 
                  icon={<Globe />}
                  className="mt-4"
                >
                  Explore More Cultures
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <Container maxWidth="2xl" padding="lg">
          <Card className="p-12 bg-gradient-to-br from-cultural-primary to-cultural-secondary text-center text-white">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Create Something Beautiful?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of event planners using DesignVisualz to create 
                culturally-intelligent, stunning event designs.
              </p>
              <HStack spacing="md" className="justify-center">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  icon={<Palette />}
                  className="bg-white text-cultural-primary hover:bg-primary-50"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg"
                  icon={<Star />}
                  className="text-white border-white hover:bg-white/10"
                >
                  View Pricing
                </Button>
              </HStack>
            </div>
          </Card>
        </Container>
      </section>
    </AppLayout>
  );
}