---
title: Agent Bootstrap Guide
version: 1.0
---

# Agent Bootstrap Guide

**Purpose**: This document provides new agents with everything they need to understand and use the project's systems effectively.

## Quick Start Checklist

1. **Read Core Documents** (in order):
   - `02_SYSTEM_PROMPT.md` - Your identity and core principles
   - `00_AGENT_WORKFLOW.md` - Mandatory workflow procedures
   - `03_PROJECT_OVERVIEW.md` - Project context and vision
   - `BOOTSTRAP_GUIDE.md` - This document (system usage)

2. **Check Current State**:
   - Read `handoff/LATEST_HANDOFF.md` for your specific mission
   - Review latest changelog entry in `changelogs/YYYY/MM/`
   - Check active implementation plans in `implementation-plans/YYYY/MM/`

3. **Initialize Your Session**:
   - Add entry to changelog using template
   - Review any incomplete work from previous agent

## System Overview

### 1. Changelog System (`changelogs/YYYY/MM/`)
- **Purpose**: Chronological project history and agent activity log
- **Structure**: Year/Month folders with dated files
- **Usage**: Add entries for major accomplishments, findings, decisions
- **Template**: Use `agents_docs_templates/changelog_entry.md.tpl`

### 2. Performance System (`performance/YYYY/MM/`)
- **Purpose**: Track agent performance metrics and reviews
- **Structure**: Year/Month folders with metrics, reviews, reports
- **Usage**: Log performance data, conduct reviews, generate reports
- **Integration**: Links to changelogs and implementation plans

### 3. Implementation Plans (`implementation-plans/YYYY/MM/`)
- **Purpose**: Track and manage development plans and progress
- **Structure**: Year/Month folders with active plans and reports
- **Usage**: Create, update, and track implementation progress
- **Integration**: Links to changelogs and performance metrics

## File Naming Conventions

### Changelog Files
- Format: `YYYY-MM-DD_AGENTNAME_DESCRIPTION.md`
- Example: `2025-01-28_AgentName_FeatureImplementation.md`

### Performance Files
- Metrics: `YYYY-MM-DD_metrics.json`
- Reviews: `YYYY-MM-DD_review.md`
- Reports: `YYYY-MM-DD_report.md`

### Implementation Plans
- Plans: `YYYY-MM-DD_plan_NAME.json` and `YYYY-MM-DD_plan_NAME.md`
- Reports: `YYYY-MM-DD_report_NAME.md`

## Bootstrap Commands

### Find Latest Files
```bash
# Latest changelog
find agents/changelogs -name "*.md" | sort | tail -1

# Latest performance data
find agents/performance -name "*.json" | sort | tail -1

# Active implementation plans
find agents/implementation-plans -name "*plan*.json" | sort
```

### Initialize New Session
```bash
# Create new month directory if needed
mkdir -p agents/changelogs/$(date +%Y)/$(date +%m)
mkdir -p agents/performance/$(date +%Y)/$(date +%m)
mkdir -p agents/implementation-plans/$(date +%Y)/$(date +%m)
```

## Quality Assurance Checklist

Before completing any task:
- [ ] Changelog entry added with proper format
- [ ] Performance metrics logged
- [ ] Implementation plan updated
- [ ] Cross-references added between systems
- [ ] Handoff prepared with clear next steps

## Common Patterns

### Starting a New Feature
1. Create implementation plan
2. Add changelog entry
3. Set performance baseline
4. Execute plan
5. Update all systems
6. Prepare handoff

### Fixing Issues
1. Log finding in changelog
2. Create correction plan
3. Execute fix
4. Update performance metrics
5. Document lessons learned

### Completing Work
1. Finalize all documentation
2. Update performance metrics
3. Archive completed plans
4. Prepare comprehensive handoff
5. Update changelog with summary

## Error Prevention

- **Always cross-reference**: Link entries between systems
- **Use templates**: Don't create files from scratch
- **Check for completeness**: Ensure all systems are updated
- **Validate format**: Use provided schemas and templates
- **Assume errors**: Review previous agent's work critically

## Integration Points

### AI-Q Knowledge Library
- All specifications in `ai-q/` directory
- Use KLF (Kind Link Framework) for connections
- Follow atomic knowledge unit patterns

### Agent Workflow
- Follow `00_AGENT_WORKFLOW.md` precisely
- Use mandatory onboarding process
- Maintain proper handoff procedures

### Project Architecture
- Reference `ai-q/04_architecture/` for system design
- Follow established patterns and conventions
- Maintain interoperability standards

## Troubleshooting

### Missing Files
- Check if month directory exists
- Look in previous months for related files
- Use search commands to locate misplaced files

### Format Issues
- Use provided templates and schemas
- Validate JSON files before committing
- Check markdown frontmatter format

### Integration Problems
- Ensure cross-references are properly linked
- Check that all systems are updated
- Verify handoff contains all necessary information

## Next Steps

1. Read the specific handoff document
2. Review any incomplete work
3. Begin your assigned mission
4. Follow this guide for all system interactions
5. Prepare comprehensive handoff when complete

Remember: This system is designed for traceability and quality. Every action should be documented and cross-referenced. 