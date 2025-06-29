title: "kOS GKM Build Helper Scripts Specification"
version: "1.0"
status: "DRAFT"
date: "2025-06-29"

helper_scripts:
  - name: "build_all.sh"
    description: "Build all TypeScript packages"
    content: |
      #!/bin/bash
      echo "Building all GKM modules..."
      npm install
      npm run build

  - name: "test_all.sh"
    description: "Run all test suites sequentially"
    content: |
      #!/bin/bash
      echo "Running full GKM test suite..."
      npm run test:unit
      npm run test:integration
      npm run test:load
      npm run test:smoke

  - name: "deploy_staging.sh"
    description: "Deploy GKM stack to staging environment"
    content: |
      #!/bin/bash
      echo "Deploying GKM stack to staging..."
      docker-compose -f docker-compose.staging.yml up -d

  - name: "start_dev_cluster.sh"
    description: "Start multi-node GKM dev cluster locally"
    content: |
      #!/bin/bash
      echo "Starting local GKM dev cluster..."
      docker-compose -f docker-compose.yml up -d

  - name: "clean_all.sh"
    description: "Clean up build artifacts and Docker volumes"
    content: |
      #!/bin/bash
      echo "Cleaning build artifacts and docker containers..."
      docker-compose down
      docker system prune -af
      npm run clean

conclusion:
  summary: "These helper script specs provide standard build, test, deploy, and cleanup workflows for all GKM developers and CI/CD systems."

