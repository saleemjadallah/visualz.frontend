'use client';

import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ThemeSelector } from '@/components/cultural/ThemeProvider';
import { Palette, Settings, Eye } from 'lucide-react';

export default function HeroDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Demo Controls */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-primary-200">
        <Container maxWidth="2xl" padding="md">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-bold text-primary-900">Hero Section Demo</h1>
              <p className="text-sm text-primary-600">Interactive preview of the advanced hero component</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeSelector variant="dropdown" />
              <Button variant="ghost" size="sm" icon={<Settings />}>
                Controls
              </Button>
              <Button variant="cultural" size="sm" icon={<Eye />}>
                Live Preview
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Demo Information */}
      <section className="py-20 bg-primary-50">
        <Container maxWidth="2xl" padding="lg">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Dynamic Cultural Theming
              </h3>
              <p className="text-primary-600">
                The hero section adapts its colors, animations, and cultural phrases based on 
                the selected cultural theme. Try switching themes above to see the magic!
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Advanced Animations
              </h3>
              <p className="text-primary-600">
                Built with Framer Motion for smooth, performance-optimized animations including 
                floating elements, rotating text, and interactive hover effects.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                3D Visualization Ready
              </h3>
              <p className="text-primary-600">
                Includes placeholder areas for 3D event visualizations with animated backgrounds 
                and floating cultural elements that respond to user interactions.
              </p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">
              Features Demonstrated
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                "Cultural phrase rotation",
                "Dynamic background gradients", 
                "Floating animated elements",
                "Real-time theme switching",
                "Responsive design system",
                "Performance optimized",
                "Accessibility compliant",
                "Interactive 3D placeholder"
              ].map((feature, index) => (
                <div key={index} className="px-4 py-2 bg-white rounded-lg border border-primary-200 text-sm text-primary-700">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}