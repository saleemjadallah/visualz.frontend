'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, AlertCircle, Info } from 'lucide-react';
import { colorContrast, screenReader, accessibilityTesting } from '@/lib/accessibility';
import AccessibleButton from './ui/AccessibleButton';
import { AccessibleFormField, AccessibleSelect, AccessibleTextarea } from './ui/AccessibleForm';
import { AccessibleNavigationDemo } from './ui/AccessibleNavigation';

interface ContrastTestResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  passesAAALarge: boolean;
  bg: string;
  fg: string;
  name: string;
}

const AccessibilityDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    country: '',
    newsletter: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [contrastTests, setContrastTests] = useState<ContrastTestResult[]>([]);
  const [showDemo, setShowDemo] = useState('overview');

  // Test color combinations
  const colorCombinations = [
    { bg: '#ffffff', fg: '#000000', name: 'Black on White' },
    { bg: '#000000', fg: '#ffffff', name: 'White on Black' },
    { bg: '#f0f0f0', fg: '#333333', name: 'Dark Gray on Light Gray' },
    { bg: '#0066cc', fg: '#ffffff', name: 'White on Blue' },
    { bg: '#e6b866', fg: '#4a4a4a', name: 'Cultural Accent Test' },
  ];

  // Run contrast tests
  useEffect(() => {
    const results = colorCombinations.map(combo => ({
      ...combo,
      ...accessibilityTesting.testColorContrast(combo.bg, combo.fg),
    }));
    setContrastTests(results);
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: Record<string, string> = {};
    
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (formData.email && !formData.email.includes('@')) errors.email = 'Please enter a valid email';
    if (!formData.message) errors.message = 'Message is required';
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      screenReader.announce('Form submitted successfully!');
    } else {
      screenReader.announce('Please fix the errors in the form');
    }
  };

  const ContrastTestCard: React.FC<{ test: ContrastTestResult }> = ({ test }) => (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{test.name}</h4>
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: test.bg }}
          />
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: test.fg }}
          />
        </div>
      </div>
      
      <div 
        className="p-3 rounded text-center"
        style={{ backgroundColor: test.bg, color: test.fg }}
      >
        Sample text with ratio {test.ratio.toFixed(2)}
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center space-x-1">
          {test.passesAA ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
          <span>WCAG AA</span>
        </div>
        <div className="flex items-center space-x-1">
          {test.passesAAA ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
          <span>WCAG AAA</span>
        </div>
        <div className="flex items-center space-x-1">
          {test.passesAALarge ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
          <span>Large AA</span>
        </div>
        <div className="flex items-center space-x-1">
          {test.passesAAALarge ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
          <span>Large AAA</span>
        </div>
      </div>
    </div>
  );

  const AccessibleForm: React.FC = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AccessibleFormField
        id="name"
        label="Full Name"
        value={formData.name}
        onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
        error={formErrors.name}
        required
        cultural
      />
      
      <AccessibleFormField
        id="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
        error={formErrors.email}
        description="We'll never share your email with anyone else"
        required
        cultural
      />
      
      <AccessibleSelect
        id="country"
        label="Country"
        value={formData.country}
        onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
        options={[
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'au', label: 'Australia' },
        ]}
        placeholder="Select your country"
        cultural
      />
      
      <AccessibleTextarea
        id="message"
        label="Message"
        value={formData.message}
        onChange={(value) => setFormData(prev => ({ ...prev, message: value }))}
        error={formErrors.message}
        description="Tell us about your accessibility needs"
        maxLength={500}
        rows={4}
        required
        cultural
      />
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="newsletter"
          checked={formData.newsletter}
          onChange={(e) => setFormData(prev => ({ ...prev, newsletter: e.target.checked }))}
          className="h-4 w-4 text-cultural-accent focus:ring-cultural-accent border-cultural-secondary rounded"
        />
        <label htmlFor="newsletter" className="text-sm text-cultural-text">
          Subscribe to our newsletter for accessibility updates
        </label>
      </div>
      
      <div className="flex space-x-4">
        <AccessibleButton
          type="submit"
          cultural
          announcement="Form submission attempted"
        >
          Submit Form
        </AccessibleButton>
        
        <AccessibleButton
          type="button"
          variant="secondary"
          onClick={() => {
            setFormData({ name: '', email: '', message: '', country: '', newsletter: false });
            setFormErrors({});
            screenReader.announce('Form cleared');
          }}
          cultural
        >
          Clear Form
        </AccessibleButton>
      </div>
    </form>
  );

  const KeyboardDemo: React.FC = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h4 className="font-medium text-cultural-text">Button Navigation</h4>
          <div className="space-y-2">
            <AccessibleButton cultural>Primary Button</AccessibleButton>
            <AccessibleButton variant="secondary" cultural>Secondary Button</AccessibleButton>
            <AccessibleButton variant="outline" cultural>Outline Button</AccessibleButton>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-cultural-text">Form Navigation</h4>
          <div className="space-y-2">
            <AccessibleFormField
              id="demo-input-1"
              label="First Input"
              value=""
              onChange={() => {}}
              cultural
            />
            <AccessibleFormField
              id="demo-input-2"
              label="Second Input"
              value=""
              onChange={() => {}}
              cultural
            />
            <AccessibleFormField
              id="demo-input-3"
              label="Third Input"
              value=""
              onChange={() => {}}
              cultural
            />
          </div>
        </div>
      </div>
      
      <div className="bg-cultural-soft p-4 rounded-lg">
        <h4 className="font-medium text-cultural-text mb-2">Keyboard Navigation Tips</h4>
        <ul className="space-y-1 text-sm text-cultural-secondary">
          <li>• Use <kbd className="px-2 py-1 bg-cultural-neutral rounded">Tab</kbd> to move forward</li>
          <li>• Use <kbd className="px-2 py-1 bg-cultural-neutral rounded">Shift+Tab</kbd> to move backward</li>
          <li>• Use <kbd className="px-2 py-1 bg-cultural-neutral rounded">Enter</kbd> or <kbd className="px-2 py-1 bg-cultural-neutral rounded">Space</kbd> to activate buttons</li>
          <li>• Use <kbd className="px-2 py-1 bg-cultural-neutral rounded">Escape</kbd> to close modals</li>
          <li>• Use <kbd className="px-2 py-1 bg-cultural-neutral rounded">Arrow keys</kbd> for menu navigation</li>
        </ul>
      </div>
    </div>
  );

  const ScreenReaderDemo: React.FC = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-cultural-text">Screen Reader Announcements</h4>
        <div className="space-y-2">
          <AccessibleButton
            onClick={() => screenReader.announce('This is a polite announcement')}
            cultural
          >
            Make Polite Announcement
          </AccessibleButton>
          <AccessibleButton
            onClick={() => screenReader.announce('This is an assertive announcement!', 'assertive')}
            variant="secondary"
            cultural
          >
            Make Assertive Announcement
          </AccessibleButton>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium text-cultural-text">ARIA Live Regions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium">Polite Region</h5>
            <div 
              className="p-3 bg-cultural-soft rounded border"
              aria-live="polite"
              aria-atomic="true"
            >
              Status updates appear here
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium">Assertive Region</h5>
            <div 
              className="p-3 bg-cultural-soft rounded border"
              aria-live="assertive"
              aria-atomic="true"
            >
              Urgent announcements appear here
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-cultural-soft p-4 rounded-lg">
        <h4 className="font-medium text-cultural-text mb-2">Screen Reader Features</h4>
        <ul className="space-y-1 text-sm text-cultural-secondary">
          <li>• <strong>ARIA labels:</strong> Descriptive text for screen readers</li>
          <li>• <strong>Live regions:</strong> Announce dynamic content changes</li>
          <li>• <strong>Landmark navigation:</strong> Skip links and headings</li>
          <li>• <strong>Form descriptions:</strong> Help text and error messages</li>
          <li>• <strong>Button states:</strong> Pressed, expanded, selected states</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cultural-bg">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-cultural-text">
            Accessibility & Testing Demo
          </h1>
          <p className="text-cultural-secondary text-lg">
            Comprehensive WCAG 2.1 AA compliance demonstration
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'navigation', label: 'Navigation' },
            { id: 'forms', label: 'Forms' },
            { id: 'keyboard', label: 'Keyboard' },
            { id: 'screen-reader', label: 'Screen Reader' },
            { id: 'contrast', label: 'Color Contrast' },
          ].map(item => (
            <AccessibleButton
              key={item.id}
              variant={showDemo === item.id ? 'primary' : 'outline'}
              onClick={() => setShowDemo(item.id)}
              cultural
            >
              {item.label}
            </AccessibleButton>
          ))}
        </div>

        {/* Demo Content */}
        <div className="card-cultural p-8">
          {showDemo === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-cultural-text">Accessibility Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cultural-text">WCAG 2.1 Features</h3>
                  <ul className="space-y-2 text-cultural-secondary">
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Keyboard navigation support</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Screen reader optimization</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>ARIA labels and descriptions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Focus management</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Color contrast compliance</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cultural-text">Testing Framework</h3>
                  <ul className="space-y-2 text-cultural-secondary">
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Jest + React Testing Library</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Axe-core accessibility testing</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Component integration tests</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Form validation testing</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Cultural component tests</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-medium">Accessibility Testing</p>
                    <p className="text-blue-700 text-sm">
                      All components are tested for WCAG 2.1 AA compliance using automated tools and manual testing procedures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showDemo === 'navigation' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-cultural-text">Navigation Demo</h2>
              <AccessibleNavigationDemo />
            </div>
          )}

          {showDemo === 'forms' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-cultural-text">Accessible Forms</h2>
              <AccessibleForm />
            </div>
          )}

          {showDemo === 'keyboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-cultural-text">Keyboard Navigation</h2>
              <KeyboardDemo />
            </div>
          )}

          {showDemo === 'screen-reader' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-cultural-text">Screen Reader Support</h2>
              <ScreenReaderDemo />
            </div>
          )}

          {showDemo === 'contrast' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-cultural-text">Color Contrast Testing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contrastTests.map((test, index) => (
                  <ContrastTestCard key={index} test={test} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Region for Announcements */}
        <div 
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
          id="announcements"
        />
      </div>
    </div>
  );
};

export default AccessibilityDemo;