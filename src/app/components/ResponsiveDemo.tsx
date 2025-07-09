'use client';

import React, { useState } from 'react';
import { TouchOptimizedInput, TouchOptimizedSelect, TouchOptimizedTextarea } from './ui/TouchOptimizedInput';
import { SwipeableCarousel, SwipeableList, SwipeGesture } from './ui/SwipeGesture';
import { MobileCameraButton } from './ui/MobileCameraCapture';
import { useCulturalTheme } from '../../lib/hooks/useCulturalTheme';
import { Monitor, Tablet, Smartphone, Camera, Move, Hand, Palette } from 'lucide-react';

const ResponsiveDemo = () => {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventType: '',
    description: '',
    search: '',
  });
  const [capturedImages, setCapturedImages] = useState<File[]>([]);
  const { currentTheme } = useCulturalTheme();

  const eventOptions = [
    { value: 'birthday', label: 'Birthday Celebration' },
    { value: 'wedding', label: 'Wedding Reception' },
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'cultural', label: 'Cultural Festival' },
  ];

  const carouselItems = [
    <div key="slide1" className="card-cultural p-8 text-center">
      <Monitor className="w-16 h-16 mx-auto mb-4 text-cultural-accent" />
      <h3 className="text-responsive-heading mb-4">Desktop Experience</h3>
      <p className="text-responsive-body">Rich interactions and detailed layouts optimized for large screens</p>
    </div>,
    <div key="slide2" className="card-cultural p-8 text-center">
      <Tablet className="w-16 h-16 mx-auto mb-4 text-cultural-accent" />
      <h3 className="text-responsive-heading mb-4">Tablet Optimization</h3>
      <p className="text-responsive-body">Balanced experience with touch-friendly elements and efficient layouts</p>
    </div>,
    <div key="slide3" className="card-cultural p-8 text-center">
      <Smartphone className="w-16 h-16 mx-auto mb-4 text-cultural-accent" />
      <h3 className="text-responsive-heading mb-4">Mobile First</h3>
      <p className="text-responsive-body">Thumb-friendly navigation and optimized for one-handed use</p>
    </div>,
  ];

  const listItems = [
    {
      id: '1',
      content: (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cultural-accent flex items-center justify-center">
            <Hand className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-cultural-text">Touch Optimized</h4>
            <p className="text-sm text-cultural-secondary">44px minimum touch targets</p>
          </div>
        </div>
      ),
      actions: [
        { label: 'Edit', color: '#3b82f6', onAction: () => alert('Edit tapped') },
        { label: 'Delete', color: '#ef4444', onAction: () => alert('Delete tapped') },
      ],
    },
    {
      id: '2',
      content: (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cultural-accent flex items-center justify-center">
            <Move className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-cultural-text">Swipe Gestures</h4>
            <p className="text-sm text-cultural-secondary">Intuitive swipe interactions</p>
          </div>
        </div>
      ),
      actions: [
        { label: 'Share', color: '#10b981', onAction: () => alert('Share tapped') },
        { label: 'Archive', color: '#f59e0b', onAction: () => alert('Archive tapped') },
      ],
    },
    {
      id: '3',
      content: (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cultural-accent flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-cultural-text">Camera Integration</h4>
            <p className="text-sm text-cultural-secondary">Native camera access</p>
          </div>
        </div>
      ),
      actions: [
        { label: 'View', color: '#8b5cf6', onAction: () => alert('View tapped') },
        { label: 'Remove', color: '#ef4444', onAction: () => alert('Remove tapped') },
      ],
    },
  ];

  const handleCameraCapture = (file: File) => {
    setCapturedImages(prev => [...prev, file]);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-responsive-heading mb-4">
            Responsive Design Demo
          </h1>
          <p className="text-responsive-body max-w-2xl mx-auto">
            Experience our mobile-first responsive design with touch optimization, 
            swipe gestures, and native camera integration.
          </p>
        </div>

        {/* Current Theme Display */}
        <div className="card-cultural p-6 mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Palette className="w-6 h-6 text-cultural-accent" />
            <h3 className="text-xl font-semibold text-cultural-text">
              Current Theme: {currentTheme}
            </h3>
          </div>
          <p className="text-cultural-secondary">
            The entire interface adapts to your selected cultural theme
          </p>
        </div>

        {/* Device Breakpoints Carousel */}
        <section className="mb-12">
          <h2 className="text-responsive-heading mb-6 text-center">
            Cross-Device Experience
          </h2>
          <SwipeableCarousel
            items={carouselItems}
            currentIndex={currentCarouselIndex}
            onIndexChange={setCurrentCarouselIndex}
            autoPlay={true}
            autoPlayInterval={4000}
          />
        </section>

        {/* Touch-Optimized Forms */}
        <section className="mb-12">
          <h2 className="text-responsive-heading mb-6">
            Touch-Optimized Form Inputs
          </h2>
          <div className="grid-responsive gap-6">
            <TouchOptimizedInput
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(value) => handleFormChange('name', value)}
              required
            />
            <TouchOptimizedInput
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(value) => handleFormChange('email', value)}
              required
            />
            <TouchOptimizedSelect
              label="Event Type"
              options={eventOptions}
              value={formData.eventType}
              onChange={(value) => handleFormChange('eventType', value)}
              placeholder="Select event type"
              required
            />
            <TouchOptimizedInput
              type="search"
              label="Search"
              placeholder="Search designs..."
              value={formData.search}
              onChange={(value) => handleFormChange('search', value)}
            />
            <div className="md:col-span-2">
              <TouchOptimizedTextarea
                label="Event Description"
                placeholder="Describe your event vision..."
                value={formData.description}
                onChange={(value) => handleFormChange('description', value)}
                rows={4}
                maxLength={500}
              />
            </div>
          </div>
        </section>

        {/* Swipe Gestures Demo */}
        <section className="mb-12">
          <h2 className="text-responsive-heading mb-6">
            Swipe Gestures
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-cultural-text">
                Swipe to Reveal Actions
              </h3>
              <SwipeableList items={listItems} />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 text-cultural-text">
                Custom Swipe Area
              </h3>
              <SwipeGesture
                onSwipeLeft={() => alert('Swiped left!')}
                onSwipeRight={() => alert('Swiped right!')}
                onSwipeUp={() => alert('Swiped up!')}
                onSwipeDown={() => alert('Swiped down!')}
                className="card-cultural p-8 text-center"
              >
                <div className="text-cultural-text">
                  <Move className="w-12 h-12 mx-auto mb-4 text-cultural-accent" />
                  <h4 className="text-lg font-medium mb-2">Try Swiping</h4>
                  <p className="text-cultural-secondary">
                    Swipe in any direction to trigger actions
                  </p>
                </div>
              </SwipeGesture>
            </div>
          </div>
        </section>

        {/* Camera Integration */}
        <section className="mb-12">
          <h2 className="text-responsive-heading mb-6">
            Mobile Camera Integration
          </h2>
          <div className="card-cultural p-6">
            <div className="text-center mb-6">
              <Camera className="w-16 h-16 mx-auto mb-4 text-cultural-accent" />
              <h3 className="text-xl font-medium mb-2 text-cultural-text">
                Native Camera Access
              </h3>
              <p className="text-cultural-secondary">
                Capture photos directly from your device camera
              </p>
            </div>
            
            <div className="flex justify-center mb-6">
              <MobileCameraButton
                onCapture={handleCameraCapture}
                buttonText="Open Camera"
              />
            </div>

            {capturedImages.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-4 text-cultural-text">
                  Captured Images ({capturedImages.length})
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {capturedImages.map((file, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Captured ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Responsive Grid Demo */}
        <section className="mb-12">
          <h2 className="text-responsive-heading mb-6">
            Responsive Grid System
          </h2>
          <div className="grid-responsive">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="card-cultural p-6 text-center">
                <div className="w-12 h-12 bg-cultural-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">{i + 1}</span>
                </div>
                <h4 className="font-medium text-cultural-text">Card {i + 1}</h4>
                <p className="text-sm text-cultural-secondary mt-2">
                  Responsive grid item
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Breakpoint Information */}
        <section className="mb-12">
          <h2 className="text-responsive-heading mb-6">
            Breakpoint Information
          </h2>
          <div className="card-cultural p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4 text-cultural-text">Device Breakpoints</h3>
                <ul className="space-y-2 text-cultural-secondary">
                  <li><strong>xs:</strong> 475px and up</li>
                  <li><strong>sm:</strong> 640px and up</li>
                  <li><strong>md:</strong> 768px and up</li>
                  <li><strong>lg:</strong> 1024px and up</li>
                  <li><strong>xl:</strong> 1280px and up</li>
                  <li><strong>2xl:</strong> 1536px and up</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 text-cultural-text">Special Breakpoints</h3>
                <ul className="space-y-2 text-cultural-secondary">
                  <li><strong>mobile:</strong> up to 767px</li>
                  <li><strong>tablet:</strong> 768px to 1023px</li>
                  <li><strong>desktop:</strong> 1024px and up</li>
                  <li><strong>touch:</strong> Touch devices</li>
                  <li><strong>no-touch:</strong> Desktop/mouse</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Notes */}
        <section>
          <h2 className="text-responsive-heading mb-6">
            Performance Optimizations
          </h2>
          <div className="card-cultural p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-cultural-text">Mobile-First</h3>
                <p className="text-cultural-secondary">
                  Base styles optimized for mobile devices, enhanced progressively for larger screens.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3 text-cultural-text">Touch-Friendly</h3>
                <p className="text-cultural-secondary">
                  Minimum 44px touch targets, optimized tap areas, and gesture recognition.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3 text-cultural-text">Accessibility</h3>
                <p className="text-cultural-secondary">
                  Reduced motion support, high contrast mode, and screen reader optimization.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResponsiveDemo;