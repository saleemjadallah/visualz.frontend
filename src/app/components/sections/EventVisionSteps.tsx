'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Palette, Home, Heart, Upload, Camera, Calendar, Users } from 'lucide-react';

const EventVisionSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: '',
    guestCount: '',
    culturalStyle: '',
    venueType: '',
    spaceSize: '',
    budgetRange: '',
    photos: [] as File[],
    colorPreferences: [] as string[],
    specialElements: [] as string[],
    accessibility: [] as string[],
    seasonalElements: ''
  });

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSelection = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).includes(value) 
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...Array.from(files)]
      }));
    }
  };

  const isStepComplete = () => {
    switch(currentStep) {
      case 1: return formData.eventType !== '';
      case 2: return formData.guestCount !== '';
      case 3: return formData.culturalStyle !== '';
      case 4: return formData.venueType !== '' && formData.spaceSize !== '' && formData.budgetRange !== '';
      case 5: return true; // Optional step
      default: return false;
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-center items-center space-x-4 mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
            ${step < currentStep ? 'bg-green-500 text-white' : 
              step === currentStep ? 'text-white' : 
              'border-2 text-gray-500'}
          `}
          style={{
            backgroundColor: step < currentStep ? '#10b981' : step === currentStep ? 'var(--cultural-accent)' : 'transparent',
            borderColor: step === currentStep ? 'var(--cultural-accent)' : 'var(--cultural-secondary)',
            color: step < currentStep ? 'white' : step === currentStep ? 'var(--cultural-text)' : 'var(--cultural-text-light)'
          }}>
            {step}
          </div>
          {step < 5 && (
            <div className="w-8 h-0.5 mx-2" style={{ backgroundColor: 'var(--cultural-secondary)' }} />
          )}
        </div>
      ))}
    </div>
  );

  const Step1EventType = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-gentle-float"
             style={{ backgroundColor: 'var(--cultural-accent)' }}>
          <Calendar className="w-8 h-8" style={{ color: 'var(--cultural-text)' }} />
        </div>
        <h2 className="section-title">
          What kind of event are you planning?
        </h2>
        <p className="section-subtitle">
          Choose the type of celebration that matches your vision
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 'wedding',
            name: 'Wedding',
            description: 'Celebrate your special day',
            emoji: '💍',
            details: 'Ceremony, reception, and celebration'
          },
          {
            id: 'birthday',
            name: 'Birthday Party',
            description: 'Milestone celebrations',
            emoji: '🎂',
            details: 'From intimate to grand celebrations'
          },
          {
            id: 'anniversary',
            name: 'Anniversary',
            description: 'Commemorating special moments',
            emoji: '💝',
            details: 'Romantic and meaningful gatherings'
          },
          {
            id: 'corporate',
            name: 'Corporate Event',
            description: 'Professional gatherings',
            emoji: '🏢',
            details: 'Meetings, conferences, and team building'
          },
          {
            id: 'graduation',
            name: 'Graduation',
            description: 'Academic achievements',
            emoji: '🎓',
            details: 'Celebrating educational milestones'
          },
          {
            id: 'holiday',
            name: 'Holiday Party',
            description: 'Seasonal celebrations',
            emoji: '🎄',
            details: 'Christmas, New Year, and cultural holidays'
          },
          {
            id: 'baby-shower',
            name: 'Baby Shower',
            description: 'Welcoming new arrivals',
            emoji: '🍼',
            details: 'Celebrating upcoming arrivals'
          },
          {
            id: 'reunion',
            name: 'Family Reunion',
            description: 'Bringing families together',
            emoji: '👨‍👩‍👧‍👦',
            details: 'Multi-generational gatherings'
          },
          {
            id: 'other',
            name: 'Other Event',
            description: 'Custom celebrations',
            emoji: '✨',
            details: 'Tell us about your unique vision'
          }
        ].map((event) => (
          <div
            key={event.id}
            onClick={() => handleSelection('eventType', event.id)}
            className={`
              card-cultural p-6 cursor-pointer transition-all duration-300
              ${formData.eventType === event.id 
                ? 'border-2 transform -translate-y-1' 
                : 'border border-opacity-50 hover:transform hover:-translate-y-1'}
            `}
            style={{
              borderColor: formData.eventType === event.id 
                ? 'var(--cultural-accent)' 
                : 'var(--cultural-secondary)'
            }}
          >
            <div className="text-4xl mb-3">{event.emoji}</div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--cultural-text)' }}>
              {event.name}
            </h3>
            <p className="text-sm mb-2" style={{ color: 'var(--cultural-text-light)' }}>
              {event.description}
            </p>
            <p className="text-xs" style={{ color: 'var(--cultural-text-light)' }}>
              {event.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const Step2GuestCount = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-gentle-float"
             style={{ backgroundColor: 'var(--cultural-accent)' }}>
          <Users className="w-8 h-8" style={{ color: 'var(--cultural-text)' }} />
        </div>
        <h2 className="section-title">
          How many guests will be attending?
        </h2>
        <p className="section-subtitle">
          This helps us plan the perfect space and atmosphere
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            id: 'intimate',
            name: 'Intimate Gathering',
            range: '1-10 guests',
            emoji: '👥',
            description: 'Close family and friends',
            suggestions: 'Perfect for cozy, personal celebrations'
          },
          {
            id: 'small',
            name: 'Small Event',
            range: '11-30 guests',
            emoji: '👨‍👩‍👧‍👦',
            description: 'Extended family and friends',
            suggestions: 'Great for home venues or small halls'
          },
          {
            id: 'medium',
            name: 'Medium Event',
            range: '31-75 guests',
            emoji: '🎉',
            description: 'Larger social circle',
            suggestions: 'Requires dedicated event space'
          },
          {
            id: 'large',
            name: 'Large Event',
            range: '76-150 guests',
            emoji: '🏛️',
            description: 'Full community celebration',
            suggestions: 'Banquet halls and large venues'
          },
          {
            id: 'grand',
            name: 'Grand Event',
            range: '151-300 guests',
            emoji: '🎊',
            description: 'Major celebration',
            suggestions: 'Convention centers and ballrooms'
          },
          {
            id: 'massive',
            name: 'Massive Event',
            range: '300+ guests',
            emoji: '🎆',
            description: 'Community-wide celebration',
            suggestions: 'Large venues and outdoor spaces'
          }
        ].map((size) => (
          <div
            key={size.id}
            onClick={() => handleSelection('guestCount', size.id)}
            className={`
              card-cultural p-6 cursor-pointer transition-all duration-300
              ${formData.guestCount === size.id 
                ? 'border-2 transform -translate-y-1' 
                : 'border border-opacity-50 hover:transform hover:-translate-y-1'}
            `}
            style={{
              borderColor: formData.guestCount === size.id 
                ? 'var(--cultural-accent)' 
                : 'var(--cultural-secondary)'
            }}
          >
            <div className="text-4xl mb-3">{size.emoji}</div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--cultural-text)' }}>
              {size.name}
            </h3>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--cultural-accent)' }}>
              {size.range}
            </p>
            <p className="text-sm mb-2" style={{ color: 'var(--cultural-text-light)' }}>
              {size.description}
            </p>
            <p className="text-xs" style={{ color: 'var(--cultural-text-light)' }}>
              {size.suggestions}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const Step3CulturalStyle = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-gentle-float"
             style={{ backgroundColor: 'var(--cultural-accent)' }}>
          <Palette className="w-8 h-8" style={{ color: 'var(--cultural-text)' }} />
        </div>
        <h2 className="section-title">
          What cultural style speaks to you?
        </h2>
        <p className="section-subtitle">
          Choose the aesthetic that reflects your heritage or design vision
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 'wabi-sabi',
            name: 'Wabi-Sabi (Japanese)',
            description: 'Natural beauty and imperfection',
            emoji: '🌸',
            colors: ['#8B7355', '#D4B896', '#F5F5DC']
          },
          {
            id: 'hygge',
            name: 'Hygge (Scandinavian)',
            description: 'Cozy, comfortable living',
            emoji: '🕯️',
            colors: ['#F5F5F5', '#D3D3D3', '#8B4513']
          },
          {
            id: 'bella-figura',
            name: 'Bella Figura (Italian)',
            description: 'Elegant sophistication',
            emoji: '🏛️',
            colors: ['#8B0000', '#FFD700', '#2F4F4F']
          },
          {
            id: 'savoir-vivre',
            name: 'Savoir-Vivre (French)',
            description: 'Refined art of living',
            emoji: '🥂',
            colors: ['#4169E1', '#FFB6C1', '#F5F5F5']
          },
          {
            id: 'modern',
            name: 'Modern Contemporary',
            description: 'Clean, minimalist design',
            emoji: '◼️',
            colors: ['#000000', '#FFFFFF', '#808080']
          },
          {
            id: 'fusion',
            name: 'Cultural Fusion',
            description: 'Blend multiple traditions',
            emoji: '🌍',
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1']
          }
        ].map((style) => (
          <div
            key={style.id}
            onClick={() => handleSelection('culturalStyle', style.id)}
            className={`
              card-cultural p-6 cursor-pointer transition-all duration-300
              ${formData.culturalStyle === style.id 
                ? 'border-2 transform -translate-y-1' 
                : 'border border-opacity-50 hover:transform hover:-translate-y-1'}
            `}
            style={{
              borderColor: formData.culturalStyle === style.id 
                ? 'var(--cultural-accent)' 
                : 'var(--cultural-secondary)'
            }}
          >
            <div className="text-4xl mb-3">{style.emoji}</div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--cultural-text)' }}>
              {style.name}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--cultural-text-light)' }}>
              {style.description}
            </p>
            <div className="flex space-x-2">
              {style.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-full border"
                  style={{ 
                    backgroundColor: color,
                    borderColor: 'var(--cultural-secondary)'
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Step4SpaceBudget = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-gentle-float"
             style={{ backgroundColor: 'var(--cultural-accent)' }}>
          <Home className="w-8 h-8" style={{ color: 'var(--cultural-text)' }} />
        </div>
        <h2 className="section-title">
          Tell us about your space and budget
        </h2>
        <p className="section-subtitle">
          Help us create a design that fits your venue and investment
        </p>
      </div>

      <div className="space-y-8">
        {/* Venue Type */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
            Venue Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'indoor', label: 'Indoor', icon: '🏠' },
              { id: 'outdoor', label: 'Outdoor', icon: '🌳' },
              { id: 'both', label: 'Indoor + Outdoor', icon: '🏡' }
            ].map((venue) => (
              <button
                key={venue.id}
                onClick={() => handleSelection('venueType', venue.id)}
                className={`
                  btn-cultural-secondary p-4 rounded-xl transition-all text-center
                  ${formData.venueType === venue.id 
                    ? 'transform -translate-y-1 shadow-lg' 
                    : 'hover:transform hover:-translate-y-1'}
                `}
                style={{
                  backgroundColor: formData.venueType === venue.id 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-soft)',
                  borderColor: formData.venueType === venue.id 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-secondary)'
                }}
              >
                <div className="text-2xl mb-2">{venue.icon}</div>
                <div className="font-medium" style={{ color: 'var(--cultural-text)' }}>
                  {venue.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Space Size */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
            Space Size
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'small', label: 'Small Room', desc: 'Up to 500 sq ft' },
              { id: 'medium', label: 'Medium Hall', desc: '500-1500 sq ft' },
              { id: 'large', label: 'Large Venue', desc: '1500-5000 sq ft' },
              { id: 'grand', label: 'Grand Space', desc: '5000+ sq ft' }
            ].map((size) => (
              <button
                key={size.id}
                onClick={() => handleSelection('spaceSize', size.id)}
                className={`
                  btn-cultural-secondary p-4 rounded-xl transition-all text-center
                  ${formData.spaceSize === size.id 
                    ? 'transform -translate-y-1 shadow-lg' 
                    : 'hover:transform hover:-translate-y-1'}
                `}
                style={{
                  backgroundColor: formData.spaceSize === size.id 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-soft)',
                  borderColor: formData.spaceSize === size.id 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-secondary)'
                }}
              >
                <div className="font-medium" style={{ color: 'var(--cultural-text)' }}>
                  {size.label}
                </div>
                <div className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                  {size.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
            Budget Range
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'essential', label: 'Essential', range: 'Under $1K', desc: 'DIY focused' },
              { id: 'elevated', label: 'Elevated', range: '$1K - $5K', desc: 'Balanced approach' },
              { id: 'luxury', label: 'Luxury', range: '$5K - $15K', desc: 'Premium materials' },
              { id: 'premium', label: 'Premium', range: '$15K+', desc: 'No limitations' }
            ].map((budget) => (
              <button
                key={budget.id}
                onClick={() => handleSelection('budgetRange', budget.id)}
                className={`
                  btn-cultural-secondary p-4 rounded-xl transition-all text-center
                  ${formData.budgetRange === budget.id 
                    ? 'transform -translate-y-1 shadow-lg' 
                    : 'hover:transform hover:-translate-y-1'}
                `}
                style={{
                  backgroundColor: formData.budgetRange === budget.id 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-soft)',
                  borderColor: formData.budgetRange === budget.id 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-secondary)'
                }}
              >
                <div className="font-medium" style={{ color: 'var(--cultural-text)' }}>
                  {budget.label}
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--cultural-accent)' }}>
                  {budget.range}
                </div>
                <div className="text-xs" style={{ color: 'var(--cultural-text-light)' }}>
                  {budget.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
            Space Photos (Optional)
          </h3>
          <div className="card-cultural p-8 text-center border-2 border-dashed hover:border-solid transition-all"
               style={{ borderColor: 'var(--cultural-secondary)' }}>
            <Camera className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--cultural-text-light)' }} />
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--cultural-text)' }}>
              Upload photos of your space
            </p>
            <p className="mb-4" style={{ color: 'var(--cultural-text-light)' }}>
              Help our AI understand your venue better
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="btn-cultural cursor-pointer inline-flex items-center justify-center"
            >
              Choose Photos
            </label>
          </div>
          {formData.photos.length > 0 && (
            <div className="mt-4">
              <p className="text-sm" style={{ color: 'var(--cultural-text-light)' }}>
                {formData.photos.length} photo(s) uploaded
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const Step5Personalization = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-gentle-float"
             style={{ backgroundColor: 'var(--cultural-accent)' }}>
          <Heart className="w-8 h-8" style={{ color: 'var(--cultural-text)' }} />
        </div>
        <h2 className="section-title">
          Any special touches?
        </h2>
        <p className="section-subtitle">
          Final details to make your event uniquely yours
        </p>
      </div>

      <div className="space-y-8">
        {/* Color Preferences */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
            Color Preferences
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'Warm Reds', color: '#DC2626' },
              { name: 'Deep Blues', color: '#1D4ED8' },
              { name: 'Forest Greens', color: '#059669' },
              { name: 'Golden Yellow', color: '#D97706' },
              { name: 'Royal Purple', color: '#7C3AED' },
              { name: 'Soft Pink', color: '#EC4899' },
              { name: 'Earth Tones', color: '#92400E' },
              { name: 'Monochrome', color: '#374151' }
            ].map((color) => (
              <button
                key={color.name}
                onClick={() => handleArrayToggle('colorPreferences', color.name)}
                className={`
                  btn-cultural-secondary p-3 rounded-xl transition-all text-center text-sm
                  ${formData.colorPreferences.includes(color.name) 
                    ? 'transform -translate-y-1 shadow-lg' 
                    : 'hover:transform hover:-translate-y-1'}
                `}
                style={{
                  backgroundColor: formData.colorPreferences.includes(color.name) 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-soft)',
                  borderColor: formData.colorPreferences.includes(color.name) 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-secondary)'
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full mx-auto mb-2 border"
                  style={{ 
                    backgroundColor: color.color,
                    borderColor: 'var(--cultural-secondary)'
                  }}
                />
                <div className="font-medium" style={{ color: 'var(--cultural-text)' }}>
                  {color.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Special Elements */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
            Must-Have Elements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Traditional Ceremonies',
              'Family Heirlooms',
              'Religious Elements',
              'Live Music Space',
              'Photo Booth Area',
              'Dancing Area',
              'Quiet Conversation Zones',
              'Children\'s Area',
              'Outdoor Elements'
            ].map((element) => (
              <button
                key={element}
                onClick={() => handleArrayToggle('specialElements', element)}
                className={`
                  btn-cultural-secondary p-3 rounded-xl transition-all text-left
                  ${formData.specialElements.includes(element) 
                    ? 'transform -translate-y-1 shadow-lg' 
                    : 'hover:transform hover:-translate-y-1'}
                `}
                style={{
                  backgroundColor: formData.specialElements.includes(element) 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-soft)',
                  borderColor: formData.specialElements.includes(element) 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-secondary)',
                  color: 'var(--cultural-text)'
                }}
              >
                {element}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
            Accessibility Needs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Wheelchair Access',
              'Senior-Friendly Design',
              'Child-Safe Setup',
              'Visual Impairment Support',
              'Hearing Assistance',
              'Easy Navigation'
            ].map((access) => (
              <button
                key={access}
                onClick={() => handleArrayToggle('accessibility', access)}
                className={`
                  btn-cultural-secondary p-3 rounded-xl transition-all text-left
                  ${formData.accessibility.includes(access) 
                    ? 'transform -translate-y-1 shadow-lg' 
                    : 'hover:transform hover:-translate-y-1'}
                `}
                style={{
                  backgroundColor: formData.accessibility.includes(access) 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-soft)',
                  borderColor: formData.accessibility.includes(access) 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-secondary)',
                  color: 'var(--cultural-text)'
                }}
              >
                {access}
              </button>
            ))}
          </div>
        </div>

        {/* Seasonal Elements */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
            Seasonal Inspiration
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'spring', label: 'Spring Florals', emoji: '🌸' },
              { id: 'summer', label: 'Summer Brightness', emoji: '☀️' },
              { id: 'autumn', label: 'Autumn Warmth', emoji: '🍂' },
              { id: 'winter', label: 'Winter Elegance', emoji: '❄️' }
            ].map((season) => (
              <button
                key={season.id}
                onClick={() => handleSelection('seasonalElements', season.id)}
                className={`
                  btn-cultural-secondary p-4 rounded-xl transition-all text-center
                  ${formData.seasonalElements === season.id 
                    ? 'transform -translate-y-1 shadow-lg' 
                    : 'hover:transform hover:-translate-y-1'}
                `}
                style={{
                  backgroundColor: formData.seasonalElements === season.id 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-soft)',
                  borderColor: formData.seasonalElements === season.id 
                    ? 'var(--cultural-accent)' 
                    : 'var(--cultural-secondary)'
                }}
              >
                <div className="text-2xl mb-2">{season.emoji}</div>
                <div className="font-medium" style={{ color: 'var(--cultural-text)' }}>
                  {season.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const generateDesign = () => {
    console.log('Generating design with:', formData);
    alert('Design generation would start here! Check console for form data.');
  };

  return (
    <section className="section-cultural pattern-japanese">
      <div className="container-cultural">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="hero-title" style={{ color: 'var(--cultural-text)' }}>
            Tell Us About Your Vision
          </h1>
          <p className="section-subtitle">
            Help our AI understand your cultural preferences and design dreams
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        <div className="text-center mb-8">
          <p style={{ color: 'var(--cultural-text-light)' }}>
            Step {currentStep} of 5 • Takes about 3 minutes
          </p>
        </div>

        {/* Step Content */}
        <div className="mb-12">
          {currentStep === 1 && <Step1EventType />}
          {currentStep === 2 && <Step2GuestCount />}
          {currentStep === 3 && <Step3CulturalStyle />}
          {currentStep === 4 && <Step4SpaceBudget />}
          {currentStep === 5 && <Step5Personalization />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`
              btn-cultural-secondary flex items-center transition-all
              ${currentStep === 1 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:transform hover:-translate-y-1'}
            `}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className={`
                btn-cultural flex items-center transition-all
                ${isStepComplete() 
                  ? 'hover:transform hover:-translate-y-1' 
                  : 'opacity-50 cursor-not-allowed'}
              `}
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={generateDesign}
              className="btn-cultural bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:-translate-y-1"
            >
              ✨ Generate My Design
            </button>
          )}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="card-cultural p-6">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--cultural-text)' }}>
              Your Selection Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {formData.eventType && (
                <div>
                  <span className="font-medium" style={{ color: 'var(--cultural-text)' }}>Event:</span>
                  <span className="ml-2 capitalize" style={{ color: 'var(--cultural-text-light)' }}>
                    {formData.eventType.replace('-', ' ')}
                  </span>
                </div>
              )}
              {formData.guestCount && (
                <div>
                  <span className="font-medium" style={{ color: 'var(--cultural-text)' }}>Size:</span>
                  <span className="ml-2 capitalize" style={{ color: 'var(--cultural-text-light)' }}>
                    {formData.guestCount}
                  </span>
                </div>
              )}
              {formData.culturalStyle && (
                <div>
                  <span className="font-medium" style={{ color: 'var(--cultural-text)' }}>Style:</span>
                  <span className="ml-2 capitalize" style={{ color: 'var(--cultural-text-light)' }}>
                    {formData.culturalStyle.replace('-', ' ')}
                  </span>
                </div>
              )}
              {formData.venueType && (
                <div>
                  <span className="font-medium" style={{ color: 'var(--cultural-text)' }}>Venue:</span>
                  <span className="ml-2 capitalize" style={{ color: 'var(--cultural-text-light)' }}>
                    {formData.venueType}
                  </span>
                </div>
              )}
              {formData.budgetRange && (
                <div>
                  <span className="font-medium" style={{ color: 'var(--cultural-text)' }}>Budget:</span>
                  <span className="ml-2 capitalize" style={{ color: 'var(--cultural-text-light)' }}>
                    {formData.budgetRange}
                  </span>
                </div>
              )}
              {formData.colorPreferences.length > 0 && (
                <div>
                  <span className="font-medium" style={{ color: 'var(--cultural-text)' }}>Colors:</span>
                  <span className="ml-2" style={{ color: 'var(--cultural-text-light)' }}>
                    {formData.colorPreferences.length} selected
                  </span>
                </div>
              )}
              {formData.specialElements.length > 0 && (
                <div>
                  <span className="font-medium" style={{ color: 'var(--cultural-text)' }}>Special Elements:</span>
                  <span className="ml-2" style={{ color: 'var(--cultural-text-light)' }}>
                    {formData.specialElements.length} selected
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventVisionSteps;