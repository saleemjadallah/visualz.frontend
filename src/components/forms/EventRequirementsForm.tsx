'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Palette,
  Globe,
  Sparkles,
  Camera,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/layout/Container';
import { useTheme } from '@/components/cultural/ThemeProvider';
import { cn } from '@/lib/utils';
import { EventRequirementsForm as FormData, EventType, CultureType, BudgetTier } from '@/lib/types';
import { SpaceImageUpload } from './SpaceImageUpload';

interface EventRequirementsFormProps {
  onComplete?: (data: FormData) => void;
  onStepChange?: (step: number) => void;
  className?: string;
}

const steps = [
  { id: 1, title: 'Event Type', subtitle: 'What are you celebrating?', icon: <Calendar /> },
  { id: 2, title: 'Space Upload', subtitle: 'Upload your venue photos', icon: <Camera /> },
  { id: 3, title: 'Cultural Style', subtitle: 'Choose your aesthetic', icon: <Globe /> },
  { id: 4, title: 'Budget', subtitle: 'Investment level', icon: <DollarSign /> },
  { id: 5, title: 'Guest Details', subtitle: 'Who\'s coming?', icon: <Users /> },
  { id: 6, title: 'Style Preferences', subtitle: 'Finalize your vision', icon: <Palette /> }
];

