'use client';

import React from 'react';
import { Heart, AlertTriangle, CheckCircle, XCircle, BookOpen, Users } from 'lucide-react';

const CulturalSensitivityGuide = () => {
  const guidelines = [
    {
      title: "Research and Understanding",
      icon: BookOpen,
      description: "Always research the cultural context and historical significance before incorporating cultural elements.",
      examples: [
        "Study the origin and meaning of design principles",
        "Understand the cultural significance of colors and symbols",
        "Learn about appropriate usage contexts"
      ]
    },
    {
      title: "Respectful Integration",
      icon: Heart,
      description: "Integrate cultural elements with respect and appreciation, not appropriation.",
      examples: [
        "Use cultural principles to inspire, not copy exactly",
        "Acknowledge the cultural source of inspiration",
        "Avoid sacred or ceremonial elements"
      ]
    },
    {
      title: "Community Consultation",
      icon: Users,
      description: "When possible, consult with cultural communities and experts.",
      examples: [
        "Seek feedback from cultural community members",
        "Consult with cultural experts and historians",
        "Listen to concerns and adapt accordingly"
      ]
    }
  ];

  const dosDonts = [
    {
      category: "Japanese Culture",
      dos: [
        "Use natural materials like wood, bamboo, and stone",
        "Incorporate principles of simplicity and minimalism",
        "Create peaceful, contemplative spaces",
        "Embrace imperfection and natural aging"
      ],
      donts: [
        "Use sacred symbols as mere decoration",
        "Appropriate religious or ceremonial elements",
        "Misrepresent cultural meanings or contexts",
        "Combine inappropriately with conflicting styles"
      ]
    },
    {
      category: "Scandinavian Culture",
      dos: [
        "Use sustainable and natural materials",
        "Create functional, comfortable spaces",
        "Incorporate cozy, warm elements",
        "Emphasize practicality and quality"
      ],
      donts: [
        "Stereotype Nordic culture as just minimalism",
        "Ignore sustainability principles",
        "Use cultural symbols without understanding",
        "Appropriate indigenous Sami elements"
      ]
    },
    {
      category: "Italian Culture",
      dos: [
        "Use quality materials and craftsmanship",
        "Create spaces for community and gathering",
        "Appreciate artistry and attention to detail",
        "Balance elegance with warmth"
      ],
      donts: [
        "Stereotype Italian culture with clichés",
        "Use regional symbols inappropriately",
        "Ignore the importance of family and community",
        "Appropriate religious or sacred elements"
      ]
    },
    {
      category: "French Culture",
      dos: [
        "Appreciate artistic traditions and craftsmanship",
        "Use quality materials with sophistication",
        "Create elegant, hospitable environments",
        "Balance formality with warmth"
      ],
      donts: [
        "Stereotype French culture with clichés",
        "Use cultural symbols inappropriately",
        "Ignore the importance of artistic expression",
        "Appropriate regional or historical elements"
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
          Cultural Sensitivity Guidelines
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn how to respectfully appreciate and integrate cultural design principles 
          while avoiding appropriation and maintaining authenticity.
        </p>
      </div>

      {/* Core Guidelines */}
      <div className="grid md:grid-cols-3 gap-6">
        {guidelines.map((guideline, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <guideline.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{guideline.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{guideline.description}</p>
            <ul className="space-y-2">
              {guideline.examples.map((example, exampleIndex) => (
                <li key={exampleIndex} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{example}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Cultural Dos and Don'ts */}
      <div className="space-y-6">
        <h3 className="text-2xl font-display font-bold text-gray-900 text-center">
          Cultural Guidelines by Tradition
        </h3>
        
        {dosDonts.map((culture, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              {culture.category}
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Dos */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h5 className="font-semibold text-green-900">Appropriate Practices</h5>
                </div>
                <ul className="space-y-2">
                  {culture.dos.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Don'ts */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <h5 className="font-semibold text-red-900">Practices to Avoid</h5>
                </div>
                <ul className="space-y-2">
                  {culture.donts.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 mb-2">Important Reminder</h4>
            <p className="text-amber-800 text-sm leading-relaxed">
              Cultural design principles are living traditions that belong to specific communities. 
              Our goal is to inspire respectful appreciation and learning, not appropriation. 
              When in doubt, research thoroughly, ask questions, and always err on the side of respect. 
              Consider consulting with cultural experts or community members when working with 
              cultural elements in professional contexts.
            </p>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h4 className="font-semibold text-blue-900 mb-4">Additional Resources</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-blue-800 mb-2">Cultural Education</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Cultural museums and institutions</li>
              <li>• Academic cultural studies programs</li>
              <li>• Community cultural centers</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-800 mb-2">Professional Consultation</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Cultural anthropologists</li>
              <li>• Design historians</li>
              <li>• Community cultural leaders</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalSensitivityGuide;