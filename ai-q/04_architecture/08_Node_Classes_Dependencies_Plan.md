---
title: "Node Classes Dependencies Plan"
version: "1.0"
status: "Planning"
created: "2025-06-28"
---

# Node Classes Dependencies Plan for kOS

## Overview

This document outlines all node classes, their required skills, recipes, and dependencies needed for the near future implementation. This ensures we have all assets ready in advance for seamless development and deployment.

## Node Classes Analysis

### 1. **Griot** (Core Engineer)
**Status**: ✅ Complete
**Base**: `griot-core-dangermouse-b82c4707-8c7d-4bb3-9608-7c33a924806f.yml`

**Required Skills**:
- ✅ `skills/core-engineering-v1/` (exists)
- ✅ `skills/ai/token_calculator_rag.yaml` (exists)
- ✅ `skills/ai/budget_manager.yaml` (exists)

**Required Recipes**:
- ✅ `recipes/ai/budget_aware_chat.yaml` (exists)

**Required Scripts**:
- ✅ `scripts/setup_pricing_rag.py` (exists)

**Dependencies**: All complete

### 2. **Amauta** (Cultural Teacher)
**Status**: 🔄 In Progress
**Base**: `amauta-core-dangermouse-235f30d2-5413-4f77-8f2f-b59d0a8b0366.yml`

**Required Skills**:
- ✅ `skills/teaching/mentor.yaml` (created)
- ✅ `skills/teaching/cultural_educator.yaml` (created)
- ❌ `skills/teaching/knowledge_transmission.yaml` (needed)
- ❌ `skills/teaching/learning_assessment.yaml` (needed)

**Required Recipes**:
- ✅ `recipes/teaching/mentorship_workflow.yaml` (created)
- ❌ `recipes/teaching/cultural_education_workflow.yaml` (needed)
- ❌ `recipes/teaching/learning_path_development.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/teaching_processor.py` (needed)

**Dependencies**: 60% complete

### 3. **Tohunga** (Data Validator)
**Status**: ❌ Missing Dependencies
**Base**: `tohunga-core-dangermouse-e2f7cf48-b3f5-4241-aec8-e181c6ad31f1.yml`

**Required Skills**:
- ❌ `skills/data/validation.yaml` (needed)
- ❌ `skills/data/cleaning.yaml` (needed)
- ❌ `skills/data/structuring.yaml` (needed)
- ❌ `skills/data/quality_assurance.yaml` (needed)

**Required Recipes**:
- ❌ `recipes/data/validation_workflow.yaml` (needed)
- ❌ `recipes/data/cleaning_pipeline.yaml` (needed)
- ❌ `recipes/data/quality_assurance_workflow.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/data_processor.py` (needed)

**Dependencies**: 0% complete

### 4. **Musa** (Security Specialist)
**Status**: ❌ Missing Dependencies
**Base**: `musa-core-dangermouse-254afe56-b94c-4f2d-855d-c564d898b5af.yml`

**Required Skills**:
- ❌ `skills/security/threat_detection.yaml` (needed)
- ❌ `skills/security/compliance_validation.yaml` (needed)
- ❌ `skills/security/code_security_analysis.yaml` (needed)
- ❌ `skills/security/authentication.yaml` (needed)
- ❌ `skills/security/authorization.yaml` (needed)

**Required Recipes**:
- ❌ `recipes/security/security_audit_workflow.yaml` (needed)
- ❌ `recipes/security/compliance_check_workflow.yaml` (needed)
- ❌ `recipes/security/code_review_workflow.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/security_analyzer.py` (needed)

**Dependencies**: 0% complete

### 5. **Ronin** (Autonomous Agent)
**Status**: ❌ Missing Dependencies
**Base**: `ronin-core-dangermouse-056601a1-a8d1-4228-8e3c-bafab38e2f2e.yml`

**Required Skills**:
- ❌ `skills/autonomy/decision_making.yaml` (needed)
- ❌ `skills/autonomy/independent_execution.yaml` (needed)
- ❌ `skills/autonomy/strategic_planning.yaml` (needed)
- ❌ `skills/autonomy/self_directed_workflows.yaml` (needed)

**Required Recipes**:
- ❌ `recipes/autonomy/autonomous_workflow.yaml` (needed)
- ❌ `recipes/autonomy/decision_workflow.yaml` (needed)
- ❌ `recipes/autonomy/strategic_execution_workflow.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/autonomy_manager.py` (needed)

**Dependencies**: 0% complete

### 6. **Yachay** (Learning Specialist)
**Status**: ❌ Missing Dependencies
**Base**: `yachay-core-dangermouse-943d7a9d-a7c5-43f7-aaae-c92aca9881d4.yml`