const EventRequirementsForm: React.FC<EventRequirementsFormProps> = ({
  onComplete,
  onStepChange,
  className
}) => {
  const { currentTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({
    step: 1,
    culturalPreferences: [],
    specialNeeds: [],
    spaceData: {
      hasPhotos: false,
      manualEntry: {
        length: 0,
        width: 0,
        height: 0,
        roomType: '',
        features: [],
        limitations: []
      },
      aiAnalysis: null
    },
    stylePreferences: {
      colors: [],
      materials: [],
      styles: [],
      mustHave: [],
      mustAvoid: []
    }
  });

  const [isStepValid, setIsStepValid] = useState(false);

  // Validate current step
  useEffect(() => {
    switch (currentStep) {
      case 1:
        setIsStepValid(!!formData.eventType);
        break;
      case 2:
        // Space upload: valid if has photos OR manual entry is complete
        setIsStepValid(Boolean(
          (formData.spaceData?.hasPhotos === true) || 
          (formData.spaceData?.manualEntry?.length && formData.spaceData.manualEntry.length > 0 && 
           formData.spaceData?.manualEntry?.width && formData.spaceData.manualEntry.width > 0 && 
           formData.spaceData?.manualEntry?.height && formData.spaceData.manualEntry.height > 0 &&
           formData.spaceData?.manualEntry?.roomType && formData.spaceData.manualEntry.roomType.length > 0)
        ));
        break;
      case 3:
        setIsStepValid(!!formData.culturalPreferences && formData.culturalPreferences.length > 0);
        break;
      case 4:
        setIsStepValid(!!formData.budgetTier);
        break;
      case 5:
        setIsStepValid(!!formData.guestCount && formData.guestCount > 0);
        break;
      case 6:
        setIsStepValid(true); // Style preferences are optional
        break;
      default:
        setIsStepValid(false);
    }
  }, [currentStep, formData]);

  const nextStep = () => {
    if (currentStep < steps.length && isStepValid) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
      
      // Update form data step
      setFormData(prev => ({ ...prev, step: newStep }));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
      
      // Update form data step
      setFormData(prev => ({ ...prev, step: newStep }));
    }
  };

  const handleComplete = () => {
    if (isStepValid) {
      onComplete?.(formData as FormData);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-primary-50 to-cultural-primary/5", className)}>
      <Container maxWidth="2xl" padding="lg" className="py-8">
        {/* Progress Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-cultural-primary/10 rounded-full mb-4"
            >
              <Sparkles className="w-4 h-4 text-cultural-primary" />
              <span className="text-sm font-medium text-cultural-primary">AI Event Designer</span>
            </motion.div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-900 mb-2">
              Tell us about your event
            </h1>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Our AI will create culturally-intelligent designs based on your preferences
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className="relative">
                    <motion.div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                        currentStep > step.id 
                          ? "bg-cultural-primary border-cultural-primary text-white" 
                          : currentStep === step.id
                          ? "bg-white border-cultural-primary text-cultural-primary shadow-lg"
                          : "bg-white border-primary-200 text-primary-400"
                      )}
                      whileHover={{ scale: 1.05 }}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-semibold">{step.id}</span>
                      )}
                    </motion.div>
                    
                    {index < steps.length - 1 && (
                      <div 
                        className={cn(
                          "absolute top-5 left-10 h-0.5 transition-all duration-300",
                          currentStep > step.id ? "bg-cultural-primary" : "bg-primary-200"
                        )}
                        style={{ width: 'calc(100vw / 5 - 2.5rem)' }}
                      />
                    )}
                  </div>
                  
                  <div className="mt-3 text-center">
                    <div className={cn(
                      "text-sm font-medium transition-colors",
                      currentStep >= step.id ? "text-primary-900" : "text-primary-500"
                    )}>
                      {step.title}
                    </div>
                    <div className="text-xs text-primary-400 hidden sm:block">
                      {step.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Animated Progress Bar */}
            <div className="w-full bg-primary-100 rounded-full h-2 mb-8">
              <motion.div
                className="bg-gradient-to-r from-cultural-primary to-cultural-secondary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 lg:p-12 bg-white/80 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto">
              {/* Step Content will be rendered here */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-cultural-primary/10 rounded-xl flex items-center justify-center text-cultural-primary">
                    {steps[currentStep - 1].icon}
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-primary-900">
                      {steps[currentStep - 1].title}
                    </h2>
                    <p className="text-primary-600">{steps[currentStep - 1].subtitle}</p>
                  </div>
                </div>

                {/* Dynamic Step Content */}
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <EventTypeStep 
                      value={formData.eventType}
                      onChange={(eventType) => updateFormData({ eventType })}
                    />
                  )}
                  {currentStep === 2 && (
                    <SpaceUploadStep 
                      value={formData.spaceData}
                      onChange={(spaceData) => updateFormData({ spaceData })}
                    />
                  )}
                  {currentStep === 3 && (
                    <CulturalPreferencesStep 
                      value={formData.culturalPreferences || []}
                      onChange={(culturalPreferences) => updateFormData({ culturalPreferences })}
                    />
                  )}
                  {currentStep === 4 && (
                    <BudgetTierStep 
                      value={formData.budgetTier}
                      onChange={(budgetTier) => updateFormData({ budgetTier })}
                    />
                  )}
                  {currentStep === 5 && (
                    <GuestDetailsStep 
                      guestCount={formData.guestCount}
                      ageRange={formData.ageRange}
                      specialNeeds={formData.specialNeeds || []}
                      onChange={(updates) => updateFormData(updates)}
                    />
                  )}
                  {currentStep === 6 && (
                    <StylePreferencesStep 
                      value={formData.stylePreferences}
                      onChange={(stylePreferences) => updateFormData({ stylePreferences })}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-8 border-t border-primary-100">
                <Button
                  variant="ghost"
                  size="lg"
                  icon={<ArrowLeft />}
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="text-primary-600"
                >
                  Previous
                </Button>

                <div className="text-sm text-primary-500">
                  Step {currentStep} of {steps.length}
                </div>

                {currentStep === steps.length ? (
                  <Button
                    variant="cultural"
                    size="lg"
                    icon={<Sparkles />}
                    onClick={handleComplete}
                    disabled={!isStepValid}
                    className="shadow-lg"
                  >
                    Generate Design
                  </Button>
                ) : (
                  <Button
                    variant="cultural"
                    size="lg"
                    icon={<ArrowRight />}
                    onClick={nextStep}
                    disabled={!isStepValid}
                    className="shadow-lg"
                  >
                    Continue
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

// Step 1: Event Type Selection
const EventTypeStep: React.FC<{
  value?: EventType;
  onChange: (value: EventType) => void;
}> = ({ value, onChange }) => {
  const { currentTheme } = useTheme();
  
  const eventTypes = [
    {
      type: 'birthday' as EventType,
      title: 'Birthday Party',
      description: 'Celebrate another year of life with joy and style',
      icon: '🎂',
      color: 'from-pink-500 to-purple-600',
      features: ['Personal touches', 'Age-appropriate themes', 'Memory making']
    },
    {
      type: 'wedding' as EventType,
      title: 'Wedding',
      description: 'Begin your forever story with cultural elegance',
      icon: '💍',
      color: 'from-rose-400 to-pink-500',
      features: ['Cultural traditions', 'Romantic ambiance', 'Family celebration']
    },
    {
      type: 'corporate' as EventType,
      title: 'Corporate Event',
      description: 'Professional gatherings that inspire and connect',
      icon: '🏢',
      color: 'from-blue-500 to-indigo-600',
      features: ['Brand alignment', 'Networking focus', 'Professional atmosphere']
    },
    {
      type: 'cultural' as EventType,
      title: 'Cultural Celebration',
      description: 'Honor traditions with authentic cultural elements',
      icon: '🎭',
      color: 'from-amber-500 to-orange-600',
      features: ['Traditional elements', 'Cultural authenticity', 'Heritage celebration']
    },
    {
      type: 'holiday' as EventType,
      title: 'Holiday Gathering',
      description: 'Seasonal celebrations that bring people together',
      icon: '🎄',
      color: 'from-green-500 to-emerald-600',
      features: ['Seasonal themes', 'Family traditions', 'Festive atmosphere']
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <p className="text-lg text-primary-600">
          Select the type of event you're planning to get personalized design recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventTypes.map((eventType, index) => (
          <motion.div
            key={eventType.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "p-6 cursor-pointer border-2 transition-all duration-300 hover:shadow-xl",
                value === eventType.type
                  ? "border-cultural-primary bg-gradient-to-br from-cultural-primary/5 to-cultural-secondary/5 shadow-lg"
                  : "border-primary-200 hover:border-cultural-primary/50"
              )}
              onClick={() => onChange(eventType.type)}
            >
              <div className="text-center">
                {/* Icon */}
                <div className={cn(
                  "w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br",
                  eventType.color
                )}>
                  {eventType.icon}
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold text-primary-900 mb-2">
                  {eventType.title}
                </h3>
                <p className="text-primary-600 mb-4 text-sm leading-relaxed">
                  {eventType.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {eventType.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center space-x-2 text-sm text-primary-500">
                      <CheckCircle className="w-4 h-4 text-cultural-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Selection Indicator */}
                {value === eventType.type && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 flex items-center justify-center space-x-2 text-cultural-primary"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Selected</span>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-cultural-primary/10 rounded-xl text-center"
        >
          <p className="text-cultural-primary font-medium">
            Perfect choice! Our AI will design with {eventTypes.find(t => t.type === value)?.title.toLowerCase()} traditions in mind.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

// Step 2: Cultural Preferences Selection
const CulturalPreferencesStep: React.FC<{
  value: CultureType[];
  onChange: (value: CultureType[]) => void;
}> = ({ value, onChange }) => {
  const { currentTheme } = useTheme();
  
  const cultures = [
    {
      type: 'japanese' as CultureType,
      name: 'Japanese',
      philosophy: 'Wabi-Sabi',
      description: 'Embrace imperfection and find beauty in simplicity',
      flag: '🇯🇵',
      colors: ['#2c3e50', '#8b7355', '#d4af37'],
      principles: ['Minimalism', 'Natural materials', 'Harmony with nature'],
      examples: 'Zen gardens, bamboo, paper lanterns, low seating'
    },
    {
      type: 'scandinavian' as CultureType,
      name: 'Scandinavian',
      philosophy: 'Hygge',
      description: 'Create cozy, comfortable, and content atmosphere',
      flag: '🇸🇪',
      colors: ['#4a5568', '#e2e8f0', '#f7fafc'],
      principles: ['Coziness', 'Light woods', 'Neutral colors'],
      examples: 'Candles, wool blankets, birch wood, simple forms'
    },
    {
      type: 'italian' as CultureType,
      name: 'Italian',
      philosophy: 'Bella Figura',
      description: 'Make a beautiful impression with elegant sophistication',
      flag: '🇮🇹',
      colors: ['#8b4513', '#deb887', '#ffd700'],
      principles: ['Luxury', 'Rich textures', 'Warm elegance'],
      examples: 'Marble, velvet, gold accents, ornate details'
    },
    {
      type: 'french' as CultureType,
      name: 'French',
      philosophy: 'Savoir-Vivre',
      description: 'Art of living well with refined taste and grace',
      flag: '🇫🇷',
      colors: ['#2d3748', '#e2e8f0', '#d69e2e'],
      principles: ['Refinement', 'Symmetry', 'Classic elegance'],
      examples: 'Chandeliers, antiques, silk fabrics, ornate mirrors'
    },
    {
      type: 'american' as CultureType,
      name: 'American',
      philosophy: 'Bold Innovation',
      description: 'Express individuality with confident, innovative design',
      flag: '🇺🇸',
      colors: ['#1a202c', '#4299e1', '#e53e3e'],
      principles: ['Innovation', 'Comfort', 'Self-expression'],
      examples: 'Statement pieces, mixed styles, bold colors, technology'
    }
  ];

  const toggleCulture = (cultureType: CultureType) => {
    if (value.includes(cultureType)) {
      onChange(value.filter(c => c !== cultureType));
    } else {
      onChange([...value, cultureType]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <p className="text-lg text-primary-600 mb-4">
          Choose cultural design philosophies that resonate with your vision
        </p>
        <p className="text-sm text-primary-500">
          You can select multiple cultures for a fusion approach
        </p>
      </div>

      <div className="space-y-6">
        {cultures.map((culture, index) => (
          <motion.div
            key={culture.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              className={cn(
                "p-6 cursor-pointer border-2 transition-all duration-300 hover:shadow-lg",
                value.includes(culture.type)
                  ? "border-cultural-primary bg-gradient-to-r from-cultural-primary/5 to-cultural-secondary/5"
                  : "border-primary-200 hover:border-cultural-primary/50"
              )}
              onClick={() => toggleCulture(culture.type)}
            >
              <div className="flex items-start space-x-6">
                {/* Flag and Selection */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-4xl">{culture.flag}</div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    value.includes(culture.type)
                      ? "bg-cultural-primary border-cultural-primary"
                      : "border-primary-300"
                  )}>
                    {value.includes(culture.type) && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-bold text-primary-900">
                      {culture.name}
                    </h3>
                    <span className="px-3 py-1 bg-primary-100 rounded-full text-sm font-medium text-primary-700">
                      {culture.philosophy}
                    </span>
                  </div>

                  <p className="text-primary-600 mb-4">
                    {culture.description}
                  </p>

                  {/* Color Palette */}
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-sm font-medium text-primary-700">Colors:</span>
                    <div className="flex space-x-2">
                      {culture.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-6 h-6 rounded-full border border-primary-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Principles */}
                  <div className="mb-4">
                    <span className="text-sm font-medium text-primary-700 mb-2 block">Key Principles:</span>
                    <div className="flex flex-wrap gap-2">
                      {culture.principles.map((principle, principleIndex) => (
                        <span
                          key={principleIndex}
                          className="px-2 py-1 bg-primary-50 rounded text-xs text-primary-600"
                        >
                          {principle}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Examples */}
                  <p className="text-sm text-primary-500 italic">
                    Examples: {culture.examples}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {value.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-r from-cultural-primary/10 to-cultural-secondary/10 rounded-xl"
        >
          <div className="text-center">
            <h4 className="font-medium text-cultural-primary mb-2">
              Selected Cultural Influences ({value.length})
            </h4>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {value.map((cultureType) => {
                const culture = cultures.find(c => c.type === cultureType);
                return (
                  <span
                    key={cultureType}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-cultural-primary/20 rounded-full text-sm text-cultural-primary"
                  >
                    <span>{culture?.flag}</span>
                    <span>{culture?.name}</span>
                  </span>
                );
              })}
            </div>
            <p className="text-sm text-primary-600">
              {value.length === 1 
                ? `Your design will authentically reflect ${cultures.find(c => c.type === value[0])?.name} traditions`
                : `Your design will blend ${value.length} cultural influences for a unique fusion approach`
              }
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Step 3: Budget Tier Selection
const BudgetTierStep: React.FC<{
  value?: BudgetTier;
  onChange: (value: BudgetTier) => void;
}> = ({ value, onChange }) => {
  const budgetTiers = [
    {
      tier: 'modest' as BudgetTier,
      title: 'Modest',
      subtitle: 'Beautiful on a budget',
      range: '$500 - $2,000',
      icon: '💰',
      color: 'from-green-400 to-emerald-500',
      features: [
        'DIY-friendly options',
        'Creative budget solutions',
        'Simple elegant designs',
        'Cost-effective materials'
      ],
      description: 'Stunning designs that maximize impact while respecting your budget constraints'
    },
    {
      tier: 'comfortable' as BudgetTier,
      title: 'Comfortable',
      subtitle: 'Quality and style balanced',
      range: '$2,000 - $8,000',
      icon: '💎',
      color: 'from-blue-400 to-blue-600',
      features: [
        'Professional services',
        'Quality materials',
        'Custom elements',
        'Enhanced details'
      ],
      description: 'Perfect balance of quality, style, and value for memorable celebrations'
    },
    {
      tier: 'luxurious' as BudgetTier,
      title: 'Luxurious',
      subtitle: 'Premium experience',
      range: '$8,000 - $25,000',
      icon: '👑',
      color: 'from-purple-400 to-purple-600',
      features: [
        'Premium materials',
        'Expert designers',
        'Luxury details',
        'Full-service planning'
      ],
      description: 'Sophisticated designs with premium materials and expert execution'
    },
    {
      tier: 'unlimited' as BudgetTier,
      title: 'Unlimited',
      subtitle: 'Sky\'s the limit',
      range: '$25,000+',
      icon: '✨',
      color: 'from-amber-400 to-yellow-500',
      features: [
        'Bespoke everything',
        'World-class designers',
        'Rare materials',
        'Concierge service'
      ],
      description: 'Extraordinary experiences with unlimited creativity and the finest materials'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <p className="text-lg text-primary-600 mb-4">
          Select your investment level to receive appropriate design recommendations
        </p>
        <p className="text-sm text-primary-500">
          Our AI will optimize designs within your chosen budget range
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetTiers.map((budget, index) => (
          <motion.div
            key={budget.tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "p-6 cursor-pointer border-2 transition-all duration-300 hover:shadow-xl relative overflow-hidden",
                value === budget.tier
                  ? "border-cultural-primary bg-gradient-to-br from-cultural-primary/5 to-cultural-secondary/5 shadow-lg"
                  : "border-primary-200 hover:border-cultural-primary/50"
              )}
              onClick={() => onChange(budget.tier)}
            >
              {/* Background Gradient */}
              <div className={cn(
                "absolute top-0 right-0 w-20 h-20 opacity-10 bg-gradient-to-br rounded-bl-full",
                budget.color
              )} />

              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br",
                      budget.color
                    )}>
                      {budget.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary-900">
                        {budget.title}
                      </h3>
                      <p className="text-sm text-primary-500">{budget.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    value === budget.tier
                      ? "bg-cultural-primary border-cultural-primary"
                      : "border-primary-300"
                  )}>
                    {value === budget.tier && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-cultural-primary">
                    {budget.range}
                  </span>
                </div>

                {/* Description */}
                <p className="text-primary-600 mb-4 text-sm leading-relaxed">
                  {budget.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  {budget.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 text-sm text-primary-700">
                      <CheckCircle className="w-4 h-4 text-cultural-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Selection Confirmation */}
                {value === budget.tier && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-3 bg-cultural-primary/10 rounded-lg text-center"
                  >
                    <span className="text-sm font-medium text-cultural-primary">
                      Perfect! We'll create designs within your {budget.title.toLowerCase()} budget
                    </span>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-r from-cultural-primary/10 to-cultural-secondary/10 rounded-xl text-center"
        >
          <h4 className="font-medium text-cultural-primary mb-2">
            Budget Selection Confirmed
          </h4>
          <p className="text-sm text-primary-600">
            Our AI will prioritize designs and recommendations that fit within your{' '}
            <span className="font-medium text-cultural-primary">
              {budgetTiers.find(b => b.tier === value)?.range}
            </span>{' '}
            investment range.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

// Step 4: Guest Details
const GuestDetailsStep: React.FC<{
  guestCount?: number;
  ageRange?: string;
  specialNeeds: string[];
  onChange: (updates: Partial<FormData>) => void;
}> = ({ guestCount, ageRange, specialNeeds, onChange }) => {
  const ageRanges = [
    'Children (0-12)',
    'Teenagers (13-17)', 
    'Young Adults (18-30)',
    'Adults (30-60)',
    'Seniors (60+)',
    'Mixed Ages'
  ];

  const specialNeedsOptions = [
    'Wheelchair accessibility',
    'Dietary restrictions',
    'Quiet/sensory-friendly environment',
    'Child-friendly setup',
    'Elderly-friendly seating',
    'Religious considerations',
    'Language interpretation',
    'Photography restrictions'
  ];

  const toggleSpecialNeed = (need: string) => {
    const updated = specialNeeds.includes(need)
      ? specialNeeds.filter(n => n !== need)
      : [...specialNeeds, need];
    onChange({ specialNeeds: updated });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Guest Count */}
      <div>
        <label className="block text-lg font-medium text-primary-900 mb-4">
          How many guests will attend?
        </label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[10, 25, 50, 75, 100, 150, 200, 300, 500].map((count) => (
            <Button
              key={count}
              variant={guestCount === count ? "cultural" : "ghost"}
              size="sm"
              onClick={() => onChange({ guestCount: count })}
              className="border-2 border-primary-200 hover:border-cultural-primary"
            >
              {count}+
            </Button>
          ))}
        </div>
        <div className="mt-4">
          <input
            type="number"
            placeholder="Custom number"
            value={guestCount || ''}
            onChange={(e) => onChange({ guestCount: parseInt(e.target.value) || 0 })}
            className="w-full p-3 border border-primary-300 rounded-lg focus:border-cultural-primary focus:ring-2 focus:ring-cultural-primary/20"
          />
        </div>
      </div>

      {/* Age Range */}
      <div>
        <label className="block text-lg font-medium text-primary-900 mb-4">
          What age group best describes your guests?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ageRanges.map((range) => (
            <Button
              key={range}
              variant={ageRange === range ? "cultural" : "ghost"}
              size="md"
              onClick={() => onChange({ ageRange: range })}
              className="border-2 border-primary-200 hover:border-cultural-primary justify-start"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Special Needs */}
      <div>
        <label className="block text-lg font-medium text-primary-900 mb-4">
          Any special considerations? (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {specialNeedsOptions.map((need) => (
            <div
              key={need}
              onClick={() => toggleSpecialNeed(need)}
              className={cn(
                "p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-left",
                specialNeeds.includes(need)
                  ? "border-cultural-primary bg-cultural-primary/5"
                  : "border-primary-200 hover:border-cultural-primary/50"
              )}
            >
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center",
                  specialNeeds.includes(need)
                    ? "bg-cultural-primary border-cultural-primary"
                    : "border-primary-400"
                )}>
                  {specialNeeds.includes(need) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm text-primary-700">{need}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Step 5: Style Preferences
const StylePreferencesStep: React.FC<{
  value?: FormData['stylePreferences'];
  onChange: (value: FormData['stylePreferences']) => void;
}> = ({ value, onChange }) => {
  const colorOptions = [
    { name: 'Warm neutrals', colors: ['#F5E6D3', '#E4C59E', '#AF8F6F'], category: 'neutral' },
    { name: 'Cool blues', colors: ['#4A90E2', '#7BB3F0', '#A8DADC'], category: 'cool' },
    { name: 'Earth tones', colors: ['#8B4513', '#D2691E', '#F4A460'], category: 'warm' },
    { name: 'Elegant golds', colors: ['#FFD700', '#DAA520', '#B8860B'], category: 'luxury' },
    { name: 'Soft pastels', colors: ['#F8BBD0', '#E1BEE7', '#C5CAE9'], category: 'soft' },
    { name: 'Bold jewel tones', colors: ['#4A148C', '#1A237E', '#0D47A1'], category: 'bold' }
  ];

  const materialOptions = [
    'Natural wood', 'Elegant fabric', 'Fresh flowers', 'Metallic accents',
    'Glass elements', 'Stone/marble', 'Bamboo', 'Velvet', 'Linen', 'Ceramic'
  ];

  const styleOptions = [
    'Modern minimalist', 'Classic elegant', 'Rustic charm', 'Bohemian chic',
    'Industrial modern', 'Vintage romantic', 'Contemporary sleek', 'Traditional formal'
  ];

  const updatePreferences = (category: keyof FormData['stylePreferences'], item: string, isChecked: boolean) => {
    const currentValue = value || {
      colors: [],
      materials: [],
      styles: [],
      mustHave: [],
      mustAvoid: []
    };

    const currentItems = currentValue[category] || [];
    const updatedItems = isChecked
      ? [...currentItems, item]
      : currentItems.filter(i => i !== item);

    onChange({
      ...currentValue,
      [category]: updatedItems
    });
  };

  const isSelected = (category: keyof FormData['stylePreferences'], item: string) => {
    return value?.[category]?.includes(item) || false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Color Preferences */}
      <div>
        <label className="block text-lg font-medium text-primary-900 mb-4">
          Choose color palettes that appeal to you
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colorOptions.map((colorOption) => (
            <div
              key={colorOption.name}
              onClick={() => updatePreferences('colors', colorOption.name, !isSelected('colors', colorOption.name))}
              className={cn(
                "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                isSelected('colors', colorOption.name)
                  ? "border-cultural-primary bg-cultural-primary/5"
                  : "border-primary-200 hover:border-cultural-primary/50"
              )}
            >
              <div className="flex items-center space-x-4">
                <div className="flex space-x-1">
                  {colorOption.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border border-primary-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-primary-900">{colorOption.name}</h4>
                  <p className="text-sm text-primary-600 capitalize">{colorOption.category}</p>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center",
                  isSelected('colors', colorOption.name)
                    ? "bg-cultural-primary border-cultural-primary"
                    : "border-primary-400"
                )}>
                  {isSelected('colors', colorOption.name) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Material Preferences */}
      <div>
        <label className="block text-lg font-medium text-primary-900 mb-4">
          Select materials you love
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {materialOptions.map((material) => (
            <div
              key={material}
              onClick={() => updatePreferences('materials', material, !isSelected('materials', material))}
              className={cn(
                "p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center",
                isSelected('materials', material)
                  ? "border-cultural-primary bg-cultural-primary/5"
                  : "border-primary-200 hover:border-cultural-primary/50"
              )}
            >
              <span className="text-sm font-medium text-primary-700">{material}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Style Preferences */}
      <div>
        <label className="block text-lg font-medium text-primary-900 mb-4">
          Choose design styles that resonate with you
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {styleOptions.map((style) => (
            <div
              key={style}
              onClick={() => updatePreferences('styles', style, !isSelected('styles', style))}
              className={cn(
                "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                isSelected('styles', style)
                  ? "border-cultural-primary bg-cultural-primary/5"
                  : "border-primary-200 hover:border-cultural-primary/50"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-primary-900">{style}</span>
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center",
                  isSelected('styles', style)
                    ? "bg-cultural-primary border-cultural-primary"
                    : "border-primary-400"
                )}>
                  {isSelected('styles', style) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Must Have / Must Avoid */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="block text-lg font-medium text-primary-900 mb-4">
            Must-have elements (Optional)
          </label>
          <textarea
            placeholder="e.g., Live music, photo booth, outdoor seating..."
            value={value?.mustHave?.join(', ') || ''}
            onChange={(e) => {
              const items = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
              updatePreferences('mustHave', '', false);
              onChange({
                ...value,
                mustHave: items
              } as FormData['stylePreferences']);
            }}
            className="w-full p-3 border border-primary-300 rounded-lg focus:border-cultural-primary focus:ring-2 focus:ring-cultural-primary/20 h-24 resize-none"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-primary-900 mb-4">
            Elements to avoid (Optional)
          </label>
          <textarea
            placeholder="e.g., Loud music, bright lights, crowded spaces..."
            value={value?.mustAvoid?.join(', ') || ''}
            onChange={(e) => {
              const items = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
              updatePreferences('mustAvoid', '', false);
              onChange({
                ...value,
                mustAvoid: items
              } as FormData['stylePreferences']);
            }}
            className="w-full p-3 border border-primary-300 rounded-lg focus:border-cultural-primary focus:ring-2 focus:ring-cultural-primary/20 h-24 resize-none"
          />
        </div>
      </div>

      {/* Summary */}
      {(value?.colors?.length || value?.materials?.length || value?.styles?.length) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-r from-cultural-primary/10 to-cultural-secondary/10 rounded-xl"
        >
          <h4 className="font-medium text-cultural-primary mb-3">
            Your Style Profile Summary
          </h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {value?.colors?.length && (
              <div>
                <span className="font-medium text-primary-700">Colors: </span>
                <span className="text-primary-600">{value.colors.length} selected</span>
              </div>
            )}
            {value?.materials?.length && (
              <div>
                <span className="font-medium text-primary-700">Materials: </span>
                <span className="text-primary-600">{value.materials.length} selected</span>
              </div>
            )}
            {value?.styles?.length && (
              <div>
                <span className="font-medium text-primary-700">Styles: </span>
                <span className="text-primary-600">{value.styles.length} selected</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Space Upload Step Component
interface SpaceUploadStepProps {
  value: any;
  onChange: (value: any) => void;
}

const SpaceUploadStep: React.FC<SpaceUploadStepProps> = ({ value, onChange }) => {
  const [uploadMode, setUploadMode] = useState<'photo' | 'manual'>('photo');
  const [manualData, setManualData] = useState({
    length: value?.manualEntry?.length || '',
    width: value?.manualEntry?.width || '',
    height: value?.manualEntry?.height || '',
    roomType: value?.manualEntry?.roomType || '',
    features: value?.manualEntry?.features || [],
    limitations: value?.manualEntry?.limitations || []
  });

  const handleAnalysisComplete = useCallback((analysis: any) => {
    onChange({
      ...value,
      hasPhotos: true,
      aiAnalysis: analysis
    });
  }, [value, onChange]);

  const handleDimensionsExtracted = useCallback((dimensions: any) => {
    setManualData(prev => ({
      ...prev,
      length: dimensions.length,
      width: dimensions.width,
      height: dimensions.height
    }));
  }, []);

  const handleManualSubmit = useCallback(() => {
    onChange({
      ...value,
      hasPhotos: false,
      manualEntry: {
        length: parseFloat(manualData.length) || 0,
        width: parseFloat(manualData.width) || 0,
        height: parseFloat(manualData.height) || 0,
        roomType: manualData.roomType,
        features: manualData.features,
        limitations: manualData.limitations
      }
    });
  }, [value, onChange, manualData]);

  useEffect(() => {
    if (uploadMode === 'manual') {
      handleManualSubmit();
    }
  }, [manualData, uploadMode, handleManualSubmit]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Tell us about your space
        </h3>
        <p className="text-gray-600">
          Upload photos for AI analysis or enter dimensions manually
        </p>
      </div>

      {/* Upload Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setUploadMode('photo')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === 'photo'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Camera className="w-4 h-4 mr-2 inline" />
            Upload Photos
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('manual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              uploadMode === 'manual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home className="w-4 h-4 mr-2 inline" />
            Manual Entry
          </button>
        </div>
      </div>

      {/* Photo Upload Mode */}
      {uploadMode === 'photo' && (
        <SpaceImageUpload
          onAnalysisComplete={handleAnalysisComplete}
          onDimensionsExtracted={handleDimensionsExtracted}
        />
      )}

      {/* Manual Entry Mode */}
      {uploadMode === 'manual' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length (feet)
              </label>
              <input
                type="number"
                value={manualData.length}
                onChange={(e) => setManualData(prev => ({ ...prev, length: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width (feet)
              </label>
              <input
                type="number"
                value={manualData.width}
                onChange={(e) => setManualData(prev => ({ ...prev, width: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (feet)
              </label>
              <input
                type="number"
                value={manualData.height}
                onChange={(e) => setManualData(prev => ({ ...prev, height: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Type
            </label>
            <select
              value={manualData.roomType}
              onChange={(e) => setManualData(prev => ({ ...prev, roomType: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select room type</option>
              <option value="ballroom">Ballroom</option>
              <option value="conference-room">Conference Room</option>
              <option value="banquet-hall">Banquet Hall</option>
              <option value="outdoor-pavilion">Outdoor Pavilion</option>
              <option value="hotel-suite">Hotel Suite</option>
              <option value="restaurant">Restaurant</option>
              <option value="community-center">Community Center</option>
              <option value="home-living-room">Home Living Room</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (comma-separated)
            </label>
            <input
              type="text"
              value={manualData.features.join(', ')}
              onChange={(e) => setManualData(prev => ({ 
                ...prev, 
                features: e.target.value.split(',').map(f => f.trim()).filter(Boolean) 
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Large windows, hardwood floors, high ceilings"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limitations (comma-separated)
            </label>
            <input
              type="text"
              value={manualData.limitations.join(', ')}
              onChange={(e) => setManualData(prev => ({ 
                ...prev, 
                limitations: e.target.value.split(',').map(l => l.trim()).filter(Boolean) 
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="No nails in walls, limited electrical outlets"
            />
          </div>
        </div>
      )}

      {/* Summary */}
      {((value?.hasPhotos && value?.aiAnalysis) || (value?.manualEntry?.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-green-50 border border-green-200 rounded-xl"
        >
          <h4 className="font-medium text-green-800 mb-3">
            Space Information Captured
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {value?.hasPhotos && value?.aiAnalysis && (
              <div>
                <span className="font-medium text-green-700">AI Analysis: </span>
                <span className="text-green-600">
                  {Math.round(value.aiAnalysis.dimensions?.estimatedLength || 0)}' × {Math.round(value.aiAnalysis.dimensions?.estimatedWidth || 0)}' × {Math.round(value.aiAnalysis.dimensions?.estimatedHeight || 0)}'
                </span>
              </div>
            )}
            {value?.manualEntry?.length > 0 && (
              <div>
                <span className="font-medium text-green-700">Manual Entry: </span>
                <span className="text-green-600">
                  {value.manualEntry.length}' × {value.manualEntry.width}' × {value.manualEntry.height}' {value.manualEntry.roomType}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EventRequirementsForm;
export { EventRequirementsForm };