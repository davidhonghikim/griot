---
title: "Component System Module"
description: "HIEROS-compliant React component architecture for kOS frontend"
type: "architecture_module"
status: "active"
priority: "high"
last_updated: "2025-01-28"
version: "1.0.0"
parent_document: "02_Frontend_Architecture.md"
module_index: 2
---

# Component System Module

**HIEROS-Compliant React Component Architecture**

> **Module Overview**: This module defines the complete component system architecture ensuring all UI components maintain HIEROS covenant compliance, cultural sensitivity, and accessibility standards across the kOS ecosystem.

## 🧩 HIEROS-Compliant Base Components

### Core Component Interface

```typescript
// Base component interface for all kOS UI components
interface KOSComponentProps {
  theme?: CulturalTheme;
  accessibility?: AccessibilityProps;
  hieros?: HIEROSContextProps;
  children?: React.ReactNode;
  className?: string;
}

interface HIEROSContextProps {
  culturalAttributions: CulturalAttribution[];
  consentLevel: "full" | "limited" | "minimal";
  privacyMode: boolean;
  auditLogging: boolean;
  intentionsValidated: HIEROSIntention[];
}

interface AccessibilityProps {
  altText?: string;
  ariaLabel?: string;
  ariaDescription?: string;
  keyboardNav?: boolean;
  screenReaderOptimized?: boolean;
  colorBlindAccessible?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
}
```

### Base Component Framework

```typescript
// HOC for HIEROS compliance
const withHIEROSCompliance = <P extends KOSComponentProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  const HIEROSCompliantComponent = (props: P) => {
    const hierosContext = useHIEROSContext();
    const accessibility = useAccessibility();
    const cultural = useCulturalContext();
    
    // Validate HIEROS compliance
    const compliance = validateHIEROSCompliance(props, hierosContext);
    if (!compliance.valid) {
      console.warn('HIEROS compliance violation:', compliance.violations);
    }
    
    // Apply accessibility enhancements
    const enhancedProps = {
      ...props,
      accessibility: {
        ...accessibility,
        ...props.accessibility
      },
      hieros: {
        ...hierosContext,
        ...props.hieros
      },
      theme: props.theme || cultural.defaultTheme
    };
    
    return <WrappedComponent {...enhancedProps} />;
  };
  
  HIEROSCompliantComponent.displayName = `withHIEROSCompliance(${WrappedComponent.displayName})`;
  return HIEROSCompliantComponent;
};
```

## 🎨 Core UI Components

### Cultural Header Component

```tsx
interface CulturalHeaderProps extends KOSComponentProps {
  nodeClass: NodeClass;
  nodeName: string;
  culturalContext: CulturalAttribution;
  statusIndicators: StatusIndicator[];
  onCulturalInfoClick?: () => void;
}

const CulturalHeader: React.FC<CulturalHeaderProps> = ({
  nodeClass,
  nodeName,
  culturalContext,
  statusIndicators,
  onCulturalInfoClick,
  theme,
  hieros,
  accessibility
}) => {
  const { t } = useTranslation();
  const { highContrast, reducedMotion } = useAccessibility();
  
  return (
    <header 
      className={cn(
        "cultural-header",
        `cultural-header--${nodeClass.toLowerCase()}`,
        highContrast && "high-contrast",
        className
      )}
      role="banner"
      aria-label={accessibility?.ariaLabel || `${nodeClass} node header`}
    >
      {/* Cultural symbol with attribution */}
      <div className="cultural-symbol-container">
        <CulturalIcon 
          symbol={theme.iconography.symbols.identity}
          attribution={culturalContext}
          onClick={onCulturalInfoClick}
          aria-label={`Cultural symbol representing ${culturalContext.tradition}`}
        />
        <CulturalAttributionTooltip attribution={culturalContext} />
      </div>
      
      {/* Node identity */}
      <div className="node-identity">
        <h1 className="node-name">{nodeName}</h1>
        <p className="node-class" aria-describedby="node-class-description">
          {nodeClass} Node
        </p>
        <span id="node-class-description" className="sr-only">
          {t(`node.${nodeClass.toLowerCase()}.description`)}
        </span>
        
        {/* Cultural context information */}
        <CulturalContextBadge 
          attribution={culturalContext}
          compact={true}
          onClick={onCulturalInfoClick}
        />
      </div>
      
      {/* Status indicators */}
      <div className="status-indicators" role="status" aria-live="polite">
        {statusIndicators.map(indicator => (
          <StatusBadge 
            key={indicator.type} 
            {...indicator}
            accessibility={{
              ariaLabel: `${indicator.type} status: ${indicator.status}`
            }}
          />
        ))}
      </div>
      
      {/* HIEROS compliance indicator */}
      <HIEROSComplianceBadge 
        compliance={hieros.covenantCompliance}
        accessibility={{
          ariaLabel: "HIEROS covenant compliance status"
        }}
      />
    </header>
  );
};

export default withHIEROSCompliance(CulturalHeader);
```

