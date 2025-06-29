title: "{{node}} Architecture"
version: "1.0"
node: "{{node}}"

high_level_diagram:
  title: "High-Level Diagram"
  image: "../../images/{{node}}_architecture.png"

component_breakdown:
  title: "Component Breakdown"
  components:
    - component: "CoreAdapter"
      responsibility: "Central arbitration logic"
    - component: "ProtocolHandlers"
      responsibility: "Implements each supported protocol"
    - component: "..."
      responsibility: "..."

data_flow:
  title: "Data Flow"
  steps:
    - "Step 1"
    - "Step 2"
    - "Step 3"

error_handling_strategy:
  title: "Error Handling Strategy"
  description: "Describe how faults are detected and mitigated."

performance_considerations:
  title: "Performance Considerations"
  description: "List key performance targets and optimizations." 