**Required Skills**:
- ❌ `skills/learning/knowledge_transmission.yaml` (needed)
- ❌ `skills/learning/educational_methodologies.yaml` (needed)
- ❌ `skills/learning/cultural_learning.yaml` (needed)
- ❌ `skills/learning/adaptive_learning.yaml` (needed)

**Required Recipes**:
- ❌ `recipes/learning/learning_workflow.yaml` (needed)
- ❌ `recipes/learning/adaptive_education_workflow.yaml` (needed)
- ❌ `recipes/learning/cultural_learning_workflow.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/learning_processor.py` (needed)

**Dependencies**: 0% complete

### 7. **Skald** (Storyteller)
**Status**: ❌ Missing Dependencies
**Base**: `skald-core-dangermouse-aaad47a8-a11a-4e2f-a9cd-14b6e7d08221.yml`

**Required Skills**:
- ❌ `skills/communication/storytelling.yaml` (needed)
- ❌ `skills/communication/narrative_generation.yaml` (needed)
- ❌ `skills/communication/cultural_storytelling.yaml` (needed)
- ❌ `skills/communication/effective_communication.yaml` (needed)

**Required Recipes**:
- ❌ `recipes/communication/storytelling_workflow.yaml` (needed)
- ❌ `recipes/communication/narrative_workflow.yaml` (needed)
- ❌ `recipes/communication/communication_workflow.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/story_processor.py` (needed)

**Dependencies**: 0% complete

### 8. **Hakim** (Wisdom Manager)
**Status**: ❌ Missing Dependencies
**Base**: `hakim-core-dangermouse-f2b095a9-14ca-4188-a14a-43fa70b525c5.yml`

**Required Skills**:
- ❌ `skills/wisdom/cultural_intelligence.yaml` (needed)
- ❌ `skills/wisdom/knowledge_curation.yaml` (needed)
- ❌ `skills/wisdom/wisdom_based_decisions.yaml` (needed)
- ❌ `skills/wisdom/knowledge_management.yaml` (needed)

**Required Recipes**:
- ❌ `recipes/wisdom/wisdom_workflow.yaml` (needed)
- ❌ `recipes/wisdom/knowledge_curation_workflow.yaml` (needed)
- ❌ `recipes/wisdom/decision_support_workflow.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/wisdom_processor.py` (needed)

**Dependencies**: 0% complete

### 9. **Junzi** (Ethical Leader)
**Status**: ❌ Missing Dependencies
**Base**: `junzi-core-dangermouse-1caf614d-f987-42ce-84ab-25fe9dff79f3.yml`

**Required Skills**:
- ❌ `skills/ethics/virtuous_behavior.yaml` (needed)
- ❌ `skills/ethics/ethical_decision_making.yaml` (needed)
- ❌ `skills/ethics/moral_guidance.yaml` (needed)
- ❌ `skills/ethics/cultural_sensitivity.yaml` (needed)

**Required Recipes**:
- ❌ `recipes/ethics/ethical_workflow.yaml` (needed)
- ❌ `recipes/ethics/decision_ethics_workflow.yaml` (needed)
- ❌ `recipes/ethics/moral_guidance_workflow.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/ethics_processor.py` (needed)

**Dependencies**: 0% complete

### 10. **Sachem** (Governance Leader)
**Status**: ❌ Missing Dependencies
**Base**: `sachem-core-dangermouse-166dd687-f0e6-406a-84a2-8494286e2249.yml`

**Required Skills**:
- ❌ `skills/governance/community_decision_making.yaml` (needed)
- ❌ `skills/governance/governance_systems.yaml` (needed)
- ❌ `skills/governance/cultural_leadership.yaml` (needed)
- ❌ `skills/governance/community_management.yaml` (needed)

**Required Recipes**:
- ❌ `recipes/governance/governance_workflow.yaml` (needed)
- ❌ `recipes/governance/community_workflow.yaml` (needed)
- ❌ `recipes/governance/leadership_workflow.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/governance_processor.py` (needed)

**Dependencies**: 0% complete

### 11. **Oracle** (Predictor)
**Status**: ❌ Missing Dependencies
**Base**: `oracle-core-dangermouse-ca32832a-deb8-494d-8a6a-38c9cc3e87e9.yml`

**Required Skills**:
- ❌ `skills/prediction/future_analysis.yaml` (needed)
- ❌ `skills/prediction/trend_prediction.yaml` (needed)
- ❌ `skills/prediction/scenario_planning.yaml` (needed)
- ❌ `skills/prediction/forecasting.yaml` (needed)

**Required Recipes**:
- ❌ `recipes/prediction/prediction_workflow.yaml` (needed)
- ❌ `recipes/prediction/scenario_workflow.yaml` (needed)
- ❌ `recipes/prediction/forecasting_workflow.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/prediction_processor.py` (needed)