### Service Connector Interface

```tsx
interface ServiceConnectorProps extends KOSComponentProps {
  service: ServiceDefinition;
  capabilities: Capability[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  onConnect: (config: ConnectionConfig) => Promise<void>;
  onDisconnect: () => Promise<void>;
  onTest: () => Promise<TestResult>;
}

const ServiceConnector: React.FC<ServiceConnectorProps> = ({
  service,
  capabilities,
  connectionStatus,
  onConnect,
  onDisconnect,
  onTest,
  theme,
  hieros,
  accessibility
}) => {
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const { t } = useTranslation();

  const handleTest = async () => {
    try {
      const results = await onTest();
      setTestResults(results);
    } catch (error) {
      setTestResults({ success: false, error: error.message });
    }
  };
  
  return (
    <div 
      className="service-connector"
      role="region"
      aria-label={`${service.name} service connector`}
    >
      <div className="service-header">
        <div className="service-info">
          <h3 className="service-name">{service.name}</h3>
          <p className="service-description">{service.description}</p>
          <ServiceTypeBadge type={service.type} />
        </div>
        
        <div className="connection-controls">
          <ConnectionStatusIndicator 
            status={connectionStatus}
            accessibility={{
              ariaLabel: `Connection status: ${connectionStatus}`
            }}
          />
          
          {connectionStatus === 'connected' ? (
            <Button
              variant="secondary"
              onClick={onDisconnect}
              accessibility={{
                ariaLabel: `Disconnect from ${service.name}`
              }}
            >
              {t('service.disconnect')}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setIsConfigExpanded(true)}
              accessibility={{
                ariaLabel: `Connect to ${service.name}`
              }}
            >
              {t('service.connect')}
            </Button>
          )}
        </div>
      </div>

      {/* Capabilities overview */}
      <div className="capabilities-overview">
        <h4>{t('service.capabilities')}</h4>
        <div className="capabilities-grid">
          {capabilities.map(capability => (
            <CapabilityCard
              key={capability.id}
              capability={capability}
              accessibility={{
                ariaLabel: `${capability.name} capability`
              }}
            />
          ))}
        </div>
      </div>

      {/* Configuration modal */}
      <ServiceConfigModal
        isOpen={isConfigExpanded}
        service={service}
        onClose={() => setIsConfigExpanded(false)}
        onConnect={onConnect}
        accessibility={{
          ariaLabel: `Configuration for ${service.name}`
        }}
      />

      {/* Test results */}
      {testResults && (
        <TestResultsDisplay
          results={testResults}
          onClear={() => setTestResults(null)}
          accessibility={{
            ariaLabel: "Service test results"
          }}
        />
      )}
    </div>
  );
};

export default withHIEROSCompliance(ServiceConnector);
```

### HIEROS Compliance Dashboard

