agent_reward_matrix:
  objective: "Define token reward weightings for different kOS Node Classes (agents) based on contribution type, complexity, and network value impact."

  base_reward_formula:
    formula: "Base Reward = Task Complexity Multiplier x Resource Consumption Factor x Reputation Multiplier x Agent Class Weighting"
    variables:
      - "Task Complexity Multiplier: 1x to 5x scale based on task type"
      - "Resource Consumption Factor: CPU, bandwidth, storage usage"
      - "Reputation Multiplier: 0.8x to 1.5x based on node reputation"
      - "Agent Class Weighting: Class-specific adjustment factor"

  agent_class_weightings:
    griot:
      weighting: "1.3x"
      rationale: "High-value narrative and user-facing content delivery."
    skald:
      weighting: "1.1x"
      rationale: "General-purpose communication and translation services."
    ronin:
      weighting: "1.2x"
      rationale: "Network routing, mesh discovery, and pathfinding services."
    musa:
      weighting: "1.0x"
      rationale: "Creative task execution (e.g., music generation, art, media)."
    hakim:
      weighting: "1.2x"
      rationale: "Knowledge curation, factual retrieval, and research-heavy tasks."
    oracle:
      weighting: "1.3x"
      rationale: "External data feed validation and off-network information injection."
    junzi:
      weighting: "1.2x"
      rationale: "Ethical alignment, moderation, and governance reasoning agents."
    yachay:
      weighting: "1.1x"
      rationale: "Data analytics, forecasting, and modeling tasks."
    sachem:
      weighting: "1.2x"
      rationale: "Decision orchestration and task coordination layers."
    archon:
      weighting: "1.3x"
      rationale: "Critical infrastructure management, security enforcement, and policy execution."
    amauta:
      weighting: "1.1x"
      rationale: "Educational and learning support agents."
    mzee:
      weighting: "1.0x"
      rationale: "Legacy support, archival data management, and history-keeping."

  dynamic_adjustments:
    - trigger: "Network congestion"
      effect: "Temporarily increase reward rates for Ronin and Archon classes to incentivize network stabilization."
    - trigger: "High governance load"
      effect: "Boost rewards for Junzi and Sachem nodes involved in governance decision processing."
    - trigger: "Surge in creative requests"
      effect: "Temporary multiplier for Musa agents to meet demand."

  anti-gaming_controls:
    - "Randomized task sampling for post-task audits"
    - "Penalty for reward farming via fake task generation"
    - "Reputation slashing for detected manipulation"

  transparency:
    - "Public reward distribution dashboards by Node Class"
    - "Daily network-wide agent contribution heatmap"

  narrative_flavor:
    reward_event: "Starseed Tribute"
    penalty_event: "Echo Collapse"
    audit_event: "Signal Reflection"

