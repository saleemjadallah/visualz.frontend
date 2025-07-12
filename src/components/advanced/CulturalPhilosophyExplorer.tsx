'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter,
  Palette,
  Package,
  Users,
  DollarSign,
  Star,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Info,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Calendar
} from 'lucide-react';
import { culturalPhilosophyApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface CulturalPhilosophyExplorerProps {
  onPhilosophySelected?: (philosophy: any) => void;
  eventType?: string;
}

const CulturalPhilosophyExplorer: React.FC<CulturalPhilosophyExplorerProps> = ({
  onPhilosophySelected,
  eventType = 'celebration'
}) => {
  const [philosophies, setPhilosophies] = useState<any[]>([]);
  const [selectedPhilosophy, setSelectedPhilosophy] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'colors' | 'materials' | 'vendors' | 'budget'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    culture: '',
    complexity: '',
    event_type: eventType
  });
  const [detailData, setDetailData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPhilosophies();
  }, []);

  useEffect(() => {
    if (selectedPhilosophy) {
      loadPhilosophyDetails(selectedPhilosophy.id);
    }
  }, [selectedPhilosophy, activeTab]);

  const loadPhilosophies = async () => {
    setIsLoading(true);
    try {
      let philosophiesData;
      
      if (searchQuery || Object.values(filters).some(f => f)) {
        // Use search API with filters
        const response = await culturalPhilosophyApi.searchPhilosophies(searchQuery, filters);
        philosophiesData = response.results;
      } else {
        // Load all philosophies
        const response = await culturalPhilosophyApi.getAllPhilosophies();
        philosophiesData = response.philosophies;
      }
      
      setPhilosophies(philosophiesData);
      
      // Auto-select first philosophy if none selected
      if (philosophiesData.length > 0 && !selectedPhilosophy) {
        setSelectedPhilosophy(philosophiesData[0]);
      }
    } catch (error) {
      console.error('Failed to load philosophies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPhilosophyDetails = async (philosophyId: string) => {
    try {
      const promises = [];
      
      if (activeTab === 'overview') {
        promises.push(culturalPhilosophyApi.getPhilosophy(philosophyId));
      } else if (activeTab === 'colors') {
        promises.push(culturalPhilosophyApi.getPhilosophyColors(philosophyId));
      } else if (activeTab === 'materials') {
        promises.push(culturalPhilosophyApi.getPhilosophyMaterials(philosophyId));
      } else if (activeTab === 'vendors') {
        promises.push(culturalPhilosophyApi.getPhilosophyVendors(philosophyId));
      } else if (activeTab === 'budget') {
        promises.push(culturalPhilosophyApi.getBudgetGuidance(philosophyId, {
          eventType,
          totalBudget: 3000,
          guestCount: 25,
          priorities: ['authenticity', 'quality']
        }));
      }
      
      const results = await Promise.all(promises);
      setDetailData({ ...detailData, [activeTab]: results[0] });
    } catch (error) {
      console.error(`Failed to load ${activeTab} data:`, error);
    }
  };

  const handleSearch = () => {
    loadPhilosophies();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'budget', label: 'Budget', icon: DollarSign }
  ];

  const renderOverview = () => {
    const data = detailData.overview?.philosophy;
    if (!data) return <div>Loading...</div>;

    return (
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Foundation</h3>
          <p className="text-blue-800 text-sm">{data.foundation}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Core Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.core_principles?.map((principle: string, index: number) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">{principle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Design Principles</h3>
          <div className="space-y-2">
            {data.design_principles?.map((principle: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                <span className="text-sm text-gray-700">{principle}</span>
              </div>
            ))}
          </div>
        </div>

        {data.cultural_sensitivity && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-3">Cultural Sensitivity Guidelines</h3>
            
            {data.cultural_sensitivity.sacred_elements?.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Sacred Elements:</h4>
                <div className="flex flex-wrap gap-1">
                  {data.cultural_sensitivity.sacred_elements.map((element: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      {element}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {data.cultural_sensitivity.consultation_required && (
              <div className="flex items-center space-x-2 text-sm text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                <span>Cultural expert consultation recommended</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderColors = () => {
    const data = detailData.colors?.color_palette;
    if (!data) return <div>Loading color palette...</div>;

    return (
      <div className="space-y-6">
        {['primary', 'secondary', 'accent'].map((category) => (
          <div key={category}>
            <h3 className="font-semibold text-gray-900 mb-3 capitalize">{category} Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data[category]?.map((color: any, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div 
                    className="w-full h-16 rounded mb-2 border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-sm">
                    <div className="font-medium">{color.name}</div>
                    <div className="text-gray-600 text-xs mt-1">{color.hex}</div>
                    {color.cultural_meaning && (
                      <div className="text-gray-500 text-xs mt-2">{color.cultural_meaning}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {data.avoid?.length > 0 && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">Colors to Avoid</h3>
            <div className="flex flex-wrap gap-2">
              {data.avoid.map((color: any, index: number) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-red-800">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name} - {color.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMaterials = () => {
    const data = detailData.materials?.materials;
    if (!data) return <div>Loading materials...</div>;

    return (
      <div className="space-y-4">
        {data.map((material: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{material.name}</h3>
                <p className="text-sm text-gray-600">{material.category}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  {(material.authenticity_score * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {material.quality_indicators?.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Quality Indicators:</h4>
                <div className="flex flex-wrap gap-1">
                  {material.quality_indicators.map((indicator: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {indicator}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {material.suppliers?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Suppliers:</h4>
                <div className="space-y-2">
                  {material.suppliers.slice(0, 2).map((supplier: any, idx: number) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{supplier.name}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{supplier.authenticity_rating}/5</span>
                        </div>
                      </div>
                      <div className="text-gray-600 mt-1">{supplier.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {material.seasonal_availability && (
              <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Best availability: {material.seasonal_availability}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderVendors = () => {
    const data = detailData.vendors?.vendors;
    if (!data) return <div>Loading vendors...</div>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((vendor: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.specialty}</p>
              </div>
              <div className="flex items-center space-x-1">
                {vendor.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{vendor.authenticity_rating}/5</span>
                </div>
              </div>
            </div>

            {vendor.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{vendor.location.city}, {vendor.location.country}</span>
              </div>
            )}

            {vendor.contact && (
              <div className="space-y-1">
                {vendor.contact.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{vendor.contact.phone}</span>
                  </div>
                )}
                {vendor.contact.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{vendor.contact.email}</span>
                  </div>
                )}
                {vendor.contact.website && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <ExternalLink className="w-4 h-4" />
                    <a href={vendor.contact.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderBudget = () => {
    const data = detailData.budget;
    if (!data) return <div>Loading budget guidance...</div>;

    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-3">Budget Allocation</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(data.budget_allocation).map(([category, amount]: [string, any]) => (
              <div key={category} className="text-center">
                <div className="text-2xl font-bold text-green-800">${amount}</div>
                <div className="text-sm text-green-700 capitalize">
                  {category.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Priority Recommendations</h3>
          <div className="space-y-2">
            {data.priority_recommendations?.map((rec: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <DollarSign className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm text-gray-700">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {data.cost_optimization?.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Cost Optimization Tips</h3>
            <div className="space-y-2">
              {data.cost_optimization.map((tip: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <Leaf className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cultural Philosophy Explorer
        </h2>
        <p className="text-gray-600">
          Deep dive into cultural design philosophies with authentic materials, vendors, and guidance
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search philosophies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <Button onClick={handleSearch} className="px-6">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="flex space-x-4">
          <select
            value={filters.culture}
            onChange={(e) => setFilters({...filters, culture: e.target.value})}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All Cultures</option>
            <option value="japanese">Japanese</option>
            <option value="scandinavian">Scandinavian</option>
            <option value="italian">Italian</option>
            <option value="french">French</option>
          </select>
          
          <select
            value={filters.complexity}
            onChange={(e) => setFilters({...filters, complexity: e.target.value})}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All Complexity</option>
            <option value="simple">Simple</option>
            <option value="moderate">Moderate</option>
            <option value="complex">Complex</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Philosophy List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Cultural Philosophies</h3>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {philosophies.map((philosophy) => (
                <motion.div
                  key={philosophy.id}
                  onClick={() => setSelectedPhilosophy(philosophy)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPhilosophy?.id === philosophy.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-medium text-gray-900">{philosophy.name}</h4>
                  <p className="text-sm text-gray-600">{philosophy.culture}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selectedPhilosophy && (
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedPhilosophy.name}
                </h3>
                <p className="text-gray-600">{selectedPhilosophy.culture}</p>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-96">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'colors' && renderColors()}
                {activeTab === 'materials' && renderMaterials()}
                {activeTab === 'vendors' && renderVendors()}
                {activeTab === 'budget' && renderBudget()}
              </div>

              {/* Action Button */}
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() => onPhilosophySelected?.(selectedPhilosophy)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  Use This Philosophy
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CulturalPhilosophyExplorer;