**Dependencies**: 0% complete

### 12. **Archon** (Authority)
**Status**: ❌ Missing Dependencies
**Base**: `archon-core-dangermouse-6aac4a2a-384e-4896-a281-9f5cd505c6d7.yml`

**Required Skills**:
- ❌ `skills/authority/system_governance.yaml` (needed)
- ❌ `skills/authority/rule_enforcement.yaml` (needed)
- ❌ `skills/authority/authoritative_decisions.yaml` (needed)
- ❌ `skills/authority/cultural_sensitivity.yaml` (needed)

**Required Recipes**:
- ❌ `recipes/authority/governance_workflow.yaml` (needed)
- ❌ `recipes/authority/enforcement_workflow.yaml` (needed)
- ❌ `recipes/authority/authority_workflow.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/authority_processor.py` (needed)

**Dependencies**: 0% complete

### 13. **Mzee** (Elder)
**Status**: ❌ Missing Dependencies
**Base**: `mzee-core-dangermouse-d4c381c7-d50e-4a9e-98c9-d1c085291b4f.yml`

**Required Skills**:
- ❌ `skills/elder/accumulated_knowledge.yaml` (needed)
- ❌ `skills/elder/life_experience.yaml` (needed)
- ❌ `skills/elder/elder_guidance.yaml` (needed)
- ❌ `skills/elder/cultural_traditions.yaml` (needed)

**Required Recipes**:
- ❌ `recipes/elder/elder_workflow.yaml` (needed)
- ❌ `recipes/elder/guidance_workflow.yaml` (needed)
- ❌ `recipes/elder/tradition_workflow.yaml` (needed)

**Required Scripts**:
- ❌ `scripts/elder_processor.py` (needed)

**Dependencies**: 0% complete

## Implementation Priority

### Phase 1: Critical Dependencies (Next 1-2 Sessions)
1. **Complete Amauta** (60% done)
   - Create missing teaching skills
   - Create missing teaching recipes
   - Create teaching processor script

2. **Start Tohunga** (Data validation is critical for RAG)
   - Create data validation skills
   - Create data processing recipes
   - Create data processor script

### Phase 2: Security and Autonomy (Next 2-3 Sessions)
3. **Musa** (Security is critical for production)
4. **Ronin** (Autonomy needed for advanced workflows)

### Phase 3: Learning and Communication (Next 3-4 Sessions)
5. **Yachay** (Learning specialist)
6. **Skald** (Communication specialist)

### Phase 4: Wisdom and Ethics (Next 4-5 Sessions)
7. **Hakim** (Wisdom management)
8. **Junzi** (Ethical leadership)

### Phase 5: Governance and Prediction (Next 5-6 Sessions)
9. **Sachem** (Community governance)
10. **Oracle** (Prediction and forecasting)

### Phase 6: Authority and Elder (Next 6-7 Sessions)
11. **Archon** (System authority)
12. **Mzee** (Elder wisdom)

## File Structure Requirements

### Skills Directory Structure
```
packages/data/skills/
├── teaching/
│   ├── mentor.yaml ✅
│   ├── cultural_educator.yaml ✅
│   ├── knowledge_transmission.yaml ❌
│   └── learning_assessment.yaml ❌
├── data/
│   ├── validation.yaml ❌
│   ├── cleaning.yaml ❌
│   ├── structuring.yaml ❌
│   └── quality_assurance.yaml ❌
├── security/
│   ├── threat_detection.yaml ❌
│   ├── compliance_validation.yaml ❌
│   ├── code_security_analysis.yaml ❌
│   ├── authentication.yaml ❌
│   └── authorization.yaml ❌
├── autonomy/
│   ├── decision_making.yaml ❌
│   ├── independent_execution.yaml ❌
│   ├── strategic_planning.yaml ❌
│   └── self_directed_workflows.yaml ❌
├── learning/
│   ├── knowledge_transmission.yaml ❌
│   ├── educational_methodologies.yaml ❌
│   ├── cultural_learning.yaml ❌
│   └── adaptive_learning.yaml ❌
├── communication/
│   ├── storytelling.yaml ❌
│   ├── narrative_generation.yaml ❌
│   ├── cultural_storytelling.yaml ❌
│   └── effective_communication.yaml ❌
├── wisdom/
│   ├── cultural_intelligence.yaml ❌
│   ├── knowledge_curation.yaml ❌
│   ├── wisdom_based_decisions.yaml ❌
│   └── knowledge_management.yaml ❌
├── ethics/
│   ├── virtuous_behavior.yaml ❌
│   ├── ethical_decision_making.yaml ❌
│   ├── moral_guidance.yaml ❌
│   └── cultural_sensitivity.yaml ❌
├── governance/
│   ├── community_decision_making.yaml ❌
│   ├── governance_systems.yaml ❌
│   ├── cultural_leadership.yaml ❌
│   └── community_management.yaml ❌
├── prediction/
│   ├── future_analysis.yaml ❌
│   ├── trend_prediction.yaml ❌
│   ├── scenario_planning.yaml ❌
│   └── forecasting.yaml ❌
├── authority/
│   ├── system_governance.yaml ❌
│   ├── rule_enforcement.yaml ❌
│   ├── authoritative_decisions.yaml ❌
│   └── cultural_sensitivity.yaml ❌
└── elder/
    ├── accumulated_knowledge.yaml ❌
    ├── life_experience.yaml ❌
    ├── elder_guidance.yaml ❌
    └── cultural_traditions.yaml ❌
```

