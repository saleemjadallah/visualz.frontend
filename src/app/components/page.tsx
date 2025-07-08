'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Palette, 
  Users, 
  DollarSign, 
  Globe, 
  Sparkles,
  Eye,
  Download,
  Share2,
  Heart,
  Settings,
  ChevronRight,
  Plus,
  Search,
  Filter
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CulturalBadge } from '@/components/ui/CulturalBadge';
import { Input, SearchInput, Textarea, FileUpload, Select } from '@/components/ui/Input';
import { Container } from '@/components/layout/Container';
import { Grid, Flex, Stack, HStack } from '@/components/layout/Grid';
import { Icon, CulturalIcon, IconButton, IconBadge } from '@/components/ui/Icon';
import { useTheme, ThemeSelector, ThemeDisplay } from '@/components/cultural/ThemeProvider';
import { AppLayout } from '@/components/layout/AppLayout';

export default function ComponentsShowcase() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentTheme, isTransitioning } = useTheme();

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <AppLayout currentTab="gallery" showSearch={true}>
      <Container maxWidth="2xl" padding="lg">
        <div className="py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary-900 mb-4">
              DesignVisualz Component Library
            </h1>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto mb-6">
              Comprehensive UI components with cultural intelligence and premium design
            </p>
            
            {/* Theme Selector */}
            <div className="flex justify-center mb-8">
              <ThemeSelector variant="pills" showLabels={true} />
            </div>
          </div>

          <Stack spacing="xl">
            {/* Current Theme Display */}
            <ThemeDisplay className="mb-6" />

            {/* Dynamic Theme Showcase */}
            <Card className="p-8 bg-gradient-to-br from-cultural-primary/10 to-cultural-secondary/5 border-cultural-primary/20" cultural>
              <h2 className="text-2xl font-semibold text-primary-900 mb-6">
                Live Cultural Theme: {currentTheme.name}
              </h2>
              
              <Grid cols={1} gap="lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ThemeSelector variant="grid" className="md:col-span-2" />
                  <Card className="p-4">
                    <h3 className="font-semibold text-cultural-primary mb-2">Current Principles</h3>
                    <Stack spacing="sm">
                      {currentTheme.principles.slice(0, 3).map((principle, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-cultural-primary">{principle.name}:</span>
                          <span className="text-primary-600 ml-2 block">{principle.description}</span>
                        </div>
                      ))}
                    </Stack>
                  </Card>
                </div>
              </Grid>
            </Card>

            {/* Buttons Section */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-primary-900 mb-6">Button Components</h2>
              
              <Stack spacing="lg">
                {/* Basic Variants */}
                <div>
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Variants</h3>
                  <HStack spacing="md">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="cultural">Cultural</Button>
                    <Button variant="ghost">Ghost</Button>
                  </HStack>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Sizes</h3>
                  <HStack spacing="md" align="center">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </HStack>
                </div>

                {/* States */}
                <div>
                  <h3 className="text-lg font-medium text-primary-800 mb-4">States</h3>
                  <HStack spacing="md">
                    <Button loading={loading} onClick={handleButtonClick}>
                      {loading ? 'Loading...' : 'Click Me'}
                    </Button>
                    <Button disabled>Disabled</Button>
                    <Button icon={<Camera />}>With Icon</Button>
                    <Button variant="cultural" icon={<Sparkles />}>
                      Cultural Magic
                    </Button>
                  </HStack>
                </div>
              </Stack>
            </Card>

            {/* Cultural Elements */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-primary-900 mb-6">Cultural Components</h2>
              
              <Stack spacing="lg">
                {/* Cultural Badges */}
                <div>
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Cultural Badges</h3>
                  <HStack spacing="md">
                    <CulturalBadge culture={'japanese' as const} />
                    <CulturalBadge culture={'scandinavian' as const} />
                    <CulturalBadge culture={'italian' as const} />
                    <CulturalBadge culture={'french' as const} />
                    <CulturalBadge culture={'american' as const} />
                  </HStack>
                </div>

                {/* Cultural Icons */}
                <div>
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Cultural Icons</h3>
                  <HStack spacing="lg">
                    <Stack spacing="sm" align="center">
                      <CulturalIcon culture="japanese" type="flag" size="lg" />
                      <span className="text-sm text-primary-600">Japanese</span>
                    </Stack>
                    <Stack spacing="sm" align="center">
                      <CulturalIcon culture="scandinavian" type="symbol" size="lg" />
                      <span className="text-sm text-primary-600">Scandinavian</span>
                    </Stack>
                    <Stack spacing="sm" align="center">
                      <CulturalIcon culture="italian" type="pattern" size="lg" />
                      <span className="text-sm text-primary-600">Italian</span>
                    </Stack>
                    <Stack spacing="sm" align="center">
                      <CulturalIcon culture="french" type="material" size="lg" />
                      <span className="text-sm text-primary-600">French</span>
                    </Stack>
                  </HStack>
                </div>

                {/* Icon Badges */}
                <div>
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Icon Badges</h3>
                  <HStack spacing="md">
                    <IconBadge icon={<Globe />} variant="cultural">Cultural Design</IconBadge>
                    <IconBadge icon={<Heart />} variant="error">Favorites</IconBadge>
                    <IconBadge icon={<Users />} variant="primary">Team Project</IconBadge>
                    <IconBadge icon={<Sparkles />} variant="success">Premium</IconBadge>
                  </HStack>
                </div>
              </Stack>
            </Card>

            {/* Form Components */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-primary-900 mb-6">Form Components</h2>
              
              <Grid cols={2} gap="lg">
                {/* Text Inputs */}
                <Stack spacing="md">
                  <Input 
                    label="Name" 
                    placeholder="Enter your name" 
                    cultural
                  />
                  <Input 
                    label="Email" 
                    type="email" 
                    placeholder="your@email.com" 
                    icon={<Search />}
                  />
                  <Input 
                    label="Password" 
                    type="password" 
                    placeholder="Enter password"
                    helperText="Must be at least 8 characters"
                  />
                  <SearchInput 
                    placeholder="Search designs..."
                    onSearch={(value) => console.log('Searching:', value)}
                  />
                </Stack>

                {/* Select and Textarea */}
                <Stack spacing="md">
                  <Select
                    label="Cultural Theme"
                    placeholder="Select a culture"
                    options={[
                      { value: 'japanese', label: 'Japanese (Wabi-Sabi)' },
                      { value: 'scandinavian', label: 'Scandinavian (Hygge)' },
                      { value: 'italian', label: 'Italian (Bella Figura)' },
                      { value: 'french', label: 'French (Savoir-Vivre)' }
                    ]}
                    cultural
                  />
                  <Textarea 
                    label="Event Description"
                    placeholder="Describe your event vision..."
                    rows={4}
                    cultural
                  />
                  <Input 
                    error="This field is required"
                    placeholder="Field with error"
                  />
                  <Input 
                    success
                    placeholder="Valid input"
                    helperText="Looks good!"
                  />
                </Stack>
              </Grid>
            </Card>

            {/* File Upload */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-primary-900 mb-6">File Upload</h2>
              
              <FileUpload
                onFileSelect={(files) => {
                  setSelectedFiles(files);
                  console.log('Files selected:', files);
                }}
                accept="image/*"
                multiple
                cultural
              />
              
              {selectedFiles && (
                <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-700">
                    Selected {selectedFiles.length} file(s):
                  </p>
                  <ul className="mt-2 space-y-1">
                    {Array.from(selectedFiles).map((file, index) => (
                      <li key={index} className="text-sm text-primary-600">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {/* Layout Components */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-primary-900 mb-6">Layout Components</h2>
              
              <Stack spacing="lg">
                {/* Grid Layout */}
                <div>
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Grid Layout</h3>
                  <Grid cols={3} gap="md">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <Card key={item} className="p-4 text-center">
                        <div className="text-2xl font-bold text-cultural-primary mb-2">{item}</div>
                        <p className="text-sm text-primary-600">Grid Item</p>
                      </Card>
                    ))}
                  </Grid>
                </div>

                {/* Flex Layout */}
                <div>
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Flex Layout</h3>
                  <Flex justify="between" align="center" className="p-4 bg-primary-50 rounded-lg">
                    <div className="text-primary-800 font-medium">Flex Start</div>
                    <div className="text-primary-600">Flex Center</div>
                    <div className="text-primary-400">Flex End</div>
                  </Flex>
                </div>

                {/* Stack Layout */}
                <div>
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Stack Layout</h3>
                  <Card className="p-4">
                    <Stack spacing="md">
                      <div className="text-primary-800">First Item</div>
                      <div className="text-primary-600">Second Item</div>
                      <div className="text-primary-400">Third Item</div>
                    </Stack>
                  </Card>
                </div>
              </Stack>
            </Card>

            {/* Interactive Elements */}
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-primary-900 mb-6">Interactive Elements</h2>
              
              <Stack spacing="lg">
                {/* Icon Buttons */}
                <div>
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Icon Buttons</h3>
                  <HStack spacing="md">
                    <IconButton icon={<Heart />} aria-label="Like" variant="ghost" />
                    <IconButton icon={<Share2 />} aria-label="Share" variant="outline" />
                    <IconButton icon={<Download />} aria-label="Download" variant="solid" />
                    <IconButton icon={<Settings />} aria-label="Settings" variant="cultural" />
                  </HStack>
                </div>

                {/* Icons with different sizes */}
                <div>
                  <h3 className="text-lg font-medium text-primary-800 mb-4">Icon Sizes</h3>
                  <HStack spacing="md" align="center">
                    <Icon size="sm" color="primary"><Sparkles /></Icon>
                    <Icon size="md" color="cultural"><Palette /></Icon>
                    <Icon size="lg" color="success"><Globe /></Icon>
                    <Icon size="xl" color="warning"><Camera /></Icon>
                  </HStack>
                </div>
              </Stack>
            </Card>

            {/* Advanced Cultural Theme Demo */}
            <Card className="p-8 bg-gradient-to-br from-cultural-primary/5 to-cultural-accent/5" cultural>
              <h2 className="text-2xl font-semibold text-primary-900 mb-6">
                Advanced Cultural Intelligence
                {isTransitioning && <span className="ml-2 text-sm text-cultural-primary">(Transitioning...)</span>}
              </h2>
              
              <Grid cols={2} gap="lg">
                <Stack spacing="md">
                  <p className="text-primary-700">
                    Experience real-time cultural theme switching with smooth transitions. 
                    Each theme brings authentic design principles and color palettes from different cultures.
                  </p>
                  <div>
                    <h4 className="font-semibold text-cultural-primary mb-2">Try Different Variants:</h4>
                    <Stack spacing="sm">
                      <ThemeSelector variant="dropdown" className="w-full" />
                      <ThemeSelector variant="pills" showLabels={false} />
                    </Stack>
                  </div>
                </Stack>
                
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-primary-800 mb-3">Features</h3>
                  <Stack spacing="sm">
                    <IconBadge icon={<Palette />} variant="cultural">Dynamic CSS Variables</IconBadge>
                    <IconBadge icon={<Globe />} variant="primary">Cultural Authenticity</IconBadge>
                    <IconBadge icon={<Sparkles />} variant="success">Smooth Transitions</IconBadge>
                    <IconBadge icon={<Heart />} variant="secondary">LocalStorage Persistence</IconBadge>
                  </Stack>
                </Card>
              </Grid>
            </Card>
          </Stack>
        </div>
      </Container>
    </AppLayout>
  );
}