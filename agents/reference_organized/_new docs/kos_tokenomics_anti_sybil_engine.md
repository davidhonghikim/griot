anti_sybil_engine:
  objective: "Prevent identity fraud, node farming, and governance manipulation by ensuring unique and trustworthy actors participate in the CHAOS ecosystem."

  identity_verification_layers:
    - method: "Proof-of-Personhood (PoP)"
      description: "Leverages systems like BrightID, Proof of Humanity, or World ID for verifying unique human users without requiring intrusive KYC."
    - method: "ZK-PoH (Zero-Knowledge Proof-of-Humanity)"
      description: "Privacy-preserving cryptographic proofs allowing users to demonstrate uniqueness without revealing identity."
    - method: "Community-Vetted Onboarding"
      description: "New accounts require sponsorship or validation from existing high-reputation users (reputation staking as collateral)."
    - method: "Behavioral Pattern Analysis"
      description: "AI models monitor activity patterns for behavioral anomalies typical of bot farms or Sybil nodes."

  node_verification_mechanisms:
    - method: "Randomized Challenge-Response Protocols"
      description: "Nodes receive periodic randomized integrity tests (e.g., latency checks, storage proofs, agent replay verification)."
    - method: "Proof-of-Uptime"
      description: "Rolling uptime history combined with behavioral audits to validate node consistency."
    - method: "Reputation-Weighted Node Trust"
      description: "Nodes with historically good behavior and uptime are weighted as more trustworthy for network-critical tasks."

  UBI_protection:
    - control: "Rate-Limited Disbursement"
      description: "New identities receive minimal UBI drip for first 30 days until behavior trust signals accumulate."
    - control: "Reputation-Locked UBI Scaling"
      description: "Higher UBI rates only unlocked after achieving trust and uptime thresholds."
    - control: "Automated Outlier Detection"
      description: "Anomaly detection triggers human review or automated penalty (e.g., temporary UBI freeze)."

  governance_protection:
    - method: "Quadratic Voting"
      description: "Reduces raw token voting power for whale or Sybil-driven governance attacks."
    - method: "Reputation-Required Proposal Submission"
      description: "Prevents low-rep, potentially fake accounts from flooding governance with malicious proposals."
    - method: "Anti-Spam Proposal Costs"
      description: "Small non-refundable burn required for each proposal submission to discourage spam."

  detection_and_penalty:
    - detection: "AI-driven behavioral anomaly detection with manual review triggers."
    - penalty: "Reputation slashing, temporary wallet freezing, UBI suspension, and node delisting."
    - escalation: "Confirmed repeat offenders can be community-blacklisted via emergency governance vote."

  transparency_and_auditability:
    - tool: "Public Sybil Risk Dashboard"
      features:
        - "Live anomaly score heatmaps across the network"
        - "Recent identity challenges issued and success rates"
        - "Node verification audit logs"
    - tool: "Sybil Response Transparency Log"
      features:
        - "Every enforced penalty event is publicly logged with anonymized metadata for transparency."

  narrative_flavor:
    sybil_attack_term: "Ghost Echo"
    detection_event: "Signal Distortion"
    penalty_event: "Phantom Collapse"
    verification_pass_event: "True Signal Confirmation"

