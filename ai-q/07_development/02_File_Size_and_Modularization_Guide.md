---
title: "File Size and Modularization Guide"
version: "1.0.0"
---

# File Size and Modularization Guide for kOS

**Purpose**: This document defines target file sizes and modularization standards for optimal token usage, context windows, and AI agent performance in the kOS project.

---

## ✅ Target File Sizes for Large Codebases

### ✅ Short Practical Answer (Per File / Module):

| Type                                               | Target Size                                                                             |
| -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Source Code File (per module/class/service)**    | **100 – 500 lines max per file** (preferably **<300 lines**)                            |
| **Dynamic Import Chunk (if bundled for frontend)** | **<200KB uncompressed per chunk**                                                       |
| **Server-Side API Endpoint Files**                 | **<300–500 lines**                                                                      |
| **Configuration / JSON / Schema Files**            | **<5MB each**, with most being **<1MB**                                                 |
| **Markdown / Specs / Docs**                        | **<1000 lines or ~500KB per file**, then split by topic/module                         |
| **Agent Context Files (prompt/system/context)**    | **<100KB total per agent input** (so chunk large context over multiple steps if needed) |

---

## ✅ Why These Targets?

| Concern                                 | Why It Matters                                                                                                       |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **AI Agent Parsing Limitations**        | LLMs like GPT-4o and even local LLMs struggle with long single-file context for code reasoning                       |
| **Human Cognitive Load**                | Reading/debugging >300 lines per file becomes slow and error-prone                                                   |
| **Version Control**                     | Large files create merge conflict nightmares in Git                                                                  |
| **Refactorability**                     | Small files = easier agent-driven refactoring, testing, and reasoning                                                |
| **Build/Bundle Size**                   | For frontend: dynamic chunks >200KB cause poor load times and cache invalidation                                     |
| **Vector Search & RAG Context Windows** | Smaller, semantically-cohesive files make vectorized semantic search and RAG-based agent loading much more efficient |

---

## ✅ Architecture Principles for kOS Large Projects:

| Principle                                 | Recommendation                                                                                              |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Micro-module Organization**             | Split by feature, role, or agent class (Example: `griot/`, `skald/`, `tohunga/` folders)                    |
| **Aggressive Dynamic Imports (Frontend)** | Lazy-load all non-critical UI, tools, and large data visualizations                                         |
| **Granular Backend APIs**                 | Keep each endpoint or Lambda function <300 lines                                                            |
| **Metadata-Indexed Content**              | Break docs and specs by topic, keep cross-linked with graph references                                      |
| **Agent Context Limiting**                | Never feed agents >10K tokens raw at once. Pre-chunk, summarize, or use RAG for context                     |
| **Chunked Vectorization**                 | For semantic memory, chunk at **~500 tokens per chunk (~2KB text)** for LLM optimal retrieval granularity |

---

## ✅ Real World Reference Targets (From Large Projects):

| System                                        | Average Per File Size                         |
| --------------------------------------------- | --------------------------------------------- |
| **Node.js Express Apps**                      | **100–300 lines per controller/service file** |
| **Next.js Projects**                          | **50–150 lines per page/component**           |
| **LLM Fine-tune Datasets (per input sample)** | **<4KB per sample**                           |
| **Large Monorepos (Google-scale)**            | **~200–600 lines per logical unit file**     |

---

## ✅ kOS-Specific Guidelines:

### Source Code Files
- **Node/Service Files**: 100-300 lines preferred, hard limit ~500 lines
- **Agent Implementation Files**: 150-400 lines, split complex agents into multiple files
- **Configuration Files**: <1MB each, split large configs by domain
- **Test Files**: 100-300 lines, one test file per source file

### Documentation Files
- **Specification Files**: <1000 lines, split by topic/module
- **README Files**: <500 lines, use index files for large documentation sets
- **Agent Context Files**: <100KB total per agent input