```tsx
interface HIEROSComplianceDashboardProps extends KOSComponentProps {
  nodeClass: NodeClass;
  complianceStatus: HIEROSComplianceStatus;
  culturalAudits: CulturalAudit[];
  accessibilityScore: number;
  onRunAudit: () => Promise<void>;
  onViewDetails: (audit: CulturalAudit) => void;
}

const HIEROSComplianceDashboard: React.FC<HIEROSComplianceDashboardProps> = ({
  nodeClass,
  complianceStatus,
  culturalAudits,
  accessibilityScore,
  onRunAudit,
  onViewDetails,
  theme,
  hieros,
  accessibility
}) => {
  const { t } = useTranslation();
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      await onRunAudit();
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div 
      className="hieros-compliance-dashboard"
      role="main"
      aria-label="HIEROS covenant compliance dashboard"
    >
      <div className="dashboard-header">
        <h2>{t('hieros.compliance.title')}</h2>
        <p className="dashboard-description">
          {t('hieros.compliance.description', { nodeClass })}
        </p>
      </div>

      {/* Seven Intentions Status */}
      <div className="intentions-status" role="region" aria-label="Seven Sacred Intentions status">
        <h3>{t('hieros.intentions.title')}</h3>
        <div className="intentions-grid">
          {HIEROS_INTENTIONS.map(intention => (
            <IntentionStatusCard
              key={intention.id}
              intention={intention}
              status={complianceStatus.intentions[intention.id]}
              onViewDetails={() => onViewDetails(intention.lastAudit)}
              accessibility={{
                ariaLabel: `${intention.name} compliance status`
              }}
            />
          ))}
        </div>
      </div>

      {/* Cultural Compliance Summary */}
      <div className="cultural-compliance" role="region" aria-label="Cultural compliance summary">
        <h3>{t('hieros.cultural.title')}</h3>
        <div className="compliance-metrics">
          <ComplianceMetric
            label={t('hieros.cultural.authenticity')}
            score={complianceStatus.culturalAuthenticity}
            threshold={0.9}
            accessibility={{
              ariaLabel: `Cultural authenticity score: ${complianceStatus.culturalAuthenticity * 100}%`
            }}
          />
          <ComplianceMetric
            label={t('hieros.accessibility.score')}
            score={accessibilityScore}
            threshold={0.9}
            accessibility={{
              ariaLabel: `Accessibility score: ${accessibilityScore * 100}%`
            }}
          />
          <ComplianceMetric
            label={t('hieros.stewardship.impact')}
            score={complianceStatus.stewardshipImpact}
            threshold={0.8}
            accessibility={{
              ariaLabel: `Stewardship impact score: ${complianceStatus.stewardshipImpact * 100}%`
            }}
          />
        </div>
      </div>

      {/* Recent Audits */}
      <div className="recent-audits" role="region" aria-label="Recent cultural audits">
        <div className="audits-header">
          <h3>{t('hieros.audits.recent')}</h3>
          <Button
            variant="primary"
            onClick={handleRunAudit}
            disabled={isAuditing}
            accessibility={{
              ariaLabel: "Run new HIEROS compliance audit"
            }}
          >
            {isAuditing ? t('hieros.audits.running') : t('hieros.audits.run')}
          </Button>
        </div>
        
        <div className="audits-list">
          {culturalAudits.map(audit => (
            <CulturalAuditCard
              key={audit.id}
              audit={audit}
              onViewDetails={() => onViewDetails(audit)}
              accessibility={{
                ariaLabel: `Cultural audit from ${audit.date}`
              }}
            />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations" role="region" aria-label="Compliance recommendations">
        <h3>{t('hieros.recommendations.title')}</h3>
        <RecommendationsList
          recommendations={complianceStatus.recommendations}
          onApplyRecommendation={(rec) => console.log('Apply:', rec)}
          accessibility={{
            ariaLabel: "Compliance improvement recommendations"
          }}
        />
      </div>
    </div>
  );
};

export default withHIEROSCompliance(HIEROSComplianceDashboard);
```

## 🔧 Component Utilities

### Theme Context Provider

```tsx
interface ThemeContextValue {
  currentTheme: CulturalTheme;
  availableThemes: CulturalTheme[];
  setTheme: (themeId: string) => void;
  culturalContext: CulturalContext;
  accessibility: AccessibilityConfig;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<CulturalTheme>(defaultTheme);
  const [culturalContext, setCulturalContext] = useState<CulturalContext>(defaultCulturalContext);
  const accessibility = useAccessibilityConfig();

  const setTheme = useCallback((themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      // Validate HIEROS compliance
      validateThemeCompliance(theme, culturalContext);
    }
  }, [availableThemes, culturalContext]);

  const value = useMemo(() => ({
    currentTheme,
    availableThemes,
    setTheme,
    culturalContext,
    accessibility
  }), [currentTheme, setTheme, culturalContext, accessibility]);

  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${currentTheme.id}`} data-cultural-context={culturalContext.primary}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## 🔄 Cross-References

- **Cultural Design System**: See `01_Cultural_Design_System.md` for theme definitions and cultural compliance
- **State Management**: See `03_State_Management.md` for component state patterns
- **Accessibility Framework**: See `04_Accessibility_Framework.md` for accessibility implementation details
- **Application Architecture**: See parent document sections 816-975 for app-level component integration 