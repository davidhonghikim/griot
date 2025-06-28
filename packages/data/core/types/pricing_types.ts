export interface PricingDocument {
  id: string;
  type: 'provider' | 'model' | 'media_pricing';
  content: string;
  metadata: Record<string, any>;
}

export interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export interface SearchResult {
  id: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
}

export interface SearchOptions {
  limit?: number;
  filter?: Record<string, any>;
  threshold?: number;
}

export interface ModelPricing {
  modelKey: string;
  providerKey: string;
  displayName: string;
  description: string;
  inputPricePer1MTokens: number;
  outputPricePer1MTokens: number;
  contextWindow: number;
  maxTokens: number;
  isActive: boolean;
  lastUpdated: string;
}

export interface MediaPricing {
  mediaType: 'image' | 'video' | 'audio';
  providerKey: string;
  pricingModel: 'per_unit' | 'per_minute' | 'per_second';
  baseCost: number;
  resolutionMultipliers?: Record<string, number>;
  qualityMultipliers?: Record<string, number>;
  isActive: boolean;
}

export interface ProviderMetadata {
  providerKey: string;
  displayName: string;
  description: string;
  website?: string;
  status: 'active' | 'deprecated' | 'testing' | 'inactive';
  logoUrl?: string;
}

export interface CostBreakdown {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  currency: string;
  modelKey: string;
  providerKey: string;
  tokenCount: {
    input: number;
    output: number;
  };
}

export interface BudgetRecord {
  id: string;
  budgetId: string;
  operationType: string;
  modelKey?: string;
  providerKey?: string;
  mediaType?: string;
  inputTokens?: number;
  outputTokens?: number;
  cost: number;
  currency: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface BudgetStatus {
  budgetId: string;
  budgetName: string;
  limit: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  isOverBudget: boolean;
  timeFrame: string;
  startDate: string;
  endDate?: string;
}

export interface PricingRecommendation {
  modelKey: string;
  providerKey: string;
  reason: string;
  estimatedCost: number;
  confidence: number;
  alternatives: Array<{
    modelKey: string;
    providerKey: string;
    estimatedCost: number;
    tradeOff: string;
  }>;
}

export interface PricingUpdate {
  type: 'model_pricing' | 'media_pricing' | 'provider_metadata';
  action: 'create' | 'update' | 'delete';
  data: any;
  source: 'web_scraping' | 'api' | 'manual' | 'default_file';
  timestamp: string;
}

export interface PricingStats {
  totalProviders: number;
  totalModels: number;
  averageInputPrice: number;
  averageOutputPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  mostExpensiveModel: {
    modelKey: string;
    providerKey: string;
    price: number;
  };
  cheapestModel: {
    modelKey: string;
    providerKey: string;
    price: number;
  };
  priceChangesLastWeek: number;
  newProvidersThisMonth: number;
}

export interface UseCaseRecommendation {
  useCase: string;
  description: string;
  recommendedModels: Array<{
    modelKey: string;
    providerKey: string;
    reason: string;
    estimatedCost: number;
  }>;
  budgetRange: {
    min: number;
    max: number;
  };
  performanceNotes: string;
}

export interface PricingQueryFilters {
  providers?: string[];
  maxPrice?: number;
  minPrice?: number;
  mediaTypes?: string[];
  contextWindowMin?: number;
  contextWindowMax?: number;
  isActive?: boolean;
  performance?: 'fast' | 'balanced' | 'high_quality';
}

export interface PricingSearchResult {
  results: ModelPricing[];
  total: number;
  filters: PricingQueryFilters;
  searchTime: number;
  suggestions?: string[];
} 