### Recipes Directory Structure
```
packages/data/recipes/
├── teaching/
│   ├── mentorship_workflow.yaml ✅
│   ├── cultural_education_workflow.yaml ❌
│   └── learning_path_development.yaml ❌
├── data/
│   ├── validation_workflow.yaml ❌
│   ├── cleaning_pipeline.yaml ❌
│   └── quality_assurance_workflow.yaml ❌
├── security/
│   ├── security_audit_workflow.yaml ❌
│   ├── compliance_check_workflow.yaml ❌
│   └── code_review_workflow.yaml ❌
├── autonomy/
│   ├── autonomous_workflow.yaml ❌
│   ├── decision_workflow.yaml ❌
│   └── strategic_execution_workflow.yaml ❌
├── learning/
│   ├── learning_workflow.yaml ❌
│   ├── adaptive_education_workflow.yaml ❌
│   └── cultural_learning_workflow.yaml ❌
├── communication/
│   ├── storytelling_workflow.yaml ❌
│   ├── narrative_workflow.yaml ❌
│   └── communication_workflow.yaml ❌
├── wisdom/
│   ├── wisdom_workflow.yaml ❌
│   ├── knowledge_curation_workflow.yaml ❌
│   └── decision_support_workflow.yaml ❌
├── ethics/
│   ├── ethical_workflow.yaml ❌
│   ├── decision_ethics_workflow.yaml ❌
│   └── moral_guidance_workflow.yaml ❌
├── governance/
│   ├── governance_workflow.yaml ❌
│   ├── community_workflow.yaml ❌
│   └── leadership_workflow.yaml ❌
├── prediction/
│   ├── prediction_workflow.yaml ❌
│   ├── scenario_workflow.yaml ❌
│   └── forecasting_workflow.yaml ❌
├── authority/
│   ├── governance_workflow.yaml ❌
│   ├── enforcement_workflow.yaml ❌
│   └── authority_workflow.yaml ❌
└── elder/
    ├── elder_workflow.yaml ❌
    ├── guidance_workflow.yaml ❌
    └── tradition_workflow.yaml ❌
```

### Scripts Directory Structure
```
packages/data/scripts/
├── teaching_processor.py ❌
├── data_processor.py ❌
├── security_analyzer.py ❌
├── autonomy_manager.py ❌
├── learning_processor.py ❌
├── story_processor.py ❌
├── wisdom_processor.py ❌
├── ethics_processor.py ❌
├── governance_processor.py ❌
├── prediction_processor.py ❌
├── authority_processor.py ❌
└── elder_processor.py ❌
```

## Success Metrics

### Completion Targets
- **Phase 1**: 100% of Amauta and Tohunga dependencies
- **Phase 2**: 100% of Musa and Ronin dependencies
- **Phase 3**: 100% of Yachay and Skald dependencies
- **Phase 4**: 100% of Hakim and Junzi dependencies
- **Phase 5**: 100% of Sachem and Oracle dependencies
- **Phase 6**: 100% of Archon and Mzee dependencies

### Quality Targets
- All skills follow established patterns and file size limits
- All recipes include proper workflow logic and error handling
- All scripts include proper error handling and logging
- All assets are properly indexed and discoverable

### Integration Targets
- All personas can load their required assets
- All dependencies are properly resolved
- All assets work with the existing asset loading system
- All assets are compatible with the RAG and storage systems

## Next Steps

1. **Immediate**: Complete Amauta dependencies (2 missing skills, 2 missing recipes, 1 missing script)
2. **Short-term**: Create Tohunga dependencies (4 skills, 3 recipes, 1 script)
3. **Medium-term**: Create Musa and Ronin dependencies
4. **Long-term**: Complete all remaining node class dependencies

This plan ensures we have all assets ready in advance for seamless development and deployment of the kOS persona system. 