### Asset Files
- **Persona Files**: <50KB each, split complex personas into multiple files
- **Skill Files**: <100KB each, modularize large skills
- **Recipe Files**: <200KB each, break complex workflows into steps

---

## ✅ Code Review Checklist for Agents

### File Size Compliance
- [ ] **Source files are <500 lines** (preferably <300 lines)
- [ ] **Documentation files are <1000 lines** (preferably <500 lines)
- [ ] **Configuration files are <1MB** each
- [ ] **Agent context files are <100KB** total per input

### Modularization Standards
- [ ] **Single Responsibility**: Each file has one clear purpose
- [ ] **Logical Grouping**: Related functionality is grouped together
- [ ] **Dependency Management**: Clear import/export structure
- [ ] **Interface Separation**: Public APIs are clearly defined

### Code Quality
- [ ] **Readable Structure**: Clear sections and logical flow
- [ ] **Consistent Formatting**: Follows project style guidelines
- [ ] **Documentation**: Inline comments for complex logic
- [ ] **Error Handling**: Appropriate error handling and validation

### Performance Considerations
- [ ] **Efficient Algorithms**: No obvious performance bottlenecks
- [ ] **Memory Usage**: Reasonable memory footprint
- [ ] **Async Operations**: Proper async/await patterns where needed
- [ ] **Caching Strategy**: Appropriate caching for expensive operations

### Security & Safety
- [ ] **Input Validation**: All inputs are validated
- [ ] **Error Messages**: No sensitive information in error messages
- [ ] **Resource Management**: Proper cleanup of resources
- [ ] **Access Control**: Appropriate permission checks

### Testing & Maintainability
- [ ] **Test Coverage**: Adequate test coverage for new functionality
- [ ] **Test Readability**: Tests are clear and maintainable
- [ ] **Mocking Strategy**: Appropriate use of mocks and stubs
- [ ] **Integration Points**: Integration points are properly tested

### Documentation
- [ ] **API Documentation**: Public APIs are documented
- [ ] **Usage Examples**: Clear examples of how to use the code
- [ ] **Change Log**: Significant changes are documented
- [ ] **Cross-References**: Related files are cross-referenced

---

## ✅ Enforcement Guidelines

### For AI Agents
1. **Pre-commit Check**: Agents must verify file sizes before committing
2. **Refactoring Triggers**: Files exceeding limits should be refactored
3. **Documentation Updates**: Large documentation should be split
4. **Performance Monitoring**: Monitor build times and bundle sizes

### For Human Developers
1. **Code Review**: File size compliance is part of every review
2. **Refactoring**: Regular refactoring to maintain file size standards
3. **Documentation**: Keep documentation modular and up-to-date
4. **Tooling**: Use linting tools to enforce size limits

---

## ✅ Tools and Automation

### Recommended Tools
- **ESLint/Prettier**: For code formatting and basic size checks
- **Custom Scripts**: For file size monitoring and reporting
- **Git Hooks**: Pre-commit hooks for size validation
- **CI/CD**: Automated size checks in build pipeline

### Monitoring Scripts
```bash
# Check file sizes
find . -name "*.js" -o -name "*.ts" -o -name "*.py" | xargs wc -l | sort -nr

# Check documentation sizes
find . -name "*.md" | xargs wc -l | sort -nr

# Check for oversized files
find . -size +1M -type f
```

---

## ✅ Summary

✅ For kOS:

* ✅ **Source files:** **100–300 lines preferred**, hard limit ~500 lines
* ✅ **Frontend chunks:** **<200KB**
* ✅ **Agent prompts/context:** **<100KB per load**
* ✅ **Semantic chunks for vector store:** **~500 tokens per chunk (~2KB text)**
* ✅ **Docs/specs:** Split anything **>1000 lines**

**Remember**: These are not just guidelines—they are requirements for optimal AI agent performance and maintainable code in the kOS ecosystem. 